'use strict';
// Plays Act I end-to-end and validates content. Run: node test/walkthrough.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.join(__dirname, '..');
const files = ['registry.js', 'content/world.js', 'content/items.js', 'content/home.js', 'content/work.js', 'content/costco.js', 'content/music.js', 'engine.js', 'audio.js'];
for (const f of files) vm.runInThisContext(fs.readFileSync(path.join(root, 'js', f), 'utf8'), { filename: f });

const { Engine: E } = LSJ;
const VERBOSE = process.argv.includes('-v');
let failures = 0;

function check(name, fn) {
  try { fn(); console.log('ok   ' + name); } catch (e) { failures++; console.log('FAIL ' + name + '\n     ' + e.message); }
}

function play(cmds) {
  const all = [];
  for (const c of cmds) {
    const out = E.exec(c);
    all.push(...out);
    if (VERBOSE) { console.log('> ' + c); out.forEach((o) => console.log('   ' + o.text.replace(/\n/g, '\n   '))); }
  }
  return all;
}

function checkArt() {
  const v = E.view();
  const lines = v.art.replace(/^\n/, '').split('\n');
  const wide = lines.filter((l) => displayWidth(l) > 78);
  assert.ok(lines.length <= 16, `${v.title}: ${lines.length} lines of art`);
  assert.ok(!wide.length, `${v.title}: art line too wide (${wide[0] && displayWidth(wide[0])} columns): "${wide[0]}"`);
}

function displayWidth(text) {
  return Array.from(text).reduce((n, ch) => n + (/[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe10-\ufe6f\uff01-\uff60\uffe0-\uffe6]/u.test(ch) ? 2 : 1), 0);
}

function artAllRooms() {
  const s = E.state;
  const saveRoom = s.room;
  for (const id of Object.keys(LSJ.rooms)) { s.room = id; checkArt(); }
  s.room = saveRoom;
}

check('art fits 78x16 in initial state', () => { E.start(); artAllRooms(); });
check('title/death/end art fits', () => {
  for (const k of ['titleArt', 'deathArt', 'endArt']) {
    const lines = LSJ.config[k].replace(/^\n/, '').split('\n');
    assert.ok(lines.length <= 16, k + ' too tall: ' + lines.length);
    lines.forEach((l) => assert.ok(displayWidth(l) <= 78, k + ' too wide: ' + l));
  }
});

check('Chinese interface keeps English command tokens visible', () => {
  E.start();
  const v = E.view();
  assert.ok(LSJ.config.helpText.includes('不用切换中文输入法'));
  assert.ok(LSJ.config.helpText.includes('TALK TO'));
  assert.ok(v.objects.every((o) => o.name && o.command), 'visible objects need a Chinese label and English command');
  assert.ok(v.exits.every((e) => e.label && e.command), 'exits need a Chinese label and English command');
  assert.ok(v.travel.every((d) => d.name && d.command), 'destinations need a Chinese label and English command');
  assert.ok(/[\u4e00-\u9fff]/u.test(v.title), 'room title should be Simplified Chinese');
});

check('soundtrack compiles; every destination has a theme', () => {
  for (const id of Object.keys(LSJ.music.songs)) LSJ.Audio.compile(id);
  for (const d of Object.values(LSJ.destinations)) {
    if (d.comingSoon) continue;
    assert.ok(LSJ.music.songs[LSJ.music.themes[d.id]], 'no theme song for destination ' + d.id);
  }
  ['points', 'death', 'fanfare', 'title'].forEach((id) => assert.ok(LSJ.music.songs[id], 'missing song ' + id));
});

check('all score ids are reachable keys & exits valid', () => {
  for (const r of Object.values(LSJ.rooms)) for (const e of r.exits || []) {
    assert.ok(LSJ.rooms[e.to], `${r.id} exit -> ${e.to}`);
    if (e.sfx) assert.ok(LSJ.Audio.effects.includes(e.sfx), `${r.id} exit sfx ${e.sfx}`);
  }
});

const walkthrough = [
  'look', 'read memo', 'take report', 'use computer', 'play solitaire',
  'kick printer', 'go to break room', 'kick printer', 'open fridge', 'take paper', 'put paper in printer', 'take cover sheet',
  'take cake', 'take flair', 'wear flair', 'go cubicles', 'take stapler', 'give cake to merv', 'staple report',
  'give stapler to merv', 'go to brumley\'s office', 'talk to brumley', 'give report to brumley',
  'go lobby', 'talk to peggy', 'talk to todds',
  'take bus home', 'search dumpster', 'open hood', 'go apartment', 'listen to messages', 'search couch', 'sleep',
  'go bathroom', 'look in mirror', 'open cabinet', 'take cologne', 'take comb', 'wear cologne', 'comb hair',
  'go to costco', 'take cart', 'enter', 'go aisles', 'renew membership', 'talk to gus', 'go aisles',
  'stare at tvs', 'talk to sample lady', 'eat weenie', 'take pen', 'clean suit with pen',
  'go tire center', 'buy battery', 'go entrance', 'go food court', 'buy hot dog', 'eat hot dog',
  'take bus home', 'put battery in car', 'drive to work', 'drive home', 'inventory', 'score', 'go apartment', 'sleep in waterbed',
];

