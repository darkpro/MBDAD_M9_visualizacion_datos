"""Paso 09 - Implementacion de indicadores (KPI-01..KPI-07).

Entrada : proyecto/01_dataset/Titanic-Dataset_enriquecido.csv   (paso 07, v1)
Salidas : proyecto/02_analisis/11_indicadores.csv               (KPI tabulados)
          proyecto/02_analisis/12_indicadores_verificaciones.csv (checks)

Implementa SOLO el catalogo aprobado en
proyecto/02_analisis/07_propuesta_kpi.md (decisiones D08-01..D08-07).
Sin metas ni semaforos. Los nulos no se imputan. Idempotente.

Uso:  python 09_indicadores.py
"""

import hashlib
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
IN = ROOT / "01_dataset" / "Titanic-Dataset_enriquecido.csv"
OUT_KPI = ROOT / "02_analisis" / "11_indicadores.csv"
OUT_CHK = ROOT / "02_analisis" / "12_indicadores_verificaciones.csv"

EXPECTED_IN_SHA = "6807462b8bc25c05dc9db39bc0db7adabc63f964179bf2bb83be3a1e07129d18"
N_ESPERADO = 891

# KPI-05: mapeo explicito Titulo base -> macro-categoria (D08-02).
MACRO = {
    "Mr": "Mr",
    "Miss": "Mujer",
    "Mrs": "Mujer",
    "Master": "Master",
}
# KPI-04: cortes de TamanoFamilia (1 / 2-4 / 5+).
BINS = [0, 1, 4, 1000]
FAMILIA_LABELS = ["1", "2-4", "5+"]


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def cargar():
    if not IN.exists():
        print(f"INDICADORES FALLO: no existe {IN}")
        sys.exit(1)
    got = sha256(IN)
    if got != EXPECTED_IN_SHA:
        print(f"INDICADORES FALLO: hash de entrada {got} != {EXPECTED_IN_SHA}")
        sys.exit(1)
    df = pd.read_csv(IN, dtype=str, keep_default_na=False, na_values=[""])
    for col in (
        "Survived",
        "Pclass",
        "Age",
        "SibSp",
        "Parch",
        "Fare",
        "TamanoFamilia",
        "BanderaSinAge",
        "BanderaSinCabin",
    ):
        df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


def tasa(num, den):
    """Tasa en % redondeada a 2 decimales; None si el denominador es 0."""
    if den == 0:
        return None
    return round(100.0 * num / den, 2)


def filas(df, kpi, variable, col, orden=None):
    """Tasa de supervivencia por grupo de `col` (base = tamano del grupo)."""
    out = []
    g = df.groupby(col, dropna=False, observed=False)["Survived"]
    tabla = pd.DataFrame({"num": g.sum(), "den": g.size()})
    tabla["pct"] = tabla.apply(lambda r: tasa(r["num"], r["den"]), axis=1)
    if orden is not None:
        tabla = tabla.loc[[k for k in orden if k in tabla.index]]
    for grupo, r in tabla.iterrows():
        out.append(
            {
                "KPI": kpi,
                "variable": variable,
                "grupo": grupo,
                "numerador": int(r["num"]),
                "denominador": int(r["den"]),
                "valor_pct": r["pct"],
                "nota": "",
            }
        )
    return out


