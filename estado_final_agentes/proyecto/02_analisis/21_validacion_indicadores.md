# Validación de indicadores (implementación)

ESTADO: APROBADO
PASO: 09
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 09
DOCUMENTOS SECUNDARIOS:
- proyecto/04_codigo/09_indicadores.py (código de cálculo)
- proyecto/02_analisis/11_indicadores.csv (24 filas de KPI)
- proyecto/02_analisis/12_indicadores_verificaciones.csv (33 comprobaciones)
- proyecto/03_trazabilidad.csv (filas T09-01..T09-09)
ENTRADA: proyecto/01_dataset/Titanic-Dataset_enriquecido.csv
(891 × 18, SHA256 `6807462b8bc25c05dc9db39bc0db7adabc63f964179bf2bb83be3a1e07129d18`)
APROBACIÓN DEL PASO 08: registrada en
proyecto/03_decisiones/05_decisiones_kpi.md (v1, APROBADO) con la aprobación
explícita del prompt del paso 09.

## 0. Autorización de este paso
Ejecutado con la autorización exclusiva del paso 09, que a la vez aprueba el
paso 08. Se implementaron **solo los indicadores acordados** en el catálogo
`07_propuesta_kpi.md` (D08-01), sin metas ni semáforos (D08-06). No se
construyeron dashboards ni se avanzó a ningún paso posterior.

## 1. Alcance implementado
7 KPI del catálogo aprobado, sin añadir ni retirar ninguno:

| KPI | Variable | Definición |
|---|---|---|
| KPI-01 | global | supervivencia global 342/891 |
| KPI-02 | `Sex` | tasa por sexo + brecha en puntos porcentuales |
| KPI-03 | `Pclass` | tasa por clase |
| KPI-04 | `TamanoFamilia` | tramos 1 / 2-4 / 5+ (desde `SibSp+Parch+1`) |
| KPI-05 | `Titulo` | macro-categorías Mr / Mujer (Miss+Mrs) / Master / Otros (D08-02) |
| KPI-06 | `Cabin` | cobertura 204/891 = 22.90 % (D08-03) |
| KPI-07 | `Cubierta` | tasa sobre base 204 + referencia sin `Cabin` (687) |

## 2. Fórmula y convenciones
- Tasa = `100 * numerador / denominador`, redondeada a 2 decimales.
- `tasa(n, 0)` devuelve `None` (no divide por cero); un grupo sin filas no
  produce fila.
- Sin imputación: `Age` (177 nulos), `Cabin` (687) y `Embarked` (2) se
  conservan vacíos (D08-04). El script aborta si cambia el SHA256 de entrada.
- KPI-04 se calcula desde `SibSp + Parch + 1` (no desde la columna derivada),
  como comprobación cruzada de `ER-02`.
- `numerador`/`denominador` se emiten como enteros (`Int64`; vacío cuando no
  aplica, p. ej. la fila de brecha).

## 3. Resultados (`11_indicadores.csv`, 24 filas)
| KPI | grupo | num | den | valor_pct | nota |
|---|---|---|---|---|---|
| KPI-01 | todos | 342 | 891 | 38.38 | línea base |
| KPI-02 | female | 233 | 314 | 74.20 | |
| KPI-02 | male | 109 | 577 | 18.89 | |
| KPI-02 | brecha_female-male | | | 55.31 | puntos porcentuales |
| KPI-03 | 1 | 136 | 216 | 62.96 | |
| KPI-03 | 2 | 87 | 184 | 47.28 | |
| KPI-03 | 3 | 119 | 491 | 24.24 | |
| KPI-04 | 1 | 163 | 537 | 30.35 | |
| KPI-04 | 2-4 | 169 | 292 | 57.88 | |
| KPI-04 | 5+ | 10 | 62 | 16.13 | |
| KPI-05 | Mr | 81 | 517 | 15.67 | |
| KPI-05 | Mujer | 230 | 311 | 73.95 | Miss+Mrs |
| KPI-05 | Master | 23 | 40 | 57.50 | |
| KPI-05 | Otros | 8 | 23 | 34.78 | 10 títulos raros |
| KPI-06 | cobertura | 204 | 891 | 22.90 | 687 sin dato |
| KPI-07 | A | 7 | 15 | 46.67 | |
| KPI-07 | B | 35 | 47 | 74.47 | |
| KPI-07 | C | 35 | 59 | 59.32 | |
| KPI-07 | D | 25 | 33 | 75.76 | |
| KPI-07 | E | 24 | 32 | 75.00 | |
| KPI-07 | F | 8 | 13 | 61.54 | |
| KPI-07 | G | 2 | 4 | 50.00 | n<10: no interpretable |
| KPI-07 | T | 0 | 1 | 0.00 | n<10: no interpretable |
| KPI-07 | sin_cabin_ref | 206 | 687 | 29.99 | referencia: no entra en la base 204 |

