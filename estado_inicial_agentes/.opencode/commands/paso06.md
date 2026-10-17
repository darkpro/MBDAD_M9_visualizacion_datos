---
description: "Paso 06 — Decisiones de enriquecimiento"
subtask: false
---

APROBACION EXPLICITA DEL USUARIO: Apruebo los resultados, los archivos y las decisiones de la versión revisada del PASO 05. Autorizo exclusivamente el PASO 06. Registra esa aprobación sin pedirme cambiar estados ni otra confirmación. Si faltan resultados, quedan alternativas abiertas o hay fallos bloqueantes, explica el problema y detente.

Ejecuta exclusivamente el PASO 06: Decisiones de enriquecimiento.
Lee AGENTS.md, .agents/state/workflow.json y el workflow 06_paso.md.
Carga el skill o los skills polars si son pertinentes y están disponibles.

Examina los datos procesados y las preguntas del análisis. Propón variables derivadas o fuentes adicionales útiles: nombre, significado, fórmula o unión, entradas necesarias, reglas para faltantes, fuente, cobertura esperada y límites.
No inventes geografía, parentesco ni categorías. Si no hay enriquecimientos justificables, documenta la decisión de conservar los datos. Guarda análisis en proyecto/02_analisis/05_analisis_enriquecimiento.md y decisiones propuestas en proyecto/03_decisiones/04_decisiones_enriquecimiento.md. No crees aún las nuevas variables.
Actualiza la trazabilidad y el checkpoint del paso actual. No avances al siguiente.
Al terminar, resume archivos, resultados reales y validaciones. No generes human_review ni pidas editar estados manualmente.
Si algo falla, registra CHANGES_REQUIRED. Presenta lo que debo revisar y detente.

DOCUMENTO PRINCIPAL DEL PASO: proyecto/03_decisiones/04_decisiones_enriquecimiento.md. Registra ESTADO: GENERADO, PASO y VERSION, y relaciona los archivos secundarios de esta entrega. Si requiere correcciones, usa REQUIERE_CAMBIOS.
El documento principal del paso anterior es proyecto/02_analisis/04_analisis_etl.md. Con la aprobación explícita de este prompt registra APROBADO en esa versión, después de comprobar que los resultados existen y las pruebas pasaron. No exijas que el usuario ya lo haya marcado.
OpenCode mantiene el checkpoint técnico y la trazabilidad. No se aprueban pasos posteriores. Detente al finalizar el paso solicitado.
