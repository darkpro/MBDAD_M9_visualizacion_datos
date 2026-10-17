"""Diagnóstico de solo lectura del dataset fuente (PASO 01).

No limpia, no imputa, no deduplica ni modifica el original. Solo perfila:
formato y codificación, columnas, tipos inferidos, faltantes, dominios,
unidad de análisis, identificadores y posibles duplicados.

Uso:
    python 01_diagnostico_readonly.py [ruta_csv]
"""

import codecs
import csv
import hashlib
import sys
from collections import Counter
from pathlib import Path

DEFAULT = r"H:\Codigo\visualizacion-de-datos\proyecto\01_dataset\Titanic-Dataset.csv"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest().upper()


def infer_type(values):
    if not values:
        return "texto*"
    ni = nf = 0
    for v in values:
        try:
            int(v)
            ni += 1
            continue
        except ValueError:
            pass
        try:
            float(v)
            nf += 1
        except ValueError:
            pass
    n = len(values)
    if ni == n:
        return "entero"
    if ni + nf == n:
        return "decimal"
    return "texto"


def profile(path: Path):
    raw = path.read_bytes()
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f)
        header = next(reader)
        rows = list(reader)

    n = len(rows)
    cols = {h: [] for h in header}
    missing = Counter()
    whitespace = 0
    for row in rows:
        for i, h in enumerate(header):
            val = row[i] if i < len(row) else ""
            if val != val.strip():
                whitespace += 1
            if val == "":
                missing[h] += 1
            else:
                cols[h].append(val)

    print(f"ARCHIVO: {path.name}")
    print(f"SHA256: {sha256(path)}")
    print(
        f"BOM_UTF8: {raw[:3] == codecs.BOM_UTF8} | CRLF: {b'\\r\\n' in raw} "
        f"| bytes: {len(raw)}"
    )
    print(f"FILAS: {n} | COLUMNAS: {len(header)}")
    print(f"ANCHO_CONSISTENTE: {all(len(r) == len(header) for r in rows)}")
    print(f"CELDAS_ESPACIOS_EXTREMOS: {whitespace}")
    print(f"CABECERA: {header}")
    print()

    print(
        f"{'columna':<12}{'tipo':<9}{'no_nulos':>9}{'faltantes':>10}"
        f"{'pct_falt':>10}{'unicos':>8}"
    )
    for h in header:
        v = cols[h]
        pct = 100.0 * missing[h] / n if n else 0.0
        print(
            f"{h:<12}{infer_type(v):<9}{len(v):>9}{missing[h]:>10}"
            f"{pct:>9.2f}%{len(set(v)):>8}"
        )
    print()

    print("DOMINIOS (cardinalidad <= 15):")
    for h in header:
        u = set(cols[h])
        if 0 < len(u) <= 15:
            print(f"  {h}: {sorted(u)}")
            print(f"    conteos: {Counter(cols[h]).most_common()}")
    print()

    print("RANGOS NUMERICOS:")
    for h in header:
        try:
            nums = [float(x) for x in cols[h]]
        except ValueError:
            continue
        if nums:
            print(
                f"  {h}: min={min(nums)} max={max(nums)} "
                f"media={sum(nums) / len(nums):.4f}"
            )
    print()

    row_tuples = [tuple(r) for r in rows]
    print(f"FILAS_DUPLICADAS_COMPLETAS: {len(row_tuples) - len(set(row_tuples))}")

    def dup_report(col):
        if col not in header:
            return
        idx = header.index(col)
        vals = [r[idx] for r in rows if idx < len(r)]
        c = Counter(vals)
        rep = sum(1 for v in c.values() if v > 1)
        rows_rep = sum(v for v in c.values() if v > 1)
        print(
            f"  {col}: unicos={len(c)} grupos_repetidos={rep} "
            f"filas_en_grupos_repetidos={rows_rep} max_repeticiones={max(c.values())}"
        )

    print("CANDIDATOS A CLAVE / AGRUPADORES:")
    for col in ("PassengerId", "Name", "Ticket", "Cabin"):
        dup_report(col)

    if "Cabin" in header:
        idx = header.index("Cabin")
        cab = [r[idx] for r in rows if idx < len(r)]
        print(f"  Cabin prefijos (cubierta): {dict(Counter(c[0] for c in cab if c))}")
        print(
            f"  Cabin con >1 camarote: {sum(1 for c in cab if c and ' ' in c.strip())}"
        )

    if "SibSp" in header and "Parch" in header:
        si, pi = header.index("SibSp"), header.index("Parch")
        fam = Counter(int(r[si]) + int(r[pi]) for r in rows)
        print(
            f"  Familia(SibSp+Parch): min={min(fam)} max={max(fam)} "
            f"aislados(0)={fam[0]}"
        )

    if "Fare" in header:
        idx = header.index("Fare")
        print(
            f"  Fare==0: {sum(1 for r in rows if r[idx] not in ('',) and float(r[idx]) == 0.0)}"
        )


if __name__ == "__main__":
    profile(Path(sys.argv[1]) if len(sys.argv) > 1 else Path(DEFAULT))
