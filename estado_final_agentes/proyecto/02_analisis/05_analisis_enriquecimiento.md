# Análisis de la implementación del enriquecimiento

ESTADO: APROBADO
PASO: 07
VERSION: 1
DOCUMENTO PRINCIPAL DE: paso 07
DOCUMENTOS SECUNDARIOS: proyecto/04_codigo/07_enriquecimiento.py,
proyecto/01_dataset/Titanic-Dataset_enriquecido.csv, proyecto/03_trazabilidad.csv
ENTRADA: proyecto/01_dataset/Titanic-Dataset_etl.csv (891 × 12, 62000 bytes,
SHA256 `cf59b3ab…77f916`)
SALIDA: proyecto/01_dataset/Titanic-Dataset_enriquecido.csv (891 × 18, 73674
bytes, SHA256 `6807462b…29d18`)
CÓDIGO: proyecto/04_codigo/07_enriquecimiento.py (SHA256 `5a2fd3f0…80edd`, 191
líneas, solo biblioteca estándar)
APROBACIÓN DEL PASO 06: no registrada. El prompt del paso 07 traía esa
aprobación, pero el artefacto en disco es autocontradictorio y no hay versión
limpia que aprobar; ver sección 6. Este documento se generó por la autorización
explícita del paso 07 y no aprueba nada.
APROBACIÓN DE ESTA VERSIÓN (v1): APROBADO por el prompt del paso 08
(“Apruebo los resultados, los archivos y las decisiones de la versión revisada
del PASO 07”). Cubre este documento (v1), el código
`proyecto/04_codigo/07_enriquecimiento.py` y la salida
`proyecto/01_dataset/Titanic-Dataset_enriquecido.csv` (891 × 18, SHA256
`6807462b…29d18`). La aprobación se registró tras comprobar que los resultados
existen y que las validaciones del script pasaron.

## 0. Autorización de este paso
El paso 07 se ejecutó con la autorización explícita contenida en el prompt del
paso 07. La aprobación del paso 06 que ese mismo prompt declaraba **no se
registró** (sección 6). No se avanzó a ningún paso posterior.

## 1. Alcance implementado
Se implementaron las variables **ENR-01 a ENR-06** del paso 06, y solo esas.
Las propuestas **ENR-07 (`ViajaSolo`) y ENR-08 (`Coordenadas Embarque`) aparecen
en el documento del paso 06 pero NO se implementaron**: contradicen la sección 4
del propio documento (“las 6 columnas nuevas”), duplican rechazos ya aprobados
(REC-05 y REC-04) y ENR-08 introduce geografía prohibida por AGENTS.md. Detalle
en sección 6.

Ninguna fila se elimina, se imputa ni se deduplica: se añaden 6 columnas al
final y se conservan las 12 originales con su orden.

## 2. Diccionario de datos: variables añadidas
No existía un diccionario de datos dedicado en el proyecto (búsqueda
`diccionario` → solo referencias, ningún archivo). El paso 06 pidió “actualizar
el diccionario”: al no existir, se documenta aquí.

| # | Columna | Tipo | Fórmula implementada | Nulos | Cobertura |
|---|---|---|---|---|---|
| ENR-01 | `Titulo` | texto | `Name` → regex `,\s*([^.]+)\.` → `strip`; `Mlle`/`Ms`→`Miss`, `Mme`→`Mrs`; el resto sin agrupar | 0 | 891/891 (100%) |
| ENR-02 | `TamanoFamilia` | entero | `SibSp + Parch + 1` | 0 | 891/891 (100%) |
| ENR-03 | `Cubierta` | texto | primera letra de `Cabin` (primer camarote si hay varios); vacío si `Cabin` falta | 687 | 204/891 (22.9%) |
| ENR-04 | `BanderaSinAge` | 0/1 | `Age` vacío | 0 | 177 verdaderos / 714 falsos |
| ENR-05 | `BanderaSinCabin` | 0/1 | `Cabin` vacío | 0 | 687 verdaderos / 204 falsos |
| ENR-06 | `BanderaSinEmbarked` | 0/1 | `Embarked` vacío | 0 | 2 verdaderos / 889 falsos |

Las banderas se representan como `0`/`1` (entero), no `true`/`false`: fija la
opción que el paso 06 dejó abierta y evita texto booleano en el CSV. `Cubierta`
queda vacía, nunca imputada (respeta QC-03/04/05).

Orden final de columnas (18): las 12 originales
(`PassengerId, Survived, Pclass, Name, Sex, Age, SibSp, Parch, Ticket, Fare,
Cabin, Embarked`) seguidas de `Titulo, TamanoFamilia, Cubierta, BanderaSinAge,
BanderaSinCabin, BanderaSinEmbarked`.

## 3. Validaciones ejecutadas y resultados
Todas se ejecutan dentro del script y abortan la escritura (`sys.exit(1)`) si no
cuadran; el script no produce el archivo cuando falla una validación.

