# Investigacion tecnica de Vercel Eve

<!-- markdownlint-disable MD013 -->

Fecha de investigacion: 2026-06-21

## Estado

Documento vivo. Esta investigacion se esta construyendo a partir de fuentes oficiales, repo publico, paquete npm, documentacion incluida en el paquete, templates oficiales de Vercel Labs, issues/PRs publicos, pruebas del repo y ejecuciones reales de la CLI.

## Resumen ejecutivo

Eve es un framework filesystem-first para construir agentes AI backend durables sobre Vercel. Su idea central es parecida a "Next.js para apps web, pero para agentes": el comportamiento se define mediante convenciones de archivos y carpetas dentro de `agent/`, con instrucciones en Markdown, herramientas en TypeScript, skills cargadas bajo demanda, canales de entrada/salida, conexiones autenticadas, subagentes, schedules y runtime durable.

Segun Vercel, Eve compila ese directorio, conecta infraestructura de agentes y se apoya en varias primitivas de Vercel: AI Gateway para modelos, Vercel Sandbox para ejecucion aislada, Vercel Workflows para durabilidad, Vercel Connect para credenciales y canales, Chat SDK para superficies de chat, y observabilidad/gobernanza de la plataforma.

Mi lectura tecnica: Eve intenta convertir un agente de produccion en una superficie declarativa y auditable. No escribes una aplicacion de agentes como un grafo imperativo enorme; escribes un directorio `agent/` con slots convencionales. El runtime descubre esa superficie, genera manifiestos, levanta rutas HTTP estables, ejecuta turns como workflows durables, conserva estado de sesion, expone streaming NDJSON, y media herramientas, sandbox, OAuth, HITL y subagentes.

Esta abstraccion tiene una consecuencia importante: Eve no es solo un SDK de llamadas LLM. Es un runtime completo de agente backend, con build system, CLI, servidor Nitro, protocolo HTTP, cliente TS, hooks, evals, auth, sandbox, canales y despliegue.

## Hallazgos confirmados

- La landing oficial define Eve como "the framework for building agents" y lo posiciona como un framework durable para agentes con instrucciones/skills en Markdown y tools en TypeScript.
- La Knowledge Base de Vercel lo define como "a filesystem-first framework for durable backend agents on Vercel".
- El repo oficial es `vercel/eve`, publico, Apache-2.0, con codigo TypeScript y estructura monorepo.
- El paquete npm `eve` existe y, al momento de consulta, `latest` apunta a `0.12.0`, publicado el 2026-06-21. El repo clonado tambien esta etiquetado como `eve@0.12.0`.
- GitHub API confirma release `eve@0.12.0`, publicada el 2026-06-21 a las 14:46 UTC. Una vista HTML inicial de GitHub mostro `0.11.7`, probablemente por render/cache; queda descartado frente a API + npm + tag local.
- El paquete `eve` declara Node `>=24`.
- El paquete `eve` incluye documentacion local, y el README del repo dice que los coding agents pueden leerla desde `node_modules/eve/docs`.
- La CLI actual `0.12.0` confirma comandos `init`, `link`, `deploy`, `build`, `start`, `dev`, `info`, `eval` y `channels`.
- Diferencia doc/CLI actual: la documentacion local dice que `eve dev` usa `$PORT` y despues `3000`; `npx eve@latest dev --help` en `0.12.0` muestra `$PORT` y despues `2000`. `eve start` si muestra `$PORT` y despues `3000`.
- `npx eve@latest init probe-agent` se probo en `/tmp`: detecta entorno de coding agent, crea scaffold minimo, instala deps, inicializa Git y no arranca la TUI. La salida recomienda que el humano ejecute `npm exec -- eve dev`.
- En el scaffold real, `npm run typecheck` pasa y `npm run build` genera `.output/` Nitro. El build probado produjo un servidor de 5.49 MB total, con `.output/server/_libs/eve.mjs` de 4.75 MB.
- `npm exec -- eve info --json` sobre el scaffold minimo devuelve estado `ready`, 0 errores, 0 warnings, modelo `anthropic/claude-sonnet-4.6`, instrucciones `instructions.md`, sin tools/skills, y tres rutas HTTP base.
- Las templates oficiales listadas por Vercel KB son:
  - `vercel-labs/eve-content-agent-template`
  - `vercel-labs/personal-agent-template`
  - `vercel-labs/eve-pr-triage-agent-template`
  - `vercel-labs/eve-slack-agent-template`
  - `vercel-labs/eve-chat-template`

## Fuentes primarias

- Landing oficial: <https://vercel.com/eve>
- Knowledge Base principal: <https://vercel.com/kb/eve>
- Docs: <https://eve.dev>
- Integraciones: <https://eve.dev/integrations>
- Repo framework: <https://github.com/vercel/eve>
- npm package: <https://www.npmjs.com/package/eve>
- GitHub release actual: <https://github.com/vercel/eve/releases/tag/eve%400.12.0>
- Content agent template: <https://github.com/vercel-labs/eve-content-agent-template>
- Personal agent template: <https://github.com/vercel-labs/personal-agent-template>
- PR triage agent template: <https://github.com/vercel-labs/eve-pr-triage-agent-template>
- Slack agent template: <https://github.com/vercel-labs/eve-slack-agent-template>
- Next.js chat template: <https://github.com/vercel-labs/eve-chat-template>

## Versiones, repo y estado publico

- Repo principal: `vercel/eve`
- Descripcion GitHub API: "The Framework for Building Agents"
- Licencia: Apache-2.0
- Rama default: `main`
- Ultimo release confirmado: `eve@0.12.0`
- Fecha release: 2026-06-21 14:46 UTC
- npm `latest`: `0.12.0`
- Node requerido: `>=24`
- Estado: beta/preview; Vercel advierte que APIs, docs y comportamiento pueden cambiar antes de GA.
- Metadatos GitHub API al investigar:
  - `vercel/eve`: 1972 stars, 136 forks, 70 open issues, pushed `2026-06-21T14:46:41Z`
  - `vercel-labs/eve-content-agent-template`: 4 stars, 0 forks, 0 issues, Apache-2.0
  - `vercel-labs/personal-agent-template`: 336 stars, 25 forks, 2 issues, MIT
  - `vercel-labs/eve-pr-triage-agent-template`: 6 stars, 0 forks, 0 issues, Apache-2.0
  - `vercel-labs/eve-slack-agent-template`: 8 stars, 5 forks, 0 issues
  - `vercel-labs/eve-chat-template`: 19 stars, 5 forks, 0 issues

## Changelog relevante

`packages/eve/CHANGELOG.md` confirma que `0.12.0` es una release pequena pero importante para nombres de capacidades dinamicas:

- `0.12.0`:
  - Los resolvers dinamicos que devuelven maps ya no autoprefijan con el slug del archivo. El key del map es el nombre final de tool/skill.
  - Un `defineTool` o `defineSkill` unico sigue tomando el nombre del slug del archivo.
  - Si un map puede colisionar, el autor debe namespacear manualmente, por ejemplo `team__playbook`.
  - Una tool/skill dinamica reemplaza una authored con el mismo nombre.
  - Dos resolvers dinamicos que emiten el mismo nombre fallan con error.
  - Las connection tools quedan como `connection_search` y `<connection>__<tool>`, por ejemplo `linear__list_issues`.
  - Corrige resolucion de modelos definidos por codigo en `eve dev`, incluyendo imports NodeNext `.js` que apuntan a `.ts`.
- `0.11.10`:
  - Mejoras en output de `eve init` y `eve dev`.
  - Fix anterior de dynamic skill map naming; queda reemplazado por el contrato final de `0.12.0`.
  - TUI soporta Ctrl+C para limpiar prompts y input multilinea.
- `0.11.9`:
  - Agrega `experimental.workflow.world` para elegir un Workflow world instalado, importante para self-hosting avanzado.
