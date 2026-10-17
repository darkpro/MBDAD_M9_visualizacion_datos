# Diagnóstico del dataset

ESTADO: GENERADO
PASO: 01
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 01
DOCUMENTOS SECUNDARIOS: proyecto/02_analisis/01_contexto_objetivos.md,
proyecto/02_analisis/scripts/01_diagnostico_readonly.py, proyecto/03_trazabilidad.csv

Todo lo siguiente proviene de una ejecución real del script de solo lectura
(`01_diagnostico_readonly.py`). El original no fue modificado.

## 1. Inventario y control de integridad
| Fuente | Ruta | Bytes | SHA256 | MD5 |
|---|---|---|---|---|
| Dataset de pasajeros | `proyecto/01_dataset/Titanic-Dataset.csv` | 61 194 | `7D118FEF8B6CCF7F81111877BC388536F7B1E498A655E3D649D19AAA010E9F6F` | `2309CC5F04782ED9BB6016D9F4E381CF` |

- No hay copias derivadas ni múltiples fuentes: no se requiere selección de fuente.
- Original preservado; hash registrado para comparación posterior.

## 2. Formato y codificación
- Codificación: UTF-8 **sin** BOM (`BOM_UTF8: False`).
- Fin de línea: LF (`CRLF: False`).
- Delimitador: coma. Ancho de fila consistente: **True** (todas las filas tienen 12 campos).
- Encabezado presente en la primera línea.

## 3. Esquema, tipos inferidos y faltantes (n = 891)
| Columna | Tipo inferido | No nulos | Faltantes | % faltante | Únicos |
|---|---|---:|---:|---:|---:|
| PassengerId | entero | 891 | 0 | 0.00 % | 891 |
| Survived | entero | 891 | 0 | 0.00 % | 2 |
| Pclass | entero | 891 | 0 | 0.00 % | 3 |
| Name | texto | 891 | 0 | 0.00 % | 891 |
| Sex | texto | 891 | 0 | 0.00 % | 2 |
| Age | decimal | 714 | 177 | 19.87 % | 88 |
| SibSp | entero | 891 | 0 | 0.00 % | 7 |
| Parch | entero | 891 | 0 | 0.00 % | 7 |
| Ticket | texto | 891 | 0 | 0.00 % | 681 |
| Fare | decimal | 891 | 0 | 0.00 % | 248 |
| Cabin | texto | 204 | 687 | 77.10 % | 147 |
| Embarked | texto | 889 | 2 | 0.22 % | 3 |

Faltantes concentrados en tres columnas: `Cabin` (77.10 %), `Age` (19.87 %),
`Embarked` (0.22 %). El resto sin faltantes.

## 4. Unidad de análisis, clave e identificadores
- **Unidad de análisis:** una fila = un pasajero.
- **Clave:** `PassengerId` es único (891/891, máx repetición 1) → apto como clave.
- `Name` también es único (891/891) pero es dato textual, no clave técnica.
- `Ticket`: 681 valores únicos; 134 valores repetidos cubren 344 filas
  (máx 7 pasajeros por ticket) → agrupador de billete compartido, no clave.
- `Cabin`: 147 valores no nulos distintos; 24 filas tienen >1 camarote
  (separados por espacio) → atributo multivaluado, no clave.
- `SibSp` + `Parch` → tamaño de familia (0 a 10); 537 pasajeros viajan solos (0).

## 5. Dominios y rangos
- `Survived`: {0, 1} → 0: 549, 1: 342 (media 0.3838).
- `Pclass`: {1, 2, 3} → 3: 491, 1: 216, 2: 184.
- `Sex`: {male: 577, female: 314}.
- `Embarked`: {S: 644, C: 168, Q: 77}.
- `SibSp`: {0:608, 1:209, 2:28, 4:18, 3:16, 8:7, 5:5}.
- `Parch`: {0:678, 1:118, 2:80, 5:5, 3:5, 4:4, 6:1}.
- `Cabin` cubiertas (prefijo): B:47, C:59, D:33, E:32, A:15, G:4, F:13, T:1.
- `Age`: min 0.42, max 80.0, media 29.6991.
- `Fare`: min 0.0, max 512.3292, media 32.2042; **15 filas con Fare == 0**.
- `PassengerId`: 1..891.

## 6. Duplicados y normalización
- Filas completamente duplicadas: **0**.
- `PassengerId` duplicado: **0** (máx repetición 1) → no deduplicar filas.
- Celdas con espacios extremos: **2**, ambas en `Name` (evidencia para regla de
  normalización de texto en el paso 02).

## 7. Hallazgos (con evidencia)
- H1 — Faltante alto en `Cabin` (77.10 %): limita análisis por cubierta a 204 filas.
- H2 — Faltante moderado en `Age` (19.87 %): cualquier análisis de edad debe
  declarar el tratamiento del faltante (sin imputar por defecto).
- H3 — `Embarked` con 2 faltantes (0.22 %): impacto mínimo; requiere decisión explícita.
- H4 — `Fare == 0` en 15 filas: verificar si son válidos (p. ej. tripulación/invitar)
  antes de tratarlos como error.
- H5 — `Ticket` y `Cabin` son agrupadores compartidos; `Cabin` multivaluado en 24 filas.
- H6 — 2 celdas de `Name` con espacios extremos: normalización de texto.

## 8. Validaciones realizadas
- Hash SHA256/MD5 del original computado y registrado (sección 1).
- Ancho de fila consistente = True.
- Conteo de filas (891) y columnas (12) verificados.
- Faltantes, dominios, rangos y duplicados computados sobre el total de filas.
- Script idempotente y de solo lectura; no escribe en el dataset.

## 9. Límites / observaciones
- El diagnóstico es descriptivo: no decide tratamiento de faltantes ni
  transformaciones (eso corresponde al paso 02).
- `Cabin` incluye una cubierta "T" (1 fila): valor raro, a revisar en el paso 02.
- Los conteos de "únicos" de `Cabin` difieren según se incluya o no la cadena
  vacía (147 no nulos vs 148 contando el vacío): se documenta explícitamente.

## 10. Archivos relacionados
| Archivo | Rol |
|---|---|
| `proyecto/02_analisis/01_contexto_objetivos.md` | Contexto y objetivos (paso 01) |
| `proyecto/02_analisis/scripts/01_diagnostico_readonly.py` | Evidencia reproducible |
| `proyecto/03_trazabilidad.csv` | Trazabilidad pregunta → evidencia → decisión |
