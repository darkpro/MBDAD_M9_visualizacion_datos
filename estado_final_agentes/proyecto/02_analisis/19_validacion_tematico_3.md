# Implementación del dashboard temático 3 (D4: cabina y calidad del dato)

ESTADO: APROBADO
PASO: 14
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 14
DOCUMENTOS SECUNDARIOS:
- proyecto/04_codigo/dashboard/datos.js (D4 y VISTAS con D4 implementada, FALTANTES y faltantes())
- proyecto/04_codigo/dashboard/app.js (vista D4: tarjetas, tres paneles de barras, filtro Cubierta, fix de ancho de panelBarras)
- proyecto/04_codigo/dashboard/index.html (título de vista y pie de los pasos 11-14)
- proyecto/04_codigo/dashboard/_check_datos.mjs (check runnable con los asserts de D4)
- proyecto/03_trazabilidad.csv (filas T14-01..T14-06)
APROBACIÓN DEL PASO 13: registrada en
`proyecto/02_analisis/18_validacion_tematico_2.md` (v1, APROBADO) con la
aprobación explícita del prompt del paso 14.

## 1. Autorización de este paso
Ejecutado con la autorización exclusiva del paso 14, que a la vez aprueba el
paso 13. Se implementa **solo el tema 3: D4 = cabina y calidad del dato**
(D10-01) sobre la infraestructura de los pasos 11-13, reutilizando los
componentes compartidos. **No se prepara la entrega final** y no se avanzó al
paso 15. Sin `human_review`.

## 2. Qué se implementó
Se extienden los archivos de los pasos 11-13 más el check; **sin dependencias
nuevas** (D3.js v7 sigue por CDN):

| Archivo | Rol | SHA256 |
| --- | --- | --- |
| `datos.js` | Añade `D4` (kpis `KPI-06`,`KPI-07`; barras `KPI-07`; filtros `Sex`,`Pclass`,`Embarked`,`Cubierta`; título-hallazgo), marca D4 en `VISTAS`, y añade `FALTANTES` y `faltantes(filas, filtros)` (barras de faltantes que `agregar()` no produce) | `D685C1F5D387E19774DE541C4397AC76B4876435E4744B1DB5DA21045768A4AF` |
| `app.js` | Añade `VISTA` con D4, `TITULO_KPI['KPI-06']`/`['KPI-07']`, `CAMPO_DE_KPI['KPI-07']='Cubierta'`, las constantes `ACENTO`/`NEUTROS`/`GRIS`, el panel de barras reutilizable `panelBarras` (refactor de `dibujarBarras`), `dibujarD4` (3 paneles), el guard de `drilldownKpi`, y las ramas D4 de `renderTarjetas`/`renderGraficos` más el estado vacío consciente de vista | `0951DACC6835815C91722B9E7C5002AEE6228BE209C04DBE531147544701B3CE` |
| `index.html` | Título, subtítulo y pie de los pasos 11-14 (mención de D4) | `46565F6BB8A33F1C143171E3257CD4A739F9FE7B5435EED2DAE7AA166EF63DBE` |
| `estilos.css` | Sin cambios (reutiliza `.tarjetas`, `.chips`, `svg rect.atenuada`) | `FDCE0EF1772140EBFD9757883A68D904BA5B224CB62690BD7202E1AF1A6703B6` |
| `_check_datos.mjs` | Añade los asserts de D4 (bloque §8) y el import de `faltantes`/`D4` | `1498402D194A51ECDE50022F36C6E8576161A40C6CEE1B0402E912C5AEC18E5A` |

D4 **no recalcula indicadores**: usa las filas `KPI-06` (cobertura de `Cabin`) y
`KPI-07` (tasa por `Cubierta`) que ya produce `agregar()` con las mismas
columnas de `11_indicadores.csv` (D10-02). Lo único que D4 añade por su cuenta
son las barras de faltantes (`faltantes()`), que `agregar()` no genera.

## 3. Cómo ejecutarlo
Desde la raíz del proyecto: `python -m http.server 8000` y abrir
`http://localhost:8000/proyecto/04_codigo/dashboard/index.html` (desde `file://`
el fetch del CSV falla por CORS). Check de datos: `node _check_datos.mjs` dentro
de `proyecto/04_codigo/dashboard/`.

## 4. Validación
`node _check_datos.mjs` → **`CHECK OK | asserts=211 | kpi_filas=24 | n=891`**
(211 asserts; el bloque D4 suma 53). Los 24 valores de `11_indicadores.csv` se
siguen reproduciendo sin filtros y las vistas ya construidas no se rompieron.

D4 publica **cobertura de `Cabin`** y **tasa por cubierta con la base declarada**
(D10-07). Cifras reproducidas de forma independiente contra el dataset:

- **KPI-06 `Cabin`** = 22.90 % (204/891); los 687 restantes son dato ausente.
- **KPI-07 `Cubierta`** (base 204, suma de grupos A-T = 204):

