/* Les Zombinettes — français et maths pour le 1er cycle du primaire */
(() => {
const STORE_KEY = "zombinettes.v1";
const DEFAULTS = {
  palier: 5, palierAuto: true, mode: "tiles", decoys: 3, pin: "1234", weekly: [], theme: "violet", bg: "dark", avatar: null, custom: null, voice: "sylvie", pitch: 1,
  mute: { word: false, read: false, sound: false, syllab: false, phrase: false, money: false, keys: false, figures: false, number: false, calc: false, compare: false, clock: false, trace: false, music: false },
  stars: 0, stickers: {}, sessions: 0, progress: {}, sessionLength: 8, newPerSession: 3,
  math: { numMax: 199, firstMax: 20, addMax: 10, sub: true, visual: true, length: 8 },
  mathStats: { number: { ok: 0, ko: 0 }, calc: { ok: 0, ko: 0 }, trace: { ok: 0, ko: 0 }, read: { ok: 0, ko: 0 }, sound: { ok: 0, ko: 0 }, syllab: { ok: 0, ko: 0 }, phrase: { ok: 0, ko: 0 }, money: { ok: 0, ko: 0 }, keys: { ok: 0, ko: 0 }, figures: { ok: 0, ko: 0 }, compare: { ok: 0, ko: 0 }, clock: { ok: 0, ko: 0 }, music: { ok: 0, ko: 0 } },
  trace: { lower: true, upper: true, digits: true, nums: true, cursive: true, cwords: true, length: 6 },
  read: { level: 2 }, sound: { rime: true, debut: true }, phrase: { max: 4 }, money: { level: 1 }, keys: { level: 3 }, daily: null, streak: { n: 0, last: "" }, cmp: { max: 1000 }, clock: { level: 1 }, music: { pitch: true, rhythm: true, instr: true, level: 2 },
  plays: { word: 0, read: 0, sound: 0, syllab: 0, phrase: 0, money: 0, keys: 0, figures: 0, number: 0, calc: 0, compare: 0, clock: 0, trace: 0, music: 0 },
  boost: 4
};
const ACTIVITIES = [
  ["word", "Les mots", "🎤", "#7c3aed", "#ec4899", "Dictée · liste du ministère"],
  ["read", "Lire", "📖", "#db2777", "#f59e0b", "Lis le mot, trouve l'image"],
  ["syllab", "Syllabes", "🥁", "#ea580c", "#facc15", "Un coup de tambour par syllabe"],
  ["sound", "Rimes et sons", "👂", "#0891b2", "#a3e635", "Ça rime? Ça commence pareil?"],
  ["phrase", "Phrases", "🧩", "#7c3aed", "#22d3ee", "Remets les mots en ordre"],
  ["trace", "Tracer les lettres", "✏️", "#14b8a6", "#8b5cf6", "Lettres, mots et attaché"],
  ["number", "Les nombres", "🔢", "#0ea5e9", "#22c55e", "Écoute et écris le nombre"],
  ["calc", "Les calculs", "➕", "#f97316", "#ef4444", "Additions et soustractions"],
  ["compare", "Plus grand?", "🐊", "#16a34a", "#0ea5e9", "Le plus grand, le plus petit"],
  ["money", "Les sous", "🪙", "#ca8a04", "#64748b", "Compte l'argent"],
  ["clock", "L'heure", "🕒", "#6366f1", "#06b6d4", "Lis l'heure sur l'horloge"],
  ["traceNum", "Tracer les chiffres", "✍️", "#0d9488", "#3b82f6", "Chiffres et nombres"],
  ["pitch", "Aigu ou grave", "🔔", "#a855f7", "#f43f5e", "Quel son est le plus aigu?"],
  ["rhythm", "Rythme", "🥁", "#f43f5e", "#f97316", "Ta, ti-ti, chut au tambour"],
  ["instr", "Instrument mystère", "🎻", "#9333ea", "#0ea5e9", "Quel instrument joue?"],
  ["keys", "Piano", "🎹", "#0f172a", "#a855f7", "Trouve la note sur le clavier"],
  ["figures", "Les notes", "🎼", "#be185d", "#6366f1", "Ronde, blanche, noire…"]
];
const CATS = [
  ["fr", "Français", "📚", "#7c3aed", "#ec4899", ["word", "read", "syllab", "sound", "phrase", "trace"]],
  ["math", "Maths", "🧮", "#0ea5e9", "#22c55e", ["number", "calc", "compare", "money", "clock", "traceNum"]],
  ["mus", "Musique", "🎵", "#a855f7", "#f43f5e", ["pitch", "rhythm", "instr", "keys", "figures"]]
];
const DAILY_MIX = { fr: 4, math: 4, mus: 2 }, NO_MIX = ["trace", "traceNum"];
const HUNDREDS = ["", "cent", "deux cents", "trois cents", "quatre cents", "cinq cents", "six cents", "sept cents", "huit cents", "neuf cents"];
const THOUSANDS = ["", "mille", "deux mille", "trois mille", "quatre mille", "cinq mille", "six mille", "sept mille", "huit mille", "neuf mille"];
const HOURS = ["midi", "une heure", "deux heures", "trois heures", "quatre heures", "cinq heures", "six heures", "sept heures", "huit heures", "neuf heures", "dix heures", "onze heures", "midi"];
const INSTRUMENTS = [["piano", "le piano", "🎹"], ["guitar", "la guitare", "🎸"], ["violin", "le violon", "🎻"], ["trumpet", "la trompette", "🎺"], ["saxophone", "le saxophone", "🎷"], ["flute", "la flûte", "🪈"], ["drum", "le tambour", "🥁"]];
const CURSIVE_WORDS = ["ami", "chat", "lit", "nez", "eau", "jeu", "lune", "main", "mot", "nuit", "rue", "sac", "vélo", "bébé", "dix", "feu", "loup", "roi", "pain", "pied", "lire", "jour", "soir", "gris", "bleu", "fée", "papa", "maman", "robe", "page"];
const NOTES = ["do", "ré", "mi", "fa", "sol", "la", "si"], NOTE_SEMI = [0, 2, 4, 5, 7, 9, 11];
const DURATIONS = { ronde: 4, blanche: 2, noire: 1 }, TEMPS = { 1: "un temps", 2: "deux temps", 4: "quatre temps" };
const FIGURES = [["ronde", "la ronde", "Touche la ronde."], ["blanche", "la blanche", "Touche la blanche."], ["noire", "la noire", "Touche la noire."], ["croches", "les deux croches", "Touche les deux croches."], ["cle-sol", "la clé de sol", "Touche la clé de sol."], ["cle-fa", "la clé de fa", "Touche la clé de fa."]];
const DECOY = { a: "oeà", à: "a", e: "éèa", é: "eèê", è: "éeê", ê: "èé", i: "ly", o: "au", u: "on", y: "i", s: "zc", c: "sk", k: "c", g: "jq", j: "g", m: "n", n: "mu", b: "dp", d: "bt", p: "qb", q: "pg", t: "df", f: "vt", v: "f", l: "i", r: "l", h: "n", z: "s", x: "s" };
const THEME_AVATAR = { violet: "🧟‍♀️", zombie: "🧟‍♀️", vampire: "🧛‍♀️", loup: "🐺", licorne: "🦄", ocean: "🐬", chanteuse: "👩‍🎤", sirene: "🧜‍♀️" };
const STICKERS = ["🧟‍♀️", "🧛‍♀️", "🐺", "👻", "🦇", "🕸️", "🎃", "📣", "🎤", "🎥", "📱", "🔔", "👍", "🎬", "🎮", "💜", "🧸", "🦄", "🌈", "⭐", "🍭", "🎀", "🎸", "🩰", "🎧", "🐱", "🌸", "🍦", "🦋", "🎉", "👑", "🐶", "🍩", "🛼", "🎈", "🌙", "🧟", "🧟‍♂️", "🧛", "🧛‍♂️", "🧙‍♀️", "🧚‍♀️", "🧜‍♀️", "👸", "🦸‍♀️", "🥷", "💀", "☠️", "🕷️", "🐈‍⬛", "🦉", "🐸", "🐼", "🐨", "🦊", "🐰", "🐹", "🐧", "🐙", "🦈", "🐬", "🦖", "🐉", "🐝", "🐞", "🌺", "🌻", "🍀", "🌵", "🍓", "🍒", "🍉", "🍕", "🧁", "🍪", "🍫", "🍿", "🧋", "🥤", "🎂", "🍰", "💍", "👠", "👗", "👛", "🕶️", "💄", "💅", "🪩", "🎹", "🎷", "🎺", "🥁", "🪇", "🎵", "🎶", "🎙️", "📸", "🎨", "🖍️", "🪄", "🔮", "🪅", "🎁", "🚀", "🛸", "❄️", "⚡", "🥇"];
const PRAISE = ["Bravo!", "Wow!", "Super!", "Génial!", "Trop fort!", "Yé!", "Championne!", "Parfait!", "Incroyable!"];
const BOX_GAP = [0, 2, 4, 8];
const PALIERS = { 1: [1, 2, 3, 4], 2: [5, 6, 7], 3: [8, 9, 10] };
const THEMES = [["violet", "💜"], ["zombie", "🧟‍♀️"], ["vampire", "🧛‍♀️"], ["loup", "🐺"], ["licorne", "🦄"], ["ocean", "🐬"], ["chanteuse", "👩‍🎤"], ["sirene", "🧜‍♀️"]];
const DUOS = [["rose", "💗", "#ec4899", "#f97316"], ["soleil", "🌞", "#fbbf24", "#f43f5e"], ["foret", "🌿", "#22c55e", "#0ea5e9"], ["ciel", "💙", "#3b82f6", "#a855f7"], ["raisin", "🍇", "#8b5cf6", "#ec4899"], ["menthe", "🧊", "#14b8a6", "#67e8f9"]];
const AVATARS = ["🧟‍♀️", "🧛‍♀️", "🐺", "👻", "🦇", "🎃", "🧙‍♀️", "🧚‍♀️", "🤖", "🐱", "🦄", "🐸"];
const VOICE_STYLES = [["normal", "🙂", 1], ["petite", "🐭", 1.4], ["grosse", "🐺", 0.7], ["robot", "🤖", "robot"]];
const EDGE_VOICES = [["sylvie", "Sylvie", "🧟‍♀️"], ["jean", "Jean", "🧛‍♂️"]];
const SYSTEM_VOICE_OK = /^(amélie|amelie|daniel)\b/i;
const THEME_NAMES = { violet: "Violette", zombie: "Zombie", vampire: "Vampire", loup: "Loup-garou", licorne: "Licorne", ocean: "Océan", chanteuse: "Chanteuse", sirene: "Sirène" };
const STYLE_NAMES = { 1: "Voix normale", 1.4: "Petite voix", 0.7: "Grosse voix", robot: "Voix de robot" };
let MANIFEST = {};
const GRAPHEMES = ["eau", "ain", "ein", "oin", "ien", "ill", "gn", "ph", "ch", "ou", "on", "om", "an", "am", "en", "em", "in", "im", "un", "oi", "eu", "œu", "au", "ai", "ei", "er", "ez", "et", "qu", "gu", "ss", "ge", "ce", "ç"];
function difficulty(w) {
  const low = w.toLowerCase(); let s = low.length * 0.6;
  s += GRAPHEMES.filter(g => low.includes(g)).length * 0.8;
  if (/[éèêàâùûîôë]/.test(low)) s += 0.7;
  if (/(.)\1/.test(low)) s += 0.8;
  if (/[tdsxpzg]$/.test(low) && low.length > 2) s += 0.9;
  if (/h/.test(low) && !low.includes("ch") && !low.includes("ph")) s += 0.8;
  if (/['’]/.test(low)) s += 1;
  if (/[yw]/.test(low)) s += 0.5;
  return s;
}
function palierLabel(p) { const g = +Object.keys(PALIERS).find(g => PALIERS[g].includes(p)); return `Palier ${p} · ${g}${g === 1 ? "re" : "e"} année`; }
const ANNONCE = { word: "Voici le mot :", number: "Voici le nombre :", calc: "Voici le calcul :" };
const CONSIGNE = {
  word: "Écoute bien le mot, puis écris-le avec les lettres.",
  read: "Lis le mot, puis touche la bonne image.",
  sound: "Écoute bien les mots, puis touche la bonne image.",
  syllab: "Écoute le mot, puis tape une fois sur le tambour pour chaque syllabe.",
  number: "Écoute bien le nombre, puis écris-le avec les chiffres.",
  calc: "Écoute le calcul et écris la réponse.",
  clock: "Regarde bien les aiguilles de l'horloge.",
  trace: "Trace la lettre ou le chiffre avec ton doigt."
};

let S = load();
let PACKS = { 1: [], 2: [], 3: [] };
let session = null;
const app = document.getElementById("app");
const $ = sel => app.querySelector(sel);

function load() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch {}
  const out = Object.assign({}, DEFAULTS, s);
  out.math = Object.assign({}, DEFAULTS.math, s.math || {});
  out.mathStats = Object.assign({}, DEFAULTS.mathStats, s.mathStats || {});
  out.mute = Object.assign({}, DEFAULTS.mute, s.mute || {});
  out.trace = Object.assign({}, DEFAULTS.trace, s.trace || {});
  out.plays = Object.assign({}, DEFAULTS.plays, s.plays || {});
  for (const k of ["read", "sound", "phrase", "money", "keys", "cmp", "clock", "music", "streak"]) out[k] = Object.assign({}, DEFAULTS[k], s[k] || {});
  for (const k in DEFAULTS.mathStats) out.mathStats[k] = out.mathStats[k] || { ok: 0, ko: 0 };
  if (s.voiceURI && !s.voice) out.voice = "system:" + s.voiceURI;
  if (s.palier && (s.boost || 0) < 2) out.clock = { level: 1 };
  if (s.palier && (s.boost || 0) < 3) out.math.numMax = 199;
  if (s.palier && (s.boost || 0) < 4) { out.boost = 4; out.keys = { level: 3 }; }
  if (s.palier && !s.boost) { out.palier = Math.max(out.palier, 5);
    out.math = Object.assign(out.math, { firstMax: Math.max(out.math.firstMax, 20), addMax: Math.max(out.math.addMax, 10), sub: true });
    out.trace = Object.assign(out.trace, { upper: true, cursive: true, cwords: true });
  }
  return out;
}
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch {} }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function rand(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function norm(s) { return String(s).trim().toLowerCase().replace(/’/g, "'"); }

/* ---------- voix ---------- */
let voice = null;
function pickVoice() {
  const vs = speechSynthesis.getVoices();
  voice = vs.find(v => /^fr[-_]CA/i.test(v.lang)) || vs.find(v => /^fr/i.test(v.lang)) || null;
}
if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function frVoices() {
  if (!("speechSynthesis" in window)) return [];
  const seen = new Set();
  return speechSynthesis.getVoices().filter(v => /^fr/i.test(v.lang) && SYSTEM_VOICE_OK.test(v.name)).filter(v => { const k = v.name + v.lang; if (seen.has(k)) return false; seen.add(k); return true; });
}
let actx = null; const BUFFERS = new Map();
function unlockAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state !== "running") actx.resume(); } catch {} }
document.addEventListener("pointerdown", unlockAudio, { passive: true });
async function getBuffer(url) {
  if (BUFFERS.has(url)) return BUFFERS.get(url);
  const buf = await actx.decodeAudioData(await fetch(url).then(r => r.arrayBuffer()));
  BUFFERS.set(url, buf); return buf;
}
const STRETCHED = new Map();
function stretch(buf, f) {
  const key = buf.length + ":" + f + ":" + buf.getChannelData(0)[Math.floor(buf.length / 3)];
  if (STRETCHED.has(key)) return STRETCHED.get(key);
  const x = buf.getChannelData(0), sr = buf.sampleRate, N = 2 * Math.round(sr * 0.02), Hs = N / 2, Ha = Hs / f, tol = Math.round(sr * 0.008);
  const len = Math.ceil(x.length * f) + N, y = new Float32Array(len), wsum = new Float32Array(len), w = new Float32Array(N);
  for (let i = 0; i < N; i++) w[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N);
  let nat = 0;
  for (let k = 0; ; k++) {
    const target = Math.round(k * Ha); if (target + N + tol >= x.length) break;
    let best = target;
    if (k > 0) {
      let bc = -Infinity;
      for (let d = -tol; d <= tol; d += 2) {
        const p = target + d; if (p < 0) continue;
        let c = 0; for (let i = 0; i < Hs; i += 4) c += x[p + i] * x[nat + i];
        if (c > bc) { bc = c; best = p; }
      }
    }
    const o = k * Hs; for (let i = 0; i < N; i++) { y[o + i] += x[best + i] * w[i]; wsum[o + i] += w[i]; }
    nat = best + Hs;
  }
  for (let i = 0; i < len; i++) if (wsum[i] > 1e-3) y[i] /= wsum[i];
  const out = actx.createBuffer(1, len, sr); out.getChannelData(0).set(y);
  STRETCHED.set(key, out); return out;
}
function playClip(url, rate, robot) { return new Promise(async res => {
  try {
    unlockAudio(); if (!actx) return playClipFallback(url, rate).then(res);
    let buf = await getBuffer(url);
    if (rate !== 1) buf = stretch(buf, rate);
    const src = actx.createBufferSource(); src.buffer = buf; src.playbackRate.value = rate;
    let osc = null;
    if (robot) { const ring = actx.createGain(); ring.gain.value = 0; osc = actx.createOscillator(); osc.frequency.value = 45; osc.connect(ring.gain); src.connect(ring); ring.connect(actx.destination); osc.start(); }
    else src.connect(actx.destination);
    src.start();
    current = { pause: () => { try { src.stop(); osc && osc.stop(); } catch {} } };
    src.onended = () => { try { osc && osc.stop(); } catch {} res(true); };
  } catch { res(false); }
}); }
function slug(t) { return Array.from(t.trim().toLowerCase()).map(c => (/[a-z0-9]/.test(c) ? c : "_" + c.codePointAt(0).toString(16))).join(""); }
function clipUrl(text) { const m = MANIFEST[S.voice]; if (!m) return null; const sl = slug(text); return m.has(sl) ? `audio/${S.voice}/${sl}.mp3` : null; }
let sayToken = 0, current = null;
function stopAudio() { sayToken++; if (current) { try { current.pause(); } catch {} current = null; } if ("speechSynthesis" in window) speechSynthesis.cancel(); }
function playClipFallback(url, rate) { return new Promise(res => { const a = new Audio(url); current = a; a.preservesPitch = false; a.mozPreservesPitch = false; a.playbackRate = rate; a.onended = () => res(true); a.onerror = () => res(false); a.play().catch(() => res(false)); }); }
function playTts(text) { return new Promise(res => {
  if (!("speechSynthesis" in window)) return res();
  const u = new SpeechSynthesisUtterance(text);
  const sys = S.voice && S.voice.startsWith("system:") ? speechSynthesis.getVoices().find(v => v.voiceURI === S.voice.slice(7)) : null;
  const v = sys || voice; u.lang = v ? v.lang : "fr-CA"; if (v) u.voice = v; u.rate = S.pitch === "robot" ? 1.1 : 0.9; u.pitch = S.pitch === "robot" ? 0.4 : (S.pitch || 1);
  u.onend = u.onerror = () => res(); speechSynthesis.speak(u); setTimeout(res, 8000);
}); }
async function say(parts) {
  stopAudio(); const tok = sayToken; parts = parts.filter(Boolean);
  const rate = S.pitch === 1.4 ? 1.25 : S.pitch === 0.7 ? 0.8 : 1;
  for (let i = 0; i < parts.length; i++) {
    if (tok !== sayToken) return;
    if (typeof parts[i] === "object") { await new Promise(r => setTimeout(r, parts[i].pause)); continue; }
    const url = clipUrl(parts[i]);
    if (url && await playClip(url, rate, S.pitch === "robot")) {}
    else if (url) await playTts(parts[i]);
    else { let j = i; let txt = parts[i]; while (j + 1 < parts.length && typeof parts[j + 1] === "string" && !clipUrl(parts[j + 1])) { j++; txt += " " + parts[j]; } i = j; await playTts(txt); }
    if (i < parts.length - 1) await new Promise(r => setTimeout(r, 120));
  }
}
function speak(text) { say([text]); }
function chatter(kind, parts) { if (!S.mute[kind]) say(parts); }
function numberParts(n) {
  n = +n; if (n <= 100) return [String(n)];
  const t = Math.floor(n / 1000), h = Math.floor(n % 1000 / 100), r = n % 100;
  return [THOUSANDS[t], HUNDREDS[h], r ? String(r) : ""].filter(Boolean);
}
function timeParts(h, m) { return ["Il est", HOURS[h], ...(m ? numberParts(m) : [])]; }
function promptParts(it) {
  switch (it.kind) {
    case "word": return [it.mot];
    case "trace": return it.num ? numberParts(it.ch) : it.word ? [it.ch] : [it.ch.toLowerCase(), ...(it.ch !== it.ch.toLowerCase() ? ["majuscule"] : [])];
    case "number": return numberParts(it.n);
    case "calc": return [...numberParts(it.a), it.op === "+" ? "plus" : "moins", ...numberParts(it.b)];
    case "read": return [CONSIGNE.read];
    case "syllab": return [it.mot];
    case "phrase": return ["Remets les mots dans l'ordre pour faire une phrase."];
    case "keys": return [`Trouve le ${NOTES[it.note]} sur le clavier.`];
    case "figures": return it.sub === "temps" ? [`Combien de temps vaut ${it.fig[1]}?`] : [FIGURES.find(x => x[0] === it.answer)[2]];
    case "money": return ["Compte l'argent et écris combien ça fait."];
    case "sound": return [it.sub === "rime" ? "Quel mot rime avec" : "Quel mot commence comme", it.target.mot, { pause: 400 }, it.choices[0].mot, it.choices[1].mot, "ou", it.choices[2].mot];
    case "compare": return [it.ask === "grand" ? "Touche le plus grand nombre." : "Touche le plus petit nombre."];
    case "clock": return ["Quelle heure est-il?"];
    case "music": return it.sub === "pitch" ? [it.ask === "aigu" ? "Touche le son le plus aigu." : "Touche le son le plus grave."] : it.sub === "rhythm" ? ["Écoute le rythme, puis tape-le sur le tambour."] : ["Quel instrument joue?"];
  }
  return [];
}
function replay(it) {
  const me = session, idx = session && session.i;
  return say(promptParts(it)).then(() => { if (it.kind === "music" && session === me && session.i === idx && !session.locked && $("#speak")) playMusic(it); });
}
function spellParts(w) { return Array.from(w.toLowerCase()).map(c => c === "'" || c === "’" ? "apostrophe" : c === "-" ? "trait d'union" : c); }
function applyTheme() {
  const h = document.documentElement; h.dataset.theme = S.theme || "violet"; h.dataset.bg = S.bg || "dark";
  if (S.custom) { h.style.setProperty("--accent", S.custom.c1); h.style.setProperty("--accent2", S.custom.c2); h.style.setProperty("--on-accent", S.custom.c1 === "#f1f1f1" || S.custom.c1 === "#fbbf24" ? "#111" : "#fff"); }
  else { h.style.removeProperty("--accent"); h.style.removeProperty("--accent2"); h.style.removeProperty("--on-accent"); }
}
function avatarHtml() { return S.avatar ? `<img src="${S.avatar}" alt="">` : (THEME_AVATAR[S.theme] || "🧟‍♀️"); }
function setAvatarFromFile(file) { return new Promise(res => {
  const img = new Image(); const url = URL.createObjectURL(file);
  img.onload = () => {
    const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d");
    const m = Math.min(img.width, img.height); g.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, 256, 256);
    URL.revokeObjectURL(url); S.avatar = c.toDataURL("image/jpeg", .82); save(); res(true);
  };
  img.onerror = () => res(false); img.src = url;
}); }

