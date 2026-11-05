workspace "ai-plugins" {

    !identifiers hierarchical

    model {
        maintainer = person "Maintainer" "Authors every asset and installs the plugins in their own repositories."

        marketplace = softwareSystem "jsdotnet-ai-plugins" "The plugin marketplace: specialists, trackers, host plugins, and the checks that hold them." {
            group "Specialists" {
                architecture = container "architecture" "arc42 chapters, decision and debt records, and C4 and runtime diagrams."
                csharpCoding = container "csharp-coding" "C# .NET implementation, tests, review, and runtime packages."
                reactCoding = container "react-coding" "React and TypeScript implementation against a .NET API contract."
                qa = container "qa" "Runtime validation through Aspire and Playwright, with evidence." {
                    qaAgent = component "qa agent" "Runs or targets the application, validates scenarios, and writes the report."
                    qaMonitor = component "qa-monitor agent" "Watches the logs and traces of an application already running."
                    aspireRun = component "aspire-run" "Starts the application through Aspire."
                    deployed = component "deployed-environment-validation" "Validates an environment that is already deployed."
                    fromIssue = component "feature-test-from-issue" "Derives the scenarios from an issue."
                    validation = component "playwright-validation" "Drives the browser scenarios and captures evidence."
                    e2eAuthoring = component "playwright-e2e-authoring" "Turns a passed scenario into a committed test file."
                    logMonitor = component "aspire-log-monitor" "Reads Aspire logs and traces for the whole session."
                }
                domainDesign = container "domain-design" "Bounded contexts, ubiquitous language, domain models, and context maps."
                uxDesign = container "ux-design" "Wireframes, user flows, design guidelines, and UI reviews."
                documentation = container "documentation" "How-tos, explanations, articles, proposals, infographics, and profiles."
                productOwner = container "product-owner" "Epics, stories, and bugs as Markdown."
                review = container "review" "Review passes driven by TODOs, questions, and improvements."
                specBuilder = container "spec-builder" "The create-* contracts every asset is authored against." {
                    agent = component "spec-builder.agent.md" "Plans, edits, and self-checks an asset in one conversation."
                    createSkills = component "create-* skills" "Draft one asset type each, to its contract."
                    contracts = component "create-*.md contracts" "Say what each asset type must carry to load in both hosts."
                    canvasContract = component "create-canvas.md" "Says what a Copilot canvas extension must carry."
                    workflow = component "agent-spec-workflow.md" "The single-agent authoring workflow."
                    conciseness = component "spec-conciseness.md" "Pruning rules and the body budgets."
                    sessionHooks = component "Session-start hooks" "State the authoring rules at the start of every session."
                    budgetStatus = component "budget-status.ts" "Reports an asset's body count against its budget."
                }
                aikido = container "aikido" "Aikido Security scanning, triage, and fixes."
            }
            group "Trackers" {
                github = container "github" "Issue sync, pull requests, Actions workflows, and Dependabot."
                jira = container "jira" "Jira issues from approved Markdown backlog artifacts."
            }
            group "Host plugins" {
                claudeDesktop = container "claude-desktop" "The run dashboard and viewers as an MCP server, and Claude session skills." {
                    mcpServer = component "mcp-server.mjs" "The MCP tools, the HTTP server, and the ui:// resources."
                    state = component "state.mjs" "Resolves the state directory outside the repository."
                    store = component "store.mjs" "Keeps one JSON file per run."
                    telemetryHook = component "telemetry-hook.mjs" "Receives Claude Code hook events."
                    insight = component "insight.mjs" "Turns hook events into per-stage tool activity."
                    render = component "render.mjs and views" "The dashboard shell and the diagram and document pages."
                    appBridge = component "app-bridge.js" "The MCP Apps bridge."
                    report = component "report.mjs" "Markdown and HTML reports of a run."
                    sessionTitle = component "session-title.mjs" "Derives a session title from where a run's output landed."
                    idle = component "idle.mjs" "Stamps an abandoned run idle."
                }
                claudeDesktopMods = container "claude-desktop-mods" "Claude Code function hooks: handoff briefs, the context view, and the account bar."
                copilotApp = container "copilot-app" "The same viewers as Copilot canvas extensions, and session upkeep." {
                    group "orch-dashboard" {
                        dashboardExtension = component "orch-dashboard extension.mjs" "Registers the canvas and its actions and serves the panel."
                        dashboardStore = component "store.mjs" "Keeps one JSON file per run."
                        dashboardInsight = component "insight.mjs" "Turns session events into per-stage activity and the context gauge."
                        dashboardRender = component "render.mjs" "The dashboard shell."
                        dashboardReport = component "report.mjs" "Markdown and HTML reports of a run."
                    }
                    group "diagram-canvas" {
                        diagramExtension = component "diagram-canvas extension.mjs" "Registers the Mermaid canvas and its actions."
                        diagramPage = component "mermaid.html" "The page that renders a Mermaid diagram."
                    }
                    group "markdown-canvas" {
                        markdownExtension = component "markdown-canvas extension.mjs" "Registers the Markdown canvas and its actions."
                        markdownPage = component "markdown.html" "The page that renders a Markdown document."
                    }
                }
            }
            group "Convention and project" {
                wipConvention = container "wip-convention" "The .wip/ work-in-progress layout other plugins write to."
                fincent = container "fincent" "One project's story review, estimation, review, sprint, and demo workflows."
            }
            tools = container "Repository tools" "check-assets.mjs, tool-map.json, and bump-version.mjs."
        }

        copilot = softwareSystem "GitHub Copilot" "One of the two hosts: the Copilot CLI and app."
        claude = softwareSystem "Claude Code and Claude Desktop" "The other host: Claude Code, and Claude Desktop through it."
        engine = softwareSystem "Delivery engine" "delivery and delivery-schedule, from the jsdotnet-devbook marketplace."
        devbook = softwareSystem "devbook" "The .devbook/ folder convention and its check, from the jsdotnet-devbook marketplace."
        backlog = softwareSystem "Backlog" "Plans and work items for changes to this repository."
        gitHub = softwareSystem "GitHub" "The repository, its pull requests, and CI."
        aspireMcp = softwareSystem "Aspire MCP server" "Serves the resources, logs, and traces of the application under test."
        playwrightCli = softwareSystem "Playwright CLI" "Drives a browser from the shell."

        maintainer -> marketplace "Authors"
        maintainer -> backlog "Plans changes in"
        copilot -> marketplace "Loads"
        claude -> marketplace "Loads"
        engine -> marketplace "Consults a specialist by role"
        marketplace -> devbook "Writes chapters to its rules through the specialists"
        marketplace -> gitHub "Syncs issues through the tracker plugins"
        gitHub -> marketplace "Runs check-assets on every pull request"

        marketplace.tools -> marketplace.architecture "Checks"
        marketplace.tools -> marketplace.csharpCoding "Checks"
        marketplace.tools -> marketplace.reactCoding "Checks"
        marketplace.tools -> marketplace.qa "Checks"
        marketplace.tools -> marketplace.domainDesign "Checks"
        marketplace.tools -> marketplace.uxDesign "Checks"
        marketplace.tools -> marketplace.documentation "Checks"
        marketplace.tools -> marketplace.productOwner "Checks"
        marketplace.tools -> marketplace.review "Checks"
        marketplace.tools -> marketplace.specBuilder "Checks"
        marketplace.tools -> marketplace.aikido "Checks"
        marketplace.tools -> marketplace.github "Checks"
        marketplace.tools -> marketplace.jira "Checks"
        marketplace.tools -> marketplace.claudeDesktop "Checks"
        marketplace.tools -> marketplace.claudeDesktopMods "Checks"
        marketplace.tools -> marketplace.copilotApp "Checks"
        marketplace.tools -> marketplace.wipConvention "Checks"
        marketplace.tools -> marketplace.fincent "Checks"

        marketplace.qa.qaAgent -> marketplace.qa.aspireRun "Runs"
        marketplace.qa.qaAgent -> marketplace.qa.deployed "Runs"
        marketplace.qa.qaAgent -> marketplace.qa.fromIssue "Runs"
        marketplace.qa.qaAgent -> marketplace.qa.validation "Runs"
        marketplace.qa.qaAgent -> marketplace.qa.e2eAuthoring "Runs"
        marketplace.qa.qaAgent -> marketplace.qa.logMonitor "Runs"
        marketplace.qa.qaMonitor -> marketplace.qa.logMonitor "Runs"
        marketplace.qa.deployed -> marketplace.qa.validation "Hands the scenarios to"
        marketplace.qa.fromIssue -> marketplace.qa.aspireRun "Starts the application with"
        marketplace.qa.fromIssue -> marketplace.qa.validation "Hands the scenarios to"
        marketplace.qa.e2eAuthoring -> marketplace.qa.validation "Codifies a passed scenario of"
        marketplace.qa.aspireRun -> aspireMcp "Uses" "MCP"
        marketplace.qa.logMonitor -> aspireMcp "Reads logs and traces from" "MCP"
        marketplace.qa.validation -> playwrightCli "Drives the browser with" "Shell"

        marketplace.claudeDesktop.telemetryHook -> marketplace.claudeDesktop.state "Reads and writes the active run in"
        marketplace.claudeDesktop.telemetryHook -> marketplace.claudeDesktop.insight "Feeds tool activity to"
        marketplace.claudeDesktop.mcpServer -> marketplace.claudeDesktop.state "Reads and writes the active run in"
        marketplace.claudeDesktop.state -> marketplace.claudeDesktop.store "Locates the runs of"
        marketplace.claudeDesktop.mcpServer -> marketplace.claudeDesktop.render "Renders pages with"
        marketplace.claudeDesktop.mcpServer -> marketplace.claudeDesktop.report "Exports reports with"
        marketplace.claudeDesktop.mcpServer -> marketplace.claudeDesktop.sessionTitle "Titles sessions with"
        marketplace.claudeDesktop.mcpServer -> marketplace.claudeDesktop.idle "Stamps idle runs with"
        marketplace.claudeDesktop.render -> marketplace.claudeDesktop.appBridge "Shows pages inline through"

        marketplace.copilotApp.dashboardExtension -> marketplace.copilotApp.dashboardStore "Stores runs in"
        marketplace.copilotApp.dashboardExtension -> marketplace.copilotApp.dashboardInsight "Hands session events to"
        marketplace.copilotApp.dashboardExtension -> marketplace.copilotApp.dashboardRender "Renders the panel with"
        marketplace.copilotApp.dashboardExtension -> marketplace.copilotApp.dashboardReport "Exports reports with"
        marketplace.copilotApp.dashboardReport -> marketplace.copilotApp.dashboardInsight "Reads activity from"
        marketplace.copilotApp.diagramExtension -> marketplace.copilotApp.diagramPage "Serves"
        marketplace.copilotApp.markdownExtension -> marketplace.copilotApp.markdownPage "Serves"

        marketplace.specBuilder.agent -> marketplace.specBuilder.createSkills "Dispatches"
        marketplace.specBuilder.agent -> marketplace.specBuilder.canvasContract "Reads"
        marketplace.specBuilder.agent -> marketplace.specBuilder.workflow "Follows"
        marketplace.specBuilder.agent -> marketplace.specBuilder.conciseness "Reads"
        marketplace.specBuilder.createSkills -> marketplace.specBuilder.contracts "Read their own"
        marketplace.specBuilder.createSkills -> marketplace.specBuilder.conciseness "Read"
        marketplace.specBuilder.sessionHooks -> marketplace.specBuilder.contracts "State the rules the contracts hold"
        marketplace.specBuilder.budgetStatus -> marketplace.specBuilder.conciseness "Reports the budgets of"
    }

    views {
        systemContext marketplace "context" "The marketplace, the people and systems around it." {
            include maintainer marketplace copilot claude engine devbook backlog gitHub
            autolayout lr
        }

        container marketplace "plugins" "One container per plugin, grouped by kind, and the tools that check them." {
            include marketplace.architecture marketplace.csharpCoding marketplace.reactCoding marketplace.qa marketplace.domainDesign marketplace.uxDesign marketplace.documentation marketplace.productOwner marketplace.review marketplace.specBuilder marketplace.aikido marketplace.github marketplace.jira marketplace.claudeDesktop marketplace.claudeDesktopMods marketplace.copilotApp marketplace.wipConvention marketplace.fincent marketplace.tools
            autolayout tb
        }

        component marketplace.qa "qa-structure" "The qa agents, the skills they run, and the tools those reach." {
            include *
            autolayout lr
        }

        component marketplace.claudeDesktop "claude-desktop-structure" "The parts of the orch-dashboard MCP server and its hooks." {
            include *
            autolayout lr
        }

        component marketplace.copilotApp "copilot-app-structure" "The three canvas extensions and their parts." {
            include *
            autolayout lr
        }

        component marketplace.specBuilder "spec-builder-structure" "The spec-builder agent, its skills, contracts, and hooks." {
            include *
            autolayout lr
        }
    }
}
