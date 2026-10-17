// Datos y agregacion compartidos por las cuatro vistas.
// Reglas fijadas en el paso 10 (D10-02, D10-03, D10-04):
//   - el filtro se aplica ANTES de agregar, asi que el denominador se recalcula;
//   - tasa(numerador, 0) = null (nunca division por cero ni 0 enganoso);
//   - banda n<10 -> "no interpretable".
// Este modulo no toca el DOM ni D3: es importable desde el navegador y desde node.

export const UMBRAL_N = 10;

export const D1 = {
  id: 'D1',
  titulo: '342 de 891 pasajeros sobrevivieron (38.38 %)',
  kpis: ['KPI-01', 'KPI-02', 'KPI-03', 'KPI-04', 'KPI-06'],
  barras: ['KPI-02', 'KPI-03', 'KPI-04'],
  filtros: ['Sex', 'Pclass', 'Embarked', 'TamanoFamilia'],
};

export const D2 = {
  id: 'D2',
  titulo: 'La brecha por sexo se mantiene en las tres clases (de 36.46 a 76.37 pp)',
  kpis: ['KPI-02', 'KPI-03'],
  filtros: ['Sex', 'Pclass', 'Embarked'],
  sexos: ['female', 'male'],
  clases: ['1', '2', '3'],
};

export const D3 = {
  id: 'D3',
  titulo: 'El titulo separa mas que el tamano: de 15.67 % (Mr) a 73.95 % (Mujer); las familias de 5+ caen a 16.13 %',
  kpis: ['KPI-04', 'KPI-05'],
  barras: ['KPI-04', 'KPI-05'],
  filtros: ['Sex', 'Pclass', 'Embarked', 'TamanoFamilia'],
};

export const D4 = {
  id: 'D4',
  titulo: 'Solo el 22.90 % del pasaje tiene cabina registrada; sobre esos 204, la supervivencia va de 46.67 % (A) a 75.76 % (D)',
  kpis: ['KPI-06', 'KPI-07'],
  barras: ['KPI-07'],
  filtros: ['Sex', 'Pclass', 'Embarked', 'Cubierta'],
};

export const VISTAS = [
  { id: 'D1', etiqueta: 'Resumen', estado: 'implementada' },
  { id: 'D2', etiqueta: 'Sexo y clase', estado: 'implementada' },
  { id: 'D3', etiqueta: 'Familia y titulo', estado: 'implementada' },
  { id: 'D4', etiqueta: 'Cabina y calidad', estado: 'implementada' },
];

export const VALORES_FILTRO = {
  Sex: ['female', 'male'],
  Pclass: ['1', '2', '3'],
  Embarked: ['C', 'Q', 'S'],
  TamanoFamilia: ['1', '2-4', '5+'],
  Cubierta: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'T'],
};

export const ETIQUETA_CAMPO = {
  Sex: 'Sexo',
  Pclass: 'Clase',
  Embarked: 'Embarque',
  TamanoFamilia: 'Tamano familia',
  Cubierta: 'Cubierta',
};

// Parser CSV minimo con comillas (Name/Ticket llevan comas).
export function parseCsv(texto) {
  const t = texto.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const filas = [];
  let fila = [];
  let celda = '';
  let comillas = false;
  for (let i = 0; i < t.length; i += 1) {
    const c = t[i];
    if (comillas) {
      if (c === '"') {
        if (t[i + 1] === '"') { celda += '"'; i += 1; } else { comillas = false; }
      } else { celda += c; }
    } else if (c === '"') { comillas = true; } else if (c === ',') { fila.push(celda); celda = ''; } else if (c === '\n') { fila.push(celda); filas.push(fila); fila = []; celda = ''; } else { celda += c; }
  }
  if (celda !== '' || fila.length > 0) { fila.push(celda); filas.push(fila); }
  const cabecera = filas.shift();
  return filas
    .filter((f) => f.length === cabecera.length && f[0] !== '')
    .map((f) => Object.fromEntries(cabecera.map((c, i) => [c, f[i]])));
}

export function bandaTamano(valor) {
  const n = Number(valor);
  if (n <= 1) return '1';
  if (n <= 4) return '2-4';
  return '5+';
}

const TITULOS_MUJER = new Set(['Miss', 'Mrs']);

export function tituloAgrupado(titulo) {
  if (titulo === 'Mr' || titulo === 'Master') return titulo;
  if (TITULOS_MUJER.has(titulo)) return 'Mujer';
  return 'Otros';
}

export function filtrar(filas, filtros = {}) {
  return filas.filter((f) => Object.entries(filtros).every(([campo, valor]) => {
    if (valor === '' || valor === undefined || valor === null) return true;
    const v = campo === 'TamanoFamilia' ? bandaTamano(f.TamanoFamilia) : f[campo];
    return String(v) === String(valor);
  }));
}

export function tasa(numerador, denominador) {
  return denominador === 0 ? null : (numerador / denominador) * 100;
}