/* ---------- mots ---------- */
let POOL = [];
function buildPool() {
  POOL = [];
  for (const g of [1, 2, 3]) {
    const ws = PACKS[g].filter(w => !/\s/.test(w.mot) && w.mot.length >= 2)
      .map(w => ({ kind: "word", key: w.mot, mot: w.mot, level: g, source: "pack", score: difficulty(w.mot) }))
      .sort((a, b) => a.score - b.score || a.mot.length - b.mot.length);
    const ps = PALIERS[g], n = ws.length;
    ws.forEach((w, i) => { w.palier = ps[Math.min(ps.length - 1, Math.floor(i * ps.length / n))]; POOL.push(w); });
  }
}
function poolWords() { return POOL; }
function unlockedWords() { return POOL.filter(w => w.palier <= S.palier); }
function weeklyWords() { return S.weekly.map(m => ({ kind: "word", key: m, mot: m, level: 0, source: "weekly" })); }
function prog(key) { return S.progress[key] || (S.progress[key] = { box: 0, last: -99, ok: 0, ko: 0 }); }
function isDue(key, s) { const p = S.progress[key]; if (!p) return true; return s - p.last >= BOX_GAP[p.box]; }

function buildWordSession() {
  S.sessions += 1; const s = S.sessions;
  const n = S.sessionLength, chosen = [], seen = new Set();
  const add = w => { if (!seen.has(w.key) && chosen.length < n) { seen.add(w.key); chosen.push(w); } };
  weeklyWords().filter(w => isDue(w.key, s)).forEach(add);
  const known = POOL.filter(w => S.progress[w.key]);
  const fresh = unlockedWords().filter(w => !S.progress[w.key]);
  known.filter(w => isDue(w.key, s)).sort((a, b) => prog(a.key).box - prog(b.key).box || prog(b.key).ko - prog(a.key).ko).forEach(add);
  let newCount = 0;
  for (const w of fresh) { if (chosen.length >= n || newCount >= S.newPerSession) break; add(w); newCount++; }
  for (const w of fresh) { if (chosen.length >= n) break; add(w); }
  for (const w of known) { if (chosen.length >= n) break; add(w); }
  save();
  return shuffle(chosen);
}

