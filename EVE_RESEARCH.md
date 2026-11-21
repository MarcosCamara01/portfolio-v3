# Vercel Eve technical research

<!-- markdownlint-disable MD013 -->

Research date: 2026-06-21

## Status

Living document. This research is being built from official sources, the public repo, the npm package, the documentation included in the package, official Vercel Labs templates, public issues/PRs, the repo's tests and real CLI runs.

## Executive summary

Eve is a filesystem-first framework for building durable backend AI agents on Vercel. Its core idea is similar to "Next.js for web apps, but for agents": behavior is defined through file and folder conventions inside `agent/`, with instructions in Markdown, tools in TypeScript, skills loaded on demand, input/output channels, authenticated connections, subagents, schedules and a durable runtime.

According to Vercel, Eve compiles that directory, wires up the agent infrastructure and builds on several Vercel primitives: AI Gateway for models, Vercel Sandbox for isolated execution, Vercel Workflows for durability, Vercel Connect for credentials and channels, Chat SDK for chat surfaces, and the platform's observability/governance.

My technical read: Eve tries to turn a production agent into a declarative, auditable surface. You do not write an agent application as one huge imperative graph; you write an `agent/` directory with conventional slots. The runtime discovers that surface, generates manifests, brings up stable HTTP routes, runs turns as durable workflows, keeps session state, exposes NDJSON streaming, and mediates tools, sandbox, OAuth, HITL and subagents.

This abstraction has an important consequence: Eve is not just an SDK for LLM calls. It is a complete backend agent runtime, with a build system, CLI, Nitro server, HTTP protocol, TS client, hooks, evals, auth, sandbox, channels and deployment.

## Confirmed findings

- The official landing page defines Eve as "the framework for building agents" and positions it as a durable framework for agents with instructions/skills in Markdown and tools in TypeScript.
- The Vercel Knowledge Base defines it as "a filesystem-first framework for durable backend agents on Vercel".
- The official repo is `vercel/eve`: public, Apache-2.0, TypeScript code and a monorepo structure.
- The npm package `eve` exists and, at the time of checking, `latest` points to `0.12.0`, published on 2026-06-21. The cloned repo is also tagged `eve@0.12.0`.
- The GitHub API confirms release `eve@0.12.0`, published on 2026-06-21 at 14:46 UTC. An initial GitHub HTML view showed `0.11.7`, probably due to rendering/caching; it is ruled out against the API + npm + local tag.
- The `eve` package declares Node `>=24`.
- The `eve` package includes local documentation, and the repo README says coding agents can read it from `node_modules/eve/docs`.
- The current CLI `0.12.0` confirms the commands `init`, `link`, `deploy`, `build`, `start`, `dev`, `info`, `eval` and `channels`.
- Mismatch between the docs and the current CLI: the local documentation says `eve dev` uses `$PORT` and then `3000`; `npx eve@latest dev --help` in `0.12.0` shows `$PORT` and then `2000`. `eve start` does show `$PORT` and then `3000`.
- `npx eve@latest init probe-agent` was tested in `/tmp`: it detects a coding agent environment, creates a minimal scaffold, installs deps, initializes Git and does not start the TUI. The output recommends that the human run `npm exec -- eve dev`.
- In the real scaffold, `npm run typecheck` passes and `npm run build` generates a Nitro `.output/`. The tested build produced a server of 5.49 MB total, with `.output/server/_libs/eve.mjs` at 4.75 MB.
- `npm exec -- eve info --json` on the minimal scaffold returns status `ready`, 0 errors, 0 warnings, model `anthropic/claude-sonnet-4.6`, instructions `instructions.md`, no tools/skills, and three base HTTP routes.
- The official templates listed by the Vercel KB are:
  - `vercel-labs/eve-content-agent-template`
  - `vercel-labs/personal-agent-template`
  - `vercel-labs/eve-pr-triage-agent-template`
  - `vercel-labs/eve-slack-agent-template`
  - `vercel-labs/eve-chat-template`

## Primary sources

- Official landing page: <https://vercel.com/eve>
- Main Knowledge Base: <https://vercel.com/kb/eve>
- Docs: <https://eve.dev>
- Integrations: <https://eve.dev/integrations>
- Framework repo: <https://github.com/vercel/eve>
- npm package: <https://www.npmjs.com/package/eve>
- Current GitHub release: <https://github.com/vercel/eve/releases/tag/eve%400.12.0>
- Content agent template: <https://github.com/vercel-labs/eve-content-agent-template>
- Personal agent template: <https://github.com/vercel-labs/personal-agent-template>
- PR triage agent template: <https://github.com/vercel-labs/eve-pr-triage-agent-template>
- Slack agent template: <https://github.com/vercel-labs/eve-slack-agent-template>
- Next.js chat template: <https://github.com/vercel-labs/eve-chat-template>

## Versions, repo and public status

- Main repo: `vercel/eve`
- GitHub API description: "The Framework for Building Agents"
- License: Apache-2.0
- Default branch: `main`
- Latest confirmed release: `eve@0.12.0`
- Release date: 2026-06-21 14:46 UTC
- npm `latest`: `0.12.0`
- Required Node: `>=24`
- Status: beta/preview; Vercel warns that APIs, docs and behavior may change before GA.
- GitHub API metadata at research time:
  - `vercel/eve`: 1972 stars, 136 forks, 70 open issues, pushed `2026-06-21T14:46:41Z`
  - `vercel-labs/eve-content-agent-template`: 4 stars, 0 forks, 0 issues, Apache-2.0
  - `vercel-labs/personal-agent-template`: 336 stars, 25 forks, 2 issues, MIT
  - `vercel-labs/eve-pr-triage-agent-template`: 6 stars, 0 forks, 0 issues, Apache-2.0
  - `vercel-labs/eve-slack-agent-template`: 8 stars, 5 forks, 0 issues
  - `vercel-labs/eve-chat-template`: 19 stars, 5 forks, 0 issues

## Relevant changelog

`packages/eve/CHANGELOG.md` confirms that `0.12.0` is a small but important release for dynamic capability names:

- `0.12.0`:
  - Dynamic resolvers that return maps no longer auto-prefix with the file slug. The map key is the final tool/skill name.
  - A single `defineTool` or `defineSkill` still takes its name from the file slug.
  - If a map can collide, the author must namespace it by hand, for example `team__playbook`.
  - A dynamic tool/skill replaces an authored one with the same name.
  - Two dynamic resolvers that emit the same name fail with an error.
  - Connection tools stay as `connection_search` and `<connection>__<tool>`, for example `linear__list_issues`.
  - Fixes resolution of code-defined models in `eve dev`, including NodeNext `.js` imports that point to `.ts`.
- `0.11.10`:
  - Improvements to `eve init` and `eve dev` output.
  - Earlier fix for dynamic skill map naming; replaced by the final `0.12.0` contract.
  - The TUI supports Ctrl+C to clear prompts and multiline input.
- `0.11.9`:
  - Adds `experimental.workflow.world` to choose an installed Workflow world, important for advanced self-hosting.
- `0.11.8`:
  - Canonicalizes docs to `eve.dev`.
  - Uses TypeScript 7 `tsc` in Eve builds; generated Next projects keep TS 6.0.3 for Next compatibility.
- `0.11.7` to `0.11.1`:
  - Many fixes for sandbox, microsandbox, Slack typing, OIDC, HITL in connections and backend recovery.
- `0.11.0`:
  - Removes the `withEve` opt-out from Vercel output.
  - `action.result` can have status `rejected` after a HITL denial; the stream version goes up to `16`.
- `0.10.0`:
  - First public release.

Code note: some old internal comments still mention `slug__key` names for some dynamic maps. The `0.12.0` implementation, `defineDynamic` and the current changelog say the opposite: map keys are final names with no automatic prefix.

## Mental model

Eve has three layers:

1. Filesystem-first surface:
   - `agent/instructions.*`: identity and base prompt.
   - `agent/agent.ts`: model and runtime config.
   - `agent/tools/`: typed actions the model can call.
   - `agent/skills/`: Markdown procedures loaded on demand.
   - `agent/connections/`: external MCP/OpenAPI with managed auth.
   - `agent/channels/`: input/output surfaces such as HTTP, Slack, GitHub, Discord.
   - `agent/sandbox/`: sandbox and isolated workspace.
   - `agent/subagents/`: specialized child agents.
   - `agent/schedules/`: root-only cron jobs.
   - `agent/hooks/`: subscribers to runtime events.
   - `evals/`: repeatable checks outside `agent/`.

