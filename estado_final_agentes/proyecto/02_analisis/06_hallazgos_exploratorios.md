# Hallazgos exploratorios

ESTADO: GENERADO
PASO: 08
VERSION: 1
DOCUMENTO PRINCIPAL DE: no (el principal del paso 08 es
proyecto/03_decisiones/05_decisiones_kpi.md)
DOCUMENTOS RELACIONADOS: proyecto/02_analisis/07_propuesta_kpi.md (catálogo),
proyecto/03_decisiones/05_decisiones_kpi.md (principal),
proyecto/04_codigo/08_exploratorio.py (solo lectura), proyecto/03_trazabilidad.csv
ENTRADA: proyecto/01_dataset/Titanic-Dataset_enriquecido.csv (891 × 18, 73674
bytes, SHA256 `6807462b…29d18`)
COMANDO: `python proyecto/04_codigo/08_exploratorio.py`

## 0. Autorización y alcance
Análisis **descriptivo y solo-lectura** de las salidas del paso 07, autorizado
por el prompt del paso 08. El script verifica el SHA256 de la entrada y aborta
si cambia; no escribe ni modifica ningún artefacto. No se calcularon KPI
definitivos ni se construyeron dashboards: los KPI solo se **proponen** en
`07_propuesta_kpi.md`. Los números de este documento son los que imprime el
script.

Se describen distribuciones, diferencias por subgrupo, relaciones descriptivas,
calidad y limitaciones. **Todas las diferencias y correlaciones son
descriptivas, no causales**, y aplican solo a esta muestra (891 pasajeros). No
se infiere geografía, familia ni ingresos más allá de las columnas existentes.

## 1. Forma y unidad de análisis
- 891 filas × 18 columnas; orden de columnas igual al esperado (`columnas ok
  True`). Una fila = un pasajero; la unidad de análisis no cambia.
- Nulos (recuento y porcentaje): `Age` 177 (19.87 %), `Cabin`/`Cubierta` 687
  (77.10 %), `Embarked` 2 (0.22 %). Cero nulos en `Survived`, `Pclass`, `Sex`,
  y en las 6 columnas añadidas salvo `Cubierta` (heredado de `Cabin`).

## 2. Supervivencia global
342 de 891 = **38.38 %**. Es el denominador de referencia: toda tasa por
subgrupo usa n del subgrupo (no 891) y se acompaña de su tamaño.

## 3. Diferencias por subgrupo
| Subgrupo | n | % pob. | superv. | tasa |
|---|---|---|---|---|
| Sex=female | 314 | 35.24 % | 233 | **74.20 %** |
| Sex=male | 577 | 64.76 % | 109 | **18.89 %** |
| Pclass=1 | 216 | 24.24 % | 136 | 62.96 % |
| Pclass=2 | 184 | 20.65 % | 87 | 47.28 % |
| Pclass=3 | 491 | 55.11 % | 119 | 24.24 % |
| Embarked=C | 168 | 18.86 % | 93 | 55.36 % |
| Embarked=Q | 77 | 8.64 % | 30 | 38.96 % |
| Embarked=S | 644 | 72.28 % | 217 | 33.70 % |
| Embarked=NaN | 2 | 0.22 % | 2 | 100 % (n=2, no interpretable) |
| TamanoFamilia=1 | 537 | 60.27 % | 163 | 30.35 % |
| TamanoFamilia=2-4 | 292 | 32.77 % | 169 | **57.88 %** |
| TamanoFamilia=5+ | 62 | 6.96 % | 10 | **16.13 %** |

Lecturas descriptivas:
- **Sexo**: la mayor brecha simple de la muestra (74.20 % vs 18.89 %, ≈55.3
  puntos porcentuales).
- **Pclass**: gradiente monótono 62.96 % > 47.28 % > 24.24 %.
- **Puerto**: C > Q > S; el grupo `Embarked` nulo tiene n=2 y no se interpreta.
- **Tamaño familiar**: forma en U suave. Grupos de 2-4 superan la media;
  viajeros solos (1) y familias grandes (5+) quedan por debajo. Sin embargo, el
  detalle por tamaño exacto es muy irregular y con celdas pequeñas (5:20 %,
  6:13.64 %, 8:0 %, 11:0 %, n≤22), así que solo el **agrupado 1 / 2-4 / 5+** es
  defendible; las celdas exactas se leen como ruido.
- **Titulo**: `Mrs` 79.37 % (n=126), `Miss` 70.27 % (n=185), `Master` 57.50 %
  (n=40), `Mr` 15.67 % (n=517) concentran el 97 % de los casos. El resto tiene
  n≤7 (`Rev` 6 al 0 %, `Dr` 7 al 42.86 %) y varios títulos con n=1-2
  (`Lady`, `Sir`, `the Countess` al 100 %; `Capt`, `Don`, `Jonkheer` al 0 %),
  sin valor interpretable por sí solos.
