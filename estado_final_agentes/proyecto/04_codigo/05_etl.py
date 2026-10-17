"""Paso 05 - Implementacion del ETL.

Entrada : proyecto/01_dataset/Titanic-Dataset_clean.csv   (paso 03, v1)
Salida  : proyecto/01_dataset/Titanic-Dataset_etl.csv     (base analitica)
Reglas  : ETL-01..ETL-10 en proyecto/03_decisiones/10_decisiones_etl.md

Sin base de datos, sin uniones, sin enriquecimiento, sin KPI.
Unica transformacion: orden determinista por PassengerId (idempotente).
"""

import hashlib
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
IN = ROOT / "01_dataset" / "Titanic-Dataset_clean.csv"
OUT = ROOT / "01_dataset" / "Titanic-Dataset_etl.csv"

COLUMNS = [
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
FLOAT_COLS = ["Age", "Fare"]
DOMAINS = {
    "Survived": {0, 1},
    "Pclass": {1, 2, 3},
    "Sex": {"male", "female"},
    "Embarked": {"C", "Q", "S"},
}
EXPECTED_ROWS = 891
EXPECTED_NULLS = {"Age": 177, "Cabin": 687, "Embarked": 2}


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def cargar():
    if not IN.exists():
        print(f"ETL FALLO: no existe {IN}")
        sys.exit(1)
    df = pd.read_csv(IN, dtype=str, keep_default_na=False, na_values=[""])
    for col in INT_COLS:
        df[col] = pd.to_numeric(df[col], errors="raise").astype("Int64")
    for col in FLOAT_COLS:
        df[col] = pd.to_numeric(df[col], errors="raise").astype(float)
    return df[COLUMNS]


def validar(df):
    errs = []
    if df.shape != (EXPECTED_ROWS, len(COLUMNS)):
        errs.append(f"shape {df.shape} != ({EXPECTED_ROWS}, {len(COLUMNS)})")
    if list(df.columns) != COLUMNS:
        errs.append("columnas u orden distintos")
    if df["PassengerId"].isna().any() or df["PassengerId"].duplicated().any():
        errs.append("clave PassengerId nula o repetida")
    if df.duplicated().any():
        errs.append("filas duplicadas")
    for col, dom in DOMAINS.items():
        got = set(df[col].dropna().unique())
        if not got <= dom:
            errs.append(f"dominio {col} fuera de rango: {sorted(got)}")
    for col, n in EXPECTED_NULLS.items():
        if int(df[col].isna().sum()) != n:
            errs.append(f"nulos {col}={int(df[col].isna().sum())} != {n}")
    return errs


def main():
    df = cargar().sort_values("PassengerId", kind="stable").reset_index(drop=True)
    errs = validar(df)
    if errs:
        print("ETL FALLO: " + "; ".join(errs))
        sys.exit(1)
    df.to_csv(OUT, index=False, na_rep="", lineterminator="\n", encoding="utf-8")
    print(f"ETL OK | filas={len(df)} cols={df.shape[1]}")
    print(f"in  sha256 {sha256(IN)}")
    print(f"out sha256 {sha256(OUT)}")
    print("nulos:", {c: int(df[c].isna().sum()) for c in COLUMNS if df[c].isna().any()})


if __name__ == "__main__":
    main()
