## Prerequisites

* git configured with proxy etc.
* gitleaks command avaliable - https://github.com/gitleaks/gitleaks
* KICS command with by default link do queries - https://github.com/Checkmarx/kics (require to contain asset location to be changed in application.properties)
* bearer command with by default link to rules - https://github.com/Bearer/bearer it is required also to get bearer rules https://github.com/Bearer/bearer-rules
* have postgress db avaliable: eg. `docker run --name my-postgres-container -e POSTGRES_DB=flow -e POSTGRES_USER=flow_user -e POSTGRES_PASSWORD=flow_pass -p 5432:5432 -d postgres:latest`

## application.properties
 change to your needs

## First login
`admin:admin` - then forced change

### debug postgresql
```shell
docker run --name flow_db -e POSTGRES_PASSWORD=flow_pass -e POSTGRES_USER=flow_user -e POSTGRES_DB=flow -p 5433:5432 -v pgdata:/var/lib/postgresql/data -d postgres
```