# Validación y comunicación final de la entrega

ESTADO: GENERADO
PASO: 15
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 15
DOCUMENTOS SECUNDARIOS:
- proyecto/02_analisis/20_comunicacion_final.md (hallazgos, limitaciones, audiencia y narrativa entre vistas)
- proyecto/03_trazabilidad.csv (filas T15-01..T15-07)
APROBACIÓN DEL PASO 14: registrada en
`proyecto/02_analisis/19_validacion_tematico_3.md` (v1, APROBADO) con la
aprobación explícita del prompt del paso 15.

## 1. Autorización de este paso
Ejecutado con la autorización exclusiva del paso 15, que a la vez aprueba el
paso 14. Se **valida y comunica** la entrega ya construida; no se añade
funcionalidad ni se corrigen datos. **No se publica ni se entrena nada**. La
aceptación final se registra cuando el usuario envíe el mensaje de cierre
descrito en `AGENTS.md`. Sin `human_review`.

## 2. Alcance de la validación
Comprobación de extremo a extremo de la cadena:

```
original (Titanic-Dataset.csv)
  → depurado (Titanic-Dataset_clean.csv)
  → procesado (Titanic-Dataset_etl.csv)
  → enriquecido (Titanic-Dataset_enriquecido.csv)
  → indicadores (11_indicadores.csv, 12_indicadores_verificaciones.csv)
  → cuatro dashboards (D1, D2, D3, D4)
```

Se contrastan cifras y filtros con cálculos independientes (recuento manual sin
`pandas`), se revisan escalas, textos, incertidumbres, calidad, cobertura,
exportación, navegación y accesibilidad básica, y se separa lo **probado** de lo
**no comprobado**.

## 3. Artefactos verificados y SHA256
| Artefacto | Rol | SHA256 (vigente) |
| --- | --- | --- |
| `proyecto/01_dataset/Titanic-Dataset.csv` | original 891×12 | `7d118fef…` |
| `proyecto/01_dataset/Titanic-Dataset_clean.csv` | depurado 891×12 | `cf59b3ab…` |
| `proyecto/01_dataset/Titanic-Dataset_etl.csv` | procesado 891×12 | `cf59b3ab…` |
| `proyecto/01_dataset/Titanic-Dataset_enriquecido.csv` | enriquecido 891×18 | `6807462B8BC25C05DC9DB39BC0DB7ADABC63F964179BF2BB83BE3A1E07129D18` |
| `proyecto/02_analisis/11_indicadores.csv` | 24 KPI tabulados | `77D7F34E2F9A5FD2EC2C10D690474C233620E74A055CA9BBEB1CA27DB68724E4` |
| `proyecto/04_codigo/dashboard/datos.js` | módulo de datos y agregación | `D685C1F5D387E19774DE541C4397AC76B4876435E4744B1DB5DA21045768A4AF` |
| `proyecto/04_codigo/dashboard/app.js` | router y cuatro vistas | `0951DACC6835815C91722B9E7C5002AEE6228BE209C04DBE531147544701B3CE` |
| `proyecto/04_codigo/dashboard/index.html` | shell | `46565F6BB8A33F1C143171E3257CD4A739F9FE7B5435EED2DAE7AA166EF63DBE` |
| `proyecto/04_codigo/dashboard/estilos.css` | estilos | `FDCE0EF1772140EBFD9757883A68D904BA5B224CB62690BD7202E1AF1A6703B6` |
| `proyecto/04_codigo/dashboard/_check_datos.mjs` | check runnable | `1498402D194A51ECDE50022F36C6E8576161A40C6CEE1B0402E912C5AEC18E5A` |
| `proyecto/03_trazabilidad.csv` | trazabilidad | `E8389D80D4A6D810B7C693FCA22278B296490C05351F1D6723F52D7C0D8C2ADA` |

## 4. Verificación reproducible de extremo a extremo
### 4.1 Cadena de datos
Cada etapa conserva la unidad de análisis (un pasajero por fila) y las 891
filas; los scripts abortan si cambia el SHA de su entrada:

- `Titanic-Dataset.csv`: 891 filas × 12 columnas (`7d118fef…`).
- `Titanic-Dataset_clean.csv`: 891 × 12 (`cf59b3ab…`).
- `Titanic-Dataset_etl.csv`: 891 × 12 (`cf59b3ab…`).
- `Titanic-Dataset_enriquecido.csv`: 891 × 18 (`6807462b…`) con las columnas
  nuevas (título, tamaño de familia, cubierta y banderas de faltantes).

### 4.2 Indicadores
`node _check_datos.mjs` dentro de `proyecto/04_codigo/dashboard/` →
**`CHECK OK | asserts=211 | kpi_filas=24 | n=891`**. Las 24 filas de
`11_indicadores.csv` se reproducen sin filtros y las 33 verificaciones
`C-01..C-33` de `12_indicadores_verificaciones.csv` siguen en pie.

### 4.3 Contraste con cálculos independientes
Recuento manual (sin `pandas`) sobre el dataset enriquecido → `RESULT: OK`,
`mismatches=0`:

