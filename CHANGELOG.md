# Changelog

All notable changes to this project will be documented in this file.


## [0.9.2] - not known yet

### Changed
- GitHub Integration - possibility to import by on

### Fixed
- Problem with too low limits of length for data such as vulnerability name or component name
- Problem with importing BULK Repositories: table contains all gitlab projects including project without membership but public. Current version shows only project inserted accesstoken is member of.

## [0.9.1] - 2024-08-263
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