- `0.11.8`:
  - Canonicaliza docs hacia `eve.dev`.
  - Usa TypeScript 7 `tsc` en builds Eve; proyectos Next generados mantienen TS 6.0.3 por compatibilidad con Next.
- `0.11.7` a `0.11.1`:
  - Muchas correcciones de sandbox, microsandbox, Slack typing, OIDC, HITL en connections y recovery de backends.
- `0.11.0`:
  - Elimina `withEve` opt-out de Vercel output.
  - `action.result` puede tener status `rejected` tras denegacion HITL; version de stream sube a `16`.
- `0.10.0`:
  - Primera release publica.

Nota de codigo: hay comentarios internos antiguos que aun mencionan nombres `slug__key` para algunos maps dinamicos. La implementacion de `0.12.0`, `defineDynamic` y el changelog actual dicen lo contrario: map keys son nombres finales sin prefijo automatico.

## Mental model

Eve tiene tres capas:

1. Superficie filesystem-first:
   - `agent/instructions.*`: identidad y prompt base.
   - `agent/agent.ts`: modelo y runtime config.
   - `agent/tools/`: acciones tipadas que el modelo puede llamar.
   - `agent/skills/`: procedimientos Markdown cargados bajo demanda.
   - `agent/connections/`: MCP/OpenAPI externos con auth gestionada.
   - `agent/channels/`: superficies de entrada/salida como HTTP, Slack, GitHub, Discord.
   - `agent/sandbox/`: sandbox y workspace aislado.
   - `agent/subagents/`: agentes hijos especializados.
   - `agent/schedules/`: cron jobs root-only.
   - `agent/hooks/`: subscriptores a eventos del runtime.
   - `evals/`: checks repetibles fuera de `agent/`.

2. Compilacion y host:
   - Eve descubre archivos bajo `agent/`.
   - Genera artefactos bajo `.eve/`.
   - Nitro aloja rutas HTTP, canales, callbacks, schedules y workflow entrypoints.
   - En Vercel emite Vercel Build Output en `.vercel/output`.
   - Fuera de Vercel usa output Nitro Node en `.output/`.

3. Runtime durable:
   - Cada sesion es conversacion durable.
   - Cada turno corre como workflow durable.
   - Cada step es checkpoint durable.
   - El stream de eventos es replayable por indice.
   - HITL, OAuth y subagentes pueden aparcar el trabajo sin mantener compute activo.

## Project layout

Eve deriva identidad desde la ruta, no desde campos `name` o `id`.

| Archivo | Se convierte en |
| --- | --- |
| `agent/tools/get_weather.ts` | tool `get_weather` |
| `agent/connections/linear.ts` | connection `linear` |
| `agent/skills/summarize.md` | skill `summarize` |
| `agent/subagents/researcher/agent.ts` | subagent `researcher` |

Layout recomendado:

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

Reglas importantes:

- `evals/` vive en la raiz de la app, no dentro de `agent/`.
- El root agent requiere instrucciones, salvo casos de compatibilidad/deprecados detectados en tests (`system.md`/`system.ts`).
- Los subagentes declarados necesitan `agent.ts` con `description`, pero sus `instructions` son opcionales.
- `channels/` y `schedules/` son root-only, no se declaran dentro de subagentes locales.
- `lib/` es solo codigo importable; no se monta en workspace.
- Solo llegan al sandbox workspace:
  - skills bajo `/workspace/skills/...`
  - `agent/sandbox/workspace/**` bajo `/workspace/...`

## API TypeScript publica

La doc local dice que el contrato publico vive en `packages/eve/src/public/index.ts`; lo que no se exporta ahi se considera interno. El paquete npm `0.12.0` exporta muchas subrutas. Las principales:

| Helper/API | Import | Donde se usa |
| --- | --- | --- |
| `defineAgent` | `eve` | `agent/agent.ts` |
| `defineRemoteAgent` | `eve` | remote subagents |
| `defineTool` | `eve/tools` | `agent/tools/*.ts` |
| `defineDynamic` | `eve/tools`, `eve/skills`, `eve/instructions` | capacidades runtime por sesion/turn/step |
| `disableTool` | `eve/tools` | deshabilitar built-ins por slug |
| `ExperimentalWorkflow` | `eve/tools` | opt-in Workflow tool |
| `defineMcpClientConnection` | `eve/connections` | MCP externo |
| `defineOpenAPIConnection` | `eve/connections` | OpenAPI 3.x externo |
| `defineInteractiveAuthorization` | `eve/connections` | OAuth propio |
| `defineChannel` | `eve/channels` | canales custom |
| `GET`/`POST`/`PUT`/`PATCH`/`DELETE`/`WS` | `eve/channels` | rutas custom |
| `eveChannel` | `eve/channels/eve` | canal HTTP base |
| `slackChannel` | `eve/channels/slack` | Slack |
| `githubChannel` | `eve/channels/github` | GitHub |
| `defineSkill` | `eve/skills` | skills TS |
| `defineInstructions` | `eve/instructions` | instrucciones TS |
| `defineHook` | `eve/hooks` | hooks stream/runtime |
| `defineSchedule` | `eve/schedules` | cron |
| `defineState` | `eve/context` | memoria durable por sesion |
| `defineSandbox` | `eve/sandbox` | sandbox |
| `defineInstrumentation` | `eve/instrumentation` | OTel/telemetria |
| `defineEval`, `defineEvalConfig` | `eve/evals` | evals |
| `includes`, `equals`, `matches`, `similarity` | `eve/evals/expect` | assertions |
| `Client`, `ClientSession` | `eve/client` | SDK TS |
| `useEveAgent` | `eve/react`, `eve/vue`, `eve/svelte` | frontend |
| `withEve` | `eve/next` | Next.js |
| Nuxt module | `eve/nuxt` | Nuxt |
| SvelteKit plugin | `eve/sveltekit` | SvelteKit |

El `ctx` runtime aparece en tools, hooks y handlers. Miembros clave:

- `ctx.session`: metadata de sesion, turn, auth y parent lineage.
- `ctx.getSandbox()`: handle vivo del sandbox.
- `ctx.getSkill(identifier)`: acceso a skill y archivos empaquetados.
- `ctx.getToken()`: resuelve bearer token del `auth` declarado en tool/connection.
- `ctx.requireAuth()`: fuerza flujo de autorizacion interactiva.

### Exports reales del paquete

`packages/eve/package.json` en `0.12.0` confirma:

- `type`: `module`
- bin:
  - `eve`: `./bin/eve.js`
- runtime dependency directa:
  - `nitro`: `3.0.260610-beta`
- peer dependencies relevantes:
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

Subpath exports publicos:

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

Tambien exporta `eve/setup` y `eve/setup/scaffold`, pero esas rutas son claramente de setup/scaffolding, no superficie normal de autor de agentes.

## Configuracion de `agent.ts`

`agent.ts` llama `defineAgent`.

- Si el root no tiene `agent.ts`, Eve usa por defecto `anthropic/claude-sonnet-4.6`.
- Si `agent.ts` existe, `model` es requerido.
- Si `model` es string, se enruta por Vercel AI Gateway.
- Si `model` es un `LanguageModel` de AI SDK, llama directo al provider configurado.
- `compaction.thresholdPercent` controla cuando compactar historia; default documentado `0.9`.
- `experimental.workflow.world` permite cambiar el Workflow world en self-hosted avanzado.
- `experimental.codeMode` existe, pero se marca inestable.
- `outputSchema` sirve para task-mode runs, subagentes, schedules o jobs remotos.
- `build.externalDependencies` controla empaquetado de dependencias externas.

## CLI

CLI actual validada con `npx eve@latest --help` (`0.12.0`):

