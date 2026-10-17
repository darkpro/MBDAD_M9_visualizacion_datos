"""Paso 07 - Implementacion del enriquecimiento.

Entrada : proyecto/01_dataset/Titanic-Dataset_etl.csv         (paso 05, v1)
Salida  : proyecto/01_dataset/Titanic-Dataset_enriquecido.csv
Reglas  : ENR-01..ENR-06 en proyecto/03_decisiones/04_decisiones_enriquecimiento.md

Anade 6 columnas al final y conserva las 12 originales y su orden.
Sin imputacion, sin geografia, sin parentesco inferido, sin KPI. Idempotente.
"""

import hashlib
import re
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
IN = ROOT / "01_dataset" / "Titanic-Dataset_etl.csv"
OUT = ROOT / "01_dataset" / "Titanic-Dataset_enriquecido.csv"

BASE_COLUMNS = [
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
NEW_COLUMNS = [
    "Titulo",
    "TamanoFamilia",
    "Cubierta",
    "BanderaSinAge",
    "BanderaSinCabin",
    "BanderaSinEmbarked",
]
EXPECTED_IN_SHA = "cf59b3abde13b0a1917771a118c92f4ffd0eb68a2517500f96d8a8f1b877f916"
EXPECTED_ROWS = 891
TITULO_RE = re.compile(r",\s*([^.]+)\.")
SINONIMOS = {"Mlle": "Miss", "Ms": "Miss", "Mme": "Mrs"}
TITULO_ESPERADO = {
    "Mr": 517,
    "Miss": 185,
    "Mrs": 126,
    "Master": 40,
    "Dr": 7,
    "Rev": 6,
    "Major": 2,
    "Col": 2,
    "the Countess": 1,
    "Capt": 1,
    "Sir": 1,
    "Lady": 1,
    "Don": 1,
    "Jonkheer": 1,
}
TAMANO_ESPERADO = {1: 537, 2: 161, 3: 102, 4: 29, 5: 15, 6: 22, 7: 12, 8: 6, 11: 7}
CUBIERTA_ESPERADA = {
    "A": 15,
    "B": 47,
    "C": 59,
    "D": 33,
    "E": 32,
    "F": 13,
    "G": 4,
    "T": 1,
}
BANDERAS_ESPERADAS = {
    "BanderaSinAge": 177,
    "BanderaSinCabin": 687,
    "BanderaSinEmbarked": 2,
}


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def titulo(name):
    m = TITULO_RE.search(name)
    if m is None:
        return None
    raw = m.group(1).strip()
    return SINONIMOS.get(raw, raw)


def cubierta(cabin):
    if not isinstance(cabin, str) or not cabin.strip():
        return None
    return cabin.strip()[0]


def cargar():
    if not IN.exists():
        print(f"ENRIQUECIMIENTO FALLO: no existe {IN}")
        sys.exit(1)
    got = sha256(IN)
    if got != EXPECTED_IN_SHA:
        print(f"ENRIQUECIMIENTO FALLO: hash de entrada {got} != {EXPECTED_IN_SHA}")
        sys.exit(1)
    return pd.read_csv(IN, dtype=str, keep_default_na=False, na_values=[""])


def enriquecer(df):
    out = df[BASE_COLUMNS].copy()
    out["Titulo"] = df["Name"].map(titulo)
    out["TamanoFamilia"] = (
        pd.to_numeric(df["SibSp"], errors="raise").astype("Int64")
        + pd.to_numeric(df["Parch"], errors="raise").astype("Int64")
        + 1
    ).astype("int64")
    out["Cubierta"] = df["Cabin"].map(cubierta)
    out["BanderaSinAge"] = df["Age"].isna().astype(int)
    out["BanderaSinCabin"] = df["Cabin"].isna().astype(int)
    out["BanderaSinEmbarked"] = df["Embarked"].isna().astype(int)
    return out[list(BASE_COLUMNS) + NEW_COLUMNS]


def validar(df):
    errs = []
    if df.shape != (EXPECTED_ROWS, len(BASE_COLUMNS) + len(NEW_COLUMNS)):
        errs.append(f"shape {df.shape} != ({EXPECTED_ROWS}, 18)")
    if list(df.columns) != BASE_COLUMNS + NEW_COLUMNS:
        errs.append("columnas u orden distintos")

    t = df["Titulo"]
    if int(t.isna().sum()) != 0:
        errs.append(f"Titulo con {int(t.isna().sum())} faltantes")
    got_t = {k: int(v) for k, v in t.value_counts().items()}
    if got_t != TITULO_ESPERADO:
        errs.append(f"Titulo distinto: {got_t}")

    tf = df["TamanoFamilia"]
    got_f = {int(k): int(v) for k, v in tf.value_counts().items()}
    if got_f != TAMANO_ESPERADO:
        errs.append(f"TamanoFamilia distinto: {got_f}")
    if int(tf.min()) < 1:
        errs.append("TamanoFamilia < 1")

    c = df["Cubierta"]
    got_c = {k: int(v) for k, v in c.value_counts().items()}
    if got_c != CUBIERTA_ESPERADA:
        errs.append(f"Cubierta distinta: {got_c}")
    if int(c.isna().sum()) != EXPECTED_ROWS - sum(CUBIERTA_ESPERADA.values()):
        errs.append(f"Cubierta faltantes {int(c.isna().sum())}")

    for col, n in BANDERAS_ESPERADAS.items():
        vals = set(df[col].unique())
        if not vals <= {0, 1}:
            errs.append(f"{col} fuera de dominio: {sorted(vals)}")
        if int(df[col].sum()) != n:
            errs.append(f"{col} suma {int(df[col].sum())} != {n}")

    if df["PassengerId"].duplicated().any():
        errs.append("PassengerId repetido")
    return errs


def check_originales(df):
    """Las 12 columnas originales deben salir intactas."""
    src = pd.read_csv(IN, dtype=str, keep_default_na=False, na_values=[""])
    a = src[BASE_COLUMNS].fillna("<NA>")
    b = df[BASE_COLUMNS].fillna("<NA>")
    if not a.equals(b):
        return ["las columnas originales cambiaron"]
    return []


def main():
    src = cargar()
    df = enriquecer(src)
    errs = validar(df) + check_originales(df)
    if errs:
        print("ENRIQUECIMIENTO FALLO: " + "; ".join(errs))
        sys.exit(1)
    df.to_csv(OUT, index=False, na_rep="", lineterminator="\n", encoding="utf-8")
    print(f"ENRIQUECIMIENTO OK | filas={len(df)} cols={df.shape[1]}")
    print(f"in  sha256 {sha256(IN)}")
    print(f"out sha256 {sha256(OUT)}")
    print("nuevas:", NEW_COLUMNS)


if __name__ == "__main__":
    main()
