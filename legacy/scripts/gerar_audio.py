#!/usr/bin/env python3
"""
gerar_audio.py — gera os mp3 do jogo com edge-tts (voz de criança en-US).

Lê o vocabulário e as frases diretamente de js/data.js (bloco JSON entre
os marcadores JSON-START/JSON-END), por isso nunca fica dessincronizado:
acrescentas palavras no data.js, voltas a correr este script e pronto.

Uso:
    pip install edge-tts
    python3 scripts/gerar_audio.py

Saída:
    audio/en/<palavra>.mp3        (ex.: audio/en/car.mp3)
    audio/phrases/<frase>.mp3     (ex.: audio/phrases/well_done.mp3)
"""

import asyncio
import json
import re
import sys
from pathlib import Path

try:
    import edge_tts
except ImportError:
    sys.exit("Falta o edge-tts. Instala com:  pip install edge-tts")

# Voz de criança, inglês americano. Alternativas: en-US-AvaNeural (adulta suave)
VOZ = "en-US-AnaNeural"
RATE = "-10%"   # um pouco mais devagar, para criança de 5 anos

RAIZ = Path(__file__).resolve().parent.parent
DATA_JS = RAIZ / "js" / "data.js"


def carregar_dados():
    texto = DATA_JS.read_text(encoding="utf-8")
    m = re.search(r"/\*JSON-START\*/(.*?)/\*JSON-END\*/", texto, re.DOTALL)
    if not m:
        sys.exit("Não encontrei o bloco JSON em js/data.js")
    return json.loads(m.group(1))


async def gerar(texto: str, destino: Path):
    destino.parent.mkdir(parents=True, exist_ok=True)
    com = edge_tts.Communicate(texto, VOZ, rate=RATE)
    await com.save(str(destino))
    print(f"  ✓ {destino.relative_to(RAIZ)}  («{texto}»)")


async def main():
    dados = carregar_dados()

    print(f"A gerar áudios com a voz {VOZ}…\n")

    print("Palavras:")
    for w in dados["words"]:
        await gerar(w["en"], RAIZ / "audio" / "en" / f"{w['id']}.mp3")

    print("\nFrases-guia:")
    for fid, frase in dados["phrases"].items():
        await gerar(frase, RAIZ / "audio" / "phrases" / f"{fid}.mp3")

    print("\nFeito! Abre o index.html e a app passa a usar estes áudios.")


if __name__ == "__main__":
    asyncio.run(main())