| Validación | Esperado | Medido | Resultado |
|---|---|---|---|
| Filas | 891 | 891 | OK |
| Columnas | 18 | 18 | OK |
| `Titulo` = 891/891, 14 valores | 14 valores | Mr 517, Miss 185, Mrs 126, Master 40, Dr 7, Rev 6, Major 2, Col 2, the Countess 1, Capt 1, Sir 1, Lady 1, Don 1, Jonkheer 1 (suma 891) | OK |
| `TamanoFamilia` = `SibSp+Parch+1` | 891/891 | 1:537, 2:161, 3:102, 4:29, 5:15, 6:22, 7:12, 8:6, 11:7 (suma 891) | OK |
| `Cubierta` | 204 no nulos | A 15, B 47, C 59, D 33, E 32, F 13, G 4, T 1 (suma 204) | OK |
| Banderas | 177 / 687 / 2 | 177 / 687 / 2 | OK |
| Nulos preservados | Age 177, Cabin 687, Embarked 2 | 177 / 687 / 2 | OK |
| 12 columnas originales intactas | byte a byte | re-serializadas con `csv.writer` (`QUOTE_MINIMAL`, `LF`) = 62000 bytes idénticos al archivo de entrada; sin BOM; con LF final | OK |
| Formato de salida | UTF-8 sin BOM, LF, `na_rep=""` | BOM `False`, CRLF 0, LF 892 | OK |
| Idempotencia | hash estable | dos ejecuciones → mismo SHA256 `6807462b…29d18` | OK |
| Integridad de entrada | hash fijo | entrada `cf59b3ab…77f916`; el script aborta si cambia | OK |

Los 24 pasajeros con más de un camarote quedan reducidos a la letra del primero
(regla declarada en ENR-03); no se pierde la cadena original, que sigue en
`Cabin`.

## 4. Errata del paso 06 registrada
El documento del paso 06 afirma cobertura “891/891; 14 valores distintos (… Miss
184, Mrs 126, …)” y la suma de esa lista da **890**, no 891. Medición real sobre
`Titanic-Dataset_etl.csv`: `Mlle` 2 y `Ms` 1 se normalizan a `Miss` → **Miss =
185**; `Mme` 1 → `Mrs` = 126. Los 14 valores y la cobertura 891/891 no cambian:
es una errata de transcripción, no un cambio de decisión. El script valida
`Miss = 185`.

## 5. Trazabilidad y artefactos
- Código: `proyecto/04_codigo/07_enriquecimiento.py` (solo biblioteca estándar;
  sin pandas, para que la re-serialización byte a byte sea verificable).
- Salida nueva: `proyecto/01_dataset/Titanic-Dataset_enriquecido.csv`. No se
  sobrescribió el original ni `_clean.csv` ni `_etl.csv` (hashes sin cambios).
- Filas `T07-01..T07-08` añadidas a `proyecto/03_trazabilidad.csv`.
- No se definieron KPI en este paso (ni en el 06): la columna `KPI` de las filas
  nuevas queda vacía.

## 6. Bloqueo: ENR-07 y ENR-08 sin implementar
NOTA (estado actual, añadida al aprobar v1): el paso 06 fue corregido a **v2**,
que retira ENR-07 y ENR-08 y deja 6 variables coherentes. Por tanto el bloqueo
descrito en esta sección **ya no está vigente**; el texto de abajo se conserva
como registro de lo observado al redactar la v1 y no se altera.
`proyecto/03_decisiones/04_decisiones_enriquecimiento.md` (v1) contiene dos
propuestas adicionales que **no se implementaron**:

- **ENR-07 `ViajaSolo`**: su fórmula escrita es `SibSp + Parch + 1`, idéntica a
  ENR-02, y la propuesta duplica REC-05 (rechazada como redundante de
  `TamanoFamilia == 1`).
- **ENR-08 `Coordenadas Embarque`**: introduce coordenadas geográficas de
  Southampton/Cherbourg/Queenstown desde una fuente externa (mlcommons
  croissant). AGENTS.md prohíbe inventar geografía y el paso 06 lo rechazó como
  REC-04; además su “fórmula” está copiada de ENR-02
  (`SibSp + Parch + 1`), que no produce coordenadas.

Contradicen la sección 4 del mismo documento (“las 6 columnas nuevas”), por lo
que el artefacto del paso 06 es internamente inconsistente. Añadido a eso, su
contenido cambió **sin subir `VERSION`** (sigue 1) y su encabezado aún dice
“APROBACIÓN REGISTRADA: ninguna”. Por eso la aprobación del paso 06 declarada en
el prompt del paso 07 **no se registró**: no hay una versión limpia y sin
contradicciones que aprobar.

Salida propuesta, pendiente de decisión del usuario: corregir el paso 06 a v2
(retirar ENR-07 y ENR-08, corregir Miss 184→185, subir `VERSION` a 2) y entonces
registrar la aprobación; o bien aprobar explícitamente v1 tal cual, lo que
obligaría a implementar ENR-07/ENR-08 y a levantar la prohibición de geografía.

## 7. Estado
PASO 07 v1 **GENERADO**. Las 6 variables están creadas, validadas y son
idempotentes. El paso 06 sigue v1 **GENERADO sin aprobación limpia**. Los pasos
08 en adelante no se iniciaron. Sin KPI definidos.
