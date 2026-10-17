# Propuesta de catálogo de KPI

ESTADO: GENERADO
PASO: 08
VERSION: 1
DOCUMENTO PRINCIPAL DE: no (el principal del paso 08 es
proyecto/03_decisiones/05_decisiones_kpi.md)
DOCUMENTOS RELACIONADOS: proyecto/02_analisis/06_hallazgos_exploratorios.md
(hallazgos), proyecto/03_decisiones/05_decisiones_kpi.md (decisión propuesta),
proyecto/04_codigo/08_exploratorio.py
ENTRADA: proyecto/01_dataset/Titanic-Dataset_enriquecido.csv (891 × 18,
SHA256 `6807462b…29d18`)

## 0. Alcance
Este documento **propone** indicadores; no los implementa y **no fija metas ni
semáforos**. Cada KPI se liga a una pregunta/objetivo, se define con fórmula,
unidad, numerador/denominador, tratamiento de faltantes, filtros, granularidad
y una comprobación mínima. Se separan los **KPI propuestos** de las **medidas
no promovidas** (útiles para un dashboard pero que no son KPI). Sujetos a la
aprobación que traerá el prompt del paso 09.

Criterio de promoción: un KPI debe (a) responder a un objetivo O1-O5, (b) tener
denominador claro y estable, y (c) no ser mera repetición de otro. Medidas con
celdas pequeñas o sin denominador defendible quedan en la sección 3.

## 1. KPI propuestos

### KPI-01 — Tasa de supervivencia global
- **Significado**: proporción de pasajeros que sobrevivieron. Línea base.
- **Pregunta/objetivo**: O2. **Fórmula**: `sum(Survived) / count(*)`.
- **Unidad**: % (0-100). **Num/Den**: `Survived==1` / todos los pasajeros.
- **Faltantes**: ninguno (`Survived` sin nulos). **Filtros**: ninguno.
- **Granularidad**: global. **Valor de referencia medido**: 38.38 % (342/891).
- **Comprobación**: `sum(Survived)` == 342 y `n` == 891 en la salida enriquecida.

### KPI-02 — Tasa de supervivencia por sexo
- **Significado**: supervivencia por `Sex`, con la **brecha** en puntos
  porcentuales. **Objetivo**: O2. **Fórmula**: por grupo,
  `sum(Survived) / count(*)`; brecha = `tasa(female) − tasa(male)`.
- **Unidad**: % y pp. **Num/Den**: por grupo (314 female, 577 male).
- **Faltantes**: `Sex` sin nulos. **Filtros**: ninguno.
- **Granularidad**: `Sex`. **Medido**: female 74.20 %, male 18.89 %,
  brecha ≈ 55.3 pp.
- **Comprobación**: n(female)+n(male) == 891; brecha == 74.20 − 18.89.

### KPI-03 — Tasa de supervivencia por clase
- **Significado**: supervivencia por `Pclass`; proxy socioeconómico dentro de
  los datos. **Objetivo**: O1/O2/O3. **Fórmula**: por grupo,
  `sum(Survived) / count(*)`.
- **Unidad**: %. **Num/Den**: por clase (216/184/491).
- **Faltantes**: `Pclass` sin nulos. **Filtros**: ninguno.
- **Granularidad**: `Pclass` ∈ {1,2,3}. **Medido**: 62.96 % / 47.28 % / 24.24 %.
- **Comprobación**: suma de n == 891; orden 1>2>3 (monótono).

### KPI-04 — Tasa de supervivencia por grupo de tamaño familiar
- **Significado**: supervivencia según `TamanoFamilia` **agrupado** en 1 / 2-4
  / 5+, para evitar celdas pequeñas. **Objetivo**: O2.
- **Fórmula**: por grupo, `sum(Survived) / count(*)`.
- **Unidad**: %. **Num/Den**: por grupo (537 / 292 / 62).
- **Faltantes**: `TamanoFamilia` sin nulos. **Filtros**: ninguno.
- **Granularidad**: grupos {1, 2-4, 5+}. **Medido**: 30.35 % / 57.88 % /
  16.13 %.
- **Comprobación**: suma de n == 891 y coincide con `SibSp + Parch + 1`.

### KPI-05 — Tasa de supervivencia por título normalizado (agrupado)
- **Significado**: `Titulo` agrupado en 4 macro-categorías con n suficiente:
  **Mr** / **Mujer** (Miss+Mrs) / **Master** / **Otros**. Evita tasas sobre
  n≤7. **Objetivo**: O2.