def calcular(df):
    n = len(df)
    sv = int(df["Survived"].sum())
    out = []

    # KPI-01 global (denominador = todos los pasajeros).
    out.append(
        {
            "KPI": "KPI-01",
            "variable": "global",
            "grupo": "todos",
            "numerador": sv,
            "denominador": n,
            "valor_pct": tasa(sv, n),
            "nota": "linea base",
        }
    )

    # KPI-02 sexo + brecha.
    filas_sexo = filas(df, "KPI-02", "Sex", "Sex", orden=["female", "male"])
    out += filas_sexo
    f = next(r for r in filas_sexo if r["grupo"] == "female")
    m = next(r for r in filas_sexo if r["grupo"] == "male")
    out.append(
        {
            "KPI": "KPI-02",
            "variable": "Sex",
            "grupo": "brecha_female-male",
            "numerador": None,
            "denominador": None,
            "valor_pct": round(f["valor_pct"] - m["valor_pct"], 2),
            "nota": "puntos porcentuales",
        }
    )

    # KPI-03 clase.
    out += filas(df, "KPI-03", "Pclass", "Pclass", orden=[1, 2, 3])

    # KPI-04 tamano familiar agrupado (derivado de SibSp+Parch+1).
    fam = pd.cut(df["TamanoFamilia"], BINS, labels=FAMILIA_LABELS)
    out += filas(df, "KPI-04", "TamanoFamilia", fam, orden=FAMILIA_LABELS)

    # KPI-05 titulo agrupado en 4 macro-categorias.
    macro = df["Titulo"].map(lambda t: MACRO.get(t, "Otros"))
    out += filas(
        df, "KPI-05", "Titulo", macro, orden=["Mr", "Mujer", "Master", "Otros"]
    )

    # KPI-06 cobertura de Cabin.
    con_cabin = int(df["Cabin"].notna().sum())
    out.append(
        {
            "KPI": "KPI-06",
            "variable": "Cabin",
            "grupo": "cobertura",
            "numerador": con_cabin,
            "denominador": n,
            "valor_pct": tasa(con_cabin, n),
            "nota": f"1 - mean(BanderaSinCabin)={int(df['BanderaSinCabin'].sum())} sin dato",
        }
    )

    # KPI-07 cubierta (base = solo los que tienen Cabin) + grupo de referencia.
    con = df[df["Cabin"].notna()]
    out += filas(
        con,
        "KPI-07",
        "Cubierta",
        "Cubierta",
        orden=["A", "B", "C", "D", "E", "F", "G", "T"],
    )
    sin = df[df["Cabin"].isna()]
    out.append(
        {
            "KPI": "KPI-07",
            "variable": "Cubierta",
            "grupo": "sin_cabin_ref",
            "numerador": int(sin["Survived"].sum()),
            "denominador": len(sin),
            "valor_pct": tasa(int(sin["Survived"].sum()), len(sin)),
            "nota": "referencia: no entra en la base 204",
        }
    )
    for r in out:
        if (
            r["KPI"] == "KPI-07"
            and r["denominador"]
            and r["denominador"] < 10
            and r["grupo"] != "sin_cabin_ref"
        ):
            r["nota"] = "n<10: no interpretable"
    return out


