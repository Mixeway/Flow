#!/usr/bin/env bash
# Mixeway Flow: synchroniczny skan repozytorium (Bitbucket/Git) + bramka jakości Urgent/Notable.
# Wywołanie HTTP wyłącznie przez curl; JSON parsuje jq.
#
# Wymagane zmienne środowiskowe:
#   FLOW_BASE_URL  — np. https://flow.example.com (bez końcowego /)
#   FLOW_API_KEY   — klucz API użytkownika należącego do zespołu powiązanego z repo w Flow
#   FLOW_UI_DOMAIN — host UI używany w linku do szczegółów (jak w GitLab CI DTO), np. flow.example.com
#
# Repozytorium i gałąź (dowolna z poniższych; skrypt wybiera pierwsze niepuste):
#   FLOW_REPO_URL / BITBUCKET_GIT_HTTP_ORIGIN / bamboo_planRepository_1_repositoryUrl / ...
#   FLOW_BRANCH / bamboo_planRepository_branchName / BITBUCKET_BRANCH / ...
#
# Bramka:
#   URGENT_FAIL_THRESHOLD — liczba całkowita X (domyślnie 1). Przy urgent >= X → exit 2 (fail).
#   Poniżej progu: urgent > 0 i notable > 0 → exit 0 z komunikatem WARNING (ostrzeżenie w logu).
#   W pozostałych przypadkach → exit 0 SUCCESS.

set -euo pipefail

URGENT_FAIL_THRESHOLD="${URGENT_FAIL_THRESHOLD:-1}"
FLOW_BASE_URL="${FLOW_BASE_URL:?Ustaw FLOW_BASE_URL}"
FLOW_API_KEY="${FLOW_API_KEY:?Ustaw FLOW_API_KEY}"
FLOW_UI_DOMAIN="${FLOW_UI_DOMAIN:?Ustaw FLOW_UI_DOMAIN}"

pick_first_non_empty() {
  for v in "$@"; do
    if [[ -n "${v:-}" ]]; then
      printf '%s' "$v"
      return 0
    fi
  done
  return 1
}

# Normalizacja git@host:path → https://host/path (pomaga dopasować URL do tego w Flow)
normalize_repo_url() {
  local u="$1"
  if [[ "$u" =~ ^git@([^:]+):(.+)$ ]]; then
    printf 'https://%s/%s' "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}"
  elif [[ "$u" =~ ^ssh://git@([^/]+)/(.+)$ ]]; then
    printf 'https://%s/%s' "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}"
  else
    printf '%s' "$u"
  fi
}

REPO_RAW="$(pick_first_non_empty \
  "${FLOW_REPO_URL:-}" \
  "${bamboo_planRepository_1_repositoryUrl:-}" \
  "${bamboo_planRepository_repositoryUrl:-}" \
  "${BITBUCKET_GIT_HTTP_ORIGIN:-}" \
  "${bamboo_repository_url:-}" \
  || true)"

BRANCH_RAW="$(pick_first_non_empty \
  "${FLOW_BRANCH:-}" \
  "${bamboo_planRepository_branchName:-}" \
  "${bamboo_planRepository_branch:-}" \
  "${BITBUCKET_BRANCH:-}" \
  "${bamboo_repository_branch_name:-}" \
  || true)"

if [[ -z "${REPO_RAW}" || -z "${BRANCH_RAW}" ]]; then
  echo "ERROR: Nie udało się ustalić URL repozytorium lub gałęzi. Ustaw FLOW_REPO_URL i FLOW_BRANCH (lub zmienne Bamboo/Bitbucket)." >&2
  exit 1
fi

REPO_URL="$(normalize_repo_url "$REPO_RAW")"

for cmd in curl jq; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "ERROR: Brak polecenia: $cmd" >&2; exit 1; }
done

OUT_JSON="${FLOW_SCAN_JSON:-./flow-scan-result.json}"
mkdir -p "$(dirname "$OUT_JSON")"

BODY="$(jq -nc --arg ru "$REPO_URL" --arg br "$BRANCH_RAW" --arg dom "$FLOW_UI_DOMAIN" \
  '{repoUrl: $ru, branch: $br, domain: $dom}')"

echo "======== Mixeway Flow: uruchamianie skanu (curl) ========"
echo "Repo:  $REPO_URL"
echo "Branch: $BRANCH_RAW"
echo "Próg fail (urgent >= X): X=$URGENT_FAIL_THRESHOLD"
echo "---------------------------------------------------------"

HTTP_CODE="$(curl -sS -o "$OUT_JSON" -w '%{http_code}' -X POST \
  "${FLOW_BASE_URL}/api/v1/gitlabcicd/run" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: ${FLOW_API_KEY}" \
  -d "$BODY")"