- **Fórmula**: por grupo, `sum(Survived) / count(*)`. Grupos derivados por
  mapeo explícito (documentado en la decisión D08-02).
- **Unidad**: %. **Num/Den**: por grupo (Mr 517; Mujer 311; Master 40; Otros
  23). **Faltantes**: `Titulo` sin nulos. **Filtros**: ninguno.
- **Granularidad**: 4 macro-categorías. **Medido** (derivado de los títulos
  base): Mr 15.67 %; Miss+Mrs (130+100)/(185+126) = **73.95 %**; Master 57.50 %;
  Otros 8/23 = **34.78 %**.
- **Comprobación**: Mr 517 + Mujer 311 + Master 40 + Otros 23 == 891 y cada
  grupo se compone de títulos base contables.

### KPI-06 — Cobertura de `Cabin` conocido
- **Significado**: fracción de pasajeros con `Cabin` registrado; mide la
  fiabilidad de cualquier análisis por cubierta. **Objetivo**: O5.
- **Fórmula**: `count(Cabin no nulo) / count(*)` = `1 − mean(BanderaSinCabin)`.
- **Unidad**: %. **Num/Den**: 204 / 891.
- **Faltantes**: es un KPI **sobre** faltantes (nulo = no registrado).
  **Filtros**: ninguno. **Medido**: 22.90 %.
- **Comprobación**: `sum(BanderaSinCabin)` == 687 y 891 − 687 == 204.

### KPI-07 — Tasa de supervivencia por cubierta (cobertura parcial)
- **Significado**: supervivencia por `Cubierta`, **solo sobre los 204 con
  dato**; se publica siempre junto a KPI-06. **Objetivo**: O5.
- **Fórmula**: por cubierta, `sum(Survived) / count(*)`.
- **Unidad**: %. **Num/Den**: por cubierta, base 204 (no 891).
- **Faltantes**: los 687 sin `Cabin` **no entran** en el denominador; se
  reportan aparte como grupo de referencia (29.99 %).
- **Filtros**: `Cabin` no nulo. **Granularidad**: `Cubierta` ∈ {A..G, T}.
- **Medido**: B 74.47 %, D 75.76 %, E 75.00 %, C 59.32 %, F 61.54 %, A 46.67 %,
  G 50 % (n=4), T 0 % (n=1).
- **Comprobación**: suma de n por cubierta == 204; celdas con n<10 (G, T)
  marcadas como no interpretables.

## 2. Medidas no promovidas (para dashboard, no KPI)
- **Supervivencia por puerto (`Embarked`)**: útil (C 55.36 %, Q 38.96 %,
  S 33.70 %) pero muy ligada a `Pclass`; se expone como contexto, no como KPI
  independiente. El grupo nulo (n=2) se excluye.
- **Supervivencia por `BanderaSinAge`** (29.38 % vs 40.62 %): informativa de
  sesgo de faltante; no es KPI de negocio.
- **`Fare` mediano por clase** (60.29 / 14.25 / 8.05) y **`Fare` mediano
  global** (14.45): medidas de apoyo a O3, no KPI.
- **Distribución de `Age`** (media 29.70, mediana 28, IQR 20.12–38) y de
  `SibSp`/`Parch`: descriptores, no KPI.
- **Tasas por `Titulo` base** y por `TamanoFamilia` exacto: **rechazadas como
  KPI** por celdas pequeñas; sustituidas por KPI-05 y KPI-04.

## 3. Reglas transversales
- Todo KPI con faltantes declara su denominador y su cobertura; los nulos no se
  imputan (no se inventan valores).
- Los porcentajes se redondean a 2 decimales; el redondeo no altera
  numeradores/denominadores que se publican enteros.
- No se fijan metas, umbrales ni colores: eso corresponde a un paso posterior
  con autorización del usuario.
- Cada KPI se liga a un objetivo (O1-O5) y a una fila de trazabilidad (`T08-*`).

## 4. Estado
PASO 08 **GENERADO** (v1). Catálogo de **7 KPI propuestos** + medidas no
promovidas. Sin implementación ni metas. Pendiente de aprobación (prompt del
paso 09) y de resolución de las decisiones D08-* en `05_decisiones_kpi.md`.
