import json, re, subprocess, sys

PDF = "liste2.pdf"
GRADES = {1: (54, 57), 2: (58, 61), 3: (62, 67)}
CLASS_RE = re.compile(r"^\(?(n\. m\.|n\. f\.|n\. m\. et f\.|n\.|v\.|adj\.|adv\.|dét\.|prép\.|pron\.|conj\.|interj\.|pron\. et dét\.)\)?$")
SKIP = {"Mot", "Classe", "de mot", "ANNÉE"}

def column(page, x):
    out = subprocess.run(["pdftotext", "-f", str(page), "-l", str(page), "-layout",
                          "-x", str(x), "-y", "60", "-W", "306", "-H", "680", PDF, "-"],
                         capture_output=True, text=True).stdout
    return out.splitlines()

def is_noise(l):
    t = l.strip()
    return (not t or re.match(r"\s*2\.3\.\d", l) or "ANNÉE" in l or t in SKIP
            or t.startswith("ste") or t.startswith("Liste") or t.startswith("Document")
            or t.startswith("orthographique") or t.startswith("Ministère") or t.isdigit())

def base_indent(lines):
    inds = [len(l) - len(l.lstrip()) for l in lines if not is_noise(l)]
    return min(inds) if inds else 0

def parse(lines):
    words = []
    base = base_indent(lines)
    cur = None
    for raw in lines:
        if not raw.strip():
            continue
        if re.match(r"\s*2\.3\.\d", raw) or "ANNÉE" in raw:
            continue
        indent = len(raw) - len(raw.lstrip())
        # split word part and class part (class column starts far right)
        parts = re.split(r"\s{3,}", raw.strip())
        text = parts[0].strip()
        cls = None
        for p in parts[1:]:
            if CLASS_RE.match(p.strip()):
                cls = p.strip().strip("()")
        if is_noise(raw):
            continue
        rectifiee = text.endswith(" OR")
        text = text[:-3].strip() if rectifiee else text
        if CLASS_RE.match(text):
            if cur: cur["classe"] = cur["classe"] or text.strip("()")
            continue
        if indent == base and cur and cur.get("_pending"):
            cur["variantes"] = cur.get("variantes", []) + [text]
            cur.pop("_pending")
            if cls and not cur["classe"]: cur["classe"] = cls
            continue
        if indent == base:
            if " / " in text and not text.endswith("/"):
                a, b = [t.strip() for t in text.split(" / ", 1)]
                cur = {"mot": a, "classe": cls, "formes": [], "variantes": [b]}
                words.append(cur); continue
            pending = text.endswith("/")
            text = text.rstrip("/ ").strip()
            cur = {"mot": text, "classe": cls, "formes": []}
            if pending: cur["_pending"] = True
            if rectifiee: cur["or"] = True
            words.append(cur)
        else:
            if cur is None:
                continue
            f = text.strip("()")
            cur["formes"].append(f)
            if cls and not cur["classe"]:
                cur["classe"] = cls
    return words

result = {}
for grade, (a, b) in GRADES.items():
    words = []
    for p in range(a, b + 1):
        for x in (0, 306):
            words.extend(parse(column(p, x)))
    result[grade] = words

for g, ws in result.items():
    print(f"grade {g}: {len(ws)} mots", file=sys.stderr)
    with open(f"/Users/dbedard/claude-project/dictee-zombie/data/mots-{g}.json", "w") as f:
        json.dump(ws, f, ensure_ascii=False, indent=1)
