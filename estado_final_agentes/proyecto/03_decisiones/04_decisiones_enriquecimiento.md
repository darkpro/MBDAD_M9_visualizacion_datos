# Decisiones de enriquecimiento

ESTADO: GENERADO
PASO: 06
VERSION: 2
DOCUMENTO PRINCIPAL DE: paso 06
DOCUMENTOS SECUNDARIOS: proyecto/02_analisis/05_analisis_enriquecimiento_paso06.md,
proyecto/03_trazabilidad.csv
APROBACIÓN REGISTRADA: no. Esta es la versión correctiva que retira ENR-07 y
ENR-08 y arregla la errata de cobertura; queda GENERADO, a la espera de la
aprobación que traiga el prompt del paso siguiente.
HISTORIAL: la versión 1 tuvo una aprobación **parcial**, registrada contra su
contenido y su SHA256 `45B249FE…76F4D7` (ver
`.agents/state/workflow.json` → `approval_log`): cubría las secciones 0-1,
ENR-01..ENR-06 y REC-01..REC-05, y excluía ENR-07/ENR-08. Esa aprobación se
conserva como historial de la v1 y **no se traslada** a esta v2, que al haber
cambiado el contenido debe aprobarse de nuevo.
CORRECCIONES DE ESTA VERSIÓN (v1 → v2):
1. Se retiran ENR-07 `ViajaSolo` y ENR-08 `Coordenadas Embarque`: ENR-07
   duplicaba REC-05 y su fórmula repetía la de ENR-02; ENR-08 introducía
   geografía de una fuente externa, prohibida por AGENTS.md y ya rechazada como
   REC-04. La sección 2 queda con exactamente las **6 variables** que la
   sección 4 anunciaba.
2. Se corrige la cobertura de ENR-01: decía “Miss 184” y su lista sumaba 890;
   el valor real es **Miss 185** (182 + 2 `Mlle` + 1 `Ms`), suma 891.
3. Se corrige la sección 0: `Titanic-Dataset_etl.csv` **sí existe** (salida del
   paso 05) y es **byte a byte idéntico** a `Titanic-Dataset_clean.csv`
   (`CF59B3AB…77F916` en ambos), así que la evidencia medida sobre la copia
   depurada rige igual para la entrada real del paso 07.

## 0. Insumo real observado
Fuente prevista: `proyecto/01_dataset/Titanic-Dataset_etl.csv` (salida del paso
05). Existe y es **idéntica byte a byte** a
`proyecto/01_dataset/Titanic-Dataset_clean.csv` (paso 03 v1, 891 × 12, SHA256
`CF59B3AB…77F916` en ambos archivos). La evidencia de abajo se midió con un
script de solo lectura sobre el archivo depurado; al ser idénticos, rige igual
para la entrada del paso 07. La implementación del paso 07 volvió a medir todo
sobre `Titanic-Dataset_etl.csv` y reprodujo estos números (ver
`proyecto/02_analisis/05_analisis_enriquecimiento.md`).

## 1. Criterio de admisión
Una variable entra solo si: (a) se deriva **aritmética o textualmente** de
columnas existentes, sin inferir hechos externos; (b) su regla es determinista
y auditable; (c) no introduce geografía, parentesco real, ni categorías
inventadas. Lo que no cumple, se rechaza y queda documentado.

## 2. Variables aprobadas (a implementar en el PASO 07)

### ENR-01 · `Titulo`
- **Significado:** tratamiento social declarado en `Name`.
- **Fórmula:** `Name` → regex `,\s*([^.]+)\.` → `strip`; sinónimos reales
  normalizados: `Mlle`→`Miss`, `Ms`→`Miss`, `Mme`→`Mrs`. Sin agrupar el resto.
- **Entradas:** `Name`.
- **Faltantes:** ninguno; la regla cubre 891/891 (100%).
- **Fuente:** derivada del dataset.
- **Cobertura esperada:** 891/891; 14 valores distintos tras normalizar
  (Mr 517, Miss 185, Mrs 126, Master 40, Dr 7, Rev 6, Major 2, Col 2,
  the Countess 1, Capt 1, Sir 1, Lady 1, Don 1, Jonkheer 1). Suma 891.
- **Límites:** 6 valores con n ≤ 2 no permiten conclusiones; NO se agrupan para
  no inventar categorías. Si un dashboard necesita agrupar, se decidirá allí.

### ENR-02 · `TamanoFamilia`
- **Significado:** personas del grupo familiar declarado a bordo, incluido el
  pasajero.
