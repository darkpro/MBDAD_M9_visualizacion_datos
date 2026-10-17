# Decisiones de dashboards (cuatro vistas D3.js)

ESTADO: APROBADO
PASO: 10
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 10
DOCUMENTOS SECUNDARIOS:
- proyecto/02_analisis/08_propuesta_dashboards.md (propuesta de las cuatro vistas)
- proyecto/02_analisis/09_comparacion_tecnologias.md (comparación de librerías)
- proyecto/03_decisiones/02_decision_tecnologica.md (v2: entorno + motor visual)
- proyecto/03_decisiones/07_decisiones_comunicacion.md (mensajes y lenguaje)
- proyecto/03_trazabilidad.csv (filas T10-01..T10-10)
APROBACIÓN DEL PASO 09: registrada en
`proyecto/02_analisis/21_validacion_indicadores.md` (v1, APROBADO) con la
aprobación explícita del prompt del paso 10.

## 0. Autorización de este paso
Ejecutado con la autorización exclusiva del paso 10, que a la vez aprueba el
paso 09. Se **deciden y documentan** las cuatro vistas; **no se construye
ninguna** (eso corresponde a los pasos de implementación). No se define ningún
KPI nuevo: se usan los 7 aprobados (D08-01). Sin `human_review` y sin avanzar a
ningún paso posterior.

## 1. Contexto
- Dataset: 891 pasajeros × 18 columnas (`Titanic-Dataset_enriquecido.csv`).
- Catálogo KPI: 7 indicadores, sin metas ni semáforos (D08-01, D08-06).
- Valores implementados: `11_indicadores.csv` (24 filas) verificados por 33
  comprobaciones (paso 09).
- Hallazgos que guían el diseño: la brecha por sexo es el corte más marcado
  (55.31 pp); la clase 3 concentra 491 de 891 pasajeros; `Cabin` solo está en
  204 filas (22.90 %); hay grupos con n<10 (`G`, `T`) y un grupo de títulos
  raros (`Otros`, n=23).

## 2. Decisiones

### D10-01 — Cuatro dashboards conectados, sin mapas
Se proponen **cuatro vistas D3.js** que leen el mismo dataset de 891 pasajeros:
- **D1 (principal) — Resumen de supervivencia**: KPI-01, KPI-02, KPI-03, KPI-04, KPI-06.
- **D2 (temático) — Sexo × clase**: KPI-02, KPI-03 y su cruce.
- **D3 (temático) — Familia y título**: KPI-04, KPI-05.
- **D4 (temático) — Cabina y calidad del dato**: KPI-06, KPI-07 y faltantes.

**No hay mapa**: el dataset no contiene geografía del pasajero (`Embarked` es el
puerto de embarque, categórico). Un mapa exigiría una fuente externa no
solicitada. Tampoco se identifican familias reales ni se infiere clase
económica: `TamanoFamilia` es un conteo (`SibSp+Parch+1`) y `Pclass` es una
columna existente. Justificación y detalle en `08_propuesta_dashboards.md`.

### D10-02 — Filtros compartidos con recálculo del denominador
Sexo, Clase y Embarque son **filtros compartidos** por D1–D3; Tamaño de familia
se comparte en D1 y D3; Cubierta aplica a D4. El filtro se aplica **antes** de
agregar, de modo que el denominador se recalcula sobre el subconjunto y cada
vista muestra su `n` vigente. KPI-01 solo coincide con el paso 09 cuando no hay
filtros activos. Motivo: sin `n` visible, una tasa filtrada se lee como si fuera
global.

### D10-03 — Escalas y color
- Eje de tasa **fijo 0–100 %** en las cuatro vistas, para que las barras sean
  comparables al cambiar de pestaña.
- Color categórico por grupo; **sin semáforos rojo/verde** (hereda D08-06).
- Cobertura y faltantes en tonos neutros, para no confundir "dato ausente" con
  "dato observado".

### D10-04 — Estados vacíos y muestras pequeñas
- Subconjunto con `n = 0` → estado vacío explícito, sin gráfico y sin división
  por cero (reutiliza `tasa(n,0)=None` del paso 09).
- `n < 10` → barra atenuada + marca "no interpretable" (misma convención que
  `G`, `T` y `Otros` en el paso 09).
- Error de carga → mensaje de error; ninguna cifra inventada.

### D10-05 — Campos que enlazan las vistas
El enlace no es un join entre vistas, sino **el mismo conjunto filtrado**: las
cuatro vistas agregan sobre las 891 filas. Los campos de enlace son los filtros
(`Sex`, `Pclass`, `Embarked`, `TamanoFamilia`, `Cubierta`). Al navegar, los
filtros activos y el grupo cliqueado (chip removible) se conservan.

### D10-06 — Detalle y exportación
- Drilldown: clic en barra/celda aplica ese grupo como filtro visible.
- Tooltip con las columnas exactas de `11_indicadores.csv` (`KPI`, `variable`,
  `grupo`, `numerador`, `denominador`, `valor_pct`, `nota`).
- Export: CSV de la tabla agregada visible (con su `n`) + SVG/PNG del gráfico
  actual. Sin backend.

### D10-07 — Cabina como calidad del dato, no como tema central
KPI-06 y KPI-07 se agrupan en D4 con su base declarada (204) y su referencia
(687, 29.99 %). `sin_cabin_ref` queda **fuera** de la base del indicador, y los
687 sin cabina se rotulan como **dato ausente**, no como "cubierta desconocida".

### D10-08 — Alcance de este paso
Esta v1 es una **propuesta**: solo decide y documenta. La construcción de las
vistas queda para los pasos de implementación. Nada de lo aquí decidido cambia
los KPI, los datos ni los scripts ya aprobados.

## 3. Qué NO se decide aquí
- No se fijan metas, umbrales ni colores de alerta (D08-06 sigue vigente).
- No se añade ningún KPI ni medida no presente en el dataset.
- No se elige aún la organización exacta de archivos del front ni el paso que lo
  implementará.

## 4. Trazabilidad
Filas `T10-01..T10-10` en `proyecto/03_trazabilidad.csv` ligan cada decisión con
su pregunta, su evidencia y la vista afectada.

## 5. Estado
PASO 10 **APROBADO** (v1) por el prompt del paso 11: cuatro vistas propuestas y
decididas, sin construir. Sin `human_review`.

## 6. Aprobación de esta versión (v1)
**APROBADO** por el prompt del paso 11, que aprueba el paso 10 y autoriza
exclusivamente el paso 11. Cubre `06_decisiones_dashboards.md` (v1, principal,
D10-01..D10-08), `08_propuesta_dashboards.md`, `09_comparacion_tecnologias.md`,
`02_decision_tecnologica.md` (v2), `07_decisiones_comunicacion.md`
(D10-C01..D10-C07) y las filas `T10-01..T10-10` de la trazabilidad. Se registra
tras comprobar que los cinco documentos existen en disco y que las filas
`T10-*` están presentes (73 filas, LF, 10 campos). El paso 06 v2 sigue
**GENERADO** sin aprobar: no lo cubre este prompt.
