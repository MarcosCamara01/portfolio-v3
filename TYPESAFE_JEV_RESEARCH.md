# Brief de investigación: System One / Jev (TypeSafe AI)

<!-- markdownlint-disable MD013 -->

Fecha de investigación: 2026-09-16

Estado: brief de investigación **solo**. No es un borrador de artículo. No se llamó a la API de Jev (no hay clave en este entorno). Las FAQs plegadas de Framer no exponen el cuerpo de las respuestas cerradas en el HTML SSR.

Convención: igual que `EVE_RESEARCH.md`. Cada cifra, cita y forma de API debe rastrearse a una fuente primaria. Lo que no está en esas fuentes queda en “preguntas abiertas”.

## Mito vs realidad (1 párrafo)

El mito de automatización con chat es que un modelo que genera texto (y, si hace falta, JSON o tool calls) ya es una interfaz para software: basta con parsear la cadena y actuar. La realidad, en el framing de TypeSafe, es que RLHF/RLVR optimizan respuestas que un humano prefiere o que un verificador puede marcar, y el sampling sigue siendo autoregresivo; el software entonces paga tokens de salida, latencia serial, parseo y el riesgo de que el modelo se salga del tipo. Un “decision model” / System One, en sus docs, no escribe réplicas ni código: recibe `state` (string, objeto o array) y un mapa de preguntas tipadas, y devuelve valores restringidos al esquema — `noul` en [0,1], `choice` + distribución, `score` ponderado + `legend` — más `confidence` en Choice/Score. Eso no hace al modelo infalible: una etiqueta válida puede ser semánticamente falsa, y la calibración se define sobre grupos de predicciones, no sobre un caso. Jev es el caso de estudio concreto (API `POST /v1/systemone`, SDK `system_one`), no una receta de AGI.

## Hallazgos clave (con fuentes)

### 1. Quién es Diogo Almeida / TypeSafe AI