- **Fórmula:** `SibSp + Parch + 1`.
- **Entradas:** `SibSp`, `Parch`.
- **Faltantes:** ninguno (891/891).
- **Fuente:** derivada.
- **Cobertura esperada:** 891/891; rango 1–11 (1:537, 2:161, 3:102, 4:29,
  5:15, 6:22, 7:12, 8:6, 11:7).
- **Límites:** reexpresa las dos columnas; NO identifica familias reales
  (grupos de ticket), eso sería parentesco inferido.

### ENR-03 · `Cubierta`
- **Significado:** cubierta del camarote.
- **Fórmula:** primera letra de `Cabin` cuando `Cabin` no es nulo; si hay varios
  camarotes, se toma la letra del **primero** (regla declarada).
- **Entradas:** `Cabin`.
- **Faltantes:** se deja vacío cuando `Cabin` es nulo (687 filas). **No se
  imputa.**
- **Fuente:** derivada.
- **Cobertura esperada:** 204/891 (22.9%); letras A 15, B 47, C 59, D 33,
  E 32, F 13, G 4, T 1.
- **Límites:** 77.1% sin dato → representatividad limitada; la ausencia de
  `Cabin` es informativa (se conserva como bandera ENR-05). 24 filas tienen
  >1 camarote y quedan reducidas a su primera letra.

### ENR-04 · `BanderaSinAge`
- **Significado:** la edad no está registrada.
- **Fórmula:** `Age.isna()`.
- **Entradas:** `Age`.
- **Faltantes:** N/A (booleano, 891/891).
- **Cobertura esperada:** 177 verdaderos, 714 falsos.
- **Límites:** solo marca ausencia; no estima la edad.

### ENR-05 · `BanderaSinCabin`
- **Significado:** el camarote no está registrado.
- **Fórmula:** `Cabin.isna()`.
- **Cobertura esperada:** 687 verdaderos, 204 falsos.
- **Límites:** idem; no imputa cubierta.

### ENR-06 · `BanderaSinEmbarked`
- **Significado:** el puerto de embarque no está registrado.
- **Fórmula:** `Embarked.isna()`.
- **Cobertura esperada:** 2 verdaderos, 889 falsos.
- **Límites:** idem.

## 3. Rechazos (documentados, no implementar)

| ID | Propuesta | Motivo del rechazo |
|---|---|---|
| REC-01 | Prefijo de `Ticket` como categoría | 42 valores distintos, 661/891 sin prefijo, ortografía inconsistente (`SOTON/O.Q.` vs `SOTON/OQ`, `CA` vs `CA.` vs `C.A.`); semántica no declarada por la fuente |
| REC-02 | Identificador de familia real por grupo de `Ticket` | Infiere parentesco no declarado en los datos |
| REC-03 | Imputar `Age` (mediana), `Embarked` (moda), `Fare` | Viola QC-03/04/05 (no imputar) |
| REC-04 | Geografía, ingresos, clase social inferida | Violaría AGENTS.md (no inventar geografía ni ingresos) |
| REC-05 | `EsSolo` (viaja solo) | Redundante: `TamanoFamilia == 1` (ENR-02); se deriva al usarla |

## 4. Reglas de implementación (para el PASO 07)
- No sobrescribir el original ni `Titanic-Dataset_clean.csv` / `_etl.csv`.
- Salida: `proyecto/01_dataset/Titanic-Dataset_enriquecido.csv` (nuevo archivo).
- Las 6 columnas nuevas se **añaden al final**, conservando las 12 originales y
  su orden; UTF-8 sin BOM, LF; `na_rep=""`.
- Tipos: `Titulo` texto; `TamanoFamilia` entero; `Cubierta` texto con vacíos;
  banderas `Bandera*` booleanas (representadas 0/1 o `true`/`false`, a fijar en
  implementación).
- Actualizar el diccionario de datos con estas 6 variables.
- Idempotente; abortar si cambia el hash de la entrada.
- **No definir KPI** en este paso ni en el 07.

## 5. Estado
PASO 06 **v2 GENERADO**, sin aprobación. La v2 retira ENR-07/ENR-08 y corrige
la cobertura de ENR-01 y la sección 0; la sección 2 queda con 6 variables y es
coherente con la sección 4. **Sin alternativas abiertas.** ENR-01..ENR-06 fueron
implementadas en el paso 07 (documento `05_analisis_enriquecimiento.md`, que
todavía describe ENR-07/ENR-08 como bloqueo pendiente y deberá revisarse). KPI
no definidos.