2. Compilation and host:
   - Eve discovers files under `agent/`.
   - It generates artifacts under `.eve/`.
   - Nitro hosts HTTP routes, channels, callbacks, schedules and workflow entrypoints.
   - On Vercel it emits Vercel Build Output in `.vercel/output`.
   - Outside Vercel it uses Nitro Node output in `.output/`.

3. Durable runtime:
   - Each session is a durable conversation.
   - Each turn runs as a durable workflow.
   - Each step is a durable checkpoint.
   - The event stream is replayable by index.
   - HITL, OAuth and subagents can park work without keeping compute active.

## Project layout

Eve derives identity from the path, not from `name` or `id` fields.

| File                                  | Becomes               |
| ------------------------------------- | --------------------- |
| `agent/tools/get_weather.ts`          | tool `get_weather`    |
| `agent/connections/linear.ts`         | connection `linear`   |
| `agent/skills/summarize.md`           | skill `summarize`     |
| `agent/subagents/researcher/agent.ts` | subagent `researcher` |

Recommended layout:

```text
my-agent/
├── package.json
├── tsconfig.json
├── agent/
│   ├── agent.ts
│   ├── instructions.md
│   ├── instrumentation.ts
│   ├── channels/
│   ├── connections/
│   ├── hooks/
│   ├── skills/
│   ├── lib/
│   ├── sandbox/
│   ├── tools/
│   ├── schedules/
│   └── subagents/
└── evals/
```

Important rules:

- `evals/` lives at the app root, not inside `agent/`.
- The root agent requires instructions, except for compatibility/deprecated cases found in tests (`system.md`/`system.ts`).
- Declared subagents need an `agent.ts` with a `description`, but their `instructions` are optional.
- `channels/` and `schedules/` are root-only; they are not declared inside local subagents.
- `lib/` is importable code only; it is not mounted in the workspace.
- Only these reach the sandbox workspace:
  - skills under `/workspace/skills/...`
  - `agent/sandbox/workspace/**` under `/workspace/...`

## Public TypeScript API

The local doc says the public contract lives in `packages/eve/src/public/index.ts`; anything not exported there is considered internal. The npm package `0.12.0` exports many subpaths. The main ones:

| Helper/API                                    | Import                                        | Where it is used                           |
| --------------------------------------------- | --------------------------------------------- | ------------------------------------------ |
| `defineAgent`                                 | `eve`                                         | `agent/agent.ts`                           |
| `defineRemoteAgent`                           | `eve`                                         | remote subagents                           |
| `defineTool`                                  | `eve/tools`                                   | `agent/tools/*.ts`                         |
| `defineDynamic`                               | `eve/tools`, `eve/skills`, `eve/instructions` | runtime capabilities per session/turn/step |
| `disableTool`                                 | `eve/tools`                                   | disable built-ins by slug                  |
| `ExperimentalWorkflow`                        | `eve/tools`                                   | opt-in Workflow tool                       |
| `defineMcpClientConnection`                   | `eve/connections`                             | external MCP                               |
| `defineOpenAPIConnection`                     | `eve/connections`                             | external OpenAPI 3.x                       |
| `defineInteractiveAuthorization`              | `eve/connections`                             | your own OAuth                             |
| `defineChannel`                               | `eve/channels`                                | custom channels                            |
| `GET`/`POST`/`PUT`/`PATCH`/`DELETE`/`WS`      | `eve/channels`                                | custom routes                              |
| `eveChannel`                                  | `eve/channels/eve`                            | base HTTP channel                          |
| `slackChannel`                                | `eve/channels/slack`                          | Slack                                      |
| `githubChannel`                               | `eve/channels/github`                         | GitHub                                     |
| `defineSkill`                                 | `eve/skills`                                  | TS skills                                  |
| `defineInstructions`                          | `eve/instructions`                            | TS instructions                            |
| `defineHook`                                  | `eve/hooks`                                   | stream/runtime hooks                       |
| `defineSchedule`                              | `eve/schedules`                               | cron                                       |
| `defineState`                                 | `eve/context`                                 | durable per-session memory                 |
| `defineSandbox`                               | `eve/sandbox`                                 | sandbox                                    |
| `defineInstrumentation`                       | `eve/instrumentation`                         | OTel/telemetry                             |
| `defineEval`, `defineEvalConfig`              | `eve/evals`                                   | evals                                      |
| `includes`, `equals`, `matches`, `similarity` | `eve/evals/expect`                            | assertions                                 |
| `Client`, `ClientSession`                     | `eve/client`                                  | TS SDK                                     |
| `useEveAgent`                                 | `eve/react`, `eve/vue`, `eve/svelte`          | frontend                                   |
| `withEve`                                     | `eve/next`                                    | Next.js                                    |
| Nuxt module                                   | `eve/nuxt`                                    | Nuxt                                       |
| SvelteKit plugin                              | `eve/sveltekit`                               | SvelteKit                                  |

The runtime `ctx` appears in tools, hooks and handlers. Key members:

- `ctx.session`: session, turn, auth and parent lineage metadata.
- `ctx.getSandbox()`: live sandbox handle.
- `ctx.getSkill(identifier)`: access to the skill and its bundled files.
- `ctx.getToken()`: resolves the bearer token for the `auth` declared on the tool/connection.
- `ctx.requireAuth()`: forces the interactive authorization flow.

### Actual package exports

`packages/eve/package.json` in `0.12.0` confirms:

- `type`: `module`
- bin:
  - `eve`: `./bin/eve.js`
- direct runtime dependency:
  - `nitro`: `3.0.260610-beta`
- relevant peer dependencies:
  - `ai`
  - `next`
  - `react`
  - `vue`
  - `svelte`
  - `@sveltejs/kit`
  - `nuxt`
  - `vite`
  - `@opentelemetry/api`
  - `braintrust`
  - `just-bash`
  - `microsandbox`

Public subpath exports:

- `eve`
- `eve/client`
- `eve/react`
- `eve/vue`
- `eve/svelte`
- `eve/next`
- `eve/nuxt`
- `eve/sveltekit`
- `eve/tools`
- `eve/tools/defaults`
- `eve/tools/approval`
- `eve/connections`
- `eve/agents/auth`
- `eve/hooks`
- `eve/sandbox`
- `eve/sandbox/docker`
- `eve/sandbox/just-bash`
- `eve/sandbox/microsandbox`
- `eve/sandbox/vercel`
- `eve/evals`
- `eve/evals/expect`
- `eve/evals/loaders`
- `eve/evals/reporters`
- `eve/skills`
- `eve/instructions`
- `eve/context`
- `eve/instrumentation`
- `eve/schedules`
- `eve/channels`
- `eve/channels/eve`
- `eve/channels/auth`
- `eve/channels/slack`
- `eve/channels/github`
- `eve/channels/discord`
- `eve/channels/twilio`
- `eve/channels/telegram`
- `eve/channels/teams`
- `eve/channels/linear`

It also exports `eve/setup` and `eve/setup/scaffold`, but those paths are clearly for setup/scaffolding, not the normal surface for agent authors.

## `agent.ts` configuration

`agent.ts` calls `defineAgent`.

- If the root has no `agent.ts`, Eve defaults to `anthropic/claude-sonnet-4.6`.
- If `agent.ts` exists, `model` is required.
- If `model` is a string, it is routed through Vercel AI Gateway.
- If `model` is an AI SDK `LanguageModel`, it calls the configured provider directly.
- `compaction.thresholdPercent` controls when history is compacted; the documented default is `0.9`.
- `experimental.workflow.world` lets you change the Workflow world in advanced self-hosted setups.
- `experimental.codeMode` exists, but is marked unstable.
- `outputSchema` is for task-mode runs, subagents, schedules or remote jobs.
- `build.externalDependencies` controls how external dependencies are bundled.

## CLI

Current CLI checked with `npx eve@latest --help` (`0.12.0`):