| Comando | Uso |
| --- | --- |
| `eve` | sin comando equivale a `eve dev` |
| `eve init [target]` | crear agente o agregar Eve a un proyecto existente |
| `eve link` | vincular a Vercel y traer credenciales AI Gateway |
| `eve deploy` | desplegar a Vercel production |
| `eve build` | compilar app Eve |
| `eve start` | servir app compilada |
| `eve dev` | server local + TUI, o conectar TUI a URL remota |
| `eve info --json` | inspeccion de superficie resuelta |
| `eve eval` | correr evals |
| `eve channels add slack\|web` | scaffolding de canal |
| `eve channels list --json` | listar canales authored |

Comandos recomendados por la doc:

```bash
eve info
eve dev
eve build
eve start
eve deploy
eve eval
```

Artefactos utiles bajo `.eve/`:

- `.eve/discovery/agent-discovery-manifest.json`
- `.eve/discovery/diagnostics.json`
- `.eve/compile/compiled-agent-manifest.json`
- `.eve/compile/compile-metadata.json`
- `.eve/compile/module-map.mjs`

### Scaffold real probado

Comando ejecutado en `/tmp/eve-init-probe`:

```bash
npx eve@latest init probe-agent
```

Resultado observado:

- Version impresa: `eve v0.12.0`.
- Directorio creado: `/private/tmp/eve-init-probe/probe-agent`.
- Dependencias instaladas en 3.5s en la segunda prueba.
- No arranca `eve dev` porque detecta que lo ejecuta un coding agent.
- Inicializa Git.
- Recomienda leer `node_modules/eve/docs/` antes de editar.
- Pide reemplazar `agent/instructions.md` con el proposito real del agente.

Archivos authored del scaffold minimo:

```text
agent/
├── agent.ts
├── channels/
│   └── eve.ts
└── instructions.md
```

`package.json` generado:

- `type: "module"`
- imports `#*` -> `./agent/*` y `#evals/*` -> `./evals/*`
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

`agent/agent.ts` usa por defecto:

```ts
import { defineAgent } from "eve";

export default defineAgent({
  model: "anthropic/claude-sonnet-4.6",
});
```

`agent/channels/eve.ts` configura `eveChannel` con `localDev()`, `vercelOidc()` y `placeholderAuth()`.

### `eve info --json` real

Sobre el scaffold minimo, `npm exec -- eve info --json` devuelve:

- `layout`: `nested`
- `status`: `ready`
- `diagnostics`: 0 errores, 0 warnings
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

### Artefactos `.eve` reales

El scaffold minimo genera:

- Discovery manifest:
  - kind `eve-agent-discovery-manifest`
  - version `12`
  - registra `agent.ts`, `instructions.md` y `channels/eve.ts`
- Compiled manifest:
  - kind `eve-agent-compiled-manifest`
  - version `30`
  - modelo con routing `{ kind: "gateway", target: "anthropic" }`
  - `contextWindowTokens`: `1000000`
  - `workflowEnabled`: `false`
  - `sandbox`: `null`
  - `workspaceResourceRoot` con content hash
- Compile metadata:
  - kind `eve-compile-metadata`
  - version `5`
  - status `ready`
  - hashes SHA-256 para module map, discovery manifest y diagnostics
  - generator `eve@0.12.0`
- `module-map.mjs`:
  - importa `../../agent/agent.ts`
  - importa `../../agent/channels/eve.ts`
  - exporta un `moduleMap` congelado por node id `__root__`

### Build real probado

Sobre el scaffold minimo:

```bash
npm run typecheck
npm run build
```

Resultados:

- `tsc` pasa.
- `eve build` pasa.
- Nitro usa preset `node-server` y builder `rolldown`.
- Genera `.output/server/index.mjs`.
- Bundle total reportado: 5.49 MB, 1.3 MB gzip.
- Libreria mas grande: `.output/server/_libs/eve.mjs`, 4.75 MB, 1.15 MB gzip.

## Runtime durable

Eve organiza trabajo en tres niveles:

- `session`: conversacion/tarea durable, puede durar dias/semanas.
- `turn`: un mensaje de usuario y todo el trabajo que dispara.
- `step`: checkpoint durable dentro del turn; normalmente un model call y sus tool calls.

Garantias y limites:

- Cada turn corre como workflow durable.
- Los steps completados no se reejecutan; se replayea el resultado registrado.
- Si un step queda interrumpido a mitad, puede reejecutarse. Por eso las acciones no idempotentes deben ser idempotentes o estar detras de aprobacion.
- HITL, OAuth y subagentes pueden aparcar el workflow sin compute hasta que llegue input/callback.
- Eve no mantiene una cola FIFO durable de mensajes por sesion. El `continuationToken` es un handle de reanudacion, no una direccion de cola. Para orden determinista, enviar un turno y esperar `session.waiting` antes del siguiente.
- Subagentes declarados tienen su propia sesion durable, sandbox, skills y estado.

## Internals confirmados en codigo

### Discovery y compile

`compileAgent()` hace este recorrido:

1. Resuelve el proyecto con `resolveDiscoveryProject`.
2. Descubre el source graph con `discoverAgent`.
3. Escribe artefactos con `writeCompilerArtifacts`.
4. Si hay diagnostics de error, lanza `CompileAgentError`, pero aun deja diagnostics y manifests escritos.

`discoverAgent()` no importa modulos authored. Lee filesystem y clasifica slots:

- instrucciones
- config `agent.ts`
- channels
- lib
- schedules
- connections
- sandbox
- tools
- hooks
- skills
- subagents

Los artefactos viven bajo `.eve/`:

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

`compile-metadata.json` guarda hashes SHA-256 y `sourceGraphHash`, asi que el runtime/dev server puede detectar cambios de artefactos sin reanalizar todo.

### Manifest y module map

El manifest compilado es deliberadamente serializable. Guarda metadata, rutas, modelo, instrucciones, skills, tools, subagents, schedules, sandbox, workspace resources y referencias a modulos. Las funciones authored no se serializan en JSON; viven en `module-map.mjs`.

Constantes observadas:

- `COMPILED_AGENT_MANIFEST_KIND`: `eve-agent-compiled-manifest`
- `COMPILED_AGENT_MANIFEST_VERSION`: `30`
- root node id compilado: `__root__`

El `module-map.mjs` importa los modulos reales y expone un mapa congelado por node id y source id. En un scaffold minimo:

```js
import * as module_0 from "../../agent/agent.ts";
import * as module_1 from "../../agent/channels/eve.ts";
```

### Runtime graph

`resolveRuntimeAgentGraph()` hidrata el manifest y el module map en un bundle runtime:

- Resuelve root agent y subagents.
- Mezcla framework tools con authored tools.
- Authored tools con mismo nombre reemplazan defaults.
- `disableTool()` elimina defaults si el slug apunta a una tool framework valida.
- Authored channels reemplazan framework channels con el mismo nombre.
- `disableRoute()` elimina framework channels si el slug apunta a un channel framework valido.
- Si hay connections, inyecta un dynamic resolver `connection_search`.
- Construye registries de tools, hooks, sandbox y subagents.

### Dynamic capabilities internas

El runtime de dinamicos usa scopes:

- Tools dinamicas:
  - `session.started`: metadata durable de sesion.
  - `turn.started`: metadata durable de turno.
  - `step.started`: live closures de step.
- Skills dinamicas:
  - `session.started`
  - `turn.started`
- Instructions dinamicas:
  - `session.started`
  - `turn.started`

Motivo: instructions y skills afectan el system prompt, la zona mas sensible para prompt caching, asi que no cambian en cada step.

Para tools dinamicas de sesion/turno:

- Eve guarda metadata durable: nombre, descripcion, schema, resolver slug, entry key, step function name y closure vars serializadas.
- El replay no reinvoca resolvers; reconstituye execute desde registered workflow steps.
- Las step-scoped tools conservan closures vivas y se re-resuelven cada step.
- El orden efectivo es step > turn > session. La primera definicion de un nombre gana en `buildToolSetFromDefinitions`.
- Despues, las dynamic tools sobrescriben authored/default tools del mismo nombre.

