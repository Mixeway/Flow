# Bamboo + Bitbucket — skan Mixeway Flow (curl)

Ten katalog zawiera przykład **Bamboo Specs (YAML)** oraz skrypt uruchamiany w zadaniu (Script task), który:

1. **Uruchamia skan** repozytorium Bitbucket (URL i gałąź z kontekstu builda Bamboo) przez **`curl`** do API Flow.
2. **Czeka na zakończenie skanu** — endpoint `POST /api/v1/gitlabcicd/run` w Flow wykonuje skan **synchronicznie** i dopiero potem zwraca JSON z podsumowaniem.
3. **Wypisuje wyniki** (łącznie, Urgent, Notable, skrót list, link do UI) do logu builda — to jest najbardziej „natywny” sposób w Bamboo bez dodatkowych pluginów.
4. **Stosuje bramkę jakości** (konfigurowalny próg **X** dla liczby **Urgent**):
   - `urgent >= X` → **fail** joba (exit `2` — możesz w Bamboo mapować inne kody jak potrzebujesz),
   - `urgent < X` **oraz** `urgent > 0` **oraz** `notable > 0` → **ostrzeżenie** wyłącznie w logu, job **Successful** (exit `0`) — Bamboo standardowo nie ma stanu „Warning” dla całego builda,
   - pozostałe przypadki → **success** (exit `0`).

## Wymagania w Flow

- Repozytorium jest **onboardowane** w Flow (ten sam URL co w Bamboo — zwykle `https://bitbucket.org/workspace/repo.git`).
- **Klucz API** (`X-API-KEY`) należy do użytkownika w **tym samym zespole**, który jest powiązany z repozytorium w Flow (taka sama logika jak w integracji GitLab CI w backendzie).

## Zmienne Bamboo (zalecane)

Ustaw jako zmienne planu / projektu (wartości wrażliwe oznacz jako **password**):

| Zmienna | Opis |
|--------|------|
| `FLOW_BASE_URL` | Bazowy URL instancji Flow, np. `https://flow.firma.pl` |
| `FLOW_API_KEY` | Klucz API użytkownika Flow |
| `FLOW_UI_DOMAIN` | Host używany w polu `linkToScanDetails` w odpowiedzi (np. `flow.firma.pl`) |
| `URGENT_FAIL_THRESHOLD` | Próg **X** (liczba całkowita, domyślnie `1` w skrypcie) |

URL repozytorium i gałąź są brane ze **zmiennych Bamboo dla repozytorium połączonego z Bitbucket** (np. `bamboo_planRepository_1_repositoryUrl`, `bamboo_planRepository_branchName`). Jeśli Twoja wersja Bamboo używa innych nazw, nadpisz ręcznie:

- `FLOW_REPO_URL` — pełny HTTPS clone URL (zgodny z Flow),
- `FLOW_BRANCH` — nazwa gałęzi.

Skrypt normalizuje adresy w formie `git@bitbucket.org:org/repo.git` do `https://bitbucket.org/org/repo`.

## Pliki

- `scripts/run-flow-security-scan.sh` — `curl` + `jq`, bramka, czytelny log.
- `bamboo-specs/bitbucket-security-scan.yaml` — szkic planu Bamboo (dostosuj `project-key` i ewentualnie klucz planu).

## Integracja z katalogiem repozytorium

Najprościej: **dodaj ten katalog** (`examples/bamboo`) do repozytorium, które buduje Bamboo, włącz **checkout**, a w Script task uruchom:

```bash
bash "${bamboo.build.working.directory}/examples/bamboo/scripts/run-flow-security-scan.sh"
```

Zmienna `${bamboo.build.working.directory}` jest rozwijana przez Bamboo przed uruchomieniem powłoki. W starszych instalacjach nazewnictwo bywa inne — wtedy użyj ścieżki względnej po checkoutcie (np. `bash examples/bamboo/scripts/run-flow-security-scan.sh`).

## Wyniki „natywnie” w Bamboo

- **Log zadania** — tabela podsumowania i listy Urgent/Notable (domyślne zachowanie).
- Opcjonalnie w koncie Bamboo dodaj **artifact**: plik `flow-scan-result.json` ze ścieżki roboczej (skrypt zapisuje domyślnie `./flow-scan-result.json`), żeby wynik był do pobrania z zakładki **Artifacts**.

## Samo `curl` (ręczne / szybki test)

Nadaj wartości i wywołaj:

```bash
FLOW_BASE_URL="https://flow.example.com"
FLOW_API_KEY="twoj-klucz-api"
FLOW_UI_DOMAIN="flow.example.com"
REPO_URL="https://bitbucket.org/workspace/repo.git"
BRANCH="main"

curl -sS -X POST "${FLOW_BASE_URL}/api/v1/gitlabcicd/run" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: ${FLOW_API_KEY}" \
  -d "$(jq -nc --arg ru "$REPO_URL" --arg br "$BRANCH" --arg dom "$FLOW_UI_DOMAIN" \
        '{repoUrl: $ru, branch: $br, domain: $dom}')"
```

Odpowiedź to JSON m.in. z polami `totalNumberOfFindings`, `urgentFindingsDetails`, `notableFindingsDetails`, `linkToScanDetails`.

Bramkę możesz policzyć np.:

```bash
RESPONSE="$(curl -sS -X POST ...)"   # jak wyżej
echo "$RESPONSE" | jq '{urgent: (.urgentFindingsDetails|length), notable: (.notableFindingsDetails|length)}'
```

## Mapowanie exit code → wynik Bamboo

Domyślnie skrypt zwraca:

- `0` — sukces lub ostrzeżenie (log zawiera wyraźny komunikat `STATUS: WARNING`),
- `1` — błąd konfiguracji / brak narzędzi / błąd HTTP ≠ 200,
- `2` — **fail bramki** (za dużo Urgent).

W Bamboo możesz w **Miscellaneous** zadania włączyć „Ignore failure” tylko dla ostrzeżeń — wtedy lepiej rozdzielić na dwa joby albo zmodyfikować skrypt; standardowo jeden job z `exit 2` oznacza **Failed build**, co odpowiada wymaganiu „fail job” przy przekroczeniu progu.
