#!/usr/bin/env python3
"""
gerar_audio.py — gera os mp3 do jogo com edge-tts (voz de criança en-US).

Lê data/packs/*.json (palavras e frases de contexto) e
data/ui-phrases.json (frases de sistema). Só gera o que falta;
usa --force para regenerar tudo.

Uso:
    pip install edge-tts
    python3 scripts/gerar_audio.py [--force]

Saída:
    public/audio/en/<palavra>.mp3
    public/audio/phrases/<frase>.mp3
"""

import asyncio
import json
import shutil
import subprocess
import sys
from pathlib import Path

try:
    import edge_tts
except ImportError:
    sys.exit("Falta o edge-tts. Instala com:  pip install edge-tts")

VOZ = "en-US-AnaNeural"   # voz de criança; alternativa: en-US-AvaNeural
RATE = "-10%"             # frases: um pouco mais devagar
RATE_PALAVRA = "-30%"     # palavras soltas: bem devagar e claras
# palavras problemáticas — ainda mais devagar (além da regra automática
# de -50% para palavras com ≤3 letras)
RATE_AJUSTES = {
    "book": "-50%",
}
RATE_CURTA = "-50%"  # aplicada automaticamente a palavras com ≤3 letras
# truque de ênfase: texto FALADO diferente do escrito. CUIDADO: esticar
# vogais em inglês muda a pronúncia ("reeed" lê-se "reed") — não usar.
# Reservado para casos verificados ao ouvido, um a um.
TEXTO_AJUSTES = {}


def rate_para(word_id: str, texto_en: str) -> str:
    if word_id in RATE_AJUSTES:
        return RATE_AJUSTES[word_id]
    if len(texto_en) <= 3:
        return RATE_CURTA
    return RATE_PALAVRA

RAIZ = Path(__file__).resolve().parent.parent
PACKS = sorted((RAIZ / "data" / "packs").glob("*.json"))
UI_PHRASES = RAIZ / "data" / "ui-phrases.json"
FORCE = "--force" in sys.argv


def almofadar(destino: Path):
    """300 ms de silêncio antes e depois — sem isto, o altifalante do
    tablet 'come' o arranque de palavras curtas (red → ...ed)."""
    if shutil.which("ffmpeg") is None:
        return
    tmp = destino.with_suffix(".pad.mp3")
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-y", "-i", str(destino),
         "-af", "adelay=300:all=1,apad=pad_dur=0.3",
         "-codec:a", "libmp3lame", "-q:a", "4", str(tmp)],
        check=True,
    )
    tmp.replace(destino)


async def gerar(texto: str, destino: Path, rate: str = RATE):
    if destino.exists() and not FORCE:
        return
    destino.parent.mkdir(parents=True, exist_ok=True)
    com = edge_tts.Communicate(texto, VOZ, rate=rate)
    await com.save(str(destino))
    almofadar(destino)
    print(f"  ✓ {destino.relative_to(RAIZ)}  («{texto}»)")


async def main():
    print(f"A gerar áudios com a voz {VOZ}…\n")

    print("Palavras e frases de contexto:")
    for ficheiro in PACKS:
        pack = json.loads(ficheiro.read_text(encoding="utf-8"))
        for w in pack["words"]:
            await gerar(
                TEXTO_AJUSTES.get(w["id"], w["en"]),
                RAIZ / "public" / "audio" / "en" / f"{w['id']}.mp3",
                rate=rate_para(w["id"], w["en"]),
            )
            for p in w.get("phrases", []):
                await gerar(p["en"], RAIZ / "public" / "audio" / "phrases" / f"{p['id']}.mp3")

    print("\nFrases de sistema:")
    ui = json.loads(UI_PHRASES.read_text(encoding="utf-8"))
    for fid, frase in ui.items():
        await gerar(frase, RAIZ / "public" / "audio" / "phrases" / f"{fid}.mp3")

    print("\nFeito! Corre `npm run check` para confirmar a cobertura.")


if __name__ == "__main__":
    asyncio.run(main())
