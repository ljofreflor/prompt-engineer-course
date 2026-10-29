#!/usr/bin/env python3
"""Lab 08/u04: estimar costo local (7B) vs API por token para un volumen diario.

No llama al modelo: es una planilla reproducible. Ajustá precios con env vars.
"""

from __future__ import annotations

import os

# Defaults ilustrativos (actualizar al dictado; no son cotizaciones)
LOCAL_WATT = float(os.environ.get("LOCAL_GPU_WATT", "150"))
KWH_PRICE_CLP = float(os.environ.get("KWH_PRICE_CLP", "150"))  # ~CLP/kWh
API_IN_PER_1M = float(os.environ.get("API_IN_USD_PER_1M", "0.15"))
API_OUT_PER_1M = float(os.environ.get("API_OUT_USD_PER_1M", "0.60"))
REQ_PER_DAY = int(os.environ.get("REQ_PER_DAY", "10000"))
TOKENS_IN = int(os.environ.get("TOKENS_IN", "400"))
TOKENS_OUT = int(os.environ.get("TOKENS_OUT", "200"))
LATENCY_S = float(os.environ.get("LOCAL_LATENCY_S", "2.0"))  # s por request en laptop


def main() -> None:
    hours = (REQ_PER_DAY * LATENCY_S) / 3600.0
    local_clp = hours * (LOCAL_WATT / 1000.0) * KWH_PRICE_CLP
    api_usd = (
        REQ_PER_DAY
        * ((TOKENS_IN / 1e6) * API_IN_PER_1M + (TOKENS_OUT / 1e6) * API_OUT_PER_1M)
    )
    print("OK lab08/u04 cost estimate")
    print(f"  volume: {REQ_PER_DAY} req/day · in={TOKENS_IN} out={TOKENS_OUT}")
    print(f"  local runtime≈{hours:.2f} h/day · energy≈{local_clp:.0f} CLP/day @ {LOCAL_WATT}W")
    print(f"  api≈${api_usd:.2f} USD/day (in ${API_IN_PER_1M}/1M · out ${API_OUT_PER_1M}/1M)")
    print("  Note: local omits CAPEX/depreciation; API omits egress and retries.")


if __name__ == "__main__":
    main()