/* ---------- maths ---------- */
function bigNumber(max) {
  if (max <= 100) return rand(0, max);
  if (max < 1000) return Math.random() < 0.7 ? rand(0, 99) : rand(100, max);
  const r = Math.random(), bands = [[11, 99], [101, Math.min(999, max)], [1001, max]].filter(b => b[0] <= b[1]);
  const b = max >= 1001 ? bands[r < 0.15 ? 0 : r < 0.6 ? 1 : 2] : bands[r < 0.25 ? 0 : 1];
  return rand(b[0], b[1]);
}
function buildNumberSession() {
  const m = S.math, items = [], seen = new Set();
  while (items.length < m.length && seen.size < m.numMax + 1) {
    const n = bigNumber(m.numMax); if (seen.has(n)) continue; seen.add(n);
    items.push({ kind: "number", n, answer: String(n) });
  }
  return items;
}
function buildTraceNumSession() {
  const t = S.trace, pool = [];
  if (t.digits || !t.nums) pool.push(..."0123456789".split("").map(c => ({ kind: "trace", ch: c, isDigit: true })));
  if (t.nums) for (let k = 0; k < 10; k++) pool.push({ kind: "trace", ch: String(rand(10, 99)), isDigit: true, word: true, num: true });
  return shuffle(pool).slice(0, t.length).map(it => Object.assign({ answer: "ok" }, it));
}
function buildTraceSession() {
  const t = S.trace, pool = [];
  if (t.lower) pool.push(..."abcdefghijklmnopqrstuvwxyz".split("").map(c => ({ kind: "trace", ch: c, isDigit: false })));
  if (t.upper) pool.push(..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(c => ({ kind: "trace", ch: c, isDigit: false })));
  if (t.cursive) pool.push(..."abcdefghijklmnopqrstuvwxyz".split("").map(c => ({ kind: "trace", ch: c, isDigit: false, cursive: true })));
  if (t.cwords) pool.push(...shuffle(CURSIVE_WORDS).slice(0, 12).map(w => ({ kind: "trace", ch: w, isDigit: false, cursive: true, word: true })));
  if (!pool.length) pool.push(..."abcdefghijklmnopqrstuvwxyz".split("").map(c => ({ kind: "trace", ch: c, isDigit: false })));
  return shuffle(pool).slice(0, t.length).map(it => Object.assign({ answer: "ok" }, it));
}
function buildCalcSession() {
  const m = S.math, items = [];
  for (let i = 0; i < m.length; i++) {
    const b = rand(1, m.addMax);
    let a = rand(0, m.firstMax), op = "+";
    if (m.sub && Math.random() < 0.5) { op = "−"; a = rand(b, Math.max(b, m.firstMax)); }
    const result = op === "+" ? a + b : a - b;
    items.push({ kind: "calc", a, b, op, answer: String(result) });
  }
  return items;
}
let READ_WORDS = [];
function similarity(a, b) { let p = 0; while (p < a.length && p < b.length && a[p] === b[p]) p++; return p * 2 + (a.slice(-2) === b.slice(-2) ? 1 : 0) - Math.abs(a.length - b.length) * 0.3; }
function buildReadSession() {
  const lvl = S.read.level, n = S.sessionLength;
  const pool = lvl === 1 ? READ_WORDS.filter(w => difficulty(w.mot) < 4.5) : READ_WORDS;
  return shuffle(pool).slice(0, n).map(w => {
    const others = READ_WORDS.filter(o => o !== w);
    const near = lvl === 1 ? shuffle(others) : shuffle(others).sort((x, y) => similarity(w.mot, y.mot) - similarity(w.mot, x.mot)).slice(0, 6);
    const choices = shuffle([w, ...shuffle(near).slice(0, lvl >= 3 ? 3 : 2)]);
    return { kind: "read", mot: w.mot, emoji: w.emoji, choices, answer: w.mot };
  });
}
let PHRASES = [];
function buildPhraseSession() {
  const ok = PHRASES.filter(p => p.replace(".", "").split(" ").length <= S.phrase.max);
  return shuffle(ok.length ? ok : PHRASES).slice(0, S.math.length).map(p => {
    const words = p.replace(/\.$/, " .").split(" ");
    let tiles = shuffle(words.map((_, i) => i)); if (tiles.every((v, i) => v === i)) tiles = tiles.reverse();
    return { kind: "phrase", phrase: p, words, tiles, answer: words.join(" ") };
  });
}
const COINS = { 5: ["5¢", 21.2], 10: ["10¢", 18], 25: ["25¢", 23.9], 100: ["1$", 26.5], 200: ["2$", 28] };
function coinSvg(v) {
  const d = Math.round(COINS[v][1] * 2.7), r = d / 2, lbl = COINS[v][0];
  let shape;
  if (v === 100) { const pts = Array.from({ length: 11 }, (_, k) => { const a = -Math.PI / 2 + k * 2 * Math.PI / 11; return `${(r + (r - 1) * Math.cos(a)).toFixed(1)},${(r + (r - 1) * Math.sin(a)).toFixed(1)}`; }).join(" "); shape = `<polygon points="${pts}" fill="#d4a72c" stroke="#a37d16" stroke-width="2"/>`; }
  else if (v === 200) shape = `<circle cx="${r}" cy="${r}" r="${r - 1}" fill="#c9ccd3" stroke="#8b8f99" stroke-width="2"/><circle cx="${r}" cy="${r}" r="${r * 0.6}" fill="#d4a72c"/>`;
  else shape = `<circle cx="${r}" cy="${r}" r="${r - 1}" fill="${v === 5 ? "#c7cbd3" : v === 10 ? "#d6d9df" : "#bfc3cc"}" stroke="#8b8f99" stroke-width="2"/><circle cx="${r}" cy="${r}" r="${r - 6}" fill="none" stroke="#9ca0aa" stroke-width="1"/>`;
  return `<svg class="coin" width="${d}" height="${d}" viewBox="0 0 ${d} ${d}">${shape}<text x="${r}" y="${r}" style="font-size:${Math.round(d * 0.3)}px">${lbl}</text></svg>`;
}
function buildMoneySession() {
  const lvl = S.money.level, set = lvl === 1 ? [5, 10] : lvl === 2 ? [5, 10, 25] : [100, 200], cap = lvl === 1 ? 50 : lvl === 2 ? 100 : 1000, items = [];
  for (let i = 0; i < S.math.length; i++) {
    let coins = [];
    const n = rand(2, lvl === 1 ? 5 : 4);
    while (coins.length < n) { const c = pick(set); if (coins.reduce((a, b) => a + b, 0) + c <= cap) coins.push(c); else break; }
    if (coins.length < 2) coins = [set[0], set[set.length - 1]];
    coins.sort((a, b) => b - a);
    const total = coins.reduce((a, b) => a + b, 0), unit = lvl === 3 ? "$" : "¢";
    items.push({ kind: "money", coins, unit, answer: String(unit === "$" ? total / 100 : total) });
  }
  return items;
}
function buildKeysSession() {
  const pool = S.keys.level === 1 ? [0] : S.keys.level === 2 ? [0, 1, 2] : [0, 1, 2, 3, 4, 5, 6], items = [];
  let bag = [], last = -1;
  for (let i = 0; i < S.math.length; i++) {
    if (!bag.length) { bag = shuffle(pool); if (bag.length > 1 && bag[bag.length - 1] === last) bag.unshift(bag.pop()); }
    const n = bag.pop(); last = n; items.push({ kind: "keys", note: n, answer: String(n) });
  }
  return items;
}
function buildFiguresSession() {
  const items = []; let bag = [];
  for (let i = 0; i < S.math.length; i++) {
    if (!bag.length) bag = shuffle(FIGURES);
    const f = bag.pop();
    if (DURATIONS[f[0]] && i % 2) { items.push({ kind: "figures", sub: "temps", fig: f, choices: shuffle([1, 2, 4]), answer: String(DURATIONS[f[0]]) }); continue; }
    const others = shuffle(FIGURES.filter(x => x !== f)).slice(0, 2);
    items.push({ kind: "figures", choices: shuffle([f, ...others]), answer: f[0] });
  }
  return items;
}
function keyboardSvg() {
  const W = 40, H = 190, white = Array.from({ length: 14 }, (_, k) => `<rect class="wk" data-n="${k % 7}" data-k="${k}" x="${k * W}" y="0" width="${W}" height="${H}" rx="5"/>`).join("");
  const blacks = [];
  for (let o = 0; o < 2; o++) for (const k of [0, 1, 3, 4, 5]) blacks.push(`<rect class="bk ${k < 2 ? "g2" : "g3"}" x="${(o * 7 + k) * W + W * 0.68}" y="0" width="${W * 0.64}" height="${H * 0.6}" rx="3"/>`);
  return `<svg class="kbd" viewBox="-2 -2 ${14 * W + 4} ${H + 4}">${white}${blacks.join("")}</svg>`;
}
function hintSvg() {
  return `<svg class="hintkbd" viewBox="-2 -34 164 156"><rect x="0" y="0" width="40" height="120" rx="4" class="wk do"/><rect x="40" y="0" width="40" height="120" rx="4" class="wk"/><rect x="80" y="0" width="40" height="120" rx="4" class="wk"/><rect x="120" y="0" width="40" height="120" rx="4" class="wk"/>
    <rect x="27" y="0" width="26" height="74" rx="3" class="bk g2"/><rect x="67" y="0" width="26" height="74" rx="3" class="bk g2"/>
    <text x="20" y="104" class="dot">DO</text><path d="M20 -28 L20 -6 M12 -14 L20 -4 L28 -14" class="arrow"/><text x="60" y="-14" class="lbl">2 noires</text></svg>`;
}
let SYL_WORDS = [];
function buildSyllabSession() {
  const by = n => shuffle(SYL_WORDS.filter(w => w.syl.length === n)), pools = [by(1), by(2), by(3), by(4)], items = [];
  for (let i = 0; i < S.math.length; i++) {
    const n = pick([1, 2, 2, 3, 3, ...(i % 4 === 3 ? [4] : [])]), w = pools[n - 1].pop() || pools[1].pop();
    if (w) items.push({ kind: "syllab", mot: w.mot, emoji: w.emoji, syl: w.syl, answer: String(w.syl.length) });
  }
  return items;
}
let SOUND_WORDS = [];
function buildSoundSession() {
  const subs = ["rime", "debut"].filter(k => S.sound[k]), items = [], used = new Set();
  if (!subs.length) subs.push("rime");
  for (let i = 0; i < S.math.length; i++) {
    const sub = subs[i % subs.length], key = sub === "rime" ? "r" : "d";
    const tagged = SOUND_WORDS.filter(w => w[key]);
    const target = pick(shuffle(tagged).filter(w => !used.has(w.mot) && tagged.some(o => o !== w && o[key] === w[key])));
    if (!target) continue;
    used.add(target.mot);
    const answer = pick(tagged.filter(o => o !== target && o[key] === target[key]));
    const others = shuffle(tagged.filter(o => o[key] !== target[key] && !(o.r && o.r === target.r) && !(o.d && o.d === target.d)));
    const pickd = [];
    for (const o of others) { if (pickd.length >= 2) break; if (!pickd.some(p => p[key] === o[key])) pickd.push(o); }
    items.push({ kind: "sound", sub, target, choices: shuffle([answer, ...pickd]), answer: answer.mot });
  }
  return items;
}
function buildCompareSession() {
  const max = S.cmp.max, items = [];
  for (let i = 0; i < S.math.length; i++) {
    let a = max > 100 ? bigNumber(max) : rand(0, max), b;
    if (Math.random() < 0.5 && a >= 10) { const p = Math.pow(10, String(a).length - 1); b = Math.floor(a / p) * p + rand(0, p - 1); }
    else b = max > 100 ? bigNumber(max) : rand(0, max);
    if (a === b) b = a + rand(1, 9);
    const ask = Math.random() < 0.5 ? "grand" : "petit";
    items.push({ kind: "compare", a, b, ask, answer: String(ask === "grand" ? Math.max(a, b) : Math.min(a, b)) });
  }
  return items;
}
const clockLabel = (h, m) => `${h} h${m ? " " + String(m).padStart(2, "0") : ""}`;
function clockMinutes(lvl) { return lvl === 1 ? [0] : lvl === 2 ? [0, 30] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]; }
function buildClockSession() {
  const mins = clockMinutes(S.clock.level), items = [];
  for (let i = 0; i < S.math.length; i++) {
    const h = rand(1, 12), m = pick(mins), ans = clockLabel(h, m), opts = new Set([ans]);
    const swap = m % 5 === 0 && m ? [m / 5 || 12, (h % 12) * 5] : null;
    if (swap && swap[0] >= 1 && swap[0] <= 12) opts.add(clockLabel(swap[0], swap[1]));
    if (mins.length > 1) opts.add(clockLabel(h, pick(mins.filter(x => x !== m))));
    while (opts.size < 3) opts.add(clockLabel(rand(1, 12), pick(mins)));
    items.push({ kind: "clock", h, m, answer: ans, choices: shuffle([...opts].slice(0, 3)) });
  }
  return items;
}
const RHYTHMS = { 1: ["ta ta ta ta", "ta ta titi ta", "titi ta ta ta", "ta titi ta ta", "ta ta ta titi"], 2: ["titi titi ta ta", "ta titi titi ta", "titi ta titi ta", "ta ta titi titi", "titi titi titi ta", "ta titi ta titi"], 3: ["ta chut ta ta", "titi ta chut ta", "ta titi chut titi", "titi chut titi ta", "ta ta chut titi"] };
function rhythmPattern(lvl) { return pick([].concat(...[1, 2, 3].filter(l => l <= lvl).map(l => RHYTHMS[l]))).split(" "); }
function buildMusicSession(sub) {
  const mu = S.music, items = []; let bag = []; const fileOf = {};
  for (let i = 0; i < S.math.length; i++) {
    if (sub === "pitch") {
      const gap = mu.level === 1 ? rand(9, 12) : mu.level === 2 ? rand(4, 7) : rand(2, 3), base = rand(-5, 5), up = Math.random() < 0.5;
      const notes = up ? [base, base + gap] : [base + gap, base], ask = Math.random() < 0.5 ? "aigu" : "grave";
      const hi = notes[0] > notes[1] ? 0 : 1;
      items.push({ kind: "music", sub, notes, ask, answer: String(ask === "aigu" ? hi : 1 - hi) });
    } else if (sub === "rhythm") items.push({ kind: "music", sub, pattern: rhythmPattern(mu.level), answer: "ok" });
    else {
      if (!bag.length) bag = shuffle(INSTRUMENTS);
      const ins = bag.pop(), others = shuffle(INSTRUMENTS.filter(x => x !== ins)).slice(0, mu.level >= 2 ? 3 : 2);
      fileOf[ins[0]] = fileOf[ins[0]] ? 3 - fileOf[ins[0]] : rand(1, 2);
      items.push({ kind: "music", sub, ins: ins[0], file: fileOf[ins[0]], choices: shuffle([ins, ...others]), answer: ins[0] });
    }
  }
  return items;
}
const BUILDERS = { number: buildNumberSession, trace: buildTraceSession, traceNum: buildTraceNumSession, calc: buildCalcSession, read: buildReadSession, sound: buildSoundSession, syllab: buildSyllabSession, phrase: buildPhraseSession, money: buildMoneySession, keys: buildKeysSession, figures: buildFiguresSession, compare: buildCompareSession, clock: buildClockSession, pitch: () => buildMusicSession("pitch"), rhythm: () => buildMusicSession("rhythm"), instr: () => buildMusicSession("instr") };
function gameItems(id) {
  if (id === "word") return POOL.length || S.weekly.length ? buildWordSession() : [];
  return BUILDERS[id]();
}
function mixItems(plan) {
  const out = [];
  for (const [cat, n] of plan) {
    const games = shuffle(CATS.find(c => c[0] === cat)[5].filter(g => !NO_MIX.includes(g))), cache = {};
    for (let k = 0; k < n; k++) {
      const g = games[k % games.length]; cache[g] = cache[g] || shuffle(gameItems(g));
      const it = cache[g].pop(); if (it) out.push(it);
    }
  }
  return shuffle(out);
}
function sessionTitle(kind) {
  if (kind === "daily") return "🔥 Défi du jour";
  if (kind.startsWith("mix:")) { const c = CATS.find(x => x[0] === kind.slice(4)); return `${c[2]} Mélange ${c[1]}`; }
  const a = ACTIVITIES.find(x => x[0] === kind); return a ? `${a[2]} ${a[1]}` : "";
}

