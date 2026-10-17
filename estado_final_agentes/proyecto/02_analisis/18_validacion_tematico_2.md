# Implementación del dashboard temático 2 (D3: familia y título)

ESTADO: APROBADO
PASO: 13
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 13
DOCUMENTOS SECUNDARIOS:
- proyecto/04_codigo/dashboard/datos.js (D3 y VISTAS con D3 implementada)
- proyecto/04_codigo/dashboard/app.js (vista D3: tarjetas, barras, filtros por vista)
- proyecto/04_codigo/dashboard/index.html (título de vista y contenedor de gráficos)
- proyecto/04_codigo/dashboard/_check_datos.mjs (check runnable con los asserts de D3)
- proyecto/03_trazabilidad.csv (filas T13-01..T13-06)
APROBACIÓN DEL PASO 12: registrada en
`proyecto/02_analisis/17_validacion_tematico_1.md` (v1, APROBADO) con la
aprobación explícita del prompt del paso 13.

## 1. Autorización de este paso
Ejecutado con la autorización exclusiva del paso 13, que a la vez aprueba el
paso 12. Se implementa **solo el tema 2: D3 = familia y título** (D10-01) sobre
la infraestructura de los pasos 11 y 12. **No se implementa D4** (cabina y
calidad, KPI-06/KPI-07) y no se avanzó al paso 14. Sin `human_review`.

## 2. Qué se implementó
Se extienden los archivos de los pasos 11-12 más el check; **sin dependencias
nuevas** (D3.js v7 sigue por CDN):

| Archivo | Rol | SHA256 |
| --- | --- | --- |
| `datos.js` | Añade `D3` (kpis/barras `KPI-04`,`KPI-05`; filtros `Sex`,`Pclass`,`Embarked`,`TamanoFamilia`; título-hallazgo) y marca D3 en `VISTAS` | `3DF2B5542B168E666758F989626364B488626AB46E1E75867F7CA2BA14CF69BE` |
| `app.js` | Añade `VISTA` con D3, `TITULO_KPI['KPI-05']`, `leyenda(texto)` y `dibujarBarras(cont, agg, barras, prefijo, textoLeyenda)` genéricos, y las ramas D3 de `renderTarjetas` y `renderGraficos` | `A09F2D06A7B4063E34D4E1D6AC5DE9AF350F37A430BEC5356CCFA83D189823BA` |
| `index.html` | Título, subtítulo y pie de los pasos 11-13 | `E12CC61F65574E3C5B4EBFFE9D75A5F394F8BB357171AAAA232068130AC62D92` |
| `estilos.css` | Sin cambios (reutiliza `.leyenda`, `.tarjetas`, `svg g.celda`) | `FDCE0EF1772140EBFD9757883A68D904BA5B224CB62690BD7202E1AF1A6703B6` |
| `_check_datos.mjs` | Añade los asserts de D3 (bloque §7) | `057A84B62057A0CBC2CF54542A2DE3ECF76E4121FBAF3E109C02F1A23247A4C6` |

D3 **no recalcula indicadores**: usa las filas `KPI-04` (`TamanoFamilia`) y
`KPI-05` (`Titulo`) que ya produce `agregar()` con las mismas columnas de
`11_indicadores.csv` (D10-02). El cruce propio de D2 sigue siendo lo único que
no viene del paso 09.

## 3. Cómo ejecutarlo
Desde la raíz del proyecto: `python -m http.server 8000` y abrir
`http://localhost:8000/proyecto/04_codigo/dashboard/index.html` (desde `file://`
el fetch del CSV falla por CORS). Check de datos: `node _check_datos.mjs` dentro
de `proyecto/04_codigo/dashboard/`.

## 4. Validación
`node _check_datos.mjs` → **`CHECK OK | asserts=158 | kpi_filas=24 | n=891`**
(158 asserts; el bloque D3 suma 41). Los 24 valores de `11_indicadores.csv` se
siguen reproduciendo sin filtros.

Sin filtros, la vista D3 muestra dos gráficos de barras sobre el eje fijo 0-100 %
(D10-03) y cuatro tarjetas:

- **Familia 2-4** = 57.88 % (169/292).
- **Título Mujer** = 73.95 % (230/311).
- **Brecha por título** = 58.29 pp (Mujer menos Mr; `valor_pct` sin redondear,
  73.95 − 15.67).
- **n del filtro vigente** = 891.

Barras de D3 (KPI-04 y KPI-05, con `numerador/denominador` rotulado):

| KPI (`variable`) | grupo | numerador/denominador | valor_pct |
| --- | --- | --- | --- |
| KPI-04 `TamanoFamilia` | 1 | 163/537 | 30.35 |
| KPI-04 `TamanoFamilia` | 2-4 | 169/292 | 57.88 |
| KPI-04 `TamanoFamilia` | 5+ | 10/62 | 16.13 |
| KPI-05 `Titulo` | Mr | 81/517 | 15.67 |
| KPI-05 `Titulo` | Mujer | 230/311 | 73.95 |
| KPI-05 `Titulo` | Master | 23/40 | 57.50 |
| KPI-05 `Titulo` | Otros | 8/23 | 34.78 |

