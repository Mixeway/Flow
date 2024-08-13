## Prerequisites

* git configured with proxy etc.
* gitleaks command avaliable - https://github.com/gitleaks/gitleaks
* KICS command with by default link do queries - https://github.com/Checkmarx/kics (require to contain asset location to be changed in application.properties)
* bearer command with by default link to rules - https://github.com/Bearer/bearer it is required also to get bearer rules https://github.com/Bearer/bearer-rules
* have postgress db avaliable: eg. `docker run --name my-postgres-container -e POSTGRES_DB=flow -e POSTGRES_USER=flow_user -e POSTGRES_PASSWORD=flow_pass -p 5432:5432 -d postgres:latest`

## application.properties
 change to your needs
 
```properties
proxy.host=126.179.0.206
proxy.port=9090

kics.queries.dir=/opt/tools/kics/assets/queries
bearer.queries.dir=/opt/tools/bearer-rules/rules
```

## First login
`admin:admin` - then forced change