Limitacion importante: `needsApproval` en dynamic tools solo se honra para tools step-scoped; las session/turn-scoped se replayean desde metadata durable y no pueden transportar esa funcion.

### Workflow runtime

`createWorkflowRuntime()` crea un runtime respaldado por Workflow:

- El long-lived driver usa workflow `workflowEntry`.
- Cada turno se despacha como child workflow `turnWorkflow`.
- El driver posee el event stream.
- `getEventStream(sessionId, { startIndex })` lee NDJSON desde el run.
- `deliver()` reanuda un hook por `continuationToken`; si no existe, lanza `RuntimeNoActiveSessionError`.
- Las referencias de workflow son estables y no llevan version de paquete:
  - `workflow//eve//workflowEntry`
  - `workflow//eve//turnWorkflow`
- En Vercel production intenta `deploymentId: "latest"`; en preview/local no, porque previews no tienen la misma semantica de branch/latest.

## Protocolo HTTP y streaming

Rutas principales del canal Eve:

```bash
POST /eve/v1/session
POST /eve/v1/session/:sessionId
GET  /eve/v1/session/:sessionId/stream
GET  /eve/v1/info
GET  /eve/v1/health
```

Dos handles distintos:

- `continuationToken`: para enviar follow-ups a la misma conversacion. Pertenece al channel.
- `sessionId` / `runId`: para streaming e inspeccion. Pertenece al runtime.

Eventos stream NDJSON importantes:

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

Streams son replayables. `startIndex` permite reconectar por indice de evento.

## Harness y herramientas por defecto

Todo agente Eve trae un harness por defecto con loop de agente y herramientas built-in:

| Tool | Ejecuta/afecta |
| --- | --- |
| `bash` | comando shell en sandbox |
| `read_file` | lectura text con numeros de linea en sandbox |
| `write_file` | escritura completa con read-before-write/stale-read |
| `glob` | busqueda de archivos en sandbox |
| `grep` | busqueda por regex en sandbox |
| `web_fetch` | fetch desde app runtime |
| `web_search` | busqueda gestionada por provider |
| `todo` | lista durable por sesion |
| `ask_question` | HITL: pregunta al usuario y aparca |
| `agent` | subagente copy-of-self |
| `load_skill` | carga skill en contexto |
| `connection_search` | descubre tools de conexiones |

Se pueden:

- Sobrescribir creando `agent/tools/<slug>.ts`.
- Deshabilitar con `disableTool()` en un archivo con el mismo slug.
- Envolver built-ins desde `eve/tools/defaults`.

Ejemplo real en template PR triage: deshabilitan `bash`, `glob`, `grep`, `read_file`, `write_file` porque el agente triagea desde el diff inyectado y solo debe usar `apply_labels`, sin sandbox.

## Tools authored

Las tools:

- viven en `agent/tools/<name>.ts`.
- se definen con `defineTool`.
- corren en app runtime, con acceso a `process.env`.
- nunca se ejecutan durante discovery.
- requieren `inputSchema`.
- pueden tener `outputSchema`.
- pueden transformar salida para el modelo con `toModelOutput`.
- pueden declarar `auth`.
- pueden declarar `needsApproval`.

Patron base:

```ts
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Get the current weather for a city.",
  inputSchema: z.object({ city: z.string().min(1) }),
  async execute({ city }, ctx) {
    return { city, condition: "Sunny" };
  },
});
```

## Human-in-the-loop

HITL existe en dos formas:

- Approval: la tool quiere correr y una persona aprueba/deniega.
- Question: el modelo llama `ask_question` y aparca esperando respuesta.

Helpers:

- `never()`: default si se omite `needsApproval`.
- `once()`: aprobar una vez por sesion.
- `always()`: aprobar cada llamada.
- Predicate custom: decide segun input.

Importante: si `needsApproval` se omite, la tool puede ejecutarse sin aprobacion. La doc recomienda usar aprobacion para acciones sensibles, irreversibles, reguladas, financieras, de salud, empleo, housing, legales, safety-impacting, user-impacting o con side effects externos.

## Skills

Las skills son procedimientos Markdown cargados bajo demanda por `load_skill`.

Formas:

- Archivo plano: `agent/skills/forecast.md`
- Paquete: `agent/skills/research/SKILL.md` con `references/`, `assets/`, `scripts/`
- TS: `defineSkill` desde `eve/skills`

Reglas:

- La descripcion es routing hint, no label.
- Cargar una skill solo agrega instrucciones, no nuevas acciones.
- Tools siguen siendo la superficie ejecutable.
- Skills son scoped por agente; subagente y root no comparten skills.
- Archivos sibling se pueden leer desde runtime con `ctx.getSkill(id).file(path)`.

Esto encaja con el Agent Skills standard: una skill existente compatible con `SKILL.md` deberia portar a Eve.

## Dynamic capabilities de autor

`defineDynamic` permite resolver tools, skills e instructions por sesion, turno o step.

Usos:

- Capabilities por tenant/equipo/usuario.
- Playbooks por plan o feature flag.
- Tools generadas desde una base de datos o catalogo.
- Instrucciones por canal o perfil.

Eventos:

| Evento | Tools | Skills | Instructions |
| --- | --- | --- | --- |
| `session.started` | si | si | si |
| `turn.started` | si | si | si |
| `step.started` | si | no | no |

Detalle critico: en dynamic tools, `execute` debe ser inline (`execute: (...) => ...` o method shorthand). Si se usa `execute: myFn` o factory, puede funcionar al principio pero no sobrevivir a replay/resume durable porque el transform necesita reconstruir closures.

## State

`defineState` crea memoria durable por sesion.

- `get()`: lee valor actual.
- `update(fn)`: reemplaza desde valor actual.
- Requiere contexto Eve activo.
- No se comparte con subagentes.
- Sirve para memoria de trabajo de sesion: presupuesto, checklist, glosario, flags.
- No reemplaza una base de datos si la informacion debe vivir entre sesiones/usuarios.

## Sandbox

Cada agente tiene exactamente un sandbox por sesion logica.

Trust boundary:

| Aspecto | App runtime | Sandbox |
| --- | --- | --- |
| `process.env` / secretos | si | no |
| Codigo Node propio | si | no |
| Network | sin restriccion por runtime | policy configurable |
| FS | app propia | `/workspace` aislado |

Backends:

- `vercel()` desde `eve/sandbox/vercel`: Vercel Sandbox.
- `docker()` desde `eve/sandbox/docker`: Docker local.
- `microsandbox()` desde `eve/sandbox/microsandbox`: VM local ligera.
- `justbash()` desde `eve/sandbox/just-bash`: fallback JS, sin binarios reales.
- `defaultBackend()` elige Vercel en Vercel, luego Docker, microsandbox, just-bash.

Metodos del handle:

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
- Produccion/sensibles: usar `deny-all` o allow-list explicita.
- Domain allow-lists y credential brokering soportados por `vercel()` y `microsandbox()`.
- Docker solo soporta allow-all/deny-all.
- just-bash rechaza `setNetworkPolicy`.

Lifecycle:

- `bootstrap({ use })`: template-scoped; corre al construir template.
- `onSession({ use, ctx })`: por sesion durable; lugar correcto para user-specific setup, network policy y credenciales por principal.

## Connections

Connections conectan con servidores externos no authored:

- MCP con `defineMcpClientConnection`.
- OpenAPI 3.x con `defineOpenAPIConnection`.

El modelo no ve URL ni credenciales. Usa `connection_search`, descubre tools y llama nombres calificados:

```text
<connection>__<tool>
linear__list_issues
petstore__getInventory
```

Auth soportada:

- Sin auth para servicios publicos/locales.
- Static token con `getToken`.
- Headers custom.
- OAuth interactivo con Vercel Connect: `connect("linear")` desde `@vercel/connect/eve`.
- OAuth interactivo self-hosted con `defineInteractiveAuthorization`.

