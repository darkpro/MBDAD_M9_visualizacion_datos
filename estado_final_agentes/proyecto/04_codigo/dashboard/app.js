// Vistas D1 (principal, paso 11), D2 (sexo x clase, paso 12) y D3 (familia y titulo, paso 13).
// Solo presentacion: toda la agregacion vive en datos.js.
// D10-05: cambiar de vista NO borra estado.filtros; al volver a D1 los filtros
// siguen puestos. D10-02: cada vista aplica solo sus filtros (TamanoFamilia es
// de D1 y D3, no de D2), asi que los chips muestran los de la vista actual.
import {
  parseCsv, agregar, filasDe, cruce, faltantes, D1, D2, D3, D4, VISTAS,
  VALORES_FILTRO, ETIQUETA_CAMPO, UMBRAL_N,
} from './datos.js';

const CSV = '../../01_dataset/Titanic-Dataset_enriquecido.csv';
const VISTA = { D1, D2, D3, D4 };
const TITULO_KPI = {
  'KPI-02': 'Supervivencia por sexo',
  'KPI-03': 'Supervivencia por clase',
  'KPI-04': 'Supervivencia por tamano de familia',
  'KPI-05': 'Supervivencia por titulo',
  'KPI-06': 'Cobertura de cabina',
  'KPI-07': 'Supervivencia por cubierta',
};
const CAMPO_DE_KPI = { 'KPI-02': 'Sex', 'KPI-03': 'Pclass', 'KPI-04': 'TamanoFamilia', 'KPI-07': 'Cubierta' };
const COLOR = ['#4E79A7', '#F28E2B', '#59A14F', '#B07AA1', '#76B7B2', '#EDC948', '#9C755F'];
const COLOR_SEXO = { female: '#4E79A7', male: '#F28E2B' };
// D10-03: cobertura y faltantes en neutros; la tasa por cubierta lleva acento.
const ACENTO = '#4E79A7';
const NEUTROS = ['#9AA5B1', '#CBD2D9'];
const GRIS = '#9AA5B1';
const ETIQUETA_SEXO = { female: 'mujer', male: 'hombre' };
const ESCALA_MATRIZ = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);

const estado = { filas: [], filtros: {}, vista: 'D1' };
let filasExport = [];
let nVigente = 0;

// D10-02: cada vista solo aplica los filtros que le tocan. estado.filtros guarda
// todos (D10-05 los conserva al ir y volver), pero un filtro de D1 no entra en D2.
const filtrosDe = (v) => Object.fromEntries(
  Object.entries(estado.filtros).filter(([campo]) => v.filtros.includes(campo)),
);

const fmtPct = (v) => (v === null || v === undefined ? 'sin base' : `${v.toFixed(2)} %`);
const poco = (n) => n < UMBRAL_N;
const crear = (etiqueta, texto) => {
  const el = document.createElement(etiqueta);
  el.textContent = texto;
  return el;
};

function vistaDesdeHash() {
  const id = (location.hash || '').replace('#', '');
  const v = VISTAS.find((x) => x.id === id && x.estado === 'implementada');
  return v ? v.id : 'D1';
}

function renderNav() {
  const nav = document.getElementById('nav');
  nav.replaceChildren(...VISTAS.map((v) => {
    const b = document.createElement('button');
    b.className = 'tab';
    b.textContent = v.estado === 'implementada' ? v.etiqueta : `${v.etiqueta} (pendiente)`;
    if (v.estado === 'implementada') {
      if (v.id === estado.vista) b.setAttribute('aria-current', 'page');
      b.addEventListener('click', () => { location.hash = v.id; });
    } else {
      b.disabled = true;
      b.title = 'pendiente (paso 14)';
    }
    return b;
  }));
}

function setFiltro(campo, valor) {
  if (valor === '') delete estado.filtros[campo];
  else estado.filtros[campo] = valor;
  actualizar();
}

