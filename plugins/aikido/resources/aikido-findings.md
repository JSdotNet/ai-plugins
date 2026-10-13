---
name: aikido-findings
description: The Aikido MCP prerequisite, which tool each scan mode calls, and how a finding is ordered, reported, and classified as code-fixable or triage-only — shared by every aikido skill and the aikido agent.
---

# Aikido findings

## Prerequisite

Every skill needs the Aikido MCP server (`@aikidosec/mcp`). When its tools are not available,
stop and tell the user to configure it per the Setup section of
[aikido.agent.md](../agents/aikido.agent.md#setup).

## Tools

| Mode | Tool | Use |
|---|---|---|
| `full` (default) | `aikido_full_scan` | SAST and secrets in one pass; the final gate |
| `sast` | `aikido_sast_scan` | code only; the fix-iteration loop, and the re-scan after an `sast` or `iac` fix |
| `secrets` | `aikido_secrets_scan` | credentials only; the re-scan after a `leaked_secret` fix |
| feed | `aikido_issues_list` | open findings, filterable by scope, type, severity |

- A scan reads local files. Run `aikido_full_scan` before finalizing any change to
  authentication, authorization, data validation, cryptography, secrets handling,
  dependencies, or infrastructure configuration.
- Read the feed page by page, incrementing `page` until a page returns fewer than
  `per_page` results.
- Feed scopes: `repo_name`, `cloud_name`, `vm_name`, `domain_name`, `container_name`. A
  `repo_name` must match Aikido's registration exactly — it is case-sensitive; an empty result
  for a repository usually means the name differs.
- Accepted-risk and suppressed findings do not appear in the feed.

## Reporting a finding

Order by severity: **Critical → High → Medium → Low → Info**. Report each finding with
Severity, Type, File, Line, Rule, Description, and Remediation; for a feed finding add its
Aikido ID and title, and use Component in place of File and Line when there is no file.
A finding from a local scan has no feed ID; hand it on as file, line, rule, and type.

## Code-fixable or triage-only

| Class | Types | Owner area |
|---|---|---|
| Code-fixable | `sast`, `leaked_secret`, `iac` | the codebase |
| Triage-only | `open_source`, `malware` | dependency / supply chain |
| Triage-only | `cloud`, `cloud_instance`, `docker_container` | infrastructure / cloud |
| Triage-only | `eol`, `license`, `scm_security` | compliance / lifecycle |
| Triage-only | `surface_monitoring`, `ai_pentest`, `mobile` | runtime / monitoring |

A triage-only finding gets an explanation, its impact, and recommended next steps, never a
code fix.
