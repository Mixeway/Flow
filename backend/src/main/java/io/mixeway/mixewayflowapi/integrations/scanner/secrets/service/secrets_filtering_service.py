import json
import re
import sys

from nostril_detector import nonsense_detector
import enchant
from secrets_verifying_service import verify_secret


def import_json(json_path):
    try:
        with open(json_path, "r", encoding="utf-8") as file:
            raw_json = file.read()
            cleaned_json = re.sub(r'(\\*)\\n|(\r?\n)', '', raw_json)
            secrets_file = json.loads(cleaned_json)
            return secrets_file
    except Exception:
        print(f"[SecretsFilteringService] Error loading secrets.json.")
        return None

def return_secrets_info(json_path):
    try:
        secrets_info = []
        secrets_file = import_json(json_path)

        if secrets_file is None:
            return None

        for secret in secrets_file:
            secret_info = []

            secret_value = secret["Secret"] if isinstance(secret, dict) and "Secret" in secret else secret
            match_value = secret["Match"] if isinstance(secret, dict) and "Match" in secret else secret
            entropy_value = float(secret["Entropy"] if isinstance(secret, dict) and "Entropy" in secret else secret)
            entropy_value = round(entropy_value, 2)

            secret_info.append(get_secret_value(secret_value))
            secret_info.append(get_secret_key(match_value))
            secret_info.append(entropy_value)

            secrets_info.append(secret_info)
        return secrets_info
    except Exception:
        print(f"[SecretsFilteringService] Error loading secrets from secrets.json.")
        return None

def get_secret_value(secret):
    pattern = r"-----BEGIN\s*[A-Z0-9 ]+-----\s*(.*?)\s*-----END\s*[A-Z0-9 ]+----+"
    match = re.search(pattern, secret.strip(), re.DOTALL)
    if match:
        content = ''.join(match.group(1).split())
        return content
    else:
        return secret

def get_secret_key(match):
    pattern_pem = r"-----BEGIN\s*([A-Z0-9 ]+)\s*-----"
    pattern_colon = r"^\s*([^=]+?)\s*:"
    pattern_equal = r"^\s*([^=]+?)\s*="

    secret = match.strip()

    regex_match = re.search(pattern_pem, secret)
    if regex_match:
        return regex_match.group(1).strip()

    regex_match = re.search(pattern_colon, secret)
    if regex_match:
        return regex_match.group(1).strip()

    regex_match = re.search(pattern_equal, secret)
    if regex_match:
        return regex_match.group(1).strip()

    return None

def is_secret_longer_or_equal_12_signs(secret):
    if (len(secret) >= 12):
        return True
    else:
        return False

def is_entropy_bigger_than_35(entropy):
    if (entropy >= 3.5):
        return True
    else:
        return False

def is_key_in_variable(match):
    patterns = ["key", "pass", "token", "secret", "priv"]

    if match is None:
        return False

    containsPattern = False
    for pattern in patterns:
        if pattern in match.lower().strip():
            containsPattern = True
            break
    return containsPattern

def is_prefix_in_token(secret):
    patterns = ["ghp_", "gho_", "ghu_", "ghs_", "ghr_", "glpat-", "sk-", "AKIA", "ASIA", "AIza", "AIDA", "ya29.", "glp", "MII"]

    containsPattern = False
    for pattern in patterns:
        if secret.startswith(pattern):
            containsPattern = True
            break
    return containsPattern

def is_natural_word(secret):
    spellchecker_result = False
    words = re.findall(r"[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+", secret)
    for word in words:
        if enchant.Dict("en_US").check(word) and len(word) > 3:
            spellchecker_result = True
            break

    nonsense_detector_result = False
    if len(secret) > 5:
        try:
            nonsense_detector_result = not nonsense_detector.nonsense(secret)
        except ValueError:
            nonsense_detector_result = False

    if nonsense_detector_result and spellchecker_result:
        return True
    else:
        return False

def is_id_in_variable(match):
    if match is None:
        return False

    if "id" in match.lower():
        return True
    else:
        return False
def verify_secret_parameters(secret_info):
    # print(secret_info)
    return is_secret_longer_or_equal_12_signs(secret_info[0]),is_entropy_bigger_than_35(secret_info[2]),is_key_in_variable(secret_info[1]),is_prefix_in_token(secret_info[0]),is_natural_word(secret_info[0]),is_id_in_variable(secret_info[1])

def filter_secrets(json_path):
    secrets_info = return_secrets_info(json_path)
    result = []

    for secret in secrets_info:
        secret_parameters = verify_secret_parameters(secret)
        result.append(verify_secret(secret_parameters))
    return result

if __name__ == '__main__':
    json_path = sys.argv[1] if len(sys.argv) > 1 else "secrets.json"

    print(filter_secrets(json_path))