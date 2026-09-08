/* Les Zombinettes — français et maths pour le 1er cycle du primaire */
(() => {
const STORE_KEY = "zombinettes.v1";
const DEFAULTS = {
  palier: 1, palierAuto: true, mode: "tiles", pin: "1234", weekly: [], theme: "violet", bg: "dark", avatar: null, custom: null, voice: "sylvie", pitch: 1, mute: { word: false, number: false, calc: false, trace: false },
  stars: 0, stickers: {}, sessions: 0, progress: {}, sessionLength: 8, newPerSession: 3,
  math: { numMax: 20, firstMax: 10, addMax: 5, sub: false, visual: true, length: 8 },
  mathStats: { number: { ok: 0, ko: 0 }, calc: { ok: 0, ko: 0 }, trace: { ok: 0, ko: 0 } },
  trace: { lower: true, upper: false, digits: true, length: 6 },
  plays: { word: 0, number: 0, calc: 0, trace: 0 }
};
const ACTIVITIES = [
  ["word", "Les mots", "🎤", "#7c3aed", "#ec4899", "Dictée · liste du ministère"],
  ["number", "Les nombres", "🔢", "#0ea5e9", "#22c55e", "Écoute et écris le nombre"],
  ["calc", "Les calculs", "➕", "#f97316", "#ef4444", "Additions et soustractions"],
  ["trace", "Tracer", "✏️", "#14b8a6", "#8b5cf6", "Lettres et chiffres au doigt"]
];
const THEME_AVATAR = { violet: "🧟‍♀️", zombie: "🧟‍♀️", vampire: "🧛‍♀️", loup: "🐺", licorne: "🦄", ocean: "🐬", chanteuse: "👩‍🎤", sirene: "🧜‍♀️" };
const STICKERS = ["🧟‍♀️", "🧛‍♀️", "🐺", "👻", "🦇", "🕸️", "🎃", "📣", "🎤", "🎥", "📱", "🔔", "👍", "🎬", "🎮", "💜", "🧸", "🦄", "🌈", "⭐", "🍭", "🎀", "🎸", "🩰", "🎧", "🐱", "🌸", "🍦", "🦋", "🎉", "👑", "🐶", "🍩", "🛼", "🎈", "🌙"];
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
  number: "Écoute bien le nombre, puis écris-le avec les chiffres.",
  calc: "Écoute le calcul et écris la réponse.",
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
  for (const k in DEFAULTS.mathStats) out.mathStats[k] = out.mathStats[k] || { ok: 0, ko: 0 };
  if (s.voiceURI && !s.voice) out.voice = "system:" + s.voiceURI;
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
function playClip(url, rate, robot) { return new Promise(async res => {
  try {
    unlockAudio(); if (!actx) return playClipFallback(url, rate).then(res);
    const buf = await getBuffer(url);
    const src = actx.createBufferSource(); src.buffer = buf; src.playbackRate.value = rate;
    let osc = null;
    if (robot) { const ring = actx.createGain(); ring.gain.value = 0; osc = actx.createOscillator(); osc.frequency.value = 45; osc.connect(ring.gain); src.connect(ring); ring.connect(actx.destination); osc.start(); }
    else src.connect(actx.destination);
    src.start();
    current = { pause: () => { try { src.stop(); osc && osc.stop(); } catch {} } };
    src.onended = () => { try { osc && osc.stop(); } catch {} res(); };
  } catch { playClipFallback(url, rate).then(res); }
}); }
function slug(t) { return Array.from(t.trim().toLowerCase()).map(c => (/[a-z0-9]/.test(c) ? c : "_" + c.codePointAt(0).toString(16))).join(""); }
function clipUrl(text) { const m = MANIFEST[S.voice]; if (!m) return null; const sl = slug(text); return m.has(sl) ? `audio/${S.voice}/${sl}.mp3` : null; }
let sayToken = 0, current = null;
function stopAudio() { sayToken++; if (current) { try { current.pause(); } catch {} current = null; } if ("speechSynthesis" in window) speechSynthesis.cancel(); }
function playClipFallback(url, rate) { return new Promise(res => { const a = new Audio(url); current = a; a.preservesPitch = false; a.mozPreservesPitch = false; a.playbackRate = rate; a.onended = a.onerror = () => res(); a.play().catch(() => res()); }); }
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
    if (url) await playClip(url, rate, S.pitch === "robot");
    else { let j = i; let txt = parts[i]; while (j + 1 < parts.length && typeof parts[j + 1] === "string" && !clipUrl(parts[j + 1])) { j++; txt += " " + parts[j]; } i = j; await playTts(txt); }
    if (i < parts.length - 1) await new Promise(r => setTimeout(r, 120));
  }
}
function speak(text) { say([text]); }
function chatter(kind, parts) { if (!S.mute[kind]) say(parts); }
function promptParts(it) { return it.kind === "word" ? [it.mot] : it.kind === "trace" ? [it.ch.toLowerCase(), ...(it.ch !== it.ch.toLowerCase() ? ["majuscule"] : [])] : it.kind === "number" ? [String(it.n)] : [String(it.a), it.op === "+" ? "plus" : "moins", String(it.b)]; }
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
function buildNumberSession() {
  const m = S.math, items = [], seen = new Set();
  while (items.length < m.length && seen.size < m.numMax + 1) {
    const n = rand(0, m.numMax); if (seen.has(n)) continue; seen.add(n);
    items.push({ kind: "number", n, answer: String(n), say: String(n) });
  }
  return items;
}
function buildTraceSession() {
  const t = S.trace, pool = [];
  if (t.lower) pool.push(..."abcdefghijklmnopqrstuvwxyz".split("").map(c => ({ kind: "trace", ch: c, isDigit: false })));
  if (t.upper) pool.push(..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(c => ({ kind: "trace", ch: c, isDigit: false })));
  if (t.digits) pool.push(..."0123456789".split("").map(c => ({ kind: "trace", ch: c, isDigit: true })));
  if (!pool.length) pool.push(..."0123456789".split("").map(c => ({ kind: "trace", ch: c, isDigit: true })));
  return shuffle(pool).slice(0, t.length).map(it => Object.assign({ answer: "ok" }, it));
}
function buildCalcSession() {
  const m = S.math, items = [];
  for (let i = 0; i < m.length; i++) {
    const b = rand(1, m.addMax);
    let a = rand(0, m.firstMax), op = "+";
    if (m.sub && Math.random() < 0.5) { op = "−"; a = rand(b, Math.max(b, m.firstMax)); }
    const result = op === "+" ? a + b : a - b;
    items.push({ kind: "calc", a, b, op, answer: String(result), say: `${a} ${op === "+" ? "plus" : "moins"} ${b}` });
  }
  return items;
}

