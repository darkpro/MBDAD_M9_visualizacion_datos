// check runnable (node _check_datos.mjs)
// Verifica la agregacion del front contra el baseline 11_indicadores.csv (paso 09).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseCsv, agregar, filtrar, filasDe, tasa, bandaTamano, tituloAgrupado, cruce, faltantes, D1, D2, D3, D4, UMBRAL_N } from './datos.js';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, '..', '..', '..');
const filas = parseCsv(readFileSync(join(raiz, 'proyecto', '01_dataset', 'Titanic-Dataset_enriquecido.csv'), 'utf8'));
const base = parseCsv(readFileSync(join(raiz, 'proyecto', '02_analisis', '11_indicadores.csv'), 'utf8'));

let ok = 0;
const eq = (etiqueta, a, b) => {
  if (a !== b) throw new Error(`FALLO ${etiqueta}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`);
  ok += 1;
};

// 1. Integridad de la lectura
eq('filas=891', filas.length, 891);
eq('columnas=18', Object.keys(filas[0]).length, 18);

// 2. Agregacion sin filtros == baseline del paso 09
const agg = agregar(filas, {});
eq('kpi_filas=24', agg.filas.length, 24);
eq('n global=891', agg.n, 891);
const red = (x) => (x === '' || x === null ? '' : Math.round(x * 100) / 100);
for (const b of base) {
  const m = agg.filas.find((r) => r.KPI === b.KPI && r.grupo === b.grupo);
  if (!m) throw new Error(`FALLO falta ${b.KPI}/${b.grupo}`);
  eq(`${b.KPI}/${b.grupo}/num`, Number(m.numerador) || 0, Number(b.numerador) || 0);
  eq(`${b.KPI}/${b.grupo}/den`, Number(m.denominador) || 0, Number(b.denominador) || 0);
  eq(`${b.KPI}/${b.grupo}/pct`, red(m.valor_pct), red(Number(b.valor_pct)));
  ok += 1;
}

// 3. Seleccion de KPIs del principal (D10-01): sin KPI-05 ni KPI-07
eq('D1.kpis', D1.kpis.join(','), 'KPI-01,KPI-02,KPI-03,KPI-04,KPI-06');
eq('D1.barras', D1.barras.join(','), 'KPI-02,KPI-03,KPI-04');

// 4. Filtro antes de agregar: recalcula el denominador
const fem = agregar(filas, { Sex: 'female' });
eq('female n=314', fem.n, 314);
eq('female KPI-01 num=233', Number(fem.filas.find((r) => r.KPI === 'KPI-01').numerador), 233);
const dummy = filtrar(filas, { Sex: '__nada__' });
eq('filtro imposible n=0', dummy.length, 0);
eq('tasa(0,0)=null', tasa(0, 0), null);
eq('KPI-01 vacio pct=null', agregar(filas, { Sex: '__nada__' }).filas.find((r) => r.KPI === 'KPI-01').valor_pct, null);

// 5. Reglas de agrupacion y bandas
eq('banda 4', bandaTamano('4'), '2-4');
eq('banda 5', bandaTamano('5'), '5+');
eq('banda 11', bandaTamano('11'), '5+');
eq('banda 1', bandaTamano('1'), '1');
eq('titulo Miss', tituloAgrupado('Miss'), 'Mujer');
eq('titulo Mrs', tituloAgrupado('Mrs'), 'Mujer');
eq('titulo Dr', tituloAgrupado('Dr'), 'Otros');
eq('umbral n', UMBRAL_N, 10);
eq('G marcada n<10', agregar(filas, {}).filas.find((r) => r.KPI === 'KPI-07' && r.grupo === 'G').nota, 'n<10: no interpretable');
eq('A sin marca n<10', agregar(filas, {}).filas.find((r) => r.KPI === 'KPI-07' && r.grupo === 'A').nota, '');

