---
description: "Paso 07 — Implementación del enriquecimiento"
subtask: false
---

APROBACION EXPLICITA DEL USUARIO: Apruebo los resultados, los archivos y las decisiones de la versión revisada del PASO 06. Autorizo exclusivamente el PASO 07. Registra esa aprobación sin pedirme cambiar estados ni otra confirmación. Si faltan resultados, quedan alternativas abiertas o hay fallos bloqueantes, explica el problema y detente.

Ejecuta exclusivamente el PASO 07: Implementación del enriquecimiento.
Lee AGENTS.md, .agents/state/workflow.json y el workflow 07_paso.md.
Carga el skill o los skills polars si son pertinentes y están disponibles.

Lee las decisiones de enriquecimiento del paso 06. Mi envío de este prompt aprueba su propuesta inequívoca y autoriza implementar únicamente las variables y fuentes aprobadas.
Registra la aprobación y genera código reproducible en proyecto/04_codigo/. Guarda el dataset enriquecido en proyecto/01_dataset/, actualiza su diccionario y documenta cobertura, faltantes y validaciones de fórmulas y uniones. No sobrescribas el original ni infieras valores sin reglas acordadas. Si no se aprobaron enriquecimientos, conserva una copia y documenta que no hubo cambios. No definas KPI por adelantado.
Actualiza la trazabilidad y el checkpoint del paso actual. No avances al siguiente.
Al terminar, resume archivos, resultados reales y validaciones. No generes human_review ni pidas editar estados manualmente.
Si algo falla, registra CHANGES_REQUIRED. Presenta lo que debo revisar y detente.

DOCUMENTO PRINCIPAL DEL PASO: proyecto/02_analisis/05_analisis_enriquecimiento.md. Registra ESTADO: GENERADO, PASO y VERSION, y relaciona los archivos secundarios de esta entrega. Si requiere correcciones, usa REQUIERE_CAMBIOS.
El documento principal del paso anterior es proyecto/03_decisiones/04_decisiones_enriquecimiento.md. Con la aprobación explícita de este prompt registra APROBADO en esa versión, después de comprobar que los resultados existen y las pruebas pasaron. No exijas que el usuario ya lo haya marcado.
OpenCode mantiene el checkpoint técnico y la trazabilidad. No se aprueban pasos posteriores. Detente al finalizar el paso solicitado.