| grupo | numerador/denominador | valor_pct |
| --- | --- | --- |
| A | 7/15 | 46.67 |
| B | 35/47 | 74.47 |
| C | 35/59 | 59.32 |
| D | 25/33 | 75.76 |
| E | 24/32 | 75.00 |
| F | 8/13 | 61.54 |
| G | 2/4 | 50.00 |
| T | 0/1 | 0.00 |

- **`sin_cabin_ref`** = 206/687 = 29.99 %, mostrado como **referencia aparte,
  fuera de la base 204**.
- **Cobertura y faltantes**: `sin cabina` 687/891 = 77.10 %; faltantes
  `BanderaSinAge` 177/891, `BanderaSinCabin` 687/891, `BanderaSinEmbarked`
  2/891 (en % de la `n` vigente).

Validación en vivo (navegador sobre HTTP, vista D4, sin filtros): tres paneles
(cobertura, KPI-07 y faltantes); filtros de D4 = `Sexo`, `Clase`, `Embarque` y
`Cubierta` (8 opciones: Todos + A..G + T), y **D1 no muestra `Cubierta`**
(D10-02); tarjetas = `Cobertura de cabina 22.90 % 204/891`, `Cubierta D (mayor)
75.76 % 25/33`, `Cubierta A (menor) 46.67 % 7/15`, `n del filtro vigente 891`.
Barras `G` (n=4) y `T` (n=1) se dibujan atenuadas con la nota "no
interpretable" (D10-04); el resto lleva `numerador/denominador` rotulado
(D10-C02). Export CSV de D4 = 15 líneas
(2 cobertura + 9 KPI-07 + 3 faltantes + encabezado) y export SVG correcto
(`width=570`, `viewBox 0 0 570 524`, contenido máximo ≈549 < 570). Consola: solo
el `404` de `favicon.ico`; red 200 en index/estilos/d3/app/datos/CSV.

## 5. Reglas del paso 10 aplicadas
- **D10-01**: D4 = cabina y calidad del dato; usa KPI-06 y KPI-07 del paso 09.
- **D10-02**: filtros compartidos aplicados **antes** de agregar; el
  denominador se recalcula y se muestra la `n` vigente. D4 filtra por `Sex`,
  `Pclass`, `Embarked` y `Cubierta` (solo cubierta es exclusiva de D4).
- **D10-03**: eje de tasa fijo 0-100 %; color categórico; sin semáforos;
  **neutros** para cobertura y faltantes, **acento** para la tasa por cubierta.
- **D10-04**: `n=0` → estado vacío; `n<10` → barra atenuada + "no interpretable".
- **D10-05**: el enlace entre vistas es el mismo conjunto filtrado y los filtros
  se conservan al ir y volver.
- **D10-06**: drilldown por clic solo donde hay campo filtrable
  (`KPI-07 → Cubierta`); tooltip con las siete columnas de `11_indicadores.csv`,
  export CSV/SVG; sin backend.
- **D10-07**: KPI-06/KPI-07 sobre base 204 con `sin_cabin_ref` 206/687 = 29.99 %
  como referencia aparte, **fuera de la base**; `G`/`T` atenuadas.
- **D10-C01/C02**: el título de la vista enuncia el hallazgo y toda tasa lleva
  `numerador/denominador`.

## 6. Conexiones entre los cuatro dashboards
Con D4 implementada, los cuatro temáticos quedan navegables y comparten los
componentes. Se comprobó en vivo cada conexión exigida por el paso:

- **Selección** (router de hash D1-D4): las cuatro vistas entran y renderizan OK.
- **Filtros**: combinación Clase + Cubierta + Embarque + Sexo recalcula la `n` y
  el denominador (D10-02); el filtro `Cubierta` solo aparece en D4.
- **Reinicio** ("Limpiar"): borra solo los filtros de la vista actual y devuelve
  `n=891`.
- **Recarga / contexto entre vistas** (D10-05): con `Cubierta=D` (`n=33`) se pasa
  a D1 (sin chips, `n=891`) y al volver a D4 se **restaura** el chip y la `n=33`;
  limpiar deja los chips vacíos.
- **Drilldown**: clic sobre una barra de `KPI-07` (grupo `D`) fija
  `Cubierta='D'` y deja `n=33` (= 25/33 de KPI-07 D), con chip `Cubierta=D ×`;
  `sin_cabin_ref` no entra en la base.
- **Estado vacío** (D10-04): `Cubierta=A` + `Clase=3` no tiene casos
  (`A ∩ Pclass3 = 0`) y la vista muestra el estado vacío sin cifras inventadas.
- **Exportación**: CSV y SVG de D4 se descargan con el contenido de la vista.

