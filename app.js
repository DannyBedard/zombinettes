/* Les Zombinettes — français et maths pour le 1er cycle du primaire */
(() => {
const STORE_KEY = "zombinettes.v1";
const DEFAULTS = {
  palier: 5, palierAuto: true, mode: "tiles", decoys: 3, pin: "1234", weekly: [], theme: "violet", bg: "dark", avatar: null, custom: null, voice: "sylvie", pitch: 1,
  mute: { quiz: false, word: false, read: false, sound: false, syllab: false, phrase: false, money: false, keys: false, figures: false, number: false, calc: false, compare: false, clock: false, trace: false, music: false },
  stars: 0, stickers: {}, sessions: 0, progress: {}, sessionLength: 8, newPerSession: 3,
  math: { numMax: 199, firstMax: 20, addMax: 10, sub: true, visual: true, length: 8 },
  mathStats: { quiz: { ok: 0, ko: 0 }, number: { ok: 0, ko: 0 }, calc: { ok: 0, ko: 0 }, trace: { ok: 0, ko: 0 }, read: { ok: 0, ko: 0 }, sound: { ok: 0, ko: 0 }, syllab: { ok: 0, ko: 0 }, phrase: { ok: 0, ko: 0 }, money: { ok: 0, ko: 0 }, keys: { ok: 0, ko: 0 }, figures: { ok: 0, ko: 0 }, compare: { ok: 0, ko: 0 }, clock: { ok: 0, ko: 0 }, music: { ok: 0, ko: 0 } },
  trace: { lower: true, upper: true, digits: true, nums: true, cursive: true, cwords: true, length: 6 },
  read: { level: 2 }, sound: { rime: true, debut: true }, phrase: { max: 4 }, money: { level: 1 }, keys: { level: 3 }, daily: null, days: [], cabin: { items: [], visitors: [] }, streak: { n: 0, last: "" }, mixCount: {}, cmp: { max: 1000 }, clock: { level: 1 }, music: { pitch: true, rhythm: true, instr: true, level: 2 },
  plays: { word: 0, read: 0, sound: 0, syllab: 0, phrase: 0, money: 0, keys: 0, figures: 0, number: 0, calc: 0, compare: 0, clock: 0, trace: 0, music: 0 },
  boost: 5
};
const ACTIVITIES = [
  ["word", "Les mots", "🎤", "#7c3aed", "#ec4899", "Dictée · liste du ministère"],
  ["read", "Lire", "📖", "#db2777", "#f59e0b", "Lis le mot, trouve l'image"],
  ["syllab", "Syllabes", "🥁", "#ea580c", "#facc15", "Un coup de tambour par syllabe"],
  ["sound", "Rimes et sons", "👂", "#0891b2", "#a3e635", "Ça rime? Ça commence pareil?"],
  ["phrase", "Phrases", "🧩", "#7c3aed", "#22d3ee", "Remets les mots en ordre"],
  ["sonsref", "Les sons", "🔤", "#0e7490", "#f472b6", "Les lettres qui font un son"],
  ["trace", "Tracer les lettres", "✏️", "#14b8a6", "#8b5cf6", "Lettres, mots et attaché"],
  ["number", "Les nombres", "🔢", "#0ea5e9", "#22c55e", "Écoute et écris le nombre"],
  ["calc", "Les calculs", "➕", "#f97316", "#ef4444", "Additions et soustractions"],
  ["compare", "Plus grand?", "🐊", "#16a34a", "#0ea5e9", "Le plus grand, le plus petit"],
  ["money", "Les sous", "🪙", "#ca8a04", "#64748b", "Compte l'argent"],
  ["clock", "L'heure", "🕒", "#6366f1", "#06b6d4", "Lis l'heure sur l'horloge"],
  ["formes", "Les formes", "🔺", "#db2777", "#60a5fa", "Carré, triangle, cercle…"],
  ["solides", "Les solides", "🧊", "#0891b2", "#a855f7", "Cube, sphère, cône…"],
  ["traceNum", "Tracer les chiffres", "✍️", "#0d9488", "#3b82f6", "Chiffres et nombres"],
  ["pitch", "Aigu ou grave", "🔔", "#a855f7", "#f43f5e", "Quel son est le plus aigu?"],
  ["rhythm", "Rythme", "🥁", "#f43f5e", "#f97316", "Ta, ti-ti, chut au tambour"],
  ["instr", "Instrument mystère", "🎻", "#9333ea", "#0ea5e9", "Quel instrument joue?"],
  ["traceMus", "Tracer les notes", "🖊️", "#db2777", "#7c3aed", "Ronde, blanche, noire, croche"],
  ["keys", "Piano", "🎹", "#0f172a", "#a855f7", "Trouve la note sur le clavier"],
  ["figures", "Les notes", "🎼", "#be185d", "#6366f1", "Ronde, blanche, noire…"],
  ["vivant", "Vivant ou pas?", "🌱", "#16a34a", "#84cc16", "Est-ce que c'est vivant?"],
  ["habitat", "Où vit l'animal?", "🦊", "#ea580c", "#0ea5e9", "Mer, forêt, ferme, banquise"],
  ["meteo", "La météo", "🌦️", "#0284c7", "#facc15", "Qu'est-ce que tu mets?"],
  ["saisons", "Les saisons", "🍂", "#d97706", "#22c55e", "Hiver, printemps, été, automne"],
  ["avant", "Avant ou aujourd'hui", "☎️", "#78716c", "#a855f7", "Les objets d'autrefois"],
  ["couleurs", "Les couleurs", "🎨", "#ef4444", "#3b82f6", "Mélange deux couleurs"],
  ["emotions", "Les émotions", "😊", "#f472b6", "#f59e0b", "Comment tu te sens?"]
];
const CATS = [
  ["fr", "Français", "📚", "#7c3aed", "#ec4899", ["word", "read", "syllab", "sound", "phrase", "sonsref", "trace"]],
  ["math", "Maths", "🧮", "#0ea5e9", "#22c55e", ["number", "calc", "compare", "money", "clock", "formes", "solides", "traceNum"]],
  ["mus", "Musique", "🎵", "#a855f7", "#f43f5e", ["pitch", "rhythm", "instr", "keys", "figures", "traceMus"]],
  ["dec", "Autre", "🌍", "#16a34a", "#f59e0b", ["vivant", "habitat", "meteo", "saisons", "avant", "couleurs", "emotions"], { noMix: true }]
];
const DAILY_MIX = { fr: 4, math: 4, mus: 2, dec: 1 }, NO_MIX = ["trace", "traceNum", "traceMus", "sonsref"], MIX_WEIGHT = { word: 3, read: 3 };
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
const PRAISE = ["Bravo!", "Wow!", "Super!", "Génial!", "Trop fort!", "Yé!", "Championne!", "Parfait!", "Incroyable!", "Excellent!", "Bien joué!", "Fantastique!", "Hourra!", "Tu es une vedette!", "Les abonnés adorent!"];
const PRAISE_BY = {
  word: ["Bien écrit!", "Toutes les lettres sont là!", "Quelle belle orthographe!"], read: ["Bien lu!", "Tu lis comme une grande!", "Super lecture!"],
  sound: ["Tu as l'oreille fine!", "Bien entendu!"], syllab: ["Bien compté!", "Bon rythme!"], phrase: ["Belle phrase!", "Tout est dans le bon ordre!"],
  trace: ["Beau tracé!", "Quelle belle écriture!"], number: ["Bon nombre!", "Bien écouté!"], calc: ["Bon calcul!", "Tu comptes vite!"],
  compare: ["Le crocodile est content!", "Miam! Bon choix!"], money: ["Bien compté!", "Tu connais tes sous!"], clock: ["Tu sais lire l'heure!", "Bonne heure!"],
  keys: ["Bonne note!", "Belle oreille de pianiste!"], figures: ["Tu connais tes notes!", "Bien trouvé!"], music: ["Belle oreille!", "Quelle musicienne!"], quiz: ["Bien trouvé!", "Tu as tout compris!"]
};
const PRAISE_RETRY = ["Tu as persévéré!", "Bien essayé, c'est ça!", "Tu ne lâches pas, bravo!"], PRAISE_ROW = { 3: "Trois de suite!", 5: "Cinq de suite! Wow!", 8: "Huit de suite! Incroyable!" };
const recentPraise = [];
function freshPick(list) { const pool = list.filter(x => !recentPraise.includes(x)), p = pick(pool.length ? pool : list); recentPraise.push(p); if (recentPraise.length > 6) recentPraise.shift(); return p; }
function praiseFor(it) {
  if (session.attempt > 0) return freshPick(PRAISE_RETRY);
  if (PRAISE_ROW[session.row]) return PRAISE_ROW[session.row];
  return freshPick(PRAISE_BY[it.kind] && Math.random() < 0.5 ? PRAISE_BY[it.kind] : PRAISE);
}
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
  for (const k of ["read", "sound", "phrase", "money", "keys", "cmp", "clock", "music", "streak", "mixCount", "cabin"]) out[k] = Object.assign({}, DEFAULTS[k], s[k] || {});
  for (const k in DEFAULTS.mathStats) out.mathStats[k] = out.mathStats[k] || { ok: 0, ko: 0 };
  if (s.voiceURI && !s.voice) out.voice = "system:" + s.voiceURI;
  if (s.palier && (s.boost || 0) < 2) out.clock = { level: 1 };
  if (s.palier && (s.boost || 0) < 3) out.math.numMax = 199;
  if (s.palier && (s.boost || 0) < 4) out.keys = { level: 3 };
  if (s.palier && (s.boost || 0) < 5) { out.boost = 5; out.money = { level: 1 }; }
  out.days = (s.days || []).slice();
  out.cabin = { items: [...(out.cabin.items || [])], visitors: [...(out.cabin.visitors || [])], pending: out.cabin.pending || 0 };
  if (!s.days && s.streak && s.streak.last) { const [y, m, d] = s.streak.last.split("-").map(Number); out.days = Array.from({ length: s.streak.n || 1 }, (_, k) => dayStr(new Date(y, m - 1, d - k))); }
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
let actx = null; const BUFFERS = new Map(), AUDIO_KEEP = 60;
function remember(map, key, val) { map.delete(key); map.set(key, val); while (map.size > AUDIO_KEEP) map.delete(map.keys().next().value); return val; }
function unlockAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state !== "running") actx.resume(); } catch {} }
document.addEventListener("pointerdown", unlockAudio, { passive: true });
async function getBuffer(url) {
  if (BUFFERS.has(url)) return remember(BUFFERS, url, BUFFERS.get(url));
  const buf = await actx.decodeAudioData(await fetch(url).then(r => r.arrayBuffer()));
  return remember(BUFFERS, url, buf);
}
const STRETCHED = new Map();
function stretch(buf, f, key) {
  if (STRETCHED.has(key)) return remember(STRETCHED, key, STRETCHED.get(key));
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
  return remember(STRETCHED, key, out);
}
function playClip(url, rate, robot) { return new Promise(async res => {
  try {
    unlockAudio(); if (!actx) return playClipFallback(url, rate).then(res);
    let buf = await getBuffer(url);
    if (rate !== 1) buf = stretch(buf, rate, url + "@" + rate);
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
function chatter(kind, parts) { if (!S.mute[kind]) say(parts); }
function numberParts(n) {
  n = +n; if (n <= 100) return [String(n)];
  const t = Math.floor(n / 1000), h = Math.floor(n % 1000 / 100), r = n % 100;
  return [THOUSANDS[t], HUNDREDS[h], r ? String(r) : ""].filter(Boolean);
}
function timeParts(h, m) { return ["Il est", HOURS[h], ...(m ? numberParts(m) : [])]; }
const cap = t => t[0].toUpperCase() + t.slice(1);
/* Graphèmes et un mot exemple du même son (avec clip de voix) pour expliquer une erreur de dictée et pour la page Les sons */
const GRAPHS = [["eau", "bateau", "gâteau"], ["ain", "pain", "main"], ["ein", "peinture", "ceinture"], ["oin", "pingouin", "foin"], ["ill", "abeille", "feuille"], ["ou", "loup", "hibou"], ["on", "ballon", "mouton"], ["om", "nom", "pompier"],
  ["an", "maman", "éléphant"], ["am", "chambre", "lampe"], ["en", "dent", "serpent"], ["em", "temps", "tempête"], ["in", "lapin", "sapin"], ["un", "lundi", "brun"], ["oi", "roi", "poisson"], ["eu", "feu", "jeu"], ["au", "auto", "chaud"],
  ["ai", "maison", "fraise"], ["ei", "neige", "baleine"], ["er", "chanter", "manger"], ["ez", "nez", "chez"], ["ch", "chat", "cheval"], ["gn", "montagne", "champignon"], ["ph", "éléphant", "phoque"], ["qu", "requin", "quatre"], ["gu", "guitare", "bague"]];
const SOUND_GROUPS = [["o", ["eau", "au"]], ["an", ["an", "am", "en", "em"]], ["in", ["in", "ain", "ein"]], ["on", ["on", "om"]], ["è", ["ai", "ei"]], ["é", ["er", "ez"]], ["ou", ["ou"]], ["oi", ["oi"]], ["eu", ["eu"]],
  ["oin", ["oin"]], ["un", ["un"]], ["ill", ["ill"]], ["ch", ["ch"]], ["gn", ["gn"]], ["f", ["ph"]], ["k", ["qu"]], ["g", ["gu"]]];
const EMOJI_EXTRA = { chaud: "☀️", maman: "👩", chambre: "🛏️", lampe: "💡", temps: "⏰", "tempête": "⛈️", peinture: "🎨", ceinture: "🥋", nom: "📛", pompier: "👨‍🚒", chanter: "🎤", manger: "🍽️", chez: "🏡", foin: "🌾", lundi: "📅", brun: "🟤", phoque: "🦭", quatre: "4️⃣", bague: "💍" };
function emojiOf(w) { const x = READ_WORDS.concat(SOUND_WORDS, SYL_WORDS).find(o => o.mot === w); return x ? x.emoji : EMOJI_EXTRA[w] || ""; }
function soundsScreen() {
  stopAudio();
  const hl = (w, g) => { const p = w.indexOf(g); return p < 0 ? esc(w) : `${esc(w.slice(0, p))}<b>${esc(g)}</b>${esc(w.slice(p + g.length))}`; };
  view(`${topbar()}<div class="section"><h1>🔤 Les sons</h1><p class="tagline">Touche un mot pour l'entendre.</p>
    <div class="sounds">${SOUND_GROUPS.map(([, gs]) => `<div class="sgroup"><div class="sg">${gs.join(" · ")}</div><div class="sex">${gs.map(g => GRAPHS.find(x => x[0] === g).slice(1).map(w => `<button class="sw" data-w="${esc(w)}" data-g="${g}"><span>${emojiOf(w)}</span><span class="swt">${hl(w, g)}</span></button>`).join("")).join("")}</div></div>`).join("")}</div></div>`);
  $("#back").onclick = home;
  app.querySelectorAll(".sw").forEach(b => b.onclick = () => say([b.dataset.w, { pause: 300 }, ...spellParts(b.dataset.g)]));
  say(["Voici les lettres qui font un son ensemble. Touche un mot pour l'entendre."]);
}
const VOWELS = "aeiouyéèêëàâîïôûùœ", NASALS = ["an", "am", "en", "em", "in", "im", "on", "om", "un", "ain", "ein", "oin"];
function graphHere(t, p, g) {
  const nx = t[p + g.length] || "";
  if (NASALS.includes(g)) return !nx || !(VOWELS.includes(nx) || nx === "n" || nx === "m");
  if (g === "er" || g === "ez") return p + g.length === t.length && t.length > 3;
  return true;
}
function explainWord(t, a) {
  t = norm(t); a = norm(a); let i = 0; while (i < t.length && t[i] === a[i]) i++;
  if (i >= t.length) return null;
  if (a.length === t.length - 1 && t.slice(0, i) + t.slice(i + 1) === a && (t[i] === t[i - 1] || t[i] === t[i + 1])) return { shown: `Il y a deux <b>${t[i]}</b>.`, spoken: ["Il y a deux", t[i]] };
  if (a.length === t.length + 1 && a.slice(0, i) + a.slice(i + 1) === t && (a[i] === a[i - 1] || a[i] === a[i + 1])) return { shown: `Il y a un seul <b>${a[i]}</b>.`, spoken: ["Il y a un seul", a[i]] };
  for (const [g, ex1, ex2] of GRAPHS) for (let p = t.indexOf(g); p >= 0; p = t.indexOf(g, p + 1))
    if (p <= i && i < p + g.length && graphHere(t, p, g)) { const ex = ex1 !== t ? ex1 : ex2; return { shown: `Ici, c'est le son de <b>${esc(ex)}</b>, qui s'écrit <b>${esc(g)}</b>.`, spoken: ["Ici, c'est le son de", ex, "qui s'écrit", ...spellParts(g)] }; }
  if (i === t.length - 1 && /[tdsxpzg]/.test(t[i]) && t.length > 2) return { shown: `La lettre <b>${t[i]}</b> à la fin ne s'entend pas.`, spoken: ["La dernière lettre", t[i], "ne s'entend pas."] };
  if (/[éèêàâùûîôë]/.test(t[i])) return { shown: `Attention à l'accent : <b>${t[i]}</b>.`, spoken: ["Attention à l'accent!"] };
  return null;
}
const figOf = id => FIGURES.find(x => x[0] === id), insOf = id => INSTRUMENTS.find(x => x[0] === id);
const tempsLine = (fig, n) => `${cap(fig[1])} vaut ${TEMPS[n]}.`;
function padBad(t) { const n = $("#num"); if (n) { n.textContent = t; n.className = "bad"; } }
/* Une entrée par type de question : prompt = ce qui est dit pour poser la question ; once = dit seulement la première
   fois dans une partie ; silent = jamais dit d'office (Lire) ; praise = ajouté au bravo ; reveal = réponse affichée et
   dite après une erreur ; speakReveal = dite même quand les commentaires sont coupés. */
const GAMES = {
  word: { prompt: it => [it.mot], speakReveal: true,
    reveal: (it, t, a) => { const ex = explainWord(t, a); return { shown: Array.from(t).map((ch, i) => (norm(a)[i] === ch ? esc(ch) : `<span class="diff">${esc(ch)}</span>`)).join("") + (ex ? `<div class="explain">${ex.shown}</div>` : ""), spoken: ["Le mot est", t, { pause: 300 }, ...spellParts(t), ...(ex ? [{ pause: 400 }, ...ex.spoken] : [])] }; } },
  read: { prompt: it => [it.sentence ? "Lis la phrase, puis touche la bonne image." : CONSIGNE.read], silent: true, speakReveal: true, praise: it => [it.mot], reveal: it => ({ shown: `${it.emoji} ${esc(it.mot)}`, spoken: [it.mot] }) },
  syllab: { prompt: it => [it.mot], speakReveal: true, praise: it => [it.mot], reveal: it => ({ shown: it.syl.join(" · "), spoken: [it.mot] }) },
  sound: { prompt: it => [it.sub === "rime" ? "Quel mot rime avec" : "Quel mot commence comme", it.target.mot, { pause: 400 }, it.choices[0].mot, it.choices[1].mot, "ou", it.choices[2].mot], speakReveal: true, praise: it => [it.target.mot, it.answer],
    reveal: (it, t) => { const a = it.choices.find(c => c.mot === t); return { shown: `${it.target.emoji} ${esc(it.target.mot)} · ${a.emoji} ${esc(a.mot)}`, spoken: [it.target.mot, { pause: 250 }, a.mot] }; } },
  phrase: { prompt: () => ["Remets les mots dans l'ordre pour faire une phrase."], once: true, speakReveal: true, praise: it => [it.phrase], reveal: it => ({ shown: esc(it.phrase), spoken: [it.phrase] }) },
  trace: { prompt: it => it.fig || it.word ? [it.ch] : it.num ? numberParts(it.ch) : [it.ch.toLowerCase(), ...(it.ch !== it.ch.toLowerCase() ? ["majuscule"] : [])] },
  number: { prompt: it => numberParts(it.n), reveal: (it, t) => (padBad(t), { shown: t, spoken: ["Le nombre est", ...numberParts(t)] }) },
  calc: { prompt: it => [...numberParts(it.a), it.op === "+" ? "plus" : "moins", ...numberParts(it.b)],
    reveal: (it, t) => (padBad(t), { shown: `${it.a} ${it.op} ${it.b} = ${t}`, spoken: [...GAMES.calc.prompt(it), "ça fait", ...numberParts(t)] }) },
  compare: { prompt: () => ["Le crocodile mange toujours le plus grand nombre. Choisis la bonne bouche."], once: true, speakReveal: true, praise: it => cmpSentence(it),
    reveal: (it, t) => { $("#cslot").innerHTML = crocSvg(t); return { shown: `${it.a} ${{ gt: "&gt;", lt: "&lt;", eq: "=" }[t]} ${it.b}`, spoken: cmpSentence(it) }; } },
  money: { prompt: it => it.sub === "find" ? ["Touche la pièce de", ...coinWords(it.value)] : it.sub === "count" ? ["Compte l'argent. Combien ça fait?"] : ["Compte l'argent et écris combien ça fait."], once: it => it.sub !== "find",
    reveal: (it, t) => it.sub === "find" ? { shown: `${coinSvg(+t)} ${coinLabel(+t)}`, spoken: coinWords(+t) } : (padBad(t), { shown: `${t} ${it.unit}`, spoken: ["ça fait", ...numberParts(t), it.unit === "¢" ? "sous" : +t > 1 ? "dollars" : "dollar"] }) },
  clock: { prompt: () => ["Quelle heure est-il?"], once: true, praise: it => timeParts(it.h, it.m), reveal: (it, t) => ({ shown: t, spoken: timeParts(it.h, it.m) }) },
  keys: { prompt: it => [`Trouve le ${NOTES[it.note]} sur le clavier.`],
    reveal: it => { app.querySelectorAll(`.kbd .wk[data-n="${it.note}"]`).forEach(r => r.classList.add("ok")); return { shown: NOTES[it.note].toUpperCase(), spoken: [] }; } },
  figures: { prompt: it => it.sub === "temps" ? [`Combien de temps vaut ${it.fig[1]}?`] : [figOf(it.answer)[2]], praise: it => [it.sub === "temps" ? tempsLine(it.fig, it.answer) : figOf(it.answer)[1]],
    reveal: (it, t) => { if (it.sub === "temps") return { shown: `${it.fig[1]} = ${t} temps`, spoken: [tempsLine(it.fig, t)] }; const f = figOf(t); return { shown: `<img class="figans" src="img/music/${f[0]}.svg" alt=""> ${f[1]}`, spoken: ["C'est", f[1]] }; } },
  quiz: { prompt: it => it.prompt, speakReveal: true, praise: it => it.say, reveal: it => ({ shown: it.shown, spoken: it.say }) },
  music: { prompt: it => it.sub === "pitch" ? [it.ask === "aigu" ? "Touche le son le plus aigu." : "Touche le son le plus grave."] : it.sub === "rhythm" ? ["Écoute le rythme, puis tape-le sur le tambour."] : ["Quel instrument joue?"],
    praise: it => it.sub === "instr" ? ["C'est", insOf(it.ins)[1]] : [],
    reveal: (it, t) => it.sub === "pitch" ? { shown: `🔔 ${+t + 1}`, spoken: [it.ask === "aigu" ? "Le son le plus aigu, c'est le" : "Le son le plus grave, c'est le", +t ? "deuxième" : "premier"] }
      : it.sub === "rhythm" ? { shown: it.pattern.join(" "), spoken: ["Écoute encore."] } : (ins => ({ shown: `${ins[2]} ${ins[1]}`, spoken: ["C'est", ins[1]] }))(insOf(it.ins)) }
};
function promptParts(it) { return GAMES[it.kind].prompt(it); }
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
function unlockedWords() { return POOL.filter(w => w.palier <= S.palier); }
function weeklyWords() { return S.weekly.map(m => ({ kind: "word", key: m, mot: m, level: 0, source: "weekly" })); }
function prog(key) { return S.progress[key] || (S.progress[key] = { box: 0, last: -99, ok: 0, ko: 0 }); }
function isDue(key, s) { const p = S.progress[key]; if (!p) return true; return s - p.last >= BOX_GAP[p.box]; }

function buildWordSession(mix) {
  if (!mix) S.sessions += 1;
  const s = S.sessions;
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
  return mix ? chosen : shuffle(chosen);
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
const TRACE_FIGS = [["ronde", "la ronde"], ["blanche", "la blanche"], ["noire", "la noire"], ["croche", "la croche"], ["croches", "les deux croches"]];
function buildTraceMusSession() {
  const out = []; let bag = [];
  for (let i = 0; i < S.trace.length; i++) { if (!bag.length) bag = shuffle(TRACE_FIGS); const [fig, name] = bag.pop(); out.push({ kind: "trace", ch: name, fig, isDigit: false, answer: "ok" }); }
  return out;
}
function drawFig(g, fig, w, h, color, extra) {
  const bw = fig === "croches" ? 170 : 100, bh = 160, sc = Math.min(h * 0.8 / bh, w * 0.86 / bw), ex = (extra || 0) / sc;
  g.save(); g.translate(w / 2 - bw * sc / 2, h / 2 - bh * sc / 2); g.scale(sc, sc);
  g.fillStyle = g.strokeStyle = color; g.lineCap = g.lineJoin = "round";
  const head = (cx, cy, filled, big) => {
    g.beginPath(); g.ellipse(cx, cy, big ? 30 : 24, big ? 20 : 17, big ? 0 : -0.35, 0, Math.PI * 2);
    if (filled) { g.fill(); if (ex) { g.lineWidth = ex; g.stroke(); } } else { g.lineWidth = (big ? 10 : 8) + ex; g.stroke(); }
  };
  const line = (x1, y1, x2, y2, lw) => { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineWidth = lw + ex; g.stroke(); };
  if (fig === "ronde") head(50, 80, false, true);
  else if (fig === "croches") { head(40, 135, true); head(122, 135, true); line(62, 129, 62, 22, 7); line(144, 129, 144, 22, 7); line(62, 24, 144, 24, 16); }
  else {
    head(40, 135, fig !== "blanche"); line(62, 129, 62, 15, 7);
    if (fig === "croche") { g.beginPath(); g.moveTo(62, 15); g.bezierCurveTo(70, 50, 100, 55, 88, 100); g.lineWidth = 7 + ex; g.stroke(); }
  }
  g.restore();
  return { px: h, x: 0, y: 0 };
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
const READ_SENTENCES = [["Le chat dort.", "🐱💤"], ["Le chat boit du lait.", "🐱🥛"], ["Le chien court vite.", "🐶💨"], ["Le chien joue au ballon.", "🐶⚽"], ["Maman lit un livre.", "👩📖"], ["Papa mange une pomme.", "👨🍎"],
  ["Le soleil est jaune.", "☀️"], ["La lune brille la nuit.", "🌙"], ["Le lapin mange une carotte.", "🐰🥕"], ["Il pleut beaucoup.", "🌧️"], ["Le bébé dort.", "👶💤"], ["Le poisson nage dans l'eau.", "🐟💧"],
  ["La fille porte une robe rouge.", "👧👗"], ["J'aime le chocolat.", "🍫"], ["Le train roule vite.", "🚂"], ["Il fait froid en hiver.", "❄️🧣"], ["Le zombie danse à l'école.", "🧟🕺"], ["La sirène nage dans la mer.", "🧜‍♀️🌊"],
  ["L'oiseau chante dans l'arbre.", "🐦🌳"], ["Je mange du pain.", "🍞"], ["La neige est blanche.", "⛄"]];
function buildReadSession(mode) {
  const lvl = S.read.level, n = S.sessionLength;
  if (mode === "phrases") return shuffle(READ_SENTENCES).slice(0, n).map(([p, e]) => {
    const others = shuffle(READ_SENTENCES.filter(x => x[0] !== p)).slice(0, 2);
    return { kind: "read", sentence: true, mot: p, emoji: e, choices: shuffle([[p, e], ...others]).map(([m, em]) => ({ mot: m, emoji: em })), answer: p };
  });
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
    return { kind: "phrase", phrase: p, words, answer: words.join(" ") };
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
function coinWords(v) { return v < 100 ? [...numberParts(v), "sous"] : [String(v / 100), v > 100 ? "dollars" : "dollar"]; }
function coinLabel(v) { return v < 100 ? `${v} ¢` : `${v / 100} $`; }
function moneyChoices(total, step) {
  const opts = new Set([total]);
  for (const d of shuffle([-2, -1, 1, 2])) { if (opts.size >= 3) break; const v = total + d * step; if (v > 0) opts.add(v); }
  return shuffle([...opts]);
}
function buildMoneySession() {
  const lvl = S.money.level, items = [];
  for (let i = 0; i < S.math.length; i++) {
    if (lvl === 1) {
      const v = pick([5, 10, 25, 100, 200]), others = shuffle([5, 10, 25, 100, 200].filter(x => x !== v)).slice(0, 2);
      items.push({ kind: "money", sub: "find", value: v, choices: shuffle([v, ...others]), answer: String(v) });
      continue;
    }
    let coins = [];
    if (lvl === 2) { const c = pick([5, 10]); coins = Array(rand(2, 4)).fill(c); }
    else if (lvl === 3) { const n = rand(2, 3); while (coins.length < n) coins.push(pick([5, 10])); }
    else { const set = lvl === 4 ? [5, 10, 25] : [100, 200], cap = lvl === 4 ? 100 : 1000, n = rand(2, 4); while (coins.length < n) { const c = pick(set); if (coins.reduce((a, b) => a + b, 0) + c <= cap) coins.push(c); else break; } if (coins.length < 2) coins = [set[0], set[1]]; }
    coins.sort((a, b) => b - a);
    const total = coins.reduce((a, b) => a + b, 0), unit = lvl === 5 ? "$" : "¢", ans = unit === "$" ? total / 100 : total;
    items.push({ kind: "money", sub: lvl <= 3 ? "count" : "pad", coins, unit, choices: lvl <= 3 ? moneyChoices(ans, lvl === 2 ? coins[0] : 5) : null, answer: String(ans) });
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
/* ---------- découverte (sciences, univers social, arts, citoyenneté) ---------- */
const VIVANT = [["🐱", "le chat", 1], ["🌳", "l'arbre", 1], ["🌸", "la fleur", 1], ["🐟", "le poisson", 1], ["🍄", "le champignon", 1], ["👶", "le bébé", 1], ["🦋", "le papillon", 1], ["🐦", "l'oiseau", 1], ["🌵", "le cactus", 1], ["🐸", "la grenouille", 1],
  ["🪨", "la roche", 0], ["🚗", "l'auto", 0], ["🎈", "le ballon", 0], ["🪑", "la chaise", 0], ["🤖", "le robot", 0], ["✏️", "le crayon", 0], ["☁️", "le nuage", 0], ["🏠", "la maison", 0], ["🧸", "le toutou", 0], ["⚽", "le ballon de soccer", 0]];
const HABITATS = { mer: ["🌊", "dans la mer"], foret: ["🌲", "dans la forêt"], ferme: ["🚜", "à la ferme"], banquise: ["🧊", "sur la banquise"], maison: ["🏠", "dans la maison"] };
const ANIMAUX = [["🐋", "la baleine", "mer"], ["🐬", "le dauphin", "mer"], ["🐙", "la pieuvre", "mer"], ["🦈", "le requin", "mer"], ["🐻", "l'ours", "foret"], ["🦊", "le renard", "foret"], ["🦉", "le hibou", "foret"], ["🦌", "le chevreuil", "foret"],
  ["🐄", "la vache", "ferme"], ["🐷", "le cochon", "ferme"], ["🐔", "la poule", "ferme"], ["🐑", "le mouton", "ferme"], ["🐧", "le pingouin", "banquise"], ["🐻‍❄️", "l'ours polaire", "banquise"], ["🦭", "le phoque", "banquise"], ["🐶", "le chien", "maison"], ["🐹", "le hamster", "maison"]];
const METEO = [["☀️", "Il fait chaud et il fait soleil.", [["🩳", "un short"], ["👒", "un chapeau de soleil"], ["🕶️", "des lunettes de soleil"]]],
  ["❄️", "Il neige et il fait très froid.", [["🧤", "des mitaines"], ["🧣", "un foulard"], ["🥾", "des bottes d'hiver"]]],
  ["🌧️", "Il pleut beaucoup.", [["☂️", "un parapluie"], ["👢", "des bottes de pluie"]]]];
const SAISONS = { hiver: ["⛄", "l'hiver"], printemps: ["🌷", "le printemps"], ete: ["🏖️", "l'été"], automne: ["🍂", "l'automne"] };
const SCENES = [["⛄🛷", "hiver"], ["❄️🧤", "hiver"], ["🌷🐣", "printemps"], ["🌱🌧️", "printemps"], ["🏖️🍦", "ete"], ["☀️🩳", "ete"], ["🍂🎃", "automne"], ["🍎🍁", "automne"]];
const AVANT = [["☎️", "le vieux téléphone", "📱", "le cellulaire"], ["🕯️", "la chandelle", "💡", "l'ampoule"], ["🐴", "le cheval", "🚗", "l'auto"], ["✉️", "la lettre", "💬", "le texto"], ["📻", "la radio", "📺", "la télé"], ["🪶", "la plume", "🖊️", "le stylo"]];
const COULEURS = { rouge: "#ef4444", jaune: "#facc15", bleu: "#3b82f6", orange: "#f97316", vert: "#22c55e", violet: "#8b5cf6", blanc: "#ffffff", rose: "#f9a8d4", noir: "#111111", gris: "#9ca3af" };
const MELANGES = [["rouge", "jaune", "orange"], ["bleu", "jaune", "vert"], ["rouge", "bleu", "violet"], ["rouge", "blanc", "rose"], ["noir", "blanc", "gris"]];
const EMOTIONS = { content: ["😄", "content", "On se sent content."], triste: ["😢", "triste", "On se sent triste."], fache: ["😠", "fâché", "On se sent fâché."], peur: ["😨", "peur", "On a peur."], surpris: ["😲", "surpris", "On est surpris."] };
const SITUATIONS = [["C'est ta fête et tu reçois un cadeau.", "content"], ["Tu as réussi ton beau dessin.", "content"], ["Ton ami ne veut plus jouer avec toi.", "triste"], ["Tu as perdu ton toutou.", "triste"],
  ["Ton frère a brisé ton bricolage.", "fache"], ["Quelqu'un prend ta place sans demander.", "fache"], ["Il y a un gros orage pendant la nuit.", "peur"], ["Un gros chien aboie très fort.", "peur"], ["Un clown sort d'une boîte!", "surpris"]];
const blob = c => `<span class="paint" style="background:${COULEURS[c]}"></span>`;
const big = e => `<span class="bigemo">${e}</span>`;
function quiz(sub, o) { return Object.assign({ kind: "quiz", sub }, o); }
const QUIZ = {
  vivant: () => shuffle(VIVANT).map(([e, n, v]) => quiz("vivant", { visual: big(e), text: "Est-ce que c'est vivant?", prompt: ["Est-ce que c'est vivant?"],
    choices: [{ v: "1", html: "🌱<small>Vivant</small>" }, { v: "0", html: "🪨<small>Pas vivant</small>" }], answer: String(v), say: [cap(n), v ? "est vivant." : "n'est pas vivant."], shown: `${e} ${v ? "vivant" : "pas vivant"}` })),
  habitat: () => shuffle(ANIMAUX).map(([e, n, h]) => { const opts = shuffle([h, ...shuffle(Object.keys(HABITATS).filter(x => x !== h)).slice(0, 2)]);
    return quiz("habitat", { visual: big(e), text: "Où vit cet animal?", prompt: ["Où vit cet animal?"], choices: opts.map(x => ({ v: x, html: `${HABITATS[x][0]}<small>${HABITATS[x][1]}</small>` })), answer: h, say: [cap(n), "vit", HABITATS[h][1]], shown: `${e} ${HABITATS[h][0]}` }); }),
  meteo: () => shuffle(METEO.flatMap(([w, phrase, wear]) => wear.map(([e, n]) => ({ w, phrase, e, n })))).map(({ w, phrase, e, n }) => {
    const others = METEO.filter(m => m[0] !== w).map(m => pick(m[2]));
    return quiz("meteo", { visual: big(w), text: phrase, prompt: [phrase, "Qu'est-ce que tu mets?"], choices: shuffle([[e, n], ...others]).map(([ce, cn]) => ({ v: cn, html: `${ce}<small>${cn}</small>` })), answer: n, say: ["Tu mets", n], shown: `${w} → ${e} ${n}` }); }),
  saisons: () => shuffle(SCENES).map(([sc, s]) => quiz("saisons", { visual: big(sc), text: "Quelle saison est-ce?", prompt: ["Quelle saison est-ce?"],
    choices: Object.keys(SAISONS).map(x => ({ v: x, html: `${SAISONS[x][0]}<small>${SAISONS[x][1]}</small>` })), answer: s, say: ["C'est", SAISONS[s][1]], shown: `${SAISONS[s][0]} ${SAISONS[s][1]}` })),
  avant: () => shuffle(AVANT).map(([e1, n1, e2, n2]) => { const old = Math.random() < 0.5, q = old ? "Touche ce qu'on utilisait avant." : "Touche ce qu'on utilise aujourd'hui.";
    return quiz("avant", { visual: "", text: q, prompt: [q], choices: shuffle([{ v: n1, html: `${e1}<small>${n1}</small>` }, { v: n2, html: `${e2}<small>${n2}</small>` }]), answer: old ? n1 : n2, say: [old ? "Avant, on avait" : "Aujourd'hui, on a", old ? n1 : n2], shown: `${old ? e1 : e2} ${old ? n1 : n2}` }); }),
  couleurs: () => shuffle(MELANGES).map(([a, b, r]) => { const opts = shuffle([r, ...shuffle(MELANGES.map(m => m[2]).filter(x => x !== r)).slice(0, 2)]);
    return quiz("couleurs", { visual: `<span class="mixpaint">${blob(a)} + ${blob(b)} = ?</span>`, text: `${cap(a)} et ${b}, ça donne quelle couleur?`, prompt: [`${cap(a)} et ${b}, ça donne quelle couleur?`],
      choices: opts.map(x => ({ v: x, html: `${blob(x)}<small>${x}</small>` })), answer: r, say: [`${cap(a)} et ${b}, ça donne`, r], shown: `${blob(a)} + ${blob(b)} = ${blob(r)} ${r}` }); }),
  emotions: () => shuffle(SITUATIONS).map(([phrase, em]) => { const opts = shuffle([em, ...shuffle(Object.keys(EMOTIONS).filter(x => x !== em)).slice(0, 2)]);
    return quiz("emotions", { visual: "", text: phrase, prompt: [phrase, "Comment tu te sens?"], choices: opts.map(x => ({ v: x, html: `${EMOTIONS[x][0]}<small>${EMOTIONS[x][1]}</small>` })), answer: em, say: [EMOTIONS[em][2]], shown: `${EMOTIONS[em][0]} ${EMOTIONS[em][1]}` }); })
};
/* ---------- géométrie (figures planes et solides du 1er cycle) ---------- */
const GEO_COLORS = ["#f472b6", "#60a5fa", "#4ade80", "#facc15", "#c084fc", "#fb923c"];
const FORMES = [["carre", "le carré"], ["rectangle", "le rectangle"], ["triangle", "le triangle"], ["cercle", "le cercle"], ["losange", "le losange"]];
const SOLIDES = [["cube", "le cube"], ["sphere", "la sphère"], ["cylindre", "le cylindre"], ["cone", "le cône"], ["pyramide", "la pyramide"], ["prisme", "le prisme"]];
function shade(hex, to, k) { const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v + (to - v) * k)); return `rgb(${c.join(",")})`; }
function shapeSvg(id, c) {
  const face = col => `fill="${col}" stroke="#2b1d3d" stroke-width="3.5" stroke-linejoin="round"`, st = face(c), dk = face(shade(c, 0, 0.3)), lt = face(shade(c, 255, 0.4));
  const tall = Math.random() < 0.5, flip = Math.random() < 0.5;
  const d = {
    carre: `<rect x="22" y="22" width="56" height="56" ${st}/>`,
    rectangle: tall ? `<rect x="30" y="10" width="40" height="80" ${st}/>` : `<rect x="10" y="30" width="80" height="40" ${st}/>`,
    triangle: flip ? `<polygon points="14,18 86,18 50,84" ${st}/>` : `<polygon points="50,14 88,84 12,84" ${st}/>`,
    cercle: `<circle cx="50" cy="50" r="37" ${st}/>`,
    losange: `<polygon points="50,8 82,50 50,92 18,50" ${st}/>`,
    cube: `<polygon points="20,38 64,38 64,82 20,82" ${st}/><polygon points="20,38 36,22 80,22 64,38" ${lt}/><polygon points="64,38 80,22 80,66 64,82" ${dk}/>`,
    prisme: `<polygon points="8,46 70,46 70,82 8,82" ${st}/><polygon points="8,46 26,30 88,30 70,46" ${lt}/><polygon points="70,46 88,30 88,66 70,82" ${dk}/>`,
    sphere: `<circle cx="50" cy="50" r="38" ${st}/><ellipse cx="50" cy="52" rx="38" ry="10" fill="none" stroke="#2b1d3d" stroke-width="2" stroke-dasharray="5 4"/><ellipse cx="37" cy="34" rx="9" ry="6" fill="#fff" opacity=".6"/>`,
    cylindre: `<path d="M22 24 v52 a28 10 0 0 0 56 0 v-52" ${st}/><ellipse cx="50" cy="24" rx="28" ry="10" ${lt}/>`,
    cone: `<path d="M50 10 L80 76 a30 10 0 0 1 -60 0 Z" ${st}/><path d="M20 76 a30 10 0 0 0 60 0" fill="none" stroke="#2b1d3d" stroke-width="2" stroke-dasharray="5 4"/>`,
    pyramide: `<polygon points="50,10 18,74 58,86" ${st}/><polygon points="50,10 58,86 86,66" ${dk}/>`
  }[id];
  return `<svg class="geo" viewBox="0 0 100 100">${d}</svg>`;
}
function geoQuiz(sub, list) {
  return shuffle(list).map(([id, name]) => { const opts = shuffle([[id, name], ...shuffle(list.filter(x => x[0] !== id)).slice(0, 2)]), q = `Touche ${name}.`;
    return quiz(sub, { visual: "", text: q, prompt: [q], choices: opts.map(([oid]) => ({ v: oid, html: shapeSvg(oid, pick(GEO_COLORS)) })), answer: id, say: [cap(name)], shown: `${shapeSvg(id, pick(GEO_COLORS))} ${name}` }); });
}
QUIZ.formes = () => geoQuiz("formes", FORMES);
QUIZ.solides = () => geoQuiz("solides", SOLIDES);
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
  const max = S.cmp.max, items = [], num = () => max > 100 ? bigNumber(max) : rand(0, max);
  for (let i = 0; i < S.math.length; i++) {
    let a = num(), b;
    const r = Math.random();
    if (r < 0.2) b = a;
    else if (r < 0.6 && a >= 10) { const p = Math.pow(10, String(a).length - 1); b = Math.floor(a / p) * p + rand(0, p - 1); }
    else b = num();
    if (a === b && r >= 0.2) b = a + rand(1, 9);
    items.push({ kind: "compare", a, b, answer: a > b ? "gt" : a < b ? "lt" : "eq" });
  }
  return items;
}
function crocSvg(v) {
  if (v === "eq") return `<svg class="croc" viewBox="0 0 120 100"><rect class="bar" x="20" y="30" width="80" height="13" rx="6.5"/><rect class="bar" x="20" y="57" width="80" height="13" rx="6.5"/></svg>`;
  const teeth = (x1, y1, x2, y2, dir) => [0.12, 0.27, 0.42, 0.57, 0.72, 0.87].map(t => { const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; return `<path class="tooth" d="M${(x - 3.5).toFixed(1)},${y.toFixed(1)} L${(x + 3.5).toFixed(1)},${(y + (y2 - y1) / 22).toFixed(1)} L${x.toFixed(1)},${(y + dir * 8).toFixed(1)}Z"/>`; }).join("");
  return `<svg class="croc" viewBox="0 0 120 100"><g ${v === "lt" ? 'transform="translate(120,0) scale(-1,1)"' : ""}>
    <path class="mouth" d="M78,50 L12,19 L12,83 L78,54 Z"/><path class="tongue" d="M76,52 C60,46 44,48 38,54 C46,58 62,58 76,53 Z"/>
    <path class="skin" d="M112,46 C116,62 108,78 94,82 L14,95 C7,95 4,86 11,82 L78,55 Z"/>
    <path class="skin" d="M112,48 C114,30 104,20 96,14 C88,8 78,10 72,15 L14,6 C7,6 4,15 11,19 L78,49 Z"/>
    <path class="skin" d="M74,48 L114,42 L114,58 L74,56 Z"/>
    ${teeth(16, 20, 74, 47, 1)}${teeth(16, 82, 74, 57, -1)}
    <circle class="eye" cx="91" cy="19" r="8"/><circle class="pupil" cx="89" cy="19" r="3.5"/>
    <ellipse class="nostril" cx="17" cy="10" rx="2.6" ry="1.8"/><circle class="scale" cx="100" cy="34" r="2"/><circle class="scale" cx="106" cy="40" r="1.6"/><circle class="scale" cx="101" cy="68" r="2"/>
  </g></svg>`;
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
const BUILDERS = { ...Object.fromEntries(Object.keys(QUIZ).map(k => [k, () => QUIZ[k]().slice(0, S.math.length)])), number: buildNumberSession, trace: buildTraceSession, traceNum: buildTraceNumSession, calc: buildCalcSession, read: buildReadSession, sound: buildSoundSession, syllab: buildSyllabSession, phrase: buildPhraseSession, money: buildMoneySession, keys: buildKeysSession, figures: buildFiguresSession, traceMus: buildTraceMusSession, compare: buildCompareSession, clock: buildClockSession, pitch: () => buildMusicSession("pitch"), rhythm: () => buildMusicSession("rhythm"), instr: () => buildMusicSession("instr") };
function gameItems(id, opt) {
  if (id === "word") return POOL.length || S.weekly.length ? buildWordSession() : [];
  if (id === "read") return buildReadSession(opt);
  return BUILDERS[id]();
}
function allocate(cat, n) {
  const games = CATS.find(c => c[0] === cat)[5].filter(g => !NO_MIX.includes(g)), w = g => MIX_WEIGHT[g] || 1, tot = games.reduce((a, g) => a + w(g), 0);
  const share = {}; let left = n;
  for (const g of games) { share[g] = Math.floor(n * w(g) / tot); left -= share[g]; }
  const seen = g => (S.mixCount[g] || 0) / w(g);
  const order = shuffle(games).sort((a, b) => (share[a] ? 1 : 0) - (share[b] ? 1 : 0) || seen(a) - seen(b));
  for (let k = 0; left > 0; k++, left--) share[order[k % order.length]]++;
  for (const g of games) S.mixCount[g] = (S.mixCount[g] || 0) + share[g];
  return share;
}
function mixItems(plan) {
  const out = [];
  for (const [cat, n] of plan) {
    const share = allocate(cat, n);
    for (const g in share) if (share[g]) out.push(...(g === "word" ? buildWordSession(true) : shuffle(gameItems(g))).slice(0, share[g]));
  }
  let mixed = shuffle(out);
  for (let k = 1; k < mixed.length; k++) if (mixed[k].kind === mixed[k - 1].kind) { const j = mixed.findIndex((x, q) => q > k && x.kind !== mixed[k].kind); if (j > 0) [mixed[k], mixed[j]] = [mixed[j], mixed[k]]; }
  return mixed;
}

/* ---------- moteur de session ---------- */
function readChooser() {
  view(`${topbar()}<div class="section"><h1>📖 Lire</h1><p class="tagline">Veux-tu lire des mots ou des phrases?</p>
    <div class="choices two readpick"><button class="choice" data-m="mots">🔤<small>Des mots</small></button><button class="choice" data-m="phrases">📝<small>Des phrases</small></button></div></div>`);
  $("#back").onclick = home;
  app.querySelectorAll("[data-m]").forEach(b => b.onclick = () => startSession("read", b.dataset.m));
  say(["Veux-tu lire des mots ou des phrases?"]);
}
function startSession(kind, opt) {
  stopAudio();
  if (kind === "read" && !opt) return readChooser();
  if (kind === "sonsref") { S.plays.sonsref = (S.plays.sonsref || 0) + 1; save(); return soundsScreen(); }
  let items;
  if (kind === "daily") items = mixItems(Object.entries(DAILY_MIX));
  else if (kind.startsWith("mix:")) items = mixItems([[kind.slice(4), 10]]);
  else items = gameItems(kind, opt);
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
  const g = GAMES[it.kind], once = typeof g.once === "function" ? g.once(it) : g.once;
  const prompt = (it.kind === "calc" && S.mute.calc) || g.silent || (once && !first) ? [] : g.prompt(it);
  const ann = it.kind === "trace" ? (it.fig ? "Voici la note :" : it.num ? "Voici le nombre :" : it.word ? "Voici le mot en lettres attachées :" : it.cursive ? "Voici la lettre attachée :" : it.isDigit ? "Voici le chiffre :" : "Voici la lettre :") : ANNONCE[it.kind];
  const consigne = it.kind === "trace" && it.fig ? "Trace la note avec ton doigt. Quand la tête est pleine, remplis-la." : it.kind === "trace" && it.cursive ? "Trace en lettres attachées avec ton doigt." : CONSIGNE[it.kind];
  const intro = first || (it.kind === "trace" && !it.fig && it.cursive !== session.lastCursive);
  const parts = intro && !S.mute[it.kind] && consigne ? [consigne, { pause: 700 }, ...(ann ? [ann, { pause: 350 }] : []), ...prompt] : it.kind === "read" ? (first ? GAMES.read.prompt(it) : []) : prompt;
  session.seen.add(key); session.lastCursive = it.cursive;
  const me = session, idx = session.i;
  setTimeout(() => { if (session === me && session.i === idx && $("#speak")) say(parts).then(() => { if (it.kind === "music" && session === me && session.i === idx && !session.locked && $("#speak")) playMusic(it); }); }, 300);
}
const PAD = `<div class="pad numpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "✓"].map(k => `<button data-k="${k}">${k}</button>`).join("")}</div>`;
const VIEWS = {
  word: () => S.mode === "tiles"
      ? `<div class="slots" id="slots"></div><div class="tiles" id="tiles"></div><div class="actions"><button class="btn ghost small" id="erase">⌫</button></div>`
      : `<input class="typed" id="typed" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" inputmode="text"><div class="actions"><button class="btn mint small" id="check">✓</button></div>`,
  trace: () => `<div class="tracewrap"><canvas id="trace"></canvas></div><div class="actions"><button class="btn ghost small" id="erase">⌫</button><button class="btn ghost small" id="skip">→</button></div>`,
  read: it => `<div class="readword ${it.sentence ? "sentence" : ""}">${esc(it.mot)}</div><div class="choices">${it.choices.map(c => `<button class="choice emo" data-v="${esc(c.mot)}">${c.emoji}</button>`).join("")}</div>`,
  quiz: it => `<div class="cmpq quizq">${esc(it.text)}</div>${it.visual ? `<div class="quizvis">${it.visual}</div>` : ""}<div class="choices ${it.choices.length === 2 ? "two" : it.choices.length === 4 ? "four" : ""} quizc">${it.choices.map(c => `<button class="choice" data-v="${esc(c.v)}">${c.html}</button>`).join("")}</div>`,
  keys: it => `<div class="cmpq">Trouve le <b>${NOTES[it.note].toUpperCase()}</b></div><div class="kbdwrap">${keyboardSvg()}</div>
      <div class="hint" id="hint"><button class="btn ghost small" id="hintBtn">💡 Indice</button><div class="hintbox" id="hintBox" hidden>${hintSvg()}<p>Le <b>DO</b>, c'est la touche blanche juste à <b>gauche</b> du groupe de <b>2 touches noires</b>.</p>${it.note ? `<p>Ensuite, on monte vers la droite : do, ré, mi, fa, sol, la, si.</p>` : ""}</div></div>`,
  figures: it => it.sub === "temps" ? `<div class="cmpq">Combien de temps vaut <b>${it.fig[1]}</b>?</div><div class="figq"><img src="img/music/${it.fig[0]}.svg" alt=""></div><div class="choices">${it.choices.map(n => `<button class="choice txt" data-v="${n}">${n} temps</button>`).join("")}</div>`
    : `<div class="cmpq">Touche <b>${FIGURES.find(x => x[0] === it.answer)[1]}</b></div><div class="choices figs">${it.choices.map(c => `<button class="choice fig" data-v="${c[0]}"><img src="img/music/${c[0]}.svg" alt=""></button>`).join("")}</div>`,
  phrase: () => `<div class="slots phr" id="slots"></div><div class="tiles phr" id="tiles"></div><div class="actions"><button class="btn ghost small" id="erase">⌫</button></div>`,
  money: it => it.sub === "find" ? `<div class="cmpq">Touche la pièce de <b>${coinLabel(it.value)}</b></div><div class="choices coinpick">${it.choices.map(v => `<button class="choice" data-v="${v}">${coinSvg(v)}</button>`).join("")}</div>`
    : it.sub === "count" ? `<div class="coins">${it.coins.map(coinSvg).join("")}</div><div class="cmpq">Combien ça fait?</div><div class="choices">${it.choices.map(v => `<button class="choice txt" data-v="${v}">${v} ${it.unit}</button>`).join("")}</div>`
    : `<div class="coins">${it.coins.map(coinSvg).join("")}</div><div class="calc"><span id="num">?</span> ${it.unit}</div>${PAD}`,
  syllab: it => `<div class="target">${it.emoji}<small>${esc(it.mot)}</small></div><div class="taps" id="taps"></div><button class="drum ready" id="drum">🥁</button>`,
  sound: it => `<div class="cmpq">${it.sub === "rime" ? "Ça rime avec" : "Ça commence comme"}</div><div class="target">${it.target.emoji}<small>${esc(it.target.mot)}</small></div><div class="choices">${it.choices.map(c => `<button class="choice emo" data-v="${esc(c.mot)}">${c.emoji}</button>`).join("")}</div>`,
  compare: it => `<div class="cmprow"><span class="cn">${it.a}</span><span class="cslot" id="cslot">?</span><span class="cn">${it.b}</span></div><div class="choices crocs">${["gt", "eq", "lt"].map(v => `<button class="choice" data-v="${v}">${crocSvg(v)}</button>`).join("")}</div>`,
  clock: it => `<div class="clockwrap">${clockSvg(it.h, it.m, S.clock.level >= 3)}</div><div class="choices">${it.choices.map(c => `<button class="choice txt" data-v="${c}">${c}</button>`).join("")}</div>`,
  music: it => it.sub === "pitch" ? `<div class="cmpq">Le son le plus <b>${it.ask}</b> ${it.ask === "aigu" ? "🐭" : "🐻"}</div><div class="choices two">${[0, 1].map(k => `<button class="choice num note" data-v="${k}">🔔<small>${k + 1}</small></button>`).join("")}</div>`
    : it.sub === "rhythm" ? `<div class="rhythm" id="rhythm">${it.pattern.map((p, k) => `<span data-k="${k}">${p === "ta" ? "♩" : p === "titi" ? "♫" : "𝄽"}<small>${p}</small></span>`).join("")}</div><button class="drum" id="drum">🥁</button>`
    : `<div class="cmpq">Quel instrument joue? 🎶</div><div class="choices ${it.choices.length > 3 ? "four" : ""}">${it.choices.map(([id, name, e]) => `<button class="choice emo" data-v="${id}">${e}<small>${name.replace(/^(le|la) /, "")}</small></button>`).join("")}</div>`,
  calc: it => `<div class="calc"><span class="na">${it.a}</span> ${it.op} <span class="${it.op === "+" ? "nb" : "nx"}">${it.b}</span> = <span id="num">?</span></div><div id="dots">${dots(it)}</div>${PAD}`,
  number: () => `<div class="calc"><span id="num">?</span></div>${PAD}`
};
const SETUPS = { word: it => S.mode === "tiles" ? setupTiles(it) : setupTyped(it), trace: it => setupTrace(it), syllab: it => setupSyllab(it), phrase: it => setupPhrase(it), keys: it => setupKeys(it),
  music: it => it.sub === "rhythm" ? setupRhythm(it) : setupChoices(it), number: it => setupPad(it), calc: it => setupPad(it), money: it => it.sub === "pad" ? setupPad(it) : setupChoices(it) };
function renderItem(it) {
  session.locked = false;
  const segs = session.items.map((_, k) => `<i class="${k < session.i ? "done" : k === session.i ? "cur" : ""}"></i>`).join("");
  const body = VIEWS[it.kind](it);
  view(`${topbar()}
    <div class="progress">${segs}</div>
    <div class="stage"><div class="speakrow"><button class="mute ${S.mute[it.kind] ? "on" : ""}" id="mute">${S.mute[it.kind] ? "🔇" : "🗣️"}</button><button class="speak" id="speak">🔊</button>${it.kind === "calc" ? `<button class="mute eye ${S.math.visual ? "" : "on"}" id="eye">${S.math.visual ? "👀" : "🙈"}</button>` : `<span class="mute-spacer"></span>`}</div>
    ${body}
    <div class="feedback" id="fb"></div></div>`);
  $("#back").onclick = home;
  $("#speak").onclick = () => replay(it);
  if ($("#eye")) $("#eye").onclick = () => { S.math.visual = !S.math.visual; save(); $("#eye").textContent = S.math.visual ? "👀" : "🙈"; $("#eye").classList.toggle("on", !S.math.visual); $("#dots").innerHTML = dots(it); };
  $("#mute").onclick = () => { S.mute[it.kind] = !S.mute[it.kind]; save(); const on = S.mute[it.kind]; $("#mute").textContent = on ? "🔇" : "🗣️"; $("#mute").classList.toggle("on", on); if (on) stopAudio(); };
  (SETUPS[it.kind] || setupChoices)(it);
}
function thinkFb(cls, text) { const fb = $("#fb"); fb.className = `feedback ${cls} think`; fb.innerHTML = `<span class="zthink">${zombinette("think")}</span><span>${text}</span>`; }
function cmpSentence(it) { return [...numberParts(it.a), { gt: "est plus grand que", lt: "est plus petit que", eq: "est égal à" }[it.answer], ...numberParts(it.b)]; }
/* Indice au 1er essai raté : on retire des mauvais choix pour qu'il en reste 2, et elle réessaie. */
function giveHint(it) {
  const all = [...app.querySelectorAll(".choices .choice")];
  if (all.length < 3) return false;
  const wrong = all.filter(b => b.dataset.v !== it.answer && !b.classList.contains("bad"));
  shuffle(wrong).slice(0, Math.max(0, all.length - 2 - 1)).concat(all.filter(b => b.classList.contains("bad"))).forEach(b => { b.classList.remove("bad"); b.classList.add("gone"); });
  if (it.kind === "compare") $("#cslot").textContent = "?";
  session.attempt = 1; session.locked = false;
  thinkFb("", "Presque! Essaie encore.");
  chatter(it.kind, ["Presque! Essaie encore."]);
  return true;
}
function setupChoices(it) {
  $(".choices").onclick = e => {
    const b = e.target.closest(".choice"); if (!b || session.locked || b.classList.contains("gone")) return;
    if (it.kind === "compare") $("#cslot").innerHTML = crocSvg(b.dataset.v);
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
    unlockAudio();
    if (!actx) { if (it.sub === "rhythm" && alive()) { session.listening = false; session.taps = []; $("#drum").classList.add("ready"); } return; }
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
      thinkFb("", "Presque! Écoute encore.");
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
    const fb = $("#fb"); if (fb.querySelector(".zthink")) { fb.className = "feedback"; fb.textContent = ""; }
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
      thinkFb("", "Presque! Écoute encore.");
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
function setupTileBoard(it, pieces, extra, joiner) {
  const all = pieces.concat(extra);
  let order = shuffle(all.map((_, i) => i));
  if (pieces.length > 1 && order.every((v, i) => all[v] === all[i])) order = order.reverse();
  const slots = $("#slots"), tiles = $("#tiles"), n = pieces.length;
  slots.innerHTML = pieces.map((_, i) => `<div class="slot" data-i="${i}"></div>`).join("");
  tiles.innerHTML = order.map(i => `<button class="tile" data-i="${i}">${esc(all[i])}</button>`).join("");
  let filled = [];
  const redraw = () => {
    slots.querySelectorAll(".slot").forEach((sl, i) => { const f = filled[i]; sl.textContent = f ? f.text : ""; sl.className = "slot" + (f ? " filled" : ""); });
    tiles.querySelectorAll(".tile").forEach(t => t.classList.toggle("used", filled.some(f => f.tile === t.dataset.i)));
  };
  tiles.onclick = e => {
    const t = e.target.closest(".tile"); if (session.locked || !t || t.classList.contains("used") || filled.length >= n) return;
    filled.push({ tile: t.dataset.i, text: t.textContent }); redraw();
    if (filled.length === n) setTimeout(() => check(it, filled.map(f => f.text).join(joiner)), 250);
  };
  slots.onclick = e => { const sl = e.target.closest(".slot"); if (session.locked || !sl || !filled[sl.dataset.i]) return; filled.splice(sl.dataset.i, 1); redraw(); };
  $("#erase").onclick = () => { if (!session.locked) { filled.pop(); redraw(); } };
}
function setupTiles(w) {
  const letters = Array.from(w.mot), decoys = [];
  const src = shuffle(letters.filter(c => /\p{L}/u.test(c)));
  for (let k = 0; decoys.length < (S.decoys || 0) && k < 20; k++) {
    const c = src[k % src.length] || "e", opts = DECOY[c.toLowerCase()] || "aeiou";
    const d = pick(Array.from(opts)); if (!decoys.includes(d)) decoys.push(d);
  }
  setupTileBoard(w, letters, decoys, "");
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
function setupPhrase(it) { setupTileBoard(it, it.words, [], " "); }
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
    if (it.fig) return drawFig(g, it.fig, w, h, color, extra);
    const L = layout(g, w, h); g.fillStyle = g.strokeStyle = color; g.lineJoin = g.lineCap = "round";
    g.fillText(it.ch, L.x, L.y);
    const lw = (it.cursive ? L.px * 0.08 : 0) + (extra || 0);
    if (lw) { g.lineWidth = lw; g.strokeText(it.ch, L.x, L.y); }
    return L;
  };
  const drawGuide = () => {
    ctx.clearRect(0, 0, W, H);
    if (it.cursive) { shape(ctx, W, H, "#e4dbfa"); const L = layout(ctx, W, H); ctx.fillStyle = "#a78bfa"; ctx.fillText(it.ch, L.x, L.y); return; }
    if (it.fig) { drawFig(ctx, it.fig, W, H, "#e4dbfa", 10); drawFig(ctx, it.fig, W, H, "#c4b5fd"); return; }
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
      thinkFb("bad", "Oups! Reste sur le modèle.");
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
  const sk = statKey(it), ms = it.kind === "word" ? null : (S.mathStats[sk] = S.mathStats[sk] || { ok: 0, ko: 0 });
  if (ok) {
    session.row = session.attempt === 0 ? (session.row || 0) + 1 : 0;
    if (session.attempt === 0) { session.good++; S.stars += 1; if (p) { p.box = Math.min(3, p.box + 1); p.ok++; } else ms.ok++; }
    if (p) p.last = session.s;
    save();
    fb.className = "feedback ok"; fb.textContent = praiseFor(it);
    $("#starsN").textContent = `👥 ${S.stars}`;
    confetti(); chatter(it.kind, [fb.textContent, ...(GAMES[it.kind].praise ? GAMES[it.kind].praise(it) : [])]);
    $("#slots") && $("#slots").querySelectorAll(".slot").forEach(s => s.classList.add("ok"));
    $("#num") && ($("#num").className = "ok");
    $("#trace") && $("#trace").classList.add("ok");
    session.i++; setTimeout(nextItem, 1300);
  } else {
    if (p) { p.box = 0; p.ko++; p.last = session.s; } else if (session.attempt === 0) ms.ko++;
    save();
    if (session.attempt === 0 && !it.requeued) session.retry.push(Object.assign({}, it, { requeued: true }));
    session.row = 0;
    if (session.attempt === 0 && giveHint(it)) return;
    session.attempt++;
    thinkFb("bad", "Oups!");
    $("#slots") && $("#slots").querySelectorAll(".slot").forEach(s => s.classList.add("bad"));
    const { shown, spoken } = GAMES[it.kind].reveal ? GAMES[it.kind].reveal(it, target, answer) : { shown: "", spoken: [] };
    app.querySelectorAll(".choice").forEach(c => { if (c.dataset.v === target) c.classList.add("ok"); });
    fb.insertAdjacentHTML("afterend", `<div class="answer">${shown}</div><div class="actions"><button class="btn small" id="again">🔊 ↻</button><button class="btn ghost small" id="skip">→</button></div>`);
    if (GAMES[it.kind].speakReveal) say(spoken); else chatter(it.kind, spoken);
    if (it.kind === "music" && it.sub === "rhythm") setTimeout(() => { if (session.items[session.i] === it && $("#again")) playMusic(it); }, S.mute.music ? 300 : 1300);
    $("#again").onclick = () => { renderItem(it); replay(it); };
    $("#skip").onclick = () => { session.i++; nextItem(); };
  }
}
function maybeLevelUp() {
  if (!session.items.some(x => x.kind === "word") || !S.palierAuto || S.palier >= 10) return false;
  const un = unlockedWords(); if (!un.length) return false;
  const learned = un.filter(w => S.progress[w.key] && S.progress[w.key].box >= 1).length;
  if (learned / un.length >= 0.7) { S.palier += 1; return true; }
  return false;
}
const DAY_STICKERS = { 3: "🔥", 7: "💎", 14: "🏆", 30: "🌟" };
function dayStr(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function dailyState() {
  const t = dayStr(new Date());
  if (!S.daily || S.daily.date !== t) S.daily = { date: t, done: S.days.includes(t) };
  return S.daily;
}
function markDaily(kind) {
  const d = dailyState(); if (kind !== "daily" || d.done) return null;
  d.done = true; S.days.push(d.date);
  let st = null;
  for (const [n, e] of Object.entries(DAY_STICKERS)) if (S.days.length >= +n && !S.stickers[e]) { S.stickers[e] = 1; st = e; }
  return { complete: true, n: S.days.length, sticker: st };
}
function weekHtml() {
  const now = new Date(), monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() + 6) % 7);
  return `<div class="week">${["L", "M", "M", "J", "V", "S", "D"].map((l, k) => { const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + k), ds = dayStr(day), done = S.days.includes(ds);
    return `<span class="${done ? "done" : ""} ${ds === dayStr(now) ? "today" : ""}"><i>${done ? "⭐" : ""}</i><small>${l}</small></span>`; }).join("")}</div>`;
}
function statKey(it) { return it.kind === "quiz" ? it.sub : it.kind; }
function knownWords() { const seen = new Set(); return POOL.concat(weeklyWords()).filter(w => !seen.has(w.key) && seen.add(w.key) && S.progress[w.key] && S.progress[w.key].box >= 2); }
function okTotal(kinds) { return kinds.reduce((t, k) => t + (S.mathStats[k] ? S.mathStats[k].ok : 0), 0); }
function progressNote() {
  if (session.items.some(x => x.kind === "word")) { const n = knownWords().length; if (n) return { html: `📚 Tu connais maintenant <b>${n}</b> mot${n > 1 ? "s" : ""}!`, say: ["Tu connais maintenant", ...numberParts(n), "mots!"] }; }
  const kinds = [...new Set(session.items.filter(x => x.kind !== "word").map(statKey))], n = okTotal(kinds);
  return n ? { html: `⭐ <b>${n}</b> bonne${n > 1 ? "s" : ""} réponse${n > 1 ? "s" : ""} dans ces jeux depuis le début!`, say: ["Tu as maintenant", ...numberParts(n), "bonnes réponses!"] } : null;
}
function endSession() {
  const missing = STICKERS.filter(x => !S.stickers[x]), sticker = missing.length && Math.random() < 0.8 ? pick(missing) : pick(STICKERS);
  S.stickers[sticker] = (S.stickers[sticker] || 0) + 1;
  const daily = markDaily(session.kind);
  if (S.cabin.items.length < ALL_ITEMS().length) S.cabin.pending = Math.min(3, (S.cabin.pending || 0) + 1);
  const up = maybeLevelUp(); save();
  const gained = session.good, note = progressNote();
  view(`${topbar()}
    <div class="result"><div class="zombres">${zombinette("happy")}</div><h1>Bravo!</h1>
      <div class="score">+${gained} <small>abonné${gained > 1 ? "s" : ""}</small></div>
      ${note ? `<p class="prognote">${note.html}</p>` : ""}
      <p class="tagline">${gained >= session.total / 2 ? `${gained} sur ${session.total}` : "Tu as travaillé fort!"}</p>
      ${up ? `<div class="levelup">📚 Nouveaux mots débloqués!</div>` : ""}
      <div class="toast"><span class="ic">${sticker}</span><div><div class="tt">Nouveau collant</div><div class="tn">${S.stickers[sticker] > 1 ? `Tu l'as ${S.stickers[sticker]} fois!` : "Il est dans ton album!"}</div></div></div>
      ${daily && daily.complete ? `<div class="toast streak"><span class="ic">${daily.sticker || "⭐"}</span><div><div class="tt">Défi du jour réussi!</div><div class="tn">${daily.n} défi${daily.n > 1 ? "s" : ""} en tout${daily.sticker ? " · collant spécial!" : ""}</div></div></div>${weekHtml()}` : ""}
    </div>
    <div class="cabinpick" id="cabinPick"></div>
    <button class="btn pink" id="home">🏠 Accueil</button>
    <button class="btn ghost small" id="album">Voir mes collants</button>`);
  confetti(60);
  chatter(session.kind, ["Bravo! Tu as gagné un nouveau collant!", ...(gained ? [String(gained), gained > 1 ? "nouveaux abonnés" : "nouvel abonné"] : ["Tu as travaillé fort!"]), ...(note ? note.say : []), ...(daily && daily.complete ? ["Défi du jour réussi!"] : []), ...(offerCabin($("#cabinPick"), true) ? [{ pause: 300 }, "Choisis un objet pour la cabane!"] : [])]);
  $("#back").onclick = home; $("#home").onclick = home; $("#album").onclick = album;
}

/* ---------- Zombinette et sa cabane (dessins SVG maison) ---------- */
const OUT = "#2b1d3d";
function zombinette(pose = "idle") {
  const arm = d => `<path d="${d}" class="zarm-o"/><path d="${d}" class="zarm"/>`, pom = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="#f472b6" stroke="${OUT}" stroke-width="3"/>`;
  const arms = pose === "happy" ? arm("M28 76 L12 50") + arm("M72 76 L88 50") + pom(11, 46) + pom(89, 46)
    : pose === "think" ? arm("M28 78 L20 100") + arm("M72 78 L62 62 L56 58")
    : arm("M28 78 L20 100") + arm("M72 76 L86 56") + `<path d="M86 56 l-4 -9 M86 56 l3 -9 M86 56 l8 -5" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`;
  const mouth = pose === "happy" ? `<path d="M41 50 Q50 61 59 50 Z" fill="#7f1d1d" stroke="${OUT}" stroke-width="2.5"/>`
    : pose === "think" ? `<path d="M44 53 Q50 50 57 54" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`
    : `<path d="M42 51 Q50 58 58 51" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`;
  return `<svg class="zomb" viewBox="0 0 100 140">
    <rect x="37" y="104" width="9" height="24" rx="4" fill="#86d49a" stroke="${OUT}" stroke-width="3"/><rect x="54" y="104" width="9" height="24" rx="4" fill="#86d49a" stroke="${OUT}" stroke-width="3"/>
    <path d="M33 130 h15 v-6 h-12 z M52 130 h15 l-3 -6 h-12 z" fill="#7c3aed" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    ${arms}
    <path d="M34 66 L66 66 L76 108 L24 108 Z" fill="#ec4899" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M24 108 L76 108 L72 100 L28 100 Z" fill="#f9a8d4"/><path d="M50 74 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z" fill="#fde047" stroke="${OUT}" stroke-width="1.5"/>
    <circle cx="22" cy="28" r="11" fill="#7c3aed" stroke="${OUT}" stroke-width="3"/><circle cx="78" cy="28" r="11" fill="#7c3aed" stroke="${OUT}" stroke-width="3"/>
    <path d="M14 19 l8 5 -8 5 z M30 19 l-8 5 8 5 z" fill="#f472b6" stroke="${OUT}" stroke-width="1.5"/>
    <circle cx="50" cy="40" r="25" fill="#9ae6a6" stroke="${OUT}" stroke-width="3"/>
    <path d="M25 38 Q27 14 50 14 Q73 14 75 38 Q66 26 52 28 Q44 22 34 30 Q30 33 25 38 Z" fill="#7c3aed" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M60 30 l8 4 M62 28 l-2 6 M66 30 l-2 6" stroke="${OUT}" stroke-width="1.6"/>
    <circle cx="41" cy="42" r="6" fill="#fff" stroke="${OUT}" stroke-width="2"/><circle cx="42" cy="43" r="3" fill="${OUT}"/>
    <circle cx="59" cy="42" r="6" fill="#fff" stroke="${OUT}" stroke-width="2"/><circle cx="58" cy="43" r="3" fill="${OUT}"/>
    <circle cx="35" cy="50" r="3.5" fill="#f9a8d4" opacity=".8"/><circle cx="65" cy="50" r="3.5" fill="#f9a8d4" opacity=".8"/>
    ${mouth}${pose === "think" ? `<text x="78" y="20" font-size="18" font-weight="800" fill="#fde047" stroke="${OUT}" stroke-width="1">?</text>` : ""}
  </svg>`;
}
const S_ = (d, f, extra = "") => `<path d="${d}" fill="${f}" stroke="${OUT}" stroke-width="2.5" stroke-linejoin="round" ${extra}/>`;
const CABIN_ITEMS = [
  ["guirlande", "la guirlande de lumières", `<path d="M20 22 Q110 48 200 22 Q290 48 380 22" fill="none" stroke="${OUT}" stroke-width="2"/>${[40, 80, 120, 160, 240, 280, 320, 360].map((x, k) => `<circle cx="${x}" cy="${33 + (k % 2) * 4}" r="5" fill="${["#fde047", "#f472b6", "#67e8f9", "#a3e635"][k % 4]}" stroke="${OUT}" stroke-width="1.5"/>`).join("")}`],
  ["affiche", "l'affiche de K-pop", `<rect x="30" y="60" width="54" height="72" rx="4" fill="#fdf2f8" stroke="${OUT}" stroke-width="2.5"/><circle cx="57" cy="88" r="14" fill="#c084fc" stroke="${OUT}" stroke-width="2"/><path d="M40 122 h34" stroke="#ec4899" stroke-width="5" stroke-linecap="round"/><path d="M57 70 l3 6 6 1 -4 4 1 6 -6 -3 -6 3 1 -6 -4 -4 6 -1 z" fill="#fde047"/>`],
  ["etagere", "l'étagère de livres", `<rect x="300" y="110" width="80" height="8" fill="#a16207" stroke="${OUT}" stroke-width="2.5"/>${[["#ef4444", 304, 22], ["#3b82f6", 316, 26], ["#22c55e", 328, 20], ["#f59e0b", 340, 24]].map(([c, x, h]) => `<rect x="${x}" y="${110 - h}" width="11" height="${h}" fill="${c}" stroke="${OUT}" stroke-width="2"/>`).join("")}<circle cx="366" cy="100" r="9" fill="#fde047" stroke="${OUT}" stroke-width="2"/>`],
  ["miroir", "le miroir", `<ellipse cx="120" cy="100" rx="18" ry="26" fill="#bae6fd" stroke="#f472b6" stroke-width="6"/><path d="M112 88 l8 -8 M110 98 l14 -14" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`],
  ["chauvesouris", "les chauves-souris", [[150, 70], [180, 58], [212, 72]].map(([x, y]) => `<path d="M${x} ${y} q-8 -10 -18 -4 q6 2 6 8 q4 -4 12 -4 q8 0 12 4 q0 -6 6 -8 q-10 -6 -18 4z" fill="#4c1d95" stroke="${OUT}" stroke-width="1.5"/>`).join("")],
  ["discoball", "la boule disco", `<path d="M200 0 v18" stroke="${OUT}" stroke-width="2"/><circle cx="200" cy="32" r="14" fill="#cbd5e1" stroke="${OUT}" stroke-width="2.5"/><path d="M186 32 h28 M200 18 v28 M190 22 q10 10 0 20 M210 22 q-10 10 0 20" stroke="#94a3b8" stroke-width="1.5" fill="none"/>`],
  ["lunelampe", "la lampe lune", `<path d="M352 150 a14 14 0 1 1 0 -2 a10 10 0 1 0 0 2z" fill="#fde047" stroke="${OUT}" stroke-width="2"/>`],
  ["lit", "le lit", `<rect x="10" y="196" width="110" height="40" rx="8" fill="#c084fc" stroke="${OUT}" stroke-width="2.5"/><rect x="10" y="170" width="16" height="70" rx="4" fill="#7c3aed" stroke="${OUT}" stroke-width="2.5"/><rect x="30" y="186" width="32" height="16" rx="7" fill="#fff" stroke="${OUT}" stroke-width="2"/><path d="M62 196 h58 v40 h-58z" fill="#f9a8d4" stroke="${OUT}" stroke-width="2.5"/>`],
  ["tapis", "le tapis", `<ellipse cx="200" cy="262" rx="80" ry="18" fill="#f472b6" stroke="${OUT}" stroke-width="2.5"/><ellipse cx="200" cy="262" rx="58" ry="11" fill="none" stroke="#fde047" stroke-width="3"/>`],
  ["plante", "la plante", `<path d="M360 290 l-6 -26 h28 l-6 26z" fill="#ea580c" stroke="${OUT}" stroke-width="2.5"/><path d="M368 264 q-18 -20 -6 -40 q10 16 6 40 q4 -26 22 -34 q0 22 -22 34" fill="#22c55e" stroke="${OUT}" stroke-width="2"/>`],
  ["pouf", "le pouf", `<path d="M282 288 q-8 -30 26 -36 q34 6 26 36z" fill="#67e8f9" stroke="${OUT}" stroke-width="2.5"/>`],
  ["ringlight", "la lumière de YouTubeuse", `<g transform="translate(44 0)"><path d="M258 286 l12 -60 l12 60 M270 226 v-12" stroke="${OUT}" stroke-width="3" fill="none"/><circle cx="270" cy="196" r="20" fill="none" stroke="#fef9c3" stroke-width="7"/><circle cx="270" cy="196" r="20" fill="none" stroke="${OUT}" stroke-width="1.5"/></g>`],
  ["camera", "la caméra", `<path d="M132 288 l10 -44 l10 44" stroke="${OUT}" stroke-width="3" fill="none"/><rect x="128" y="226" width="30" height="20" rx="4" fill="#334155" stroke="${OUT}" stroke-width="2.5"/><circle cx="150" cy="236" r="6" fill="#94a3b8" stroke="${OUT}" stroke-width="2"/><circle cx="133" cy="231" r="2.5" fill="#ef4444"/>`],
  ["guitare", "la guitare", `<path d="M96 232 l22 -40" stroke="#a16207" stroke-width="5"/><circle cx="92" cy="248" r="14" fill="#f97316" stroke="${OUT}" stroke-width="2.5"/><circle cx="100" cy="236" r="10" fill="#f97316" stroke="${OUT}" stroke-width="2.5"/><circle cx="94" cy="245" r="4" fill="${OUT}"/>`],
  ["toutou", "le toutou", `<circle cx="72" cy="270" r="14" fill="#d6a46c" stroke="${OUT}" stroke-width="2.5"/><circle cx="72" cy="250" r="11" fill="#d6a46c" stroke="${OUT}" stroke-width="2.5"/><circle cx="63" cy="241" r="4.5" fill="#d6a46c" stroke="${OUT}" stroke-width="2"/><circle cx="81" cy="241" r="4.5" fill="#d6a46c" stroke="${OUT}" stroke-width="2"/><circle cx="68" cy="249" r="1.8" fill="${OUT}"/><circle cx="76" cy="249" r="1.8" fill="${OUT}"/>`],
  ["citrouille", "la citrouille", `<ellipse cx="236" cy="278" rx="16" ry="12" fill="#f97316" stroke="${OUT}" stroke-width="2.5"/><path d="M236 266 v-6" stroke="#15803d" stroke-width="4"/><path d="M229 276 l3 -4 3 4z M239 276 l3 -4 3 4z M230 282 q6 4 12 0" fill="${OUT}" stroke="${OUT}" stroke-width="1.5"/>`],
  ["micro", "le micro", `<path d="M330 290 h20 M340 290 v-50" stroke="${OUT}" stroke-width="3"/><rect x="334" y="222" width="12" height="20" rx="6" fill="#64748b" stroke="${OUT}" stroke-width="2.5"/>`],
  ["trophee", "le trophée étoile", `<path d="M314 100 h20 l-4 -10 h-12z" fill="#fbbf24" stroke="${OUT}" stroke-width="2"/><path d="M324 66 l4 9 10 1 -7 7 2 10 -9 -5 -9 5 2 -10 -7 -7 10 -1z" fill="#fde047" stroke="${OUT}" stroke-width="2"/>`],
  ["arcenciel", "l'affiche arc-en-ciel", `<rect x="96" y="40" width="44" height="34" rx="3" fill="#fff" stroke="${OUT}" stroke-width="2.5"/>${["#ef4444", "#f59e0b", "#22c55e", "#3b82f6"].map((c, k) => `<path d="M${102 + k * 3} 70 a${16 - k * 3} ${16 - k * 3} 0 0 1 ${32 - k * 6} 0" fill="none" stroke="${c}" stroke-width="3"/>`).join("")}`],
  ["lampe", "la lampe", `<g transform="translate(-14 0)"><path d="M30 290 h16 M38 290 v-40" stroke="${OUT}" stroke-width="3"/><path d="M26 252 l6 -20 h12 l6 20z" fill="#fde68a" stroke="${OUT}" stroke-width="2.5"/></g>`]
];
const CABIN_VISITORS = [
  ["chat", "un chat noir", `<path d="M166 286 q-4 -22 14 -26 l-2 -8 6 5 6 -5 -1 8 q16 6 10 26z" fill="#1f2937" stroke="#64748b" stroke-width="2"/><circle cx="180" cy="266" r="1.6" fill="#fde047"/><circle cx="188" cy="266" r="1.6" fill="#fde047"/><path d="M196 284 q14 0 10 -14" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/>`],
  ["fantome", "un petit fantôme", `<path d="M84 150 q0 -28 22 -28 q22 0 22 28 v22 l-6 -6 -5 6 -6 -6 -5 6 -6 -6 -5 6 -5 -6 -6 6z" fill="#f8fafc" stroke="${OUT}" stroke-width="2.5" opacity=".9"/><circle cx="99" cy="146" r="3" fill="${OUT}"/><circle cx="113" cy="146" r="3" fill="${OUT}"/>`],
  ["hibou", "un hibou", `<ellipse cx="280" cy="92" rx="14" ry="17" fill="#a16207" stroke="${OUT}" stroke-width="2.5"/><circle cx="274" cy="88" r="5" fill="#fff" stroke="${OUT}" stroke-width="1.5"/><circle cx="286" cy="88" r="5" fill="#fff" stroke="${OUT}" stroke-width="1.5"/><circle cx="274" cy="88" r="2" fill="${OUT}"/><circle cx="286" cy="88" r="2" fill="${OUT}"/><path d="M278 95 l2 4 2 -4z" fill="#f59e0b"/>`]
];
const STUDIO_ITEMS = [
  ["etoilesmur", "les étoiles au mur", [[40, 30], [120, 24], [300, 36], [350, 70], [70, 96], [250, 22]].map(([x, y]) => `<path d="M${x} ${y - 7} l2 5 6 1 -4 4 1 6 -5 -3 -5 3 1 -6 -4 -4 6 -1z" fill="#fef08a" opacity=".9"/>`).join("")],
  ["banniere", "la bannière Zombinettes", `<path d="M90 44 q110 22 220 0 v26 q-110 22 -220 0z" fill="#ec4899" stroke="${OUT}" stroke-width="2.5"/><text x="200" y="66" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="17" fill="#fff" stroke="${OUT}" stroke-width=".8">ZOMBINETTES</text>`],
  ["neon", "le néon étoile", `<path d="M200 86 l9 18 20 3 -15 14 4 20 -18 -10 -18 10 4 -20 -15 -14 20 -3z" fill="none" stroke="#f0abfc" stroke-width="7" opacity=".5"/><path d="M200 86 l9 18 20 3 -15 14 4 20 -18 -10 -18 10 4 -20 -15 -14 20 -3z" fill="none" stroke="#fff" stroke-width="2.5"/>`],
  ["panneau", "le panneau de lumière", `<path d="M44 290 l0 -110" stroke="${OUT}" stroke-width="3"/><path d="M30 290 l14 -20 14 20" stroke="${OUT}" stroke-width="3" fill="none"/><rect x="18" y="120" width="52" height="64" rx="4" fill="#fef9c3" stroke="${OUT}" stroke-width="3"/><rect x="24" y="126" width="40" height="52" fill="#fffbeb"/>`],
  ["affichezombie", "l'affiche de zombie", `<rect x="326" y="96" width="54" height="66" rx="3" fill="#14532d" stroke="${OUT}" stroke-width="2.5"/><circle cx="353" cy="122" r="13" fill="#86d49a" stroke="${OUT}" stroke-width="2"/><circle cx="348" cy="120" r="2.5" fill="${OUT}"/><circle cx="358" cy="120" r="2.5" fill="${OUT}"/><path d="M346 128 h14" stroke="${OUT}" stroke-width="2"/><path d="M334 152 h38" stroke="#a3e635" stroke-width="5" stroke-linecap="round"/>`],
  ["bureau", "le bureau et l'ordinateur", `<rect x="226" y="208" width="150" height="10" rx="2" fill="#a16207" stroke="${OUT}" stroke-width="2.5"/><path d="M236 218 v70 M366 218 v70" stroke="${OUT}" stroke-width="5"/><rect x="262" y="150" width="80" height="50" rx="5" fill="#1e293b" stroke="${OUT}" stroke-width="3"/><rect x="268" y="156" width="68" height="38" fill="#7dd3fc"/><path d="M296 168 l12 7 -12 7z" fill="#fff"/><path d="M296 200 h12 l4 8 h-20z" fill="#475569" stroke="${OUT}" stroke-width="2"/>`],
  ["clavier", "le clavier lumineux", `<rect x="262" y="200" width="62" height="9" rx="2" fill="#1e293b" stroke="${OUT}" stroke-width="2"/>${["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"].map((c, k) => `<rect x="${265 + k * 10}" y="202" width="7" height="5" fill="${c}"/>`).join("")}`],
  ["casque", "le casque d'écoute", `<path d="M348 206 q0 -26 18 -26 q18 0 18 26" fill="none" stroke="#c026d3" stroke-width="5"/><rect x="342" y="196" width="12" height="14" rx="5" fill="#f0abfc" stroke="${OUT}" stroke-width="2"/><rect x="378" y="196" width="12" height="14" rx="5" fill="#f0abfc" stroke="${OUT}" stroke-width="2"/>`],
  ["lavelampe", "la lampe à lave", `<path d="M236 206 l4 -34 h12 l4 34z" fill="#c084fc" stroke="${OUT}" stroke-width="2"/><circle cx="246" cy="196" r="4" fill="#f472b6"/><circle cx="243" cy="184" r="3" fill="#f472b6"/><path d="M238 172 l2 -6 h12 l2 6z" fill="#475569" stroke="${OUT}" stroke-width="2"/>`],
  ["chaise", "la chaise de gamer", `<rect x="282" y="226" width="44" height="40" rx="10" fill="#ec4899" stroke="${OUT}" stroke-width="2.5"/><rect x="286" y="262" width="36" height="12" rx="4" fill="#be185d" stroke="${OUT}" stroke-width="2.5"/><path d="M304 274 v12 M290 290 h28" stroke="${OUT}" stroke-width="4"/><path d="M296 236 h16" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`],
  ["coussin", "le coussin cœur", `<path transform="translate(262 0)" d="M112 290 q-26 -14 -22 -30 q4 -12 22 -2 q18 -10 22 2 q4 16 -22 30z" fill="#f43f5e" stroke="${OUT}" stroke-width="2.5"/>`],
  ["aquarium", "l'aquarium", `<g transform="translate(-74 0)"><rect x="150" y="248" width="52" height="38" rx="4" fill="#bae6fd" stroke="${OUT}" stroke-width="3" opacity=".95"/><path d="M168 266 q8 -8 16 0 q-8 8 -16 0z M184 266 l6 -5 v10z" fill="#f97316" stroke="${OUT}" stroke-width="1.2"/><path d="M158 286 q4 -14 0 -22 M194 286 q-4 -12 2 -20" stroke="#16a34a" stroke-width="3" fill="none"/></g>`],
  ["ballons", "les ballons", [["#f472b6", 368, 70], ["#a855f7", 384, 92], ["#facc15", 360, 100]].map(([c, x, y]) => `<path d="M${x} ${y + 16} q4 40 -6 80" stroke="${OUT}" stroke-width="1.2" fill="none"/><ellipse cx="${x}" cy="${y}" rx="13" ry="16" fill="${c}" stroke="${OUT}" stroke-width="2"/>`).join("")]
];
const ITEMS = CABIN_ITEMS.map(x => [...x, "chambre"]).concat(STUDIO_ITEMS.map(x => [...x, "studio"]));
const ALL_ITEMS = () => ITEMS, roomOf = id => ITEMS.find(x => x[0] === id)[3];
function studioSvg() {
  const own = S.cabin.items;
  return `<svg class="cabin" viewBox="0 0 400 300">
    <rect width="400" height="210" fill="#15384d"/>${[60, 140, 220, 300, 380].map(x => `<path d="M${x} 0 v210" stroke="#1d4a63" stroke-width="10"/>`).join("")}
    <rect y="210" width="400" height="90" fill="#475569"/><path d="M0 210 h400" stroke="#334155" stroke-width="4"/>
    ${STUDIO_ITEMS.filter(([id]) => own.includes(id)).map(x => x[2]).join("")}
    <g transform="translate(140 150) scale(.95)">${zombinette("idle").replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>
  </svg>`;
}
function cabinSvg(withZomb = true, room = "chambre") {
  if (room === "studio") return studioSvg();
  const own = S.cabin.items, vis = S.cabin.visitors;
  return `<svg class="cabin" viewBox="0 0 400 300">
    <rect width="400" height="210" fill="#3b2a5c"/><path d="M0 0 h400 v210 h-400z" fill="url(#wallp)"/>
    <defs><pattern id="wallp" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="14" cy="14" r="2" fill="#5b4387"/></pattern></defs>
    <rect y="210" width="400" height="90" fill="#7c5a3a"/>${[230, 252, 276].map(y => `<path d="M0 ${y} h400" stroke="#6b4b2e" stroke-width="2"/>`).join("")}
    <rect x="166" y="54" width="70" height="60" rx="6" fill="#1e1b4b" stroke="${OUT}" stroke-width="3"/><path d="M201 54 v60 M166 84 h70" stroke="${OUT}" stroke-width="3"/><circle cx="220" cy="70" r="7" fill="#fde047"/><circle cx="180" cy="100" r="1.5" fill="#fff"/><circle cx="214" cy="104" r="1.2" fill="#fff"/>
    ${CABIN_ITEMS.filter(([id]) => own.includes(id)).map(x => x[2]).join("")}
    ${withZomb ? `<g transform="translate(176 150) scale(.95)">${zombinette("idle").replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>` : ""}
    ${CABIN_VISITORS.filter(([id]) => vis.includes(id)).map(x => x[2]).join("")}
  </svg>`;
}
function itemThumb(id) { return `<svg class="thumbobj" viewBox="0 0 400 300"><g>${ALL_ITEMS().find(x => x[0] === id)[2]}</g></svg>`; }
function fitThumbs() { app.querySelectorAll(".thumbobj").forEach(sv => { const b = sv.querySelector("g").getBBox(), p = 8; sv.setAttribute("viewBox", `${b.x - p} ${b.y - p} ${b.width + 2 * p} ${b.height + 2 * p}`); }); }

let cabinRoom = "chambre";
function cabinScreen() {
  const n = S.cabin.items.length, total = ALL_ITEMS().length;
  view(`<div class="section"><h1>La cabane de Zombinette</h1>
    <div class="row" style="justify-content:center">${[["chambre", "🛏️ La chambre"], ["studio", "🎥 Le studio"]].map(([id, lb]) => `<button class="pill ${cabinRoom === id ? "on" : ""}" data-room="${id}">${lb}</button>`).join("")}</div>
    ${S.cabin.pending && S.cabin.items.length < ALL_ITEMS().length ? `<div class="cabinpick" id="cabinPickTab"></div>` : ""}
    <div class="cabinwrap">${cabinSvg(true, cabinRoom)}</div>
    <p class="tagline">${n ? `${n} objet${n > 1 ? "s" : ""} sur ${total}` : "La cabane est vide… Finis une partie pour choisir un objet!"}</p></div>`, "cabin");
  app.querySelectorAll("[data-room]").forEach(b => b.onclick = () => { cabinRoom = b.dataset.room; cabinScreen(); });
  offerCabin($("#cabinPickTab"));
}
function offerCabin(box, silent) {
  const left = ALL_ITEMS().filter(([id]) => !S.cabin.items.includes(id));
  if (!left.length || !S.cabin.pending || !box) return false;
  const opts = shuffle(left).slice(0, 3);
  box.innerHTML = `<h2>Choisis un objet pour la cabane!</h2><div class="choices cabinopts">${opts.map(([id, name]) => `<button class="choice" data-c="${id}">${itemThumb(id)}<small>${name}</small></button>`).join("")}</div>`;
  fitThumbs();
  box.querySelectorAll("[data-c]").forEach(b => b.onclick = () => {
    if (!S.cabin.pending) return;
    const it = ALL_ITEMS().find(x => x[0] === b.dataset.c); S.cabin.items.push(it[0]); S.cabin.pending--; cabinRoom = roomOf(it[0]);
    const vleft = CABIN_VISITORS.filter(([id]) => !S.cabin.visitors.includes(id)), visit = vleft.length && Math.random() < 0.17 ? pick(vleft) : null;
    if (visit) S.cabin.visitors.push(visit[0]);
    save();
    box.innerHTML = `<div class="cabinwrap small">${cabinSvg(true, cabinRoom)}</div>${visit ? `<div class="toast streak"><span class="ic">✨</span><div><div class="tt">Surprise!</div><div class="tn">${cap(visit[1])} vient visiter la cabane!</div></div></div>` : ""}`;
    say([it[1], ...(visit ? [{ pause: 400 }, "Surprise! Quelqu'un vient visiter la cabane!"] : [])]);
    if (box.id === "cabinPickTab") setTimeout(() => { if ($("#cabinPickTab")) cabinScreen(); }, 2500);
  });
  if (!silent) say(["Choisis un objet pour la cabane!"]);
  return true;
}
/* ---------- écrans ---------- */
function view(html, tab) {
  app.innerHTML = html + (tab ? tabbar(tab) : "");
  app.classList.toggle("immersive", !tab);
  if (tab) app.querySelectorAll(".tabbar button").forEach(b => b.onclick = () => ({ home, album, cabin: cabinScreen, style: styleScreen, parent: pinScreen })[b.dataset.tab]());
}
function tabbar(active) {
  const tabs = [["home", "🏠", "Accueil"], ["cabin", "🛖", "Cabane"], ["album", "🌟", "Collants"], ["style", "🎨", "Style"], ["parent", "👤", "Parent"]];
  return `<nav class="tabbar">${tabs.map(([id, ic, lb]) => `<button data-tab="${id}" class="${active === id ? "on" : ""}">${ic}${id === "cabin" && S.cabin.pending && S.cabin.items.length < ALL_ITEMS().length ? `<span class="badge">${S.cabin.pending}</span>` : ""}<small>${lb}</small></button>`).join("")}</nav>`;
}
function topbar(back = true) {
  return `<div class="topbar">${back ? `<button class="back" id="back">←</button>` : "<span></span>"}<span class="stars" id="starsN" title="abonnés">👥 ${S.stars}</span></div>`;
}
function tileCard([id, title, ic, c1, c2]) {
  return `<button class="tilecard" data-g="${id}">
      <div class="thumb" style="--c1:${c1};--c2:${c2}">${ic}${S.weekly.length && id === "word" ? `<span class="live">SEMAINE</span>` : ""}</div>
      <div class="t">${title}</div>
    </button>`;
}
const HELLOS = ["Allô! On joue?", "Coucou! C'est moi!", "Bonjour toi!"];
let greeted = false;
function home() {
  stopAudio();
  const d = dailyState(), hello = pick(HELLOS), unlocked = Object.keys(S.stickers).length;
  view(`<div class="hello"><div class="hellozomb">${zombinette("idle")}</div><div class="bubble">${hello}</div>
      <div class="who"><div class="avatar">${avatarHtml()}</div><div><b>Les Zombinettes</b><small>👥 ${S.stars} abonnés · 🌟 ${unlocked} collants</small></div></div></div>
    <button class="daily ${d.done ? "complete" : ""}" data-g="daily"><div class="dh"><b>${d.done ? "Défi du jour réussi! 🎉" : "⭐ Défi du jour"}</b><span class="go">${d.done ? "🔁" : "▶"}</span></div>${weekHtml()}</button>
    <div class="doors">${CATS.map(([id, t, ic, c1, c2]) => `<button class="door" data-cat="${id}" style="--c1:${c1};--c2:${c2}"><span>${ic}</span><b>${t}</b></button>`).join("")}</div>`, "home");
  app.querySelectorAll("[data-g]").forEach(b => b.onclick = () => startSession(b.dataset.g));
  app.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => catScreen(b.dataset.cat));
  if (!greeted) { greeted = true; setTimeout(() => { if ($(".hello")) say([hello]); }, 400); }
}
function catScreen(id) {
  stopAudio();
  const [, t, ic, c1, c2, games, opt] = CATS.find(c => c[0] === id);
  view(`${topbar()}<div class="section"><h1>${ic} ${t}</h1></div>
    <div class="grid">${opt && opt.noMix ? "" : `<button class="tilecard mixtile" data-g="mix:${id}"><div class="thumb" style="--c1:${c1};--c2:${c2}">🎲</div><div class="t">Mélange</div></button>`}${games.map(g => tileCard(ACTIVITIES.find(a => a[0] === g))).join("")}</div>`, "home");
  $("#back").onclick = home;
  app.querySelectorAll("[data-g]").forEach(b => b.onclick = () => startSession(b.dataset.g));
}
function album() {
  const unlocked = Object.keys(S.stickers).length;
  const kw = knownWords(), prog = [["📚", "mots que tu connais", kw.length], ["🔢", "bonnes réponses en maths", okTotal(["number", "calc", "compare", "money", "clock", "formes", "solides"])], ["🎵", "bonnes réponses en musique", okTotal(["music", "keys", "figures"])],
    ["✏️", "tracés réussis", okTotal(["trace"])], ["🌍", "bonnes réponses en découverte", okTotal(["quiz", "vivant", "habitat", "meteo", "saisons", "avant", "couleurs", "emotions"])], ["⭐", "défis du jour", S.days.length]];
  view(`<div class="section"><h1>Mes progrès</h1>
    <div class="progs">${prog.map(([ic, lb, n]) => `<div class="prog"><span>${ic}</span><b>${n}</b><small>${lb}</small></div>`).join("")}</div>
    ${kw.length ? `<div class="kwords">${kw.slice(-24).map(w => `<span class="pill">${esc(w.mot)}</span>`).join("")}</div>` : ""}
    <h1 style="margin-top:22px">Mes collants</h1>
    <div class="achv-head"><span class="muted">Collants débloqués</span><b>${unlocked} / ${STICKERS.length}</b></div>
    <div class="achv-bar"><div style="width:${Math.round(unlocked / STICKERS.length * 100)}%"></div></div>
    <div class="album">${STICKERS.map(s => `<div class="sticker ${S.stickers[s] ? "" : "locked"}">${S.stickers[s] ? s : "🔒"}${S.stickers[s] > 1 ? `<span class="count">×${S.stickers[s]}</span>` : ""}</div>`).join("")}</div>
    <div class="achv-head"><span class="muted">Collants des défis du jour · ${S.days.length} défi${S.days.length > 1 ? "s" : ""} faits</span></div>
    <div class="album">${Object.entries(DAY_STICKERS).map(([n, st]) => `<div class="sticker ${S.stickers[st] ? "" : "locked"}">${S.stickers[st] ? st : "🔒"}<span class="count">${n} défis</span></div>`).join("")}</div></div>`, "album");
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
      ${pills("monLvl", [1, 2, 3, 4, 5], S.money.level, v => ["", "Reconnaître les pièces", "Compter des pièces pareilles", "5 ¢ et 10 ¢ mêlées", "+ 25 ¢ (jusqu'à 1 $)", "1 $ et 2 $"][v])}
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
        ${[["read", "Lecture"], ["sound", "Rimes et sons"], ["syllab", "Syllabes"], ["phrase", "Phrases"], ["money", "Sous"], ["keys", "Piano"], ["figures", "Notes de musique"], ["compare", "Plus grand"], ["clock", "Heure"], ["music", "Aigu, rythme, instruments"], ["quiz", "Découverte"]].map(([k, l]) => `<tr><td>${l} réussis / ratés</td><td>${S.mathStats[k].ok} / ${S.mathStats[k].ko}</td></tr>`).join("")}
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
    const json = JSON.stringify(Object.assign({}, S, { pin: undefined, avatar: undefined, exportedAt: new Date().toISOString() }), null, 1);
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
      const pin = S.pin, avatar = data.avatar || S.avatar; localStorage.setItem(STORE_KEY, JSON.stringify(Object.assign(data, { pin, avatar }))); S = load(); applyTheme(); parent();
    } catch { $("#ioMsg").textContent = "Fichier invalide."; }
  };
  $("#offline").onclick = async () => {
    const msg = $("#offMsg"); const m = MANIFEST[S.voice];
    if (!("caches" in window)) { msg.textContent = "Non disponible dans ce navigateur."; return; }
    if (!m) { msg.textContent = "La voix choisie n'a pas de clips à télécharger."; return; }
    const urls = [...m].map(sl => `audio/${S.voice}/${sl}.mp3`); const cache = await caches.open("zombinettes-audio"); urls.push(...INSTRUMENTS.flatMap(x => [1, 2].map(k => `audio/instr/${x[0]}-${k}.m4a`))); let done = 0;
    for (let i = 0; i < urls.length; i += 25) {
      const batch = urls.slice(i, i + 25).filter(u => u);
      const existing = await Promise.all(batch.map(u => cache.match(u)));
      await Promise.all(batch.filter((u, k) => !existing[k]).map(u => cache.add(u).catch(() => {})));
      done += batch.length; msg.textContent = `${done} / ${urls.length} sons…`;
    }
    msg.textContent = `Prêt : ${urls.length} sons de ${S.voice === "sylvie" ? "Sylvie" : S.voice} disponibles hors ligne.`;
  };
  $("#pin").onclick = () => { const p = prompt("Nouveau NIP (4 chiffres)"); if (p && /^\d{4}$/.test(p)) { S.pin = p; save(); alert("NIP changé"); } };
  $("#reset").onclick = () => { if (confirm("Effacer tous les progrès, abonnés et collants ?")) { S.progress = {}; S.stars = 0; S.stickers = {}; S.sessions = 0; S.palier = DEFAULTS.palier; S.daily = null; S.days = []; S.cabin = { items: [], visitors: [] }; for (const k of ["mathStats", "plays", "mixCount"]) S[k] = JSON.parse(JSON.stringify(DEFAULTS[k])); save(); parent(); } };
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
