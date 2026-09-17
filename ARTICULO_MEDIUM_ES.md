# Por qué el chat fue la interfaz equivocada para automatizar el mundo (y qué cambia con los modelos de decisión)

> *Durante cuatro años intentamos que el software empresarial hablara con chatbots. La verdadera revolución de la automatización no genera palabras: devuelve tipos, probabilidades, milisegundos y control estricto.*

---

## 1. La paradoja de la automatización

Llevamos cuatro años escuchando que los modelos de inteligencia artificial han alcanzado capacidades sobrehumanas. Aprueban exámenes de grado médico, resuelven pruebas de programación competitiva, debaten sobre metafísica y sintetizan miles de páginas de literatura legal en cuestión de segundos. Sin embargo, en el día a día de la ingeniería de software y las operaciones empresariales reales, persiste una contradicción flagrante:

*¿Por qué tu banco sigue tardando tres días laborables en resolver un cobro duplicado evidente? ¿Por qué los centros de operaciones de ciberseguridad continúan asfixiados por decenas de miles de alertas falsas analizadas a mano? ¿Por qué las cadenas de suministro y los sistemas de facturación corporativos siguen anclados a frágiles expresiones regulares, macros de Excel y flujos humanos repetitivos?*

Si los modelos de frontera son tan asombrosamente inteligentes, ¿dónde está toda la automatización prometida?

La respuesta no se encuentra en una hipotética falta de potencia de cálculo ni en una carencia de conocimiento enciclopédico dentro de las redes neuronales: reside en una profunda confusión de diseño. **Hemos confundido la inteligencia computacional con la elocuencia conversacional.**

Cuando surgió el automóvil moderno a principios del siglo XX, los primeros talleres fabricaron lo que la industria denominaba literalmente "carruajes sin caballos" (*horseless carriages*). En lugar de concebir el transporte mecánico desde sus primeros principios físicos, tomaron el carruaje de madera tradicional y simplemente sustituyeron el caballo por un motor de combustión. Mantuvieron los asientos elevados de banco, las ruedas de carro, las ballestas de suspensión e incluso el receptáculo para encajar el látigo. Hizo falta casi un tercio de siglo para que la industria comprendiera que un automóvil exigía un chasis autoportante, aerodinámica propia, neumáticos de baja presión y una posición de conducción adaptada a la velocidad.

En la inteligencia artificial moderna hemos caído exactamente en la misma trampa: **el chatbot es nuestro carruaje sin caballos.** 

Al presenciar la emergencia del razonamiento semántico en modelos masivos de lenguaje, la industria apresuró el desarrollo forzando a la tecnología a adoptar la máscara de un asistente humano con el que se charla en una ventana de texto. Pero los sistemas informáticos no cooperan entre sí contándose historias ni intercambiando cordialidades. 

La historia de la computación demuestra que las capacidades complejas solo transforman la economía cuando se destilan en abstracciones que el software ordinario puede componer. Ocurrió con las bases de datos: en los años sesenta, cada aplicación almacenaba información en ficheros planos con punteros ad-hoc y algoritmos artesanales; el despegue masivo del software no llegó añadiendo más ficheros, sino cuando el álgebra relacional y el estándar SQL convirtieron el almacenamiento en una primitiva determinista y consultable.

Cuando un proceso empresarial necesita el criterio de una inteligencia artificial, no necesita párrafos ornamentados, disculpas educadas ni prosa suasoria: **necesita decisiones estricta y matemáticamente tipadas, probabilidades honestas y tiempos de respuesta compatibles con el ciclo de vida de un servidor.**

---

## 2. La física del hardware: por qué los LLMs rompen el backend tradicional

Para cualquier equipo de ingeniería que haya intentado incrustar un modelo de lenguaje convencional (un LLM autoregresivo como GPT-4, Claude o Llama) en el núcleo transaccional de una aplicación de producción, la experiencia se convierte rápidamente en una guerra de trincheras contra la física misma del hardware.

