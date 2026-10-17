# Decisiones de KPI (propuestas)

ESTADO: APROBADO
PASO: 08
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 08
DOCUMENTOS SECUNDARIOS: proyecto/02_analisis/06_hallazgos_exploratorios.md,
proyecto/02_analisis/07_propuesta_kpi.md, proyecto/04_codigo/08_exploratorio.py,
proyecto/03_trazabilidad.csv
ENTRADA: proyecto/01_dataset/Titanic-Dataset_enriquecido.csv (891 × 18,
SHA256 `6807462b…29d18`)
APROBACIÓN DEL PASO 07: registrada en
proyecto/02_analisis/05_analisis_enriquecimiento.md (v1, APROBADO) con la
aprobación explícita del prompt del paso 08.

## 0. Autorización de este paso
Ejecutado con la autorización exclusiva del paso 08, que a la vez aprueba el
paso 07. Las decisiones de abajo son **propuestas**: requieren la aprobación que
traerá el prompt del paso 09. No se implementó el cálculo definitivo ni se
construyeron dashboards. No se avanzó a ningún paso posterior.

## 1. Contexto
El análisis exploratorio (`06_hallazgos_exploratorios.md`) midió la
supervivencia global (38.38 %) y sus diferencias por `Sex`, `Pclass`,
`Embarked`, `TamanoFamilia`, `Titulo` y `Cubierta`, además de la estructura de
faltantes (`Age` 19.87 %, `Cabin` 77.10 %, `Embarked` 0.22 %) y varias
redundancias (`TamanoFamilia` ~ `SibSp`+`Parch`; `BanderaSinCabin` ~ `Pclass`).
A partir de eso se propone el catálogo de `07_propuesta_kpi.md`.

## 2. Decisiones propuestas
Formato: **ID — enunciado**. Evidencia (de dónde sale) y justificación (por
qué). Todas quedan sujetas a aprobación.

### D08-01 — Aprobar el catálogo de 7 KPI de `07_propuesta_kpi.md`
- **Evidencia**: hallazgos §2-§3; cobertura 22.90 % de `Cabin`.
- **Justificación**: cada KPI responde a O1-O5, tiene denominador explícito y no
  repite a otro. Se separan de las medidas no promovidas (§2 del catálogo) para
  no convertir toda medida en KPI.

### D08-02 — Agrupar `Titulo` en 4 macro-categorías
- **Enunciado**: para KPI-05, agrupar en **Mr / Mujer (Miss+Mrs) / Master /
  Otros**. “Otros” agrupa Dr, Rev, Major, Col, the Countess, Capt, Sir, Lady,
  Don, Jonkheer.
- **Evidencia**: títulos base con n≤7 y n=1-2 (hallazgos §3).
- **Justificación**: las tasas por título base son inestables (p. ej. `Rev` 0 %
  con n=6, títulos al 100 % con n=1); agrupar da grupos con n≥23. Resultado
  derivado: Mr 15.67 %, Mujer 73.95 %, Master 57.50 %, Otros 34.78 %.

### D08-03 — `Cubierta` y `BanderaSinCabin`: cobertura antes que análisis
- **Enunciado**: exponer siempre KPI-06 (cobertura `Cabin`) junto a KPI-07; no
  publicar tasas por `Cubierta` sin esa nota, y marcar `G`/`T` como no
  interpretables (n<10).
- **Evidencia**: solo 204/891 (22.90 %) tienen `Cabin`; nulo por clase 1 18.52 %,
  2 91.30 %, 3 97.56 %.
- **Justificación**: `Cubierta` describe un subgrupo sesgado hacia 1.ª clase; una
  tasa sin su cobertura se leería como si aplicara a los 891. No se imputa.

### D08-04 — No imputar `Age` ni `Cabin`
- **Enunciado**: mantener los faltantes; cualquier KPI con `Age` usa base 714 y
  lo declara.
- **Evidencia**: `Age` 177 nulos no aleatorios (clase 3: 27.70 %); `Cabin` 687.
- **Justificación**: imputar introduciría datos inexistentes (AGENTS.md); el
  nulo de `Cabin` además es informativo (sobreviven 29.99 % vs 66.67 %).

### D08-05 — No promover `Ticket`, `Name` ni `PassengerId` a KPI
- **Evidencia**: `PassengerId` es identificador; `Ticket` tiene 661/891 vacíos de
  prefijo y 29 prefijos heterogéneos; `Name` ya se resume en `Titulo`.
- **Justificación**: sin denominador estable ni significado de negocio; incluirlos
  sería ruido, no indicador.

### D08-06 — No fijar metas ni semáforos en este paso
- **Evidencia**: el prompt del paso 08 lo prohíbe.
- **Justificación**: este paso define qué medir y cómo, no contra qué umbral
  comparar. Metas/colores quedan para un paso posterior autorizado.

### D08-07 — `Fare == 0` (15 casos) queda como limitación documentada
- **Evidencia**: 15 pasajeros con `Fare==0` (5/6/4 por clase, todos hombres;
  1/15 sobrevivió).
- **Justificación**: parece tarifa no registrada, no un importe real; se
  documenta y se excluye de conclusiones sobre `Fare`, pero **no se corrige** en
  este paso (evita fabricar datos).

## 3. Decisiones no tomadas (deliberadamente)
- No se define el **orden de cálculo** de los indicadores ni su código: es el
  paso 09.
- No se decide **qué KPI van a qué dashboard**: es el paso 10.
- No se fijan metas, umbrales, comparaciones temporales ni colores.

## 4. Trazabilidad
Filas `T08-01..T08-08` en `proyecto/03_trazabilidad.csv` ligan cada KPI con su
pregunta (O2/O5), su evidencia (hallazgos) y su decisión (D08-*). El código del
paso 08 es solo lectura (`08_exploratorio.py`) y no calcula KPI definitivos.

## 5. Estado
PASO 08 **APROBADO** (v1) por el prompt del paso 09. 7 KPI y 7 decisiones
aprobados y ya implementados en el paso 09. La aprobación del paso 07 quedó
registrada en su documento principal. Sin `human_review`.

## 6. Aprobación de esta versión (v1)
**APROBADO** por el prompt del paso 09: *"Apruebo los resultados, los archivos y
las decisiones de la versión revisada del PASO 08. Autorizo exclusivamente el
PASO 09."* Cubre el documento principal (v1), `06_hallazgos_exploratorios.md`,
`07_propuesta_kpi.md`, `08_exploratorio.py` y las filas `T08-01..T08-08` de la
trazabilidad. Se registró tras comprobar que existían los resultados del paso 09
y que sus 33 comprobaciones pasaban.

**Errata corregida en esta misma versión (v1, sin incrementar VERSION)**: la
sección 4 decía "Filas `T08-01..T08-07`" cuando en la trazabilidad existen
`T08-01..T08-08`. Se corrigió a `T08-01..T08-08`. No cambia ninguna decisión ni
resultado.