/* ---------- moteur de session ---------- */
function startSession(kind) {
  stopAudio();
  let items;
  if (kind === "word") {
    if (!POOL.length && !S.weekly.length) { view(`${topbar()}<div class="card">Aucun mot chargé.</div>`); $("#back").onclick = home; return; }
    items = buildWordSession();
  } else if (kind === "number") items = buildNumberSession();
  else if (kind === "trace") items = buildTraceSession();
  else items = buildCalcSession();
  S.plays[kind] = (S.plays[kind] || 0) + 1; save();
  session = { kind, items, i: 0, retry: [], good: 0, total: items.length, s: S.sessions, first: true };
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
  const prompt = it.kind === "calc" && S.mute.calc ? [] : promptParts(it);
  const ann = it.kind === "trace" ? (it.isDigit ? "Voici le chiffre :" : "Voici la lettre :") : ANNONCE[it.kind];
  const parts = session.first && !S.mute[it.kind] ? [CONSIGNE[it.kind], { pause: 700 }, ann, { pause: 350 }, ...prompt] : prompt;
  session.first = false;
  const me = session, idx = session.i;
  setTimeout(() => { if (session === me && session.i === idx && $("#speak")) say(parts); }, 300);
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
  $("#speak").onclick = () => say(promptParts(it));
  if ($("#eye")) $("#eye").onclick = () => { S.math.visual = !S.math.visual; save(); $("#eye").textContent = S.math.visual ? "👀" : "🙈"; $("#eye").classList.toggle("on", !S.math.visual); $("#dots").innerHTML = dots(it); };
  $("#mute").onclick = () => { S.mute[it.kind] = !S.mute[it.kind]; save(); const on = S.mute[it.kind]; $("#mute").textContent = on ? "🔇" : "🗣️"; $("#mute").classList.toggle("on", on); if (on) stopAudio(); };
  if (it.kind === "word") { if (S.mode === "tiles") setupTiles(it); else setupTyped(it); }
  else if (it.kind === "trace") setupTrace(it);
  else setupPad(it);
}
function dots(it) {
  if (!S.math.visual || it.a + it.b > 20) return "";
  const d = (n, cls) => Array.from({ length: n }, () => `<span class="dot ${cls}"></span>`).join("");
  if (it.op === "+") return `<div class="dots">${d(it.a, "a")}${d(it.b, "b")}</div>`;
  return `<div class="dots">${d(it.a - it.b, "a")}${d(it.b, "x")}</div>`;
}
function setupTiles(w) {
  const letters = Array.from(w.mot);
  let order = shuffle(letters.map((_, i) => i));
  if (letters.length > 1 && order.every((v, i) => letters[v] === letters[i])) order = order.reverse();
  const slots = $("#slots"), tiles = $("#tiles");
  slots.innerHTML = letters.map((_, i) => `<div class="slot" data-i="${i}"></div>`).join("");
  tiles.innerHTML = order.map(i => `<button class="tile" data-i="${i}">${esc(letters[i])}</button>`).join("");
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
function setupTyped(w) {
  const inp = $("#typed"); inp.focus();
  const go = () => { if (inp.value.trim()) check(w, inp.value); };
  $("#check").onclick = go; inp.onkeydown = e => { if (e.key === "Enter") go(); };
}
function setupTrace(it) {
  const cv = $("#trace"), size = Math.min(app.clientWidth - 32, 340), dpr = window.devicePixelRatio || 1;
  cv.width = size * dpr; cv.height = size * dpr; cv.style.width = cv.style.height = size + "px";
  const ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);
  const FAM = `"Chalkboard SE", "Chalkboard", "Comic Sans MS", "Arial Rounded MT Bold", Arial, sans-serif`;
  const font = `700 ${Math.round(size * 0.78)}px ${FAM}`;
  const drawGuide = () => { ctx.clearRect(0, 0, size, size); ctx.font = font; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#e4dbfa"; ctx.fillText(it.ch, size / 2, size / 2 + size * 0.04); ctx.strokeStyle = "#c4b5fd"; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.strokeText(it.ch, size / 2, size / 2 + size * 0.04); ctx.setLineDash([]); };
  const M = 96, TOL = 0.13, glyphCanvas = (px, dilate) => {
    const c = document.createElement("canvas"); c.width = c.height = px; const g = c.getContext("2d");
    g.font = `700 ${Math.round(px * 0.78)}px ${FAM}`; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillStyle = "#000"; g.fillText(it.ch, px / 2, px / 2 + px * 0.04);
    if (dilate) { g.strokeStyle = "#000"; g.lineJoin = "round"; g.lineWidth = px * TOL * 2; g.strokeText(it.ch, px / 2, px / 2 + px * 0.04); }
    return c;
  };
  const glyph = glyphCanvas(M, false).getContext("2d").getImageData(0, 0, M, M).data;
  const zone = glyphCanvas(M, true).getContext("2d").getImageData(0, 0, M, M).data;
  const zoneFull = glyphCanvas(size, true);
  let gTop = M, gBot = 0; for (let y = 0; y < M; y++) for (let x = 0; x < M; x++) if (glyph[(y * M + x) * 4 + 3] > 40) { gTop = Math.min(gTop, y); gBot = Math.max(gBot, y); }
  const minLen = Math.max(40, (gBot - gTop) / M * size * 0.6);
  let failed = false;
  const ink = document.createElement("canvas"); ink.width = cv.width; ink.height = cv.height; const ic = ink.getContext("2d"); ic.scale(dpr, dpr);
  ic.lineCap = ic.lineJoin = "round"; ic.lineWidth = Math.max(18, size * 0.07); ic.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--violet") || "#7c3aed";
  const redraw = () => { drawGuide(); ctx.drawImage(ink, 0, 0, size, size); };
  redraw();
  let drawing = false, last = null, pathLen = 0;
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left), y: (e.clientY - r.top) }; };
  cv.onpointerdown = e => { if (session.locked) return; drawing = true; last = pos(e); ic.beginPath(); ic.arc(last.x, last.y, ic.lineWidth / 2, 0, 7); ic.fillStyle = ic.strokeStyle; ic.fill(); redraw(); cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = e => { if (!drawing) return; const p = pos(e); pathLen += Math.hypot(p.x - last.x, p.y - last.y); ic.beginPath(); ic.moveTo(last.x, last.y); ic.lineTo(p.x, p.y); ic.stroke(); last = p; redraw(); };
  cv.onpointerup = cv.onpointercancel = () => {
    if (!drawing) return; drawing = false;
    const small = document.createElement("canvas"); small.width = small.height = M; const sc = small.getContext("2d"); sc.drawImage(ink, 0, 0, M, M);
    const inkD = sc.getImageData(0, 0, M, M).data;
    const fat = document.createElement("canvas"); fat.width = fat.height = M; const fc = fat.getContext("2d");
    for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) if (dx * dx + dy * dy <= 10) fc.drawImage(small, dx, dy);
    const fatD = fc.getImageData(0, 0, M, M).data;
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
      redraw(); ctx.drawImage(over, 0, 0, size, size);
      const fb = $("#fb"); fb.className = "feedback bad"; fb.textContent = "Oups! Reste sur le modèle.";
      if (!failed) { failed = true; S.mathStats.trace.ko++; save(); }
      chatter("trace", ["Oups! Reste sur le modèle."]);
      return;
    }
    if (coverage >= 0.6 && raw >= 0.25 && pathLen >= minLen) check(it, "ok");
  };
  $("#erase").onclick = () => { if (!session.locked) { ic.clearRect(0, 0, size, size); pathLen = 0; redraw(); const fb = $("#fb"); fb.className = "feedback"; fb.textContent = ""; } };
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
  const ok = it.kind === "word" ? norm(answer) === norm(target) : it.kind === "trace" ? answer === "ok" : String(parseInt(answer, 10)) === target;
  const fb = $("#fb");
  const p = it.kind === "word" ? prog(it.key) : null;
  const ms = it.kind === "word" ? null : S.mathStats[it.kind];
  if (ok) {
    if (session.attempt === 0) { session.good++; S.stars += 1; if (p) { p.box = Math.min(3, p.box + 1); p.ok++; } else ms.ok++; }
    if (p) p.last = session.s;
    save();
    fb.className = "feedback ok"; fb.textContent = pick(PRAISE);
    $(".stars").textContent = `👥 ${S.stars}`;
    confetti(); chatter(it.kind, [fb.textContent]);
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
    } else {
      shown = it.kind === "calc" ? `${it.a} ${it.op} ${it.b} = ${target}` : target;
      spoken = it.kind === "calc" ? [...promptParts(it), "ça fait", target] : ["Le nombre est", target];
      $("#num").textContent = target; $("#num").className = "bad";
    }
    fb.insertAdjacentHTML("afterend", `<div class="answer">${shown}</div><div class="actions"><button class="btn small" id="again">🔊 ↻</button><button class="btn ghost small" id="skip">→</button></div>`);
    if (it.kind === "word") say(spoken); else chatter(it.kind, spoken);
    $("#again").onclick = () => { renderItem(it); say(promptParts(it)); };
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
function endSession() {
  const sticker = pick(STICKERS);
  S.stickers[sticker] = (S.stickers[sticker] || 0) + 1;
  const up = maybeLevelUp(); save();
  const gained = session.good;
  view(`${topbar()}
    <div class="result"><div class="big">🎉</div><h1>Bravo!</h1>
      <div class="score">+${gained} <small>abonné${gained > 1 ? "s" : ""}</small></div>
      <p class="tagline">${gained >= session.total / 2 ? `${gained} sur ${session.total}` : "Tu as travaillé fort!"}</p>
      ${up ? `<div class="levelup">🏅 Niveau ${S.palier} débloqué!</div>` : ""}
      <div class="toast"><span class="ic">${sticker}</span><div><div class="tt">Succès débloqué</div><div class="tn">Nouveau collant${S.stickers[sticker] > 1 ? ` ×${S.stickers[sticker]}` : ""}</div></div></div>
    </div>
    <button class="btn pink" id="again">Encore une partie</button>
    <button class="btn ghost" id="album">🏆 Mes succès</button>
    <button class="btn ghost" id="home">Accueil</button>`);
  confetti(60);
  chatter(session.kind, ["Bravo! Tu as gagné un nouveau collant!", ...(gained ? [String(gained), gained > 1 ? "nouveaux abonnés" : "nouvel abonné"] : ["Tu as travaillé fort!"]), ...(up ? ["Et tu passes au niveau", String(S.palier)] : [])]);
  const k = session.kind;
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
  return `<div class="topbar">${back ? `<button class="back" id="back">←</button>` : "<span></span>"}<span><span class="stars" title="niveau">🏅 ${S.palier}</span> <span class="stars" title="abonnés">👥 ${S.stars}</span></span></div>`;
}
function home() {
  stopAudio();
  const mins = { word: S.sessionLength, number: S.math.length, calc: S.math.length, trace: S.trace.length };
  const cards = ACTIVITIES.map(([id, title, ic, c1, c2, sub]) => `
    <button class="tilecard" id="${id}">
      <div class="thumb" style="--c1:${c1};--c2:${c2}">${ic}<span class="dur">${Math.max(2, Math.round(mins[id] * 0.6))} min</span>${S.weekly.length && id === "word" ? `<span class="live">SEMAINE</span>` : ""}</div>
      <div class="info"><div class="mini">${ic}</div><div><div class="t">${title}</div><div class="s">${sub}</div><div class="s">${S.plays[id] ? `${S.plays[id]} partie${S.plays[id] > 1 ? "s" : ""} jouée${S.plays[id] > 1 ? "s" : ""}` : "Jamais joué"}</div></div></div>
    </button>`).join("");
  view(`${channelHeader()}
    <div class="grid">${cards}</div>`, "home");
  ACTIVITIES.forEach(([id]) => $("#" + id).onclick = () => startSession(id));
}
function album() {
  const unlocked = Object.keys(S.stickers).length;
  view(`<div class="section"><h1>Succès</h1>
    <div class="achv-head"><span class="muted">Collants débloqués</span><b>${unlocked} / ${STICKERS.length}</b></div>
    <div class="achv-bar"><div style="width:${Math.round(unlocked / STICKERS.length * 100)}%"></div></div>
    <div class="album">${STICKERS.map(s => `<div class="sticker ${S.stickers[s] ? "" : "locked"}">${S.stickers[s] ? s : "🔒"}${S.stickers[s] > 1 ? `<span class="count">×${S.stickers[s]}</span>` : ""}</div>`).join("")}</div></div>`, "album");
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
      <label>Mots par dictée</label>
      ${pills("len", [5, 8, 10, 12], S.sessionLength, v => v)}
      <label>Mots de la semaine (un par ligne ou séparés par des virgules)</label>
      <textarea id="weekly">${esc(S.weekly.join("\n"))}</textarea>
      <p class="muted">Passent en priorité dans chaque dictée, en plus des mots du ministère. Le jeu introduit 3 nouveaux mots par dictée et fait revenir les mots ratés plus souvent.</p>
    </div>
    <div class="card">
      <h2>🔢 Les nombres</h2>
      <label>Nombres jusqu'à <b id="numMaxV">${m.numMax}</b></label>
      <input type="range" id="numMax" min="10" max="1000" step="10" value="${m.numMax}">
    </div>
    <div class="card">
      <h2>➕ Les calculs</h2>
      <label>Premier nombre jusqu'à <b id="firstMaxV">${m.firstMax}</b></label>
      <input type="range" id="firstMax" min="5" max="100" step="5" value="${m.firstMax}">
      <label>On ajoute (ou enlève) jusqu'à <b id="addMaxV">+${m.addMax}</b></label>
      <input type="range" id="addMax" min="1" max="10" step="1" value="${m.addMax}">
      <label><input type="checkbox" id="sub" ${m.sub ? "checked" : ""}> Aussi des soustractions</label>
      <label><input type="checkbox" id="visual" ${m.visual ? "checked" : ""}> Montrer des points pour compter (jusqu'à 20)</label>
      <label>Questions par partie</label>
      ${pills("mlen", [5, 8, 10, 12], m.length, v => v)}
    </div>
    <div class="card">
      <h2>✏️ Tracer</h2>
      <label><input type="checkbox" id="tLower" ${S.trace.lower ? "checked" : ""}> Lettres minuscules</label>
      <label><input type="checkbox" id="tUpper" ${S.trace.upper ? "checked" : ""}> Lettres MAJUSCULES</label>
      <label><input type="checkbox" id="tDigits" ${S.trace.digits ? "checked" : ""}> Chiffres</label>
      <label>Tracés par partie</label>
      ${pills("tlen", [4, 6, 8, 10], S.trace.length, v => v)}
    </div>
    <div class="card">
      <h2>📊 Progrès</h2>
      <table class="stats">
        <tr><td>Parties (mots / nombres / calculs / tracés)</td><td>${S.plays.word} / ${S.plays.number} / ${S.plays.calc} / ${S.plays.trace}</td></tr>
        <tr><td>Mots débloqués / total</td><td>${un.length} / ${POOL.length}</td></tr>
        <tr><td>Mots rencontrés</td><td>${seen}</td></tr>
        <tr><td>À apprendre / en cours / presque / acquis</td><td>${boxes.join(" / ")}</td></tr>
        <tr><td>Dictées faites</td><td>${S.sessions}</td></tr>
        <tr><td>Nombres réussis / ratés</td><td>${S.mathStats.number.ok} / ${S.mathStats.number.ko}</td></tr>
        <tr><td>Calculs réussis / ratés</td><td>${S.mathStats.calc.ok} / ${S.mathStats.calc.ko}</td></tr>
        <tr><td>Tracés réussis</td><td>${S.mathStats.trace.ok}</td></tr>
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
  const sel = { mode: S.mode, len: S.sessionLength, mlen: m.length, tlen: S.trace.length };
  app.querySelectorAll("[data-group]").forEach(g => g.onclick = e => {
    const b = e.target.closest(".pill"); if (!b) return;
    const v = b.dataset.v; sel[g.dataset.group] = isNaN(v) ? v : +v;
    g.querySelectorAll(".pill").forEach(x => x.classList.toggle("on", x === b));
  });
  const live = (id, fmt) => { $("#" + id).oninput = e => $("#" + id + "V").textContent = fmt(e.target.value); };
  live("numMax", v => v); live("firstMax", v => v); live("addMax", v => "+" + v); live("palier", v => palierLabel(+v));
  $("#save").onclick = () => {
    S.palier = +$("#palier").value; S.palierAuto = $("#auto").checked; S.mode = sel.mode; S.sessionLength = sel.len;
    S.weekly = [...new Set($("#weekly").value.split(/[\n,;]+/).map(s => s.trim().toLowerCase().replace(/\s+/g, " ")).filter(Boolean))];
    S.trace = { lower: $("#tLower").checked, upper: $("#tUpper").checked, digits: $("#tDigits").checked, length: sel.tlen };
    S.math = { numMax: +$("#numMax").value, firstMax: +$("#firstMax").value, addMax: +$("#addMax").value, sub: $("#sub").checked, visual: $("#visual").checked, length: sel.mlen };
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
    const urls = [...m].map(sl => `audio/${S.voice}/${sl}.mp3`); const cache = await caches.open("zombinettes-v1"); let done = 0;
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
  try { const m = await fetch("audio/manifest.json").then(r => r.json()); for (const k in m) MANIFEST[k] = new Set(m[k]); } catch {}
  if (!S.voice.startsWith("system:") && !MANIFEST[S.voice]) { const first = Object.keys(MANIFEST)[0]; S.voice = first || "system:"; }
  buildPool(); home();
  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
}
boot();
})();