| Command                       | Use                                                    |
| ----------------------------- | ------------------------------------------------------ |
| `eve`                         | with no command, same as `eve dev`                     |
| `eve init [target]`           | create an agent or add Eve to an existing project      |
| `eve link`                    | link to Vercel and pull AI Gateway credentials         |
| `eve deploy`                  | deploy to Vercel production                            |
| `eve build`                   | build an Eve app                                       |
| `eve start`                   | serve a built app                                      |
| `eve dev`                     | local server + TUI, or connect the TUI to a remote URL |
| `eve info --json`             | inspect the resolved surface                           |
| `eve eval`                    | run evals                                              |
| `eve channels add slack\|web` | channel scaffolding                                    |
| `eve channels list --json`    | list authored channels                                 |

Commands recommended by the docs:

```bash
eve info
eve dev
eve build
eve start
eve deploy
eve eval
```

Useful artifacts under `.eve/`:

- `.eve/discovery/agent-discovery-manifest.json`
- `.eve/discovery/diagnostics.json`
- `.eve/compile/compiled-agent-manifest.json`
- `.eve/compile/compile-metadata.json`
- `.eve/compile/module-map.mjs`

### Scaffold tested for real

Command run in `/tmp/eve-init-probe`:

```bash
npx eve@latest init probe-agent
```

Observed result:

- Printed version: `eve v0.12.0`.
- Directory created: `/private/tmp/eve-init-probe/probe-agent`.
- Dependencies installed in 3.5s on the second run.
- It does not start `eve dev` because it detects that a coding agent is running it.
- It initializes Git.
- It recommends reading `node_modules/eve/docs/` before editing.
- It asks you to replace `agent/instructions.md` with the agent's real purpose.

Authored files in the minimal scaffold:

```text
agent/
├── agent.ts
├── channels/
│   └── eve.ts
└── instructions.md
```

Generated `package.json`:

- `type: "module"`
- imports `#*` -> `./agent/*` and `#evals/*` -> `./evals/*`
- scripts:
  - `build`: `eve build`
  - `dev`: `eve dev`
  - `start`: `eve start`
  - `typecheck`: `tsc`
- deps:
  - `@vercel/connect`: `0.2.2`
  - `ai`: `7.0.0-beta.178`
  - `eve`: `^0.12.0`
  - `zod`: `4.4.3`
- dev deps:
  - `@types/node`: `24.x`
  - `typescript`: `7.0.1-rc`
- engine:
  - `node`: `24.x`

By default, `agent/agent.ts` uses:

```ts
import { defineAgent } from 'eve';

export default defineAgent({
  model: 'anthropic/claude-sonnet-4.6',
});
```

`agent/channels/eve.ts` configures `eveChannel` with `localDev()`, `vercelOidc()` and `placeholderAuth()`.

### Actual `eve info --json` output

On the minimal scaffold, `npm exec -- eve info --json` returns:

- `layout`: `nested`
- `status`: `ready`
- `diagnostics`: 0 errors, 0 warnings
- `model`: `anthropic/claude-sonnet-4.6`
- `instructions`: `instructions.md`
- `skills`: `[]`
- `tools`: `[]`
- `channels`:
  - `POST /eve/v1/session`
  - `POST /eve/v1/session/:sessionId`
  - `GET /eve/v1/session/:sessionId/stream`
- `artifacts`:
  - `.eve/compile/compiled-agent-manifest.json`
  - `.eve/discovery/agent-discovery-manifest.json`
  - `.eve/discovery/diagnostics.json`
  - `.eve/compile/module-map.mjs`
  - `.eve/compile/compile-metadata.json`

### Actual `.eve` artifacts

The minimal scaffold generates:

- Discovery manifest:
  - kind `eve-agent-discovery-manifest`
  - version `12`
  - registers `agent.ts`, `instructions.md` and `channels/eve.ts`
- Compiled manifest:
  - kind `eve-agent-compiled-manifest`
  - version `30`
  - model with routing `{ kind: "gateway", target: "anthropic" }`
  - `contextWindowTokens`: `1000000`
  - `workflowEnabled`: `false`
  - `sandbox`: `null`
  - `workspaceResourceRoot` with a content hash
- Compile metadata:
  - kind `eve-compile-metadata`
  - version `5`
  - status `ready`
  - SHA-256 hashes for the module map, discovery manifest and diagnostics
  - generator `eve@0.12.0`
- `module-map.mjs`:
  - imports `../../agent/agent.ts`
  - imports `../../agent/channels/eve.ts`
  - exports a `moduleMap` frozen by node id `__root__`

### Build tested for real

On the minimal scaffold:

```bash
npm run typecheck
npm run build
```

Results:

- `tsc` passes.
- `eve build` passes.
- Nitro uses the `node-server` preset and the `rolldown` builder.
- It generates `.output/server/index.mjs`.
- Reported total bundle: 5.49 MB, 1.3 MB gzip.
- Largest library: `.output/server/_libs/eve.mjs`, 4.75 MB, 1.15 MB gzip.

## Durable runtime

Eve organizes work in three levels:

- `session`: durable conversation/task; it can last days/weeks.
- `turn`: one user message and all the work it triggers.
- `step`: durable checkpoint inside the turn; usually one model call and its tool calls.

Guarantees and limits:

- Each turn runs as a durable workflow.
- Completed steps are not re-run; the recorded result is replayed.
- If a step is interrupted midway, it can be re-run. That is why non-idempotent actions must be made idempotent or put behind approval.
- HITL, OAuth and subagents can park the workflow with no compute until the input/callback arrives.
- Eve does not keep a durable FIFO message queue per session. The `continuationToken` is a resume handle, not a queue address. For deterministic ordering, send one turn and wait for `session.waiting` before the next.
- Declared subagents have their own durable session, sandbox, skills and state.

## Internals confirmed in code

### Discovery and compile

`compileAgent()` goes through these steps:

1. Resolves the project with `resolveDiscoveryProject`.
2. Discovers the source graph with `discoverAgent`.
3. Writes artifacts with `writeCompilerArtifacts`.
4. If there are error diagnostics, it throws `CompileAgentError`, but still leaves the diagnostics and manifests written.

`discoverAgent()` does not import authored modules. It reads the filesystem and classifies slots:

- instructions
- `agent.ts` config
- channels
- lib
- schedules
- connections
- sandbox
- tools
- hooks
- skills
- subagents

The artifacts live under `.eve/`:

```text
.eve/
├── discovery/
│   ├── agent-discovery-manifest.json
│   └── diagnostics.json
└── compile/
    ├── compiled-agent-manifest.json
    ├── compile-metadata.json
    ├── module-map.mjs
    └── channel-instrumentation-types.d.ts
```

`compile-metadata.json` stores SHA-256 hashes and `sourceGraphHash`, so the runtime/dev server can detect artifact changes without re-analyzing everything.

### Manifest and module map

The compiled manifest is deliberately serializable. It stores metadata, routes, model, instructions, skills, tools, subagents, schedules, sandbox, workspace resources and module references. Authored functions are not serialized to JSON; they live in `module-map.mjs`.

Observed constants:

- `COMPILED_AGENT_MANIFEST_KIND`: `eve-agent-compiled-manifest`
- `COMPILED_AGENT_MANIFEST_VERSION`: `30`
- compiled root node id: `__root__`

`module-map.mjs` imports the real modules and exposes a map frozen by node id and source id. In a minimal scaffold:

```js
import * as module_0 from '../../agent/agent.ts';
import * as module_1 from '../../agent/channels/eve.ts';
```

### Runtime graph

`resolveRuntimeAgentGraph()` hydrates the manifest and the module map into a runtime bundle:

- Resolves the root agent and subagents.
- Merges framework tools with authored tools.
- Authored tools with the same name replace defaults.
- `disableTool()` removes defaults if the slug points to a valid framework tool.
- Authored channels replace framework channels with the same name.
- `disableRoute()` removes framework channels if the slug points to a valid framework channel.
- If there are connections, it injects a `connection_search` dynamic resolver.
- Builds registries for tools, hooks, sandbox and subagents.

### Internal dynamic capabilities

The dynamic runtime uses scopes:

- Dynamic tools:
  - `session.started`: durable session metadata.
  - `turn.started`: durable turn metadata.
  - `step.started`: live step closures.
- Dynamic skills:
  - `session.started`
  - `turn.started`
