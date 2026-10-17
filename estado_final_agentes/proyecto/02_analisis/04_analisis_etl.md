# Informe del ETL

ESTADO: GENERADO
PASO: 05
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 05
DOCUMENTOS SECUNDARIOS: proyecto/04_codigo/05_etl.py,
proyecto/01_dataset/Titanic-Dataset_etl.csv, proyecto/03_trazabilidad.csv
DECISIONES IMPLEMENTADAS: proyecto/03_decisiones/10_decisiones_etl.md (ETL-01…ETL-10, v1)
APROBACIÓN REGISTRADA: pendiente (generado por autorización para completar; NO es aprobación)

## 1. Alcance
Implementación del ETL diseñado en el paso 04: lleva la base depurada a un
artefacto analítico local. Sin enriquecimiento ni KPI.

## 2. Flujo implementado
```
ENTRADA   proyecto/01_dataset/Titanic-Dataset_clean.csv   891 × 12
   │  extracción → coerción de tipos → validación de contrato
   │  → orden estable por PassengerId → carga
   ▼
SALIDA    proyecto/01_dataset/Titanic-Dataset_etl.csv     891 × 12
```

## 3. Resultados reales
| Métrica | Valor |
|---|---|
| Filas / columnas | 891 / 12 |
| Orden de columnas | igual al original (verificado) |
| PassengerId únicos y no nulos | 891 |
| Filas duplicadas | 0 |
| Dominios | Survived {0,1}, Pclass {1,2,3}, Sex {male,female}, Embarked {C,Q,S} |
| Nulos | Age 177, Cabin 687, Embarked 2 |
| Codificación | UTF-8 sin BOM, LF |
| Tamaño | 62000 bytes |
| Idempotencia | reejecutar → mismo hash (verificado) |

Hashes:
- entrada `Titanic-Dataset_clean.csv`: `cf59b3abde13b0a1917771a118c92f4ffd0eb68a2517500f96d8a8f1b877f916`
- salida `Titanic-Dataset_etl.csv`: `cf59b3abde13b0a1917771a118c92f4ffd0eb68a2517500f96d8a8f1b877f916`

**Hallazgo:** la salida es **byte-idéntica** a la entrada. La copia del paso 03 ya
venía ordenada por `PassengerId` y con el mismo formato, así que la única
transformación (ETL-08) no cambia bytes. El valor del ETL aquí es el **contrato
verificado** (esquema, clave, dominios, nulos) y el orden determinista
garantizado, no una mutación de datos. Sin columnas derivadas, sin agregación.

## 4. Decisiones aplicadas
- ETL-01 sin BD · ETL-02 sin uniones · ETL-03 entradas/salidas arriba ·
  ETL-04 contrato de tipos · ETL-05 granularidad 1 fila = 1 pasajero ·
  ETL-06 controles de cardinalidad · ETL-07 no coincidentes (N/A) ·
  ETL-08 orden determinista · ETL-09 fuera de alcance (sin enriquecimiento/KPI/Parquet) ·
  ETL-10 linaje.

## 5. Linaje
```
01_dataset/Titanic-Dataset.csv            7d118fef…e9f6f   (original, intacto)
   └─ paso 03 → Titanic-Dataset_clean.csv cf59b3ab…77f916
        └─ paso 05 → Titanic-Dataset_etl.csv    cf59b3ab…77f916   (byte-idéntica)
```

## 6. Verificaciones ejecutadas
Script `proyecto/04_codigo/05_etl.py` (aborta con `SystemExit(1)` si falla):
- shape 891×12, orden de columnas, clave `PassengerId` única y no nula, 0 duplicados,
  dominios, conteos de nulos. Reejecución → hash idéntico (idempotencia).
- Relectura con pandas: 891 filas, 12 columnas, mismo orden, 0 duplicados.
- Bytes: sin BOM, sin CRLF, 892 LF (891 datos + cabecera).

## 7. Límites
- Sin columnas derivadas: la señal (banderas de nulos, familia, título) es
  enriquecimiento → pasos 06–07.
- `polars` no usable en este equipo (chequeo de CPU falla); se usó pandas.

## 8. Estado
Paso 05 v1 GENERADO. No aprobado (generado por autorización para completarlo).
Enriquecimiento y KPI no implementados.