Controles:

- MCP: `tools.allow` o `tools.block`.
- OpenAPI: `operations.allow` o `operations.block`.
- `approval` a nivel de conexion (`never`, `once`, `always`).

Orden con approval + auth: primero approval, luego sign-in. Eve guarda la aprobacion en state de sesion para no pedir doble aprobacion tras OAuth.

## Channels

Un channel es el edge adapter entre plataforma y agente. Hace tres cosas:

1. Normaliza input de plataforma a mensaje.
2. Posee el `continuationToken`.
3. Decide entrega/respuesta.

Built-ins principales:

- Eve HTTP channel: default, `/eve/v1/*`.
- Slack.
- Discord.
- Microsoft Teams.
- Telegram.
- Twilio SMS/WhatsApp/voice/transcription.
- GitHub.
- Linear Agent.
- Custom channels con `defineChannel`.

Eve usa componentes card-builder del Chat SDK para Slack, pero no usa el runtime del Chat SDK.

### Matriz de channels

| Channel | Ruta(s) default | Auth/verificacion | Dispatch | Delivery | Notas |
| --- | --- | --- | --- | --- | --- |
| Eve HTTP | `/eve/v1/session`, `/eve/v1/session/:sessionId`, `/eve/v1/session/:sessionId/stream` | `localDev()`, `vercelOidc()` por defecto; `placeholderAuth()` en scaffold | POST crea/continua sesiones | Stream NDJSON y cliente TS/frontend | Enabled aunque no exista `agent/channels/eve.ts`; escribir ese archivo solo para custom auth/config |
| Slack | `/eve/v1/slack` | Vercel Connect gestiona bot token y webhook verifier | `app_mention` y `message.im`; hooks `onAppMention`, `onDirectMessage` | Threads, typing indicators, Block Kit/cards, HITL con botones/modales | El auth OAuth challenge se entrega ephemeral/DM; no expone raw token |
| Discord | `/eve/v1/discord` | Ed25519 signatures, app id, bot token, public key | Slash/app commands, components, modals | ACK rapido y trabajo en background; edita deferred response y followups | Discord exige ACK en 3s; textos largos se parten a 2000 chars |
| Microsoft Teams | `/eve/v1/teams` | Bot Framework bearer JWT | Personal chat y mensajes que mencionan al bot | Bot Framework Connector, Adaptive Cards para HITL | Proactive sessions requieren conversation reference existente |
| Telegram | `/eve/v1/telegram` | `X-Telegram-Bot-Api-Secret-Token` | Private chats y grupos que dirigen mensaje al bot | `sendMessage`, inline keyboard HITL | No llama `setWebhook`; se registra fuera. Limite 4096 chars por mensaje |
| Twilio | `/eve/v1/twilio/messages`, `/voice`, `/voice/transcription` | `X-Twilio-Signature` | SMS y transcripciones de voz | SMS via Messages API; voz con TwiML `Gather` | Raw continuation token `From:To`; proactive outbound requiere sender |
| GitHub | `/eve/v1/github` | GitHub App id/private key/webhook secret | @mentions en issues, PRs o review comments; hooks opt-in para issue/PR opened | Comentarios nativos en GitHub | Inyecta PR diff y puede checkout de ref en sandbox en backend Vercel |
| Linear Agent | `/eve/v1/linear` | Linear HMAC signature o verifier custom | `AgentSessionEvent` (`created`, `prompted`) | Linear Agent Activities: thought/action/elicitation/response/error | Usa surface Agent Sessions, no comentarios normales |
| Custom | rutas `GET`/`POST`/`PUT`/`PATCH`/`DELETE`/`WS` | Lo define el autor en route handlers | `send(...)` o cross-channel `receive(...)` | events map por stream event | Soporta WebSocket, metadata, file uploads y re-key de continuation token |

### Integrations gallery y scaffolding

El catalogo `@vercel/eve-catalog` contiene channels y connections con dos surfaces:

- `gallery`: aparece en docs/integrations.
- `scaffoldable`: la CLI puede generarlo hoy.

Channels scaffoldable por CLI:

- `slack`
- `eve` Web Chat

Channels en gallery pero configurados a mano hoy:

- Discord
- Microsoft Teams
- Telegram
- Twilio
- GitHub
- Linear Agent

Connections scaffoldable/gallery:

| Connection | Protocolos | Endpoint/capacidad | Auth modes docs |
| --- | --- | --- | --- |
| Linear | MCP | `https://mcp.linear.app/sse`; issues, projects, cycles, comments | user, app |
| Notion | MCP + OpenAPI | MCP `https://mcp.notion.com/mcp`; OpenAPI `https://developers.notion.com/openapi.json` con base `https://api.notion.com` | user, app, JWT bearer |
| Datadog | MCP | `https://mcp.datadoghq.com/api/mcp`; metrics, monitors, logs, incidents | JWT bearer |
| Honeycomb | MCP | `https://mcp.honeycomb.io/mcp`; traces, queries, datasets | JWT bearer |

CLI actual para channels:

- `eve channels add slack`
- `eve channels add web`
- `eve channels list --json`

## Auth y route protection

Eve tiene dos sistemas independientes:

1. Route auth inbound: quien puede llamar rutas HTTP.
2. Tool/connection auth outbound: como el agente accede a servicios externos.

Route auth protege:

- `POST /eve/v1/session`
- `POST /eve/v1/session/:sessionId`
- `GET /eve/v1/session/:sessionId/stream`

`GET /eve/v1/health` es publico.

Auth fail-closed:

- Si ningun `AuthFn` acepta, 401.
- Anonymous requiere `none()` explicitamente.
- `placeholderAuth()` mantiene produccion cerrada hasta reemplazo.

Helpers:

- `localDev()`
- `vercelOidc()`
- `none()`
- `httpBasic(...)`
- `jwtHmac(...)`
- `jwtEcdsa(...)`
- `oidc(...)`

Advertencia critica: route auth no impone ownership de sesion. Si varios usuarios/tenants pueden llegar a la misma ruta, la app debe implementar autorizacion por usuario/tenant/sesion.

## Hooks

Hooks subscriben a eventos del stream y corren despues de que el evento fue durably recorded.

Usos:

- audit logs
- metricas
- alerting
- persistir eventos/sesiones a una DB propia

Si un hook lanza, se considera fallo real: puede convertirse en `turn.failed`, o escalar a `session.failed` si rompe durante cascada de fallo. Para hooks no criticos, envolver con `try/catch`.

## Subagents

Hay dos tipos:

- Built-in `agent` tool: copia del agente actual, comparte sandbox y tools, fresh history/state.
- Declared subagents: `agent/subagents/<id>/`, con su propio `agent.ts`, tools, skills, sandbox, state.
- Remote agents: `defineRemoteAgent` bajo `agent/subagents/`, apuntando a otro deployment Eve.

Reglas:

- El parent le pasa todo contexto necesario en `message`.
- El child no ve la historia del parent.
- Un declared subagent no hereda slots del root.
- El nombre del subagente comparte namespace con tools; colisiones fallan en build.
- No usar subagentes como boundary de seguridad por si solos; approvals/auth deben estar donde estan las acciones.

### Remote agents

`defineRemoteAgent` permite llamar otro despliegue Eve como si fuera subagent local.

Ejemplo:

```ts
import { defineRemoteAgent } from "eve";
import { vercelOidc } from "eve/agents/auth";

export default defineRemoteAgent({
  url: "https://weather-agent.example.com",
  description: "Answers weather questions.",
  auth: vercelOidc(),
});
```

Campos:

- `url`: base URL del deployment remoto.
- `description`: descripcion visible para el modelo.
- `auth`: outbound auth opcional.
- `headers`: headers estaticos o lazy.
- `path`: default `/eve/v1/session`.
- `outputSchema`: schema para task-mode remoto.

Funcionamiento:

