# Propuesta de dashboards (cuatro vistas D3.js)

ESTADO: GENERADO
PASO: 10
VERSION: 1
DOCUMENTO SECUNDARIO DE: paso 10
(documento principal: `proyecto/03_decisiones/06_decisiones_dashboards.md`)
DOCUMENTOS RELACIONADOS:
- `proyecto/03_decisiones/06_decisiones_dashboards.md` (decisiones D10-01..D10-08)
- `proyecto/03_decisiones/07_decisiones_comunicacion.md` (mensajes y lenguaje)
- `proyecto/02_analisis/09_comparacion_tecnologias.md` (comparación de librerías)
- `proyecto/03_decisiones/02_decision_tecnologica.md` (entorno y motor visual)
- `proyecto/03_trazabilidad.csv` (filas T10-01..T10-10)

INSUMOS: `proyecto/02_analisis/07_propuesta_kpi.md` (catálogo D08-01),
`proyecto/02_analisis/11_indicadores.csv` (valores implementados),
`proyecto/02_analisis/12_indicadores_verificaciones.csv` (33 comprobaciones),
`proyecto/02_analisis/06_hallazgos_exploratorios.md`, y
`proyecto/01_dataset/Titanic-Dataset_enriquecido.csv` (891 × 18).

## 0. Autorización de este paso
Ejecutado con la autorización exclusiva del paso 10, que a la vez aprueba el
paso 09. Se **propone** el diseño de las cuatro vistas; **no se construye
ninguna** (eso corresponde a los pasos de implementación). Sin `human_review` y
sin avanzar a ningún paso posterior.

## 1. Alcance y límites de la propuesta
- Cuatro dashboards **conectados**: uno principal (resumen) y tres temáticos.
- Todos leen el mismo dataset de 891 pasajeros; la unidad de análisis es
  **una fila = un pasajero** (T01-02, T04-04).
- Solo se representan los **7 KPI aprobados** (D08-01) más medidas de contexto
  ya presentes en el dataset. No se añade ningún KPI nuevo aquí.
- **Sin metas ni semáforos** (D08-06): se usan escalas y comparaciones, no
  umbrales rojo/verde.
- **Sin mapas**: el dataset no tiene geografía (solo `Embarked` como puerto de
  embarque, que es categórico, no una ubicación del pasajero). Un mapa exigiría
  una fuente geográfica externa y no solicitada.
- **Sin identificar familias reales** ni inventar clase económica. `TamanoFamilia`
  (ENR-02) es un conteo derivado de `SibSp + Parch + 1`, no un parentesco real;
  `Pclass` es la columna existente del dataset, no una clase social inferida.

## 2. Modelo común a las cuatro vistas

### 2.1 Fuente y enlace entre vistas
| Elemento | Definición |
|---|---|
| Fuente de datos | `proyecto/01_dataset/Titanic-Dataset_enriquecido.csv` (891 filas, 18 columnas) |
| Unidad | 1 fila = 1 pasajero; clave técnica `PassengerId` |
| Enlace entre vistas | el **mismo conjunto filtrado**: cada vista re-agrega sobre las 891 filas, no hay joins entre vistas |
| Baseline de verificación | `proyecto/02_analisis/11_indicadores.csv` (sin filtros, los valores deben reproducir el paso 09) |
| KPI disponibles | KPI-01..KPI-07 |
| Medidas de contexto (no KPI) | `SibSp`, `Parch`, `Fare`, `Age` (con faltantes declarados), `BanderaSinAge`, `BanderaSinCabin`, `BanderaSinEmbarked` |

### 2.2 Filtros compartidos (D10-02)
| Filtro | Campo | Valores | Vistas donde aplica |
|---|---|---|---|
| Sexo | `Sex` | female / male | D1, D2, D3 |
| Clase | `Pclass` | 1 / 2 / 3 | D1, D2, D3 |
| Puerto de embarque | `Embarked` | C / Q / S (+ vacío) | D1, D2, D3 |
| Tamaño de familia | `TamanoFamilia` | 1 / 2-4 / 5+ | D1, D3 |
| Cubierta | `Cubierta` | A..G / T / (vacío) | D4 |

Regla de filtrado (D10-02): el filtro se aplica **antes** de agregar, así que
el denominador se **recalcula** sobre el subconjunto. Cada vista muestra su `n`
vigente para que ninguna tasa se lea sin su base. KPI-01 (38.38 %) solo
coincide con el paso 09 cuando no hay filtros activos.

