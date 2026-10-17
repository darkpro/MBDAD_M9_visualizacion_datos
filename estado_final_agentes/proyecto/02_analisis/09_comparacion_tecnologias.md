# Comparación de tecnologías para los dashboards

ESTADO: GENERADO
PASO: 10
VERSION: 1
DOCUMENTO SECUNDARIO DE: paso 10
(documento principal: `proyecto/03_decisiones/06_decisiones_dashboards.md`)
DOCUMENTOS RELACIONADOS:
- `proyecto/03_decisiones/02_decision_tecnologica.md` (decisión de entorno y motor)
- `proyecto/02_analisis/08_propuesta_dashboards.md` (vistas propuestas)
- `proyecto/03_trazabilidad.csv` (filas T10-01..T10-10)

## 0. Alcance
Comparar las librerías con las que se podrían construir las cuatro vistas del
paso 10 y confirmar la elección de **D3.js** ya fijada en el paso 02 (T02-05).
Este documento no instala ni ejecuta nada; solo decide.

## 1. Criterios (ponderados por lo que el proyecto realmente necesita)
| # | Criterio | Por qué importa aquí |
|---|---|---|
| C1 | Control total de escalas y ejes | las tasas deben ir con eje fijo 0–100 % y ejes compartidos entre vistas |
| C2 | Filtrado interactivo y recálculo de `n` | el denominador cambia con cada filtro (D10-02) |
| C3 | Estados vacíos y grupos con n<10 | el dataset tiene grupos diminutos (`G`, `T`, `Otros`) |
| C4 | Exportar CSV + SVG | requisito de paso 10 (D10-06) |
| C5 | Sin backend / sin build pesado | el proyecto entrega archivos estáticos |
| C6 | Dependencias ya disponibles | evitar añadir runtime nuevo |
| C7 | Curva y mantenibilidad | 4 vistas, no un producto grande |

## 2. Comparación

| Opción | C1 escalas | C2 filtros | C3 estados | C4 export | C5 sin backend | C6 deps | C7 curva | Veredicto |
|---|---|---|---|---|---|---|---|---|
| **D3.js v7** | total | total (dato en memoria) | total (control directo del DOM/SVG) | CSV trivial; SVG nativo | sí (script en el navegador) | ninguna nueva si se sirve local/CDN | media (mayor control, más código) | **Elegida** |
| Observable Plot | alta | alta | media | SVG/PNG vía API | sí | añade 1 lib sobre D3 | baja | Descartada: capa extra que oculta escalas que aquí se fijan a mano |
| Vega-Lite | alta (spec) | alta | media | PNG/SVG vía `vl2svg` | sí (runtime propio) | añade runtime Vega | baja-media | Descartada: obliga a una gramática de specs y a compilar; más peso del necesario |
| Chart.js | media | media | baja | PNG (canvas) | sí | añade 1 lib | baja | Descartada: canvas complica la exportación a SVG y el control fino de ejes |
| ECharts | media-alta | alta | media | PNG (canvas) | sí | añade lib grande (~1 MB) | baja | Descartada: exceso de features para 4 vistas; canvas limita el SVG |
| Plotly.js | alta | alta | media | PNG/SVG/HTML | sí | añade lib grande | baja-media | Descartada: peso muy superior al uso; dependencia de su ecosistema |
| Recharts | media | alta | media | SVG vía DOM | requiere React | añade React | baja | Descartada: obliga un framework que el proyecto no usa |
| Matplotlib (estático) | alta | nula | nula | PNG/SVG | n/a | ya disponible | baja | Descartada: sin interacción ni filtros; sirve solo para figuras fijas |
| Tableau / Power BI | alta | alta | media | limitada sin licencia | no (herramienta externa) | n/a | n/a | Descartada: herramienta externa, no reproducible en el repo |

## 3. Decisión
Se mantiene **D3.js v7** como único motor visual de las cuatro vistas:
- Da control exacto de escalas y ejes (C1) y del recálculo tras filtrar (C2),
  que son el núcleo del diseño (D10-02/D10-03).
- Permite marcar estados vacíos y muestras pequeñas sin pelear con el framework
  (C3), tal como ya hace el paso 09.
- Exporta CSV y SVG sin dependencias extra (C4).
- Se sirve como archivos estáticos, sin backend ni build (C5).
- No añade ninguna dependencia de runtime que el proyecto no tenga ya (C6).

## 4. Consecuencias
- El front se compone de HTML + CSS + JS con D3 v7; el dato se lee del CSV (o de
  un JSON pre-agregado derivado de él), sin servidor de aplicaciones.
- `11_indicadores.csv` se usa como **baseline de verificación**: sin filtros, las
  tasas mostradas deben reproducir exactamente los valores del paso 09.
- Si en el futuro se necesitara una figura estática para un informe, basta
  `matplotlib` (ya presente); no se añade librería solo para eso.
- Reconsiderar si: (a) aparece la necesidad de mapas (no hay geografía hoy) o
  (b) el número de vistas crece a decenas, donde una gramática declarativa
  (Vega-Lite) empezaría a compensar.

## 5. Estado
Comparación **GENERADA** (v1). Elección confirmada: **D3.js v7**. No se instaló
ni ejecutó nada.