function renderFiltros(v) {
  const cont = document.getElementById('filtros');
  const selects = v.filtros.map((campo) => {
    const wrap = document.createElement('label');
    wrap.className = 'filtro';
    wrap.append(`${ETIQUETA_CAMPO[campo]} `);
    const sel = document.createElement('select');
    sel.dataset.campo = campo;
    sel.append(new Option('Todos', ''));
    for (const val of VALORES_FILTRO[campo]) sel.append(new Option(val, val));
    sel.value = estado.filtros[campo] ?? '';
    sel.addEventListener('change', () => setFiltro(campo, sel.value));
    wrap.append(sel);
    return wrap;
  });

  const activos = Object.entries(filtrosDe(v));
  const chipRow = document.createElement('div');
  chipRow.className = 'chips';
  chipRow.replaceChildren(...activos.map(([campo, valor]) => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = `${ETIQUETA_CAMPO[campo]}=${valor} ×`;
    b.setAttribute('aria-label', `Quitar filtro ${ETIQUETA_CAMPO[campo]}=${valor}`);
    b.addEventListener('click', () => { delete estado.filtros[campo]; actualizar(); });
    return b;
  }));

  const limpiar = document.createElement('button');
  limpiar.className = 'chip limpiar';
  limpiar.textContent = 'Limpiar';
  limpiar.hidden = activos.length === 0;
  limpiar.addEventListener('click', () => {
    for (const campo of v.filtros) delete estado.filtros[campo];
    actualizar();
  });

  cont.replaceChildren(...selects, chipRow, limpiar);
}

function tarjeta(etiqueta, valor, detalle) {
  const d = document.createElement('div');
  d.className = 'tarjeta';
  d.append(
    Object.assign(crear('span', etiqueta), { className: 'etiqueta' }),
    crear('strong', valor),
    Object.assign(crear('span', detalle), { className: 'detalle' }),
  );
  return d;
}

function renderTarjetas(v, agg) {
  const cont = document.getElementById('tarjetas');
  if (v.id === 'D2') {
    const k2 = filasDe('KPI-02', agg);
    const brecha = k2.find((r) => r.grupo === 'brecha_female-male');
    const fem = k2.find((r) => r.grupo === 'female');
    const mas = k2.find((r) => r.grupo === 'male');
    cont.replaceChildren(
      tarjeta('Brecha por sexo', `${Number(brecha.valor_pct).toFixed(2)} pp`, 'mujer menos hombre'),
      tarjeta('Mujeres', fmtPct(fem.valor_pct), `${fem.numerador}/${fem.denominador} sobreviven`),
      tarjeta('Hombres', fmtPct(mas.valor_pct), `${mas.numerador}/${mas.denominador} sobreviven`),
      tarjeta('n del filtro vigente', String(agg.n), 'denominador recalculado'),
    );
    return;
  }
  if (v.id === 'D3') {
    const k4 = filasDe('KPI-04', agg);
    const k5 = filasDe('KPI-05', agg);
    const f24 = k4.find((r) => r.grupo === '2-4');
    const mujer = k5.find((r) => r.grupo === 'Mujer');
    const mr = k5.find((r) => r.grupo === 'Mr');
    const brecha = (mujer.valor_pct !== null && mr.valor_pct !== null)
      ? `${(mujer.valor_pct - mr.valor_pct).toFixed(2)} pp` : 'sin base';
    cont.replaceChildren(
      tarjeta('Familia 2-4', fmtPct(f24.valor_pct), `${f24.numerador}/${f24.denominador} sobreviven`),
      tarjeta('Titulo Mujer', fmtPct(mujer.valor_pct), `${mujer.numerador}/${mujer.denominador} sobreviven`),
      tarjeta('Brecha por titulo', brecha, 'Mujer menos Mr'),
      tarjeta('n del filtro vigente', String(agg.n), 'denominador recalculado'),
    );
    return;
  }
  if (v.id === 'D4') {
    const k6 = filasDe('KPI-06', agg)[0];
    const k7 = filasDe('KPI-07', agg);
    const d = k7.find((r) => r.grupo === 'D');
    const a = k7.find((r) => r.grupo === 'A');
    cont.replaceChildren(
      tarjeta('Cobertura de cabina', fmtPct(k6.valor_pct), `${k6.numerador}/${k6.denominador} con dato`),
      tarjeta('Cubierta D (mayor)', fmtPct(d.valor_pct), `${d.numerador}/${d.denominador} sobreviven`),
      tarjeta('Cubierta A (menor)', fmtPct(a.valor_pct), `${a.numerador}/${a.denominador} sobreviven`),
      tarjeta('n del filtro vigente', String(agg.n), 'denominador recalculado'),
    );
    return;
  }
  const k1 = filasDe('KPI-01', agg)[0];
  const k2 = filasDe('KPI-02', agg);
  const brecha = k2.find((r) => r.grupo === 'brecha_female-male');
  const k6 = filasDe('KPI-06', agg)[0];
  cont.replaceChildren(
    tarjeta('Supervivencia global', fmtPct(k1.valor_pct), `${k1.numerador}/${k1.denominador} pasajeros`),
    tarjeta('Brecha por sexo', `${Number(brecha.valor_pct).toFixed(2)} pp`, 'mujer menos hombre'),
    tarjeta('Cobertura de cabina', fmtPct(k6.valor_pct), `${k6.numerador}/${k6.denominador} con dato`),
    tarjeta('n del filtro vigente', String(agg.n), 'denominador recalculado'),
  );
}

