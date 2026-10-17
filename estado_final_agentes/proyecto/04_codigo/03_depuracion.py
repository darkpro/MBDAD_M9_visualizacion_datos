"""Paso 03 - Implementacion de la depuracion.

Aplica las reglas QC-01..QC-11 de proyecto/03_decisiones/01_decisiones_datos.md (v1).
Tecnologia: Python + pandas (proyecto/03_decisiones/02_decision_tecnologica.md).
No imputa, no elimina filas, no deduplica, no deduce claves. Original intacto.

Uso: python 03_depuracion.py
"""

from pathlib import Path
import hashlib
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "01_dataset" / "Titanic-Dataset.csv"
OUT = ROOT / "01_dataset" / "Titanic-Dataset_clean.csv"

COLS = [
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
]
INT_COLS = ["PassengerId", "Survived", "Pclass", "SibSp", "Parch"]
FLT_COLS = ["Age", "Fare"]
DOMAINS = {
    "Survived": {0, 1},
    "Pclass": {1, 2, 3},
    "Sex": {"male", "female"},
    "Embarked": {"C", "Q", "S"},
}
ORIGINAL_SHA256 = "7D118FEF8B6CCF7F81111877BC388536F7B1E498A655E3D649D19AAA010E9F6F"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def cargar():
    df = pd.read_csv(SRC, dtype=str, encoding="utf-8", keep_default_na=False)
    df = df[COLS]  # esquema y orden identicos al original
    for c in df.columns:
        df[c] = df[c].str.strip()  # QC-08: espacios extremos
    df = df.replace("", pd.NA)  # faltantes como NA, nunca inventados
    for c in INT_COLS:  # QC-11: tipos
        df[c] = pd.to_numeric(df[c], errors="raise").astype("Int64")
    for c in FLT_COLS:
        df[c] = pd.to_numeric(df[c], errors="raise")
    return df


def validar(df, filas_orig):
    fallos = []
    if len(df) != filas_orig:
        fallos.append(f"QC-02 filas antes/despues {filas_orig}/{len(df)}")
    if list(df.columns) != COLS:
        fallos.append("QC-11 esquema/orden alterado")
    if int(df["PassengerId"].duplicated().sum()) != 0:  # QC-01
        fallos.append("QC-01 PassengerId duplicado")
    if int(df.duplicated().sum()) != 0:  # QC-02
        fallos.append("QC-02 filas completas duplicadas")
    for c, dom in DOMAINS.items():  # QC-07
        malos = set(df[c].dropna().unique()) - dom
        if malos:
            fallos.append(f"QC-07 {c} fuera de dominio: {malos}")
    if int(df["SibSp"].max()) > 8 or int(df["Parch"].max()) > 6:  # QC-07
        fallos.append("QC-07 rango SibSp/Parch excedido")
    for c in df.columns:  # QC-08
        if df[c].dropna().astype(str).str.match(r"^\s|\s$").any():
            fallos.append(f"QC-08 espacios extremos en {c}")
    return fallos


def main():
    assert sha256(SRC) == ORIGINAL_SHA256, "El original cambio: abortar."
    df = cargar()
    filas_orig = 891
    assert len(df) == filas_orig, "Perdida de filas detectada."

    fallos = validar(df, filas_orig)
    if fallos:
        print("REQUIERE_CAMBIOS:")
        for f in fallos:
            print("  -", f)
        raise SystemExit(1)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUT, index=False, encoding="utf-8", na_rep="", lineterminator="\n")

    print("OK. Copia depurada:", OUT.name)
    print("filas:", len(df), "| columnas:", len(df.columns))
    print(
        "faltantes ->",
        {c: int(df[c].isna().sum()) for c in df.columns if df[c].isna().any()},
    )
    print("duplicados completos:", int(df.duplicated().sum()))
    print("Fare==0:", int((df["Fare"] == 0).sum()))
    print("original sha256:", sha256(SRC))
    print("copia   sha256:", sha256(OUT))


if __name__ == "__main__":
    main()
