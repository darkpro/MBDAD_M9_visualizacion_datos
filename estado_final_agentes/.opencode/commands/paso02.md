---
description: "Paso 02 — Decisiones de datos y procesamiento"
subtask: false
---

APROBACION EXPLICITA DEL USUARIO: Apruebo los resultados, los archivos y las decisiones de la versión revisada del PASO 01. Autorizo exclusivamente el PASO 02. Registra esa aprobación sin pedirme cambiar estados ni otra confirmación. Si faltan resultados, quedan alternativas abiertas o hay fallos bloqueantes, explica el problema y detente.

Ejecuta exclusivamente el PASO 02: Decisiones de datos y procesamiento.
Lee AGENTS.md, .agents/state/workflow.json y el workflow 02_paso.md.
Carga el skill o los skills data-quality-frameworks si son pertinentes y están disponibles.

Lee el contexto y el diagnóstico del paso 01. Propón reglas de calidad y depuración: problema, evidencia, acción, columnas afectadas, impacto esperado y validación. No elimines filas, imputes ni deduzcas claves sin justificación.
Compara tecnologías de procesamiento apropiadas y documenta la seleccionada provisionalmente en proyecto/03_decisiones/02_decision_tecnologica.md. D3.js es la tecnología visual acordada; Python o R para procesamiento no están impuestos al caso genérico. Guarda las reglas en 01_decisiones_datos.md. Asigna IDs, estado GENERADO, referencias y versión. Crea o actualiza 03_trazabilidad.csv. No modifiques todavía el dataset ni implementes la depuración.
Actualiza la trazabilidad y el checkpoint del paso actual. No avances al siguiente.
Al terminar, resume archivos, resultados reales y validaciones. No generes human_review ni pidas editar estados manualmente.
Si algo falla, registra CHANGES_REQUIRED. Presenta lo que debo revisar y detente.

DOCUMENTO PRINCIPAL DEL PASO: proyecto/03_decisiones/01_decisiones_datos.md. Registra ESTADO: GENERADO, PASO y VERSION, y relaciona los archivos secundarios de esta entrega. Si requiere correcciones, usa REQUIERE_CAMBIOS.
El documento principal del paso anterior es proyecto/02_analisis/02_diagnostico_dataset.md. Con la aprobación explícita de este prompt registra APROBADO en esa versión, después de comprobar que los resultados existen y las pruebas pasaron. No exijas que el usuario ya lo haya marcado.
OpenCode mantiene el checkpoint técnico y la trazabilidad. No se aprueban pasos posteriores. Detente al finalizar el paso solicitado.