- Cuenta X `@CompleteSkeptic`, nombre **Diogo Almeida**, bio: “co-created RLHF/ChatGPT @ @openai … (ceo @typesafeai)”. Tweet de lanzamiento (2026-09-15 18:17:52 UTC): “After co-inventing ChatGPT… last 2 years in stealth… RLCD… Jev”. Texto completo (note tweet): “20-200x faster / 40-400x cheaper (w/ output tokens free) / Frontier composable intelligence optimized for decisions / AFAICT the shortest path to AI-based economic revolution”. Fuente: [post 2099925682726002904](https://x.com/CompleteSkeptic/status/2099925682726002904).
- LinkedIn (`diogomda`): CEO TypeSafe AI desde **enero 2024**; MTS OpenAI **enero 2020–enero 2024** (Instruction Following / InstructGPT / ChatGPT / GPT-4); Google Brain 2017–2018; Enlitic; Amazon; MS CS Georgia Tech; BS RPI. Headline auto-descrito: “co-inventor of ChatGPT, GPT4, RLHF, and InstructGPT”. Fuente: [linkedin.com/in/diogomda](https://www.linkedin.com/in/diogomda) (captura 2026-09-16).
- Página de equipo TypeSafe: “Diogo co-invented RLHF and InstructGPT, the methods that lead to ChatGPT and GPT4. Previously, he was at Google Brain.” Cofundadores listados: **Sasha Sheng** (COO, ex Meta/FAIR), **Erik Gafni** (CTO). Oficina SF, “backed by top-tier investors” **sin nombres ni cifras**. Fuente: [typesafe.ai/team](https://typesafe.ai/team).
- Blog de lanzamiento (firma “Diogo Almeida, founder”): “At OpenAI, I helped build the methods that made language models useful at following instructions and talking with people. That work ended up as the research behind ChatGPT.” “After two years in stealth…”. Fuente: [Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) (15 sep 2026).
- InstructGPT paper, autores primarios (asterisco): incluye **Diogo Almeida\*** junto a Ouyang, Wu, Jiang, Wainwright, Mishkin, etc. “This was a joint project of the OpenAI Alignment team.” arXiv:2203.02155. OpenAI agradece a Almeida como coautor en [Aligning language models to follow instructions](https://openai.com/index/instruction-following/) (27 ene 2022).
- GPT-4 contributions (OpenAI): Almeida aparece en “Dataset contributions”, “Foundational RLHF and InstructGPT work”, “Instruction following and API evals”. **No** figura como unique inventor. Fuente: [openai.com/contributions/gpt-4](https://openai.com/contributions/gpt-4/).
- ChatGPT launch post (30 nov 2022): Almeida está en Acknowledgments, una lista larga. ChatGPT “is a sibling model to InstructGPT” y “trained using RLHF, using the same methods as InstructGPT”. Fuente: [openai.com/index/chatgpt](https://openai.com/index/chatgpt/).
- **Verificación del claim “co-inventor of RLHF/ChatGPT”:** RLHF como método **precede** InstructGPT. OpenAI describe RLHF como “an existing technique” y cita Christiano et al. 2017 y Stiennon et al. 2020. Almeida **sí** es autor primario de InstructGPT (el paper que OpenAI liga al lineage de ChatGPT) y está acreditado en RLHF/InstructGPT de GPT-4. “Co-inventor of ChatGPT” y “co-invented RLHF” son **framing propio / prensa**, no un título oficial de OpenAI. The Register (16 sep 2026) lo llama “one of the co-inventors of RLHF and ChatGPT” — prensa, no paper.
- Funding: The Register (Thomas Claburn, 16 sep 2026): “a startup bestowed with **$40 million** in funding”. No nombra lead investor. Forbes titular “This **$200 Million** Startup…” (15 sep 2026) — el cuerpo del artículo **no se pudo recuperar** (timeout); no citar valoración $200M como hecho verificado. TypeSafe no publica ronda en el blog/manifesto/team. CB Insights mezcla aceleradoras AWS y es poco fiable aquí.

### 2. Qué significa “System One models” (Kahneman, sin improvisar psicología)

Definiciones **exactas** de TypeSafe (no de Wikipedia):

- Docs System One: “System One models are a class of AI models built to make fast, structured decisions that software can use directly. A System One model evaluates a state and returns typed answers and probabilities. Jev is TypeSafe's flagship model and the first System One model. Like an LLM, a System One model understands natural-language input. It returns typed decisions and probabilities rather than generated text.” “The System One name comes from the concept Daniel Kahneman popularized in his book Thinking, Fast and Slow. System 1 thinking is fast and intuitive. System 2 is slower and more deliberate. Here, the emphasis is on fast, focused judgments.” Fuente: [docs.typesafe.ai/concepts/system-one](https://docs.typesafe.ai/concepts/system-one.md).
- FAQ del blog (única respuesta de FAQ SSR abierta): “We were inspired by Daniel Kahneman, Thinking, Fast and Slow. The model class name draws on the distinction between fast, intuitive System 1 thinking and slow, deliberate System 2 reasoning. ‘System 1 thinking’ has also implied error-prone. For reasons we will get into in the future, we believe System One Models can be made more reliable than its alternatives.” Jev: William Stanley Jevons / Jevons paradox. Fuente: blog de lanzamiento.
- Homepage FAQ abierta: “System One Models are a new class of AI model built for decisions inside software. Jev is TypeSafe’s first public System One Model, optimized for automation. Send Jev structured questions and get typed decisions with probabilities and confidence that your software can act on.” Fuente: [typesafe.ai](https://typesafe.ai).
- Docs **no** identifican System One con “System 1 es siempre sesgado/erróneo”. Al contrario, posponen el argumento de fiabilidad. No improvisar más psicología.

### 3. RLCD vs RLHF — qué se optimiza; qué es “calibrated”

- Primer (docs): tres post-trainings. RLHF → chatbots / preferencia humana. RLVR → rewards verificables (p.ej. matemáticas), “slower and more expensive”. RLCD: “Reinforcement learning for calibrated decisions trains TypeSafe to return decisions and calibrated probabilities instead of generated text.” Contrato: no genera texto; higher probability ↔ mayor chance de acierto. Calibración **de grupo**: P=0.2 debe ocurrir ~20% de las veces, etc. “These rates describe groups of predictions, not a guarantee about any single answer.” Fuente: [AI primer](https://docs.typesafe.ai/introduction/machine-learning-primer.md).
- Blog tabla: RLCD “Optimizes for: Calibrated decisions: answers with epistemically honest probabilities on System One tasks.” vs RLHF “Human preference: writeups and chat responses that human raters prefer” / RLVR “outputs that can be programmatically verified.”
- Primer sobre RLHF: sycophancy, “confident-sounding hallucinations”, **mode dropping** (estilo preferido reduce otras salidas). “Human preference and machine trustworthiness are different optimization targets.”
- Confidence page: `confidence` (Choice/Score) **no es** la probabilidad del label elegido; es un estadístico 0–1 derivado de la forma de `probabilities`. Noul **no** lleva `confidence` aparte: el propio `noul` cerca de 0.5 es la incertidumbre. Fuente: [confidence](https://docs.typesafe.ai/confidence.md).
- **No hay paper público de RLCD**, ni loss, ni datos, ni receta. Solo framing de producto.

### 4. Capacidades y no-capacidades de Jev (citas)

Puede:

- Evaluar `state` + preguntas Choice / Score / Noul en paralelo e independientes. Docs introduction, primitives, API.
- Devolver distribuciones y (Choice/Score) `confidence`. API reference.
- Hasta **255 opciones** en un Choice; por encima, el blog dice 2 etapas (score independiente + choice). Fuentes: [choice](https://docs.typesafe.ai/primitives/choice.md); blog Wikiracing nuance.
- Presupuesto de request ~**32,000 tokens** / ~150,000 caracteres de inglés (state + questions). Fuente: primitives.

No puede (citas):

- Tweet hilo: “The gains aren’t free: **Jev can't generate text**.” [2099925684256899543](https://x.com/CompleteSkeptic/status/2099925684256899543).
- Blog: “While Jev **gives up string generation**, it’s optimized for structured outputs and **can’t hallucinate**.” “Think of Jev as a frontier-intelligence function call: unstructured state in, typed probabilistic decisions out.”
- Docs System One: “System One models **do not write replies, produce code, or generate explanations of their reasoning**.”
- Docs how-to-build: “It **does not generate code or choose its own next action**.”
- Almeida 2026-09-16: sequential reasoning “like math: the model is **terrible (like gpt-4 level)**”; “detailed instructions requiring human judgement: comparable to even the largest frontier models* (* most of the time)”. [2100088108301897979](https://x.com/CompleteSkeptic/status/2100088108301897979).
- Almeida: “giving up strings is more of a tradeoff in **flexibility** than intelligence… Majority of LLM use cases are very string-centric”. [2100094217951547875](https://x.com/CompleteSkeptic/status/2100094217951547875).

“Can’t hallucinate / zero hallucinations”:

- Blog: type-safety “table stakes”; “Schema matching is **guaranteed**, thus we can confidently add **0%** into the plots.” “Our number is **not empirical**.”
- Homepage copy: “Zero Hallucinations” junto a “Every Jev decision comes with a confidence estimate…” — el eslogan **no** equivale a “nunca se equivoca”.
- The Register: “TypeSafe claims that Jev is hallucination-free, which really isn't a fair comparison as its output is not natural language… that does not preclude the possibility of being incorrect.”
- Docs confidence y how-to-build asumen error: hay que escalar a humano o “more expensive reasoning model”.

### 5. Arquitectura y precio (solo números de páginas primarias)

Arquitectura (claims de producto, **sin paper ni diagramas de pesos**):

- “new model architecture, **parallel sampler**, and training method we call RLCD.” Blog.
- “Sampling: Parallel. Generates all outputs in a single query.” vs LLM “one token at a time.” Blog tabla.
- Tweet: “replacing sequential computation with parallel is the same way Transformers leapfrogged RNNs.”
- “No type errors: … it is **mathematically impossible**.” Blog (esquema, no semántica).

Precio / velocidad (fuentes primarias):

| Claim | Número | Fuente | Caveat que ellos mismos ponen |
| --- | --- | --- | --- |
| Input | **$0.042 / MTok** = **$42 / billion** | Blog tabla; homepage “$42 Per Billion input tokens”; tweet 2099925685720760404 | Blog: “We can’t prove it isn’t subsidized; we’ll need the long-term… (which we expect to go down, not up).” FAQ homepage “Are these prices temporary or subsidized?” existe; **respuesta plegada no está en SSR**. |
| Output | **FREE** / “too cheap to meter” | Blog; tweet “output tokens are free (**forever** - they’re too cheap to meter with our new architecture)” | El JSON de respuesta **sí incluye** `usage.output_tokens` (docs). “Gratis” es pricing, no ausencia de tokens de protocolo. |
| vs Fable 5.1 input | **238x** lower | Homepage | Comparación de list price de input, no de un workload. |
| E2E TypeSafe | **70ms–500ms** | Blog tabla | “published evals are generally run from our laptops on the West Coast (this is where our service is currently based).” |
| E2E frontier LLM | **3 to 329 seconds** | Blog tabla | Rango enorme; mezcla reasoning. |
| Speedup blog | **40x–200x** “for the same levels of frontier intelligence for System One shaped queries” | Blog tabla | Condicionado a queries “System One shaped”. |
| Tweet / seed | **20–200x** faster, **40–400x** cheaper | Tweet + note | Rango de marketing; no es el mismo que 40–200x del blog. |
| Homepage hero | **193.6x Faster, 444.6x Cheaper** + demo Cost **$0.000081** / **0.114s** vs LLM **$0.013880** / **8.566s** | Homepage; blog: “This is where the claims of 193.6x faster, 444.6x cheaper on our home page comes from, and we expect that these are **on the higher end of real world gains**.” | El asterisco dice “based on workflows for System One tasks (proof)” → [evals.typesafe.ai](https://evals.typesafe.ai/). |
| Docs how-to-build | “Most queries complete in about **100 ms**.” | how-to-build | Aproximación, no p95. |
| Cookbook paralelo | 13 preguntas en 1 call: **11.5x cheaper, 9.6x faster** vs 13 calls | [parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions.md) | Jev vs Jev (batching), no vs LLM. |
| Doom | ~10 queries/s, **~$7/hour** (el ingeniero “worried”) | Blog Fun Demos | Anecdótico. |

The Register cita GPT-5.6 Terra **$2.00 / MTok in, $12 / MTok out** vs Jev $0.042 / 0. Eso es prensa citando list prices; no re-verificar OpenAI aquí.

### 6. Superficie de desarrollador

**Auth / acceso**

- `Authorization: Bearer <API_KEY>`; env `TYPESAFE_API_KEY`. Quickstart, API, SDKs.
- Clave desde “dashboard”. Playground: [console.typesafe.ai](https://console.typesafe.ai) (login).
- Early access + waitlist: blog “opening early access and bringing developers off the waitlist”. Almeida: “people have already started posting results… we have a waitlist”; “get everyone off the waitlist ASAP”; “goal is to get >= 50% off the waitlist tomorrow”. Consola existe (status.typesafe.ai: `api.typesafe.ai` y `console.typesafe.ai` operativos; última actualización del status page 19 ago 2026).
- URL de waitlist indexada históricamente: `https://typesafe.ai/join-the-waitlist` (formulario first/last/company/email). **En esta investigación (16 sep 2026) esa ruta devolvió HTTP 404.** No inventar la URL actual del botón “Join Waitlist” de Framer.
- Términos del **sitio** (14 sep 2026): [typesafe.ai/legal/terms](https://typesafe.ai/legal/terms) — licencia del marketing site, no un AUP de API. Un índice de búsqueda antiguo citaba “preview version” / “may not be suitable for production” / “do not publish benchmarks”; **ese texto no está en el HTML actual de `/legal/terms`**. Tratar ToS de API como no verificado.

**HTTP**

```http
POST https://api.typesafe.ai/v1/systemone
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

Errores documentados: 401, 422, 429, **529 Overloaded**. Fuente: [API reference](https://docs.typesafe.ai/api.md).

Modelo documentado: `"jev-latest"` (default SDK).

**Python** (`typesafe-sdk` 0.6.0 en PyPI, 2026-09-15; Python >=3.10). Repo: [typesafe-ai/typesafe-sdk-python](https://github.com/typesafe-ai/typesafe-sdk-python).

```python
from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

with TypeSafeClient() as client:
    response = client.system_one(
        state="Hi, I've been trying to connect my Stripe account for 3 days...",
        questions={
            "department": Choice(
                instructions="Which team should handle this",
                criteria={
                    "billing": "Payment or subscription issues",
                    "technical": "Bugs or integration problems",
                    "sales": "Pricing or account questions",
                },
            ),
            "frustration": Score(
                instructions="How frustrated the customer appears",
                criteria=["Calm, just stating facts", "Frustrated but civil", "Very angry, strong language"],
            ),
            "is_urgent": Noul(
                instructions="The message conveys urgency or time-sensitivity",
            ),
        },
    )
print(response.answers["department"].choice)
print(response.answers["frustration"].score)
print(response.answers["is_urgent"].noul)
```

También existen vistas `response.nouls`, `response.choices`, `response.scores` en el quickstart async. Fuente: [SDK Python](https://docs.typesafe.ai/sdk/python.md), [quickstart](https://docs.typesafe.ai/introduction/quickstart.md).

**JavaScript** `@typesafe-ai/sdk`, `client.systemOne({...})`, helpers `choice()`, `noul()`, `score()`. Fuente: [sdk/javascript](https://docs.typesafe.ai/sdk/javascript.md).

No hay método HTTP separado `ask`; el “ask” de terceros (p.ej. extensión Swamp) es un wrapper sobre el mismo `POST /v1/systemone`.

Skill de agentes: `npx skills add typesafe-ai/skills --skill typesafe-ai`. Fuente: quickstart.

### 7. Cómo evalúan vs LLMs (demo theater vs reproducible)

**Workflow evals (lo más cercano a un harness público)**

- Sitio: [evals.typesafe.ai](https://evals.typesafe.ai/) — overview + `security_incidents.html`, `agent_trace_observability.html`, `invoice_processing.html`, `customer_service.html`.
- Método (ellos): mismo workflow/código para todos los modelos; “assume the harness is correct”; labels de referencia = **promedio de GPT-6 Astra y Claude Fable 5.1, both at high thinking**; el resto de modelos en **default reasoning** del proveedor; “accuracy against the consensus labels”; workflow vs “same policy as a prompt”.
- Blog: LLMs usan **“System One LLM wrapper”** (decisiones estructuradas + probs); “most accurate way… but slower and more expensive than giving decisions without probabilities.” Workflows “not in our training distribution” pero “made by individuals on our model capabilities team, so some bias could exist.” Sesgo hacia OpenAI/Anthropic en el label. “we likely underestimate … our model and DeepSeek.”
- Adapter oficial para ese wrapper: [typesafe-ai/system-one-adapter-python](https://github.com/typesafe-ai/system-one-adapter-python) — drop-in `system_one` sobre APIs LLM, `structured_outputs=True`, `llm_answer_mode="probabilities"|"discrete"`, retries por JSON malformado.
- Política de benchmarks: [Lies, Damned Lies, and Benchmarks](https://typesafe.ai/blog/antibenchmaxxing) (11 sep 2026): “no standard benchmark table in our model releases. New evals will be dated snapshots and immediately retired… publish evolving internal evals… caveats, any cherry-picking, and evidence that looks bad.” FAQ del blog “How does Jev perform against public benchmarks?” — **respuesta no en SSR**.

**Números leídos de las etiquetas SVG / `n_cases` del JS de evals (2026-09-16), no de un CSV descargable:**

| Workflow | `n_cases` | Jev workflow | Mejor comparador visible en la misma página (workflow) |
| --- | --- | --- | --- |
| Security Incidents | 240 | 61.7% · $0.0001 · 0.3 s | opus 5 66.2% · $0.0574 · 15.1 s; sol 62.5% · $0.0295 · 8.5 s |
| Agent Trace Observability | 117 | 71.6% · $0.0003 · 0.5 s | sol 76.6% · $0.0575 · 40.3 s; luna 76.1% · $0.0025 · 14.5 s |
| Invoice Processing | 150 | 61.8% · $0.0011 · 0.5 s | sol 79.1% · $0.2152 · 34.3 s (**mayor gap**) |
| Customer Service | 204 | 76.0% · $0.0001 · 0.4 s | sol 78.3% · $0.0323 · 10.1 s |
| Overview (media igual de 4 tasks) | **711** | Jev 67.8% · $0.0004 · 0.4 s | sol 74.1% · $0.0836 · 23.3 s |

Los arrays `cases` del JS público solo incluyen un “handful of cases” (5–10 ejemplos), no las 711 predicciones crudas.

**Demos (teatro / matiz propio)**

- Side-by-side: Jev saca todas las probs en paralelo vs Terra autoregresivo. Nuance: query simplificada; `state` corto; “advantageous light”; un desacuerdo en “Churn likelihood”; Terra default reasoning.
- Doom: **estado estructurado con texto, no imágenes**; “a non-AI doom bot could play better”.
- Wikiracing: vs modos **non-reasoning** (excepto Astra mínimo); cardinalidad >255 → 2 etapas.
- Docs demo Smart Home: fan-out especulativo + **LLM para partir requests compuestos y para conversación**. Código “will be available on GitHub at release” — **aún no verificado como repo público**.

### 8. Enfoques adyacentes (contraste corto)

Ver tabla más abajo. Lo **genuinamente distinto** en docs/blog, no en marketing vacío:

1. Contrato de salida nativo (no hay etapa de generación de string que luego se parsea).
2. Sampling paralelo de muchas preguntas sobre el mismo state (coste/latencia de añadir preguntas “barely changes”).
3. Objetivo de entrenamiento declarado (calibración de decisiones), no preferencia de texto.
4. Código dueño del control flow (how-to-build vs “LLM agents”).

Lo que **no** está demostrado públicamente: que RLCD sea un algoritmo nuevo publicable; tamaño/arquitectura; que las probs estén calibradas en un plot ECE independiente; que “zero hallucination” sea más que “no hay type error”.

### 9. Modos de fallo (cuando NO usar este framing)

Todavía hace falta un LLM cuando hace falta **texto**: replies, code, planes abiertos, split de utterances, explicaciones (docs System One + smart-home + Almeida “string-centric”). Also sequential math/reasoning (tweet gpt-4-level).

El decision model “miente” (semánticamente) si:

- Schema mal diseñado (opciones solapadas, Noul sin definición de “yes”, Score vs Noul confundidos — docs primitives).
- State mal recortado o paths `` `ticket.messages[0].text` `` incorrectos (state.md).
- Probs mal calibradas en *tu* dominio (docs: “Start with conservative thresholds, test with your own data”; calibración grupal no individual).
- Wrapper LLM en evals hace que “Jev vs LLM” no sea “Jev vs el JSON más barato sin probs”.
- Confundir `choice` (argmax) con la masa de probabilidad del runner-up (ejemplo docs: returns 0.60 vs billing 0.38, confidence 0.39).

Overclaims a no copiar al artículo:

- AGI / “economic revolution” / TFP 3% (manifiesto footnote 2) como hecho.
- “Co-inventor of ChatGPT/RLHF” sin el nexo InstructGPT + lista OpenAI.
- “Zero hallucinations” = nunca se equivoca.
- 193.6x / 444.6x como universal.
- Open weights / paper RLCD (no existen en fuentes públicas).

### 10. Reproducibilidad (¿puede un lector llamar la API hoy?)

| Pregunta | Hallazgo |
| --- | --- |
| ¿API pública documentada? | Sí: `POST https://api.typesafe.ai/v1/systemone`. |
| ¿SDK públicos? | Sí: PyPI `typesafe-sdk` 0.6.0; npm `@typesafe-ai/sdk`; GitHub typesafe-ai. |
| ¿Clave ahora mismo? | Early access. Waitlist + console login. Esta investigación **no** obtuvo una key ni ejecutó una llamada. |
| ¿Pesos abiertos? | No. Org GitHub: SDKs, skills, adapter, daggerverse. Almeida sobre OSS: “the bottleneck for a new task/north star is data and not an architecture”. |
| ¿Benchmarks públicos estándar? | Política explícita de no publicarlos. Workflow evals propios, labels de modelos frontier, ejemplos no dataset completo. |
| ¿Paper RLCD? | No encontrado. |

## RLCD vs RLHF (5 bullets, sourced)

1. **Objetivo.** RLHF: “trains models to produce responses people prefer” / blog “writeups and chat responses that human raters prefer.” RLCD: “return decisions and calibrated probabilities instead of generated text” / “epistemically honest probabilities on System One tasks.” Fuentes: primer, blog tabla.
2. **Contrato de salida.** RLHF/InstructGPT/ChatGPT generan strings (paper InstructGPT; ChatGPT launch). RLCD: “The model does not generate text.” Primer.
3. **Fallos que TypeSafe atribuye a RLHF.** Sycophancy, alucinaciones que suenan seguras, mode dropping. Primer. Manifesto: RLHF “directly optimizes for human preference” → humanos en el loop.
4. **Calibración.** RLCD define calibración como frecuencias empíricas por bin de probabilidad (0.2 → ~20%, …), **agregada**. Primer. `confidence` extra es un colapso de la distribución, no un segundo modelo. Confidence page.
5. **Línea de tiempo.** RLHF no nace en ChatGPT: Christiano 2017; Stiennon 2020; InstructGPT 2022 (Almeida autor primario); ChatGPT usa “same methods as InstructGPT”. RLCD no tiene paper; es marca de TypeSafe 2026.

## Contrato I/O de Jev (5 bullets)

1. **Entra `state`:** string *o* JSON object/array (mensaje, ticket+policy, estado de app). Todas las preguntas de un request ven el mismo state. [state](https://docs.typesafe.ai/concepts/state.md).
2. **Entran `questions`:** mapa id → `{type, instructions, criteria?}`. IDs **no** se envían al modelo. Types: `noul` | `choice` | `score`. Choice `criteria` = mapa opción→descripción/`null`; Score = array ordenado ≥2 niveles; Noul criteria opcional `{true, false}`. [primitives](https://docs.typesafe.ai/primitives.md), [API](https://docs.typesafe.ai/api.md).
3. **Sale `answers` bajo los mismos ids:** Noul `{type, noul}`; Choice `{type, choice, probabilities, confidence}`; Score `{type, score, legend, probabilities, confidence}`. `score` puede caer **entre** niveles. Probs de Choice/Score suman 1. Noul no tiene `confidence`.
4. **Sale `model` + `usage.{input_tokens,output_tokens}`.** Output tokens existen en el protocolo aunque el precio de output sea $0.
5. **Paralelo e independiente:** “Every question is evaluated in parallel and in isolation.” Dependencias reales = **segundo request** (docs). Cardinalidad Choice ≤255; budget ~32k tokens.

## Snippets mínimos (oficiales) o TODOs

Usar los de quickstart / API (arriba). Curl oficial:

```bash
curl -X POST https://api.typesafe.ai/v1/systemone \
  -H "Authorization: Bearer $TYPESAFE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"state":"...","model":"jev-latest","questions":{"urgency":{"type":"noul","instructions":"Does this message express urgency?"}}}'
```

**TODOs si se escribe el artículo después:**

- FAQ plegadas (homepage + blog): “Is Jev just a smaller LLM?”, “How is this different from JSON mode or structured outputs?”, “Are these prices temporary or subsidized?”, “Can Jev still get things wrong?”, “Is Jev deterministic?”, “How does Jev perform against public benchmarks?”, “Where does our training data come from?” — **no citar de memoria**; hay que abrir el acordeón o pedir a TypeSafe el texto.
- Ejemplo de respuesta JSON del quickstart (`choice: technical`, `noul: 0.999`, etc.) es **ilustrativo de docs**, no una medición propia.
- Rate limits numéricos: no documentados más allá de 429/529.
- Versión pin (`jev-1.x`) vs alias `jev-latest`: Almeida mencionó “jev 1.14” en un reply; cookbooks de terceros citaron `jev-1.13.0` — **no confirmado en docs**.

## Tabla corta: enfoques adyacentes

| Enfoque | Qué produce | Relación con Jev | Fuente del contraste |
| --- | --- | --- | --- |
| Chat + tool calling / JSON mode | Tokens, luego schema o tools | Sigue siendo generación; TypeSafe pregunta FAQ “JSON mode or structured outputs?” (respuesta no SSR). Adapter oficial usa structured outputs de OpenAI/Anthropic para **imitar** el contrato System One y comparar. | FAQ homepage; adapter README |
| Structured outputs / constrained decoding | JSON válido | Garantía de tipo **en el decoder del LLM**, no elimina sampling serial ni tokens de salida caros; TypeSafe afirma “never has to recover a value from generated prose.” | how-to-build; adapter (`n_retry_malformed_structure`) |
| Classification / scoring heads clásicos | Labels fijos | TypeSafe se vende como zero-shot generalista programable (Almeida: “extreme efficiency zero-shot general classifiers”). Sin paper que lo separe de un encoder+head. | tweet 2100080911111028892 |
| Reward models | Score de preferencia sobre **texto** | RLHF usa RM sobre completions. Jev Score es un primitivo de producto sobre state, no un RM de chat. | InstructGPT paper; Score docs |
| Agentes que aún emiten texto | Plan + tools en lenguaje | Docs: “LLM agents… every loop introduces another opportunity to go off the rails” vs “code owns the control flow.” Intent routing: Jev clasifica; LLM/humano ejecutan. | how-to-build; [intent routing](https://docs.typesafe.ai/patterns/intent-routing.md) |

## Riesgos / cuándo NO usar este framing

- El trabajo es **generar** (email, código, UI, diálogo). TypeSafe lo dice: no replies, no code, no explanations.
- Necesitas razonamiento secuencial tipo math proofs (Almeida: “terrible”).
- No puedes diseñar schema, thresholds ni holdout propio (docs: umbrales dependen del dominio).
- Tratas 193.6x/zero-hallucination/AGI como hechos.
- Confundes “early access waitlist” con commodity API.
- Usas Jev como agente autónomo (docs: no elige next action).
- El estado real es imagen/audio: Doom matiz “not on images (yet…)”.

## Preguntas abiertas

1. Texto de las FAQs plegadas (JSON mode, subsidio, determinismo, datos de entrenamiento, benchmarks públicos, “smaller LLM”).
2. Paper / receta RLCD; tamaño del modelo; hardware; si es encoder, diffusion, o LLM sin cabeza de lenguaje.
3. Cuerpo de Forbes ($200M) e inversores (team solo dice “top-tier”).
4. ToS/AUP de la **API** (el `/legal/terms` actual es del Site).
5. URL viva de waitlist (404 en `/join-the-waitlist` el 16 sep 2026).
6. Calibración empírica (reliability diagrams, ECE) — no hay plots de calibración, solo definición.
7. Dataset completo de las 711 evals vs 5 ejemplos por workflow.
8. Independencia real de preguntas en el sampler (afirmado; no auditado).
9. Smart-home demo source “at release”.
10. Llamada real autenticada: errores, latencia p95, `jev-latest` pin, si output_tokens=0 o >0 en la práctica.

## Fuentes primarias

- Tweet lanzamiento y hilo: [2099925682726002904](https://x.com/CompleteSkeptic/status/2099925682726002904), [can't generate text](https://x.com/CompleteSkeptic/status/2099925684256899543), [pricing](https://x.com/CompleteSkeptic/status/2099925685720760404)
- [Blog: Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [typesafe.ai](https://typesafe.ai), [manifesto](https://typesafe.ai/manifesto), [team](https://typesafe.ai/team), [antibenchmaxxing](https://typesafe.ai/blog/antibenchmaxxing)
- Docs: [llms.txt](https://docs.typesafe.ai/llms.txt), [system-one](https://docs.typesafe.ai/concepts/system-one.md), [primer](https://docs.typesafe.ai/introduction/machine-learning-primer.md), [confidence](https://docs.typesafe.ai/confidence.md), [primitives](https://docs.typesafe.ai/primitives.md), [choice](https://docs.typesafe.ai/primitives/choice.md), [noul](https://docs.typesafe.ai/primitives/noul.md), [state](https://docs.typesafe.ai/concepts/state.md), [how-to-build](https://docs.typesafe.ai/concepts/how-to-build-with-system-one.md), [API](https://docs.typesafe.ai/api.md), [quickstart](https://docs.typesafe.ai/introduction/quickstart.md), [intent routing](https://docs.typesafe.ai/patterns/intent-routing.md), [smart home](https://docs.typesafe.ai/demos/smart-home.md)
- [evals.typesafe.ai](https://evals.typesafe.ai/)
- [The Register, 16 Sep 2026](https://www.theregister.com/ai-and-ml/2026/09/16/typesafe-ai-debuts-model-for-machines-that-plays-doom/5296711)
- OpenAI: [InstructGPT paper](https://cdn.openai.com/papers/Training_language_models_to_follow_instructions_with_human_feedback.pdf), [instruction-following blog](https://openai.com/index/instruction-following/), [ChatGPT](https://openai.com/index/chatgpt/), [GPT-4 contributions](https://openai.com/contributions/gpt-4/)
- RLHF previo: Christiano et al. 2017; Stiennon et al. 2020
- GitHub: [typesafe-ai](https://github.com/typesafe-ai), [system-one-adapter-python](https://github.com/typesafe-ai/system-one-adapter-python)
- PyPI: [typesafe-sdk 0.6.0](https://pypi.org/project/typesafe-sdk/)
- [status.typesafe.ai](https://status.typesafe.ai/)
- [legal/terms](https://typesafe.ai/legal/terms)
