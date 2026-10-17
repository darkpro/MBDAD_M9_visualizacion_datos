# Visualización de Datos — aprobación incluida en el siguiente prompt

## Reglas generales
Proyecto genérico: depuración, ETL, enriquecimiento, KPI y cuatro dashboards D3.js. No entrenar modelos. Los temas dependen de los datos; Titanic es solo un ejemplo. Todos los artefactos del caso se guardan en las cuatro carpetas de proyecto/. Skills instalados manualmente según INSTALACION.md o copias originales incluidas en las versiones inicial/completa. No instalar skills automáticamente.

## Autorización de cada paso
Ejecuta SOLO el /pasoXX enviado por el usuario. No encadenes pasos. El paso 01 no aprueba resultados anteriores. Cada prompt del 02 al 15 contiene explícitamente la aprobación del paso inmediatamente anterior y la autorización exclusiva del paso actual. Enviar el comando equivale a enviar ese prompt completo. El usuario no necesita cambiar estados en archivos ni editar JSON.
La aprobación incluida solo aplica si existen los resultados y decisiones correspondientes, se sabe qué versión se está aprobando y no hay fallos bloqueantes. Si faltan artefactos, hay alternativas sin resolver, cambió su versión o la validación falló, explica el bloqueo y detente: no inventes resultados ni utilices el texto de aprobación para saltar controles.

## Registro sin solicitudes duplicadas
Al producir los archivos de un paso, usa ESTADO: GENERADO, PASO y VERSION en su documento principal. Relaciona los archivos secundarios incluidos en la revisión y sus versiones. Los documentos secundarios no requieren otra aprobación aparte. Las decisiones tienen IDs, evidencia y justificación.
Cuando el usuario envía el siguiente prompt, registra en el documento principal anterior ESTADO: APROBADO y la referencia real al prompt recibido, los archivos/versiones cubiertos y sus IDs. No marques aprobaciones futuras. No inventes un historial retrospectivo en el ejemplo completo.
No uses human_review ni solicitudes PENDING por archivo o por decisión. El checkpoint es técnico y lo mantiene OpenCode: current_step, technical_status, documentos, versiones y registro compacto de aprobaciones realmente recibidas. No pidas al usuario editarlo.

## Correcciones y cierre
Una solicitud de corrección no aprueba ni autoriza avanzar. Si cambia una propuesta, incrementa VERSION y déjala GENERADO; identifica qué resultados posteriores necesitan revisión. Conserva la aprobación de versiones anteriores como historial, sin trasladarla a la nueva versión. Si una prueba falla, registra REQUIERE_CAMBIOS y detente.
Al terminar un paso, resume resultados y validaciones y di una vez: “Si estás conforme, envía /pasoSIGUIENTE; ese prompt aprueba este resultado”. Detente sin ejecutar ese comando. No pidas otra confirmación después de recibir un prompt válido que ya contiene la aprobación.
Tras paso 15, el usuario puede enviar “Apruebo los resultados del paso 15 y la entrega final. Registra la aceptación y cierra el checkpoint sin modificar datos ni código”. Solo entonces registra esa aceptación. No publiques nada.

## Calidad
Preservar originales y hash. No imputar, borrar ni deduplicar por defecto. Comprobar unidad de análisis, variables, fórmulas, denominadores, nulos y cobertura. No inventar geografía, familia ni ingresos. Separar análisis/propuesta de implementación. Solo los pasos de implementación aplican las decisiones aprobadas por el prompt anterior. Mantener trazabilidad pregunta → evidencia → decisión → KPI → código → dashboard.
