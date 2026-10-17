# Implementación del dashboard temático 1 (D2: sexo × clase)

ESTADO: APROBADO
PASO: 12
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 12
DOCUMENTOS SECUNDARIOS:
- proyecto/04_codigo/dashboard/datos.js (cruce Sex × Pclass)
- proyecto/04_codigo/dashboard/app.js (vista D2: barras agrupadas, matriz, filtros por vista)
- proyecto/04_codigo/dashboard/index.html (título de vista y contenedor de gráficos)
- proyecto/04_codigo/dashboard/estilos.css (celdas de la matriz y swatches)
- proyecto/04_codigo/dashboard/_check_datos.mjs (check runnable con los asserts del cruce)
- proyecto/03_trazabilidad.csv (filas T12-01..T12-06)
APROBACIÓN DEL PASO 11: registrada en
`proyecto/02_analisis/16_validacion_principal.md` (v1, APROBADO) con la
aprobación explícita del prompt del paso 12.

## 1. Autorización de este paso
Ejecutado con la autorización exclusiva del paso 12, que a la vez aprueba el
paso 11. Se implementa **solo el tema 1: D2 = sexo × clase** (D10-01) sobre la
infraestructura del paso 11. **No se implementa el segundo temático** (D3,
Familia y título) ni D4, y no se avanzó al paso 13. Sin `human_review`.

## 2. Qué se implementó
Se extienden los cuatro archivos del paso 11 más el check; **sin dependencias
nuevas** (D3 v7 sigue por CDN):

| Archivo | Rol | SHA256 |
| --- | --- | --- |
| `datos.js` | Añade `cruce(filas, filtros)` (6 celdas Sex × Pclass) | `2AD3CC0E36A7CFFD80CFE09B32D6A163154A0386B83FC43FC068230A6091DE02` |
| `app.js` | Vista D2 (barras agrupadas, matriz) + router D1/D2 + filtros por vista | `5FD1BA6C7182FFA022E0A055AAFF363AFB9323632648EF77FB822115B5BA4890` |
| `index.html` | Título de vista (`#titulo-vista`) y contenedor `#graficos` | `2630B8471342876700F924B0004721E8C60397D295EFCF308151559505C0573A` |
| `estilos.css` | Estilos de celda de matriz (`.celda`) y swatch | `FDCE0EF1772140EBFD9757883A68D904BA5B224CB62690BD7202E1AF1A6703B6` |
| `_check_datos.mjs` | Añade los asserts del cruce | `9219A21DD7F4413E9073636AA188888DDD2213D1887D99A420FFB5CD7C5114FB` |

D2 muestra:
- **Título-hallazgo** (D10-C01): "La brecha por sexo se mantiene en las tres
  clases (de 36.46 a 76.37 pp)".
- **Tarjetas**: brecha por sexo (55.31 pp), mujeres (74.20 %), hombres
  (18.89 %) y `n` del filtro vigente.
- **Barras agrupadas por clase** (mujer/hombre), eje de tasa fijo 0-100 %.
- **Matriz Sexo × Clase** con la tasa y su base `numerador/denominador` en cada
  celda (D10-C02); celda más azul = tasa más alta.
- Tooltip y export con las mismas columnas de `11_indicadores.csv` (D10-06).

El cruce **no está en `11_indicadores.csv`** (ese CSV solo trae KPI-02 por
`Sex` y KPI-03 por `Pclass`, no la intersección): se agrega en `datos.js` con
la misma tupla de columnas del baseline.

## 3. Cómo ejecutarlo
```
python -m http.server 8000
```
desde la raíz del repositorio y abrir
`http://localhost:8000/proyecto/04_codigo/dashboard/index.html`. Se sirve por
HTTP porque `fetch` del CSV desde `file://` está bloqueado por CORS. D3 v7 se
carga desde el CDN de jsdelivr (requiere red).

## 4. Validación
`node proyecto/04_codigo/dashboard/_check_datos.mjs` reproduce, sin filtros, el
baseline `proyecto/02_analisis/11_indicadores.csv` (paso 09) y ahora también
fija el cruce sexo × clase. Salida real:
```
CHECK OK | asserts=146 | kpi_filas=24 | n=891
```
El check conserva los 117 asserts del paso 11 (que siguen verdes, así que el
comportamiento de D1 **no cambió**) y añade 29 del cruce: las 6 celdas
(`numerador`, `denominador`, `valor_pct` a 2 decimales), la suma de numeradores
(=342) y de denominadores (=891), el ancla `1/female` = 91/94 = 96.81 %
(consistente con los checks C-32/C-33 del paso 09), la forma de `D2`
(`kpis`, `filtros`), el filtro `Sex=female` → `n=314` con las celdas `male` en
`denominador=0` / `valor_pct=null` / `nota="sin casos"`, y el cruce vacío.

Cruce sin filtros (valores y bases reales):