### 2.3 Convenciones visuales comunes (D10-03)
| Aspecto | Regla |
|---|---|
| Escala de tasa (eje y) | **fija 0–100 %** en todas las vistas, para que las barras sean comparables entre pestañas |
| Escala de conteo | 0 al máximo del subconjunto (se anota el máximo) |
| Unidades | `valor_pct` en porcentaje (2 decimales); conteos como enteros |
| Color de tasa | escala categórica por grupo (una familia de tonos por vista); **sin** rojo/verde |
| Color de faltante/cobertura | tonos neutros (gris/azul) para distinguir "dato ausente" de "dato observado" |
| Grupos con n<10 | barra atenuada + marca de advertencia (misma convención que el paso 09: `G`, `T`, `Otros`) |
| Etiquetas | valor y `n` visibles en la barra o en tooltip, nunca solo la tasa |

### 2.4 Estados comunes (D10-04)
- **Vacío por filtro**: si el subconjunto queda con `n = 0`, se muestra estado
  vacío ("sin pasajeros con estos filtros") y **no** se dibuja el gráfico; no
  se produce error ni división por cero (reutiliza la regla `tasa(n,0)=None`
  del paso 09, C-29..C-31).
- **Carga**: esqueleto/skeleton mientras se lee el CSV.
- **Error de datos**: si el CSV no carga o falta una columna esperada, mensaje
  de error y ninguna cifra inventada.
- **Muestra pequeña**: `n < 10` → barra atenuada + leyenda "n<10: no interpretable".

### 2.5 Navegación compartida (D10-05)
Barra superior idéntica en las cuatro vistas con las cuatro pestañas
(Resumen · Sexo y clase · Familia y título · Cabina y calidad). Los filtros
compartidos y el estado permanecen al cambiar de pestaña. El paso entre vistas
se hace **sin recarga** (una sola página, cuatro vistas D3.js conmutables).

### 2.6 Detalle y exportación (D10-06)
- **Detalle (drilldown)**: clic en una barra filtra la vista por ese grupo
  (segundo nivel de filtro, siempre visible como "chip" removible).
- **Tooltip**: `KPI`, `variable`, `grupo`, `numerador`, `denominador`, `valor_pct`
  y `nota` — exactamente las columnas de `11_indicadores.csv`.
- **Exportación**: (a) CSV de la tabla agregada que se está viendo, con el `n`
  al lado; (b) SVG/PNG del gráfico actual. Sin backend.

## 3. D1 — Panel principal: supervivencia del pasaje (Resumen)
| Campo | Contenido |
|---|---|
| ID | D1 |
| Propósito | Resumir en una pantalla la tasa de supervivencia y su estructura por sexo, clase y familia |
| Audiencia | Público general / decisión rápida; punto de entrada |
| Preguntas | ¿Cuál es la tasa global? ¿Dónde es más alta y más baja? ¿Cuánto dato de cabina hay? |
| KPI | KPI-01 (global), KPI-02 (Sex + brecha), KPI-03 (Pclass), KPI-04 (TamanoFamilia), KPI-06 (cobertura Cabin) |
| Gráficos | 4 tarjetas KPI (global, brecha, cobertura, n) + barras horizontales de KPI-02, KPI-03 y KPI-04 |
| Escalas/unidades | tarjetas en %; barras con eje 0–100 % |
| Colores | una familia de tonos por variable; cobertura en neutro |
| Muestra | cada barra rotula su `n`; KPI-01 rotula 891 |
| Mensajes | "342 de 891 pasajeros sobrevivieron (38.38 %). La diferencia por sexo (74.20 % vs 18.89 %) es el corte más marcado; por clase, 62.96 / 47.28 / 24.24 %." |
| Filtros | Sexo, Clase, Embarque, Tamaño de familia (recalculan `n`) |
| Detalle | clic en una barra → filtra por ese grupo |
| Estado vacío | filtro sin filas → "sin pasajeros con estos filtros" |
| Export | CSV agregado + SVG |

## 4. D2 — Temático: quién sobrevive (sexo × clase)
| Campo | Contenido |
|---|---|
| ID | D2 |
| Propósito | Mostrar la estructura conjunta de supervivencia por sexo y clase, no solo los márgenes |
| Audiencia | Analista que quiere ver interacciones entre dos cortes |
| Preguntas | ¿Cómo se combinan sexo y clase? ¿Se mantiene la brecha dentro de cada clase? |
| KPI | KPI-02, KPI-03 (y su cruce `Sex × Pclass`, recalculado sobre el subconjunto) |
| Gráficos | barras agrupadas Sex dentro de cada Pclass + matriz Sex × Pclass con tasa anotada |
| Escalas/unidades | matriz con escala de color 0–100 %; barras con eje 0–100 % |
| Colores | 2 tonos (female/male) sobre 3 columnas (1/2/3) |
| Muestra | cada celda de la matriz muestra `num/den` y la tasa; celdas pequeñas se atenúan |
| Mensajes | "La supervivencia de las mujeres supera a la de los hombres en las tres clases; el efecto de la clase se suma al del sexo." |
| Filtros | Sexo, Clase, Embarque |
| Detalle | clic en celda → fija Sexo+Pclass |
| Estado vacío | celda sin pasajeros → celda gris "0 filas", no 0 % |
| Export | CSV del cruce + SVG |

