# Mixeway Flow — DevSecOps Swiss Army Knife 🔐⚙️

[![License](https://img.shields.io/badge/license-FlowLicense-blue.svg)](LICENSE.md)
![CI: Docker Backend](https://github.com/mixeway/flow/actions/workflows/docker-build-backend.yml/badge.svg)
[![Discord](https://img.shields.io/discord/1272884200323944550)](https://discord.gg/76RY2Y82)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

> **Mixeway Flow** integrates security into your SDLC from day one. It aggregates results from built-in scanners, hooks seamlessly into Git (webhooks), and presents everything in a single, actionable dashboard.
>
> **Under Development:** we are building an AI/LLM-powered verification engine that combines detected findings with extended vulnerability intelligence and then **verifies, in your own source code, whether a specific vulnerability is truly present and exploitable**. The goal is to deliver **100% accurate, properly prioritized information** for engineers and security teams. This feature will be available in a **future release** (see the details below).

Available demonstration: https://flow.mixeway.io

---

## Table of Contents

- [Why Mixeway Flow?](#why-mixeway-flow)
- [How it Works](#how-it-works)
- [What’s Scanned](#whats-scanned)
    - [SAST (Bearer)](#sast-bearer)
    - [SCA (SBOM + OWASP Dependency-Track)](#sca-sbom--owasp-dependency-track)
    - [IaC (KICS)](#iac-kics)
    - [Secret Leaks (gitleaks)](#secret-leaks-gitleaks)
    - [GitLab Repository Scanner (Mixeway ruleset)](#gitlab-repository-scanner-mixeway-ruleset)
- [AI/LLM Verification — Under Development](#aillm-verification--under-development)
- [Quick Start](#quick-start)
- [Initial Setup](#initial-setup)
- [Screenshots](#screenshots)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Community](#community)
- [License](#license)

---

## Why Mixeway Flow?

- **One dashboard to rule them all** — SAST, SCA, IaC, and secret scanning in one place.
- **Zero CI friction** — Git webhooks trigger scans automatically; no complex pipeline wiring needed.
- **Focus on what matters** — Suppress/ignore by context to cut noise and prioritize real risk.
- **Fast time-to-value** — Docker Compose install; be up and reviewing findings in minutes.
- **Built for the next step** — Designed to plug in an AI/LLM verification layer that validates exploitability directly in your codebase.

---

## How it Works

![Process](.github/img/flow_process.jpg)

1. **Register a Git repository** (URL + access token). An initial scan runs on the latest commit of the default branch.
2. **Configure a webhook** (GitHub/GitLab). Each push or PR/MR triggers a scan; events are queued if needed.
3. **Review results** in the unified dashboard and act.

---

## What’s Scanned

Each scan runs transparently from a developer/CI/CD perspective. You get consistent results without extra ceremony.

### SAST (Bearer)
Static analysis of your team’s source code for injection flaws, insecure patterns, and more.  
**Requirements:** none — runs for every change.  
Engine: https://github.com/Bearer/bearer

### SCA (SBOM + OWASP Dependency-Track)
Find known vulnerabilities, licensing issues, and outdated libraries via SBOM ingestion.  
**Requirements:** place `sbom.json` in the repo root to enable SCA scans.  
Engine: https://github.com/DependencyTrack/dependency-track

### IaC (KICS)
Scan Terraform, Kubernetes manifests, Dockerfiles and other templates for misconfigurations.  
**Requirements:** none — runs for every change.  
Engine: https://github.com/Checkmarx/kics


Detect accidentally committed credentials (API keys, tokens, passwords) before they become incidents.  
**Requirements:** none — runs for every change.  
Engine: https://github.com/gitleaks/gitleaks


### Secret Leaks (gitleaks)
Detect accidentally committed credentials (API keys, tokens, passwords) before they become incidents.  
**Requirements:** none — runs for every change.  
Engine: https://github.com/gitleaks/gitleaks

### GitLab Repository Scanner (Mixeway ruleset)
First-class checks for **15+ GitLab repository/security misconfigurations** using our curated ruleset.

**Examples of detections:**
- No or weak **branch protection** on default branches (force-push allowed, missing approvals).
- **Unknown or untrusted runner** registered to the project/group.
- Secrets such as **passwords or tokens stored in GitLab CI/CD variables** without masking/protection.
- Insecure **merge request** settings (missing code review/approvals).
- Public exposure of private projects via **inherited visibility** or incorrect sharing.
- Missing or lax **Protected Tags** / **Protected Branches** configuration.
- **Pipeline triggers** and webhooks with overbroad permissions.
- Artifact exposure / retention misconfigurations.

**How it works:** Mixeway queries repository and project metadata, CI settings, and protection rules to evaluate policy compliance and highlight risky gaps with **actionable remediation tips**.

**Requirements:** repository access with permissions to read project settings and CI/CD configuration (token or PAT).
---

## AI/LLM Verification — Under Development

We are building a complementary **AI-assisted verification layer** that operates on top of your scans to **decide if a vulnerability is actually exploitable in your codebase**. This project combines three pillars:

1. **Detected Findings**  
   Ingests and normalizes SAST, SCA (SBOM), IaC, and secret-scan outputs from Mixeway Flow.

2. **Extended Vulnerability Intelligence**  
   Enriches findings with structured threat intelligence (e.g., CVE metadata, CWE, CVSS, KEV/“known exploited”, EPSS-like probabilities, exploit-exists signals, advisories, references).

3. **Code-Aware AI/LLM Reasoning**  
   Uses large language models and domain-specific rules to analyze **your repository’s source code** and verify whether the conditions required for exploitation are present.
    - Produces a **constraint checklist** for each vulnerability (e.g., reachable sink, untrusted data flow, missing input validation, vulnerable library version & call-site usage).
    - Maps verification to **concrete code locations** (files, functions, lines) and **execution paths**.
    - **Reduces false positives** and upgrades critical issues that meet exploitability conditions.
    - Outputs **actionable remediation** steps aligned to the exact code context.

**Outcome & Goal**
- **Target:** deliver **100% accurate and properly prioritized** results for developers and AppSec.
- **Status:** under active development; will be released as a **future version** of Mixeway Flow.
- **Early Access:** if you’re interested in testing this capability, open an issue or ping us on Discord.

> _Note:_ “100% accurate” reflects the **design goal** for precision and prioritization in verified results; real-world performance will be transparently documented with evaluation datasets when the feature ships.

---

## Quick Start

> **Prereqs:** Docker Hub access + `docker-compose`  
> **Minimum:** 2 CPU, 16 GB RAM, 50 GB disk  
> **Recommended:** 4 CPU, 32 GB RAM, 100 GB disk

### Option A — Clone and run

```bash
git clone https://github.com/Mixeway/flow
cd flow
docker-compose up
```

### Option B — One-file `docker-compose.yml`

```bash
cat <<'EOF' > docker-compose.yml
version: '3.8'

services:
  backend:
    image: mixeway/flow-api:latest
    container_name: flowapi_backend
    ports:
      - "8888:8888"
      - "8443:8443"
    environment:
      SSL: "TRUE"
    volumes:
      - pki_data:/etc/pki
      - dependency_track_data:/root/.dependency-track
    depends_on:
      - flowdb

  flowdb:
    image: postgres:latest
    container_name: flowdb
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: flow
      POSTGRES_USER: flow_user
      POSTGRES_PASSWORD: flow_pass
    volumes:
      - flowdb_data:/var/lib/postgresql/data

  flow:
    image: mixeway/flow:latest
    container_name: flow_frontend
    ports:
      - "443:443"
    volumes:
      - flow_data:/etc/nginx/ssl
    depends_on:
      - backend

volumes:
  flowdb_data:
  flow_data:
  pki_data:
  dependency_track_data:
EOF

docker-compose up
```

**What comes up:**
1. Postgres database
2. Backend with self-signed TLS + Dependency-Track
3. Frontend (nginx)  
   **App URL:** `https://localhost:443`  
   **Default login:** `admin / admin` → you’ll be prompted to change it on first login.

> ⚠️ **Security note:** Self-signed certs are for local trials. For any shared/staging/prod use, replace with proper certificates and rotate the default credentials immediately.

---

## Initial Setup

1. Create a **Team**
2. **Import** your repository
3. **Register** a webhook on your Git provider (GitLab/GitHub)  
   Then start exploring findings in the **Vulnerabilities** view.

---

## Screenshots

- Webhook configuration  
  ![Webhook](.github/img/webhook.png)

- Vulnerabilities overview  
  ![Vulnerabilities](.github/img/vulns.png)

- Scans overview  
  ![Scans](.github/img/flow_scans.png)

---

## Documentation

Under construction — contributors welcome to help outline and write the first docs pages (setup, configuration, SBOM generation tips, troubleshooting).

---

## Contributing

We ❤️ contributions — from bug fixes and docs to new rules and integrations.

- Read **[CONTRIBUTING.md](CONTRIBUTING.md)** to get started
- Look for issues labeled **good first issue** and **help wanted**
- Propose ideas in **Discussions** or on **Discord** (link below)
- Please keep PRs focused and include context, screenshots, and tests where possible

---

## Community

- **Discord:** https://discord.gg/76RY2Y82
- **Issues:** Use GitHub Issues for bugs and feature requests
- **Security:** Please avoid posting sensitive details in public tickets. For suspected vulnerabilities, contact maintainers privately.

---

## License

This project is licensed under the **FlowLicense**. See **[LICENSE.md](LICENSE.md)** for details.