## 4. Comprobaciones independientes (`12_indicadores_verificaciones.csv`, 33 checks, todos OK)
- **Totalizaciones de denominador**: C-02/C-04/C-07/C-13/C-14 suman 891.
- **Recálculo por vía alterna**: KPI-04 desde `SibSp+Parch+1` (C-10..C-12);
  KPI-05 `Mujer = Miss+Mrs` y numerador 130+100 (C-15/C-16); KPI-06 desde
  `Cabin` no nulo (C-19/C-21).
- **Fórmula**: KPI-01 y KPI-03 recalculados a mano (C-03/C-09/C-17/C-18).
- **Monotonía** de KPI-03 (C-08).
- **Faltantes sin imputar**: C-26 (Age 177), C-27 (Cabin 687), C-28 (Embarked 2).
- **Denominador cero**: C-29 ningún KPI con denominador 0; C-30 `tasa()` con
  denominador 0 = `None`; C-31 grupo vacío → 0 filas.
- **Filtros de ejemplo**: C-32 `Pclass=1 & female` n=94; C-33 tasa 91/94 =
  96.81 (confirmado además por vía independiente fuera del script).
- **Cobertura parcial**: C-23 la base de KPI-07 (204) no cubre los 891;
  C-25 celdas con n<10 marcadas.

Salida de la ejecución: `INDICADORES OK | kpi_filas=24 checks=33`.

## 5. Faltantes y límites
- `Age` 177, `Cabin` 687 y `Embarked` 2 siguen sin imputar; ningún KPI de este
  paso usa `Age`, así que no hay base 714 que declarar aquí.
- KPI-07 se apoya en 204/891 (22.90 %); `G` (n=4) y `T` (n=1) no son
  interpretables y se marcan como tales. La fila `sin_cabin_ref` describe a los
  687 sin `Cabin` (29.99 %) y **no** pertenece a la base del indicador.
- `Fare == 0` (15 casos) queda como limitación documentada (D08-07); no se
  corrige ni se usa en ningún KPI de este paso.

## 6. Trazabilidad
Filas `T09-01..T09-09` en `proyecto/03_trazabilidad.csv` ligan cada KPI con su
pregunta, su evidencia (`11_indicadores.csv`) y las comprobaciones que lo
respaldan (`12_indicadores_verificaciones.csv`). El código es
`proyecto/04_codigo/09_indicadores.py`.

## 7. Estado
PASO 09 **APROBADO** (v1) por el prompt del paso 10. 7 KPI implementados y 33
comprobaciones independientes en verde. La aprobación del paso 08 quedó
registrada en su documento principal. Sin `human_review`.

## 8. Aprobación de esta versión (v1)
**APROBADO** por el prompt del paso 10: *"APROBACION EXPLICITA DEL USUARIO:
Apruebo los resultados, los archivos y las decisiones de la versión revisada
del PASO 09. Autorizo exclusivamente el PASO 10."* Cubre el documento principal
(v1), `09_indicadores.py`, `11_indicadores.csv`, `12_indicadores_verificaciones.csv`
y las filas `T09-01..T09-09` de la trazabilidad. Se registró tras comprobar que
los tres artefactos existen en disco y que sus SHA256 coinciden con los
declarados (`EB528800…DC7D66`, `77D7F34E…8724E4`, `B7FE8BD5…AB23B`) y que la
ejecución reportó `checks=33` sin fallos.