## 7. Fix de layout de `panelBarras` (alcance sobre D1-D3)
El panel de barras nuevo se dimensionó con `viewBox` demasiado estrecho: con las
etiquetas de D4 (nota "no interpretable" incluida) **7 rótulos desbordaban** el
ancho de 460 px (el peor, `"50.0 % · n=4 (no interpretable)"`, medía 548.8 px).
Se ensanchó el lienzo a `w = 120 + 260 + 190 = 570` con `anchoBarra=260` y la
etiqueta en `x = 120 + anchoBarra + 12`. Resultado: **0 desbordes en las cuatro
vistas** (verificado con `getBBox` sobre los paneles: D1=3, D2=2, D3=2, D4=3) y
el SVG exportado cabe dentro del `viewBox`. El fix toca el componente compartido
`panelBarras`, así que **también corrige las vistas ya aprobadas D1-D3**: su
contenido y sus tasas no cambian, solo el ancho del lienzo y la posición de las
etiquetas.

## 8. Qué NO se implementó
- **Ningún filtro nuevo fuera de D4**: la regla D10-02 solo asigna `Cubierta` a
  D4; no se añadió un selector de `Cubierta` a D1-D3.
- **Entrega final / paso 15**: no se preparó nada de la entrega.
- **Imputación**: no se imputó `Age` (177), `Cabin` (687) ni `Embarked` (2); D4
  publica esos faltantes como faltantes.

## 9. Limitaciones
- Los filtros se conservan dentro de la sesión pero **no se serializan en la
  URL**: recargar vuelve a la vista inicial sin filtros.
- D3.js v7 se carga por CDN, así que la página necesita red; el fetch del CSV
  exige HTTP (no `file://`).
- `favicon.ico` devuelve `404`: único error de consola, cosmético y no
  bloqueante.
- La capa visual (colores, etiquetas, atenuación) se validó **manualmente** en el
  navegador; `_check_datos.mjs` cubre los datos, no el render.
- En D4, `G` (n=4) y `T` (n=1) quedan siempre por debajo de `UMBRAL_N=10`
  (atenuadas + "no interpretable") y `sin_cabin_ref` (n=687) es referencia, no
  grupo de la base 204. El estado "hay `n` pero ningún pasajero con cabina" no se
  oculta: se comunica con el panel de cobertura (0 %/100 %) y `sin_cabin_ref`; el
  texto de estado vacío solo cubre `n===0`.

## 10. Trazabilidad
Filas `T14-01..T14-06` en `proyecto/03_trazabilidad.csv` ligan cada requisito del
paso 14 (tercer temático, cifras de cobertura y base, filtros y denominador,
estados vacíos y umbral, drilldown/tooltip y contexto entre vistas) con su
evidencia y su código.

## 11. Estado
PASO 14 **APROBADO** (v1): D4 implementada y validada contra el paso 09 más las
cifras independientes de cobertura/cubierta (`asserts=211`). Aprobado por el
prompt del paso 15 (ver §12); no se aprobó nada del paso 15.

## 12. Aprobación de esta versión (historial)
- **VERSIÓN**: 1 (`19_validacion_tematico_3.md`, SHA256
  `9551133650363E5F6434FE5493D6B92A7B1400888610B985E47E8877145EEBDD`).
- **ESTADO**: APROBADO.
- **APROBADO CON**: el prompt del paso 15 (`/paso15`), que aprueba el paso 14 y
  autoriza exclusivamente el paso 15.
- **ALCANCE**: la vista **D4 v1** más los archivos de los pasos 11-13 extendidos
  por este paso, con los SHA256 vigentes de la §2:

| Archivo | SHA256 |
| --- | --- |
| `datos.js` | `D685C1F5D387E19774DE541C4397AC76B4876435E4744B1DB5DA21045768A4AF` |
| `app.js` | `0951DACC6835815C91722B9E7C5002AEE6228BE209C04DBE531147544701B3CE` |
| `index.html` | `46565F6BB8A33F1C143171E3257CD4A739F9FE7B5435EED2DAE7AA166EF63DBE` |
| `estilos.css` | `FDCE0EF1772140EBFD9757883A68D904BA5B224CB62690BD7202E1AF1A6703B6` |
| `_check_datos.mjs` | `1498402D194A51ECDE50022F36C6E8576161A40C6CEE1B0402E912C5AEC18E5A` |

  Cubre además las filas `T14-01..T14-06` de `proyecto/03_trazabilidad.csv`.
- **COMPROBACIÓN PREVIA**: `node _check_datos.mjs` →
  `CHECK OK | asserts=211 | kpi_filas=24 | n=891` (re-ejecutado antes de
  registrar esta aprobación).
- **NO CUBRE**: ningún resultado del paso 15; la entrega final queda pendiente
  de su propia revisión. El paso 06 v2 sigue GENERADO sin aprobar.
- Esta aprobación es un registro histórico: **no** se traslada a versiones
  posteriores ni desbloquea por sí sola el paso siguiente.