function supervivientes(filas) {
  return filas.filter((f) => f.Survived === '1').length;
}

// Devuelve { n, filas: [{KPI, variable, grupo, numerador, denominador, valor_pct, nota}] }
// con las mismas columnas de 11_indicadores.csv.
export function agregar(filas, filtros = {}) {
  const sub = filtrar(filas, filtros);
  const n = sub.length;
  const out = [];
  const push = (KPI, variable, grupo, numerador, denominador, nota = '') => out.push({
    KPI, variable, grupo, numerador, denominador, valor_pct: tasa(numerador, denominador), nota,
  });

  push('KPI-01', 'global', 'todos', supervivientes(sub), n, 'linea base');
  for (const g of ['female', 'male']) {
    const s = sub.filter((f) => f.Sex === g);
    push('KPI-02', 'Sex', g, supervivientes(s), s.length);
  }
  const pf = out.find((r) => r.KPI === 'KPI-02' && r.grupo === 'female');
  const pm = out.find((r) => r.KPI === 'KPI-02' && r.grupo === 'male');
  const brecha = (pf && pm && pf.valor_pct !== null && pm.valor_pct !== null)
    ? pf.valor_pct - pm.valor_pct : null;
  out.push({ KPI: 'KPI-02', variable: 'Sex', grupo: 'brecha_female-male', numerador: '', denominador: '', valor_pct: brecha, nota: 'puntos porcentuales' });

  for (const g of ['1', '2', '3']) {
    const s = sub.filter((f) => f.Pclass === g);
    push('KPI-03', 'Pclass', g, supervivientes(s), s.length);
  }
  for (const g of ['1', '2-4', '5+']) {
    const s = sub.filter((f) => bandaTamano(f.TamanoFamilia) === g);
    push('KPI-04', 'TamanoFamilia', g, supervivientes(s), s.length);
  }
  for (const g of ['Mr', 'Mujer', 'Master', 'Otros']) {
    const s = sub.filter((f) => tituloAgrupado(f.Titulo) === g);
    push('KPI-05', 'Titulo', g, supervivientes(s), s.length);
  }

  const conCabina = sub.filter((f) => f.BanderaSinCabin === '0').length;
  push('KPI-06', 'Cabin', 'cobertura', conCabina, n, '1 - mean(BanderaSinCabin)=687 sin dato');

  for (const g of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'T']) {
    const s = sub.filter((f) => f.Cubierta === g);
    push('KPI-07', 'Cubierta', g, supervivientes(s), s.length, s.length < UMBRAL_N ? 'n<10: no interpretable' : '');
  }
  const sinCabin = sub.filter((f) => f.BanderaSinCabin === '1');
  push('KPI-07', 'Cubierta', 'sin_cabin_ref', supervivientes(sinCabin), sinCabin.length, 'referencia: no entra en la base 204');

  return { n, filas: out };
}

export function filasDe(kpi, agregado) {
  return agregado.filas.filter((r) => r.KPI === kpi);
}

// Cruce Sex x Pclass (D10-01). No existe en 11_indicadores.csv: se agrega aqui
// con la misma tupla de columnas para que el tooltip y el export coincidan.
// Orden: clases por fuera y sexos por dentro -> las barras agrupadas salen por clase.
export function cruce(filas, filtros = {}) {
  const sub = filtrar(filas, filtros);
  const celdas = [];
  for (const Pclass of D2.clases) {
    for (const Sex of D2.sexos) {
      const s = sub.filter((f) => f.Pclass === Pclass && f.Sex === Sex);
      const numerador = supervivientes(s);
      const denominador = s.length;
      celdas.push({
        KPI: 'KPI-02x03',
        variable: 'Sex x Pclass',
        grupo: `${Sex} | ${Pclass}`,
        numerador,
        denominador,
        valor_pct: tasa(numerador, denominador),
        nota: denominador === 0 ? 'sin casos' : (denominador < UMBRAL_N ? 'n<10: no interpretable' : ''),
        Pclass,
        Sex,
      });
    }
  }
  return { n: sub.length, celdas };
}

// Calidad del dato para D4: cuantos registros carecen de Age/Cabin/Embarked
// sobre la n vigente. Mismas columnas que el resto para tooltip y export.
export const FALTANTES = [
  { campo: 'BanderaSinAge', etiqueta: 'sin Age' },
  { campo: 'BanderaSinCabin', etiqueta: 'sin Cabin' },
  { campo: 'BanderaSinEmbarked', etiqueta: 'sin Embarked' },
];

export function faltantes(filas, filtros = {}) {
  const sub = filtrar(filas, filtros);
  const n = sub.length;
  const out = FALTANTES.map(({ campo, etiqueta }) => {
    const numerador = sub.filter((f) => f[campo] === '1').length;
    return {
      KPI: 'calidad',
      variable: campo,
      grupo: etiqueta,
      numerador,
      denominador: n,
      valor_pct: tasa(numerador, n),
      nota: 'faltante sobre la n vigente',
    };
  });
  return { n, filas: out };
}