/* ---------- moteur de session ---------- */
function startSession(kind) {
  stopAudio();
  let items;
  if (kind === "daily") items = mixItems(Object.entries(DAILY_MIX));
  else if (kind.startsWith("mix:")) items = mixItems([[kind.slice(4), 10]]);
  else items = gameItems(kind);
  if (!items.length) { view(`${topbar()}<div class="card">Aucun mot chargé.</div>`); $("#back").onclick = home; return; }
  S.plays[kind] = (S.plays[kind] || 0) + 1; save();
  session = { kind, items, i: 0, retry: [], good: 0, total: items.length, s: S.sessions, seen: new Set() };
  nextItem();
}
function nextItem() {
  if (session.i >= session.items.length) {
    if (session.retry.length) { session.items = session.items.concat(session.retry); session.retry = []; }
    else return endSession();
  }
  const it = session.items[session.i];
  session.attempt = 0;
  renderItem(it);
  const key = it.kind + (it.sub || ""), first = !session.seen.has(key);
  const prompt = it.kind === "calc" && S.mute.calc ? [] : it.kind === "read" ? [] : ["phrase", "money", "clock"].includes(it.kind) && !first ? [] : promptParts(it);
  const ann = it.kind === "trace" ? (it.num ? "Voici le nombre :" : it.word ? "Voici le mot en lettres attachées :" : it.cursive ? "Voici la lettre attachée :" : it.isDigit ? "Voici le chiffre :" : "Voici la lettre :") : ANNONCE[it.kind];
  const consigne = it.kind === "trace" && it.cursive ? "Trace en lettres attachées avec ton doigt." : CONSIGNE[it.kind];
  const intro = first || (it.kind === "trace" && it.cursive !== session.lastCursive);
  const parts = intro && !S.mute[it.kind] && consigne ? [consigne, { pause: 700 }, ...(ann ? [ann, { pause: 350 }] : []), ...prompt] : it.kind === "read" ? (first ? [CONSIGNE.read] : []) : prompt;
  session.seen.add(key); session.lastCursive = it.cursive;
  const me = session, idx = session.i;
  setTimeout(() => { if (session === me && session.i === idx && $("#speak")) say(parts).then(() => { if (it.kind === "music" && session === me && session.i === idx && !session.locked && $("#speak")) playMusic(it); }); }, 300);
}
function renderItem(it) {
  session.locked = false;
  const segs = session.items.map((_, k) => `<i class="${k < session.i ? "done" : k === session.i ? "cur" : ""}"></i>`).join("");
  let body;
  if (it.kind === "word") {
    body = S.mode === "tiles"
      ? `<div class="slots" id="slots"></div><div class="tiles" id="tiles"></div><div class="actions"><button class="btn ghost small" id="erase">⌫</button></div>`
      : `<input class="typed" id="typed" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" inputmode="text"><div class="actions"><button class="btn mint small" id="check">✓</button></div>`;
  } else if (it.kind === "trace") {
    body = `<div class="tracewrap"><canvas id="trace"></canvas></div><div class="actions"><button class="btn ghost small" id="erase">⌫</button><button class="btn ghost small" id="skip">→</button></div>`;
  } else if (it.kind === "read") {
    body = `<div class="readword">${esc(it.mot)}</div><div class="choices">${it.choices.map(c => `<button class="choice emo" data-v="${esc(c.mot)}">${c.emoji}</button>`).join("")}</div>`;
  } else if (it.kind === "keys") {
    body = `<div class="cmpq">Trouve le <b>${NOTES[it.note].toUpperCase()}</b></div><div class="kbdwrap">${keyboardSvg()}</div>
      <div class="hint" id="hint"><button class="btn ghost small" id="hintBtn">💡 Indice</button><div class="hintbox" id="hintBox" hidden>${hintSvg()}<p>Le <b>DO</b>, c'est la touche blanche juste à <b>gauche</b> du groupe de <b>2 touches noires</b>.</p>${it.note ? `<p>Ensuite, on monte vers la droite : do, ré, mi, fa, sol, la, si.</p>` : ""}</div></div>`;
  } else if (it.kind === "figures" && it.sub === "temps") {
    body = `<div class="cmpq">Combien de temps vaut <b>${it.fig[1]}</b>?</div><div class="figq"><img src="img/music/${it.fig[0]}.svg" alt=""></div><div class="choices">${it.choices.map(n => `<button class="choice txt" data-v="${n}">${n} temps</button>`).join("")}</div>`;
  } else if (it.kind === "figures") {
    body = `<div class="cmpq">Touche <b>${FIGURES.find(x => x[0] === it.answer)[1]}</b></div><div class="choices figs">${it.choices.map(c => `<button class="choice fig" data-v="${c[0]}"><img src="img/music/${c[0]}.svg" alt=""></button>`).join("")}</div>`;
  } else if (it.kind === "phrase") {
    body = `<div class="slots phr" id="slots"></div><div class="tiles phr" id="tiles"></div><div class="actions"><button class="btn ghost small" id="erase">⌫</button></div>`;
  } else if (it.kind === "money") {
    body = `<div class="coins">${it.coins.map(coinSvg).join("")}</div><div class="calc"><span id="num">?</span> ${it.unit}</div><div class="pad numpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "✓"].map(k => `<button data-k="${k}">${k}</button>`).join("")}</div>`;
  } else if (it.kind === "syllab") {
    body = `<div class="target">${it.emoji}<small>${esc(it.mot)}</small></div><div class="taps" id="taps"></div><button class="drum ready" id="drum">🥁</button>`;
  } else if (it.kind === "sound") {
    body = `<div class="cmpq">${it.sub === "rime" ? "Ça rime avec" : "Ça commence comme"}</div><div class="target">${it.target.emoji}<small>${esc(it.target.mot)}</small></div><div class="choices">${it.choices.map(c => `<button class="choice emo" data-v="${esc(c.mot)}">${c.emoji}</button>`).join("")}</div>`;
  } else if (it.kind === "compare") {
    body = `<div class="cmpq">Le plus <b>${it.ask === "grand" ? "GRAND" : "petit"}</b> ${it.ask === "grand" ? "🐘" : "🐭"}</div><div class="choices two">${shuffle([it.a, it.b]).map(n => `<button class="choice num" data-v="${n}">${n}</button>`).join("")}</div>`;
  } else if (it.kind === "clock") {
    body = `<div class="clockwrap">${clockSvg(it.h, it.m, S.clock.level >= 3)}</div><div class="choices">${it.choices.map(c => `<button class="choice txt" data-v="${c}">${c}</button>`).join("")}</div>`;
  } else if (it.kind === "music") {
    if (it.sub === "pitch") body = `<div class="cmpq">Le son le plus <b>${it.ask}</b> ${it.ask === "aigu" ? "🐭" : "🐻"}</div><div class="choices two">${[0, 1].map(k => `<button class="choice num note" data-v="${k}">🔔<small>${k + 1}</small></button>`).join("")}</div>`;
    else if (it.sub === "rhythm") body = `<div class="rhythm" id="rhythm">${it.pattern.map((p, k) => `<span data-k="${k}">${p === "ta" ? "♩" : p === "titi" ? "♫" : "𝄽"}<small>${p}</small></span>`).join("")}</div><button class="drum" id="drum">🥁</button>`;
    else body = `<div class="cmpq">Quel instrument joue? 🎶</div><div class="choices ${it.choices.length > 3 ? "four" : ""}">${it.choices.map(([id, name, e]) => `<button class="choice emo" data-v="${id}">${e}<small>${name.replace(/^(le|la) /, "")}</small></button>`).join("")}</div>`;
  } else {
    const shown = it.kind === "calc" ? `<div class="calc"><span class="na">${it.a}</span> ${it.op} <span class="${it.op === "+" ? "nb" : "nx"}">${it.b}</span> = <span id="num">?</span></div><div id="dots">${dots(it)}</div>` : `<div class="calc"><span id="num">?</span></div>`;
    body = `${shown}<div class="pad numpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "✓"].map(k => `<button data-k="${k}">${k}</button>`).join("")}</div>`;
  }
  view(`${topbar()}
    <div class="progress">${segs}</div>
    <div class="speakrow">${it.kind === "calc" ? `<button class="mute eye ${S.math.visual ? "" : "on"}" id="eye">${S.math.visual ? "👀" : "🙈"}</button>` : ""}<button class="speak" id="speak">🔊</button><button class="mute ${S.mute[it.kind] ? "on" : ""}" id="mute">${S.mute[it.kind] ? "🔇" : "🗣️"}</button></div>
    ${body}
    <div class="feedback" id="fb"></div>`);
  $("#back").onclick = home;
  $("#speak").onclick = () => replay(it);
  if ($("#eye")) $("#eye").onclick = () => { S.math.visual = !S.math.visual; save(); $("#eye").textContent = S.math.visual ? "👀" : "🙈"; $("#eye").classList.toggle("on", !S.math.visual); $("#dots").innerHTML = dots(it); };
  $("#mute").onclick = () => { S.mute[it.kind] = !S.mute[it.kind]; save(); const on = S.mute[it.kind]; $("#mute").textContent = on ? "🔇" : "🗣️"; $("#mute").classList.toggle("on", on); if (on) stopAudio(); };
  if (it.kind === "word") { if (S.mode === "tiles") setupTiles(it); else setupTyped(it); }
  else if (it.kind === "trace") setupTrace(it);
  else if (it.kind === "music" && it.sub === "rhythm") setupRhythm(it);
  else if (it.kind === "syllab") setupSyllab(it);
  else if (it.kind === "phrase") setupPhrase(it);
  else if (it.kind === "keys") setupKeys(it);
  else if ($(".choices")) setupChoices(it);
  else setupPad(it);
}
function setupChoices(it) {
  $(".choices").onclick = e => {
    const b = e.target.closest(".choice"); if (!b || session.locked) return;
    b.classList.add(b.dataset.v === it.answer ? "ok" : "bad");
    if (it.kind === "music" && it.sub === "pitch") playNotes([it.notes[+b.dataset.v]]);
    check(it, b.dataset.v);
  };
}
function clockSvg(h, m, minutes) {
  const R = 90, ang = a => (a - 90) * Math.PI / 180, pt = (a, r) => `${(100 + r * Math.cos(ang(a))).toFixed(1)},${(100 + r * Math.sin(ang(a))).toFixed(1)}`;
  const ticks = Array.from({ length: 60 }, (_, k) => `<line x1="${pt(k * 6, R - (k % 5 ? 4 : 9)).replace(",", '" y1="')}" x2="${pt(k * 6, R - 1).replace(",", '" y2="')}" class="${k % 5 ? "tk" : "tk5"}"/>`).join("");
  const nums = Array.from({ length: 12 }, (_, k) => { const [x, y] = pt((k + 1) * 30, R - 22).split(","); return `<text x="${x}" y="${y}">${k + 1}</text>`; }).join("");
  const mins = !minutes ? "" : Array.from({ length: 12 }, (_, k) => { const [x, y] = pt(k * 30, R - 43).split(","); return `<text x="${x}" y="${y}" class="mn">${String(k * 5).padStart(2, "0")}</text>`; }).join("");
  return `<svg class="clock" viewBox="0 0 200 200"><circle cx="100" cy="100" r="${R}" class="face"/>${ticks}${nums}
    <line x1="100" y1="100" x2="${pt((h % 12) * 30 + m / 2, 46).replace(",", '" y2="')}" class="hh"/>
    <line x1="100" y1="100" x2="${pt(m * 6, 72).replace(",", '" y2="')}" class="mh"/>${mins}<circle cx="100" cy="100" r="6" class="pin"/></svg>`;
}

