# Decisión tecnológica

ESTADO: GENERADO
PASO: 02
VERSION: 2
DOCUMENTO SECUNDARIO DE: proyecto/03_decisiones/01_decisiones_datos.md
DOCUMENTO SECUNDARIO TAMBIÉN DE: paso 10
(documento principal del paso 10: `proyecto/03_decisiones/06_decisiones_dashboards.md`)
HISTORIAL: v1 (paso 02, provisional, solo entorno de datos) se conserva como
historial de la aprobación del paso 02. Esta v2 la completa el paso 10 con la
capa de visualización y el enlace datos→front, sin contradecir la v1.

## 1. Criterios
Ajuste al caso (tabular, 891 filas), peso de dependencias, reproducibilidad,
alineación con el front (D3.js consume CSV/JSON), coste, curva de aprendizaje y
capacidad de exportar CSV+SVG.

## 2. Entorno real comprobado
| Tecnología | Estado |
|---|---|
| Python | 3.13.5 presente |
| pandas | 2.3.1 presente |
| pyarrow | 22.0.0 presente |
| polars | 1.44.2 **instalado pero no utilizable** (falla por instrucciones de CPU ausentes: `avx2`, `fma`, `bmi1`, `bmi2`, `lzcnt`, `movbe`) |
| R | ausente |
| Node.js | v24.13.0 presente |
| D3.js v7 (front) | elegido como único motor visual (ver `09_comparacion_tecnologias.md`) |
| matplotlib | presente (solo para figuras estáticas, si hicieran falta) |

## 3. Comparación — procesamiento
| Opción | Veredicto | Motivo |
|---|---|---|
| Python + pandas | **SELECTA** | Ya instalada; ideal para tabular; sin dependencias nuevas |
| Python (stdlib csv) | Reserva | Suficiente para 891 filas; sin agregaciones cómodas para KPI |
| polars | Descartada | Instalada pero inutilizable en este CPU (instrucciones faltantes); su rendimiento es irrelevante a esta escala |
| R | Descartada | No instalada |
| Node + papaparse | Descartada | Duplicaría stack; el procesamiento es batch, no front |
| Great Expectations / dbt | Descartada | Framework sobredimensionado para un CSV único; se adopta su taxonomía de dimensiones, no el software |
| SQLite | Descartada | Aporta persistencia que este caso no requiere |

## 4. Comparación — visualización
El detalle está en `proyecto/02_analisis/09_comparacion_tecnologias.md`.
| Opción | Veredicto | Motivo (resumen) |
|---|---|---|
| **D3.js v7** | **SELECTA** | Control exacto de escalas/ejes, filtros en memoria, estados vacíos, export CSV+SVG, sin backend ni deps nuevas |
| Observable Plot | Descartada | Capa extra sobre D3 que oculta escalas que aquí se fijan a mano |
| Vega-Lite / Vega | Descartada | Runtime y specs de más para 4 vistas |
| Chart.js / ECharts / Plotly.js | Descartada | Canvas (peor export SVG) y/o peso muy superior al uso |
| Recharts | Descartada | Obliga React, que el proyecto no usa |
| Tableau / Power BI | Descartada | Herramienta externa no reproducible en el repo |

## 5. Selección
- **Procesamiento (depuración, ETL, KPI):** Python 3.13 + pandas 2.3.1.
- **Salida de datos:** CSV plano (UTF-8 sin BOM, LF), desacoplada del front.
- **Visualización (4 dashboards):** **D3.js v7**, consumiendo el mismo CSV del
  dataset enriquecido.
- **Enlace datos→front:** el front lee `Titanic-Dataset_enriquecido.csv` y
  agrega en el navegador para que los filtros recalculen el denominador
  (D10-02). `11_indicadores.csv` actúa como **baseline de verificación**: sin
  filtros, las tasas mostradas deben reproducir los valores del paso 09.
- Justificación: cero dependencias nuevas, reproducible, y separa claramente el
  procesamiento batch (Python) de la presentación (D3.js).
- Reserva: si pandas no estuviera disponible en otro entorno, cae a stdlib `csv`.

## 6. Consecuencias
- El paso 03 (depuración) y siguientes se implementan en Python + pandas en
  `proyecto/04_codigo/`.
- pyarrow queda disponible si más adelante se desea parquet; no se usa ahora.
- El front se compone de HTML + CSS + JS con D3 v7 servido como archivos
  estáticos; sin servidor de aplicaciones.
- Si se necesitara una figura estática para un informe, `matplotlib` ya está
  presente; no se añade librería solo para eso.
- Revisar esta decisión si aparece la necesidad de mapas (hoy no hay geografía
  en el dataset) o si el número de vistas crece mucho.

## 7. Estado
Tecnología **GENERADA** (v2) por el paso 10: procesamiento y visualización
confirmados. No se instaló ni ejecutó nada en este paso.
