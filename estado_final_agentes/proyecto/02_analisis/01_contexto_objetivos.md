# Contexto y objetivos

ESTADO: GENERADO
PASO: 01
VERSION: 1
DOCUMENTO PRINCIPAL: proyecto/02_analisis/02_diagnostico_dataset.md
DOCUMENTOS SECUNDARIOS: proyecto/02_analisis/scripts/01_diagnostico_readonly.py, proyecto/03_trazabilidad.csv

## 1. Propósito del proyecto (genérico)
Pipeline reproducible de datos y visualización: depuración, ETL, enriquecimiento,
definición de KPI y cuatro dashboards con D3.js. El tema depende de los datos.
No se entrenan modelos. Este caso se apoya en el dataset de pasajeros provisto;
los objetivos de abajo se derivan de las variables realmente disponibles y no de
supuestos externos.

## 2. Contexto del conjunto de datos
- Fuente única: `proyecto/01_dataset/Titanic-Dataset.csv` (61 194 bytes, UTF-8 sin BOM, fin de línea LF).
- 891 filas × 12 columnas. Una fila = un pasajero (ver diagnóstico).
- Variables: `PassengerId, Survived, Pclass, Name, Sex, Age, SibSp, Parch, Ticket, Fare, Cabin, Embarked`.

## 3. Objetivos del análisis (candidatos, apoyados en variables existentes)
O1. Describir la composición de la población por `Sex`, `Pclass` y `Embarked`.
O2. Medir la tasa de supervivencia (`Survived`) global y por subgrupos
    (sexo, clase, puerto, tamaño de familia `SibSp`+`Parch`).
O3. Analizar la relación entre `Fare`, `Pclass` y supervivencia.
O4. Analizar la distribución de `Age` y su relación con supervivencia,
    tratando explícitamente el 19.87 % de faltantes.
O5. Evaluar la cobertura de `Cabin` (77.10 % faltante) para decidir si es
    analizable o solo descriptiva.

## 4. Alcance
Dentro: perfilado, reglas de calidad, ETL, KPI y dashboards sobre las 12 columnas.
Fuera: entrenar modelos, inferir identidad/datos personales reales de pasajeros,
imputar o deducir valores sin regla documentada.

## 5. Supuestos y decisiones pendientes (para el usuario)
A1. `Survived` se trata como la variable de resultado principal; `Pclass` y `Sex`
    como dimensiones. (Si se desea otro enfoque, indicarlo.)
A2. `Ticket` y `Cabin` se usan como agrupadores/atributos descriptivos, no como
    claves, hasta que el paso 02 fije reglas.
A3. El dataset es un ejemplo genérico; no requiere geografía, familia ni ingresos
    inventados (AGENTS.md).

## 6. Criterios de éxito
- Diagnóstico reproducible por script de solo lectura con hash verificado.
- Reglas de calidad con ID, evidencia y validación (paso 02).
- Trazabilidad pregunta → evidencia → decisión → KPI → dashboard mantenida.