function tooltip(html) {
  let t = document.getElementById('tooltip');
  if (!t) {
    t = document.createElement('div');
    t.id = 'tooltip';
    document.body.append(t);
  }
  t.innerHTML = html;
  t.classList.add('visible');
}
const ocultarTooltip = () => document.getElementById('tooltip')?.classList.remove('visible');

function ficha(d) {
  return [
    `<b>${d.KPI}</b>`,
    `variable: ${d.variable}`,
    `grupo: ${d.grupo}`,
    `numerador: ${d.numerador}`,
    `denominador: ${d.denominador}`,
    `valor_pct: ${d.valor_pct === null ? '' : d.valor_pct.toFixed(2)}`,
    `nota: ${d.nota || ''}`,
  ].join('<br>');
}

const textoBarra = (d) => (d.valor_pct === null
  ? 'sin base'
  : `${d.valor_pct.toFixed(1)} % · n=${d.denominador}${poco(d.denominador) ? ' (no interpretable)' : ''}`);

function leyenda(texto) {
  const p = document.createElement('p');
  p.className = 'leyenda';
  p.textContent = texto;
  return p;
}

function leyendaD2() {
  const p = document.createElement('p');
  p.className = 'leyenda';
  p.innerHTML = `<span class="swatch" style="background:${COLOR_SEXO.female}"></span> mujer `
    + `<span class="swatch" style="background:${COLOR_SEXO.male}"></span> hombre · `
    + 'barra atenuada = menos de 10 casos (no interpretable). Clic en una barra o celda para filtrar ese sexo y esa clase.';
  return p;
}

// Un panel SVG con barras horizontales, eje fijo 0-100 %. Reutilizado por
// D1, D3 y D4 (D4 pasa colorDe para separar la referencia sin cabina).
function panelBarras(cont, data, nombre, titulo, textoLeyenda, colorDe, alClic) {
  const panel = document.createElement('section');
  panel.className = 'panel';
  panel.append(crear('h3', titulo), leyenda(textoLeyenda));
  cont.append(panel);

  const anchoBarra = 260;
  const w = 120 + anchoBarra + 190; const bh = 24; const gap = 10;
  const x = (v) => 120 + (Math.min(v, 100) / 100) * anchoBarra;
  const svg = d3.select(panel).append('svg')
    .attr('viewBox', `0 0 ${w} ${data.length * (bh + gap)}`)
    .attr('data-nombre', nombre)
    .attr('role', 'img')
    .attr('aria-label', `${titulo} (tasa, eje 0 a 100 %)`);

  const g = svg.selectAll('g').data(data).join('g').attr('transform', (d, i) => `translate(0,${i * (bh + gap)})`);
  g.append('text').attr('x', 112).attr('y', bh / 2 + 4).attr('text-anchor', 'end').text((d) => d.grupo);
  g.append('rect')
    .attr('x', 120).attr('y', 0).attr('height', bh)
    .attr('width', (d) => (d.valor_pct === null ? 0 : x(d.valor_pct) - 120))
    .attr('fill', (d, i) => (colorDe ? colorDe(d, i) : COLOR[i % COLOR.length]))
    .attr('class', (d) => (poco(d.denominador) ? 'atenuada' : ''))
    .attr('tabindex', 0)
    .attr('aria-label', (d) => `${d.grupo}: ${fmtPct(d.valor_pct)}, n=${d.denominador}`)
    .on('mouseenter', (ev, d) => tooltip(ficha(d)))
    .on('focus', (ev, d) => tooltip(ficha(d)))
    .on('mouseleave', ocultarTooltip)
    .on('blur', ocultarTooltip)
    .on('click', (ev, d) => alClic(d));
  g.append('text').attr('x', 120 + anchoBarra + 12).attr('y', bh / 2 + 4).text(textoBarra);
}

// Una barra horizontal por KPI: un panel por KPI (D1: 3, D3: 2).
function dibujarBarras(cont, agg, barras, prefijo, textoLeyenda) {
  for (const kpi of barras) {
    panelBarras(cont, filasDe(kpi, agg), `${prefijo}_${kpi}`, `${kpi} · ${TITULO_KPI[kpi]}`,
      textoLeyenda, undefined, (d) => drilldownKpi(kpi, d));
  }
}