// 6. Cruce Sex x Pclass (D2, paso 12): no existe en el baseline, se fija aqui.
eq('D2.kpis', D2.kpis.join(','), 'KPI-02,KPI-03');
eq('D2.filtros', D2.filtros.join(','), 'Sex,Pclass,Embarked');
const cr = cruce(filas, {});
eq('cruce n=891', cr.n, 891);
eq('cruce celdas=6', cr.celdas.length, 6);
const esperado = {
  'female|1': [91, 94, 96.81], 'male|1': [45, 122, 36.89],
  'female|2': [70, 76, 92.11], 'male|2': [17, 108, 15.74],
  'female|3': [72, 144, 50.0], 'male|3': [47, 347, 13.54],
};
for (const c of cr.celdas) {
  const [num, den, pct] = esperado[`${c.Sex}|${c.Pclass}`];
  eq(`cruce ${c.grupo}/num`, Number(c.numerador), num);
  eq(`cruce ${c.grupo}/den`, Number(c.denominador), den);
  eq(`cruce ${c.grupo}/pct`, red(c.valor_pct), pct);
}
eq('cruce suma num=342', cr.celdas.reduce((s, c) => s + Number(c.numerador), 0), 342);
eq('cruce suma den=891', cr.celdas.reduce((s, c) => s + Number(c.denominador), 0), 891);
const soloFem = cruce(filas, { Sex: 'female' });
eq('cruce female n=314', soloFem.n, 314);
eq('cruce female celdas male den=0', soloFem.celdas.find((c) => c.Sex === 'male').denominador, 0);
eq('cruce female celdas male pct=null', soloFem.celdas.find((c) => c.Sex === 'male').valor_pct, null);
eq('cruce female celdas male nota', soloFem.celdas.find((c) => c.Sex === 'male').nota, 'sin casos');
eq('cruce vacio n=0', cruce(filas, { Sex: '__nada__' }).n, 0);

// 7. Vista D3 (paso 13, D10-01): familia (KPI-04) y titulo (KPI-05), ambos en el baseline
eq('D3.kpis', D3.kpis.join(','), 'KPI-04,KPI-05');
eq('D3.barras', D3.barras.join(','), 'KPI-04,KPI-05');
eq('D3.filtros', D3.filtros.join(','), 'Sex,Pclass,Embarked,TamanoFamilia');
const rk4 = agg.filas.filter((r) => r.KPI === 'KPI-04');
const rk5 = agg.filas.filter((r) => r.KPI === 'KPI-05');
eq('KPI-04 suma den=891', rk4.reduce((s, r) => s + Number(r.denominador), 0), 891);
eq('KPI-05 suma den=891', rk5.reduce((s, r) => s + Number(r.denominador), 0), 891);
eq('KPI-04 2-4 pct=57.88', red(rk4.find((r) => r.grupo === '2-4').valor_pct), 57.88);
eq('KPI-05 Mujer num=230', Number(rk5.find((r) => r.grupo === 'Mujer').numerador), 230);
eq('KPI-05 Mujer den=311', Number(rk5.find((r) => r.grupo === 'Mujer').denominador), 311);
// TamanoFamilia es filtro de la vista: agregar recorta el denominador antes de calcular
const solo24 = agregar(filas, { TamanoFamilia: '2-4' });
eq('filtro TamanoFamilia=2-4 n=292', solo24.n, 292);
eq('filtro 2-4 KPI-04 2-4 num=169', Number(solo24.filas.find((r) => r.KPI === 'KPI-04' && r.grupo === '2-4').numerador), 169);
eq('filtro 2-4 deja KPI-04 grupo 1 vacio n=0', solo24.filas.find((r) => r.KPI === 'KPI-04' && r.grupo === '1').denominador, 0);
eq('filtro 2-4 KPI-05 suma den=292', solo24.filas.filter((r) => r.KPI === 'KPI-05').reduce((s, r) => s + Number(r.denominador), 0), 292);