check('Act I walkthrough completes', () => {
  E.start();
  const out = play(walkthrough);
  const fx = out.filter((o) => o.type === 'sfx').map((o) => o.text);
  fx.forEach((n) => assert.ok(LSJ.Audio.effects.includes(n), 'unknown sound effect: ' + n));
  assert.ok(['printer', 'stapler', 'cash', 'bus', 'car', 'slosh'].every((n) => fx.includes(n)), 'missing sfx in walkthrough: ' + fx.join(','));
  const s = E.state;
  ['paid', 'tps_stapled', 'stapler_returned', 'membership_valid', 'car_fixed', 'suit_clean', 'combed', 'cologne'].forEach((f) => assert.ok(s.flags[f], 'flag missing: ' + f));
  assert.ok(s.ended, 'act did not end');
  assert.ok(!s.dead, '老刘触发了死亡分支');
  assert.strictEqual(s.score, 130, 'walkthrough should reach the full score');
  const missed = Object.keys(LSJ.scores).filter((k) => !s.scored[k]);
  console.log(`     score ${s.score}/${E.view().maxScore}, money ${E.view().money}, time ${E.view().time}, missed: ${missed.join(', ') || 'none'}`);
  assert.ok(!out.some((o) => /undefined|\[object/.test(o.text)), 'output contains undefined/[object]');
  artAllRooms();
});

check('art fits in end-state for all rooms', () => { E.state.ended = null; artAllRooms(); });

check('sleep before done does not end act', () => {
  E.start();
  play(['go to home', 'go apartment', 'sleep']);
  assert.ok(!E.state.ended);
});

check('cannot renew without money; Gus blocks aisles', () => {
  E.start();
  play(['take bus to costco', 'go entrance', 'renew membership', 'go aisles']);
  assert.ok(!E.state.flags.membership_valid);
  assert.strictEqual(E.state.room, 'costco_entrance');
});

check('battery requires a cart', () => {
  E.start();
  E.state.money = 50000;
  E.state.flags.membership_valid = true;
  play(['go to costco', 'go entrance', 'go aisles', 'go tire center', 'buy battery']);
  assert.ok(!E.state.inventory.includes('battery'));
});

check('death by yogurt, then undo', () => {
  E.start();
  play(['go break room', 'open fridge', 'eat yogurt']);
  assert.ok(E.state.dead);
  play(['look']);
  assert.ok(E.state.dead, 'commands blocked while dead');
  play(['undo']);
  assert.ok(!E.state.dead);
});

check('costco closes at 8:30 and kicks you out', () => {
  E.start();
  E.state.money = 50000;
  E.state.flags.membership_valid = true;
  play(['go to costco', 'go entrance', 'go aisles']);
  E.state.minutes = 20 * 60 + 29;
  play(['look']);
  assert.strictEqual(E.state.room, 'costco_lot');
  play(['go entrance']);
  assert.ok(E.state.dead, 'should die at closed costco without battery');
});

check('save / restore / restart', () => {
  E.start();
  play(['take report', 'save t1', 'drop report', 'restart', 'restore t1']);
  assert.ok(E.state.inventory.includes('tps_report'));
});

check('parser variety', () => {
  E.start();
  const out = play(['x memo', 'pick up the tps report', 'turn on the computer', 'walk to the break room', 'grab ream', 'load paper into printer', 'get cover', 'hello', 'blorf', 'go to walmart', 'go to gym', 'map', 'hint', 'help', 'costco']);
  assert.ok(E.state.inventory.includes('cover_sheet'), 'got cover sheet via synonyms');
  assert.strictEqual(E.state.room, 'costco_lot', 'bare destination name travels');
});

check('time display', () => {
  assert.strictEqual(E.fmtTime(16 * 60 + 30), '星期五下午4:30');
  assert.strictEqual(E.fmtTime(1440 + 9 * 60 + 5), '星期六上午9:05');
});

console.log(failures ? `\n${failures} FAILED` : '\nAll tests passed.');
process.exit(failures ? 1 : 0);
