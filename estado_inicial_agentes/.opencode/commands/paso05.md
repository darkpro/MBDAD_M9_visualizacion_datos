---
description: "Paso 05 — Implementación del ETL"
subtask: false
---

APROBACION EXPLICITA DEL USUARIO: Apruebo los resultados, los archivos y las decisiones de la versión revisada del PASO 04. Autorizo exclusivamente el PASO 05. Registra esa aprobación sin pedirme cambiar estados ni otra confirmación. Si faltan resultados, quedan alternativas abiertas o hay fallos bloqueantes, explica el problema y detente.

Ejecuta exclusivamente el PASO 05: Implementación del ETL.
Lee AGENTS.md, .agents/state/workflow.json y el workflow 05_paso.md.
Carga el skill o los skills polars si son pertinentes y están disponibles.

Lee las decisiones del ETL del paso 04. Mi envío de este prompt aprueba su propuesta inequívoca y autoriza exclusivamente implementarla; no resuelvas alternativas abiertas por tu cuenta.
Registra la aprobación, genera o modifica código en proyecto/04_codigo/, ejecuta el ETL y guarda la copia procesada en proyecto/01_dataset/. Verifica esquema, conteos, claves, uniones y reglas acordadas. Actualiza el informe del ETL y la trazabilidad con resultados reales. No implementes enriquecimientos ni calcules KPI todavía.
Actualiza la trazabilidad y el checkpoint del paso actual. No avances al siguiente.
Al terminar, resume archivos, resultados reales y validaciones. No generes human_review ni pidas editar estados manualmente.
Si algo falla, registra CHANGES_REQUIRED. Presenta lo que debo revisar y detente.

DOCUMENTO PRINCIPAL DEL PASO: proyecto/02_analisis/04_analisis_etl.md. Registra ESTADO: GENERADO, PASO y VERSION, y relaciona los archivos secundarios de esta entrega. Si requiere correcciones, usa REQUIERE_CAMBIOS.
El documento principal del paso anterior es proyecto/03_decisiones/10_decisiones_etl.md. Con la aprobación explícita de este prompt registra APROBADO en esa versión, después de comprobar que los resultados existen y las pruebas pasaron. No exijas que el usuario ya lo haya marcado.
OpenCode mantiene el checkpoint técnico y la trazabilidad. No se aprueban pasos posteriores. Detente al finalizar el paso solicitado.
