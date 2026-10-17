# Análisis de la depuración

ESTADO: GENERADO
PASO: 03
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 03
DOCUMENTOS SECUNDARIOS: proyecto/04_codigo/03_depuracion.py,
proyecto/01_dataset/Titanic-Dataset_clean.csv, proyecto/03_trazabilidad.csv
INSUMOS: proyecto/03_decisiones/01_decisiones_datos.md (v1),
proyecto/03_decisiones/02_decision_tecnologica.md (v1),
proyecto/02_analisis/02_diagnostico_dataset.md (v1)

## 1. Alcance
Depuración (normalización + tipado) según las reglas QC-01..QC-11. No imputa, no
elimina filas, no deduplica, no deduce claves. No inicia el ETL (paso 04).

## 2. Tecnología aplicada
Python 3.13 + pandas 2.3.1 (decisión del paso 02). Script ejecutable:
`proyecto/04_codigo/03_depuracion.py`.

## 3. Reglas aplicadas
| ID | Acción ejecutada | Resultado |
|---|---|---|
| QC-01 | Mantener PassengerId como clave | 891/891 únicos (sin tocar) |
| QC-02 | No eliminar filas | 891 filas conservadas |
| QC-03 | Cabin: dejar vacío | 687 nulos preservados |
| QC-04 | Age: dejar vacío | 177 nulos preservados |
| QC-05 | Embarked: dejar vacío | 2 nulos preservados |
| QC-06 | Fare==0: conservar | 15 filas intactas |
| QC-07 | Validar dominios | 0 violaciones |
| QC-08 | strip de texto | 2 celdas (Name) normalizadas |
| QC-09 | Cabin multivaluado: conservar | sin cambios |
| QC-10 | Cubierta "T": conservar | sin cambios |
| QC-11 | Coerción de tipos | Int64: PassengerId, Survived, Pclass, SibSp, Parch; float: Age, Fare; texto: resto |

## 4. Filas antes / después
| Métrica | Antes | Después |
|---|---|---|
| Filas | 891 | 891 |
| Columnas | 12 | 12 |
| Duplicados completos | 0 | 0 |
| PassengerId únicos | 891 | 891 |

## 5. Faltantes (preservados, sin imputar)
| Columna | Nulos | % |
|---|---|---|
| Cabin | 687 | 77.10 % |
| Age | 177 | 19.87 % |
| Embarked | 2 | 0.22 % |

## 6. Incidencias y notas
- QC-11 cambia la representación de los campos numéricos (p. ej. `Age` 80 -> `80.0`).
  Es la consecuencia declarada de tipar; no altera el valor.
- Los faltantes se escriben como campo vacío, igual que el original.
- No se añadieron columnas derivadas: pertenecen al enriquecimiento (paso 05).

## 7. Comprobaciones (ejecutadas por el script)
- Hash del original idéntico al del paso 01: SHA256 `7D118FEF8B6CCF7F81111877BC388536F7B1E498A655E3D649D19AAA010E9F6F`.
- Copia depurada generada: SHA256 `CF59B3ABDE13B0A1917771A118C92F4FFD0EB68A2517500F96D8A8F1B877F916`, 891 filas, 12 columnas, 0 duplicados, 0 violaciones de dominio, 0 celdas con espacios extremos.
- El script aborta si el original cambia o si falla cualquier validación.

## 8. Artefactos y linaje
```
01_dataset/Titanic-Dataset.csv (intacto)
        │  03_depuracion.py (strip + tipos, sin borrar/imputar)
        ▼
01_dataset/Titanic-Dataset_clean.csv  ->  insumo del paso 04 (ETL)
```

## 9. Estado de aprobación
Paso 03 v1 GENERADO. El paso 02 sigue GENERADO (no APROBADO): este paso no se
envió vía `/paso03`, sino por autorización para completarlo.
