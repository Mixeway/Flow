# Skan Flow z SBOM-em budowanym w pipeline (Bitbucket i inne CI)

Pipeline uruchamia skan w Flow, w tym samym czasie buduje aplikację i generuje SBOM, wgrywa go do Flow i dostaje wynik obejmujący oba: skan kodu (SAST, IaC, sekrety) oraz zależności z wgranego SBOM-u.

Kiedy warto: SBOM zbudowany w pipeline (po pobraniu zależności, z właściwym profilem builda) jest dokładniejszy niż ten, który Flow generuje sam z kodu źródłowego.

## Przebieg

1. **Start skanu** — `POST /api/v1/cicd/scan` z `sbomFromPipeline: true`. Odpowiedź wraca od razu, Flow skanuje w tle. Flow nie generuje wtedy własnego SBOM-u i wstrzymuje werdykt do czasu wgrania SBOM-u.
2. **Build i SBOM** — pipeline robi swoje i generuje SBOM w formacie CycloneDX JSON.
3. **Upload SBOM-u** — `POST /api/v1/cicd/sbom`. Żądanie czeka, aż skończy się skan z kroku 1 i skan SBOM-u, i zwraca podsumowanie.

Na Bitbuckecie status builda **Flow Security** dla commita jest w tym czasie „in progress” („waiting for the SBOM from the pipeline”), a po kroku 3 zmienia się na wynik końcowy. Komentarz w pull requeście też pojawia się dopiero po kroku 3.

## Wymagania

- Repozytorium jest dodane do Flow. Adres może różnić się od zarejestrowanego schematem (`http`/`https`), końcówką `.git`, końcowym `/` lub użytkownikiem w adresie.
- Klucz API (`X-API-KEY`) należy do użytkownika z zespołu, do którego przypisane jest repozytorium (albo administratora).

## API

### `POST /api/v1/cicd/scan`

```json
{
  "repoUrl": "https://bitbucket.org/workspace/repo",
  "branch": "feature/x",
  "commitId": "0a1b2c3d…",
  "pullRequestId": 12,
  "sbomFromPipeline": true
}
```

`commitId` i `pullRequestId` są opcjonalne (bez `commitId` skanowany jest najnowszy commit gałęzi).

| Odpowiedź | Znaczenie |
|---|---|
| `202 {"status":"started"}` | skan ruszył |
| `202 {"status":"queued"}` | skan czeka za innym skanem lub analizą AI tego repozytorium |
| `429 {"status":"throttled"}` | repozytorium było skanowane w ciągu ostatnich 10 minut — nowy skan nie ruszył; SBOM nadal można wgrać |
| `404` | brak repozytorium o tym adresie albo brak dostępu |

### `POST /api/v1/cicd/sbom` (multipart)

| Pole | Opis |
|---|---|
| `file` | SBOM w formacie CycloneDX JSON, do 50 MB |
| `repoUrl`, `branch` | jak wyżej |
| `commitId`, `pullRequestId` | opcjonalne; domyślnie brane ze skanu z kroku 1 |
| `domain` | opcjonalny host do linku w wyniku; domyślnie adres Flow |
| `wait` | domyślnie `true`; `false` = nie czekaj na wynik |

| Odpowiedź | Znaczenie |
|---|---|
| `200` + JSON | wynik — ten sam format co `POST /api/v1/gitlabcicd/run` (`urgentFindingsDetails`, `notableFindingsDetails`, `totalNumberOfFindings`, `linkToScanDetails`) |
| `202 {"status":"accepted"}` | SBOM przyjęty (`wait=false`) |
| `202 {"status":"running"}` | po 20 minutach skan jeszcze trwa — wynik będzie w `POST /api/v1/cicd/check` |
| `422` | SBOM-u nie udało się przeskanować (status builda na Bitbuckecie: failed) |
| `400` | brak pliku, plik za duży albo nie jest JSON-em |

Upload nie podlega 10-minutowemu limitowi skanów — ustawia się w kolejce za trwającym skanem repozytorium.

## Przykład: Bitbucket Pipelines

Zmienne repozytorium (zabezpieczone): `FLOW_BASE_URL`, `FLOW_API_KEY`.

```yaml
pipelines:
  default:
    - step:
        name: Build + Flow Security
        script:
          # 1. Start skanu - wraca od razu
          - >
            curl -sS -X POST "$FLOW_BASE_URL/api/v1/cicd/scan"
            -H "X-API-KEY: $FLOW_API_KEY" -H "Content-Type: application/json"
            -d "{\"repoUrl\":\"$BITBUCKET_GIT_HTTP_ORIGIN\",\"branch\":\"$BITBUCKET_BRANCH\",\"commitId\":\"$BITBUCKET_COMMIT\",\"pullRequestId\":${BITBUCKET_PR_ID:-null},\"sbomFromPipeline\":true}"

          # 2. Build i SBOM (dowolne narzędzie dające CycloneDX JSON)
          - ./mvnw -q package
          - npx --yes @cyclonedx/cdxgen -o bom.json

          # 3. Upload SBOM-u - czeka na wynik obu skanów
          - >
            curl -sS -o flow-result.json -w "%{http_code}" -X POST "$FLOW_BASE_URL/api/v1/cicd/sbom"
            -H "X-API-KEY: $FLOW_API_KEY"
            -F "file=@bom.json" -F "repoUrl=$BITBUCKET_GIT_HTTP_ORIGIN"
            -F "branch=$BITBUCKET_BRANCH" -F "commitId=$BITBUCKET_COMMIT" > flow-http-code

          # 4. Bramka: fail przy co najmniej jednej podatności Urgent
          - test "$(cat flow-http-code)" = "200" || { cat flow-result.json; exit 1; }
          - URGENT=$(jq '.urgentFindingsDetails | length' flow-result.json)
          - echo "Flow - Urgent $URGENT, Notable $(jq '.notableFindingsDetails | length' flow-result.json), $(jq -r .linkToScanDetails flow-result.json)"
          - test "$URGENT" -eq 0
```

## Uwagi

- Jeśli repozytorium ma też webhook Bitbucketa do Flow, skan po pushu rusza sam i krok 1 dostanie `429`. Flow wygeneruje wtedy własny SBOM, a wgrany z pipeline zastąpi jego wynik — efekt końcowy jest ten sam, tylko bez wstrzymanego werdyktu.
- Skany uruchamiane poza pipeline (harmonogram, webhook, ręcznie z UI) nadal generują SBOM po stronie Flow i nadpisują wyniki SCA gałęzi do następnego uploadu z pipeline.
- Jeśli po `sbomFromPipeline: true` SBOM nie zostanie wgrany, status builda na Bitbuckecie zostaje „in progress”.
