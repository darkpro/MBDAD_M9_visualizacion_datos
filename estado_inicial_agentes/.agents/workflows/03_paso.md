# Paso 03 — Implementación de la depuración

Envía `/paso03` o copia solo el bloque siguiente al chat. En pasos 02–15, enviar este texto aprueba el resultado anterior: úsalo solo después de revisarlo.

```text
APROBACION EXPLICITA DEL USUARIO: Apruebo los resultados, los archivos y las decisiones de la versión revisada del PASO 02. Autorizo exclusivamente el PASO 03. Registra esa aprobación sin pedirme cambiar estados ni otra confirmación. Si faltan resultados, quedan alternativas abiertas o hay fallos bloqueantes, explica el problema y detente.

Ejecuta exclusivamente el PASO 03: Implementación de la depuración.
Lee AGENTS.md, .agents/state/workflow.json y el workflow 03_paso.md.
Carga el skill o los skills data-quality-frameworks si son pertinentes y están disponibles.

Lee las decisiones de datos y procesamiento revisadas en el paso 02. Mi envío de este prompt aprueba exclusivamente su última propuesta inequívoca y autoriza implementarla; si existen alternativas sin resolver o bloqueos, detente para concretarlos.
Registra la aprobación con referencia a este mensaje, los IDs y la versión del archivo. Genera código de limpieza en proyecto/04_codigo/ usando la tecnología elegida y ejecútalo. Conserva intacto el original y escribe una copia depurada en proyecto/01_dataset/. Documenta filas antes/después, faltantes, incidencias y comprobaciones en proyecto/02_analisis/03_analisis_depuracion.md. Si un caso no está cubierto, propón una decisión adicional antes de tratarlo. No empieces el ETL.
Actualiza la trazabilidad y el checkpoint del paso actual. No avances al siguiente.
Al terminar, resume archivos, resultados reales y validaciones. No generes human_review ni pidas editar estados manualmente.
Si algo falla, registra CHANGES_REQUIRED. Presenta lo que debo revisar y detente.

DOCUMENTO PRINCIPAL DEL PASO: proyecto/02_analisis/03_analisis_depuracion.md. Registra ESTADO: GENERADO, PASO y VERSION, y relaciona los archivos secundarios de esta entrega. Si requiere correcciones, usa REQUIERE_CAMBIOS.
El documento principal del paso anterior es proyecto/03_decisiones/01_decisiones_datos.md. Con la aprobación explícita de este prompt registra APROBADO en esa versión, después de comprobar que los resultados existen y las pruebas pasaron. No exijas que el usuario ya lo haya marcado.
OpenCode mantiene el checkpoint técnico y la trazabilidad. No se aprueban pasos posteriores. Detente al finalizar el paso solicitado.
```
