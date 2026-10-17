# Decisiones de comunicación

ESTADO: GENERADO
PASO: 10
VERSION: 1
DOCUMENTO SECUNDARIO DE: paso 10
(documento principal: `proyecto/03_decisiones/06_decisiones_dashboards.md`)
DOCUMENTOS RELACIONADOS:
- `proyecto/02_analisis/08_propuesta_dashboards.md` (vistas D1..D4)
- `proyecto/02_analisis/07_propuesta_kpi.md` (catálogo y fórmulas)
- `proyecto/03_trazabilidad.csv` (filas T10-01..T10-10)

## 0. Alcance
Fijar **qué dice** cada vista y **cómo se dice**: títulos, mensajes y
advertencias. No se construye nada; son reglas de redacción para los pasos de
implementación. Todo mensaje se apoya en un valor ya verificado del paso 09.

## 1. Nudo argumental (data-storytelling)
El arco común a las cuatro vistas: **contexto → tensión → lectura**.
- **Contexto:** 891 pasajeros; 342 sobrevivieron (38.38 %).
- **Tensión:** la supervivencia no es plana: cambia con el sexo, la clase, el
  tamaño del grupo y la cabina registrada.
- **Lectura:** dónde se concentra la diferencia y con cuánta base (`n`) se
  puede afirmar cada cosa.

## 2. Decisiones de comunicación

### D10-C01 — El título de cada vista enuncia el hallazgo, no la variable
| Vista | Título propuesto | Evita |
|---|---|---|
| D1 | "342 de 891 pasajeros sobrevivieron (38.38 %)" | un título neutro tipo "Supervivencia global" |
| D2 | "El sexo pesa más que la clase, y se suman" | dejar que el lector adivine el patrón |
| D3 | "Los grupos de 2 a 4 personas sobreviven más" | afirmar causalidad |
| D4 | "Solo el 22.90 % tiene cabina registrada" | presentar `Cubierta` como dato completo |

### D10-C02 — Toda tasa se acompaña de su base
Ningún porcentaje aparece sin su `numerador/denominador`. Ej.: "74.20 %
(233/314)", "22.90 % (204/891)". En las vistas con filtro, se muestra el `n`
del subconjunto **vigente**. Motivo: el mismo 100 % puede ser 1 de 1.

### D10-C03 — Lenguaje descriptivo, sin causalidad ni juicio
Verbos permitidos: "sobrevivió", "se concentra", "la tasa es", "coincide con".
Verbos prohibidos: "causó", "demuestra", "debido a", "culpa de".
Advertencia fija donde aplique: "asociación observada en este dataset; no
implica causa". Se redacta en tercera persona y en presente.

### D10-C04 — Marcas de incertidumbre obligatorias
- `n < 10`: "n<10: no interpretable" junto a la marca (`G` n=4, `T` n=1,
  `Otros` n=23 se señaliza por su composición heterogénea).
- `Cubierta`: "base 204 de 891 (22.90 %); el 77.10 % restante es dato ausente,
  no una categoría".
- `Fare == 0` (15 casos): "no implica viaje gratuito; es un valor de tarifa
  no informativo".
- Faltantes: `Age` 177 (19.87 %), `Cabin` 687 (77.10 %), `Embarked` 2 (0.22 %),
  declarados como ausencia, nunca imputados.

### D10-C05 — Terminología estable
Se usa el mismo nombre de variable en las cuatro vistas y en los tooltips, tal
como figuran en `11_indicadores.csv`: `Sex`, `Pclass`, `Embarked`,
`TamanoFamilia`, `Titulo`, `Cubierta`, `BanderaSinCabin`, `BanderaSinAge`.
`Cubierta` ≠ "clase"; `Pclass` es la clase del billete, no una clase social.

### D10-C06 — Estados vacíos con mensaje útil
- Sin filas por filtro: "Sin pasajeros con estos filtros. Quita un filtro para
  ver resultados."
- Sin cabina en la selección: "Ningún pasajero de esta selección tiene cabina
  registrada."
- Error de datos: "No se pudo leer el dataset. No se muestra ningún valor."
Nunca se muestra un gráfico vacío sin explicación ni un cero engañoso.

### D10-C07 — Cierre con siguiente pregunta, no con conclusión cerrada
Cada vista termina apuntando a la vista siguiente (ej. D1 → D2: "¿Dónde se
concentra la diferencia?") en lugar de sentenciar una conclusión final.

## 3. Estado
Comunicación del paso 10 **GENERADA** (v1). Son reglas de redacción para la
implementación; no se construyó ninguna vista.
