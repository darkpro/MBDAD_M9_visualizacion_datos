# Decisiones del ETL

ESTADO: GENERADO
PASO: 04
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 04
DOCUMENTOS SECUNDARIOS: proyecto/02_analisis/04_analisis_etl.md,
proyecto/03_trazabilidad.csv
INSUMOS: proyecto/01_dataset/Titanic-Dataset_clean.csv (paso 03 v1),
proyecto/03_decisiones/01_decisiones_datos.md (v1),
proyecto/03_decisiones/02_decision_tecnologica.md (v1)
APROBACIÓN REGISTRADA: pendiente (generado por autorización para completar; NO es aprobación)

## Contexto
Una única fuente ya depurada (891×12). El ETL mueve esa base a un artefacto
analítico local, sin enriquecer ni calcular KPI (reservado a los pasos 06–09).

## Decisiones

### ETL-01 — Sin base de datos
- **Problema:** ¿se necesita un motor de BD para el ETL?
- **Evidencia:** 891 filas, una sola tabla, sin concurrencia ni volumen.
- **Acción:** no introducir BD. Carga local a archivo plano.
- **Validación:** la salida es un CSV reabrible con `pandas.read_csv`.

### ETL-02 — Sin uniones
- **Problema:** ¿hay que integrar varias fuentes?
- **Evidencia:** el inventario del paso 01 registra un solo archivo de datos.
- **Acción:** no definir claves de unión ni joins.
- **Validación:** el conteo de filas se mantiene en 891 (sin multiplicación ni pérdida).

### ETL-03 — Entrada y salida
- **Entrada:** `proyecto/01_dataset/Titanic-Dataset_clean.csv` (paso 03 v1).
- **Salida:** `proyecto/01_dataset/Titanic-Dataset_etl.csv`.
- **Validación:** ambos artefactos existen y se registran sus hashes.

### ETL-04 — Esquema y contrato de tipos
12 columnas, mismo orden del original: `PassengerId, Survived, Pclass, Name, Sex,
Age, SibSp, Parch, Ticket, Fare, Cabin, Embarked`.
| Columna | Tipo | Nulo permitido |
|---|---|---|
| PassengerId | Int64 | No (clave) |
| Survived | Int64 {0,1} | No |
| Pclass | Int64 {1,2,3} | No |
| Name | string | No |
| Sex | string {male,female} | No |
| Age | float | Sí (177) |
| SibSp | Int64 | No |
| Parch | Int64 | No |
| Ticket | string | No |
| Fare | float | Sí |
| Cabin | string | Sí (687) |
| Embarked | string {C,Q,S} | Sí (2) |

### ETL-05 — Unidad y granularidad
- **Acción:** 1 fila = 1 pasajero. `PassengerId` clave técnica.
- **Validación:** 891 filas y 891 PassengerId únicos tras el ETL.

### ETL-06 — Controles de cardinalidad
- **Acción:** verificar 891 filas, 12 columnas, 0 duplicados, dominios estables
  (`Survived`, `Pclass`, `Sex`, `Embarked`) y nulos iguales al paso 03.
- **Validación:** cualquier desviación aborta el ETL.

### ETL-07 — No coincidentes
- **Evidencia:** no hay segunda fuente.
- **Acción:** no aplica hoy. Regla para el futuro: en un join, conservar los
  huérfanos y registrar su conteo, sin descartes silenciosos.

### ETL-08 — Transformaciones
- Orden determinista por `PassengerId` (reejecutable → misma salida).
- Se conserva el esquema y los valores del paso 03: sin columnas derivadas, sin
  agregación, sin decodificar categorías.
- **Validación:** reejecutar produce hash de salida idéntico.

### ETL-09 — Fuera de alcance
Sin enriquecimiento (pasos 06–07) ni KPI (pasos 08–09). Sin Parquet ni formatos
extra: se mantiene CSV UTF-8 sin BOM / LF por coherencia con el paso 02.

### ETL-10 — Linaje
```
01_dataset/Titanic-Dataset.csv            (original, intacto, 7D118FEF…E9F6F)
   └─ paso 03 → Titanic-Dataset_clean.csv (CF59B3AB…77F916)
        └─ paso 05 (ETL) → Titanic-Dataset_etl.csv
```
Reejecutable e idempotente; cada paso registra hash de entrada y salida.

## Tecnología
Python 3.13 + pandas 2.3.1 (decisión del paso 02). `polars` 1.44.2 está instalado
pero **no es utilizable en esta máquina**: falla el chequeo de CPU (faltan
`avx2, fma, bmi1, bmi2, lzcnt, movbe`) y advierte de crash probable. Se usa el
skill `polars` solo como referencia de transformaciones.

## Alternativas abiertas
Ninguna. Las decisiones ETL-01…ETL-10 son inequívocas y no dejan casos sin cubrir.
