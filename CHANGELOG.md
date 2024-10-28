# Changelog

All notable changes to this project will be documented in this file.

## [1.0.3] - 2024-09-25

### Introduced
- Bulk action on findings
- Possibility to define supress rules


## [1.0.2] - 2024-09-25

### Introduced
- Introduced Vulnerability Threat Detection dashboard and KEV downloading


## [1.0.1] - 2024-09-25

### Changed
- TEAM_MANAGER role can run manual scan via GUI and via API
- Enlarged parallel scan pool from 5 to 15
- Provided `pipreqs` to enchance python support for SCA
- It is visible when scan is currently running


### Fixed
- Performance issues that occurs while having 300+ imported repositories on dashboard and component view



## [1.0.0] - 2024-09-25

### Changed
- Merge request and Pull Request commenting
- Full Webhook support for both GitLab and GitHub
- It is visible when scan is currently running
- Added Possibility to run scan manually form UI
- Possibility to generate sbom on the fly without needing it to be existing in the repository

### Fixed
- Filtering main table with repos now work properly
- Problem related with scans done with Bearer due to missing rules
- Race condition during component creation
- Problem with setting status of a scan when something wrong


## [0.9.2] - 2024-09-02

### Changed
- GitHub Integration - possibility to import by on

### Fixed
- Problem with too low limits of length for data such as vulnerability name or component name
- Problem with importing BULK Repositories: table contains all gitlab projects including project without membership but public. Current version shows only project inserted accesstoken is member of.

## [0.9.1] - 2024-08-26
### Changed
- SSO integration introduced
- Adjusted scripts to support SSO
- Increased efficiency of running scans in parallel 

## [0.9.0] - 2024-08-13
### Changed
- Release of initial version - beta
- Import bulk repositories
- Import single repository
- Perform SAST, SCA, Secret and IAC scans
- Manage Teams
- Manage Users
- Show statistics
- Manage vulnerabilities and components