- Dynamic instructions:
  - `session.started`
  - `turn.started`

Reason: instructions and skills affect the system prompt, the most sensitive area for prompt caching, so they do not change on every step.

For session/turn dynamic tools:

- Eve stores durable metadata: name, description, schema, resolver slug, entry key, step function name and serialized closure vars.
- Replay does not re-invoke resolvers; it rebuilds execute from registered workflow steps.
- Step-scoped tools keep live closures and are re-resolved on every step.
- The effective order is step > turn > session. The first definition of a name wins in `buildToolSetFromDefinitions`.
- After that, dynamic tools override authored/default tools with the same name.

Important limitation: `needsApproval` on dynamic tools is only honored for step-scoped tools; session/turn-scoped ones are replayed from durable metadata and cannot carry that function.

### Workflow runtime

`createWorkflowRuntime()` creates a Workflow-backed runtime:

- The long-lived driver uses the `workflowEntry` workflow.
- Each turn is dispatched as a `turnWorkflow` child workflow.
- The driver owns the event stream.
- `getEventStream(sessionId, { startIndex })` reads NDJSON from the run.
- `deliver()` resumes a hook by `continuationToken`; if it does not exist, it throws `RuntimeNoActiveSessionError`.
- Workflow references are stable and carry no package version:
  - `workflow//eve//workflowEntry`
  - `workflow//eve//turnWorkflow`
- In Vercel production it tries `deploymentId: "latest"`; in preview/local it does not, because previews do not have the same branch/latest semantics.

## HTTP protocol and streaming

Main Eve channel routes:

```bash
POST /eve/v1/session
POST /eve/v1/session/:sessionId
GET  /eve/v1/session/:sessionId/stream
GET  /eve/v1/info
GET  /eve/v1/health
```

Two different handles:

- `continuationToken`: for sending follow-ups to the same conversation. It belongs to the channel.
- `sessionId` / `runId`: for streaming and inspection. It belongs to the runtime.

Important NDJSON stream events:

- `session.started`
- `turn.started`
- `message.received`
- `step.started`
- `actions.requested`
- `action.result`
- `input.requested`
- `subagent.called`
- `subagent.completed`
- `reasoning.appended`
- `reasoning.completed`
- `message.appended`
- `message.completed`
- `result.completed`
- `compaction.requested`
- `compaction.completed`
- `authorization.required`
- `authorization.completed`
- `step.completed`
- `step.failed`
- `turn.completed`
- `turn.failed`
- `session.waiting`
- `session.failed`
- `session.completed`

Streams are replayable. `startIndex` lets you reconnect by event index.

## Harness and default tools

Every Eve agent comes with a default harness with an agent loop and built-in tools:

| Tool                | Runs/affects                                 |
| ------------------- | -------------------------------------------- |
| `bash`              | shell command in the sandbox                 |
| `read_file`         | text read with line numbers in the sandbox   |
| `write_file`        | full write with read-before-write/stale-read |
| `glob`              | file search in the sandbox                   |
| `grep`              | regex search in the sandbox                  |
| `web_fetch`         | fetch from the app runtime                   |
| `web_search`        | provider-managed search                      |
| `todo`              | durable per-session list                     |
| `ask_question`      | HITL: asks the user and parks                |
| `agent`             | copy-of-self subagent                        |
| `load_skill`        | loads a skill into context                   |
| `connection_search` | discovers connection tools                   |

You can:

- Override them by creating `agent/tools/<slug>.ts`.
- Disable them with `disableTool()` in a file with the same slug.
- Wrap built-ins from `eve/tools/defaults`.

Real example in the PR triage template: they disable `bash`, `glob`, `grep`, `read_file`, `write_file` because the agent triages from the injected diff and should only use `apply_labels`, with no sandbox.

## Authored tools

Tools:

- live in `agent/tools/<name>.ts`.
- are defined with `defineTool`.
- run in the app runtime, with access to `process.env`.
- never run during discovery.
- require `inputSchema`.
- can have `outputSchema`.
- can transform output for the model with `toModelOutput`.
- can declare `auth`.
- can declare `needsApproval`.

Base pattern:

```ts
import { defineTool } from 'eve/tools';
import { z } from 'zod';

export default defineTool({
  description: 'Get the current weather for a city.',
  inputSchema: z.object({ city: z.string().min(1) }),
  async execute({ city }, ctx) {
    return { city, condition: 'Sunny' };
  },
});
```

## Human-in-the-loop

HITL comes in two forms:

- Approval: the tool wants to run and a person approves/denies it.
- Question: the model calls `ask_question` and parks while it waits for an answer.

Helpers:

- `never()`: default if `needsApproval` is omitted.
- `once()`: approve once per session.
- `always()`: approve every call.
- Custom predicate: decides based on the input.

Important: if `needsApproval` is omitted, the tool can run without approval. The doc recommends approval for sensitive, irreversible, regulated, financial, health, employment, housing, legal, safety-impacting or user-impacting actions, or actions with external side effects.

## Skills

Skills are Markdown procedures loaded on demand by `load_skill`.

Forms:

- Flat file: `agent/skills/forecast.md`
- Package: `agent/skills/research/SKILL.md` with `references/`, `assets/`, `scripts/`
- TS: `defineSkill` from `eve/skills`

Rules:

- The description is a routing hint, not a label.
- Loading a skill only adds instructions, not new actions.
- Tools remain the executable surface.
- Skills are scoped per agent; a subagent and the root do not share skills.
- Sibling files can be read at runtime with `ctx.getSkill(id).file(path)`.

This fits the Agent Skills standard: an existing `SKILL.md`-compatible skill should port to Eve.

## Author-facing dynamic capabilities

`defineDynamic` lets you resolve tools, skills and instructions per session, turn or step.

Uses:

- Capabilities per tenant/team/user.
- Playbooks per plan or feature flag.
- Tools generated from a database or catalog.
- Instructions per channel or profile.

Events:

| Event             | Tools | Skills | Instructions |
| ----------------- | ----- | ------ | ------------ |
| `session.started` | yes   | yes    | yes          |
| `turn.started`    | yes   | yes    | yes          |
| `step.started`    | yes   | no     | no           |

Critical detail: in dynamic tools, `execute` must be inline (`execute: (...) => ...` or method shorthand). If you use `execute: myFn` or a factory, it may work at first but not survive durable replay/resume, because the transform needs to rebuild closures.

## State

`defineState` creates durable per-session memory.

- `get()`: reads the current value.
- `update(fn)`: replaces it based on the current value.
- Requires an active Eve context.
- Not shared with subagents.
- Useful for session working memory: budget, checklist, glossary, flags.
- Does not replace a database if the data must live across sessions/users.

## Sandbox

Each agent has exactly one sandbox per logical session.

Trust boundary:

| Aspect                  | App runtime            | Sandbox               |
| ----------------------- | ---------------------- | --------------------- |
| `process.env` / secrets | yes                    | no                    |
| Your own Node code      | yes                    | no                    |
| Network                 | no runtime restriction | configurable policy   |
| FS                      | the app's own          | isolated `/workspace` |

Backends:

- `vercel()` from `eve/sandbox/vercel`: Vercel Sandbox.
- `docker()` from `eve/sandbox/docker`: local Docker.
- `microsandbox()` from `eve/sandbox/microsandbox`: lightweight local VM.
- `justbash()` from `eve/sandbox/just-bash`: JS fallback, no real binaries.
- `defaultBackend()` picks Vercel on Vercel, then Docker, microsandbox, just-bash.

Handle methods:

- `run`
- `spawn`
- `readTextFile` / `writeTextFile`
- `readBinaryFile` / `writeBinaryFile`
- `readFile` / `writeFile`
- `removePath`
- `resolvePath`
- `setNetworkPolicy`

Egress:

- Default: `allow-all`.
- Production/sensitive data: use `deny-all` or an explicit allow-list.
- Domain allow-lists and credential brokering are supported by `vercel()` and `microsandbox()`.
- Docker only supports allow-all/deny-all.
- just-bash rejects `setNetworkPolicy`.

Lifecycle:

- `bootstrap({ use })`: template-scoped; runs when the template is built.
- `onSession({ use, ctx })`: per durable session; the right place for user-specific setup, network policy and per-principal credentials.

## Connections

