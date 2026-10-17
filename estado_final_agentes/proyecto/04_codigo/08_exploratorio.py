"""Paso 08 - analisis exploratorio de las salidas enriquecidas.

Solo lectura. No escribe artefactos: imprime los numeros que sustentan
06_hallazgos_exploratorios.md y 07_propuesta_kpi.md. No calcula KPI definitivos.

Uso:  python 08_exploratorio.py
"""

import hashlib
import os
import sys

import pandas as pd

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENRIQUECIDO = os.path.join(BASE, "01_dataset", "Titanic-Dataset_enriquecido.csv")
SHA_ESPERADO = "6807462B8BC25C05DC9DB39BC0DB7ADABC63F964179BF2BB83BE3A1E07129D18"

KEYS = [
    "PassengerId",
    "Survived",
    "Pclass",
    "Name",
    "Sex",
    "Age",
    "SibSp",
    "Parch",
    "Ticket",
    "Fare",
    "Cabin",
    "Embarked",
    "Titulo",
    "TamanoFamilia",
    "Cubierta",
    "BanderaSinAge",
    "BanderaSinCabin",
    "BanderaSinEmbarked",
]


def cargar():
    sha = hashlib.sha256(open(ENRIQUECIDO, "rb").read()).hexdigest().upper()
    if sha != SHA_ESPERADO:
        sys.exit("SHA256 inesperado: %s" % sha)
    df = pd.read_csv(ENRIQUECIDO, dtype=str, keep_default_na=False, na_values=[""])
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
        "BanderaSinEmbarked",
    ):
        df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


def tasa(serie_sv):
    return 100.0 * serie_sv.sum() / len(serie_sv)


def por(df, col, base):
    g = df.groupby(col, dropna=False, observed=False)["Survived"]
    out = pd.DataFrame({"n": g.size(), "sv": g.sum()})
    out["pct"] = (100.0 * out["sv"] / out["n"]).round(2)
    out["poblacion_pct"] = (100.0 * out["n"] / base).round(2)
    return out


def main():
    df = cargar()
    n = len(df)
    print("== forma ==")
    print("filas", n, "columnas", df.shape[1])
    print("columnas ok", list(df.columns) == KEYS)

    print("\n== nulos ==")
    print(df[KEYS].isna().sum().to_string())
    for c in ("Age", "Cabin", "Embarked"):
        print("%s pct nulo %.2f%%" % (c, 100.0 * df[c].isna().mean()))

    print("\n== supervivencia global ==")
    print("survived %d / %d = %.4f" % (df["Survived"].sum(), n, df["Survived"].mean()))

    for col in (
        "Sex",
        "Pclass",
        "Embarked",
        "Titulo",
        "Cubierta",
        "TamanoFamilia",
        "BanderaSinAge",
        "BanderaSinCabin",
        "BanderaSinEmbarked",
    ):
        print("\n== %s x Survived ==" % col)
        print(por(df, col, n).to_string())

    print("\n== TamanoFamilia agrupado ==")
    grupo = pd.cut(df["TamanoFamilia"], [0, 1, 4, 20], labels=["1", "2-4", "5+"])
    print(por(df, grupo, n).to_string())

    print("\n== Age ==")
    print(df["Age"].describe().round(2).to_string())
    print("Age nulo por Sex:")
    print(
        df.groupby("Sex")["Age"].apply(lambda s: s.isna().mean().round(4)).to_string()
    )
    print("Age nulo por Pclass:")
    print(
        df.groupby("Pclass")["Age"]
        .apply(lambda s: s.isna().mean().round(4))
        .to_string()
    )
    print("Age mediana por Pclass x Sex:")
    print(
        df.pivot_table(
            index="Pclass", columns="Sex", values="Age", aggfunc="median"
        ).to_string()
    )

    print("\n== Fare ==")
    print(df["Fare"].describe().round(2).to_string())
    print("Fare==0:", int((df["Fare"] == 0).sum()))
    print("Fare mediana por Pclass:")
    print(df.groupby("Pclass")["Fare"].median().to_string())
    print("perfil Fare==0 (Sex x Pclass):")
    print(df[df["Fare"] == 0].groupby(["Pclass", "Sex"]).size().to_string())
    print(
        "survived en Fare==0:",
        int(df.loc[df["Fare"] == 0, "Survived"].sum()),
        "/",
        int((df["Fare"] == 0).sum()),
    )

    print("\n== SibSp / Parch ==")
    print("SibSp", df["SibSp"].value_counts().sort_index().to_dict())
    print("Parch", df["Parch"].value_counts().sort_index().to_dict())

    print("\n== calidad ==")
    print("duplicados PassengerId", int(df["PassengerId"].duplicated().sum()))
    print("Survived dominio", sorted(df["Survived"].dropna().unique().tolist()))
    print("Pclass dominio", sorted(df["Pclass"].dropna().unique().tolist()))
    print("Sex dominio", sorted(df["Sex"].dropna().unique().tolist()))
    print("Embarked dominio", sorted(df["Embarked"].dropna().unique().tolist()))
    print("Fare<0", int((df["Fare"] < 0).sum()))
    print("Age<0 o >100", int(((df["Age"] < 0) | (df["Age"] > 100)).sum()))
    print(
        "nulos Survived/Pclass/Sex",
        int(df[["Survived", "Pclass", "Sex"]].isna().sum().sum()),
    )

    print("\n== Ticket ==")
    pref = df["Ticket"].str.replace(r"[^A-Za-z]", "", regex=True).str.upper()
    print("prefijo distintos", pref.nunique(), "| vacios", int((pref == "").sum()))
    print("top prefijos", pref.value_counts().head(6).to_dict())

    print("\n== Cabin ==")
    print("multi-camarote", int(df["Cabin"].dropna().str.contains(r"\s").sum()))
    print("Cabin nulo x Pclass:")
    print(
        df.groupby("Pclass")["Cabin"]
        .apply(lambda s: s.isna().mean().round(4))
        .to_string()
    )

    print("\n== correlaciones (Pearson, descriptivo) ==")
    num = df[
        [
            "Survived",
            "Pclass",
            "Age",
            "SibSp",
            "Parch",
            "Fare",
            "TamanoFamilia",
            "BanderaSinAge",
            "BanderaSinCabin",
            "BanderaSinEmbarked",
        ]
    ]
    print(num.corr().round(2).to_string())

    assert n == 891 and df.shape[1] == 18
    assert df["Titulo"].value_counts()["Miss"] == 185
    assert int(df["BanderaSinCabin"].sum()) == 687
    print("\nEXPLORATORIO OK")


if __name__ == "__main__":
    main()
