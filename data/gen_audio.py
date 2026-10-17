"""Génère les clips audio (edge-tts, voix fr-CA neuronales) dans audio/<voix>/<slug>.mp3 + audio/manifest.json.
Usage : "$HOME/Library/Application Support/pipx/venvs/edge-tts/bin/python" data/gen_audio.py [--limit N] [--voices sylvie,jean]"""
import asyncio, json, os, sys, time
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = json.load(open(os.path.join(ROOT, "data/phrases.json")))
OUT = os.path.join(ROOT, "audio")

def slug(text):
    return "".join(c if ("a" <= c <= "z" or "0" <= c <= "9") else "_%x" % ord(c) for c in text.strip().lower())

def items():
    out = []  # (text, rate)
    for g in (1, 2, 3):
        for w in json.load(open(os.path.join(ROOT, f"data/mots-{g}.json"))):
            out.append((w["mot"], "-15%"))
    for l in P["letters"]: out.append((l, "-10%"))
    for n in range(0, 101): out.append((str(n), "-10%"))
    for t in P["bignumbers"] + P["hours"]: out.append((t, "-10%"))
    for w in json.load(open(os.path.join(ROOT, "data/lecture.json"))): out.append((w["mot"], "-15%"))
    for t in P["instruments"] + P["misc2"]: out.append((t, "+0%"))
    for w in json.load(open(os.path.join(ROOT, "data/sons.json"))): out.append((w["mot"], "-15%"))
    for t in P["misc3"]: out.append((t, "+0%"))
    for w in json.load(open(os.path.join(ROOT, "data/syllabes.json"))): out.append((w["mot"], "-15%"))
    for t in P["misc4"]: out.append((t, "+0%"))
    for t in P["misc6"]: out.append((t, "+0%"))
    for t in P["misc5"] + json.load(open(os.path.join(ROOT, "data/phrases-desordre.json"))): out.append((t, "+0%"))
    for t in list(P["consignes"].values()) + P["praise"] + P["misc"] + list(P["themes"].values()) + list(P["styles"].values()):
        out.append((t, "+0%"))
    seen = set()
    return [x for x in out if not (x[0] in seen or seen.add(x[0]))]

async def gen(sem, voice_id, text, rate, path):
    if os.path.exists(path) and os.path.getsize(path) > 0: return
    async with sem:
        for attempt in range(6):
            try:
                await edge_tts.Communicate(text, voice_id, rate=rate).save(path + ".tmp")
                if os.path.getsize(path + ".tmp") > 0: os.replace(path + ".tmp", path); return
                raise RuntimeError("clip vide")
            except Exception as e:
                if os.path.exists(path + ".tmp"): os.remove(path + ".tmp")
                await asyncio.sleep(4 * (attempt + 1)); err = e
        print("ÉCHEC", voice_id, text, err, file=sys.stderr)

async def main():
    args = sys.argv[1:]
    limit = int(args[args.index("--limit") + 1]) if "--limit" in args else None
    voices = args[args.index("--voices") + 1].split(",") if "--voices" in args else list(P["voices"])
    sem = asyncio.Semaphore(2)
    tasks, manifest = [], {}
    base = items()[:limit] if limit else items()
    for v in voices:
        vid = P["voices"][v]; d = os.path.join(OUT, v); os.makedirs(d, exist_ok=True)
        lst = base + [(f"Salut! Moi c'est {P['voiceNames'][v]}. On joue ensemble?", "+0%")]
        manifest[v] = [slug(t) for t, _ in lst]
        for text, rate in lst:
            tasks.append(gen(sem, vid, text, rate, os.path.join(d, slug(text) + ".mp3")))
    t0 = time.time()
    await asyncio.gather(*tasks)
    # ne garder dans le manifeste que les fichiers réellement présents
    for v in voices:
        for fn in os.listdir(os.path.join(OUT, v)):
            fp = os.path.join(OUT, v, fn)
            if fn.endswith(".mp3") and os.path.getsize(fp) == 0: os.remove(fp)
        manifest[v] = sorted(s for s in manifest[v] if os.path.isfile(os.path.join(OUT, v, s + ".mp3")) and os.path.getsize(os.path.join(OUT, v, s + ".mp3")) > 0)
    old = {}
    mp = os.path.join(OUT, "manifest.json")
    if os.path.exists(mp): old = json.load(open(mp))
    old.update(manifest)
    json.dump(old, open(mp, "w"), ensure_ascii=False)
    print(f"{len(tasks)} clips en {time.time()-t0:.0f}s ; manifest : { {v: len(s) for v, s in old.items()} }")

asyncio.run(main())