Prueba de filtro y denominador (D10-02, D10-04) con `TamanoFamilia=2-4`:
`solo24 = agregar(filas, { TamanoFamilia: '2-4' })` da `n=292`; en KPI-04 el
grupo `2-4` queda en 169/292 (=57.88) y los grupos `1` y `5+` en denominador
`0`, es decir `valor_pct=null` → **estado vacío**, no 0 %. En KPI-05 la suma de
denominadores también es 292: los indicadores se recalculan sobre el
subconjunto filtrado.

Estados vacíos y umbral (D10-04): `tasa(n,0)` devuelve `null`, así que un grupo
sin casos no dibuja barra con tasa 0 sino el estado vacío; por debajo de
`UMBRAL_N=10` la barra se atenúa y la nota dice `n<10: no interpretable`
(nigún grupo de KPI-04/KPI-05 lo necesita sin filtros: todos tienen n≥10).

## 5. Reglas del paso 10 aplicadas
- **D10-01**: D3 = familia y título; usa KPI-04 y KPI-05 del paso 09.
- **D10-02**: filtros compartidos aplicados **antes** de agregar; el
  denominador se recalcula y se muestra la `n` vigente. D3 filtra por
  `Sex`, `Pclass`, `Embarked` y `TamanoFamilia`.
- **D10-03**: eje de tasa fijo 0-100 %; color categórico; sin semáforos.
- **D10-04**: `n=0` → estado vacío; `n<10` → barra atenuada + "no interpretable".
- **D10-06**: drilldown por clic solo donde hay campo filtrable
  (`KPI-04 → TamanoFamilia`); `KPI-05` (`Titulo`) no tiene campo en
  `CAMPO_DE_KPI`, así que su clic es no-op en vez de inventar un filtro.
  Tooltip con las siete columnas de `11_indicadores.csv`, export CSV/SVG.
- **D10-C01/C02**: el título de la vista enuncia el hallazgo y toda tasa lleva
  `numerador/denominador`.

## 6. Navegación entre vistas
El router de hash mantiene D1, D2 y D3 navegables (D4 sigue deshabilitado con
`title='pendiente (paso 14)'`). Al cambiar de vista se conserva el contexto: los
filtros son por vista (D10-05) y "Limpiar" solo borra los de la vista actual.
`_check_datos.mjs` verifica además que las vistas ya construidas no se rompieron
(las 24 filas del baseline siguen cuadrando).

## 7. Qué NO se implementó
- **D4 (cabina y calidad, KPI-06/KPI-07)**: queda `pendiente` en `VISTAS`; su
  botón sigue deshabilitado y el filtro `Cubierta` no se usa.
- La regla D10-07 (base 204 y referencia `sin_cabin_ref`) pertenece a D4.

## 8. Limitaciones
- Los filtros se conservan dentro de la sesión pero **no se serializan en la
  URL**: recargar vuelve a `D1` sin filtros.
- `Age` (177), `Cabin` (687) y `Embarked` (2) siguen sin imputar; D3 no usa
  `Age` ni `Cabin`.
- D3.js v7 se carga por CDN, así que la página necesita red.
- En el dataset base ningún grupo de KPI-05 tiene `n<10`; la barra atenuada solo
  puede aparecer con filtros muy restrictivos, por eso `UMBRAL_N` se prueba en
  el check y no en pantalla.

## 9. Trazabilidad
Filas `T13-01..T13-06` en `proyecto/03_trazabilidad.csv` ligan cada requisito del
paso 13 (segundo temático, ejes del paso 09, filtros y denominador, estados
vacíos y umbral, drilldown/tooltip y navegación) con su evidencia y su código.

## 10. Estado
PASO 13 **APROBADO** (v1): D3 implementada y validada contra el paso 09 más el
cruce sexo × clase (`asserts=158`). Sin `human_review`.

## 11. Aprobación de esta versión
APROBADO por el prompt del paso 14 ("Apruebo los resultados del paso 13 y
autorizo el paso 14"), que a la vez autorizaba la implementación del dashboard
temático 3 (D4, cabina y calidad del dato).

- Alcance aprobado: este documento (v1), los cinco archivos de
  `proyecto/04_codigo/dashboard/` y las filas `T13-01..T13-06` de
  `proyecto/03_trazabilidad.csv`.
- El `asserts=158` de las secciones 4 y 5 y la tabla de SHAs de la sección 2 son
  el **registro histórico del estado del paso 13** en el momento de su
  aprobación: se conservan tal cual y **no** se recalculan.
- El paso 14 **extenderá** `datos.js` (nueva `D4` y `VISTAS` con D4
  implementada, constantes `FALTANTES` y función `faltantes()`), `app.js`
  (`VISTA` con D4, `TITULO_KPI['KPI-06']`/`['KPI-07']`, `CAMPO_DE_KPI['KPI-07']`,
  panel de barras reutilizable, ramas D4 en `renderGraficos`/`renderTarjetas` y
  estado vacío consciente de vista), `index.html` (título, subtítulo y pie de los
  pasos 11-14) y `_check_datos.mjs` (`asserts` mayor). Los SHA256 vigentes
  estarán en el documento principal del paso 14,
  `proyecto/02_analisis/19_validacion_tematico_3.md`.
- No cubre el paso 06 v2, que sigue GENERADO sin aprobar.
- Sin `human_review`.