// Barras agrupadas por clase (2 barras: mujer/hombre) + matriz Sex x Pclass.
function dibujarD2(cont, agg) {
  const { celdas, n } = cruce(estado.filas, filtrosDe(VISTA.D2));

  const panel = document.createElement('section');
  panel.className = 'panel';
  panel.append(crear('h3', 'KPI-02 × KPI-03 · Supervivencia por sexo y clase'), leyendaD2());
  cont.append(panel);

  const w = 560; const izq = 120; const der = 150; const bh = 20; const gap = 4; const grupoGap = 12;
  const plot = w - izq - der;
  const y = (i) => i * (bh + gap) + Math.floor(i / 2) * grupoGap;
  const alto = 6 * (bh + gap) - gap + 2 * grupoGap;
  const x = (v) => izq + (Math.min(v, 100) / 100) * plot;

  const svg = d3.select(panel).append('svg')
    .attr('viewBox', `0 0 ${w} ${alto}`)
    .attr('data-nombre', 'D2_barras')
    .attr('role', 'img')
    .attr('aria-label', 'Supervivencia por sexo y clase (tasa, eje 0 a 100 %)');

  const g = svg.selectAll('g').data(celdas).join('g').attr('transform', (d, i) => `translate(0,${y(i)})`);
  g.append('text')
    .attr('x', izq - 8).attr('y', bh + gap / 2).attr('text-anchor', 'end')
    .text((d, i) => (i % 2 === 0 ? `clase ${d.Pclass}` : ''));
  g.append('rect')
    .attr('x', izq).attr('y', 0).attr('height', bh)
    .attr('width', (d) => (d.valor_pct === null ? 0 : x(d.valor_pct) - izq))
    .attr('fill', (d) => COLOR_SEXO[d.Sex])
    .attr('class', (d) => (poco(d.denominador) ? 'atenuada' : ''))
    .attr('tabindex', 0)
    .attr('aria-label', (d) => `${d.Sex} clase ${d.Pclass}: ${fmtPct(d.valor_pct)}, n=${d.denominador}`)
    .on('mouseenter', (ev, d) => tooltip(ficha(d)))
    .on('focus', (ev, d) => tooltip(ficha(d)))
    .on('mouseleave', ocultarTooltip)
    .on('blur', ocultarTooltip)
    .on('click', (ev, d) => drilldownCruce(d));
  g.append('text')
    .attr('x', (d) => (d.valor_pct === null ? izq + 4 : x(d.valor_pct) + 6))
    .attr('y', bh / 2 + 4)
    .text((d) => `${ETIQUETA_SEXO[d.Sex]} ${textoBarra(d)}`);

  const panelM = document.createElement('section');
  panelM.className = 'panel';
  panelM.append(
    crear('h3', 'Matriz Sexo × Clase · Supervivencia (n vigente)'),
    crear('p', 'Celda más azul = tasa más alta. Escala 0 a 100 %. Clic en una celda para filtrar ese sexo y esa clase.'),
  );
  cont.append(panelM);

  const cw = 130; const ch = 52; const x0 = 90; const y0 = 28;
  const mw = x0 + D2.clases.length * cw + 10;
  const mh = y0 + D2.sexos.length * ch + 12;
  const matriz = d3.select(panelM).append('svg')
    .attr('viewBox', `0 0 ${mw} ${mh}`)
    .attr('data-nombre', 'D2_matriz')
    .attr('role', 'table')
    .attr('aria-label', 'Matriz de supervivencia por sexo y clase');

  matriz.selectAll('text.col').data(D2.clases).join('text')
    .attr('class', 'col')
    .attr('x', (d, j) => x0 + j * cw + cw / 2).attr('y', 18).attr('text-anchor', 'middle')
    .text((d) => `clase ${d}`);
  matriz.selectAll('text.fila').data(D2.sexos).join('text')
    .attr('class', 'fila')
    .attr('x', x0 - 8).attr('y', (d, i) => y0 + i * ch + ch / 2 + 4).attr('text-anchor', 'end')
    .text((d) => ETIQUETA_SEXO[d]);

  const celda = (sexo, clase) => celdas.find((c) => c.Sex === sexo && c.Pclass === clase);
  const celdasSel = [];
  D2.sexos.forEach((sexo, i) => D2.clases.forEach((clase, j) => {
    celdasSel.push({ sexo, clase, i, j, d: celda(sexo, clase) });
  }));
  const cm = matriz.selectAll('g.celda').data(celdasSel).join('g').attr('class', 'celda')
    .attr('transform', (d) => `translate(${x0 + d.j * cw},${y0 + d.i * ch})`);
  cm.append('rect')
    .attr('width', cw - 6).attr('height', ch - 6)
    .attr('fill', (d) => (d.d.valor_pct === null ? '#f6f8fa' : ESCALA_MATRIZ(d.d.valor_pct)))
    .attr('class', (d) => (poco(d.d.denominador) ? 'atenuada' : ''))
    .attr('tabindex', 0)
    .attr('aria-label', (d) => `${d.sexo} clase ${d.clase}: ${fmtPct(d.d.valor_pct)}, n=${d.d.denominador}`)
    .on('mouseenter', (ev, d) => tooltip(ficha(d.d)))
    .on('focus', (ev, d) => tooltip(ficha(d.d)))
    .on('mouseleave', ocultarTooltip)
    .on('blur', ocultarTooltip)
    .on('click', (ev, d) => drilldownCruce(d.d));
  cm.append('text')
    .attr('x', (cw - 6) / 2).attr('y', (ch - 6) / 2 + 4).attr('text-anchor', 'middle')
    .attr('fill', (d) => (d.d.valor_pct !== null && d.d.valor_pct > 55 ? '#fff' : 'var(--texto)'))
    .text((d) => (d.d.valor_pct === null ? 'sin casos' : `${d.d.valor_pct.toFixed(1)} %`));
  cm.append('text')
    .attr('x', (cw - 6) / 2).attr('y', (ch - 6) / 2 + 18).attr('text-anchor', 'middle')
    .attr('fill', (d) => (d.d.valor_pct !== null && d.d.valor_pct > 55 ? '#fff' : 'var(--tenue)'))
    .text((d) => `${d.d.numerador}/${d.d.denominador}`);

  filasExport = celdas;
  return n;
}