Connections link the agent to external servers that are not authored in the project:

- MCP with `defineMcpClientConnection`.
- OpenAPI 3.x with `defineOpenAPIConnection`.

The model does not see the URL or the credentials. It uses `connection_search`, discovers tools and calls qualified names:

```text
<connection>__<tool>
linear__list_issues
petstore__getInventory
```

Supported auth:

- No auth for public/local services.
- Static token with `getToken`.
- Custom headers.
- Interactive OAuth with Vercel Connect: `connect("linear")` from `@vercel/connect/eve`.
- Self-hosted interactive OAuth with `defineInteractiveAuthorization`.

Controls:

- MCP: `tools.allow` or `tools.block`.
- OpenAPI: `operations.allow` or `operations.block`.
- Connection-level `approval` (`never`, `once`, `always`).

Order with approval + auth: approval first, then sign-in. Eve stores the approval in session state so it does not ask for approval twice after OAuth.

## Channels

A channel is the edge adapter between a platform and the agent. It does three things:

1. Normalizes platform input into a message.
2. Owns the `continuationToken`.
3. Decides delivery/response.

Main built-ins:

- Eve HTTP channel: default, `/eve/v1/*`.
- Slack.
- Discord.
- Microsoft Teams.
- Telegram.
- Twilio SMS/WhatsApp/voice/transcription.
- GitHub.
- Linear Agent.
- Custom channels with `defineChannel`.

Eve uses Chat SDK card-builder components for Slack, but does not use the Chat SDK runtime.

### Channel matrix

| Channel         | Default route(s)                                                                     | Auth/verification                                                            | Dispatch                                                                      | Delivery                                                                | Notes                                                                                               |
| --------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Eve HTTP        | `/eve/v1/session`, `/eve/v1/session/:sessionId`, `/eve/v1/session/:sessionId/stream` | `localDev()`, `vercelOidc()` by default; `placeholderAuth()` in the scaffold | POST creates/continues sessions                                               | NDJSON stream and TS/frontend client                                    | Enabled even if `agent/channels/eve.ts` does not exist; write that file only for custom auth/config |
| Slack           | `/eve/v1/slack`                                                                      | Vercel Connect manages the bot token and webhook verifier                    | `app_mention` and `message.im`; hooks `onAppMention`, `onDirectMessage`       | Threads, typing indicators, Block Kit/cards, HITL with buttons/modals   | The OAuth auth challenge is delivered as ephemeral/DM; it does not expose the raw token             |
| Discord         | `/eve/v1/discord`                                                                    | Ed25519 signatures, app id, bot token, public key                            | Slash/app commands, components, modals                                        | Fast ACK and background work; edits the deferred response and followups | Discord requires an ACK within 3s; long texts are split at 2000 chars                               |
| Microsoft Teams | `/eve/v1/teams`                                                                      | Bot Framework bearer JWT                                                     | Personal chat and messages that mention the bot                               | Bot Framework Connector, Adaptive Cards for HITL                        | Proactive sessions require an existing conversation reference                                       |
| Telegram        | `/eve/v1/telegram`                                                                   | `X-Telegram-Bot-Api-Secret-Token`                                            | Private chats and groups that address a message to the bot                    | `sendMessage`, inline keyboard HITL                                     | Does not call `setWebhook`; you register it separately. 4096 char limit per message                 |
| Twilio          | `/eve/v1/twilio/messages`, `/voice`, `/voice/transcription`                          | `X-Twilio-Signature`                                                         | SMS and voice transcriptions                                                  | SMS via Messages API; voice with TwiML `Gather`                         | Raw continuation token `From:To`; proactive outbound requires a sender                              |
| GitHub          | `/eve/v1/github`                                                                     | GitHub App id/private key/webhook secret                                     | @mentions in issues, PRs or review comments; opt-in hooks for issue/PR opened | Native GitHub comments                                                  | Injects the PR diff and can check out a ref in the sandbox on the Vercel backend                    |
| Linear Agent    | `/eve/v1/linear`                                                                     | Linear HMAC signature or custom verifier                                     | `AgentSessionEvent` (`created`, `prompted`)                                   | Linear Agent Activities: thought/action/elicitation/response/error      | Uses the Agent Sessions surface, not normal comments                                                |
| Custom          | `GET`/`POST`/`PUT`/`PATCH`/`DELETE`/`WS` routes                                      | The author defines it in route handlers                                      | `send(...)` or cross-channel `receive(...)`                                   | events map per stream event                                             | Supports WebSocket, metadata, file uploads and re-keying the continuation token                     |

### Integrations gallery and scaffolding

The `@vercel/eve-catalog` catalog contains channels and connections with two surfaces:

- `gallery`: appears in docs/integrations.
- `scaffoldable`: the CLI can generate it today.

Channels the CLI can scaffold:

- `slack`
- `eve` Web Chat

Channels in the gallery that are configured by hand today:

- Discord
- Microsoft Teams
- Telegram
- Twilio
- GitHub
- Linear Agent

Scaffoldable/gallery connections:

| Connection | Protocols     | Endpoint/capability                                                                                                       | Documented auth modes |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Linear     | MCP           | `https://mcp.linear.app/sse`; issues, projects, cycles, comments                                                          | user, app             |
| Notion     | MCP + OpenAPI | MCP `https://mcp.notion.com/mcp`; OpenAPI `https://developers.notion.com/openapi.json` with base `https://api.notion.com` | user, app, JWT bearer |
| Datadog    | MCP           | `https://mcp.datadoghq.com/api/mcp`; metrics, monitors, logs, incidents                                                   | JWT bearer            |
| Honeycomb  | MCP           | `https://mcp.honeycomb.io/mcp`; traces, queries, datasets                                                                 | JWT bearer            |

Current CLI for channels:

- `eve channels add slack`
- `eve channels add web`
- `eve channels list --json`

## Auth and route protection

Eve has two independent systems:

1. Inbound route auth: who can call the HTTP routes.
2. Outbound tool/connection auth: how the agent accesses external services.

Route auth protects:

- `POST /eve/v1/session`
- `POST /eve/v1/session/:sessionId`
- `GET /eve/v1/session/:sessionId/stream`

`GET /eve/v1/health` is public.

Fail-closed auth:

- If no `AuthFn` accepts, 401.
- Anonymous access requires `none()` explicitly.
- `placeholderAuth()` keeps production closed until it is replaced.

Helpers:

- `localDev()`
- `vercelOidc()`
- `none()`
- `httpBasic(...)`
- `jwtHmac(...)`
- `jwtEcdsa(...)`
- `oidc(...)`

Critical warning: route auth does not enforce session ownership. If several users/tenants can reach the same route, the app must implement per-user/tenant/session authorization.

## Hooks

Hooks subscribe to stream events and run after the event has been durably recorded.

Uses:

- audit logs
- metrics
- alerting
- persisting events/sessions to your own DB

If a hook throws, it counts as a real failure: it can turn into `turn.failed`, or escalate to `session.failed` if it breaks during a failure cascade. For non-critical hooks, wrap them in `try/catch`.

## Subagents

There are two types:

- Built-in `agent` tool: a copy of the current agent; it shares the sandbox and tools, with fresh history/state.
- Declared subagents: `agent/subagents/<id>/`, with their own `agent.ts`, tools, skills, sandbox and state.
- Remote agents: `defineRemoteAgent` under `agent/subagents/`, pointing to another Eve deployment.

Rules:

- The parent passes all the context the child needs in `message`.
- The child does not see the parent's history.
- A declared subagent does not inherit the root's slots.
- The subagent name shares a namespace with tools; collisions fail at build time.
- Do not use subagents as a security boundary on their own; approvals/auth must sit where the actions are.

### Remote agents

`defineRemoteAgent` lets you call another Eve deployment as if it were a local subagent.

Example:

```ts
import { defineRemoteAgent } from 'eve';
import { vercelOidc } from 'eve/agents/auth';

export default defineRemoteAgent({
  url: 'https://weather-agent.example.com',
  description: 'Answers weather questions.',
  auth: vercelOidc(),
});
```

Fields:

- `url`: base URL of the remote deployment.
- `description`: description the model sees.
- `auth`: optional outbound auth.
- `headers`: static or lazy headers.
- `path`: default `/eve/v1/session`.
- `outputSchema`: schema for remote task mode.

