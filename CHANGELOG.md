# Changelog

All notable changes to this project will be documented in this file.

## [1.2.14] - 2026-11-13

### Introduced
- Pipeline SBOM flow: `POST /api/v1/cicd/scan` starts a scan and returns at once, `POST /api/v1/cicd/sbom` takes the SBOM built by the pipeline and returns the result of both; with `sbomFromPipeline` the scan does not generate its own SBOM and holds its verdict (Bitbucket build status, pull request comment) until the SBOM is uploaded. See `examples/pipeline-sbom`
- Bitbucket build status follows the review in Flow: suppressing or re-activating findings re-posts the status of the last scanned commit, so a failed build turns green without an empty commit
- Changing the Git access token of a single repository from the repository settings; the token is tested against the Git server before it is saved
- Findings are recognised by what was flagged rather than by line number: a finding that moves within its file after an edit keeps its status, suppression, comments, AI verdict and Jira ticket instead of coming back as new
- Jira tickets are closed through multi-step workflows (e.g. Open → Triage → Accepted Risk → Closed): Flow walks the available transitions, fills required resolutions and leaves a comment describing the path taken or the step it could not pass
- Group Jira tickets stay open until every finding they cover is suppressed or removed; each finding closed on the way is commented on and struck through in the ticket description

### Changed
- A suppression applies to the whole repository: findings suppressed on a feature branch stay suppressed on the target branch after merge, and re-activating a finding re-activates it on every branch
- An SBOM uploaded by a pipeline is not subject to the scan throttle; it waits its turn behind the running scan of the repository
- `POST /api/v1/cicd/check` answers `423` while an SBOM uploaded by a pipeline is still waiting to be scanned
- Version of the backend artifact follows the release version

### Fixed
- Loading Jira epics failed because the JQL query was URL-encoded twice; epics now load on both Jira Cloud (`/rest/api/3/search/jql`) and Jira Server / Data Center (`/rest/api/2/search`)
- Suppressed findings showing up as active on the main branch after a merge
- Suppressed findings coming back as new after the file they are in was edited
- Jira tickets left open when the Jira workflow does not allow closing a ticket directly from its current status

## [1.2.13] - 2026-08-05

### Introduced
- Temporary (time-boxed) suppressions: findings can be suppressed for a given number of days and are automatically re-activated once the period expires
- Temporary suppress rules (waivers) with an expiration date; expired rules are deactivated automatically and marked as "Expired" in the Waivers view
- "Suppressed until" date visible in finding details (repo and team views) and in the findings API response
- Daily scheduler (with catch-up on application startup) that re-activates findings and deactivates suppress rules whose expiration date has passed

### Changed
- Removed the background scheduler that periodically analyzed vulnerability constraints via AI; constraints are now updated only on vulnerability insert/update events or on demand

## [1.2.12] - 2025-12-14

### Intrduced
- Update dependency track to 2.13.6

## [1.2.11] - 2025-11-13

### Intrduced
- Added gitea support

## [1.2.10] - 2025-10-29

### Fixed
- Problem with creating scanInfo entity when commit id was unable to be set
- Problem with number of secret findings associated with scaninfo 

## [1.2.9] - 2025-10-27

### Introduced
- Suppressing finding will make finding suppressed across new branches

### Fixed
- Suppress now working in both coderepo and team context

## [1.2.8] - 2025-10-21

### Introduced
- Possibility to export results to XLSX
- Possibility to add comment to suppress rule

### Fixed
- ScanInfo created when limit is met
- Scan Scheduler that run every 8 hours
- Handing of scans status


## [1.2.7] - 2025-09-18

### Introduced
- Possibility to rename repositories

### Fixed
- Scan scheduler to rescan old scans
- removed Last scan from the team view which was not correct
- Properly update scan info when scan is for the same branch/commitid

## [1.2.6] - 2025-07-30

### Introduced
- Entire Git integration - synchronization automatically with all repositories
- Possibility to change team from the dashboard
- Urgent and Notable badges in repo details

### Fixed
- Filtering in show-repo
- Location links in show-repo
- Collision when webhook event have same repository ID across multiple providers


## [1.2.5] - 2025-07-01

### Introduced
- ZAP integration
- Possibility to create DAST Scans from Mixeway Flow


## [1.2.4] - 2025-06-12

### Introduced
- Gitlab security posture management
  
## [1.2.3] - 2025-05-07

### Introduced
- Multitenancy

## [1.2.2] - 2025-04-15

### Introduced
- Path regex for suppress rules

## [1.2.1] - 2025-03-24

### Fixed
- Team statuses
- Team lazy loading during push event

## [1.2.0] - 2025-03-07

### Introduced
- new Statistic dashboard component
- Integration with wiz cloud security posture management
- New redesigned dashboards
- new statistic dashboard

### Fixed
- Team delete


## [1.1.1] - 2025-02-04

### Introduced
- Possibility for CodeRepo to change teams
- Settings preparation to Wiz integration

## [1.1.0] - 2025-01-31

### Introduced
- Filtering on the Team management
- Filtering on the Manage Users
- Finding commenting system
- Links to the code to repo from the finding 

## [1.0.7] - 2024-12-12

### Introduced
- New API to get Threat Intell for a team

## [1.0.6] - 2024-11-21

### Fixed
- Solved performance issues for thereat intel module
- Fixed link with merge request webhook comment
- Adjusted merge request comment text

## [1.0.5] - 2024-11-05

### Introduced
- added selection of displayed rows in tables in show repository view
- added and optimized the way of how scan info is displayed
- added possibility to filter scan infos for branch or commit id

### Fixed
- Proper throttling and wait between tests executed via webhook
- scan info default sort is date

## [1.0.4] - 2024-11-02

### Introduced
- Change threat intel from SQL Query to view in order to increase the performance
- Possibility to add Remote identifier for the teams

### Fixed
- Logging when webhook received for project that is not onboarded yet instead of stacktrace
- Problem with link generation on threat intelligence view


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