/* ---------- musique (Web Audio) ---------- */
const BPM_BEAT = 0.55;
function now() { unlockAudio(); return actx ? actx.currentTime + 0.05 : 0; }
function tone(semi, t0, dur) {
  const f = 440 * Math.pow(2, (semi - 9) / 12), o = actx.createOscillator(), o2 = actx.createOscillator(), g = actx.createGain();
  o.type = "triangle"; o.frequency.value = f; o2.type = "sine"; o2.frequency.value = f * 2;
  const g2 = actx.createGain(); g2.gain.value = 0.25; o2.connect(g2); g2.connect(g); o.connect(g); g.connect(actx.destination);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.start(t0); o2.start(t0); o.stop(t0 + dur + 0.05); o2.stop(t0 + dur + 0.05);
}
function drum(t0) {
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = "sine"; o.frequency.setValueAtTime(190, t0); o.frequency.exponentialRampToValueAtTime(70, t0 + 0.18);
  g.gain.setValueAtTime(1, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35);
  o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + 0.4);
  const n = actx.createBufferSource(), b = actx.createBuffer(1, actx.sampleRate * 0.05, actx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const ng = actx.createGain(); ng.gain.value = 0.35; n.buffer = b; n.connect(ng); ng.connect(actx.destination); n.start(t0);
}
async function playRecording(id, file) {
  const buf = await getBuffer(`audio/instr/${id}-${file || rand(1, 2)}.m4a`), t = now();
  const src = actx.createBufferSource(), g = actx.createGain();
  src.buffer = buf; g.gain.value = 0.9; src.connect(g); g.connect(actx.destination); src.start(t);
  const me = session, idx = session.i;
  const stopper = setInterval(() => { if (session !== me || session.i !== idx || session.locked || !$("#speak")) { try { src.stop(); } catch {} clearInterval(stopper); } }, 200);
  src.onended = () => clearInterval(stopper);
  return t + buf.duration;
}
function wait(t) { return new Promise(r => setTimeout(r, Math.max(0, (t - actx.currentTime) * 1000))); }
async function playNotes(notes) { const t0 = now(); if (!actx) return; notes.forEach((n, k) => tone(n, t0 + k * 0.8, 0.65)); return wait(t0 + notes.length * 0.8); }
function rhythmOnsets(pattern) { const on = []; let t = 0; for (const p of pattern) { if (p === "ta") on.push([t, p]); if (p === "titi") on.push([t, p], [t + 0.5, p]); t += 1; } return on; }
async function playMusic(it) {
  const me = session, idx = session.i, alive = () => session === me && session.i === idx && $("#speak");
  try {
    unlockAudio(); if (!actx) return;
    if (it.sub === "pitch") {
      const btns = app.querySelectorAll(".note"), t0 = now();
      it.notes.forEach((n, k) => { tone(n, t0 + k * 0.9, 0.7); setTimeout(() => { if (alive()) btns[k].classList.add("lit"); setTimeout(() => btns[k] && btns[k].classList.remove("lit"), 650); }, (t0 - actx.currentTime + k * 0.9) * 1000); });
      await wait(t0 + 1.8);
    } else if (it.sub === "rhythm") {
      session.listening = true; const t0 = now() + 0.2, spans = app.querySelectorAll("#rhythm span");
      for (let k = 0; k < 4; k++) tone(24, t0 + k * BPM_BEAT, 0.08);
      const t1 = t0 + 4 * BPM_BEAT;
      it.pattern.forEach((p, k) => setTimeout(() => { if (alive()) { spans.forEach(x => x.classList.remove("lit")); spans[k].classList.add("lit"); } }, (t1 - actx.currentTime + k * BPM_BEAT) * 1000));
      rhythmOnsets(it.pattern).forEach(([b]) => drum(t1 + b * BPM_BEAT));
      await wait(t1 + it.pattern.length * BPM_BEAT);
      spans.forEach(x => x.classList.remove("lit"));
      if (!alive()) return;
      session.listening = false; session.taps = []; $("#drum").classList.add("ready");
      if (!S.mute.music) say(["À toi!"]);
    } else {
      await wait(await playRecording(it.ins, it.file));
    }
  } catch {}
}
function syllabDemo(it) {
  const me = session, idx = session.i, taps = $("#taps");
  if (!taps) return;
  taps.innerHTML = it.syl.map(x => `<span>${esc(x)}</span>`).join("");
  const spans = taps.querySelectorAll("span"), t0 = now();
  it.syl.forEach((_, k) => {
    if (actx) drum(t0 + 0.4 + k * 0.6);
    setTimeout(() => { if (session === me && session.i === idx) { spans.forEach(x => x.classList.remove("lit")); spans[k] && spans[k].classList.add("lit"); } }, 400 + k * 600);
  });
}
function setupSyllab(it) {
  const drumBtn = $("#drum"), taps = $("#taps"); let timer = null, retry = false, list = [];
  const evaluate = () => {
    if (session.locked) return;
    const ok = list.length === it.syl.length;
    if (!ok && !retry) {
      retry = true; list = []; taps.innerHTML = "";
      const fb = $("#fb"); fb.className = "feedback"; fb.textContent = "Presque! Écoute encore.";
      say(["Écoute encore.", it.mot]); return;
    }
    check(it, String(list.length));
    syllabDemo(it);
  };
  drumBtn.onpointerdown = e => {
    e.preventDefault(); if (session.locked) return;
    const t = performance.now() / 1000; if (list.length && t - list[list.length - 1] < 0.09) return;
    unlockAudio(); if (actx) drum(actx.currentTime);
    list.push(t); taps.insertAdjacentHTML("beforeend", "<i></i>");
    drumBtn.classList.remove("hit"); void drumBtn.offsetWidth; drumBtn.classList.add("hit");
    const fb = $("#fb"); if (fb.textContent.startsWith("Presque")) fb.textContent = "";
    clearTimeout(timer); timer = setTimeout(evaluate, 1600);
  };
}
function setupRhythm(it) {
  const expected = rhythmOnsets(it.pattern), drumBtn = $("#drum"); let timer = null;
  session.taps = []; session.listening = true; session.rhythmRetry = false;
  const evaluate = () => {
    const taps = session.taps; if (session.locked) return;
    const gaps = taps.slice(1).map((t, k) => t - taps[k]).sort((a, b) => a - b);
    const ok = Math.abs(taps.length - expected.length) <= 1 && taps.length >= 2 && gaps[Math.floor(gaps.length / 2)] >= 0.12;
    if (!ok && !session.rhythmRetry) {
      session.rhythmRetry = true; session.taps = []; drumBtn.classList.remove("ready");
      const fb = $("#fb"); fb.className = "feedback"; fb.textContent = "Presque! Écoute encore.";
      chatter("music", ["Écoute encore."]); setTimeout(() => { if (session.items[session.i] === it) playMusic(it); }, S.mute.music ? 300 : 1200);
      return;
    }
    check(it, ok ? "ok" : "ko");
  };
  drumBtn.onpointerdown = e => {
    e.preventDefault(); if (session.locked || session.listening) return;
    if (session.taps.length && performance.now() / 1000 - session.taps[session.taps.length - 1] < 0.09) return;
    unlockAudio(); if (actx) drum(actx.currentTime);
    session.taps.push(performance.now() / 1000);
    drumBtn.classList.remove("hit"); void drumBtn.offsetWidth; drumBtn.classList.add("hit");
    const spans = app.querySelectorAll("#rhythm span"), on = expected[session.taps.length - 1];
    if (on) { spans.forEach(x => x.classList.remove("lit")); spans[Math.floor(on[0])].classList.add("lit"); }
    clearTimeout(timer);
    timer = setTimeout(evaluate, session.taps.length > expected.length ? 300 : session.taps.length === expected.length ? 900 : 2500);
  };
}
function dots(it) {
  if (!S.math.visual || it.a + it.b > 20) return "";
  const d = (n, cls) => Array.from({ length: n }, () => `<span class="dot ${cls}"></span>`).join("");
  if (it.op === "+") return `<div class="dots">${d(it.a, "a")}${d(it.b, "b")}</div>`;
  return `<div class="dots">${d(it.a - it.b, "a")}${d(it.b, "x")}</div>`;
}
function setupTiles(w) {
  const letters = Array.from(w.mot), decoys = [];
  const src = shuffle(letters.filter(c => /\p{L}/u.test(c)));
  for (let k = 0; decoys.length < (S.decoys || 0) && k < 20; k++) {
    const c = src[k % src.length] || "e", opts = DECOY[c.toLowerCase()] || "aeiou";
    const d = pick(Array.from(opts)); if (!decoys.includes(d)) decoys.push(d);
  }
  const all = letters.concat(decoys);
  let order = shuffle(all.map((_, i) => i));
  if (letters.length > 1 && order.every((v, i) => all[v] === all[i])) order = order.reverse();
  const slots = $("#slots"), tiles = $("#tiles");
  slots.innerHTML = letters.map((_, i) => `<div class="slot" data-i="${i}"></div>`).join("");
  tiles.innerHTML = order.map(i => `<button class="tile" data-i="${i}">${esc(all[i])}</button>`).join("");
  let filled = [];
  const redraw = () => {
    slots.querySelectorAll(".slot").forEach((sl, i) => { const f = filled[i]; sl.textContent = f ? f.letter : ""; sl.className = "slot" + (f ? " filled" : ""); });
    tiles.querySelectorAll(".tile").forEach(t => t.classList.toggle("used", filled.some(f => f.tile === t.dataset.i)));
  };
  tiles.onclick = e => {
    const t = e.target.closest(".tile"); if (session.locked || !t || t.classList.contains("used") || filled.length >= letters.length) return;
    filled.push({ tile: t.dataset.i, letter: t.textContent }); redraw();
    if (filled.length === letters.length) setTimeout(() => check(w, filled.map(f => f.letter).join("")), 250);
  };
  slots.onclick = e => { const sl = e.target.closest(".slot"); if (session.locked || !sl || !filled[sl.dataset.i]) return; filled.splice(sl.dataset.i, 1); redraw(); };
  $("#erase").onclick = () => { if (!session.locked) { filled.pop(); redraw(); } };
}
function setupKeys(it) {
  const svg = $(".kbd");
  svg.onpointerdown = e => {
    const r = e.target.closest("rect"); if (!r || session.locked) return;
    unlockAudio();
    if (r.classList.contains("bk")) { r.classList.add("bad"); setTimeout(() => r.classList.remove("bad"), 400); return; }
    const n = +r.dataset.n, k = +r.dataset.k;
    if (actx) tone(NOTE_SEMI[n] + (k >= 7 ? 12 : 0), actx.currentTime, 0.6);
    r.classList.add(n === it.note ? "ok" : "bad");
    check(it, String(n));
  };
  $("#hintBtn").onclick = () => {
    const box = $("#hintBox"); box.hidden = !box.hidden; svg.classList.toggle("hinted", !box.hidden);
    if (!box.hidden) say(["Le do, c'est la touche blanche juste à gauche du groupe de deux touches noires.", ...(it.note ? ["Trouve d'abord le do. Ensuite, on monte vers la droite : do, ré, mi, fa, sol, la, si."] : [])]);
  };
}
function setupPhrase(it) {
  const slots = $("#slots"), tiles = $("#tiles"), n = it.words.length;
  slots.innerHTML = it.words.map((_, i) => `<div class="slot" data-i="${i}"></div>`).join("");
  tiles.innerHTML = it.tiles.map(i => `<button class="tile" data-i="${i}">${esc(it.words[i])}</button>`).join("");
  let filled = [];
  const redraw = () => {
    slots.querySelectorAll(".slot").forEach((sl, i) => { const f = filled[i]; sl.textContent = f ? f.w : ""; sl.className = "slot" + (f ? " filled" : ""); });
    tiles.querySelectorAll(".tile").forEach(t => t.classList.toggle("used", filled.some(f => f.tile === t.dataset.i)));
  };
  tiles.onclick = e => {
    const t = e.target.closest(".tile"); if (session.locked || !t || t.classList.contains("used") || filled.length >= n) return;
    filled.push({ tile: t.dataset.i, w: t.textContent }); redraw();
    if (filled.length === n) setTimeout(() => check(it, filled.map(f => f.w).join(" ")), 300);
  };
  slots.onclick = e => { const sl = e.target.closest(".slot"); if (session.locked || !sl || !filled[sl.dataset.i]) return; filled.splice(sl.dataset.i, 1); redraw(); };
  $("#erase").onclick = () => { if (!session.locked) { filled.pop(); redraw(); } };
}
function setupTyped(w) {
  const inp = $("#typed"); inp.focus();
  const go = () => { if (inp.value.trim()) check(w, inp.value); };
  $("#check").onclick = go; inp.onkeydown = e => { if (e.key === "Enter") go(); };
}
async function setupTrace(it) {
  const cv = $("#trace"), dpr = window.devicePixelRatio || 1;
  const W = it.word ? Math.min(app.clientWidth - 32, 560) : Math.min(app.clientWidth - 32, 340), H = it.word ? Math.round(W * 0.55) : W;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
  const FAM = it.cursive ? `"Playwrite CA", cursive` : `"Chalkboard SE", "Chalkboard", "Comic Sans MS", "Arial Rounded MT Bold", Arial, sans-serif`, WT = it.cursive ? 400 : 700;
  if (it.cursive && document.fonts) { try { await document.fonts.load(`400 40px "Playwrite CA"`, it.ch); } catch {} if ($("#trace") !== cv) return; }
  const ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);
  const layout = (g, w, h) => {
    let px = Math.round(h * 0.78); g.font = `${WT} ${px}px ${FAM}`; g.textAlign = "left"; g.textBaseline = "alphabetic";
    let m = g.measureText(it.ch);
    const k = Math.min(w * 0.86 / (m.actualBoundingBoxLeft + m.actualBoundingBoxRight), h * 0.8 / (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent), it.cursive ? 3 : 1);
    px = Math.round(px * k); g.font = `${WT} ${px}px ${FAM}`; m = g.measureText(it.ch);
    return { px, x: w / 2 - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2, y: h / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2 };
  };
  const shape = (g, w, h, color, extra) => {
    const L = layout(g, w, h); g.fillStyle = g.strokeStyle = color; g.lineJoin = g.lineCap = "round";
    g.fillText(it.ch, L.x, L.y);
    const lw = (it.cursive ? L.px * 0.08 : 0) + (extra || 0);
    if (lw) { g.lineWidth = lw; g.strokeText(it.ch, L.x, L.y); }
    return L;
  };
  const drawGuide = () => {
    ctx.clearRect(0, 0, W, H);
    if (it.cursive) { shape(ctx, W, H, "#e4dbfa"); const L = layout(ctx, W, H); ctx.fillStyle = "#a78bfa"; ctx.fillText(it.ch, L.x, L.y); return; }
    const L = shape(ctx, W, H, "#e4dbfa"); ctx.strokeStyle = "#c4b5fd"; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.strokeText(it.ch, L.x, L.y); ctx.setLineDash([]);
  };
  const MH = 96, MW = Math.round(MH * W / H), TOL = 0.13;
  const glyphCanvas = (w, h, dilate) => { const c = document.createElement("canvas"); c.width = w; c.height = h; shape(c.getContext("2d"), w, h, "#000", dilate ? h * TOL * 2 : 0); return c; };
  const glyph = glyphCanvas(MW, MH, false).getContext("2d").getImageData(0, 0, MW, MH).data;
  const zone = glyphCanvas(MW, MH, true).getContext("2d").getImageData(0, 0, MW, MH).data;
  const zoneFull = glyphCanvas(W, H, true);
  let gTop = MH, gBot = 0, gL = MW, gR = 0;
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (glyph[(y * MW + x) * 4 + 3] > 40) { gTop = Math.min(gTop, y); gBot = Math.max(gBot, y); gL = Math.min(gL, x); gR = Math.max(gR, x); }
  const minLen = Math.max(40, (gBot - gTop) / MH * H * 0.6, (gR - gL) / MW * W * 0.8);
  let failed = false;
  const ink = document.createElement("canvas"); ink.width = cv.width; ink.height = cv.height; const ic = ink.getContext("2d"); ic.scale(dpr, dpr);
  ic.lineCap = ic.lineJoin = "round"; ic.lineWidth = Math.max(14, Math.min(W, H) * (it.word ? 0.06 : 0.07)); ic.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--violet") || "#7c3aed";
  const redraw = () => { drawGuide(); ctx.drawImage(ink, 0, 0, W, H); };
  redraw();
  let drawing = false, last = null, pathLen = 0;
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left), y: (e.clientY - r.top) }; };
  cv.onpointerdown = e => { if (session.locked) return; drawing = true; last = pos(e); ic.beginPath(); ic.arc(last.x, last.y, ic.lineWidth / 2, 0, 7); ic.fillStyle = ic.strokeStyle; ic.fill(); redraw(); cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = e => { if (!drawing) return; const p = pos(e); pathLen += Math.hypot(p.x - last.x, p.y - last.y); ic.beginPath(); ic.moveTo(last.x, last.y); ic.lineTo(p.x, p.y); ic.stroke(); last = p; redraw(); };
  cv.onpointerup = cv.onpointercancel = () => {
    if (!drawing) return; drawing = false;
    const small = document.createElement("canvas"); small.width = MW; small.height = MH; const sc = small.getContext("2d"); sc.drawImage(ink, 0, 0, MW, MH);
    const inkD = sc.getImageData(0, 0, MW, MH).data;
    const fat = document.createElement("canvas"); fat.width = MW; fat.height = MH; const fc = fat.getContext("2d");
    for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) if (dx * dx + dy * dy <= 10) fc.drawImage(small, dx, dy);
    const fatD = fc.getImageData(0, 0, MW, MH).data;
    let total = 0, hit = 0, rawHit = 0, inkTotal = 0, outside = 0;
    for (let i = 3; i < glyph.length; i += 4) {
      if (glyph[i] > 40) { total++; if (fatD[i] > 40) hit++; if (inkD[i] > 40) rawHit++; }
      if (inkD[i] > 40) { inkTotal++; if (zone[i] <= 40) outside++; }
    }
    const coverage = total ? hit / total : 0, raw = total ? rawHit / total : 0, overflow = inkTotal ? outside / inkTotal : 0;
    if (overflow > 0.2 && inkTotal > total * 0.15) {
      const over = document.createElement("canvas"); over.width = ink.width; over.height = ink.height; const oc = over.getContext("2d");
      oc.drawImage(ink, 0, 0); oc.globalCompositeOperation = "destination-out"; oc.drawImage(zoneFull, 0, 0, over.width, over.height);
      oc.globalCompositeOperation = "source-in"; oc.fillStyle = "#f43f5e"; oc.fillRect(0, 0, over.width, over.height);
      redraw(); ctx.drawImage(over, 0, 0, W, H);
      const fb = $("#fb"); fb.className = "feedback bad"; fb.textContent = "Oups! Reste sur le modèle.";
      if (!failed) { failed = true; S.mathStats.trace.ko++; save(); }
      chatter("trace", ["Oups! Reste sur le modèle."]);
      return;
    }
    if (coverage >= 0.6 && raw >= 0.25 && pathLen >= minLen) check(it, "ok");
  };
  $("#erase").onclick = () => { if (!session.locked) { ic.clearRect(0, 0, W, H); pathLen = 0; redraw(); const fb = $("#fb"); fb.className = "feedback"; fb.textContent = ""; } };
  $("#skip").onclick = () => { if (!session.locked) { session.i++; nextItem(); } };
}
function setupPad(it) {
  let val = "";
  const num = $("#num");
  $(".numpad").onclick = e => {
    const b = e.target.closest("button"); if (!b || session.locked) return;
    const k = b.dataset.k;
    if (k === "⌫") val = val.slice(0, -1);
    else if (k === "✓") { if (val !== "") check(it, val); return; }
    else if (val.length < 4) val += k;
    num.textContent = val === "" ? "?" : val;
  };
}
function check(it, answer) {
  if (session.locked) return;
  session.locked = true;
  const target = it.kind === "word" ? it.mot : it.answer;
  const ok = it.kind === "word" ? norm(answer) === norm(target) : it.kind === "number" || it.kind === "calc" || it.kind === "money" ? String(parseInt(answer, 10)) === target : String(answer) === target;
  const fb = $("#fb");
  const p = it.kind === "word" ? prog(it.key) : null;
  const ms = it.kind === "word" ? null : S.mathStats[it.kind];
  if (ok) {
    if (session.attempt === 0) { session.good++; S.stars += 1; if (p) { p.box = Math.min(3, p.box + 1); p.ok++; } else ms.ok++; }
    if (p) p.last = session.s;
    save();
    fb.className = "feedback ok"; fb.textContent = pick(PRAISE);
    $("#starsN").textContent = `👥 ${S.stars}`;
    confetti(); chatter(it.kind, [fb.textContent, ...(it.kind === "read" ? [it.mot] : it.kind === "sound" ? [it.target.mot, it.answer] : it.kind === "syllab" ? [it.mot] : it.kind === "phrase" ? [it.phrase] : it.kind === "figures" ? (it.sub === "temps" ? [`${it.fig[1][0].toUpperCase()}${it.fig[1].slice(1)} vaut ${TEMPS[it.answer]}.`] : [FIGURES.find(x => x[0] === it.answer)[1]]) : it.kind === "clock" ? timeParts(it.h, it.m) : it.kind === "music" && it.sub === "instr" ? ["C'est", INSTRUMENTS.find(x => x[0] === it.ins)[1]] : [])]);
    $("#slots") && $("#slots").querySelectorAll(".slot").forEach(s => s.classList.add("ok"));
    $("#num") && ($("#num").className = "ok");
    $("#trace") && $("#trace").classList.add("ok");
    session.i++; setTimeout(nextItem, 1300);
  } else {
    if (p) { p.box = 0; p.ko++; p.last = session.s; } else if (session.attempt === 0) ms.ko++;
    save();
    if (session.attempt === 0 && !it.requeued) session.retry.push(Object.assign({}, it, { requeued: true }));
    session.attempt++;
    fb.className = "feedback bad"; fb.textContent = "Oups!";
    $("#slots") && $("#slots").querySelectorAll(".slot").forEach(s => s.classList.add("bad"));
    let shown, spoken;
    if (it.kind === "word") {
      shown = Array.from(target).map((ch, i) => (norm(answer)[i] === ch ? esc(ch) : `<span class="diff">${esc(ch)}</span>`)).join("");
      spoken = ["Le mot est", target, { pause: 300 }, ...spellParts(target)];
    } else if (it.kind === "read") {
      shown = `${it.emoji} ${esc(it.mot)}`; spoken = [it.mot];
    } else if (it.kind === "keys") {
      shown = NOTES[it.note].toUpperCase(); spoken = [];
      app.querySelectorAll(`.kbd .wk[data-n="${it.note}"]`).forEach(r => r.classList.add("ok"));
    } else if (it.kind === "figures" && it.sub === "temps") {
      shown = `${it.fig[1]} = ${target} temps`; spoken = [`${it.fig[1][0].toUpperCase()}${it.fig[1].slice(1)} vaut ${TEMPS[target]}.`];
    } else if (it.kind === "figures") {
      const f = FIGURES.find(x => x[0] === target); shown = `<img class="figans" src="img/music/${f[0]}.svg" alt=""> ${f[1]}`; spoken = ["C'est", f[1]];
    } else if (it.kind === "phrase") {
      shown = esc(it.phrase); spoken = [it.phrase];
    } else if (it.kind === "money") {
      shown = `${target} ${it.unit}`; spoken = ["ça fait", ...numberParts(target), it.unit === "¢" ? "sous" : +target > 1 ? "dollars" : "dollar"];
      $("#num").textContent = target; $("#num").className = "bad";
    } else if (it.kind === "syllab") {
      shown = it.syl.join(" · "); spoken = [it.mot];
    } else if (it.kind === "sound") {
      const a = it.choices.find(c => c.mot === target); shown = `${it.target.emoji} ${esc(it.target.mot)} · ${a.emoji} ${esc(a.mot)}`; spoken = [it.target.mot, { pause: 250 }, a.mot];
    } else if (it.kind === "compare") {
      shown = target; spoken = [it.ask === "grand" ? "Le plus grand, c'est" : "Le plus petit, c'est", ...numberParts(target)];
    } else if (it.kind === "clock") {
      shown = target; spoken = timeParts(it.h, it.m);
    } else if (it.kind === "music") {
      if (it.sub === "pitch") { shown = `🔔 ${+target + 1}`; spoken = [it.ask === "aigu" ? "Le son le plus aigu, c'est le" : "Le son le plus grave, c'est le", +target ? "deuxième" : "premier"]; }
      else if (it.sub === "rhythm") { shown = it.pattern.join(" "); spoken = ["Écoute encore."]; }
      else { const ins = INSTRUMENTS.find(x => x[0] === it.ins); shown = `${ins[2]} ${ins[1]}`; spoken = ["C'est", ins[1]]; }
    } else {
      shown = it.kind === "calc" ? `${it.a} ${it.op} ${it.b} = ${target}` : target;
      spoken = it.kind === "calc" ? [...promptParts(it), "ça fait", ...numberParts(target)] : ["Le nombre est", ...numberParts(target)];
      $("#num").textContent = target; $("#num").className = "bad";
    }
    app.querySelectorAll(".choice").forEach(c => { if (c.dataset.v === target) c.classList.add("ok"); });
    fb.insertAdjacentHTML("afterend", `<div class="answer">${shown}</div><div class="actions"><button class="btn small" id="again">🔊 ↻</button><button class="btn ghost small" id="skip">→</button></div>`);
    if (it.kind === "word" || it.kind === "read" || it.kind === "sound" || it.kind === "syllab" || it.kind === "phrase") say(spoken); else chatter(it.kind, spoken);
    if (it.kind === "music" && it.sub === "rhythm") setTimeout(() => { if (session.items[session.i] === it && $("#again")) playMusic(it); }, S.mute.music ? 300 : 1300);
    $("#again").onclick = () => { renderItem(it); replay(it); };
    $("#skip").onclick = () => { session.i++; nextItem(); };
  }
}
function maybeLevelUp() {
  if (session.kind !== "word" || !S.palierAuto || S.palier >= 10) return false;
  const un = unlockedWords(); if (!un.length) return false;
  const learned = un.filter(w => S.progress[w.key] && S.progress[w.key].box >= 1).length;
  if (learned / un.length >= 0.7) { S.palier += 1; return true; }
  return false;
}
const STREAK_STICKERS = { 3: "🔥", 7: "💎", 14: "🏆", 30: "🌟" };
function dayStr(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function dailyState() {
  const t = dayStr(new Date());
  if (!S.daily || S.daily.date !== t) S.daily = { date: t, done: false };
  else if (S.daily.acts) S.daily = { date: t, done: S.daily.done.length >= S.daily.acts.length };
  return S.daily;
}
function streakNow() { const y = dayStr(new Date(Date.now() - 864e5)), t = dayStr(new Date()); return S.streak.last === t || S.streak.last === y ? S.streak.n : 0; }
function markDaily(kind) {
  const d = dailyState(); if (kind !== "daily" || d.done) return null;
  d.done = true;
  const t = dayStr(new Date()), y = dayStr(new Date(Date.now() - 864e5));
  S.streak = { n: S.streak.last === y ? S.streak.n + 1 : S.streak.last === t ? S.streak.n : 1, last: t };
  const st = STREAK_STICKERS[S.streak.n]; if (st) S.stickers[st] = (S.stickers[st] || 0) + 1;
  return { complete: true, n: S.streak.n, sticker: st };
}
function endSession() {
  const missing = STICKERS.filter(x => !S.stickers[x]), sticker = missing.length && Math.random() < 0.8 ? pick(missing) : pick(STICKERS);
  S.stickers[sticker] = (S.stickers[sticker] || 0) + 1;
  const daily = markDaily(session.kind);
  const up = maybeLevelUp(); save();
  const gained = session.good;
  view(`${topbar()}
    <div class="result"><div class="big">🎉</div><h1>Bravo!</h1>
      <div class="score">+${gained} <small>abonné${gained > 1 ? "s" : ""}</small></div>
      <p class="tagline">${gained >= session.total / 2 ? `${gained} sur ${session.total}` : "Tu as travaillé fort!"}</p>
      ${up ? `<div class="levelup">🏅 Niveau ${S.palier} débloqué!</div>` : ""}
      <div class="toast"><span class="ic">${sticker}</span><div><div class="tt">Succès débloqué</div><div class="tn">Nouveau collant${S.stickers[sticker] > 1 ? ` ×${S.stickers[sticker]}` : ""}</div></div></div>
      ${daily && daily.complete ? `<div class="toast streak"><span class="ic">${daily.sticker || "🔥"}</span><div><div class="tt">Défi du jour réussi!</div><div class="tn">🔥 ${daily.n} jour${daily.n > 1 ? "s" : ""} de suite${daily.sticker ? " · collant spécial!" : ""}</div></div></div>` : ""}
    </div>
    <button class="btn pink" id="again">Encore une partie</button>
    <button class="btn ghost" id="album">🏆 Mes succès</button>
    <button class="btn ghost" id="home">Accueil</button>`);
  confetti(60);
  chatter(session.kind, ["Bravo! Tu as gagné un nouveau collant!", ...(gained ? [String(gained), gained > 1 ? "nouveaux abonnés" : "nouvel abonné"] : ["Tu as travaillé fort!"]), ...(up ? ["Et tu passes au niveau", String(S.palier)] : []), ...(daily && daily.complete ? ["Défi du jour réussi!", String(daily.n), daily.n > 1 ? "jours de suite" : ""] : [])]);
  const k = session.kind;
  if (k === "daily") $("#again").textContent = "Rejouer le défi";
  $("#back").onclick = home; $("#home").onclick = home; $("#again").onclick = () => startSession(k); $("#album").onclick = album;
}

/* ---------- écrans ---------- */
function view(html, tab) {
  app.innerHTML = html + (tab ? tabbar(tab) : "");
  app.classList.toggle("immersive", !tab);
  if (tab) app.querySelectorAll(".tabbar button").forEach(b => b.onclick = () => ({ home, album, style: styleScreen, parent: pinScreen })[b.dataset.tab]());
}
function tabbar(active) {
  const tabs = [["home", "🏠", "Accueil"], ["album", "🏆", "Succès"], ["style", "🎨", "Style"], ["parent", "👤", "Parent"]];
  return `<nav class="tabbar">${tabs.map(([id, ic, lb]) => `<button data-tab="${id}" class="${active === id ? "on" : ""}">${ic}<small>${lb}</small></button>`).join("")}</nav>`;
}
function channelHeader() {
  const unlocked = Object.keys(S.stickers).length;
  return `<div class="banner"></div>
    <div class="channel"><div class="avatar">${avatarHtml()}</div>
      <div class="channel-meta"><h1>Les Zombinettes</h1><p>@zombinettes · <b>${S.stars}</b> abonnés · Niveau <b>${S.palier}</b> · ${unlocked} succès</p></div></div>`;
}
function topbar(back = true) {
  return `<div class="topbar">${back ? `<button class="back" id="back">←</button>` : "<span></span>"}<span><span class="stars" title="niveau">🏅 ${S.palier}</span> <span class="stars" id="starsN" title="abonnés">👥 ${S.stars}</span></span></div>`;
}
function tileCard([id, title, ic, c1, c2, sub]) {
  return `<button class="tilecard" data-g="${id}">
      <div class="thumb" style="--c1:${c1};--c2:${c2}">${ic}${S.weekly.length && id === "word" ? `<span class="live">SEMAINE</span>` : ""}</div>
      <div class="info"><div class="mini">${ic}</div><div><div class="t">${title}</div><div class="s">${sub}</div><div class="s">${S.plays[id] ? `${S.plays[id]} partie${S.plays[id] > 1 ? "s" : ""} jouée${S.plays[id] > 1 ? "s" : ""}` : "Jamais joué"}</div></div></div>
    </button>`;
}
function home() {
  stopAudio();
  const d = dailyState(), sn = streakNow();
  const daily = `<button class="daily ${d.done ? "complete" : ""}" data-g="daily"><div class="dh"><b>${d.done ? "Défi du jour réussi! 🎉" : "🔥 Défi du jour"}</b><span class="flame ${sn ? "" : "off"}">🔥 ${sn}</span></div>
    <div class="ds">${d.done ? "Tu peux le rejouer pour le plaisir." : "10 questions : français, maths et musique"}</div></button>`;
  const mixes = `<div class="mixes">${CATS.map(([id, t, ic, c1, c2]) => `<button class="mix" data-g="mix:${id}" style="--c1:${c1};--c2:${c2}"><span>${ic}</span><b>${t}</b><small>Mélange</small></button>`).join("")}</div>`;
  const lists = CATS.map(([id, t, ic, , , games]) => `<h2 class="cathead"><span>${ic}</span>${t}</h2><div class="grid">${games.map(g => tileCard(ACTIVITIES.find(a => a[0] === g))).join("")}</div>`).join("");
  view(`${channelHeader()}
    ${daily}
    ${mixes}
    <h2 class="cathead all">Tous les jeux</h2>
    ${lists}`, "home");
  app.querySelectorAll("[data-g]").forEach(b => b.onclick = () => startSession(b.dataset.g));
}
function album() {
  const unlocked = Object.keys(S.stickers).length;
  view(`<div class="section"><h1>Succès</h1>
    <div class="achv-head"><span class="muted">Collants débloqués</span><b>${unlocked} / ${STICKERS.length}</b></div>
    <div class="achv-bar"><div style="width:${Math.round(unlocked / STICKERS.length * 100)}%"></div></div>
    <div class="album">${STICKERS.map(s => `<div class="sticker ${S.stickers[s] ? "" : "locked"}">${S.stickers[s] ? s : "🔒"}${S.stickers[s] > 1 ? `<span class="count">×${S.stickers[s]}</span>` : ""}</div>`).join("")}</div>
    <div class="achv-head"><span class="muted">Défis du jour de suite · 🔥 ${streakNow()}</span></div>
    <div class="album">${Object.entries(STREAK_STICKERS).map(([n, s]) => `<div class="sticker ${S.stickers[s] ? "" : "locked"}">${S.stickers[s] ? s : "🔒"}<span class="count">${n} j</span></div>`).join("")}</div></div>`, "album");
}
function confetti(n = 30) {
  const box = document.createElement("div"); box.className = "confetti";
  for (let i = 0; i < n; i++) { const s = document.createElement("span"); s.textContent = pick(["🎉", "⭐", "💜", "🩷", "✨", "🌸", "🦇"]); s.style.left = Math.random() * 100 + "%"; s.style.animationDelay = Math.random() * .5 + "s"; box.appendChild(s); }
  document.body.appendChild(box); setTimeout(() => box.remove(), 2400);
}

/* ---------- mon style (enfant) ---------- */
function styleScreen() {
  const voices = frVoices();
  const styleIdx = Math.max(0, VOICE_STYLES.findIndex(v => v[2] === S.pitch));
  const edgeCards = EDGE_VOICES.filter(([id]) => MANIFEST[id]).map(([id, name, av]) => `<button class="voice ${S.voice === id ? "on" : ""}" data-u="${id}"><span class="av">${av}</span><span class="nm">${name} ✨</span><span class="lg">QC</span></button>`).join("");
  view(`<div class="section"><h1>Mon style</h1>
    <div class="card"><div class="photo-row"><div class="avatar" id="avatarPrev">${avatarHtml()}</div>
      <label class="btn ghost small" for="photoCam" style="margin:0">🤳 Selfie</label><input type="file" id="photoCam" accept="image/*" capture="user" hidden>
      <label class="btn ghost small" for="photoFile" style="margin:0">🖼️ Photo</label><input type="file" id="photoFile" accept="image/*" hidden>
      ${S.avatar ? `<button class="btn ghost small" id="photoDel" style="margin:0">✖</button>` : ""}</div></div>
    <div class="card"><div class="row" style="justify-content:center">${[["dark", "🌑 Sombre"], ["color", "🌈 Couleur"]].map(([id, lb]) => `<button class="pill ${(S.bg || "dark") === id ? "on" : ""}" data-bg="${id}">${lb}</button>`).join("")}</div>
      ${S.bg === "color" ? `<div class="swatches duos"><button class="swatch duo ${!S.custom ? "on" : ""}" data-duo="theme" style="background:linear-gradient(135deg, var(--accent), var(--accent2))">🎨</button>${DUOS.map(([id, e, c1, c2]) => `<button class="swatch duo ${S.custom && S.custom.id === id ? "on" : ""}" data-duo="${id}" style="background:linear-gradient(135deg, ${c1}, ${c2})">${e}</button>`).join("")}</div>` : ""}</div>
    <div class="card"><div class="swatches">${THEMES.map(([t, e]) => `<button class="swatch ${S.theme === t ? "on" : ""}" data-t="${t}" data-theme="${t}">${e}</button>`).join("")}</div></div>
    <div class="card">
      <div class="voices">${edgeCards}${voices.length ? voices.map((v, i) => `<button class="voice ${S.voice === "system:" + v.voiceURI ? "on" : ""}" data-u="system:${esc(v.voiceURI)}"><span class="av">${AVATARS[i % AVATARS.length]}</span><span class="nm">${esc(v.name.replace(/\s*\(.*$/, "").trim())}${/enhanced|premium|amélior|neural|natural|google/i.test(v.name) ? " ✨" : ""}</span><span class="lg">${esc(v.lang.slice(-2).toUpperCase())}</span></button>`).join("") : ""}</div>
      <div class="row" style="justify-content:center">${VOICE_STYLES.map((v, i) => `<button class="pill big ${i === styleIdx ? "on" : ""}" data-p="${v[2]}">${v[1]}</button>`).join("")}</div>
    </div></div>`, "style");
  const onPhoto = async e => { const f = e.target.files[0]; if (f && await setAvatarFromFile(f)) { say(["Belle photo!"]); styleScreen(); } };
  $("#photoFile").onchange = onPhoto; $("#photoCam").onchange = onPhoto;
  if ($("#photoDel")) $("#photoDel").onclick = () => { S.avatar = null; save(); styleScreen(); };
  app.querySelectorAll("[data-bg]").forEach(b => b.onclick = () => { S.bg = b.dataset.bg; if (S.bg === "dark") S.custom = null; save(); applyTheme(); say([S.bg === "dark" ? "Fond sombre" : "Fond coloré"]); styleScreen(); });
  app.querySelectorAll(".swatch[data-t]").forEach(b => b.onclick = () => { S.theme = b.dataset.t; S.custom = null; save(); applyTheme(); say([THEME_NAMES[S.theme]]); styleScreen(); });
  app.querySelectorAll("[data-duo]").forEach(b => b.onclick = () => {
    const d = DUOS.find(x => x[0] === b.dataset.duo);
    S.custom = d ? { id: d[0], c1: d[2], c2: d[3] } : null; save(); applyTheme();
    say([d ? "Nouvelle couleur!" : "Couleurs du thème"]); styleScreen();
  });
  app.querySelectorAll(".voice").forEach(b => b.onclick = () => {
    S.voice = b.dataset.u; save(); app.querySelectorAll(".voice").forEach(x => x.classList.toggle("on", x === b));
    const edge = EDGE_VOICES.find(([id]) => id === S.voice);
    if (edge) say([`Salut! Moi c'est ${edge[1]}. On joue ensemble?`]);
    else { const v = voices.find(x => "system:" + x.voiceURI === S.voice); say([`Salut! Moi c'est ${v ? v.name.replace(/\s*\(.*$/, "") : "ta voix"}.`, "On joue ensemble?"]); }
  });
  app.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { const v = b.dataset.p; S.pitch = isNaN(v) ? v : +v; save(); app.querySelectorAll("[data-p]").forEach(x => x.classList.toggle("on", x === b)); say([STYLE_NAMES[S.pitch]]); });
}
if ("speechSynthesis" in window) speechSynthesis.addEventListener("voiceschanged", () => { if ($("h1") && $("h1").textContent === "Mon style") styleScreen(); });

/* ---------- parent ---------- */
function pinScreen() {
  let entered = "";
  view(`<div class="section"><h1>Espace parent</h1><p class="hint">Entre le NIP</p>
    <div class="pin">${[0, 1, 2, 3].map(() => "<span></span>").join("")}</div>
    <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map(k => `<button data-k="${k}" ${k === "" ? "disabled" : ""}>${k}</button>`).join("")}</div></div>`, "parent");
  $(".pad").onclick = e => {
    const b = e.target.closest("button"); if (!b) return;
    const k = b.dataset.k;
    if (k === "⌫") entered = entered.slice(0, -1); else if (entered.length < 4) entered += k;
    app.querySelectorAll(".pin span").forEach((d, i) => d.classList.toggle("on", i < entered.length));
    if (entered.length === 4) { if (entered === S.pin) parent(); else { entered = ""; $(".hint").textContent = "Mauvais NIP, réessaie"; app.querySelectorAll(".pin span").forEach(d => d.classList.remove("on")); } }
  };
}
function parent() {
  const m = S.math, un = unlockedWords();
  const boxes = [0, 0, 0, 0]; let seen = 0;
  for (const w of POOL.concat(weeklyWords())) { const p = S.progress[w.key]; if (p) { seen++; boxes[p.box]++; } }
  const hard = Object.entries(S.progress).filter(([, p]) => p.ko >= 2).sort((a, b) => b[1].ko - a[1].ko).slice(0, 10);
  const pills = (name, opts, cur, fmt) => `<div class="row" data-group="${name}">${opts.map(o => `<button class="pill ${cur === o ? "on" : ""}" data-v="${o}">${fmt(o)}</button>`).join("")}</div>`;
  view(`<div class="parent">
    <h1>Espace parent</h1>
    <div class="card">
      <h2>🎤 Les mots</h2>
      <label>Niveau de difficulté : <b id="palierV">${palierLabel(S.palier)}</b></label>
      <input type="range" id="palier" min="1" max="10" step="1" value="${S.palier}">
      <p class="muted">Paliers 1 à 4 = mots de 1re année du plus facile au plus difficile, 5 à 7 = 2e année, 8 à 10 = 3e année. Les nouveaux mots viennent seulement des paliers débloqués.</p>
      <label><input type="checkbox" id="auto" ${S.palierAuto ? "checked" : ""}> Monter de niveau automatiquement (quand 70 % des mots débloqués sont connus)</label>
      <label>Façon de répondre</label>
      ${pills("mode", ["tiles", "typed"], S.mode, v => v === "tiles" ? "Lettres à placer" : "Clavier")}
      <label>Lettres pièges (en mode lettres à placer)</label>
      ${pills("decoys", [0, 2, 3, 5], S.decoys, v => v)}
      <label>Mots par dictée</label>
      ${pills("len", [5, 8, 10, 12], S.sessionLength, v => v)}
      <label>Mots de la semaine (un par ligne ou séparés par des virgules)</label>
      <textarea id="weekly">${esc(S.weekly.join("\n"))}</textarea>
      <p class="muted">Passent en priorité dans chaque dictée, en plus des mots du ministère. Le jeu introduit 3 nouveaux mots par dictée et fait revenir les mots ratés plus souvent.</p>
    </div>
    <div class="card">
      <h2>🔢 Les nombres</h2>
      <label>Nombres jusqu'à</label>
      ${pills("numMax", [20, 100, 199, 1000, 9999], m.numMax, v => v.toLocaleString("fr-CA"))}
      <p class="muted">Jusqu'à 199 : 7 nombres sur 10 sous 100. À 1 000 et plus : surtout des centaines et des milliers.</p>
    </div>
    <div class="card">
      <h2>📖 Lire</h2>
      <label>Niveau</label>
      ${pills("readLvl", [1, 2, 3], S.read.level, v => ["", "Mots courts", "Images qui se ressemblent", "4 images"][v])}
      <p class="muted">Le mot est écrit mais jamais dit avant la réponse : elle doit le lire.</p>
    </div>
    <div class="card">
      <h2>👂 Rimes et sons</h2>
      <label><input type="checkbox" id="soRime" ${S.sound.rime ? "checked" : ""}> Quel mot rime avec…</label>
      <label><input type="checkbox" id="soDebut" ${S.sound.debut ? "checked" : ""}> Quel mot commence comme…</label>
    </div>
    <div class="card">
      <h2>🧩 Phrases</h2>
      <label>Mots par phrase (au plus)</label>
      ${pills("phrMax", [3, 4, 5, 6], S.phrase.max, v => v)}
    </div>
    <div class="card">
      <h2>🎹 Piano</h2>
      ${pills("keysLvl", [1, 2, 3], S.keys.level, v => ["", "Do seulement", "Do, ré, mi", "Les 7 notes"][v])}
    </div>
    <div class="card">
      <h2>🪙 Les sous</h2>
      ${pills("monLvl", [1, 2, 3], S.money.level, v => ["", "5 ¢ et 10 ¢", "+ 25 ¢ (jusqu'à 1 $)", "1 $ et 2 $"][v])}
    </div>
    <div class="card">
      <h2>🐊 Plus grand, plus petit</h2>
      <label>Nombres jusqu'à</label>
      ${pills("cmpMax", [20, 100, 1000, 9999], S.cmp.max, v => v.toLocaleString("fr-CA"))}
    </div>
    <div class="card">
      <h2>🕒 L'heure</h2>
      ${pills("clockLvl", [1, 2, 3], S.clock.level, v => ["", "Heures justes", "+ et 30", "5 minutes (chiffres rouges)"][v])}
    </div>
    <div class="card">
      <h2>🎵 Musique</h2>
      <label>Niveau</label>
      ${pills("muLvl", [1, 2, 3], S.music.level, v => ["", "Facile", "Moyen", "Difficile"][v])}
    </div>
    <div class="card">
      <h2>➕ Les calculs</h2>
      <label>Premier nombre jusqu'à <b id="firstMaxV">${m.firstMax}</b></label>
      <input type="range" id="firstMax" min="5" max="100" step="5" value="${m.firstMax}">
      <label>On ajoute (ou enlève) jusqu'à <b id="addMaxV">+${m.addMax}</b></label>
      <input type="range" id="addMax" min="1" max="20" step="1" value="${m.addMax}">
      <label><input type="checkbox" id="sub" ${m.sub ? "checked" : ""}> Aussi des soustractions</label>
      <label><input type="checkbox" id="visual" ${m.visual ? "checked" : ""}> Montrer des points pour compter (jusqu'à 20)</label>
      <label>Questions par partie</label>
      ${pills("mlen", [5, 8, 10, 12], m.length, v => v)}
    </div>
    <div class="card">
      <h2>✏️ Tracer</h2>
      <label><input type="checkbox" id="tLower" ${S.trace.lower ? "checked" : ""}> Lettres minuscules</label>
      <label><input type="checkbox" id="tUpper" ${S.trace.upper ? "checked" : ""}> Lettres MAJUSCULES</label>
      <label><input type="checkbox" id="tDigits" ${S.trace.digits ? "checked" : ""}> Chiffres (Tracer les chiffres)</label>
      <label><input type="checkbox" id="tNums" ${S.trace.nums ? "checked" : ""}> Nombres à 2 chiffres (Tracer les chiffres)</label>
      <label><input type="checkbox" id="tCursive" ${S.trace.cursive ? "checked" : ""}> Lettres attachées</label>
      <label><input type="checkbox" id="tCwords" ${S.trace.cwords ? "checked" : ""}> Petits mots en attaché</label>
      <label>Tracés par partie</label>
      ${pills("tlen", [4, 6, 8, 10], S.trace.length, v => v)}
    </div>
    <div class="card">
      <h2>📊 Progrès</h2>
      <table class="stats">
        ${CATS.map(([id, t, ic, , , games]) => `<tr><td>${ic} Parties ${t}</td><td>${games.map(g => `${ACTIVITIES.find(a => a[0] === g)[1]} ${S.plays[g] || 0}`).join(" · ")} · Mélange ${S.plays["mix:" + id] || 0}</td></tr>`).join("")}
        <tr><td>🔥 Défis du jour joués</td><td>${S.plays.daily || 0}</td></tr>
        <tr><td>Mots débloqués / total</td><td>${un.length} / ${POOL.length}</td></tr>
        <tr><td>Mots rencontrés</td><td>${seen}</td></tr>
        <tr><td>À apprendre / en cours / presque / acquis</td><td>${boxes.join(" / ")}</td></tr>
        <tr><td>Dictées faites</td><td>${S.sessions}</td></tr>
        <tr><td>Nombres réussis / ratés</td><td>${S.mathStats.number.ok} / ${S.mathStats.number.ko}</td></tr>
        <tr><td>Calculs réussis / ratés</td><td>${S.mathStats.calc.ok} / ${S.mathStats.calc.ko}</td></tr>
        <tr><td>Tracés réussis</td><td>${S.mathStats.trace.ok}</td></tr>
        ${[["read", "Lecture"], ["sound", "Rimes et sons"], ["syllab", "Syllabes"], ["phrase", "Phrases"], ["money", "Sous"], ["keys", "Piano"], ["figures", "Notes de musique"], ["compare", "Plus grand"], ["clock", "Heure"], ["music", "Aigu, rythme, instruments"]].map(([k, l]) => `<tr><td>${l} réussis / ratés</td><td>${S.mathStats[k].ok} / ${S.mathStats[k].ko}</td></tr>`).join("")}
        <tr><td>Abonnés</td><td>${S.stars}</td></tr>
      </table>
      ${hard.length ? `<label>Mots difficiles</label><p>${hard.map(([k, p]) => `<span class="pill">${esc(k)} ×${p.ko}</span>`).join("")}</p>` : ""}
    </div>
    <div class="card">
      <h2>💾 Sauvegarde</h2>
      <p class="muted">Les progrès sont enregistrés seulement dans cet appareil. Exporte un fichier pour les garder ou les transférer.</p>
      <div class="row"><button class="btn small" id="export">Exporter les progrès</button><label class="btn ghost small" for="importFile" style="margin:6px">Importer un fichier</label><input type="file" id="importFile" accept=".json,application/json" hidden></div>
      <p class="muted" id="ioMsg"></p>
    </div>
    <div class="card">
      <h2>📴 Hors ligne</h2>
      <p class="muted">Télécharge la voix choisie dans l'appareil pour que tout fonctionne sans Wi-Fi (auto, avion, chalet).</p>
      <button class="btn small" id="offline">Préparer le hors-ligne</button>
      <p class="muted" id="offMsg"></p>
    </div>
    <button class="btn mint" id="save">Enregistrer</button>
    <div class="row" style="justify-content:center"><button class="btn ghost small" id="pin">Changer le NIP</button><button class="btn ghost small" id="reset">Réinitialiser les progrès</button></div>
  </div>`, "parent");
  const sel = { mode: S.mode, decoys: S.decoys, len: S.sessionLength, mlen: m.length, tlen: S.trace.length, numMax: m.numMax, readLvl: S.read.level, cmpMax: S.cmp.max, clockLvl: S.clock.level, muLvl: S.music.level, phrMax: S.phrase.max, monLvl: S.money.level, keysLvl: S.keys.level };
  app.querySelectorAll("[data-group]").forEach(g => g.onclick = e => {
    const b = e.target.closest(".pill"); if (!b) return;
    const v = b.dataset.v; sel[g.dataset.group] = isNaN(v) ? v : +v;
    g.querySelectorAll(".pill").forEach(x => x.classList.toggle("on", x === b));
  });
  const live = (id, fmt) => { $("#" + id).oninput = e => $("#" + id + "V").textContent = fmt(e.target.value); };
  live("firstMax", v => v); live("addMax", v => "+" + v); live("palier", v => palierLabel(+v));
  $("#save").onclick = () => {
    S.palier = +$("#palier").value; S.palierAuto = $("#auto").checked; S.mode = sel.mode; S.decoys = sel.decoys; S.sessionLength = sel.len;
    S.read = { level: sel.readLvl }; S.sound = { rime: $("#soRime").checked, debut: $("#soDebut").checked }; S.phrase = { max: sel.phrMax }; S.money = { level: sel.monLvl }; S.keys = { level: sel.keysLvl }; S.cmp = { max: sel.cmpMax }; S.clock = { level: sel.clockLvl };
    S.music = { level: sel.muLvl };
    S.weekly = [...new Set($("#weekly").value.split(/[\n,;]+/).map(s => s.trim().toLowerCase().replace(/\s+/g, " ")).filter(Boolean))];
    S.trace = { lower: $("#tLower").checked, upper: $("#tUpper").checked, digits: $("#tDigits").checked, nums: $("#tNums").checked, cursive: $("#tCursive").checked, cwords: $("#tCwords").checked, length: sel.tlen };
    S.math = { numMax: sel.numMax, firstMax: +$("#firstMax").value, addMax: +$("#addMax").value, sub: $("#sub").checked, visual: $("#visual").checked, length: sel.mlen };
    save(); home();
  };
  $("#export").onclick = async () => {
    const name = `zombinettes-${new Date().toISOString().slice(0, 10)}.json`;
    const json = JSON.stringify(Object.assign({}, S, { pin: undefined, exportedAt: new Date().toISOString() }), null, 1);
    const file = new File([json], name, { type: "application/json" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Progrès Zombinettes" }); $("#ioMsg").textContent = "Fichier partagé."; return; }
    } catch (e) { if (e.name === "AbortError") return; }
    const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = name; document.body.appendChild(a); a.click(); a.remove();
    $("#ioMsg").textContent = `Fichier ${name} téléchargé.`;
  };
  $("#importFile").onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!data.progress || !data.stickers) throw new Error("format");
      if (!confirm("Remplacer les progrès actuels par ceux du fichier ?")) return;
      const pin = S.pin; localStorage.setItem(STORE_KEY, JSON.stringify(Object.assign(data, { pin }))); S = load(); applyTheme(); parent();
    } catch { $("#ioMsg").textContent = "Fichier invalide."; }
  };
  $("#offline").onclick = async () => {
    const msg = $("#offMsg"); const m = MANIFEST[S.voice];
    if (!("caches" in window)) { msg.textContent = "Non disponible dans ce navigateur."; return; }
    if (!m) { msg.textContent = "La voix choisie n'a pas de clips à télécharger."; return; }
    const urls = [...m].map(sl => `audio/${S.voice}/${sl}.mp3`); const cache = await caches.open("zombinettes-v8"); urls.push(...INSTRUMENTS.flatMap(x => [1, 2].map(k => `audio/instr/${x[0]}-${k}.m4a`))); let done = 0;
    for (let i = 0; i < urls.length; i += 25) {
      const batch = urls.slice(i, i + 25).filter(u => u);
      const existing = await Promise.all(batch.map(u => cache.match(u)));
      await Promise.all(batch.filter((u, k) => !existing[k]).map(u => cache.add(u).catch(() => {})));
      done += batch.length; msg.textContent = `${done} / ${urls.length} sons…`;
    }
    msg.textContent = `Prêt : ${urls.length} sons de ${S.voice === "sylvie" ? "Sylvie" : S.voice} disponibles hors ligne.`;
  };
  $("#pin").onclick = () => { const p = prompt("Nouveau NIP (4 chiffres)"); if (p && /^\d{4}$/.test(p)) { S.pin = p; save(); alert("NIP changé"); } };
  $("#reset").onclick = () => { if (confirm("Effacer tous les progrès, abonnés et collants ?")) { S.progress = {}; S.stars = 0; S.stickers = {}; S.sessions = 0; S.palier = 1; S.mathStats = JSON.parse(JSON.stringify(DEFAULTS.mathStats)); save(); parent(); } };
}

/* ---------- démarrage ---------- */
async function boot() {
  applyTheme();
  view(`<div class="hero">🧟‍♀️</div><p class="tagline">Chargement…</p>`);
  const res = await Promise.all([1, 2, 3].map(l => fetch(`data/mots-${l}.json`).then(r => r.json()).catch(() => [])));
  PACKS = { 1: res[0], 2: res[1], 3: res[2] };
  READ_WORDS = await fetch("data/lecture.json").then(r => r.json()).catch(() => []);
  PHRASES = await fetch("data/phrases-desordre.json").then(r => r.json()).catch(() => []);
  SYL_WORDS = await fetch("data/syllabes.json").then(r => r.json()).catch(() => []);
  SOUND_WORDS = await fetch("data/sons.json").then(r => r.json()).catch(() => []);
  try { const m = await fetch("audio/manifest.json").then(r => r.json()); for (const k in m) MANIFEST[k] = new Set(m[k]); } catch {}
  if (!S.voice.startsWith("system:") && !MANIFEST[S.voice]) { const first = Object.keys(MANIFEST)[0]; S.voice = first || "system:"; }
  buildPool(); home();
  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
}
boot();
})();