How it works:

1. The parent starts a task-mode session on the remote.
2. The parent parks the turn and passes a callback URL.
3. The remote completes or fails.
4. The parent receives the terminal callback and resumes the turn.

Supported outbound auth:

- `vercelOidc()`
- `bearer(token)`
- `basic({ username, password })`

Failure model:

- A failure to start the remote comes back as a failed tool result.
- A failure after the start arrives through the terminal callback.
- Callback delivery runs as a durable step; if the POST fails, it is retried.

### Experimental Workflow tool

`ExperimentalWorkflow` enables a `Workflow` tool so the model can write JavaScript that coordinates subagents as a single durable step.

Opt-in:

```ts
export { ExperimentalWorkflow as default } from 'eve/tools';
```

Expected file:

```text
agent/tools/workflow.ts
```

It can orchestrate:

- built-in `agent`
- declared subagents
- remote agents

It cannot access:

- filesystem
- network
- shell
- skills
- connections
- `process`
- imports

Execution runs in a small QuickJS sandbox. It is an allowlist: the program only sees `tools.<subagentName>` and the language built-ins.

What it is good for:

- programmatic fan-out
- sequences where one subagent's output feeds another
- runtime aggregations that do not fit well in separate tool calls

Risk:

- Marked experimental.
- The model writes orchestration code; test it with evals before using it in critical flows.

## Schedules

Schedules live in `agent/schedules/` and are root-only.

Two forms:

- `markdown`: fire-and-forget prompt in task mode.
- `run`: handler that can hand work to a channel with `receive`.

Cron:

- 5 fields, minute resolution.
- On Vercel it becomes a Vercel Cron Job and is evaluated in UTC.
- `eve dev` does not fire schedules on cron; there is a one-shot dev route:

```bash
curl -X POST http://localhost:3000/eve/v1/dev/schedules/<scheduleId>
```

When self-hosted, `eve start` starts the Nitro scheduler. If you adapt the output to another host that only serves HTTP, you have to make sure Nitro scheduled tasks run, or use your own scheduler.

## Frontend and client SDK

Frontend:

- React: `useEveAgent` from `eve/react`.
- Vue: `eve/vue`.
- Svelte: `eve/svelte`.
- Next.js: `withEve` from `eve/next`.
- Nuxt: `eve/nuxt` module.
- SvelteKit: `eve/sveltekit` plugin.

`useEveAgent` handles:

- creating a durable session
- sending turns
- response streaming
- reducing to UI messages
- `ready`/`submitted`/`streaming`/`error` state
- HITL responses
- per-turn `clientContext`
- `initialSession` and cursor persistence

Low-level SDK:

- `Client` from `eve/client`.
- `client.session()`.
- `health()`.
- Dynamic bearer/basic auth per request.
- `ClientSession` stores `sessionId`, `continuationToken` and the stream cursor.

Important client details:

- `send("text")` starts or continues a turn.
- `send({ message, clientContext })` adds context for that turn only; it does not persist in durable history.
- `send({ message: UserContent[] })` accepts AI SDK-style attachments, for example PDFs as data URLs.
- `send({ inputResponses })` answers HITL approvals or questions.
- `MessageResponse` is single-use: consume it with `result()` or with `for await`, not both.
- `result()` returns `status`, `message`, `events`, `sessionId` and `data`.
- `status` can be `waiting`, `completed` or `failed`.
- Transient stream disconnects reconnect from `streamIndex`; the default `maxReconnectAttempts` is `3`.
- `session.stream({ startIndex })` lets you reopen an existing stream.

Continuations:

- `continuationToken`: resumes the conversation.
- `sessionId`: identifies the stream/history.
- `streamIndex`: index of the consumed events.
- Persisting all three as `SessionState` is better than storing only the token.
- If a turn ends in `session.completed` or `session.failed`, the client resets local state; the next `send` opens a new session.

Per-turn output schema:

- `send<T>({ message, outputSchema })` asks for a structured result.
- Accepts JSON Schema or Standard Schema (Zod, Valibot, ArkType).
- The server validates; the client does not revalidate client-side.
- The stream emits `result.completed`.
- `result().data` contains the last `result.completed` of the turn, or `undefined` if no structure was requested or it was not satisfied.
- It does not persist across turns; each turn that needs it must pass it.

`withEve` for Next.js:

- Adds rewrites so `/eve/v1/:path*` points to the Eve service.
- In development it starts `eve dev --no-ui --port 0` for the agent and rewrites to that URL.
- In Vercel production it rewrites to the Eve service's private prefix, default `/_eve_internal/eve`.
- Outside Vercel production it can serve `.output/server/index.mjs` on a stable local port or use `EVE_NEXT_PRODUCTION_ORIGIN`.
- Key options:
  - `eveRoot`
  - `eveBuildCommand`
  - `servicePrefix`
  - `devServerTimeoutMs`

## Evals

Evals live in `evals/*.eval.ts` and use `defineEval`.

Properties:

- They run against the agent's real HTTP endpoints.
- The runner starts a real server or points to one.
- Assertions can be run-level, value checks or LLM-as-judge.
- `t.send`, `t.respond`, `t.expectInputRequests`, etc.
- `t.completed()`, `t.calledTool("...")`, `t.usedNoTools()`, `t.toolOrder([...])`.
- `t.check(t.reply, includes("..."))`.
- `t.judge.autoevals.*`.

Config:

- `evals/evals.config.ts` with `defineEvalConfig`.
- Reporters such as Braintrust or JUnit.

CLI:

```bash
eve eval
eve eval weather
eve eval --url https://<app>
eve eval --strict
eve eval --json
eve eval --junit results.xml
```

Documented exit codes:

- `0`: gates pass.
- `1`: eval/check/error/strict threshold failure.
- `2`: configuration error.

## Observability

Three surfaces:

1. Workflow run tags `$eve.*`: automatic, no configuration.
2. OpenTelemetry export: via `agent/instrumentation.ts`.
3. Runtime context events: `events["step.started"]`.

Run tags:

- `$eve.type`: session/turn/subagent.
- `$eve.parent`
- `$eve.root`
- `$eve.subagent`
- `$eve.trigger`
- `$eve.title`
- `$eve.model`
- `$eve.input_tokens`
- `$eve.output_tokens`
- `$eve.cache_read_tokens`
- `$eve.tool_count`

Agent Runs in the Vercel dashboard:

- Auto-detects `eve`.
- Appears under Observability.
- Currently gated by team, according to the docs.
- Separate from OTel exporters.

## Deployment

On Vercel:

- `eve build` generates `.vercel/output`.
- The Workflow SDK uses Vercel Workflow.
- `defaultBackend()` uses Vercel Sandbox.
- Schedules become Vercel Cron.
- Sandbox templates are prewarmed at build time if `VERCEL` and `VERCEL_DEPLOYMENT_ID` are set.

Outside Vercel:

- `eve build`
- `PORT=3000 eve start --host 0.0.0.0`
- Nitro output in `.output/`.
- The local Workflow world usually persists state under `.workflow-data`.
- The default sandbox tries Docker, microsandbox, just-bash.
- If you do not want to depend on AI Gateway, use a direct AI SDK provider and a provider API key.

Minimal checklist:

- `eve build` passes.
- Secrets/model creds configured.
- Correct sandbox backend.
- `placeholderAuth()` replaced.
- Health/session/stream smoke tests pass.
- Network policy reviewed.
- Sensitive tools behind approval.
- OTel/eval providers approved for the data.

## Official Build an Agent tutorial

The `docs/tutorial/` folder builds an analytics assistant end to end in nine steps. It is the most complete tutorial for understanding Eve's "happy path".

### 1. Your First Agent

Goal: create `analytics-assistant`, set the model and the prompt.

Concepts:

- Requires Node 24+.
- The default uses AI Gateway; if there is no `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN`, the TUI walks you through `/model`.
- `npx eve@latest init analytics-assistant` creates the directory, installs deps, initializes Git and starts the dev server for humans.
- `agent/agent.ts` defines the model.
- `agent/instructions.md` holds identity and permanent rules.

### 2. How It Runs

Defines the three core terms:

- session: durable conversation.
- turn: message + the work it triggers.
- step: durable checkpoint.