// D4 (paso 14): cobertura de cabina, tasa por cubierta con su base declarada
// y barras de faltantes. D10-07: KPI-07 sobre base 204; la referencia sin
// cabina (206/687) se dibuja neutra y no entra en la base.
function dibujarD4(cont, agg) {
  const k6 = filasDe('KPI-06', agg)[0];
  const cobertura = [
    { KPI: 'KPI-06', variable: 'Cabin', grupo: 'con cabina', numerador: k6.numerador, denominador: k6.denominador, valor_pct: k6.valor_pct, nota: 'cobertura registrada' },
    { KPI: 'KPI-06', variable: 'Cabin', grupo: 'sin cabina', numerador: k6.denominador - k6.numerador, denominador: k6.denominador, valor_pct: k6.valor_pct === null ? null : 100 - k6.valor_pct, nota: 'dato ausente, no cubierta desconocida' },
  ];
  panelBarras(cont, cobertura, 'D4_cobertura', 'KPI-06 · Cobertura de cabina',
    'Cobertura sobre la n vigente. "Sin cabina" es dato ausente, no una cubierta desconocida.',
    (d, i) => NEUTROS[i % 2], (d) => drilldownKpi('KPI-06', d));

  const k7 = filasDe('KPI-07', agg);
  panelBarras(cont, k7, 'D4_KPI-07', 'KPI-07 · Supervivencia por cubierta',
    'Base = 204 con cabina registrada. La referencia sin cabina (206/687) va aparte y no entra en la base. Barra atenuada = menos de 10 casos (no interpretable). Clic en una cubierta A-T para filtrar.',
    (d) => (d.grupo === 'sin_cabin_ref' ? GRIS : ACENTO), (d) => drilldownKpi('KPI-07', d));

  const fal = faltantes(estado.filas, filtrosDe(VISTA.D4));
  panelBarras(cont, fal.filas, 'D4_faltantes', 'Calidad del dato · registros faltantes',
    'Porcentaje de ausentes sobre la n vigente. Neutro: es calidad del dato, no un resultado.',
    () => GRIS, (d) => drilldownKpi('calidad', d));

  filasExport = [...cobertura, ...k7, ...fal.filas];
}

