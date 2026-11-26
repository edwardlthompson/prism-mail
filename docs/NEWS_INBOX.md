# News Inbox

Auto-collected inbox of news, upstream updates, security fixes, and ideas relevant to this repo, appended daily by News Bot.
A Cursor planning agent should review these items and fold the useful ones into BUILD_PLAN; entries are append-only, newest at the bottom.


## 2026-11-13

**News and updates**

- Wave of npm malware posing as MCP/agent tools (e.g. karma365-mcp, @rclaude/darwin-arm64, helper-agent); advisories say treat machines as compromised. [source](https://github.com/advisories/GHSA-72xc-q3v8-7grp)
- GitHub will pause Dependabot alerts on repos with no activity in the past year starting Dec 8, 2026; a push re-enables them. [source](https://github.blog/changelog/2026-11-10-dependabot-alerts-will-pause-on-inactive-repositories)
- MCP reference servers v2.4.0 fix 6 vulnerabilities (filesystem symlink escapes, git config command execution, fetch). [source](https://github.com/modelcontextprotocol/servers/releases/tag/v2.4.0)
- Modern Web Guidance 1.0 from Chrome, Edge, Firefox and MDN: an official coding-agent skill plus `legacy-scan` that flags legacy JS/CSS. [source](https://github.com/GoogleChrome/modern-web-guidance/releases/tag/v1.0.0)
- GitHub Blog guide to portable agent skills (SKILL.md that runs across agents). [source](https://github.blog/ai-and-ml/github-copilot/build-once-run-on-any-agent-a-practical-guide-to-agent-skills/)
- 'Enforcement over alignment': enforce must-happen agent rules with hooks, schemas, and state gates instead of more prompting. [source](https://blog.imjackofitall.com/posts/2026-11-12/)
- Issue types and issue fields (Priority, Effort, dates) are now available on personal-account repos. [source](https://github.blog/changelog/2026-11-11-issue-types-and-fields-are-available-for-personal-accounts)
- uv 0.13.8 (credential files now 0600, Python 3.16.0a2) and Ruff 0.17.5 (autofix bug fixes) released. [source](https://github.com/astral-sh/uv/releases/tag/0.13.8)

**Tasks for the planning agent**

- [x] Pin and allowlist MCP server packages in templates — Agent/MCP package names are an active npm malware lure, so unpinned `npx -y` in descendant configs is a real risk. Label: `[AGENT][LOCAL]` · Priority: P1 · https://github.com/advisories/GHSA-72xc-q3v8-7grp (synced to BUILD_PLAN)
- [x] Document Dependabot inactive-repo pause in the template — Descendants that go quiet lose Dependabot alerts from Dec 8 unless they get a push. Label: `[AGENT][LOCAL]` · Priority: P2 · https://github.blog/changelog/2026-11-10-dependabot-alerts-will-pause-on-inactive-repositories (synced to BUILD_PLAN)
- [x] Audit template MCP examples for filesystem/git/fetch servers — If any descendant uses those reference servers, it must move to the patched v2.4.0 releases. Label: `[AGENT][LOCAL]` · Priority: P2 · https://github.com/modelcontextprotocol/servers/releases/tag/v2.4.0 (synced to BUILD_PLAN)
- [ ] Offer Modern Web Guidance as a skill for web descendants — Gives web children an official, versioned agent skill and a legacy-pattern scan. Label: `[AGENT][LOCAL]` · Priority: P3 · https://github.com/GoogleChrome/modern-web-guidance/releases/tag/v1.0.0
- [ ] Package sprint and update-check procedures as portable skills — Lets every descendant reuse the same procedures across agents. Label: `[AGENT][LOCAL]` · Priority: P3 · https://github.blog/ai-and-ml/github-copilot/build-once-run-on-any-agent-a-practical-guide-to-agent-skills/
- [ ] Turn key template rules into hook or CI gates — Enforced gates are more reliable than prose rules the agent may skip. Label: `[AGENT][LOCAL]` · Priority: P3 · https://blog.imjackofitall.com/posts/2026-11-12/
- [ ] Evaluate mapping BUILD_PLAN owners to issue types/fields — Native issue types/fields now work on personal repos and could mirror the label scheme. Label: `[AGENT][LOCAL]` · Priority: P3 · https://github.blog/changelog/2026-11-11-issue-types-and-fields-are-available-for-personal-accounts
- [ ] Bump uv and Ruff pins in template tooling — Picks up the credential-file permission fix and safer autofixes. Label: `[AGENT][LOCAL]` · Priority: P3 · https://github.com/astral-sh/uv/releases/tag/0.13.8

## 2026-11-14

**News and updates**

- wfx-loot campaign pushed a CI secret stealer into 17,000+ public repos using stolen GitHub credentials since Nov 10; an npm postinstall hook slipped past GitHub's workflow hold. IOCs: wfx-docs branch, .ci-xxxxxx.sh files, build-audit-*.yml workflows. [source](https://blog.gitguardian.com/wfx-loot-a-ci-secret-stealer-pushed-with-stolen-github-credentials/)
- Node.js November security releases (26.13.1 / 24.22.3 / 22.23.5) fix an unauthenticated HTTP/2 crash and an HTTPS heap leak that can expose TLS keys. [source](https://nodejs.org/en/blog/vulnerability/november-2026-security-releases)
- Stack Overflow blog: 'Your coding agent shouldn't grade its own homework' — only 9.6% of 1,000 AI-written tests were useful; argues for an independent fresh-context QA agent. [source](https://stackoverflow.blog/2026/11/13/your-coding-agent-shouldn-t-grade-its-own-homework/)

**Tasks for the planning agent**

- [x] Audit the repo for wfx-loot IOCs — Checks for the wfx-docs branch/PR, .ci-*.sh files, build-audit-*.yml workflows and new npm lifecycle hooks, since the campaign steals CI secrets and Cursor credentials. Label: `[AGENT][LOCAL]` · Priority: P1 · https://blog.gitguardian.com/wfx-loot-a-ci-secret-stealer-pushed-with-stolen-github-credentials/ (synced to BUILD_PLAN)
- [x] Default template CI installs to --ignore-scripts — Blocks postinstall-hook payloads like wfx-loot in every descendant repo. Label: `[AGENT][LOCAL]` · Priority: P2 · https://blog.gitguardian.com/wfx-loot-a-ci-secret-stealer-pushed-with-stolen-github-credentials/ (synced to BUILD_PLAN)
- [x] Bump pinned Node to 24.22.3 or 26.13.1 — Picks up fixes for a high-severity HTTP/2 crash and HTTPS heap leak. Label: `[AGENT][LOCAL]` · Priority: P2 · https://nodejs.org/en/blog/vulnerability/november-2026-security-releases (synced to BUILD_PLAN)
- [ ] Add an independent-verifier step to /verify — A fresh-context reviewer that cannot edit tests catches what the coding agent's own tests miss. Label: `[AGENT][LOCAL]` · Priority: P3 · https://stackoverflow.blog/2026/11/13/your-coding-agent-shouldn-t-grade-its-own-homework/

## 2026-11-15

**News and updates**

- Cursor traced its Oct 29 incident to a vendor-exposed key: attackers copied some non-Privacy-Mode agent traces (some with pasted credentials) and briefly planted a backdoored Claude Code extension (2.1.312/2.1.313); contained since Nov 1. [source](https://cursor.com/blog/security-incident-update) · [IOCs](https://cursor.com/blog/claude-code-extension-security-notice)
- More agent-CLI lures flagged as npm malware: @claudecode/cli and zread CLI (all platform packages); treat any machine that installed them as compromised. [source](https://github.com/advisories/GHSA-vp2q-gp5r-xh5j) · [zread](https://github.com/advisories/GHSA-3429-mj25-c5wf)

**Tasks for the planning agent**

- [x] Add a "never paste secrets into agent chats or support" rule to the AGENTS.md contract — Agent traces can leak, as Cursor's incident showed, and every descendant inherits this contract. Label: `[AGENT][LOCAL]` · Priority: P2 · https://cursor.com/blog/security-incident-update (synced to BUILD_PLAN)
- [ ] Add @claudecode/cli, zread_cli and @zread/cli-* to the MCP/agent package denylist — Keeps template scripts and descendant MCP configs from installing the newest agent-lure malware. Label: `[AGENT][LOCAL]` · Priority: P3 · https://github.com/advisories/GHSA-vp2q-gp5r-xh5j

## 2026-11-16

**News and updates**

- GitHub Actions will block `pull_request_target` runs in public repos by default from Dec 2 unless an Actions event policy allows them; today (Nov 16) 12:00–14:00 AST is the second brownout. [source](https://github.blog/changelog/2026-11-02-pull_request_target-blocked-by-default-december-2/)
- Git 2.56.1 (Nov 10) fixes 6 vulnerabilities, including code execution on recursive clone (CVE-2026-111760); backports 2.55.1–2.50.2 and Git for Windows 2.56.1 shipped the same day; GitHub is patching hosted runners. [source](https://github.blog/open-source/git/git-security-vulnerabilities-announced-7/)
- Google Antigravity 2.32.0 adds Dynamic Workflows: a reviewable, saved Python script fans work out to sub-agents that return JSON-Schema-checked results (SDK 0.1.22 `beta.workflows`). [source](https://antigravity.google/docs/dynamic-workflows/) · [changelog](https://antigravity.google/docs/changelog)

**Tasks for the planning agent**

- [x] Fail validate-workflow-actions on `on: pull_request_target` — The decision log already rejects it, and a check stops descendants from shipping workflows that break when GitHub blocks them on Dec 2. Label: `[AGENT][LOCAL]` · Priority: P2 · https://github.blog/changelog/2026-11-02-pull_request_target-blocked-by-default-december-2/ (synced to BUILD_PLAN)
- [x] Update Git to 2.56.1+ on dev hosts and have the template update checker warn below the patched version — Every descendant is cloned and recursively updated on these hosts, so an old Git is a code-execution risk. Label: `[HUMAN]` · Priority: P2 · https://github.blog/open-source/git/git-security-vulnerabilities-announced-7/ (synced to BUILD_PLAN)
- [ ] Prototype a saved fan-out script for /verify in the Antigravity adapter docs — One schema-bound reviewer per changed file gives a reviewable, re-runnable verify step for Antigravity users. Label: `[AGENT][LOCAL]` · Priority: P3 · https://antigravity.google/docs/dynamic-workflows/

## 2026-11-18

Catch-up for Nov 17–18 (the daily brief did not run those mornings).

**News and updates**

- Both `pull_request_target` brownouts (Nov 9 and Nov 16) have passed, and MultiAppShare-'s `.github/workflows/pr-title.yml` still uses `pull_request_target`. The default block becomes permanent on Dec 2. [source](https://github.blog/changelog/2026-11-02-pull_request_target-blocked-by-default-december-2/)
- Unauthorized PyPI releases 1.26.1 and 1.26.2 of Microsoft's `agent-framework` (Nov 17, now removed) dropped a `.pth` hook that stole env secrets, credential files, and Azure/GitHub OIDC tokens on every Python start. Pin to 1.26.0 or don't install it; treat any hit as compromised. [source](https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi) · [uv 0.13.9](https://github.com/astral-sh/uv/releases/tag/0.13.9) rejects wheels advertised under a different package name.
- MCP reference servers v2.5.0 fix eight vulnerabilities in `mcp-server-git`, `@modelcontextprotocol/server-filesystem` and `server-everything` (git maintenance/hooks, symlink directory swaps, NAT64 SSRF). Upgrade git to 2026.11.18 and filesystem to 2.4.0 (pin date-versioned installs explicitly). [source](https://github.com/modelcontextprotocol/servers/releases/tag/v2.5.0)
- MCP Inspector 2.16.0 and 1.0.6 cap SSE line and event size to stop an unbounded-buffer denial of service (GHSA-3xgv-mvj6-g78r). [source](https://github.com/modelcontextprotocol/inspector/releases/tag/2.16.0) · [v1](https://github.com/modelcontextprotocol/inspector/releases/tag/1.0.6)

**Tasks for the planning agent**

- [x] Confirm agent-framework 1.26.1/1.26.2 is absent and add a denylist plus .pth hook check — The template should keep descendants off the compromised releases and teach them to reject unexpected Python startup hooks. Label: `[AGENT][LOCAL]` · Priority: P2 · https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi (synced to BUILD_PLAN)
- [x] Upgrade template MCP git/filesystem/everything servers to the v2.5.0 patches — v2.4.0 left eight more git/filesystem/SSRF bugs; date-versioned filesystem installs will not move to 2.4.0 on their own. Label: `[AGENT][LOCAL]` · Priority: P2 · https://github.com/modelcontextprotocol/servers/releases/tag/v2.5.0 (synced to BUILD_PLAN)
- [x] Upgrade MCP Inspector to 2.16.0 or 1.0.6 if the template documents it — A malicious MCP server could previously crash the Inspector proxy with an unbounded SSE stream. Label: `[AGENT][LOCAL]` · Priority: P2 · https://github.com/modelcontextprotocol/inspector/releases/tag/2.16.0 (synced to BUILD_PLAN)

## 2026-11-20

**News and updates**

- ETSI published EN 301 549 4th edition (Nov 17), the European Accessibility Act's harmonised ICT accessibility standard: web, document and software requirements move to current guidance (reported as WCAG 2.2), cognitive-accessibility requirements get stronger, and conformance/testing methodology is added. ETSI also published EN 303 919 for accessible emergency communications. [ETSI](https://www.etsi.org/newsroom/press-releases/etsi-advances-digital-accessibility-across-europe-with-two-standards/) · [WCAG 2.2 detail](https://ifdb.io/en/en-301-549-v4-1-1-wcag-2-2-becomes-the-benchmark-what-businesses-need-to-know-now/)

**Tasks for the planning agent**

- [ ] Target WCAG 2.2 AA / EN 301 549 v4 in this repo's UX review checklist (target size minimum, focus not obscured, dragging alternatives, accessible authentication, redundant entry), or pull the APB checklist update once it lands — the repo is still early, so building to the current standard now is cheaper than retrofitting. Label: `[AGENT][LOCAL]` · Priority: P3 · https://www.etsi.org/newsroom/press-releases/etsi-advances-digital-accessibility-across-europe-with-two-standards/

## 2026-11-25

**News and updates**

- Better Stack compared the same desktop chat app built in GPUI (the Rust, GPU-drawn UI framework Discord is moving its desktop app to), Tauri, and Electron, looking at memory, app size, frame rate and CPU. Useful background if this repo is choosing or revisiting a desktop shell; I did not run their comparison. [GPUI](https://gpui.rs) · [Better Stack](https://www.youtube.com/shorts/PbNB0MHO0eA)

## 2026-11-26

**News and updates**

- Google Workspace (Nov 24): hosted Workspace MCP servers (Gmail MCP server now GA) and the Workspace CLI are GA, and the Gmail API moves to usage tiers: a free Standard Tier with fixed quotas (about 1.2M quota units/min per project, 6,000/min per user) and no increase requests, or a paid Scaled Tier with billing enforced from 2027-04-01. From 2027-02-01 AI agents must reach Workspace data through MCP (agent OAuth clients are flagged `is_agentic`). prism-mail is a normal Gmail OAuth/PKCE client, so REST access stays, but 429 backoff and the quota notes in its docs should match the new model. [Workspace Updates](https://workspaceupdates.googleblog.com/2026/11/mcp-servers-cli-standardized-usage-tiers-now-available.html) · [Gmail release notes](https://developers.google.com/workspace/gmail/release-notes) · [quota tiers](https://developers.google.com/workspace/guides/quota-usage-tiers)

- Thunderbird's add-on spotlight (Nov 24) features Identity Chooser 4.3, which makes you pick the sender identity before every new message or forward, so mail never leaves from the wrong account or alias by default. prism-mail's unified inbox across Gmail, IMAP and Proton has the same risk, and its compose view has To/Subject/Body but no From selector. [Thunderbird blog](https://blog.thunderbird.net/2026/11/desktop-add-ons-spotlight-identity-chooser-helps-you-send-from-the-right-address/)

- Conductor moved its agent-workspace desktop app from Tauri to Electron (0.95.0, Nov 16; numbers posted Nov 24), keeping its Rust local server: workspaces open 71% faster, startup-to-render is 4.6x faster and RAM is 35% lower, while the download grew from about 200 MB to about 500 MB. A real-world counterpoint to "Tauri is always lighter": measure cold start and RAM on the real WebView (WebKitGTK on Linux, WebView2 on Windows) rather than assume. [Conductor 0.95.0](https://www.conductor.build/changelog/0.95.0-agents-that-manage-your-local-workspaces) · [X post](https://x.com/charlieholtz/status/2125351294965805147)

- Vite 8.4.0 (Nov 26) adds an opt-in `server.fs.strict: 'extended'` for wider dev-server file-access checks, plugin names in hook errors, worker chunks in the manifest, CSS preload retries and compressed wasm in preview. This repo is on `^8.3.x`, so Dependabot will bring it in; see the optional fs.strict task below. [v8.4.0](https://github.com/vitejs/vite/releases/tag/v8.4.0) · [support policy](https://vite.dev/releases)

**Tasks for the planning agent**

- [ ] Document the Gmail Standard Tier quotas and harden 429 backoff in the Gmail provider — The new tiers are fixed with no quota increases, so the hub should throttle gracefully and the docs should say which tier the OAuth project uses. Label: `[AGENT][LOCAL]` · Priority: P3 · https://developers.google.com/workspace/guides/quota-usage-tiers
- [ ] Add an ADR/README note that the Gmail OAuth client is non-agentic (Standard tier) and that any AI features must use Workspace MCP after Feb 1, 2027 — It avoids a surprise policy break or throttling when the rules take effect. Label: `[AGENT][LOCAL]` · Priority: P3 · https://workspaceupdates.googleblog.com/2026/11/mcp-servers-cli-standardized-usage-tiers-now-available.html
- [ ] Check the prism-mail Cloud project in the new Workspace API quota dashboard — Confirm the project's tier and projected usage before billing enforcement on 2027-04-01. Label: `[HUMAN]` · Priority: P3 · https://developers.google.com/workspace/guides/quota-usage-tiers
- [ ] Add an explicit From/identity picker to compose (optional "always ask" mode) — A unified inbox across Gmail, IMAP and Proton makes sending from the wrong address easy. Label: `[AGENT][LOCAL]` · Priority: P3 · https://blog.thunderbird.net/2026/11/desktop-add-ons-spotlight-identity-chooser-helps-you-send-from-the-right-address/
- [ ] Benchmark cold start and RAM of the Tauri desktop shell before wiring it to the web hub — Conductor's numbers show the WebView choice can dominate perceived speed, and a baseline keeps the ADR-0015 desktop decision evidence-based. Label: `[AGENT][LOCAL]` · Priority: P3 · https://www.conductor.build/changelog/0.95.0-agents-that-manage-your-local-workspaces
- [ ] Try server.fs.strict: 'extended' in the Vite 8.4 dev config once Dependabot lands 8.4 — The hub handles OAuth tokens and mail, so stricter dev-server file checks are cheap extra protection. Label: `[AGENT][LOCAL]` · Priority: P3 · https://github.com/vitejs/vite/releases/tag/v8.4.0
