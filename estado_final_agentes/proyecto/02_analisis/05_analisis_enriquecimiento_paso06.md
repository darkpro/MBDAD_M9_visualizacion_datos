# Análisis de enriquecimiento

ESTADO: GENERADO
PASO: 06
VERSION: 2
DOCUMENTO PRINCIPAL DE ESTE PASO: proyecto/03_decisiones/04_decisiones_enriquecimiento.md
DOCUMENTO SECUNDARIO DE: paso 06 (análisis que respalda las decisiones)
CORRECCIONES DE ESTA VERSIÓN (v1 → v2): la v1 describía el insumo como
inexistente (“el PASO 05 nunca se ejecutó”, “`_etl.csv` no existe”) y arrastraba
la errata “Miss 184”. El paso 05 sí se ejecutó después y su salida
`Titanic-Dataset_etl.csv` es **byte a byte idéntica** a
`Titanic-Dataset_clean.csv` (`CF59B3AB…77F916` en ambos), de modo que la
evidencia aquí medida rige sin cambios para la entrada real del paso 07 (que la
volvió a medir). Aquí se corrigen esos dos puntos; el contenido de las
decisiones no cambia.

## 1. Objetivo
Decidir si el dataset necesita variables derivadas y cuáles, sin inventar hechos
y sin implementarlas todavía.

## 2. Insumo y método
- Entrada: `proyecto/01_dataset/Titanic-Dataset_etl.csv` (salida del paso 05).
  Existe y es byte a byte idéntica a
  `proyecto/01_dataset/Titanic-Dataset_clean.csv` (paso 03 v1, 891 × 12, SHA256
  `CF59B3AB…77F916` en ambos archivos).
- La evidencia se midió con un script de solo lectura sobre
  `Titanic-Dataset_clean.csv`, sin modificar archivos. Al ser idéntico a
  `_etl.csv`, los valores valen igual para la entrada del paso 07.

## 3. Qué se puede derivar sin inventar
Solo tres cosas: lo que está **escrito en una columna** y hay que extraer
(título), lo que es **aritmética de dos columnas** (tamaño de familia) y lo que
es una **letra de un código existente** (cubierta). Además, la **ausencia** de
dato es un hecho observable y se puede marcar (banderas).

## 4. Evidencia medida (891 filas)

### 4.1 Título desde `Name`
Regex `,\s*([^.]+)\.` → **cobertura 891/891 (100%)**, 17 valores crudos.
Normalizando sinónimos reales (`Mlle`/`Ms`→`Miss`, `Mme`→`Mrs`): 14 valores.
Frecuencias: Mr 517, Miss 185, Mrs 126, Master 40, Dr 7, Rev 6, Major 2, Col 2,
the Countess 1, Capt 1, Sir 1, Lady 1, Don 1, Jonkheer 1 (suma 891).
→ 6 valores con n ≤ 2: útiles como etiqueta, no como grupo de análisis.

### 4.2 Tamaño de familia `SibSp + Parch + 1`
**Cobertura 891/891**, rango 1–11. Distribución:
1→537, 2→161, 3→102, 4→29, 5→15, 6→22, 7→12, 8→6, 11→7.

### 4.3 Cubierta desde `Cabin`
`Cabin` no nulo en **204/891 (22.9%)**; letras presentes A, B, C, D, E, F, G, T.
Conteos: C 59, B 47, D 33, E 32, A 15, F 13, G 4, T 1.
**24 filas** tienen más de un camarote → la primera letra es una reducción
declarada. `T` tiene 1 caso (atípico, se conserva).

### 4.4 Ausencia de dato
`Age` 177 nulos, `Cabin` 687, `Embarked` 2. Es información observable; se marca
con banderas sin imputar (respeta QC-03/04/05).

### 4.5 Descartado con evidencia
Prefijo de `Ticket`: 42 valores distintos, **661/891 sin prefijo**, y grafías
inconsistentes (`SOTON/O.Q.` / `SOTON/OQ`, `CA` / `CA.` / `C.A.`) sin semántica
declarada por la fuente → no es una categoría fiable.

## 5. Conclusión
Se aprueban **6 variables derivadas** (ENR-01..ENR-06) y se rechazan 5
propuestas (REC-01..REC-05), todas trazadas en
`proyecto/03_decisiones/04_decisiones_enriquecimiento.md`. No se crean KPI.
No hay alternativas abiertas: el único punto diferible (agrupar títulos raros)
se resuelve con la regla "no agrupar".

## 6. Límites y riesgos
- `Cubierta` cubre solo el 22.9% → cualquier lectura por cubierta es parcial.
- `TamanoFamilia` no es un grupo familiar real.
- Las banderas señalan ausencia; no estiman el valor.
- Este análisis se midió sobre la copia depurada; la entrada del paso 07
  (`_etl.csv`) es byte a byte idéntica, y el paso 07 revalidó el contrato sobre
  ella al implementar.

## 7. Estado
Análisis **v2 GENERADO**. Sin implementación en este documento (la
implementación vive en el paso 07). Sin aprobación: la v2 espera el prompt que
la apruebe; la aprobación parcial de la v1 se conserva como historial en
`.agents/state/workflow.json`.