Key message: a turn runs as a durable workflow. Completed steps do not re-run; interrupted steps can re-run. Non-idempotent side effects must be idempotent or gated.

### 3. Query Sample Data

Adds `run_sql` as a typed tool:

- `agent/lib/sample-db.ts` holds an in-memory SQLite database with `sql.js`.
- `agent/tools/run_sql.ts` uses `defineTool`.
- The filename `run_sql.ts` becomes the tool `run_sql`.
- Output is capped at 500 rows so it does not flood the context.
- Tools run in the app runtime with `process.env`, not in the sandbox.

### 4. Connect a Warehouse

Replaces the toy dataset with an OAuth MCP connection:

- `agent/connections/warehouse.ts`
- `defineMcpClientConnection`
- `connect("warehouse")` from `@vercel/connect/eve`
- Tools appear as `warehouse__<tool>`
- OAuth is user-scoped by default.
- If the token is missing, the turn parks, the channel shows sign-in, and the turn then resumes from the same step.
- The token never reaches the model; Eve resolves it just before calling the MCP server.

Note: that guide describes Vercel Connect as a private beta. The tutorial lets you continue with the sample dataset if you do not have access.

### 5. Run Analysis

Introduces the sandbox:

- `agent/sandbox/workspace/schema.sql` is mounted at `/workspace/schema.sql`.
- The model can read the schema/notes before writing queries.
- The built-ins `bash`, `read_file`, `write_file` point to the sandbox.
- A custom tool can use `ctx.getSandbox()` to write files and run commands.
- The `chart_series` example writes JSON + Python and generates a PNG.
- The base sandbox does not include matplotlib; you have to install it in bootstrap or use a custom image.
- Secrets do not enter the sandbox.

### 6. Remember Definitions

Introduces `defineState`:

- `defineState("analytics.glossary", initial)` creates a typed durable slot.
- The tools `define_metric` and `recall_metrics` update/read the glossary.
- The state persists across turns of the same session.
- State is per-session and isolated per agent; subagents do not share it.

### 7. Team Playbooks

Introduces dynamic skills:

- `agent/skills/team-playbook.ts`
- `defineDynamic({ events: { "session.started": ... } })`
- Reads `ctx.session.auth.current?.attributes.team`.
- Returns a `defineSkill` with a Growth/Finance playbook.
- The skill stays available for the whole session.
- Routing depends on authenticated claims, not on the user's text.

### 8. Guard the Spend

Introduces cost-based HITL:

- `needsApproval` can be a predicate over `toolInput`.
- Example: estimate the GB scanned and gate expensive queries.
- If the user approves, the run resumes and executes.
- If the user denies, the tool is skipped and the model receives the reason.
- Each session has only one active continuation; stale responses are rejected.

### 9. Ship It

Turns the TUI into a web app:

- `npx eve channels add web` adds a Next.js app.
- `next.config.ts` uses `withEve(nextConfig)`.
- `AgentChat` uses `useEveAgent`.
- Replaces `placeholderAuth()` with real auth.
- `agent/channels/eve.ts` must have app auth before `localDev()`/`vercelOidc()`.
- Deploy:

```bash
vercel deploy
```

Remote smoke test:

```bash
npx eve dev https://your-analytics-app.vercel.app
```

Final result of the tutorial: an authenticated web agent that queries the warehouse, runs analysis in the sandbox, charts the results, remembers definitions, loads playbooks per team and asks for approval before spending.

## Official templates

### `vercel-labs/eve-slack-agent-template`

Minimal Slack starter.

Stack:

- Eve
- Slack via Vercel Connect
- TypeScript
- `eve dev/build/start`

Agent:

- `agent/agent.ts`
- `agent/channels/slack.ts`
- `agent/instructions.md`
- `agent/skills/plan_a_trip.md`
- `agent/tools/get_weather.ts`

Usage:

- The Deploy button creates a Slack connector with a trigger to `/eve/v1/slack`.
- Local: `vercel link`, `vercel env pull`, `pnpm dev`.

### `vercel-labs/eve-content-agent-template`

Slack content assistant. It drafts blog posts, LinkedIn posts, release notes and newsletters from Slack, using Notion as the source/publishing target and Vercel Blob for assets.

Stack:

- Eve
- Slack channel via Vercel Connect
- Notion MCP via Vercel Connect
- Vercel Blob with OIDC
- AI Gateway, default Claude Opus 4.8
- Vercel Sandbox
- Ultracite/Biome

Agent:

- `agent/agent.ts`: `anthropic/claude-opus-4.8`
- `agent/channels/slack.ts`
- `agent/connections/notion.ts`
- `agent/sandbox.ts`
- Blob tools:
  - `upload_asset`
  - `list_assets`
  - `get_asset_info`
  - `download_asset`
  - `delete_asset`
- deterministic tool:
  - `lint_against_style`
- skills:
  - `blog-style`
  - `linkedin-style`
  - `release-notes-style`
  - `newsletter-style`

Notable pattern:

- `delete_asset` uses `needsApproval: always()`.
- The style skills have `banned-words.json` and examples.
- No static keys; Slack/Notion via Connect, Blob/model via OIDC.

### `vercel-labs/eve-pr-triage-agent-template`

GitHub App that triages PRs when they are opened.

Stack:

- Eve
- GitHub channel
- GitHub App webhook
- AI Gateway/model `anthropic/claude-sonnet-4.6`
- YAML ruleset `triage.yml`

Agent:

- `agent/channels/github.ts`
- `agent/tools/apply_labels.ts`
- `agent/skills/triage.ts`
- default sandbox tools disabled:
  - `bash.ts`
  - `glob.ts`
  - `grep.ts`
  - `read_file.ts`
  - `write_file.ts`

Notable pattern:

- v1 triages from the diff that the GitHub channel injects automatically.
- It does not pay for a sandbox or a checkout.
- It applies labels and posts a single triage comment.
- The README warns that it does not re-triage later pushes to the same PR; that is a v2 item.

### `vercel-labs/personal-agent-template`

Durable personal AI agent with web chat, Slack, iMessage, Linear and long-term memory.

Stack:

- Eve
- Nuxt
- Nuxt UI
- NuxtHub/SQLite
- Better Auth
- Drizzle
- Vercel Connect
- Sendblue for iMessage/SMS

Agent:

- channels:
  - `eve.ts`
  - `slack.ts`
  - `sendblue.ts` custom
- connection:
  - `linear.ts`
- tools:
  - `save_memory.ts`
  - `weather.ts`
- skills:
  - `daily-summary.md`
- dynamic instructions:
  - `agent/instructions.ts`

Notable patterns:

- Dynamic instructions inject the user's profile/memory per session.
- `save_memory` requires approval (`always()`).
- For iMessage it adjusts the instructions because that channel has no approval UI.
- Web and Eve share an internal API authenticated by bearer token (`INTERNAL_API_SECRET`).

### `vercel-labs/eve-chat-template`

Persisted Next.js chat for Eve.

Stack:

- Next.js 16
- React 19
- shadcn/ui, Tailwind
- Streamdown
- Better Auth Sign in with Vercel
- Drizzle
- Neon
- Upstash Redis
- Eve
- Vercel Connect for Slack, Notion, Linear, Sentry

Agent:

- `agent/agent.ts`
- `agent/channels/eve.ts`
- `agent/channels/slack.ts`
- `agent/connections/linear.ts`
- `agent/connections/notion.ts`
- `agent/connections/sentry.ts`
- `agent/skills/plan_a_trip.md`
- `agent/tools/get_weather.ts`

Frontend:

- `next.config.ts` uses `withEve(nextConfig)`.
- The browser uses `useEveAgent()` from `eve/react`.
- It stores session cursors and event snapshots to resume `/chat/[id]`.

Includes:

- persisted chat history
- Redis rate limiting
- sidebar
- HITL rendering
- tool rendering
- connections menu

## Tests, fixtures and inferred coverage

The main repo has many unit/integration/scenario suites. Areas covered, judging by test names:

