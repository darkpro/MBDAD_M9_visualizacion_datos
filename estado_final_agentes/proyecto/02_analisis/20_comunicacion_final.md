# Comunicación final de la entrega

ESTADO: GENERADO
PASO: 15
VERSION: 1
DOCUMENTO SECUNDARIO DE: paso 15
DOCUMENTO PRINCIPAL: proyecto/02_analisis/10_validacion_final.md
APROBACIÓN DEL PASO 14: registrada en
`proyecto/02_analisis/19_validacion_tematico_3.md` (v1, APROBADO) con la
aprobación explícita del prompt del paso 15.

## 1. Para quién se comunica
- **Audiencia principal**: quien decide sobre pasajeros/seguridad (perfil de
  operación), no estadístico. Vocabulario llano, sin jerga.
- **Audiencia secundaria**: quien audita la entrega (revisor técnico). Necesita
  los números con su numerador/denominador y la distinción probado/no comprobado,
  que viven en `10_validacion_final.md`.
- **Regla de tono**: enunciar el hallazgo, no la metodología. El método va después.

## 2. Narrativa entre vistas (arco)
La entrega se lee como un solo relato de tres pasos, enlazado por el router de
hash (D10-05): cada vista responde una pregunta y prepara la siguiente.

1. **Hook — D1 (Resumen)**. "342 de 891 pasajeros sobrevivieron (38.38 %)". Es
   el titular del caso: la supervivencia no es mayoritaria. Las 4 tarjetas dan
   el contexto (supervivientes, tasa, mujeres, niños) y los filtros dejan
   aislar subgrupos.
2. **Rising action — D2 (Sexo y clase)**. "La brecha por sexo se mantiene en las
   tres clases (de 36.46 a 76.37 pp)". Baja del total al subgrupo y muestra que
   la brecha no es un artefacto de una sola clase.
3. **Rising action — D3 (Familia y título)**. "El título separa más que el
   tamaño: de 15.67 % (Mr) a 73.95 % (Mujer)". Compara dos formas de agrupar
   pasajeros y concluye que el título (proxy de rol) separa más que el tamaño de
   familia.
4. **Climax — D4 (Cabina y calidad)**. "Solo el 22.90 % del pasaje tiene cabina
   registrada". El cierre no es una tasa más: es una **advertencia sobre el
   dato**. Recuerda que 687 de 891 (77.10 %) no tienen cabina, que eso es dato
   ausente y no un grupo, y que la tasa por cubierta descansa en una base
   pequeña (204) con dos cubiertas no interpretables (`G` n=4, `T` n=1).
5. **Resolución / Call to action**. Leer D1-D3 como descripción y D4 como su
   límite: cualquier conclusión por cubierta es indicativa, no concluyente. El
   siguiente paso es decidir si hace falta más precisión en cabina antes de
   usarla para decisiones.

## 3. Los tres hallazgos que se comunican
1. **Sexo es el eje que más separa**, y la brecha es estable entre clases (D2).
2. **El título (rol) separa más que el tamaño de familia** (D3).
3. **La cobertura de cabina es baja (22.90 %)**: los 687 sin cabina son dato
   ausente, no un grupo; la tasa por cubierta es orientativa (D4).

Cada hallazgo se enuncia como tasa con su `numerador/denominador` (D10-C02) en
un eje fijo 0-100 % (D10-03), sin semáforos.

## 4. Limitaciones que la audiencia debe oír
- **Sin imputación**: `Age` (177), `Cabin` (687) y `Embarked` (2) se publican
  como faltantes; las tasas son sobre casos observados, no sobre el total.
- **Base pequeña en D4**: `G`/`T` no interpretables (n<10); `sin_cabin_ref`
  (n=687) es referencia aparte, fuera de la base 204.
- **Filtros de sesión, no de URL**: se conservan al navegar entre vistas, pero
  recargar vuelve al estado inicial.
- **Dependencia de red y HTTP**: D3.js v7 por CDN y `fetch` del CSV exigen
  servidor HTTP.
- **Alcance**: los hallazgos son del dataset de ejemplo (Titanic); el pipeline es
  genérico y no entrena modelos.

## 5. Qué no se afirma
- No se afirma causalidad: se describen asociaciones del dataset.
- No se infiere geografía, familia real ni ingresos.
- No se declara "terminado" más allá de lo probado: la capa de dibujo y la
  accesibilidad se validaron de forma básica (ver §9 de
  `10_validacion_final.md`).

## 6. Trazabilidad
Filas `T15-01..T15-07` en `proyecto/03_trazabilidad.csv`. El detalle de cifras,
SHA256 y evidencia reproducible está en el documento principal
`proyecto/02_analisis/10_validacion_final.md`.

## 7. Estado
PASO 15 **GENERADO** (v1). Comunicación redactada y alineada con las cifras
validadas. Sin fallos bloqueantes. Pendiente la aceptación final del usuario
(mensaje de cierre descrito en `AGENTS.md`); no se avanza a ningún paso posterior.
