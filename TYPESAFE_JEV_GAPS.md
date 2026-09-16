# Qué mejorar en el trabajo TypeSafe / Jev (auditoría contra fuentes primarias)

<!-- markdownlint-disable MD013 -->

Fecha: 2026-09-16

Convención: igual que `TYPESAFE_JEV_RESEARCH.md` y `EVE_RESEARCH.md`. Cada veredicto cita la fuente que lo posee. Esto no es un borrador de artículo.

Alcance: `ARTICULO_MEDIUM_ES.md`, `ARTICULO_MEDIUM_EN.md`, `TYPESAFE_JEV_RESEARCH.md` y las siete figuras que quedan en `public/medium-typesafe/`. No se llamó a la API (sigue sin haber clave).

## La mejora (una)

**Devolver a los artículos la distancia epistémica que el brief ya tenía.**

El brief (`TYPESAFE_JEV_RESEARCH.md`) trata TypeSafe como fuente de producto: cita, marca el caveat, y deja en “preguntas abiertas” lo que no se midió. Los artículos Medium hacen lo contrario: hablan como auditoría forense independiente y como si los escenarios de producción se hubieran ejecutado. El propio TypeSafe avisa de lo contrario — valores ilustrativos, evals con peso igual y labels de consenso, cookbook Jev-contra-Jev, precio posiblemente subvencionado, “0% alucinación” no empírico. Esa distancia se cayó al redactar.

No hace falta otro diagrama ni más páginas. Hace falta que cada cifra lleve dueño, y que lo inventado se marque como ejemplo o se borre.

## Evidencia (fuentes abiertas el 2026-09-16)

### 1. Los “casos de uso reales” no son reales

ES §6 se titula «Casos de uso reales». EN §6 dice «five real-world production scenarios».

Ahí aparecen, entre otros:

| Cifra en el artículo | Dónde | En fuentes primarias |
| --- | --- | --- |
| `noul` 0.99 / 0.96 / 0.98, Score 2.45, Choice `quarantine_host` 0.91 | ES/EN casos 1–5 | No. Docs System One: los valores de primitivas son «illustrative configurations and values». [system-one](https://docs.typesafe.ai/concepts/system-one.md) |
| SOC a 40.000 eventos/s; 95% falsos positivos | caso 2 | No aparece en docs, blog ni evals |
| 82% de facturas pagadas en automático; 18% a contabilidad | caso 4 | No. El talón de Aquiles publicado es **61.8% vs 79.1%** en invoices, no un 82% de autopago. [evals.typesafe.ai](https://evals.typesafe.ai/) |
| Cascada que resuelve el 80%–90% | patrón SDE | No hay harness público con esa tasa |
| Guardrail en ~80 ms; relé IoT en <150 ms; refund Stripe en <300 ms | casos 1, 3, 5 | El blog da **70 ms–500 ms** E2E, medido «from our laptops on the West Coast». [blog de lanzamiento](https://typesafe.ai/blog/introducing-system-one-models-and-jev) |

Esto choca con la voz de §7 («complacencia ante las cifras publicitarias»). El lector no puede saber qué se midió y qué se inventó para el ejemplo.

**Edición:** retitular a ejemplos; quitar las probs y las tasas de automatización, o sustituirlas por el ejemplo oficial de docs (`noul: 0.95`, `score: 1.4`) citado como ilustrativo.

### 2. El cookbook de las 13 preguntas ya no dice 11.5× / 9.6×

Los artículos (ES/EN §5, patrón Fan-Out) y el propio brief citan **11.5 veces más barato y 9.6 veces más rápido**.

Esa frase sigue en [primitives.md](https://docs.typesafe.ai/primitives.md) («The Parallel questions cookbook shows how batching 13 questions into one call is 11.5x cheaper and 9.6x faster»).

La página del cookbook, hoy, dice otra cosa en el lead y en la tabla ejecutada:

> «batching every question into one TypeSafe call is **12.2x cheaper and 10.0x faster** with no change in answers.»

Tabla cacheada: 1 call `$0.000497` / `0.27s` vs 13 calls `$0.006090` / `2.71s`; modelo **`jev-1.12`**, no `jev-latest`. [parallel_questions](https://docs.typesafe.ai/cookbooks/parallel_questions.md)

Dos matices que los artículos no copian y el cookbook sí:

- El ahorro de **coste** reenvía el artículo GDPR (~54k caracteres) 13 veces. El de **velocidad** suma latencias secuenciales; en paralelo el gap de tiempo se encoge, el de tokens no.
- Es Jev contra Jev (batching), no Jev contra un LLM.

**Edición:** citar el cookbook actual (12.2× / 10.0×, `jev-1.12`, documento dominante) y el caveat de concurrencia. No mezclarlo con el 40×–200× del blog.

### 3. «Promedio ponderado» / «Global Weighted Average» es falso

ES/EN tabla §7, fila final: **Promedio Ponderado Global / Global Weighted Average**, 711 casos, Jev **67.8%**.

[evals.typesafe.ai](https://evals.typesafe.ai/): «Each point averages one model configuration's accuracy, cost and time over the four workflows with **equal weight**, against the consensus labels.»

Comprobación aritmética (mismas etiquetas que el brief leyó del SVG):

- Media igual de 4 tareas: `(61.7 + 71.6 + 61.8 + 76.0) / 4 = 67.775%` → **67.8%**. Coincide.
- Media ponderada por `n_cases` (240+117+150+204=711): `(240·61.7 + 117·71.6 + 150·61.8 + 204·76.0) / 711 ≈ 67.45%`. **No** es 67.8%.

El brief ya decía «media igual de 4 tasks». El artículo lo rebautizó como ponderado por casos.

La misma tabla llama «análisis forense» a ratios derivados de esas etiquetas (p.ej. 15.1 s / 0.3 s ≈ 50×). Válido como aritmética sobre el dashboard; no es un harness propio. Labels = media de **GPT-6 Astra y Claude Fable 5.1, high thinking**. El artículo sí lo dice después; la cabecera de la tabla no.

**Edición:** «media igual de las 4 tareas (no ponderada por n)». No «711 casos ponderados».

### 4. Cifras colgadas de la misma tabla

- «DeepSeek v4 Pro (71.6%)» en Observabilidad: 71.6% es **el número de Jev** en esa fila. El brief, el mismo día, leyó Sol 76.6% y luna 76.1% como comparadores. No hay fuente primaria en el artículo para un empate con «v4 Pro».
- «reduciendo el tiempo de 90 segundos a medio segundo»: el Flash de esa fila, en el brief, era **51.7 s**, no 90 s.
- «90% del discernimiento» de los gigantes: 67.8 / 74.1 ≈ 91.5% de la **media igual** de Sol, que mide acuerdo con Astra+Fable, no discernimiento empírico. TypeSafe no publica ese 90%.
- «sistema ligero de microsegundos» (ES, patrón cascada): 70–500 ms son **milisegundos**. [blog](https://typesafe.ai/blog/introducing-system-one-models-and-jev)

### 5. Almeida no es *el* autor primario de InstructGPT

ES: «autor primario del trabajo fundacional de InstructGPT». EN: «primary author on the foundational InstructGPT research».

PDF InstructGPT (arXiv:2203.02155): Almeida va con asterisco junto a Ouyang, Wu, Jiang, Wainwright, Mishkin, etc. Nota: «**Primary authors.** This was a joint project of the OpenAI Alignment team.» Corresponding authors del paper: Lowe / Leike. [PDF OpenAI](https://cdn.openai.com/papers/Training_language_models_to_follow_instructions_with_human_feedback.pdf)

El post de OpenAI lista a Lowe y Leike como autores del anuncio y a Almeida en «paper co-authors». RLHF lo llaman «an existing technique» y citan Christiano 2017 y Stiennon 2020. [instruction-following](https://openai.com/index/instruction-following/)

El brief ya lo tenía. El artículo singulariza.

**Edición:** «uno de los autores primarios (asterisco) de InstructGPT». No «el autor primario». No «co-inventor de RLHF» sin el nexo 2017/2020.

### 6. El precio «para siempre» y el 0% de alucinación, sin el caveat del dueño

Artículos: output «gratuitos de forma permanente» / «permanently free», slogan «too cheap to meter», y (bien) un apartado que desmonta «Zero Hallucinations».

El dueño, en el mismo post de lanzamiento:

- Precio: «We can’t prove it isn’t subsidized; we’ll need the long-term to prove the sustainability of our pricing (which we expect to go down, not up).»
- Tipo: «Schema matching is guaranteed, thus we can confidently add 0% into the plots. **Our number is not empirical.**»
- 193.6× / 444.6× de la homepage: «on the higher end of real world gains.»

[blog de lanzamiento](https://typesafe.ai/blog/introducing-system-one-models-and-jev)

`$0.042 / MTok` in y output FREE siguen en esa tabla. PyPI `typesafe-sdk` **0.6.0** (2026-09-15) sigue siendo `latest`. [PyPI](https://pypi.org/project/typesafe-sdk/)

**Edición:** dejar el list price; no convertir «forever» ni «too cheap to meter» en tesis del autor. El desmontaje de alucinación de §9 está bien; no hace falta repetirlo como física del silicio en §3.

### 7. Lo que el brief prohibía copiar y el artículo igual rozó

De `TYPESAFE_JEV_RESEARCH.md` §9 / overclaims:

- No hay paper de RLCD. El artículo describe RLCD como si el objetivo de calibración bastara para el mecanismo.
- No hay diagrama ECE público. El artículo escribe la ecuación de calibración perfecta como contrato de producción.
- No se ejecutó `POST /v1/systemone`. El blueprint de §8 es el SDK documentado más retries 401/422/429/529 ([API](https://docs.typesafe.ai/api.md)), no una traza real.
- FAQ plegadas (¿subvencionado?, ¿JSON mode?, ¿determinista?) siguen sin texto SSR. No citarlas de memoria.

## Qué no tocar

- Porcentajes por workflow (61.7 / 71.6 / 61.8 / 76.0 y los de Sol/Opus) si se siguen leyendo del dashboard, con la metodología de consenso al lado. El brief los ancló al SVG/JS el 2026-09-16.
- Endpoint `POST https://api.typesafe.ai/v1/systemone`, primitivas Noul/Choice/Score, Choice ≤255, 529 Overloaded, SDK 0.6.0.
- Quitar la figura del carruaje: esa analogía ya vive en prosa; no vuelve.
- Python como código, no como captura.

## Edits concretos (ES y EN, el mismo criterio)

1. §6: de «reales» a «ejemplos». Fuera probs, 40k/s, 82%, 80–90%, 90 s, microsegundos.
2. Fan-Out: 12.2× / 10.0×, `jev-1.12`, caveat de latencia secuencial vs coste de tokens. Fuente: cookbook, no primitives.md (está desfasado respecto al cookbook).
3. Tabla evals: «media igual de 4 tareas». Quitar «ponderado». Quitar el empate inventado con DeepSeek v4 Pro. Quitar «90% del discernimiento» o sustituirlo por 67.8 vs 74.1 de acuerdo con Astra+Fable.
4. Almeida: uno de los autores primarios de InstructGPT, no el único.
5. Precio: list price + frase de TypeSafe sobre subsidio. Output free = tarifa, no ausencia de `usage.output_tokens`.
6. Sincronizar el brief: actualizar la fila del cookbook a 12.2× / 10.0×.

## Fuentes primarias abiertas en esta pasada

- [docs.typesafe.ai/cookbooks/parallel_questions.md](https://docs.typesafe.ai/cookbooks/parallel_questions.md)
- [docs.typesafe.ai/primitives.md](https://docs.typesafe.ai/primitives.md) (aún cita 11.5× / 9.6×)
- [docs.typesafe.ai/concepts/system-one.md](https://docs.typesafe.ai/concepts/system-one.md)
- [typesafe.ai/blog/introducing-system-one-models-and-jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [evals.typesafe.ai](https://evals.typesafe.ai/)
- [cdn.openai.com … InstructGPT PDF](https://cdn.openai.com/papers/Training_language_models_to_follow_instructions_with_human_feedback.pdf)
- [openai.com/index/instruction-following](https://openai.com/index/instruction-following/)
- [pypi.org/project/typesafe-sdk](https://pypi.org/project/typesafe-sdk/) (0.6.0)
- Brief previo: `TYPESAFE_JEV_RESEARCH.md`