- discovery of the agent project, skills, sandbox, subagents
- compiler manifest/module-map/normalize
- CLI init/info/link/deploy/channels
- dev TUI, prompt commands, model setup, rendering
- client sessions, reducers, output schema
- React/Vue/Svelte `useEveAgent`
- dynamic instructions/skills/tools lifecycle
- hooks lifecycle
- durable session store and migrations
- workflow entry/runtime/errors/steps
- sandbox backends: Docker, microsandbox, just-bash, Vercel
- bash/read/write/glob/grep tools
- subagent HITL proxy and delegation
- tool auth
- web fetch
- harness compaction, tool loop, input requests, provider tools, prompt cache
- Nitro host/routes/schedules/output
- channel auth
- Slack, Discord, GitHub, Linear, Telegram, Teams, Twilio tests
- eval runner/assertions/reporters

E2E fixtures:

- `agent-basic-runtime`
- `agent-channels`
- `agent-openapi-swagger`
- `agent-schedules`
- `agent-skills`
- `agent-subagents`
- `agent-subagents-hitl`
- `agent-tools`
- `agent-tools-hitl`
- `agent-tools-sandbox`

App fixtures:

- `weather-agent`
- `agent-tui-client`

Framework/template fixtures inside the repo:

- `apps/frameworks/next`
  - Eve agent + `agent/channels/eve.ts`
  - Next app with `next.config.ts`
  - `whoami` tool
- `apps/frameworks/nuxt`
  - Eve agent + Nuxt module
  - `get_weather` tool
- `apps/frameworks/sveltekit`
  - Eve agent + SvelteKit integration
  - `get_weather` tool
- `apps/templates/web-chat-next`
  - Next web chat template
  - `agent/tools/randomize.ts`
  - `agent/channels/eve.ts`

Fixtures that are especially useful for understanding the runtime:

- `apps/fixtures/weather-agent`
  - small README
  - `get-weather.md` skill
  - `get_weather.ts` tool
- `apps/fixtures/agent-tui-client`
  - custom channel `anchored.ts`
  - MCP user stub connection
  - `echo-marker` subagent

My read: the repo does not only test isolated units. It has fixtures for a minimal agent, channels, OpenAPI, schedules, skills, subagents, HITL, sandbox tools, web frameworks and the TUI, which gives fair confidence in the coverage of the framework surface.

## Live risks and open topics

Relevant open issues observed:

- `#154`: unexpected AI Gateway rate limiting after a few turns.
- `#149`: Discord channel 401 due to token fallback.
- `#147`: define Slack HITL behavior with multi-action payloads.
- `#145`: feature request for a policy/governance interface in tool lifecycle hooks.
- `#136`: throughput/TTFT degrades in `eve dev` as parked sessions pile up.
- `#134`: stream reconnect exhaustion clears the client session while the durable turn keeps going.
- `#133`: the bundler fails on relative imports whose basename contains dots.
- `#131`: allow Anthropic/OpenAI tokens, not just API keys.
- `#126`: stopping a response clears the client session, and the next message starts a new conversation.
- `#124`: client interruption cuts the stream, but the server turn keeps running.
- `#120`: Vercel Sandbox readFile violates the Web stream contract.

Recent open PRs show the active areas:

- server/client/delegated agents cancellation
- HITL Slack bound to verified requester
- Discord auth fallback
- remote TUI auth
- dev debugging
- realtime voice control plane
- sandbox/network policy fixes

Public discussions:

- using OpenRouter or another direct provider instead of AI Gateway
- ideal structure for multiple root agents with shared tools/skills
- self-hosting
- knowledge folder for Eve agents

Interpretation: Eve is under very active development. For production, it is worth pinning the version, reading the changelog/release notes before upgrading and covering your own flows with evals.

## Quick technical comparison

Eve differs from a simple "agent SDK" because it brings:

- filesystem conventions
- durable runtime
- HTTP session protocol
- replayable streaming
- sandbox with egress policy
- platform channels
- MCP/OpenAPI connections with auth
- built-in HITL
- subagents
- schedules
- evals
- frontend hooks
- Vercel deployment/output integration

As a mental comparison with Next.js:

- `agent/` is the equivalent of the app convention.
- `tools/`, `skills/`, `channels/`, `connections/` are slots like routes/components/server actions, but for agents.
- Build/discovery turns files into a manifest/runtime.
- The Vercel deployment detects the framework and adds Agent Runs observability.

## Recommendations for trying it

For a first spike:

1. Use Node 24+.
2. Create an isolated project, not this portfolio:

   ```bash
   npx eve@latest init my-agent
   ```

3. Run:

   ```bash
   eve info
   eve dev
   ```

4. Keep `agent/instructions.md` short.
5. Create a simple tool with `defineTool`.
6. Disable `bash` if you do not need it.
7. For production, do not leave `placeholderAuth()` in place.
8. Lock down the sandbox network policy if you handle real data.
9. Put `needsApproval: always()` on irreversible side effects.
10. Write 2-3 smoke evals before touching the model/prompts.

Practical notes:

- The scaffold pins `engines.node` to `24.x`; when testing with Node `v25.2.1`, npm emits `EBADENGINE`, although `tsc` and `eve build` passed on the minimal scaffold.
- If you run `eve init` from a coding agent, it does not start the TUI and leaves instructions for the human to run `npm exec -- eve dev`.
- In human shells, the doc says `eve init` keeps the terminal open because it starts the dev server/TUI; it is best to run it in a process you can control.

To choose a template:

- Minimal Slack bot: `eve-slack-agent-template`.
- Content agent: `eve-content-agent-template`.
- PR triage: `eve-pr-triage-agent-template`.
- Full-stack personal agent: `personal-agent-template`.
- Persisted Next.js web chat: `eve-chat-template`.

## Commands run to reproduce this research

```bash
git clone --depth=1 https://github.com/vercel/eve.git /tmp/eve-research/eve
git clone --depth=1 https://github.com/vercel-labs/eve-content-agent-template.git /tmp/eve-research/templates/eve-content-agent-template
git clone --depth=1 https://github.com/vercel-labs/personal-agent-template.git /tmp/eve-research/templates/personal-agent-template
git clone --depth=1 https://github.com/vercel-labs/eve-pr-triage-agent-template.git /tmp/eve-research/templates/eve-pr-triage-agent-template
git clone --depth=1 https://github.com/vercel-labs/eve-slack-agent-template.git /tmp/eve-research/templates/eve-slack-agent-template
git clone --depth=1 https://github.com/vercel-labs/eve-chat-template.git /tmp/eve-research/templates/eve-chat-template
npm view eve --json
npx eve@latest --version
npx eve@latest --help
npx eve@latest init --help
npx eve@latest dev --help
npx eve@latest start --help
npx eve@latest info --help
npx eve@latest eval --help
npx eve@latest channels --help
npx eve@latest init probe-agent
npm exec -- eve info --json
npm run typecheck
npm run build
curl -s https://api.github.com/repos/vercel/eve/releases/latest
curl -s https://api.github.com/repos/vercel/eve
```

## Coverage and limits of this research

Covered with direct evidence:

- Official landing page, official KB and public `eve.dev` docs.
- `vercel/eve` repo cloned and updated to the `eve@0.12.0` tag.
- npm package `eve@0.12.0` and version metadata.
- Changelog `packages/eve/CHANGELOG.md`.
- Local docs under `docs/`, including getting started, tutorial, channels, connections, sandbox, deployment, evals, frontend/client and concepts.
- Key internal code:
  - discovery
  - compiler artifacts
  - manifest
  - runtime graph
  - dynamic tool/skill/instruction lifecycle
  - workflow runtime
  - routes
  - harness tool loop
  - Next.js `withEve`
- Official templates listed by the Vercel KB.
- Real scaffold with `npx eve@latest init`.
- `eve info --json`, `npm run typecheck` and `npm run build` on the minimal scaffold.
- Relevant public issues, PRs and discussions.

Not covered with real execution because it requires external accounts/credentials:

- Real deploy to Vercel.
- Real Slack/GitHub/Linear/Twilio/Discord/Teams/Telegram webhooks.
- Vercel Connect OAuth end to end.
- Real Vercel Sandbox backend with credential brokering.
- Vercel Workflow production routing `deploymentId: "latest"`.
- Real AI Gateway model call.
- Evals against an agent with real credentials.

Technical read: what is not covered depends on external infrastructure, not on missing local code or documentation. Moving from research to production validation would need a Vercel project with AI Gateway, Connect and at least one real channel configured.