echo "HTTP: $HTTP_CODE"
if [[ "$HTTP_CODE" != "200" ]]; then
  echo "ERROR: Flow API zwróciło kod $HTTP_CODE. Treść:" >&2
  cat "$OUT_JSON" >&2 || true
  exit 1
fi

URGENT="$(jq '.urgentFindingsDetails | length' "$OUT_JSON")"
NOTABLE="$(jq '.notableFindingsDetails | length' "$OUT_JSON")"
TOTAL="$(jq '.totalNumberOfFindings' "$OUT_JSON")"
LINK="$(jq -r '.linkToScanDetails // empty' "$OUT_JSON")"

echo ""
echo "=================== Wynik skanowania ===================="
printf '%20s %s\n' "Total findings:" "$TOTAL"
printf '%20s %s\n' "Urgent:" "$URGENT"
printf '%20s %s\n' "Notable:" "$NOTABLE"
if [[ -n "$LINK" ]]; then
  printf '%20s %s\n' "Link do Flow:" "$LINK"
fi
echo "========================================================="

echo ""
echo "---------------- Urgent (skrót) ----------------"
jq -r '.urgentFindingsDetails[] | "• [\(.source)] \(.name) @ \(.location)"' "$OUT_JSON" 2>/dev/null | head -n 50
URG_LINES="$(jq -r '.urgentFindingsDetails | length' "$OUT_JSON")"
if [[ "$URG_LINES" -gt 50 ]]; then
  echo "... (więcej w $OUT_JSON i w UI Flow)"
fi

echo ""
echo "---------------- Notable (skrót) --------------"
jq -r '.notableFindingsDetails[] | "• [\(.source)] \(.name) @ \(.location)"' "$OUT_JSON" 2>/dev/null | head -n 50
NOT_LINES="$(jq -r '.notableFindingsDetails | length' "$OUT_JSON")"
if [[ "$NOT_LINES" -gt 50 ]]; then
  echo "... (więcej w $OUT_JSON i w UI Flow)"
fi

echo ""
echo "=================== Bramka jakości ======================"

if [[ "$URGENT" -ge "$URGENT_FAIL_THRESHOLD" ]]; then
  echo "STATUS: FAILED — liczba Urgent ($URGENT) >= próg ($URGENT_FAIL_THRESHOLD)"
  echo "Pełny JSON: $OUT_JSON"
  exit 2
fi

if [[ "$URGENT" -gt 0 && "$NOTABLE" -gt 0 ]]; then
  echo "STATUS: WARNING — Urgent ($URGENT) < próg ($URGENT_FAIL_THRESHOLD), ale są zarówno Urgent, jak i Notable ($NOTABLE)."
  echo "          Bamboo: job można oznaczyć jako ostrzeżenie w logu; standardowy wynik builda pozostaje Successful, jeśli ten krok kończy się exit 0."
  echo "Pełny JSON: $OUT_JSON"
  exit 0
fi

echo "STATUS: SUCCESS — bramka przeszła (urgent=$URGENT, notable=$NOTABLE)."
echo "Pełny JSON: $OUT_JSON"
exit 0
