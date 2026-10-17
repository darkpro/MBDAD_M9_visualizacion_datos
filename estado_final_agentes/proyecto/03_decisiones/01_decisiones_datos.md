# Decisiones de datos y procesamiento

ESTADO: GENERADO
PASO: 02
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 02
DOCUMENTOS SECUNDARIOS: proyecto/03_decisiones/02_decision_tecnologica.md,
proyecto/03_trazabilidad.csv
INSUMOS (paso 01 v1): proyecto/02_analisis/02_diagnostico_dataset.md,
proyecto/02_analisis/01_contexto_objetivos.md

Marco: seis ejes de calidad (completitud, unicidad, validez, consistencia,
exactitud, actualidad). Solo se aplican los pertinentes a este dataset.
Regla rectora: preservar el original y su hash; no imputar, no eliminar filas,
no deduplicar ni deducir claves sin justificación (AGENTS.md).

## 1. Reglas de calidad (propuesta inequívoca)

| ID | Eje | Problema | Evidencia (paso 01) | Acción en la depuración | Columnas | Impacto esperado | Validación |
|---|---|---|---|---|---|---|---|
| QC-01 | Unicidad | Clave primaria duplicada | PassengerId 891/891 únicos | Mantener como clave; NO deduplicar | PassengerId | 0 filas afectadas | únicos == 891 |
| QC-02 | Unicidad | Filas completas duplicadas | 0 duplicadas | NO eliminar filas | todas | 891 filas conservadas | duplicados completos == 0 |
| QC-03 | Completitud | Faltante alto en Cabin | 687/891 (77.10 %) | NO imputar; dejar vacío | Cabin | 204 filas con dato | nulos Cabin == 687 |
| QC-04 | Completitud | Faltante en Age | 177/891 (19.87 %) | NO imputar; dejar vacío | Age | min 0.42 / max 80.0 intactos | nulos Age == 177 |
| QC-05 | Completitud | Faltante en Embarked | 2/891 (0.22 %) | NO imputar; dejar vacío | Embarked | 889 con dato | nulos Embarked == 2 |
| QC-06 | Validez | Fare igual a 0 | 15 filas | NO tratar como error; conservar y registrar | Fare | 15 filas intactas | conteo Fare==0 == 15 |
| QC-07 | Validez | Dominios categóricos | Survived{0,1}; Pclass{1,2,3}; Sex{male,female}; Embarked{C,Q,S}; SibSp{0..8}; Parch{0..6} | Rechazar/acotar valores fuera de dominio; no inventar categorías | Survived, Pclass, Sex, Embarked, SibSp, Parch | 0 violaciones | 0 valores fuera de dominio |
| QC-08 | Consistencia | Espacios extremos en texto | 2 celdas en Name | Normalizar con strip en la copia | Name (y demás texto) | 2 celdas corregidas | 0 celdas con espacios extremos |
| QC-09 | Validez | Cabin multivaluado | 24 filas con >1 camarote | Conservar crudo; NO separar en este paso | Cabin | 24 filas intactas | sin cambios de valor |
| QC-10 | Validez | Cubierta "T" rara | 1 fila | Conservar; registrar como atípico | Cabin | 1 fila intacta | valor presente sin cambios |
| QC-11 | Validez | Tipos de columna | entero/decimal/texto | Coercionar tipos en la copia | PassengerId, Survived, Pclass, SibSp, Parch (entero); Age, Fare (decimal); resto texto | tipos correctos | tipos verificados por script |

## 2. No-acciones (explícitas)
- No imputar valores faltantes (Cabin, Age, Embarked): quedan vacíos.
- No eliminar ni marcar filas; no deduplicar.
- No deducir claves ni relaciones (Ticket/Cabin no son claves).
- No crear columnas derivadas (banderas de nulidad, tamaño de familia, cubierta):
  pertenecen al enriquecimiento (paso 05), no a la depuración (YAGNI).
- No modificar `proyecto/01_dataset/Titanic-Dataset.csv` (original preservado).

## 3. Especificación de la copia depurada (paso 03)
- Ruta sugerida: `proyecto/01_dataset/Titanic-Dataset_clean.csv`.
- Esquema idéntico al original: mismas 12 columnas, mismo orden.
- Formato: CSV, UTF-8 sin BOM, fin de línea LF, delimitador coma (igual que el original).
- Operaciones: strip de texto, coerción de tipos, preservación de nulos; nada más.
- El original y su SHA256 permanecen intactos.

## 4. Alternativas y decisiones abiertas
No quedan alternativas sin resolver para el paso 03. Las dos que admitían debate
se fijan por defecto conservador:
- Fare == 0 (QC-06): se clasifica como valor observado, no como error. Reabrir
  solo si el dominio del negocio lo desmiente.
- Cabin multivaluado (QC-09): se conserva crudo. La extracción de cubierta o
  camarote principal se difiere al enriquecimiento.

## 5. Trazabilidad
Cada regla QC-xx se registra en `proyecto/03_trazabilidad.csv` con pregunta,
evidencia y decisión. Las reglas QC-03/04/05 alimentan KPI de cobertura;
QC-06/07/11 son controles de integridad.

## 6. Aprobación
Propuesta v1 GENERADA. La implementación (paso 03) queda autorizada solo tras la
aprobación explícita del usuario sobre esta versión.
