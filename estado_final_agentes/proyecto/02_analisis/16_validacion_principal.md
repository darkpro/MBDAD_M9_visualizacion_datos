# Implementación del dashboard principal (D1)

ESTADO: APROBADO
PASO: 11
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 11
DOCUMENTOS SECUNDARIOS:
- proyecto/04_codigo/dashboard/datos.js (carga y agregación compartida)
- proyecto/04_codigo/dashboard/app.js (vista D1: filtros, tarjetas, barras, drilldown)
- proyecto/04_codigo/dashboard/index.html (estructura y navegación)
- proyecto/04_codigo/dashboard/estilos.css (paleta categórica, sin semáforos)
- proyecto/04_codigo/dashboard/_check_datos.mjs (check runnable)
- proyecto/03_trazabilidad.csv (filas T11-01..T11-08)
APROBACIÓN DEL PASO 10: registrada en
`proyecto/03_decisiones/06_decisiones_dashboards.md` (v1, APROBADO) con la
aprobación explícita del prompt del paso 11.

## 1. Autorización de este paso
Ejecutado con la autorización exclusiva del paso 11, que a la vez aprueba el
paso 10. Se implementa **solo la vista D1 (principal)** y la infraestructura
compartida. **No se implementan D2, D3 ni D4** (pasos 12-14) y no se avanzó al
paso 12. Sin `human_review`.

## 2. Qué se implementó
Cuatro archivos de código más un check, sin dependencias nuevas (D3 v7 por CDN):

| Archivo | Rol | SHA256 |
| --- | --- | --- |
| `datos.js` | Carga CSV, filtros y agregación (24 filas KPI) | `0CB12DAE4A131821C0AC42F9098506E6D29AD9DEB6596270D5D3DE4174C01EED` |
| `app.js` | Vista D1: filtros, tarjetas, barras D3, tooltip, export | `9502100CE9E402F090B4DDBDA77348026899E13E107984B57B4AF5118D2C9CCA` |
| `index.html` | Estructura, navegación de 4 pestañas, carga D3 | `D0D688BCBB38622FB1E4D8B103D6785445F67992F0528D1F9E668F1A45435A96` |
| `estilos.css` | Estilos; paleta categórica sin rojo/verde | `43F91704E488965EBE06478DBE06ED31EE627E1D13EE3EBA0F665F545AC404C2` |
| `_check_datos.mjs` | Check runnable contra el baseline | `A712B99E555D1F6076E46BA447B20DA2ACD014EFD602F15D745E9C67BEEB2D26` |

D1 muestra: tarjeta KPI-01 (global), brecha KPI-02, cobertura KPI-06 y `n` del
filtro vigente; barras horizontales de KPI-02, KPI-03 y KPI-04 con eje fijo
0-100 %.

## 3. Cómo ejecutarlo
```
python -m http.server 8000
```
desde la raíz del repositorio y abrir
`http://localhost:8000/proyecto/04_codigo/dashboard/index.html`.
Se sirve por HTTP porque `fetch` del CSV desde `file://` está bloqueado por
CORS. D3 v7 se carga desde el CDN de jsdelivr (requiere red).

## 4. Validación
`node proyecto/04_codigo/dashboard/_check_datos.mjs` reproduce, sin filtros, el
baseline `proyecto/02_analisis/11_indicadores.csv` (paso 09). Salida real:
```
CHECK OK | asserts=117 | kpi_filas=24 | n=891
```
El check compara las 24 filas (`numerador`, `denominador`, `valor_pct` a 2
decimales) contra el CSV, verifica 891 filas × 18 columnas y comprueba la
selección de D1, el filtro antes de agregar (`Sex=female` → n=314, num=233), el
estado vacío (`n=0` → `valor_pct=null`), las bandas de tamaño de familia, la
agrupación de títulos y la marca `n<10` (G marcada; A sin marcar).

Cifras de referencia sin filtros:

| Indicador | Corte | Valor | Base |
| --- | --- | --- | --- |
| KPI-01 | global | 38.38 % | 342/891 |
| KPI-02 | female / male | 74.20 % / 18.89 % | 233/314 · 109/577 |
| KPI-02 | brecha | 55.31 pp | — |
| KPI-03 | clase 1 / 2 / 3 | 62.96 % / 47.28 % / 24.24 % | 136/216 · 87/184 · 119/491 |
| KPI-04 | 1 / 2-4 / 5+ | 30.35 % / 57.88 % / 16.13 % | 163/537 · 169/292 · 10/62 |
| KPI-06 | cobertura Cabin | 22.90 % | 204/891 |

## 5. Reglas aplicadas (paso 10)
- **D10-02**: los filtros se aplican antes de agregar; el denominador se
  recalcula y la tarjeta `n` muestra el tamaño vigente. Sin filtros, KPI-01
  coincide con el paso 09 (38.38 %).
- **D10-03**: eje de tasa fijo 0-100 %; color categórico; sin semáforos ni metas.
- **D10-04**: `n=0` → estado vacío con mensaje ("sin base", nunca 0 engañoso);
  `n<10` → barra atenuada y nota "no interpretable"; error de carga → aviso, sin
  cifras inventadas.
- **D10-05 / D10-06**: el drilldown por clic filtra el mismo conjunto y añade un
  chip removible; el tooltip muestra las columnas de `11_indicadores.csv`
  (`KPI`, `variable`, `grupo`, `numerador`, `denominador`, `valor_pct`, `nota`);
  export CSV del agregado y SVG de barras, sin backend.

## 6. Qué NO se implementó
D2 (Sexo y clase), D3 (Familia y título) y D4 (Cabina y calidad) aparecen en la
navegación como **deshabilitadas** y rotuladas "pendiente (pasos 12-14)". No se
marcan como implementadas.

## 7. Limitaciones
- Requiere servidor HTTP y red para el CDN de D3; no funciona abriendo el
  archivo con doble clic.
- El check valida la capa de datos/agregación en node; la capa de dibujo (DOM y
  D3) se verifica abriendo la página, no con un test automatizado.
- `Age` (177), `Cabin` (687) y `Embarked` (2) siguen sin imputar; D1 no usa
  `Age`.

## 8. Trazabilidad
Filas `T11-01..T11-08` en `proyecto/03_trazabilidad.csv` ligan cada requisito del
paso 11 con su evidencia (los archivos anteriores) y su código.

## 9. Estado
PASO 11 **APROBADO** (v1): D1 y la infraestructura compartida implementadas y
validadas contra el paso 09 (`checks=117`).

## 10. Aprobación de esta versión
APROBADO por el prompt del paso 12 ("Apruebo los resultados del paso 11 y
autorizo el paso 12"), que a la vez autorizaba la implementación del dashboard
temático 1 (D2).

- Alcance aprobado: este documento (v1), los cinco archivos de `proyecto/04_codigo/dashboard/`
  y las filas `T11-01..T11-08` de `proyecto/03_trazabilidad.csv`.
- La tabla de SHAs de la sección 2 y el `asserts=117` de la sección 4 son el
  **registro histórico del estado del paso 11** en el momento de su aprobación:
  se conservan tal cual (eran verdaderos entonces) y **no** se recalculan.
- El paso 12 **extendió** `datos.js` (nueva `cruce()` y `D2`), `app.js` (router
  D1/D2, D2, filtros por vista, `nVigente`), `index.html` (título, `#titulo-vista`,
  `#graficos`), `estilos.css` y `_check_datos.mjs` (`asserts=146`). Los SHA256
  vigentes de esos archivos están en el documento principal del paso 12,
  `proyecto/02_analisis/17_validacion_tematico_1.md`.
- No cubre el paso 06 v2, que sigue GENERADO sin aprobar.
- Sin `human_review`.