1. Parent inicia una sesion task-mode en el remoto.
2. Parent aparca el turno y pasa una callback URL.
3. Remote completa o falla.
4. Parent recibe callback terminal y reanuda el turno.

Auth outbound soportada:

- `vercelOidc()`
- `bearer(token)`
- `basic({ username, password })`

Failure model:

- Fallo al arrancar remoto vuelve como tool result fallido.
- Fallo despues de arrancar llega por terminal callback.
- Callback delivery corre como durable step; si falla el POST, se reintenta.

### Experimental Workflow tool

`ExperimentalWorkflow` habilita una tool `Workflow` para que el modelo escriba JavaScript que coordina subagentes como un unico step durable.

Opt-in:

```ts
export { ExperimentalWorkflow as default } from "eve/tools";
```

Archivo esperado:

```text
agent/tools/workflow.ts
```

Puede orquestar:

- built-in `agent`
- subagents declarados
- remote agents

No puede acceder a:

- filesystem
- red
- shell
- skills
- connections
- `process`
- imports

La ejecucion corre en una sandbox QuickJS pequena. Es una allowlist: el programa solo ve `tools.<subagentName>` y built-ins del lenguaje.

Utilidad:

- fan-out programatico
- secuencias donde el output de un subagente alimenta otro
- agregaciones runtime que no caben bien en tool calls sueltos

Riesgo:

- Marcado experimental.
- El modelo escribe codigo de orquestacion; debe probarse con evals antes de usar en flujos criticos.

## Schedules

Schedules viven en `agent/schedules/` y son root-only.

Dos formas:

- `markdown`: prompt fire-and-forget en task mode.
- `run`: handler que puede entregar trabajo a un canal con `receive`.

Cron:

- 5 campos, resolucion de minuto.
- En Vercel se convierte en Vercel Cron Job y se evalua en UTC.
- `eve dev` no dispara schedules por cron; hay ruta dev one-shot:

```bash
curl -X POST http://localhost:3000/eve/v1/dev/schedules/<scheduleId>
```

En self-hosted, `eve start` arranca scheduler de Nitro. Si se adapta output a otro host que solo sirve HTTP, hay que asegurarse de ejecutar Nitro scheduled tasks o usar scheduler propio.

## Frontend y SDK cliente

Frontend:

- React: `useEveAgent` desde `eve/react`.
- Vue: `eve/vue`.
- Svelte: `eve/svelte`.
- Next.js: `withEve` desde `eve/next`.
- Nuxt: modulo `eve/nuxt`.
- SvelteKit: plugin `eve/sveltekit`.

`useEveAgent` maneja:

- crear sesion durable
- enviar turns
- stream de respuesta
- reducer a mensajes UI
- estado `ready`/`submitted`/`streaming`/`error`
- HITL responses
- `clientContext` por turno
- `initialSession` y persistencia de cursor

SDK bajo nivel:

- `Client` desde `eve/client`.
- `client.session()`.
- `health()`.
- Auth bearer/basic dynamic por request.
- `ClientSession` guarda `sessionId`, `continuationToken` y cursor de stream.

Detalles importantes del cliente:

- `send("texto")` inicia o continua un turno.
- `send({ message, clientContext })` agrega contexto solo para ese turno; no persiste en historial durable.
- `send({ message: UserContent[] })` acepta attachments estilo AI SDK, por ejemplo PDFs como data URLs.
- `send({ inputResponses })` responde aprobaciones o preguntas HITL.
- `MessageResponse` es single-use: consumir con `result()` o con `for await`, no ambas.
- `result()` devuelve `status`, `message`, `events`, `sessionId` y `data`.
- `status` puede ser `waiting`, `completed` o `failed`.
- Transient stream disconnects se reconectan desde `streamIndex`; default `maxReconnectAttempts` es `3`.
- `session.stream({ startIndex })` permite reabrir un stream existente.

Continuations:

- `continuationToken`: resume la conversacion.
- `sessionId`: identifica stream/historia.
- `streamIndex`: indice de eventos consumidos.
- Persistir los tres como `SessionState` es mejor que guardar solo el token.
- Si un turno acaba en `session.completed` o `session.failed`, el cliente resetea state local; el siguiente `send` abre sesion nueva.

Output schema por turno:

- `send<T>({ message, outputSchema })` pide resultado estructurado.
- Acepta JSON Schema o Standard Schema (Zod, Valibot, ArkType).
- El servidor valida; el cliente no revalida client-side.
- El stream emite `result.completed`.
- `result().data` contiene el ultimo `result.completed` del turno, o `undefined` si no se pidio/satisfizo estructura.
- No persiste entre turnos; cada turno que lo necesite debe pasarlo.

`withEve` para Next.js:

- Añade rewrites para que `/eve/v1/:path*` apunte al servicio Eve.
- En desarrollo arranca `eve dev --no-ui --port 0` para el agente y reescribe hacia esa URL.
- En Vercel production reescribe al prefijo privado del servicio Eve, default `/_eve_internal/eve`.
- Fuera de Vercel production puede servir `.output/server/index.mjs` en puerto local estable o usar `EVE_NEXT_PRODUCTION_ORIGIN`.
- Opciones clave:
  - `eveRoot`
  - `eveBuildCommand`
  - `servicePrefix`
  - `devServerTimeoutMs`

## Evals

Evals viven en `evals/*.eval.ts` y usan `defineEval`.

Propiedades:

- Se ejecutan contra el HTTP real del agente.
- El runner arranca o apunta a un servidor real.
- Assertions pueden ser run-level, value checks o LLM-as-judge.
- `t.send`, `t.respond`, `t.expectInputRequests`, etc.
- `t.completed()`, `t.calledTool("...")`, `t.usedNoTools()`, `t.toolOrder([...])`.
- `t.check(t.reply, includes("..."))`.
- `t.judge.autoevals.*`.

Config:

- `evals/evals.config.ts` con `defineEvalConfig`.
- Reporters como Braintrust o JUnit.

CLI:

```bash
eve eval
eve eval weather
eve eval --url https://<app>
eve eval --strict
eve eval --json
eve eval --junit results.xml
```

Exit codes documentados:

- `0`: gates pasan.
- `1`: fallo de eval/check/error/strict threshold.
- `2`: error de configuracion.

## Observabilidad

Tres superficies:

1. Workflow run tags `$eve.*`: automaticos, no configurados.
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

Agent Runs en Vercel dashboard:

- Auto-detecta `eve`.
- Aparece en Observability.
- Actualmente gated por team, segun docs.
- Separado de OTel exporters.

## Deployment

En Vercel:

- `eve build` genera `.vercel/output`.
- Workflow SDK usa Vercel Workflow.
- `defaultBackend()` usa Vercel Sandbox.
- Schedules se convierten en Vercel Cron.
- Prewarm de sandbox templates en build si hay `VERCEL` y `VERCEL_DEPLOYMENT_ID`.

Fuera de Vercel:

- `eve build`
- `PORT=3000 eve start --host 0.0.0.0`
- Output Nitro en `.output/`.
- Workflow local world persiste estado normalmente bajo `.workflow-data`.
- Sandbox default intenta Docker, microsandbox, just-bash.
- Si se quiere no depender de AI Gateway, usar provider directo de AI SDK y API key provider.

Checklist minima:

- `eve build` pasa.
- Secrets/model creds configurados.
- Sandbox backend correcto.
- `placeholderAuth()` reemplazado.
- Health/session/stream smoke tests pasan.
- Network policy revisada.
- Tools sensibles detras de approval.
- OTel/eval providers aprobados para los datos.

## Tutorial oficial Build an Agent

La carpeta `docs/tutorial/` construye un analytics assistant de extremo a extremo en nueve pasos. Es el tutorial mas completo para entender el "happy path" de Eve.

### 1. Your First Agent

Objetivo: crear `analytics-assistant`, fijar modelo y prompt.

Conceptos:

- Requiere Node 24+.
- El default usa AI Gateway; si no hay `AI_GATEWAY_API_KEY` o `VERCEL_OIDC_TOKEN`, el TUI guia por `/model`.
- `npx eve@latest init analytics-assistant` crea directorio, instala deps, inicializa Git y arranca dev server para humanos.
- `agent/agent.ts` define el modelo.
- `agent/instructions.md` contiene identidad y reglas permanentes.

### 2. How It Runs

Define los tres terminos centrales:

- session: conversacion durable.
- turn: mensaje + trabajo disparado.
- step: checkpoint durable.

Mensaje clave: un turn corre como workflow durable. Steps completados no reejecutan; steps interrumpidos pueden reejecutar. Side effects no idempotentes deben ser idempotentes o gateados.

### 3. Query Sample Data

Agrega `run_sql` como tool typed:

- `agent/lib/sample-db.ts` contiene SQLite in-memory con `sql.js`.
- `agent/tools/run_sql.ts` usa `defineTool`.
- Filename `run_sql.ts` se convierte en tool `run_sql`.
- Output se limita a 500 filas para no inundar contexto.
- Tools corren en app runtime con `process.env`, no en sandbox.

### 4. Connect a Warehouse

Sustituye dataset toy por una connection MCP OAuth:

- `agent/connections/warehouse.ts`
- `defineMcpClientConnection`
- `connect("warehouse")` desde `@vercel/connect/eve`
- Tools aparecen como `warehouse__<tool>`
- OAuth es user-scoped por defecto.
- Si falta token, el turn aparca, el canal muestra sign-in, y despues se reanuda desde el mismo step.
- El token nunca llega al modelo; Eve lo resuelve justo antes de llamar el MCP server.

Nota: Vercel Connect se describe como private beta en esa guia. El tutorial permite seguir con sample dataset si no se tiene acceso.

### 5. Run Analysis

Introduce sandbox:

- `agent/sandbox/workspace/schema.sql` se monta en `/workspace/schema.sql`.
- El modelo puede leer schema/notes antes de escribir consultas.
- Built-ins `bash`, `read_file`, `write_file` apuntan al sandbox.
- Una tool custom puede usar `ctx.getSandbox()` para escribir ficheros y ejecutar comandos.
- Ejemplo `chart_series` escribe JSON + Python y genera PNG.
- El sandbox base no trae matplotlib; hay que instalarlo en bootstrap o usar imagen custom.
- Secrets no entran en sandbox.

### 6. Remember Definitions

Introduce `defineState`:

- `defineState("analytics.glossary", initial)` crea slot durable tipado.
- Tools `define_metric` y `recall_metrics` actualizan/leen glosario.
- El estado persiste entre turns de la misma session.
- State es per-session y aislado por agente; subagents no lo comparten.

### 7. Team Playbooks

Introduce dynamic skills:

- `agent/skills/team-playbook.ts`
- `defineDynamic({ events: { "session.started": ... } })`
- Lee `ctx.session.auth.current?.attributes.team`.
- Devuelve `defineSkill` con playbook de Growth/Finance.
- Skill se mantiene disponible durante toda la session.
- El routing depende de claims autenticados, no del texto del usuario.

### 8. Guard the Spend

Introduce HITL cost-based:

- `needsApproval` puede ser predicate sobre `toolInput`.
- Ejemplo: estimar GB escaneados y gatear consultas caras.
- Si aprueba, el run reanuda y ejecuta.
- Si deniega, la tool se salta y el modelo recibe el motivo.
- Cada session tiene una sola continuation activa; respuestas stale se rechazan.

### 9. Ship It

Convierte TUI en app web:

- `npx eve channels add web` agrega app Next.js.
- `next.config.ts` usa `withEve(nextConfig)`.
- `AgentChat` usa `useEveAgent`.
- Reemplaza `placeholderAuth()` por auth real.
- `agent/channels/eve.ts` debe tener auth de app antes de `localDev()`/`vercelOidc()`.
- Deploy:

```bash
vercel deploy
```

Smoke test remoto:

```bash
npx eve dev https://your-analytics-app.vercel.app
```

Resultado final del tutorial: agente web autenticado que consulta warehouse, corre analisis en sandbox, grafica resultados, recuerda definiciones, carga playbooks por team y pide aprobacion antes de gastar.

## Templates oficiales

### `vercel-labs/eve-slack-agent-template`

Starter minimal para Slack.

Stack:

- Eve
- Slack via Vercel Connect
- TypeScript
- `eve dev/build/start`

Agente:

- `agent/agent.ts`
- `agent/channels/slack.ts`
- `agent/instructions.md`
- `agent/skills/plan_a_trip.md`
- `agent/tools/get_weather.ts`

Uso:

- Deploy button crea connector Slack con trigger a `/eve/v1/slack`.
- Local: `vercel link`, `vercel env pull`, `pnpm dev`.

### `vercel-labs/eve-content-agent-template`

Slack content assistant. Drafts blog posts, LinkedIn posts, release notes y newsletters desde Slack, usando Notion como fuente/publicacion y Vercel Blob para assets.

Stack:

- Eve
- Slack channel via Vercel Connect
- Notion MCP via Vercel Connect
- Vercel Blob con OIDC
- AI Gateway, default Claude Opus 4.8
- Vercel Sandbox
- Ultracite/Biome

Agente:

- `agent/agent.ts`: `anthropic/claude-opus-4.8`
- `agent/channels/slack.ts`
- `agent/connections/notion.ts`
- `agent/sandbox.ts`
- tools Blob:
  - `upload_asset`
  - `list_assets`
  - `get_asset_info`
  - `download_asset`
  - `delete_asset`
- tool deterministic:
  - `lint_against_style`
- skills:
  - `blog-style`
  - `linkedin-style`
  - `release-notes-style`
  - `newsletter-style`

Patron destacado:

- `delete_asset` usa `needsApproval: always()`.
- Las skills de estilo tienen `banned-words.json` y ejemplos.
- No hay static keys; Slack/Notion via Connect, Blob/modelo via OIDC.

### `vercel-labs/eve-pr-triage-agent-template`

GitHub App que triagea PRs al abrirse.

Stack:

- Eve
- GitHub channel
- GitHub App webhook
- AI Gateway/modelo `anthropic/claude-sonnet-4.6`
- YAML ruleset `triage.yml`

Agente:

- `agent/channels/github.ts`
- `agent/tools/apply_labels.ts`
- `agent/skills/triage.ts`
- default sandbox tools deshabilitadas:
  - `bash.ts`
  - `glob.ts`
  - `grep.ts`
  - `read_file.ts`
  - `write_file.ts`

Patron destacado:

- v1 triagea desde el diff auto-inyectado por GitHub channel.
- No paga sandbox ni checkout.
- Aplica labels y comenta una unica triage comment.
- La README advierte que no re-triagea pushes posteriores al mismo PR; es v2 item.

### `vercel-labs/personal-agent-template`

Personal AI agent durable con web chat, Slack, iMessage, Linear y memoria larga.

Stack:

- Eve
- Nuxt
- Nuxt UI
- NuxtHub/SQLite
- Better Auth
- Drizzle
- Vercel Connect
- Sendblue para iMessage/SMS

Agente:

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

Patrones destacados:

- Instrucciones dinamicas inyectan perfil/memoria del usuario por sesion.
- `save_memory` requiere aprobacion (`always()`).
- Para iMessage ajusta instrucciones porque no hay UI de aprobacion en ese canal.
- Web y Eve comparten API interna autenticada por bearer (`INTERNAL_API_SECRET`).

### `vercel-labs/eve-chat-template`

Next.js chat persistido para Eve.

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
- Vercel Connect para Slack, Notion, Linear, Sentry

Agente:

- `agent/agent.ts`
- `agent/channels/eve.ts`
- `agent/channels/slack.ts`
- `agent/connections/linear.ts`
- `agent/connections/notion.ts`
- `agent/connections/sentry.ts`
- `agent/skills/plan_a_trip.md`
- `agent/tools/get_weather.ts`