- **24/24 filas KPI** reproducidas exactamente.
- **Faltantes**: `BanderaSinAge` 177/891 = 19.87 %; `BanderaSinCabin` 687/891 =
  77.10 %; `BanderaSinEmbarked` 2/891 = 0.22 %.
- **Cruce D2 (Sexo × Clase)**: female/1 91/94 = 96.81; female/2 70/76 = 92.11;
  female/3 72/144 = 50.00; male/1 45/122 = 36.89; male/2 17/108 = 15.74;
  male/3 47/347 = 13.54.
- **D4, filtro `Cubierta=A`**: n=15, `sinCab` en el grupo = 0.
- **Estado vacío**: `Cubierta=A` y `Pclass=3` → n=0 (`A ∩ Pclass3 = 0`).

### 4.4 Cifras de la vista D4
- **KPI-06 `Cabin`** = 204/891 = 22.90 % (los 687 restantes son dato ausente).
- **KPI-07 `Cubierta`** (base 204; suma A–T = 204): A 7/15 = 46.67, B 35/47 =
  74.47, C 35/59 = 59.32, D 25/33 = 75.76, E 24/32 = 75.00, F 8/13 = 61.54,
  G 2/4 = 50.00, T 0/1 = 0.00.
- **`sin_cabin_ref`** = 206/687 = 29.99 %, mostrado como **referencia aparte,
  fuera de la base 204** (D10-07).

## 5. Validación en vivo de los cuatro dashboards
Servidos por HTTP (`python -m http.server 8000`); navegadas D1–D4 por el router
de hash. Titulares observados (enuncian el hallazgo, D10-C01):

- **D1 (Resumen)**: "342 de 891 pasajeros sobrevivieron (38.38 %)". 4 tarjetas,
  filtros `Sexo/Clase/Embarque/Tamaño familia`, chip "Limpiar", 3 paneles.
- **D2 (Sexo y clase)**: "La brecha por sexo se mantiene en las tres clases (de
  36.46 a 76.37 pp)". 2 paneles.
- **D3 (Familia y título)**: "El título separa más que el tamaño: de 15.67 %
  (Mr) a 73.95 % (Mujer)". 2 paneles.
- **D4 (Cabina y calidad)**: "Solo el 22.90 % del pasaje tiene cabina
  registrada". 3 paneles (cobertura, KPI-07 y faltantes).

Comprobado además: el filtro `Cubierta` **solo aparece en D4** (D10-02);
combinar filtros recalcula la `n` y el denominador; "Limpiar" devuelve
`n=891`; **persistencia entre vistas** (con `Cubierta=D`, `n=33`, se pasa a D1 y
al volver a D4 se restaura el chip y `n=33`, D10-05); **drilldown** sobre la
barra de `KPI-07 D` fija `Cubierta='D'` con `n=33` (= 25/33), sin incluir
`sin_cabin_ref` en la base; `G` (n=4) y `T` (n=1) se dibujan atenuadas con "no
interpretable" (D10-04); `Cubierta=A` + `Clase=3` muestra el estado vacío sin
cifras inventadas. **Escalas**: eje de tasa fijo 0–100 % (D10-03). **Export**:
CSV de D4 = 15 líneas (encabezado + 2 cobertura + 9 KPI-07 + 3 faltantes); SVG
`width=570`, `viewBox 0 0 570 524`, **0 desbordes** en las cuatro vistas.
**Consola/red**: sin errores JS; todas las peticiones `200` salvo
`favicon.ico` (`404`).

### 5.1 Accesibilidad básica
Los cuatro selectores de filtro son elementos `SELECT` asociados a su
`<label>` envolvente (los 4 tienen `parent = LABEL`), pero **ninguno lleva
`id`, `name` ni `aria-label`**; el reportero de "issues" del navegador lo señala
como aviso de buena práctica (no error ni bloqueo de teclado/lector). El único
error de consola es el `404` de `favicon.ico`, cosmético. Se registra como
limitación, **no** como `CHANGES_REQUIRED`.

## 6. Guía de ejecución del código (extremo a extremo)
Los scripts resuelven sus rutas relativas a su propia ubicación
(`Path(__file__).parents[1]`), así que pueden lanzarse desde cualquier
directorio. Orden:

```
# 1) Cadena de datos (regenera las salidas en proyecto/01_dataset/)
python proyecto/04_codigo/03_depuracion.py
python proyecto/04_codigo/05_etl.py
python proyecto/04_codigo/07_enriquecimiento.py

# 2) Exploración y KPI (regenera 11_indicadores.csv y 12_indicadores_verificaciones.csv)
python proyecto/04_codigo/08_exploratorio.py
python proyecto/04_codigo/09_indicadores.py

# 3) Dashboards (desde la raíz del proyecto)
python -m http.server 8000
#   abrir http://localhost:8000/proyecto/04_codigo/dashboard/index.html

# 4) Check runnable de datos (desde proyecto/04_codigo/dashboard/)
node _check_datos.mjs
```