// 8. Vista D4 (paso 14, D10-01/D10-07): cabina (KPI-06) y calidad (KPI-07 + faltantes)
eq('D4.kpis', D4.kpis.join(','), 'KPI-06,KPI-07');
eq('D4.barras', D4.barras.join(','), 'KPI-07');
eq('D4.filtros', D4.filtros.join(','), 'Sex,Pclass,Embarked,Cubierta');
const k6 = filasDe('KPI-06', agg)[0];
eq('KPI-06 num=204', Number(k6.numerador), 204);
eq('KPI-06 den=891', Number(k6.denominador), 891);
eq('KPI-06 pct=22.9', red(k6.valor_pct), 22.9);
const k7 = {};
for (const r of filasDe('KPI-07', agg)) k7[r.grupo] = r;
const exp7 = {
  A: [7, 15, 46.67], B: [35, 47, 74.47], C: [35, 59, 59.32], D: [25, 33, 75.76],
  E: [24, 32, 75.0], F: [8, 13, 61.54], G: [2, 4, 50.0], T: [0, 1, 0.0],
};
for (const [g, [num, den, pct]] of Object.entries(exp7)) {
  eq(`KPI-07 ${g}/num`, Number(k7[g].numerador), num);
  eq(`KPI-07 ${g}/den`, Number(k7[g].denominador), den);
  eq(`KPI-07 ${g}/pct`, red(k7[g].valor_pct), pct);
}
eq('KPI-07 suma den A-T=204', 'ABCDEFGT'.split('').reduce((s, g) => s + Number(k7[g].denominador), 0), 204);
eq('KPI-07 G nota n<10', k7.G.nota, 'n<10: no interpretable');
eq('KPI-07 T nota n<10', k7.T.nota, 'n<10: no interpretable');
eq('KPI-07 A sin nota', k7.A.nota, '');
eq('KPI-07 ref num=206', Number(k7.sin_cabin_ref.numerador), 206);
eq('KPI-07 ref den=687', Number(k7.sin_cabin_ref.denominador), 687);
eq('KPI-07 ref pct=29.99', red(k7.sin_cabin_ref.valor_pct), 29.99);
eq('KPI-07 ref nota', k7.sin_cabin_ref.nota, 'referencia: no entra en la base 204');
// faltantes: calidad del dato sobre la n vigente (sin filtros)
const fal = faltantes(filas, {});
eq('faltantes n=891', fal.n, 891);
eq('faltantes filas=3', fal.filas.length, 3);
const falDe = (grupo) => fal.filas.find((r) => r.grupo === grupo);
eq('sin Age num=177', Number(falDe('sin Age').numerador), 177);
eq('sin Age den=891', Number(falDe('sin Age').denominador), 891);
eq('sin Cabin num=687', Number(falDe('sin Cabin').numerador), 687);
eq('sin Cabin pct=77.1', red(falDe('sin Cabin').valor_pct), 77.1);
eq('sin Embarked num=2', Number(falDe('sin Embarked').numerador), 2);
eq('faltantes KPI=calidad', falDe('sin Age').KPI, 'calidad');
// filtro antes de agregar: recorta KPI-06 y KPI-07
const soloA = agregar(filas, { Cubierta: 'A' });
eq('Cubierta=A n=15', soloA.n, 15);
eq('Cubierta=A KPI-07 A den=15', Number(filasDe('KPI-07', soloA).find((r) => r.grupo === 'A').denominador), 15);
const femCab = agregar(filas, { Sex: 'female' });
eq('female KPI-06 den=314', Number(filasDe('KPI-06', femCab)[0].denominador), 314);
eq('female KPI-06 num=97', Number(filasDe('KPI-06', femCab)[0].numerador), 97);
// faltantes tambien respetan el filtro: con Cubierta=A nadie carece de cabina
const falA = faltantes(filas, { Cubierta: 'A' });
eq('faltantes Cubierta=A n=15', falA.n, 15);
eq('faltantes Cubierta=A sin Cabin=0', Number(falA.filas.find((r) => r.grupo === 'sin Cabin').numerador), 0);

const fac = { cobertura: [k6], faltantes: fal.filas };
eq('D4 cobertura sin cabina=687', Number(k6.denominador) - Number(k6.numerador), fac.faltantes.find((r) => r.grupo === 'sin Cabin').numerador);

console.log(`CHECK OK | asserts=${ok} | kpi_filas=${agg.filas.length} | n=${agg.n}`);
