---
description: "Paso 01 — Diagnóstico del dataset"
subtask: false
---

Ejecuta exclusivamente el PASO 01: Diagnóstico del dataset.
Lee AGENTS.md, .agents/state/workflow.json y el workflow 01_paso.md.
Carga el skill o los skills exploratory-data-analysis si son pertinentes y están disponibles.

Identifica los archivos fuente de proyecto/01_dataset/. Excluye copias derivadas. Si hay varias fuentes posibles, presenta el inventario y detente para que elija; no selecciones silenciosamente. Determina formato, hojas, columnas, tipos, unidad de análisis, identificadores, faltantes, dominios y posibles duplicados. Registra fuente y hash del original. No asumas nombres de columnas ni que el dataset es Titanic.
Propón preguntas descriptivas según los datos y distingue objetivos explícitos de supuestos pendientes de confirmar. Guarda proyecto/02_analisis/01_contexto_objetivos.md y 02_diagnostico_dataset.md. Solo puedes crear código exploratorio de lectura si es necesario; no limpies datos ni construyas todavía el pipeline.
Actualiza la trazabilidad y el checkpoint del paso actual. No avances al siguiente.
Al terminar, resume archivos, resultados reales y validaciones. No generes human_review ni pidas editar estados manualmente.
Si algo falla, registra CHANGES_REQUIRED. Presenta lo que debo revisar y detente.

DOCUMENTO PRINCIPAL DEL PASO: proyecto/02_analisis/02_diagnostico_dataset.md. Registra ESTADO: GENERADO, PASO y VERSION, y relaciona los archivos secundarios de esta entrega. Si requiere correcciones, usa REQUIERE_CAMBIOS.
OpenCode mantiene el checkpoint técnico y la trazabilidad. No se aprueban pasos posteriores. Detente al finalizar el paso solicitado.