- **Cubierta** (solo 204 con dato): `D` 75.76 %, `E` 75.00 %, `B` 74.47 %,
  `C` 59.32 %, `F` 61.54 %, `A` 46.67 %, `G` 50 % (n=4), `T` 0 % (n=1); los 687
  sin `Cabin` sobreviven al 29.99 %. `Cubierta` describe un grupo sesgado y
  pequeño; se trata como **cobertura**, no como variable de pleno derecho.
- **Bandera de faltante** (¿el nulo informa?): quien tiene `Age` falta
  sobrevive 29.38 % vs 40.62 %; quien tiene `Cabin` falta sobrevive 29.99 % vs
  66.67 %. Es decir, el faltante de `Cabin` separa fuertemente. `Embarked` nulo:
  2/2, sin valor.

## 4. Relaciones descriptivas (Pearson)
- `Survived` ~ `Pclass` **−0.34**; `Survived` ~ `Fare` +0.26;
  `Survived` ~ `BanderaSinCabin` −0.32. Señal individual moderada.
- Redundancia estructural esperada: `Pclass` ~ `Fare` −0.55,
  `Pclass` ~ `BanderaSinCabin` **0.73**, `SibSp` ~ `TamanoFamilia` **0.89**,
  `Parch` ~ `TamanoFamilia` 0.78, `SibSp` ~ `Parch` 0.41. Confirma que
  `TamanoFamilia` encapsula `SibSp`+`Parch` y que `Cabin` faltante se concentra
  en 3.ª clase.
- `Age` ~ `Pclass` −0.37 (pasajeros de 1.ª algo mayores). Correlaciones con
  `Age` se calculan sobre 714 casos (los 177 nulos quedan fuera).

## 5. Variables numéricas
- **Age** (n=714): media 29.70, sd 14.53, mediana 28, IQR 20.12–38, min 0.42,
  max 80. Nulo no aleatorio: F 16.88 % / M 21.49 %; por clase 1: 13.89 %,
  2: 5.98 %, **3: 27.70 %**. Mediana por clase×sexo: 1.ª M=40 / F=35; 2.ª M=30
  / F=28; 3.ª M=25 / F=21.5.
- **Fare** (n=891, sin nulos): media 32.20, sd 49.69, mediana 14.45, IQR
  7.91–31, min 0, max 512.33. Fuerte asimetría. Mediana por clase 60.29 / 14.25
  / 8.05. **15 `Fare==0`** (5 en 1.ª, 6 en 2.ª, 4 en 3.ª; **todas hombres**;
  1/15 sobrevivió): valor posiblemente sustituto de tarifa no registrada en
  lugar de un importe real.
- **SibSp** {0:608, 1:209, 2:28, 3:16, 4:18, 5:5, 8:7};
  **Parch** {0:678, 1:118, 2:80, 3:5, 4:4, 5:5, 6:1}: distribuciones muy
  concentradas en 0.

## 6. Calidad
- 0 `PassengerId` duplicados. Dominios correctos: `Survived` {0,1},
  `Pclass` {1,2,3}, `Sex` {female,male}, `Embarked` {C,Q,S}.
- 0 `Fare` < 0; 0 `Age` < 0 o > 100; 0 nulos en columnas clave.
- `Ticket`: 29 prefijos distintos, 661 vacíos (casi todos numéricos sin letra).
  `Cabin`: 24 filas con varios camarotes (ya reducidas a la letra del primero
  en `Cubierta`). `Cabin` nulo por clase 1 18.52 %, 2 91.30 %, 3 97.56 %.
- No se imputó, borró ni deduplicó nada: los faltantes se preservan como tales
  (coherente con QC-03/04/05 del paso 06).

## 7. Limitaciones
1. **Descriptivo, no causal**: las brechas y correlaciones no identifican
   mecanismos; hay confusión entre `Sex`, `Pclass` y `Cabin`.
2. **Cobertura parcial**: `Cabin`/`Cubierta` solo 22.90 % y `Age` 80.13 %;
   cualquier KPI sobre ellos lleva su denominador y su nota de cobertura.
3. **Celdas pequeñas**: títulos inusuales (n≤7) y tamaños familiares 5-11
   (n≤22) no sostienen una tasa propia estable.
4. **`Fare==0`** (15 casos) y `Embarked` nulo (2) son valores a documentar, no
   a corregir en este paso.
5. Muestra de un único archivo; sin marco poblacional externo.

## 8. Estado
PASO 08 **GENERADO** (v1). Estimación descriptiva completa; catálogo de KPI
propuesto en `07_propuesta_kpi.md` y decisiones propuestas en
`05_decisiones_kpi.md`. Sin KPI implementados ni dashboards. Pendiente de la
aprobación que traerá el prompt del paso 09.