Nota D08-04: este cruce usa solo variables completas; **no** entra `Age`
(177 faltantes), que requeriría declarar la base 714.

## 5. D3 — Temático: familia y título
| Campo | Contenido |
|---|---|
| ID | D3 |
| Propósito | Explorar los grupos derivados de composición del pasaje y su relación con la supervivencia |
| Audiencia | Analista de segmentos; lector que pregunta "¿viajar con familia ayudó?" |
| Preguntas | ¿Cómo varía la supervivencia por tamaño de familia? ¿Difieren los títulos agrupados? |
| KPI | KPI-04 (TamanoFamilia 1 / 2-4 / 5+), KPI-05 (Titulo: Mr / Mujer / Master / Otros) |
| Gráficos | barras KPI-04 + barras KPI-05 + distribución de contexto de `SibSp`/`Parch` |
| Escalas/unidades | 0–100 % para tasas; 0–n para el histograma de contexto |
| Colores | tonos neutros para el contexto; acento único para las barras de KPI |
| Muestra | `Mujer` n=311, `Mr` n=517, `Master` n=40, `Otros` n=23 (n<50 se marca); `5+` n=62 |
| Mensajes | "Los grupos de 2–4 personas (57.88 %) superan a los de 1 (30.35 %) y a los de 5+ (16.13 %). `Otros` títulos tiene 23 casos: no interpretable con holgura." |
| Filtros | Sexo, Clase, Embarque, Tamaño de familia |
| Detalle | clic en un tramo/título → filtra |
| Estado vacío | aviso si un tramo queda sin filas tras filtrar |
| Advertencias | `TamanoFamilia` es un conteo, **no** un parentesco real; `Otros` agrupa 10 títulos raros |
| Export | CSV + SVG |

## 6. D4 — Temático: cabina y calidad del dato
| Campo | Contenido |
|---|---|
| ID | D4 |
| Propósito | Publicar la cobertura de `Cabin` y la supervivencia por cubierta **con su base declarada**, y mostrar dónde faltan datos |
| Audiencia | Lector crítico que necesita saber qué se puede y qué no se puede afirmar |
| Preguntas | ¿Cuántos pasajeros tienen cabina registrada? ¿La cubierta informa la supervivencia? ¿Qué falta en el dataset? |
| KPI | KPI-06 (cobertura 204/891 = 22.90 %), KPI-07 (tasa por cubierta sobre base 204 + referencia 687) |
| Gráficos | barra de cobertura (204 vs 687) + barras de KPI-07 por cubierta + barras de faltantes `BanderaSinAge`/`BanderaSinCabin`/`BanderaSinEmbarked` |
| Escalas/unidades | cobertura y faltantes en % de 891; tasas 0–100 % |
| Colores | neutros para cobertura/faltantes; acento para tasa por cubierta |
| Muestra | base 204 rotulada; `sin_cabin_ref` 206/687 = 29.99 % como referencia aparte; `G` (n=4) y `T` (n=1) atenuadas |
| Mensajes | "Solo el 22.90 % del pasaje tiene cabina registrada. Sobre esos 204, la supervivencia va de 46.67 % (A) a 75.76 % (D); con tan pocos casos por cubierta, se lee como señal, no como conclusión." |
| Filtros | Cubierta (A..G/T/vacío), Clase, Embarque |
| Detalle | clic en cubierta → filtra; la referencia `sin_cabin_ref` queda **fuera** de la base 204 |
| Estado vacío | "sin pasajeros con cabina en esta selección" |
| Advertencias | `G`/`T` con n<10: no interpretables; los 687 sin cabina no son "cubierta desconocida", son **dato ausente** |
| Export | CSV + SVG |

## 7. Conexión entre las cuatro vistas (resumen)
| Desde | Hacia | Qué se conserva |
|---|---|---|
| D1 | D2/D3/D4 | los filtros activos y el grupo cliqueado (chip removible) |
| D2 | D3 | Sexo + Clase (Tamaño de familia se añade allí) |
| D3 | D1 | grupo de familia/título; D1 lo muestra como filtro activo |
| D4 | D1 | Cubierta; al volver, D1 recalcula su `n` sobre esa selección |

Cualquier combinación de filtros mantiene **el mismo subconjunto de 891
filas**; ninguna vista introduce datos externos.

## 8. Trazabilidad
Filas `T10-01..T10-10` en `proyecto/03_trazabilidad.csv` ligan cada decisión de
esta propuesta con su justificación y con los KPI/código que la sustentan.

## 9. Estado
Propuesta de las cuatro vistas **GENERADA** (v1). No se construyó ninguna vista.
Pendiente de aprobación por el prompt del paso 11.