function renderGraficos(v, agg) {
  const cont = document.getElementById('graficos');
  cont.replaceChildren();
  if (v.id === 'D2') {
    dibujarD2(cont, agg);
  } else if (v.id === 'D3') {
    dibujarBarras(cont, agg, D3.barras, 'D3', 'Barra atenuada = menos de 10 casos (no interpretable). Clic en una barra de familia (KPI-04) para filtrar.');
    filasExport = agg.filas;
  } else if (v.id === 'D4') {
    dibujarD4(cont, agg);
  } else {
    dibujarBarras(cont, agg, D1.barras, 'D1', 'Barra atenuada = menos de 10 casos (no interpretable). Clic en una barra para filtrar.');
    filasExport = agg.filas;
  }
}

function drilldownKpi(kpi, d) {
  const campo = CAMPO_DE_KPI[kpi];
  if (!campo || !VALORES_FILTRO[campo].includes(d.grupo)) return;
  setFiltro(campo, estado.filtros[campo] === d.grupo ? '' : d.grupo);
}

// D10-06: el clic fija Sexo y Clase; si ya coincidian, los quita.
function drilldownCruce(d) {
  const ya = estado.filtros.Sex === d.Sex && estado.filtros.Pclass === d.Pclass;
  if (ya) { delete estado.filtros.Sex; delete estado.filtros.Pclass; } else { estado.filtros.Sex = d.Sex; estado.filtros.Pclass = d.Pclass; }
  actualizar();
}

function actualizar() {
  const v = VISTA[estado.vista];
  document.getElementById('titulo-vista').textContent = v.titulo;
  renderNav();
  const agg = agregar(estado.filas, filtrosDe(v));
  nVigente = agg.n;
  renderFiltros(v);

  const vacio = document.getElementById('vacio');
  const principal = document.getElementById('principal');
  if (agg.n === 0) {
    vacio.hidden = false;
    vacio.textContent = estado.vista === 'D4'
      ? 'Sin pasajeros con cabina en esta seleccion. Quita un filtro para ver datos.'
      : 'Sin pasajeros para la combinacion de filtros. Quita un filtro para ver datos.';
    principal.hidden = true;
    return;
  }
  vacio.hidden = true;
  principal.hidden = false;
  renderTarjetas(v, agg);
  renderGraficos(v, agg);
}

function descargar(nombre, texto, tipo = 'text/csv') {
  const url = URL.createObjectURL(new Blob([texto], { type: tipo }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

function exportarCsv() {
  const cols = ['KPI', 'variable', 'grupo', 'numerador', 'denominador', 'valor_pct', 'nota'];
  const esc = (v) => `"${String(v === null ? '' : v).replaceAll('"', '""')}"`;
  const lineas = [cols.join(',')];
  for (const r of filasExport) {
    lineas.push(cols.map((c) => esc(c === 'valor_pct' && r[c] !== null ? r[c].toFixed(2) : r[c])).join(','));
  }
  descargar(`${estado.vista}_filtrado_n${nVigente}.csv`, `${lineas.join('\n')}\n`);
}

// Un solo archivo: envuelve los svg de la vista en un svg contenedor.
function exportarSvg() {
  const svgs = [...document.querySelectorAll('#graficos svg')];
  if (!svgs.length) return;
  const ancho = Math.max(560, ...svgs.map((el) => Number((el.getAttribute('viewBox') || '').split(' ')[2]) || 0));
  let alto = 0;
  const partes = svgs.map((el) => {
    const vb = (el.getAttribute('viewBox') || `0 0 ${ancho} 100`).split(' ').map(Number);
    const g = `<g transform="translate(0,${alto})">${el.innerHTML}</g>`;
    alto += vb[3] + 16;
    return g;
  });
  const cont = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}">`
    + '<style>text{font-size:12px;fill:#1f2933}</style>' + partes.join('') + '</svg>';
  descargar(`${estado.vista}_graficos.svg`, cont, 'image/svg+xml');
}

async function iniciar() {
  document.getElementById('btn-csv').addEventListener('click', exportarCsv);
  document.getElementById('btn-svg').addEventListener('click', exportarSvg);
  window.addEventListener('hashchange', () => { estado.vista = vistaDesdeHash(); actualizar(); });
  try {
    const resp = await fetch(CSV);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    estado.filas = parseCsv(await resp.text());
    if (estado.filas.length === 0) throw new Error('CSV vacio');
    estado.vista = vistaDesdeHash();
    actualizar();
  } catch (err) {
    const aviso = document.getElementById('error');
    aviso.hidden = false;
    aviso.textContent = `No se pudieron cargar los datos (${err.message}). Sirve la carpeta por HTTP: python -m http.server 8000 y abre http://localhost:8000/proyecto/04_codigo/dashboard/`;
  }
}

iniciar();