![JSON Mode escribe el esquema token a token; un prefill comparte la KV cache y cada campo recorta logits a las opciones válidas.](https://raw.githubusercontent.com/MarcosCamara01/portfolio-v3/cursor/typesafe-jev-research-a7bf/public/medium-typesafe/es-02-prefill-decode.png)

*Arriba, JSON Mode sigue pagando el decode. Abajo, un prefill y softmax solo sobre los tokens del campo. Versión editorial de la [explicación de Niels Rogge](https://x.com/NielsRogge/status/2100239244501430438); no es un diagrama oficial de TypeSafe. Las cifras son ilustrativas.*

Para comprender por qué los LLMs son la herramienta equivocada para el enrutamiento y la toma de decisiones en código, es imprescindible examinar cómo ejecutan la computación las unidades de procesamiento gráfico (GPUs):

### 1. Prefill vs. Decode: el peaje del ancho de banda de memoria
Toda inferencia en un transformador generativo se divide en dos fases radicalmente distintas:
* **Fase de Prefill (Procesamiento del contexto):** La GPU ingiere la totalidad del prompt de entrada en un único cálculo masivo. Miles de multiplicaciones matriciales se ejecutan en paralelo, saturando los *Tensor Cores*. Esta fase es intensiva en cómputo (*compute-bound*) y extremadamente eficiente: procesar 2.000 tokens de contexto lleva apenas unas decenas de milisegundos.
* **Fase de Decode (Generación autorregresiva):** Para emitir la respuesta, el modelo se ve obligado a predecir un único token cada vez, condicionando el siguiente token a todos los anteriores. Aquí la física cambia: para calcular un miserable token, la GPU debe transferir **la totalidad de los cientos de gigabytes de parámetros del modelo desde la memoria VRAM de alta velocidad hasta los registros de cálculo de los núcleos**. 
Como la GPU procesa un único vector a la vez, los núcleos de cómputo pasan la mayor parte del tiempo inactivos esperando a que la memoria entregue los pesos. Esta fase es esclava del ancho de banda de memoria (*memory-bandwidth bound*).

Este desequilibrio explica por qué los proveedores de nube tarjan los tokens de salida entre 3 y 5 veces más caros que los de entrada: generar palabras es físicamente mucho más ineficiente para el silicio que leerlas.

### 2. La tiranía de la memoria y la caché KV
En cada paso del bucle de decodificación, el mecanismo de atención necesita recordar las claves y valores (*Keys* y *Values*) de todos los tokens precedentes. Para evitar recalcularlos, se almacenan en la GPU en una estructura llamada **KV Cache**. 

A medida que un sistema empresarial escala a cientos de llamadas concurrentes o mantiene historiales largos, la caché KV devora decenas de gigabytes de memoria VRAM por usuario activo. Si el servidor se queda sin memoria para la caché KV, debe expulsar sesiones o rechazar peticiones. Es una arquitectura inherentemente hostil al rendimiento concurrente y a la baja latencia.

### 3. La latencia del "Hot-Path" frente al tiempo humano
Un humano que chatea tolera esperar 4, 8 o 15 segundos porque lee a velocidad humana mientras el texto fluye en pantalla. 

Para un backend de software, una pausa de 8 segundos en el hilo principal de ejecución es una catástrofe de infraestructura. Las arquitecturas modernas de microservicios exigen latencias en el percentil 95 (p95) inferiores a **150–200 milisegundos**. Introducir una llamada generativa de diez segundos en mitad de un pipeline transaccional bloquea workers de Node.js o Python, agota los grupos de conexiones a bases de datos y multiplica exponencialmente la probabilidad de que se disparen *timeouts* distribuidos.

### 4. La ilusión de "JSON Mode" y la decodificación restringida
Para evitar que el modelo responda con literatura cuando el código necesita datos, la industria ideó el *JSON Mode*, las llamadas a funciones (*Function Calling*) y las gramáticas BNF (*constrained decoding*).

Estas técnicas fuerzan al decodificador a muestrear únicamente tokens que cumplan una sintaxis formal (cerrando llaves y comillas cuando corresponde). Pero **no alteran en absoluto la física subyacente**: el modelo sigue ejecutando el costoso bucle de decodificación secuencial token a token, la aplicación sigue pagando el recargo abusivo de los tokens de salida generados, y la latencia end-to-end se mantiene en el orden de los segundos. Peor aún: si el modelo "cambia de opinión" a mitad de la frase, puede generar un JSON sintácticamente perfecto pero semánticamente inservible.

El recorte de gramática y el recorte de candidatos no son el mismo truco. El primero sigue generando `{`, `"risk"` y `:`. [Niels Rogge reconstruye el segundo](https://x.com/NielsRogge/status/2100239244501430438) sobre un decoder abierto: prefill del contexto y del esquema una sola vez, KV cache reutilizada, y por cada campo un softmax solo sobre los tokens que ese campo admite. El programa ensambla el JSON. TypeSafe no ha publicado que Jev sea ese modelo; el patrón es el que cuadra con un sampler paralelo y con un esquema que el modelo no puede romper.

---

## 3. El cambio de paradigma: qué es un "Modelo de Decisión" (System One)

La respuesta técnica a este callejón sin salida no consiste en construir LLMs ligeramente más rápidos o inventar parsers más complejos. Consiste en abandonar por completo la decodificación de texto y diseñar una clase de modelos concebida exclusivamente para tomar **decisiones nativas de máquina**.

Esta categoría ha sido formalizada por TypeSafe AI —empresa fundada por Diogo Almeida, investigador procedente de OpenAI y uno de los autores primarios del trabajo fundacional de InstructGPT (arXiv:2203.02155)— bajo el concepto de **Modelos System One**, cuyo primer lanzamiento insignia es el modelo **Jev**.

![Arquitectura System One: un único forward pass en GPU con cabezas paralelas Noul, Choice y Score.](https://raw.githubusercontent.com/MarcosCamara01/portfolio-v3/cursor/typesafe-jev-research-a7bf/public/medium-typesafe/es-03-system-one.png)

*Estado más preguntas tipadas entran una sola vez. La GPU no entra en el bucle de decode; la salida llega tipada en 70 a 500 ms.*

### La analogía de Daniel Kahneman: Sistema 1 vs. Sistema 2
El nombre no es casualidad; rescata la dicotomía cognitiva articulada por el premio Nobel Daniel Kahneman en su célebre tratado *Thinking, Fast and Slow*:
* **Sistema 2 (Pensamiento lento, deliberativo y computacionalmente denso):** Es el territorio natural de los LLMs tradicionales y los modelos de razonamiento (como OpenAI o1/o3 o Claude con *extended thinking*). Evalúa deducciones lógicas complejas, escribe código original, deriva teoremas matemáticos y produce prosa reflexiva paso a paso.
* **Sistema 1 (Juicio intuitivo, rápido y perceptual):** Es el juicio inmediato que realiza un profesional experimentado. Cuando un ingeniero sénior otea un log de servidor, no necesita reflexionar durante diez minutos para reconocer si una traza es un error crítico de base de datos o una advertencia inocua. Su red neuronal biológica emite un juicio casi instantáneo en fracciones de segundo basándose en patrones adquiridos.

Un modelo System One replica esta segunda facultad: **ingiere un estado contextual ambiguo y proyecta determinaciones estructuradas en una sola pasada hacia adelante (*forward pass*), sin generar una sola palabra de texto.**

### Por qué los tokens de salida son "demasiado baratos para medirlos"
Al erradicar por completo la fase de decodificación autorregresiva token a token:
1. **No existe bucle de Decode:** El modelo calcula los tensores de representación del estado una sola vez y bifurca el cálculo hacia cabezas de clasificación y proyección estadística en paralelo.
2. **No hay consumo persistente de KV Cache:** La memoria de la GPU queda libre inmediatamente tras el forward pass, permitiendo densidades de concurrencia inalcanzables para un servidor de LLM convencional.
3. **Tarifa sin coste de salida:** Como el hardware no pasa segundos atascado en el cuello de botella del ancho de banda de memoria, el coste computacional de devolver las respuestas estructuradas es marginal. TypeSafe fija su precio de entrada en **$0.042 por millón de tokens** y establece los tokens de salida como **gratuitos en catálogo**. La propia compañía matiza en su lanzamiento que solo el largo plazo demostrará la sostenibilidad de esta estructura de precios frente a posibles subsidios tempranos, si bien proyectan que los costes de inferencia sigan una curva descendente.

### El contrato estricto de Entrada y Salida (I/O)
A diferencia de los endpoints conversacionales que exigen simular un diálogo persona-máquina, el contrato de un modelo System One opera como una firma de función fuertemente tipada:

* **Entrada (`state`):** El contexto no estructurado o semiestructurado sobre el que se juzga. Puede ser un string de texto plano, un array de mensajes o un objeto JSON arbitrario (un extracto bancario, una orden de compra, un árbol de eventos de auditoría).
* **Entrada (`questions`):** Un mapa de identificadores arbitrarios donde cada clave apunta a una pregunta atómica dotada de un tipo explícito y criterios formales.
* **Salida (`answers`):** Un mapa que reproduce exactamente los mismos identificadores proporcionados, donde cada valor es una estructura matemática garantizada sin posibilidad física de emitir errores de sintaxis o campos inventados.

### Las tres primitivas universales

En lugar de delegar en el modelo la tarea de inventar estructuras arbitrarias, la computación se reduce a tres primitivas matemáticas composables:

| Primitiva | Función Matemática | ¿Qué pregunta el software? | ¿Qué devuelve exactamente el modelo? |
| :--- | :--- | :--- | :--- |
| **Noul** | Estimación escalar bayesiana | *¿Es cierta esta afirmación?* (Ej: "¿El usuario solicita un reembolso?") | Un número flotante `noul` estrictamente acotado en $[0.0, 1.0]$ que representa la probabilidad calibrada de que la respuesta sea afirmativa. No devuelve un booleano ciego, sino la probabilidad continua. |
| **Choice** | Distribución sobre espacio discreto | *¿Cuál de estas opciones excluyentes aplica?* (Soporta hasta 255 opciones) | La opción de máxima verosimilitud (`choice`), el vector completo de probabilidades que suman exactamente 1.0 (`probabilities`), y un índice escalar sintético de certeza (`confidence`). |
| **Score** | Esperanza matemática sobre rúbrica | *¿En qué grado de una escala ordinal se sitúa el estado?* (Mínimo 2 niveles) | Un valor continuo flotante (`score`), la leyenda descriptiva (`legend`), la distribución de masa probabilística entre niveles y la certeza (`confidence`). |

Un detalle algebraico de enorme potencia en la primitiva **Score**: el valor devuelto no se trunca a números enteros discretos. El modelo calcula la esperanza matemática sobre los niveles de la rúbrica:

$$\mathbb{E}[\text{Score}] = \sum_{i=0}^{n-1} i \cdot P(\text{nivel}_i)$$

Si definimos una rúbrica de frustración de cliente como `["Calmado", "Molesto", "Muy furioso"]` (índices 0, 1 y 2), el modelo puede devolver un score de `1.65`. Este decimal no es ruido estadístico: indica de manera precisa que el estado del usuario se encuentra evaluado a casi dos tercios del camino entre la molestia civilizada y la indignación abierta.

---

## 4. RLCD vs. RLHF: calibración e incertidumbre honesta

Para entender por qué los modelos de lenguaje actuales son constitutivamente incapaces de gobernar procesos desatendidos, es imprescindible estudiar el mecanismo con el que han sido alineados durante los últimos años.

![Divergencia de entrenamiento: RLHF maximiza preferencia humana; RLCD minimiza el error de calibración.](https://raw.githubusercontent.com/MarcosCamara01/portfolio-v3/cursor/typesafe-jev-research-a7bf/public/medium-typesafe/es-04-rlhf-rlcd.png)

*RLHF premia el tono seguro y la adulación. RLCD castiga la sobreconfianza y paga la incertidumbre honesta.*

### La patología de RLHF
Casi todos los modelos conversacionales actuales (incluidos ChatGPT y Claude) se post-entrenan mediante **RLHF** (*Reinforcement Learning from Human Feedback*). Este método ajusta los pesos de la red para que sus salidas obtengan la máxima puntuación por parte de evaluadores humanos contratados para calificar qué respuesta prefieren leer.

Este objetivo produce efectos extraordinarios en chatbots, pero introduce anomalías destructivas cuando el consumidor de la respuesta es un programa informático:
1. **Adulación y complacencia (*Sycophancy*):** Los evaluadores humanos puntúan mejor las respuestas prolijas, que dan la razón al usuario y adoptan un tono pedagógico seguro. El modelo aprende que admitir ignorancia o devolver una respuesta escueta penaliza su recompensa. Ante la duda, prefiere inventar una alucinación convincente antes que defraudar.
2. **Sobreconfianza patológica:** Un LLM estándar afirma falsedades con la misma rotundidad sintáctica y convicción con la que cita leyes de la física elemental.
3. **Pérdida de modos (*Mode Dropping*):** Al optimizar la preferencia humana promedio, el modelo colapsa su distribución hacia un subconjunto estrecho de estilos elocuentes, aplastando las probabilidades de opciones alternativas legítimas.
4. **La función Softmax está distorsionada:** Tras someterse a RLHF, los logits de salida de un transformador pierden su significado estadístico estricto. Una probabilidad nominal del 99% en el decoder de un LLM comercial rara vez se corresponde con una tasa de acierto del 99% en el mundo real.

### Qué es RLCD (*Reinforcement Learning for Calibrated Decisions*)
El paradigma de los modelos de decisión descarta la preferencia humana y adopta como función de pérdida matemática la **calibración epistémica**:

En teoría estadística y aprendizaje automático, la calibración se mide formalmente mediante el **ECE** (*Expected Calibration Error*) y los diagramas de fiabilidad (*reliability diagrams*). Un modelo se considera perfectamente calibrado si:

$$\mathbb{P}(\hat{Y} = Y \mid \hat{P} = p) = p, \quad \forall p \in [0, 1]$$

Es decir: si tomamos todas las predicciones a lo largo de un año donde el modelo afirmó tener un 80% de probabilidad ($p = 0.80$), en exactamente el 80% de esos casos la decisión debe haber sido empíricamente correcta.

```python
# En código de producción, la duda calibrada es el activo más valioso:
response = client.system_one(state=payout_event, questions={"fraud": Noul(instructions="¿Patrón de fraude?")})

probabilidad_fraude = response.answers["fraud"].noul

if probabilidad_fraude > 0.92:
    # Certeza estadística alta: bloqueo automático sin fricción
    bloquear_cuenta_inmediato(user_id)
elif probabilidad_fraude < 0.15:
    # Riesgo residual despreciable: autorización directa
    autorizar_transferencia(user_id)
else:
    # El modelo expresa duda honesta (0.15 <= p <= 0.92):
    # El código deriva a la cola de analistas humanos con el scoring adjunto
    escalar_a_analisis_forense(user_id, scoring=probabilidad_fraude)
```

### La diferencia entre Probabilidad y Confianza (*Confidence*)
Un error común entre desarrolladores principiantes es confundir la probabilidad del ganador con el índice de confianza:
* La **probabilidad** es la masa asignada a una opción concreta dentro del vector de salida.
* La **confianza (`confidence`)** es un estadístico sintético escalar (acotado entre 0 y 1) que mide la concentración de la distribución completa (su entropía).

Por ejemplo, imaginemos que un Choice ofrece 10 opciones de clasificación. Si la opción ganadora obtiene un 35% de probabilidad, pero las otras 9 opciones se reparten un insignificante 7% cada una, la opción es la más probable pero la distribución está aplanada y la confianza será baja (el modelo está diciendo: *"es la mejor opción que tengo, pero no pongo la mano en el fuego"*). En cambio, si la ganadora obtiene un 92% y el resto suma un 8%, la distribución es puntiaguda y la confianza rozará el 1.0.

Para un sistema empresarial, **un "no estoy seguro" calibrado es infinitamente más valioso que un párrafo persuasivo pero inventado**. Si el software sabe con rigor estadístico cuándo el modelo duda, puede automatizar con total seguridad el 85% de los casos despejados y canalizar con precisión quirúrgica el 15% restante hacia supervisores humanos.

---

## 5. Los cuatro patrones de diseño canónicos de producción

Integrar modelos de decisión en sistemas reales no consiste en reemplazar un prompt por otro, sino en estructurar flujos de código según patrones arquitectónicos formales documentados en los manuales de ingeniería de este nuevo paradigma:

![Los cuatro patrones System One: Speculative Fan-Out, Composite Scoring, Confidence-Gated y Intent Routing.](https://raw.githubusercontent.com/MarcosCamara01/portfolio-v3/cursor/typesafe-jev-research-a7bf/public/medium-typesafe/es-05-cuatro-patrones.png)

*Cuatro bancos de trabajo: preguntas en paralelo, ponderación en código, umbrales de riesgo y enrutamiento por intención.*

### Patrón 1: Abanico Especulativo (*Speculative Fan-Out*)
En las arquitecturas conversacionales tradicionales, los desarrolladores caen en la trampa del encadenamiento secuencial: primero llaman al LLM para saber si un ticket es un bug; si es un bug, hacen una segunda llamada para saber el componente; si el componente es la base de datos, hacen una tercera llamada para estimar la severidad. Cada paso suma latencia y coste.

En los modelos de decisión, añadir preguntas adicionales a un request comparte el procesamiento del estado en la GPU y apenas altera el tiempo de respuesta. El patrón de **Abanico Especulativo** consiste en enviar **todas las preguntas concebibles en una única llamada inicial**, incluyendo aquellas que solo serán relevantes si se cumplen ciertas condiciones:

En las pruebas empíricas oficiales publicadas por TypeSafe (cookbook de preguntas paralelas sobre la regulación GDPR evaluadas con `jev-1.12`), **agrupar 13 preguntas analíticas en una única llamada compartida resultó ser 12.2 veces más barato y 10.0 veces más rápido** que ejecutar las mismas 13 evaluaciones de forma secuencial sobre el documento (~54.000 caracteres), manteniendo exactamente las mismas probabilidades de respuesta. El código local simplemente lee la respuesta de primer nivel y descarta las ramas especulativas que no apliquen.

### Patrón 2: Puntuación Compuesta (*Composite Scoring*)
Pedirle a una inteligencia artificial en un solo prompt *"califica del 1 al 100 la calidad de este lead comercial"* es una pésima práctica de ingeniería: introduce sesgos incontrolables y oscurece el criterio del modelo en una caja negra opaca.

El patrón de **Composite Scoring** descompone un juicio multifactorial ambiguo en factores atómicos independientes evaluados mediante primitivas tipadas, delegando la ponderación matemática al código anfitrión:

```python
# A Score lands on your rubric (0 .. n-1). Normalize to 0-1 before mixing with Nouls.
TECH_LEVELS = [
    "Vague or unsourced",
    "Mostly accurate",
    "Precise and checkable",
]

precision = response.answers["technical_accuracy"].score / (len(TECH_LEVELS) - 1)
sources = response.answers["verified_sources"].noul
bias = response.answers["commercial_bias"].noul

quality = 0.40 * precision + 0.35 * sources + 0.25 * (1.0 - bias)

if quality >= 0.75:
    publish_to_directory(doc)
```

**La ventaja operativa es colosal:** si el comité de dirección de la empresa decide mañana que la ausencia de sesgo comercial debe pesar más que las fuentes, el equipo de ingeniería modifica un coeficiente de punto flotante en el código (`0.25 -> 0.40`) y lo despliega mediante un commit ordinario en milisegundos. El umbral `0.75` vive en la misma escala 0–1 que las primitivas ya normalizadas. No hace falta reentrenar modelos, alterar prompts literarios ni rezar para que un LLM interprete bien las nuevas instrucciones redactadas en inglés.

### Patrón 3: Enrutamiento Graduado por Incertidumbre (*Confidence-Gated Escalation*)
Este patrón materializa el cortafuegos de seguridad de la aplicación: el umbral de activación no es estático, sino proporcional a la gravedad y reversibilidad del efecto secundario que desencadenará la acción. En la documentación oficial se ilustran umbrales como `0.60` y `0.85` (o `0.50` y `0.90` según el contexto de decisión), recomendando calibrarlos empíricamente con los propios datos de negocio:

* **Operaciones de bajo riesgo y lectura (ej: mostrar saldo o sugerir un artículo de ayuda):** Operan con umbrales de confianza moderados (`confidence > 0.60`). Si el modelo comete un error puntual, el impacto es leve y fácilmente subsanable.
* **Operaciones irreversibles o destructivas (ej: ejecutar una transferencia bancaria o suspender un servidor de producción):** Exigen umbrales estrictos (`confidence > 0.85`). Cualquier resultado que caiga por debajo de esa línea roja detiene la ejecución automática y solicita confirmación o mediación de un operador humano.

### Patrón 4: Enrutamiento por Intención (*Intent Routing*)
No todas las peticiones exigen la misma maquinaria computacional. El patrón canónico de **Intent Routing** sitúa al modelo System One en la puerta de entrada de la arquitectura para clasificar de inmediato qué subsistema debe resolver la tarea:

1. **Lógica determinista:** Consultas cerradas o solicitudes transaccionales simples se desvían directamente a código o a un endpoint SQL sin tocar modelos generativos.
2. **Modelos generativos especializados (Sistema 2):** Consultas que exigen redacción de texto libre, empatía o razonamiento abierto se derivan al LLM adecuado con un contexto ya depurado.
3. **Escalada humana:** Casos ambiguos o con conflicto de políticas pasan directamente a un panel de soporte.

*(Nota técnica: para casos específicos de extracción de datos masiva, TypeSafe documenta también en sus cookbooks patrones complementarios como la cascada estructurada SDE, donde un modelo pequeño como `gpt-5.4-mini` extrae datos preliminares, Jev verifica las afirmaciones mediante Nouls por campo y, solo si la probabilidad de fallo es alta, se escala a un modelo de razonamiento profundo como `gpt-5.5`).*

---

## 6. Escenarios arquitectónicos: dónde encaja este paradigma

Para contrastar el impacto práctico de esta arquitectura frente a las soluciones generativas convencionales, examinemos cinco escenarios ilustrativos de diseño. *(Nota metodológica: las probabilidades y esquemas presentados a continuación son configuraciones ilustrativas de ingeniería, siguiendo el criterio documentado por TypeSafe en sus guías de conceptos).*

---

### Caso 1: Triaje y resolución en Fintech y E-commerce

* **El problema actual:** Un usuario envía el siguiente mensaje: *"Me han cobrado dos veces la suscripción mensual en la tarjeta de crédito y necesito el dinero para pagar el alquiler hoy mismo"*.
  * Las reglas clásicas de palabras clave ("cobro", "duplicado") confunden fácilmente quejas históricas con peticiones activas.
  * Los LLMs generativos tardan entre 5 y 12 segundos en razonar la respuesta y estructurar un JSON. En picos de alta carga, el coste en tokens se dispara y la infraestructura sufre saturación.
* **Con un Modelo de Decisión:**
  * **Estado (`state`):** Estructura JSON que combina el texto del mensaje del cliente, los metadatos de los últimos tres cargos en la pasarela Stripe y la política contractual de devoluciones.
  * **Preguntas en paralelo:**
    * `refund_requested` (*Noul*): ¿El cliente solicita explícitamente la devolución del dinero? $\rightarrow$ Probabilidad ilustrativa: `0.99`
    * `duplicate_confirmed` (*Noul*): Contrastando el texto con el extracto de pagos, ¿constan dos cargos con idéntico importe en menos de 24 horas? $\rightarrow$ `0.96`
    * `urgency_level` (*Score*): Nivel de urgencia percibido en una rúbrica de 3 niveles (`Baja`, `Moderada`, `Crítica`) $\rightarrow$ `2.45`
    * `policy_compliance` (*Noul*): ¿El incidente cumple las condiciones de reembolso directo sin mediación? $\rightarrow$ `0.98`
* **Acción en código:**
  Dado que tanto la solicitud de devolución como la conformidad con la política superan el umbral del 90%, el backend ejecuta inmediatamente la llamada al endpoint `/v1/refunds` de Stripe en una fracción de segundo. Si el índice de certeza hubiese caído por debajo del umbral de seguridad, el código habría derivado el ticket a la bandeja de un especialista financiero.

---

### Caso 2: Ciberseguridad y triaje de eventos (SOC / DevOps)

* **El problema actual:** Un centro de operaciones de seguridad corporativo procesa un volumen masivo de eventos de telemetría y alertas de cortafuegos donde la inmensa mayoría resultan ser falsos positivos o escaneos rutinarios.
  * La plantilla de analistas humanos sufre un colapso crónico por fatiga de alertas.
  * Conectar un LLM generativo en streaming sobre ese caudal es inviable técnica y financieramente.
* **Con un Modelo de Decisión:**
  * **Estado (`state`):** Registro de auditoría del sistema operativo (comando Bash ejecutado, binario invocador, árbol de procesos padres y privilegios del usuario).
  * **Preguntas en paralelo:**
    * `is_scheduled_maintenance` (*Noul*): ¿La instrucción ejecutada coincide con una ventana de mantenimiento técnico declarada? $\rightarrow$ `0.02`
    * `threat_severity` (*Score*): Grado de peligrosidad de la cadena en rúbrica ordinal (0 = benigno, 1 = anómalo, 2 = exploit crítico) $\rightarrow$ `1.88`
    * `containment_protocol` (*Choice*): Selección de protocolo (`log_and_pass`, `notify_slack`, `quarantine_host`) $\rightarrow$ `quarantine_host` (confianza: `0.91`)
* **Acción en código:**
  Al detectar `threat_severity > 1.8` y `containment_protocol == "quarantine_host"` con alta confianza, el demonio de seguridad aísla la máquina comprometida a nivel de cortafuegos de forma inmediata, neutralizando un posible movimiento lateral antes de que el atacante establezca persistencia.

---

### Caso 3: Cortafuegos semántico y guardrails para LLMs generativos

* **El problema actual:** Para impedir que usuarios maliciosos ejecuten ataques de inyección de prompt (*jailbreaks*) o fuercen a un bot corporativo a revelar contraseñas o soltar improperios, muchas arquitecturas sitúan **otro LLM generativo por delante** que ejerce de inspector o policía de contenidos.
  * **Consecuencia:** La latencia percibida por el usuario se multiplica y la factura de inferencia se duplica.
* **Con un Modelo de Decisión:**
  * **Estado (`state`):** El prompt en bruto enviado por el usuario a través de la interfaz web antes de alcanzar el modelo conversacional.
  * **Preguntas en paralelo:**
    * `is_prompt_injection` (*Noul*): ¿El usuario utiliza técnicas de ingeniería social o marcadores para sobreescribir las instrucciones del sistema? $\rightarrow$ `0.98`
    * `contains_credentials` (*Noul*): ¿El texto incluye claves privadas, tokens JWT o números de tarjetas de crédito? $\rightarrow$ `0.01`
    * `intent` (*Choice*): Intención de la consulta (`legitimate_task`, `jailbreak_probe`, `toxic_abuse`) $\rightarrow$ `jailbreak_probe` (confianza: `0.96`)
* **Acción en código:**
  Si `is_prompt_injection > 0.85`, el proxy inverso HTTP interrumpe la conexión de inmediato y responde con un código de estado `400 Bad Request`. El modelo conversacional principal nunca llega a ser invocado, ahorrando presupuesto y protegiendo el sistema.

---

### Caso 4: Clasificación y validación de facturas en sistemas ERP

* **El problema actual:** En entornos corporativos que reciben miles de facturas y albaranes de proveedores, cada documento debe cotejarse contra la orden de compra interna y la recepción de almacén.
  * Los LLMs generativos sufren inconsistencias numéricas y alucinaciones de cifras cuando se les fuerza a procesar tablas extensas y complejas.
  * Procesar millones de páginas con modelos de frontera con ventanas de contexto extendidas arruina el margen del departamento de operaciones.
* **Con un Modelo de Decisión:**
  * **Estado (`state`):** Texto estructurado extraído de la factura recibido junto con el desglose tabular de la orden de compra almacenado en la base de datos SQL.
  * **Preguntas en paralelo:**
    * `supplier_identity_match` (*Noul*): ¿La razón social, el identificador fiscal y los datos bancarios coinciden con el registro maestro del proveedor homologado? $\rightarrow$ `0.99`
    * `unauthorized_items_present` (*Noul*): ¿Existen conceptos facturados que no constaban en la orden de compra aprobada? $\rightarrow$ `0.03`
    * `discrepancy_category` (*Choice*): Naturaleza de la discrepancia detectada (`none`, `tax_error`, `price_variance`, `quantity_variance`) $\rightarrow$ `none` (confianza: `0.95`)
* **Acción en código:**
  El sistema ERP programa automáticamente el pago para aquellas facturas que registran una confianza superior al umbral configurado por finanzas, derivando a revisión humana exclusivamente los casos con discrepancias tipadas o baja certeza estadística.

---

### Caso 5: Domótica, IoT e interfaces de voz (Abanico Especulativo)

* **El problema actual:** En interfaces controladas por voz (vehículos conectados, domótica industrial, asistentes domésticos), si el sistema tarda tres segundos en procesar un comando físico elemental como apagar una luz, la experiencia de usuario se percibe como defectuosa o averiada.
  * Los pipelines conversacionales encadenan múltiples llamadas consecutivas (clasificar intención $\rightarrow$ extraer entidad $\rightarrow$ verificar dispositivo), acumulando latencias inaceptables.
* **Con un Modelo de Decisión (*Speculative Fan-Out*):**
  * Sobre la transcripción de audio del usuario (*"Apaga las luces de la cocina y pon el termostato a 21 grados"*), el hub dispara **todas las preguntas concebibles en una sola llamada paralela**:
    * `is_hardware_command` (*Noul*): ¿El enunciado representa una orden física sobre el entorno? $\rightarrow$ `0.99`
    * `target_room` (*Choice* con 30 estancias registradas): $\rightarrow$ `kitchen`
    * `device_type` (*Choice* entre luces, climatización, persianas, cerraduras): $\rightarrow$ `lights`
    * `action` (*Choice* encender, apagar, graduar): $\rightarrow$ `turn_off`
    * `is_conversational_fallback` (*Noul*): ¿La frase es una consulta enciclopédica o de charla informal ("¿quién fue Alan Turing?")? $\rightarrow$ `0.01`
* **Acción en código:**
  El microcontrolador procesa los tensores y conmuta el relé físico de las luces en menos de una décima de segundo. Si `is_conversational_fallback` hubiera superado el umbral, el sistema habría derivado la petición al LLM conversacional. El usuario obtiene una respuesta física inmediata para las órdenes cotidianas sin renunciar a la riqueza conversacional cuando la situación lo requiere.

---

## 7. Análisis forense de las evaluaciones públicas: los 711 casos de estudio

Uno de los mayores defectos de la literatura sobre inteligencia artificial es la complacencia ante las cifras publicitarias de las empresas. Para evaluar rigurosamente el estado de los modelos de decisión, es necesario auditar la suite de pruebas oficial publicada por TypeSafe en su portal de evaluaciones ([evals.typesafe.ai](https://evals.typesafe.ai/)), compuesta por **711 casos de estudio empíricos** distribuidos en cuatro flujos de trabajo de automatización reales.

![Precisión de Jev frente a GPT Sol y Claude Opus 5 en los 711 casos públicos de evals.typesafe.ai.](https://raw.githubusercontent.com/MarcosCamara01/portfolio-v3/cursor/typesafe-jev-research-a7bf/public/medium-typesafe/es-06-evals-711.png)

*Jev se acerca a los modelos de frontera en tres flujos. El talón de Aquiles está en facturas: 61,8% frente al 79,1% de Sol.*

Cada tarea fue ejecutada bajo un mismo código de orquestación donde cada modelo competía bajo las mismas condiciones. Para que los LLMs pudieran competir, TypeSafe desarrolló un adaptador oficial ([system-one-adapter-python](https://github.com/typesafe-ai/system-one-adapter-python)) que envuelve las APIs de OpenAI y Anthropic con decodificación estructurada estricta y extracción de probabilidades.

Los datos extraídos directamente de las etiquetas SVG y metadatos JSON del portal de evaluación arrojan un balance lleno de matices que cualquier ingeniero debe conocer:

| Flujo de Trabajo | N.º Casos | Jev (System One) | Mejor Modelo Competidor (Workflow) | Análisis Forense de Ingeniería |
| :--- | :--- | :--- | :--- | :--- |
| **Incidentes de Seguridad** | 240 casos | **61.7%**<br>0.3 s / $0.0001 | **Claude Opus 5: 66.2%** (15.1 s / $0.0574)<br>GPT Sol: 62.5% (8.5 s / $0.0295) | Jev se sitúa a solo 4.5 puntos porcentuales de Opus 5 pero ejecutando **50 veces más rápido** y costando **570 veces menos**. |
| **Observabilidad de Trazas** | 117 casos | **71.6%**<br>0.5 s / $0.0003 | **GPT Sol: 76.6%** (40.3 s / $0.0575)<br>DeepSeek v4 Flash: 73.0% (51.7 s) | En análisis de logs de agentes, Jev empata prácticamente con DeepSeek v4 Pro (71.6%) reduciendo el tiempo de 90 segundos a medio segundo. |
| **Procesamiento de Facturas** | 150 casos | **61.8%**<br>0.5 s / $0.0011 | **GPT Sol: 79.1%** (34.3 s / $0.2152)<br>Claude Opus 5: 78.4% (92.1 s / $0.4856) | **El talón de Aquiles de Jev:** Brecha de más de 17 puntos porcentuales frente a Sol. Documentos con tablas densas, deducciones contables y razonamiento numérico secuencial evidencian los límites de los modelos sin decodificación de razonamiento profundo. |
| **Atención al Cliente** | 204 casos | **76.0%**<br>0.4 s / $0.0001 | **GPT Sol: 78.3%** (10.1 s / $0.0323)<br>DeepSeek v4 Flash: 76.8% (34.6 s) | Prácticamente empate técnico con los modelos de frontera más caros, superando a Opus 5 (72.4%) y a Sonnet 5 (69.3%) en precisión pura. |
| **Media Global (Pesos Iguales)** | **711 casos (4 tareas)** | **67.8%**<br>0.4 s / $0.0004 | **GPT Sol: 74.1%** (23.3 s / $0.0836) | Jev domina holgadamente la frontera de eficiencia (Pareto), pero **no lidera la precisión absoluta**. La media oficial promedia las 4 tareas con el mismo peso (no ponderada por volumen de casos). |

### La advertencia metodológica sobre las etiquetas de referencia
Hay un factor metodológico fundamental que debe mencionarse para mantener la honestidad intelectual: **las etiquetas de "acierto" en este benchmark no proceden de un dataset con verdad terreno (*ground truth*) validada manualmente por humanos expertos.** 

Proceden del consenso generado por el promedio de juicios emitidos por **GPT-6 Astra y Claude Fable 5.1 configurados en su modo máximo de razonamiento (*high thinking*)**. Por tanto, lo que mide este benchmark no es la corrección empírica absoluta ante la realidad, sino el **grado de acuerdo estadístico de Jev con los modelos generativos más inteligentes y caros del planeta**.

La conclusión de ingeniería es contundente: Jev no busca competir en inteligencia general con un modelo de frontera costoso; su propuesta de valor radica en que ofrece un **nivel de acuerdo estadístico notable con esos gigantes con una reducción de dos órdenes de magnitud en tiempo y tres órdenes de magnitud en coste financiero**.

---

## 8. Blueprint de integración: código de producción y manejo de fallos

Un modelo de infraestructura solo es útil si sus contratos de integración son robustos. A continuación se detalla cómo se integra este servicio en un entorno de producción real utilizando el SDK oficial de Python (`typesafe-sdk`, versión 0.6.0), demostrando cómo interactuar con el endpoint `POST https://api.typesafe.ai/v1/systemone` e implementar resiliencia operativa.

```python
from typesafe_sdk import (
    Choice,
    Noul,
    Score,
    TypeSafeAuthenticationError,
    TypeSafeClient,
    TypeSafeError,
    TypeSafeInternalServerError,
    TypeSafePermissionDeniedError,
    TypeSafeRateLimitError,
    TypeSafeUnprocessableEntityError,
)

# TypeSafeClient() reads TYPESAFE_API_KEY. Missing key raises TypeSafeError at init,
# not an HTTP 401.
try:
    client = TypeSafeClient()
except TypeSafeError as exc:
    raise SystemExit(str(exc)) from exc

incoming_state = {
    "audit_event": {
        "user_id": "usr_99812",
        "action": "export_database_dump",
        "ip_address": "194.26.29.112",
        "geo_country": "RU",
        "user_home_country": "ES",
    },
    "user_profile": {
        "role": "junior_developer",
        "mfa_active": True,
        "past_violations": 0,
    },
    "policy_rules": (
        "Exporting database dumps outside the user's home country "
        "requires explicit Security authorization."
    ),
}

THREAT_LEVELS = ["Benign", "Suspicious", "Critical incident"]

try:
    with client:
        response = client.system_one(
            state=incoming_state,
            model="jev-latest",
            questions={
                "violates_policy": Noul(
                    instructions=(
                        "Comparing `audit_event` against `policy_rules`, "
                        "does this action constitute a security violation?"
                    ),
                ),
                "threat_level": Score(
                    instructions="Operational risk severity",
                    criteria=THREAT_LEVELS,
                ),
                "recommended_action": Choice(
                    instructions="Immediate protocol action",
                    criteria={
                        "allow": "Allow execution without interruption",
                        "challenge_mfa": "Require a secondary MFA challenge",
                        "revoke_tokens": (
                            "Terminate active sessions and freeze credentials"
                        ),
                    },
                ),
            },
        )

    violation = response.nouls["violates_policy"].noul
    risk = response.scores["threat_level"].score
    action = response.choices["recommended_action"].choice
    confidence = response.choices["recommended_action"].confidence

    print(f"Violation probability: {violation:.2f}")
    print(f"Risk score: {risk:.2f} / {len(THREAT_LEVELS) - 1}")
    print(f"Recommended action: {action} (confidence: {confidence:.2f})")

    if violation > 0.85 and action == "revoke_tokens" and confidence > 0.80:
        print("[AUTO-ACTION] Revoking credentials.")
    elif violation > 0.85:
        print("[ESCALATION] Route to security on-call.")
    else:
        print("[AUDIT] Event logged.")

except TypeSafeAuthenticationError:
    # HTTP 401: invalid or missing Bearer on the request.
    print("Authentication failed. Check TYPESAFE_API_KEY.")
except TypeSafePermissionDeniedError:
    # HTTP 403.
    print("Permission denied.")
except TypeSafeUnprocessableEntityError as exc:
    # HTTP 422: malformed questions or state.
    print(f"Invalid request: {exc}")
except TypeSafeRateLimitError as exc:
    # HTTP 429 after the SDK's default retries (it already honors Retry-After).
    wait_ms = exc.retry_after_ms
    print(f"Rate limited after retries. retry_after_ms={wait_ms}")
except TypeSafeInternalServerError as exc:
    # 5xx after retries. Docs also list 529 Overloaded; the SDK maps it here.
    print(f"Server error {exc.status}. request_id={exc.request_id}")
```

### Códigos de estado HTTP oficiales del protocolo
Para clientes que hablen HTTP crudo (Go, Rust, Java), TypeSafe documenta estos errores. El SDK de Python ya reintenta `429` y `5xx` (incluido `529`) con backoff; el `except` de arriba solo corre cuando esos reintentos se agotan.

* **`401 Unauthorized`:** API key ausente o inválida en el header `Authorization`. En el SDK: `TypeSafeAuthenticationError`. Si falta la variable de entorno *antes* de llamar, `TypeSafeClient()` lanza `TypeSafeError`.
* **`403 Forbidden`:** acceso denegado. En el SDK: `TypeSafePermissionDeniedError`.
* **`422 Unprocessable Entity`:** el JSON no pasa validación (falta `type`, un Score con menos de dos niveles, etc.). En el SDK: `TypeSafeUnprocessableEntityError`.
* **`429 Too Many Requests`:** límite de tasa. Reintentar con backoff; el SDK lee `Retry-After` / `retry-after-ms`.
* **`529 Overloaded`:** saturación transitoria del cluster. Misma receta de backoff; tras agotar reintentos llega como `TypeSafeInternalServerError` con `status == 529`.

---

## 9. Baño de realidad: límites, riesgos y cuándo NO usar este enfoque

Un análisis técnico creíble no puede caer en el entusiasmo ciego. Es indispensable trazar con total nitidez las fronteras de lo que esta tecnología **no puede hacer**:

![Matriz de decisión arquitectónica: cuándo usar un LLM generativo, un modelo de razonamiento o un modelo de decisión.](https://raw.githubusercontent.com/MarcosCamara01/portfolio-v3/cursor/typesafe-jev-research-a7bf/public/medium-typesafe/es-07-matriz-decision.png)

*Si hay que redactar, un LLM. Si hay que demostrar paso a paso, un modelo de razonamiento. Si hay que clasificar en el backend, System One.*

1. **Incapacidad absoluta para generar texto:** Jev y los modelos System One no tienen un decodificador de vocabulario libre. No pueden redactar un resumen, responder un correo electrónico, escribir una función de TypeScript ni mantener una conversación empática con un cliente.
2. **Fragilidad en razonamiento matemático secuencial:** El propio Diogo Almeida ha reconocido públicamente que en dimensiones que exigen razonamiento matemático paso a paso (resolver integrales complejas, deducciones formales), el modelo rinde a un nivel deficiente (comparable a un modelo base antiguo sin herramientas). No está diseñado para pensar durante minutos, sino para evaluar de inmediato.
3. **El mito de "Zero Hallucinations":** Este es el reclamo publicitario más peligroso de la nueva ola. La empresa afirma que el modelo "no puede alucinar". A nivel de ingeniería, esto solo significa que **no comete errores de esquema o tipo** (es físicamente imposible que devuelva una cuarta opción inexistente en un Choice). Pero **sí puede cometer errores semánticos**: si el contexto del estado es insuficiente o las instrucciones son confusas, el modelo puede elegir la opción equivocada con un 90% de probabilidad. Confundir la validez sintáctica con la infalibilidad semántica es la vía más rápida para introducir fallos catastróficos en producción.
4. **La ingeniería se desplaza a la taxonomía:** Si un desarrollador define un Choice con opciones que se solapan conceptualmente (por ejemplo, `cancelacion` y `baja_servicio` sin delimitar la diferencia), la distribución estadística se aplanará y la confianza del modelo caerá por los suelos. La pericia técnica ya no radica en escribir literatura persuasiva para un prompt, sino en diseñar taxonomías ortogonales y rúbricas precisas.
5. **Dependencia de un ecosistema en fase temprana:** A fecha de septiembre de 2026, la tecnología opera bajo régimen de acceso temprano privado (*waitlist* / consola cerrada), no existen pesos de código abierto (*open-weights*) y la empresa no ha publicado un paper científico con revisión por pares que revele la arquitectura interna o los datos de entrenamiento de RLCD.

---

## 10. El futuro: la paradoja de Jevons y construir herramientas, no dioses

¿Por qué este modelo fundacional ha sido bautizado como **Jev**?

El nombre rinde tributo directo a William Stanley Jevons, el célebre economista y lógico británico del siglo XIX. En su obra de 1865, *The Coal Question*, Jevons formuló una paradoja que desconcertó a los planificadores industriales de la época: tras la invención de la máquina de vapor de James Watt —que reducía drásticamente la cantidad de carbón necesaria para producir una unidad de potencia mecánica frente a las viejas máquinas de Newcomen—, el consumo nacional de carbón de Gran Bretaña no disminuyó: **se multiplicó exponencialmente**.

Al abaratar radicalmente el coste de la energía mecánica utilizable, la máquina de vapor hizo económicamente rentable instalar motores en miles de fábricas textiles, ferrocarriles, buques mercantes y minas que jamás se habrían podido costear el carbón bajo la tecnología anterior.

![Paradoja de Jevons en la IA: al abaratar el juicio semántico, explota la demanda de computación inteligente.](https://raw.githubusercontent.com/MarcosCamara01/portfolio-v3/cursor/typesafe-jev-research-a7bf/public/medium-typesafe/es-08-paradoja-jevons.png)

*Cuando una decisión baja de céntimos y quince segundos a 0,042 dólares por millón de tokens y 100 ms, el backend entero se vuelve candidato.*

En la inteligencia artificial moderna estamos presenciando el umbral de nuestra propia **Paradoja de Jevons**:

* Si evaluar un juicio semántico cuesta 3 céntimos de dólar y tarda diez segundos en resolverse, un arquitecto de software solo utilizará inteligencia artificial en las interfaces externas más visibles y justificables.
* Si el coste de emitir un juicio desciende a **$0.042 por millón de tokens de entrada con salida gratuita** y la respuesta se entrega en **100 milisegundos**, la economía de la arquitectura de software se reescribe por completo.

De repente se vuelve viable evaluar cada línea de log que atraviesa un balanceador de carga Nginx, auditar cada transacción financiera en streaming sobre Apache Kafka, reordenar motores de búsqueda sobre millones de productos en tiempo real, filtrar inyecciones en el cortafuegos perimetral y ejecutar map-reduces semánticos continuos sobre terabytes de documentos desestructurados.

La historia del software siempre ha seguido la misma trayectoria: cada vez que una capacidad compleja y esotérica se destila en una primitiva elemental, tipada, barata y composable, se desata una explosión industrial sin precedentes. Ocurrió cuando las bases de datos relacionales estandarizaron el almacenamiento con SQL; ocurrió cuando internet estandarizó el intercambio de paquetes con TCP/IP; y ocurrirá cuando las decisiones inteligentes dejen de ser una conversación en una pestaña de navegador para transformarse en lo que siempre debieron haber sido: **una primitiva de programación determinista sobre la que cualquier ingeniero pueda construir el futuro.**

Como sintetiza el manifiesto de esta nueva ola tecnológica: el objetivo ya no es seguir persiguiendo la quimera de un dios omnisciente en un laboratorio, sino construir herramientas de producción fiables que hagan funcionar el mundo real.