| Sexo | Clase | Supervivencia | Base |
| --- | --- | --- | --- |
| female | 1 | 96.81 % | 91/94 |
| male | 1 | 36.89 % | 45/122 |
| female | 2 | 92.11 % | 70/76 |
| male | 2 | 15.74 % | 17/108 |
| female | 3 | 50.00 % | 72/144 |
| male | 3 | 13.54 % | 47/347 |
| — | total | — | 342/891 |

Brecha woman − man por clase: **59.92 pp** (clase 1), **76.37 pp** (clase 2) y
**36.46 pp** (clase 3); el rango 36.46-76.37 es el que enuncia el título. Las 6
celdas tienen `n ≥ 76`, por encima del umbral de 10: ninguna queda marcada como
no interpretable sin filtros.

## 5. Reglas aplicadas (paso 10)
- **D10-01**: se implementa la vista D2 (sexo × clase) como temático 1. No hay
  mapa en esta vista, así que la regla de geografía (del paso 10) no aplica.
- **D10-02**: D2 ofrece los filtros compartidos `Sex`, `Pclass` y `Embarked`.
  `TamanoFamilia` (de D1 y D3) **no** se aplica en D2: cada vista agrega solo
  con sus propios filtros (`filtrosDe`), aunque `estado.filtros` los conserve
  todos para D10-05.
- **D10-03**: eje de tasa fijo 0-100 %; color categórico por sexo (azul mujer /
  naranja hombre); sin semáforos rojo/verde.
- **D10-04**: `n=0` → estado vacío (reutiliza `tasa(n,0)=null`, "sin casos");
  `n<10` → barra/celda atenuada y nota "no interpretable"; error de carga →
  aviso, sin cifras inventadas.
- **D10-05 / D10-06**: cambiar de vista no borra los filtros; el drilldown por
  clic fija `Sex` y `Pclass` (y los quita si ya coincidían); el tooltip y el
  export usan las columnas de `11_indicadores.csv`; export CSV del cruce y SVG
  de la vista, sin backend.

## 6. Conservación del contexto al ir y volver (D10-05)
Los filtros viven en `estado.filtros` (no en la URL) y el router de hash solo
cambia `estado.vista`, así que **D1 → D2 → D1 conserva los filtros puestos**.
Los chips reflejan los filtros de la vista actual; al volver a D1 reaparecen los
suyos (p. ej. `TamanoFamilia`), que nunca se borraron. El botón "Limpiar" quita
solo los filtros visibles en la vista actual.

## 7. Qué NO se implementó
El **segundo temático** (D3, Familia y título) y D4 (Cabina y calidad) siguen en
la navegación como **deshabilitados** y rotulados "pendiente (pasos 13-14)". No
se marcan como implementados y no se avanzó al paso 13.

## 8. Limitaciones
- Requiere servidor HTTP y red para el CDN de D3.
- El check valida la capa de datos/agregación en node **y el cruce**; la capa de
  dibujo (DOM y D3) y el alcance de filtros por vista se verifican abriendo la
  página, no con un test automatizado.
- Los filtros se conservan dentro de la sesión pero **no se serializan en la
  URL**: recargar la página vuelve a `D1` sin filtros.
- `Age` (177), `Cabin` (687) y `Embarked` (2) siguen sin imputar; D2 no usa
  `Age` ni `Cabin`.

## 9. Trazabilidad
Filas `T12-01..T12-06` en `proyecto/03_trazabilidad.csv` ligan cada requisito del
paso 12 (cruce sexo × clase, barras agrupadas, matriz, alcance de filtros por
vista, conservación de contexto y export) con su evidencia y su código.
`T11-07` (que en el paso 11 decía "navegación deshabilitada pendiente") queda
matizada por `T12-*`, que registran D2 ya implementada.

## 10. Estado
PASO 12 **APROBADO** (v1): D2 implementada y validada contra el paso 09 más el
cruce sexo × clase. Sin `human_review`.

## 11. Aprobación de esta versión
APROBADO por el prompt del paso 13 ("Apruebo los resultados del paso 12 y
autorizo el paso 13"), que a la vez autorizaba la implementación del dashboard
temático 2 (D3, familia y título).

- Alcance aprobado: este documento (v1), los cinco archivos de
  `proyecto/04_codigo/dashboard/` y las filas `T12-01..T12-06` de
  `proyecto/03_trazabilidad.csv`.
- El `checks=146` de la sección 4 y la tabla de SHAs de la sección 2 son el
  **registro histórico del estado del paso 12** en el momento de su aprobación:
  se conservan tal cual y **no** se recalculan.
- El paso 13 **extendió** `datos.js` (nueva `D3` y `VISTAS` con D3 implementada),
  `app.js` (`VISTA` con D3, `TITULO_KPI['KPI-05']`, `leyenda(texto)` y
  `dibujarBarras(...)` genéricos, ramas D3 en `renderGraficos` y `renderTarjetas`),
  `index.html` (título, subtítulo y pie de los pasos 11-13) y `_check_datos.mjs`
  (`asserts=158`). Los SHA256 vigentes están en el documento principal del paso 13,
  `proyecto/02_analisis/18_validacion_tematico_2.md`.
- No cubre el paso 06 v2, que sigue GENERADO sin aprobar.
- Sin `human_review`.