Frontend:

- `next.config.ts` usa `withEve(nextConfig)`.
- El browser usa `useEveAgent()` desde `eve/react`.
- Guarda session cursors y event snapshots para reanudar `/chat/[id]`.

Incluye:

- historia chat persistida
- rate limiting Redis
- sidebar
- HITL rendering
- tool rendering
- connections menu

## Tests, fixtures y cobertura inferida

El repo principal tiene muchas suites unitarias/integration/scenario. Areas cubiertas por nombres de tests:

- discovery de agent project, skills, sandbox, subagents
- compiler manifest/module-map/normalize
- CLI init/info/link/deploy/channels
- dev TUI, prompt commands, model setup, rendering
- client sessions, reducers, output schema
- React/Vue/Svelte `useEveAgent`
- dynamic instructions/skills/tools lifecycle
- hooks lifecycle
- durable session store y migrations
- workflow entry/runtime/errors/steps
- sandbox backends: Docker, microsandbox, just-bash, Vercel
- bash/read/write/glob/grep tools
- subagent HITL proxy y delegation
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

Fixtures de apps:

- `weather-agent`
- `agent-tui-client`

Framework/template fixtures dentro del repo:

- `apps/frameworks/next`
  - agente Eve + `agent/channels/eve.ts`
  - Next app con `next.config.ts`
  - tool `whoami`
- `apps/frameworks/nuxt`
  - agente Eve + Nuxt module
  - tool `get_weather`
- `apps/frameworks/sveltekit`
  - agente Eve + SvelteKit integration
  - tool `get_weather`
- `apps/templates/web-chat-next`
  - template Next de web chat
  - `agent/tools/randomize.ts`
  - `agent/channels/eve.ts`

Fixtures especialmente utiles para entender runtime:

- `apps/fixtures/weather-agent`
  - README pequeno
  - skill `get-weather.md`
  - tool `get_weather.ts`
- `apps/fixtures/agent-tui-client`
  - channel custom `anchored.ts`
  - connection stub MCP user
  - subagent `echo-marker`

Lectura: el repo no solo testea unidades sueltas. Tiene fixtures de agente minimo, channels, OpenAPI, schedules, skills, subagents, HITL, sandbox tools, frameworks web y TUI, lo que da bastante confianza en la cobertura de superficie framework.

## Riesgos vivos y temas abiertos

Issues abiertas relevantes observadas:

- `#154`: AI Gateway rate limiting inesperado tras pocos turns.
- `#149`: Discord channel 401 por fallback de token.
- `#147`: definir comportamiento Slack HITL con payloads multi-action.
- `#145`: feature request para policy/governance interface en lifecycle hooks de tools.
- `#136`: throughput/TTFT degrada en `eve dev` al acumular sesiones aparcadas.
- `#134`: stream reconnect exhaustion limpia sesion cliente mientras el turn durable continua.
- `#133`: bundler falla con imports relativos cuyo basename contiene puntos.
- `#131`: permitir tokens Anthropic/OpenAI, no solo API keys.
- `#126`: detener respuesta limpia sesion cliente y el proximo mensaje empieza conversacion nueva.
- `#124`: client interruption corta stream pero server turn sigue corriendo.
- `#120`: Vercel Sandbox readFile viola Web stream contract.

PRs abiertas recientes muestran areas activas:

- cancelacion server/client/delegated agents
- HITL Slack bound to verified requester
- Discord auth fallback
- remote TUI auth
- dev debugging
- realtime voice control plane
- sandbox/network policy fixes

Discussions publicas:

- usar OpenRouter u otro provider directo en vez de AI Gateway
- estructura ideal para multiples root agents con tools/skills compartidas
- self-hosting
- carpeta de conocimiento para Eve agents

Interpretacion: Eve esta en desarrollo muy activo. Para produccion, conviene pinnear version, leer changelog/release notes antes de actualizar y cubrir flujos propios con evals.

## Comparacion tecnica rapida

Eve se diferencia de un "agent SDK" simple porque trae:

- filesystem conventions
- runtime durable
- HTTP session protocol
- streaming replayable
- sandbox con egress policy
- channels de plataforma
- MCP/OpenAPI connections con auth
- HITL incorporado
- subagents
- schedules
- evals
- frontend hooks
- Vercel deployment/output integration

Comparado mentalmente con Next.js:

- `agent/` equivale a la convencion de app.
- `tools/`, `skills/`, `channels/`, `connections/` son slots como routes/components/server actions, pero para agentes.
- Build/discovery convierte archivos en manifest/runtime.
- El despliegue Vercel detecta framework y agrega observabilidad de Agent Runs.

## Recomendaciones si se va a probar

Para un primer spike:

1. Usar Node 24+.
2. Crear proyecto aislado, no este portfolio:

   ```bash
   npx eve@latest init my-agent
   ```

3. Correr:

   ```bash
   eve info
   eve dev
   ```

4. Mantener `agent/instructions.md` corto.
5. Crear una tool simple con `defineTool`.
6. Deshabilitar `bash` si no hace falta.
7. Para produccion, no dejar `placeholderAuth()`.
8. Cerrar sandbox network policy si se manejan datos reales.
9. Meter `needsApproval: always()` en side effects irreversibles.
10. Escribir 2-3 evals smoke antes de tocar modelo/prompts.

Notas practicas:

- El scaffold pinnea `engines.node` a `24.x`; al probar con Node `v25.2.1`, npm emite `EBADENGINE`, aunque `tsc` y `eve build` pasaron en el scaffold minimo.
- Si se ejecuta `eve init` desde un coding agent, no arranca TUI y deja instrucciones para que el humano corra `npm exec -- eve dev`.
- En shells humanos, la doc dice que `eve init` mantiene el terminal abierto porque arranca dev server/TUI; conviene correrlo en proceso controlable.

Para elegir template:

- Slack bot minimo: `eve-slack-agent-template`.
- Agente de contenido: `eve-content-agent-template`.
- PR triage: `eve-pr-triage-agent-template`.
- Agente personal full-stack: `personal-agent-template`.
- Chat web persistido Next.js: `eve-chat-template`.

## Comandos ejecutados para reproducir esta investigacion

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

## Cobertura y limites de esta investigacion

Cubierto con evidencia directa:

- Landing oficial, KB oficial y docs publicas `eve.dev`.
- Repo `vercel/eve` clonado y actualizado al tag `eve@0.12.0`.
- npm package `eve@0.12.0` y metadata de version.
- Changelog `packages/eve/CHANGELOG.md`.
- Docs locales bajo `docs/` incluyendo getting started, tutorial, channels, connections, sandbox, deployment, evals, frontend/client y concepts.
- Codigo interno clave:
  - discovery
  - compiler artifacts
  - manifest
  - runtime graph
  - dynamic tool/skill/instruction lifecycle
  - workflow runtime
  - routes
  - harness tool loop
  - Next.js `withEve`
- Templates oficiales listadas por Vercel KB.
- Scaffold real con `npx eve@latest init`.
- `eve info --json`, `npm run typecheck` y `npm run build` sobre scaffold minimo.
- Issues, PRs y discussions publicas relevantes.

No cubierto con ejecucion real por requerir cuentas/credenciales externas:

- Deploy real a Vercel.
- Slack/GitHub/Linear/Twilio/Discord/Teams/Telegram webhooks reales.
- Vercel Connect OAuth end-to-end.
- Vercel Sandbox backend real con credential brokering.
- Vercel Workflow production routing `deploymentId: "latest"`.
- AI Gateway model call real.
- Evals contra un agente con credenciales reales.

Lectura tecnica: lo no cubierto depende de infraestructura externa, no de falta de codigo/documentacion local. Para pasar de investigacion a validacion de produccion haria falta un proyecto Vercel con AI Gateway, Connect y al menos un canal real configurado.
