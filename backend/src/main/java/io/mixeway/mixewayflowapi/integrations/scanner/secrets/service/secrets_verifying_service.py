def covers(rule, example):
    for attr in rule:
        if example[attr] not in rule[attr]:
            return False
    return True

def verify_secret_against_rules(secret_features, rules):
    feature_names = list(rules[0].keys())
    secret_dict = dict(zip(feature_names, secret_features))
    for rule in rules:
        if covers(rule, secret_dict):
            return True
    return False

def verify_secret(secret_parameters):
    rules = [
        {'length12': {'True'}, 'entropy3.5': {'False', 'True'}, 'keyinvariablename': {'False', 'True'}, 'tokenprefix': {'False', 'True'}, 'naturalword': {'False'}, 'id': {'False'}},
        {'length12': {'False', 'True'}, 'entropy3.5': {'True'}, 'keyinvariablename': {'False', 'True'}, 'tokenprefix': {'False', 'True'}, 'naturalword': {'False'}, 'id': {'False'}}
    ]
    secret_features = [str(x).strip() for x in secret_parameters]
    return verify_secret_against_rules(secret_features, rules)