def verificar(df, kpis):
    """Comprobaciones independientes: se recalculan por otra via."""
    chk = []
    n = len(df)
    pct = {(r["KPI"], r["grupo"]): r["valor_pct"] for r in kpis}
    num = {(r["KPI"], r["grupo"]): r["numerador"] for r in kpis}
    den = {(r["KPI"], r["grupo"]): r["denominador"] for r in kpis}

    def add(idc, desc, esperado, obtenido):
        chk.append(
            {
                "check": idc,
                "descripcion": desc,
                "esperado": esperado,
                "obtenido": obtenido,
                "ok": bool(esperado == obtenido),
            }
        )

    add("C-01", "KPI-01 supervivientes", 342, int(df["Survived"].sum()))
    add("C-02", "KPI-01 denominador = filas", N_ESPERADO, n)
    add(
        "C-03",
        "KPI-01 = 100*numerador/denominador",
        38.38,
        tasa(int(df["Survived"].sum()), n),
    )

    add(
        "C-04",
        "KPI-02 n(female)+n(male)",
        n,
        int((df["Sex"] == "female").sum() + (df["Sex"] == "male").sum()),
    )
    add(
        "C-05",
        "KPI-02 female recalculado",
        pct[("KPI-02", "female")],
        tasa(
            int(df.loc[df["Sex"] == "female", "Survived"].sum()),
            int((df["Sex"] == "female").sum()),
        ),
    )
    add(
        "C-06",
        "KPI-02 brecha = 74.20-18.89",
        55.31,
        round(pct[("KPI-02", "female")] - pct[("KPI-02", "male")], 2),
    )

    add("C-07", "KPI-03 suma de n", n, sum(den[("KPI-03", c)] for c in (1, 2, 3)))
    add(
        "C-08",
        "KPI-03 monotono 1>2>3",
        True,
        pct[("KPI-03", 1)] > pct[("KPI-03", 2)] > pct[("KPI-03", 3)],
    )
    add("C-09", "KPI-03 clase 3 = 119/491", 24.24, pct[("KPI-03", 3)])

    fam_sib = df["SibSp"] + df["Parch"] + 1
    fam1 = int((fam_sib == 1).sum())
    fam24 = int(((fam_sib >= 2) & (fam_sib <= 4)).sum())
    fam5 = int((fam_sib >= 5).sum())
    add("C-10", "KPI-04 n=1 desde SibSp+Parch+1", fam1, den[("KPI-04", "1")])
    add("C-11", "KPI-04 n=2-4 desde SibSp+Parch+1", fam24, den[("KPI-04", "2-4")])
    add("C-12", "KPI-04 n=5+ desde SibSp+Parch+1", fam5, den[("KPI-04", "5+")])
    add("C-13", "KPI-04 suma de n", n, fam1 + fam24 + fam5)

    add(
        "C-14",
        "KPI-05 suma de n",
        n,
        sum(den[("KPI-05", g)] for g in ("Mr", "Mujer", "Master", "Otros")),
    )
    add(
        "C-15",
        "KPI-05 Mujer = Miss+Mrs",
        311,
        int(df["Titulo"].isin(["Miss", "Mrs"]).sum()),
    )
    add(
        "C-16",
        "KPI-05 Mujer numerador = 130+100",
        230,
        int(df.loc[df["Titulo"].isin(["Miss", "Mrs"]), "Survived"].sum()),
    )
    add("C-17", "KPI-05 Mr = 81/517", 15.67, pct[("KPI-05", "Mr")])
    add("C-18", "KPI-05 Otros = 8/23", 34.78, pct[("KPI-05", "Otros")])

    add("C-19", "KPI-06 cobertura = 891-687", 204, num[("KPI-06", "cobertura")])
    add("C-20", "KPI-06 = 100-77.10", 22.90, pct[("KPI-06", "cobertura")])
    add(
        "C-21",
        "KPI-06 consistente con Cabin no nulo",
        num[("KPI-06", "cobertura")],
        int(df["Cabin"].notna().sum()),
    )

    cub_den = sum(den[("KPI-07", g)] for g in ("A", "B", "C", "D", "E", "F", "G", "T"))
    add("C-22", "KPI-07 base = 204", 204, cub_den)
    add("C-23", "KPI-07 no cubre los 891 (cobertura parcial)", True, cub_den < n)
    add(
        "C-24",
        "KPI-07 sin_cabin_ref = 206/687",
        29.99,
        pct[("KPI-07", "sin_cabin_ref")],
    )
    add(
        "C-25",
        "KPI-07 celdas n<10 marcadas",
        True,
        all(
            "n<10" in r["nota"]
            for r in kpis
            if r["KPI"] == "KPI-07" and r["denominador"] and 0 < r["denominador"] < 10
        ),
    )

    # Faltantes preservados y declarados (D08-04).
    add("C-26", "Age nulos sin imputar", 177, int(df["Age"].isna().sum()))
    add("C-27", "Cabin nulos sin imputar", 687, int(df["Cabin"].isna().sum()))
    add("C-28", "Embarked nulos sin imputar", 2, int(df["Embarked"].isna().sum()))
    add(
        "C-29",
        "ningun KPI con denominador 0",
        True,
        all(r["denominador"] != 0 for r in kpis),
    )

    # Denominador cero: la funcion debe devolver None, no dividir por cero.
    add("C-30", "tasa() con denominador 0 = None", None, tasa(0, 0))
    vacio = df[df["Pclass"] == 99]
    add(
        "C-31",
        "grupo vacio -> sin filas",
        0,
        len(filas(vacio, "X", "Pclass", "Pclass")),
    )

    # Filtros de ejemplo: misma formula sobre un subconjunto explicito.
    ejemplo = df[(df["Pclass"] == 1) & (df["Sex"] == "female")]
    add("C-32", "filtro ejemplo (Pclass=1 y female) n", 94, len(ejemplo))
    add(
        "C-33",
        "filtro ejemplo tasa 91/94 = 96.81",
        96.81,
        tasa(int(ejemplo["Survived"].sum()), len(ejemplo)),
    )
    return chk


def main():
    df = cargar()
    kpis = calcular(df)
    chk = verificar(df, kpis)
    fallos = [c for c in chk if not c["ok"]]
    if fallos:
        for c in fallos:
            print(
                f"FALLO {c['check']}: {c['descripcion']} "
                f"esperado={c['esperado']} obtenido={c['obtenido']}"
            )
        print("INDICADORES FALLO: " + "; ".join(c["check"] for c in fallos))
        sys.exit(1)

    tabla = pd.DataFrame(kpis)
    for col in ("numerador", "denominador"):
        tabla[col] = tabla[col].astype("Int64")
    tabla.to_csv(OUT_KPI, index=False, na_rep="", lineterminator="\n", encoding="utf-8")
    pd.DataFrame(chk).to_csv(
        OUT_CHK, index=False, lineterminator="\n", encoding="utf-8"
    )
    print(f"INDICADORES OK | kpi_filas={len(kpis)} checks={len(chk)}")
    print(f"in  sha256 {sha256(IN)}")
    print(f"out {OUT_KPI.name} sha256 {sha256(OUT_KPI)}")
    print(f"out {OUT_CHK.name} sha256 {sha256(OUT_CHK)}")


if __name__ == "__main__":
    main()