> **Observación**: el repositorio **no incluye un `README.md` ni una guía de
> ejecución independiente**. Los comandos viven dentro de cada documento de
> validación (`16_`, `17_`, `18_`, `19_`, `21_`) y se consolidan aquí. El
> mensaje de cierre de la entrega se describe en `AGENTS.md`, no en un README.
> No se creó un README: no estaba pedido (ponytail/YAGNI). Si se desea, se
> puede promover esta §6 a `README.md` en un paso propio.

## 7. Hallazgos (síntesis)
1. **Sexo** es el eje más discriminante: la brecha mujeres/hombres se sostiene
   en las tres clases (D2).
2. **Título** separa más que el **tamaño de familia** dentro de la misma
   variable (D3).
3. La **cobertura de cabina** es baja: solo 22.90 % (204/891) tiene cabina
   registrada; los 687 restantes son **dato ausente**, no un grupo (D4).
4. La supervivencia por **cubierta** varía (46.67 %–75.76 %) sobre una base
   pequeña (204), con `G`/`T` no interpretables (n<10).

Narrativa completa y audiencia objetivo en `20_comunicacion_final.md`.

## 8. Limitaciones e incertidumbres
- **Sin imputación**: `Age` (177), `Cabin` (687) y `Embarked` (2) se publican
  como faltantes; las tasas son sobre casos observados, no sobre el total.
- **Base pequeña en D4**: `G` (n=4) y `T` (n=1) siempre por debajo del umbral de
  10; `sin_cabin_ref` (n=687) es referencia, no grupo de la base 204. El estado
  "hay `n` pero ningún pasajero con cabina" se comunica con el panel de
  cobertura y `sin_cabin_ref`; el texto de estado vacío solo cubre `n=0`.
- **Filtros no serializados en la URL**: se conservan dentro de la sesión
  (D10-05) pero recargar vuelve a la vista inicial sin filtros.
- **Dependencia de red y HTTP**: D3.js v7 llega por CDN y el `fetch` del CSV
  exige HTTP (desde `file://` falla por CORS).
- **`favicon.ico` 404**: único error de consola, cosmético.
- **Accesibilidad de filtros**: los `SELECT` no llevan `id`/`name`/`aria-label`
  (sí `label` envolvente); aviso de buena práctica, no bloqueante.
- **Alcance del Titanic**: los hallazgos son del dataset de ejemplo; el
  pipeline es genérico y no entrena modelos.

## 9. Probado vs no comprobado
**Probado** (con evidencia reproducible): la cadena de datos (4 etapas, 891
filas, SHA intactos); los 24 KPI y 33 verificaciones; el contraste independiente
de las 24 filas y de las cifras de D4; el render de las cuatro vistas, filtros,
persistencia, drilldown, estados vacíos/atenuados y export CSV/SVG; el check
runnable (`asserts=211`).

**No comprobado** (fuera de alcance o manual): la capa de dibujo se valida
abriendo la página, no con test automatizado; la accesibilidad se limita a una
revisión básica (sin auditoría de lector de pantalla); no hay pruebas de
rendimiento con volúmenes mayores ni en otros navegadores; no se probó con
datasets distintos del Titanic.

## 10. Discrepancias con decisiones
Ninguna discrepancia funcional: se cumplen D10-01…D10-08 y D10-C01/C02. Se
registran como **observaciones**, no como incumplimientos:

- **Ausencia de `README.md`/guía de ejecución separada** (ver §6).
- **Accesibilidad de filtros** sin `id`/`name`/`aria-label` (ver §5.1), que
  D10-C01 no exigía y no bloquea.
- **`03_trazabilidad.csv` es CSV válido**: las 4 filas con comas internas
  entrecomilladas (`T01-05`, `T01-09`, `T03-06`, `T10-04`) se interpretan como
  **10 campos** por un analizador CSV correcto (el conteo por coma cruda las ve
  como 11–12). Se dejan como están: no son un defecto ni afectan a la validación.

## 11. Trazabilidad
Filas `T15-01..T15-07` en `proyecto/03_trazabilidad.csv` ligan cada requisito
del paso 15 (cadena de extremo a extremo, contraste independiente, escalas y
textos, calidad/cobertura, navegación y exportación, accesibilidad básica y
distinción probado/no comprobado con guía) con su evidencia y su código.

El archivo creció de 99 líneas (encabezado + 98 filas, T01..T14) a 106
líneas (encabezado + 105 filas, T01..T15); el SHA256 pasó de
E6570F07…DA5F (previo) al vigente E8389D80…C2ADA, con LF, UTF-8 sin
BOM y 10 campos en las 106 filas.

## 12. Estado
PASO 15 **GENERADO** (v1): entrega validada de extremo a extremo y comunicada.
Todos los números de la cadena, los indicadores y las cuatro vistas se
reproducen con evidencia independiente (`asserts=211`, `mismatches=0`). Sin
fallos bloqueantes: **no** se declara `REQUIERE_CAMBIOS`. Pendiente la
aceptación final del usuario (mensaje de cierre descrito en `AGENTS.md`); no se
avanza a ningún paso posterior ni se publica nada.
