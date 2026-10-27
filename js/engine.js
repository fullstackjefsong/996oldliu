(function (root) {
  'use strict';
  const LSJ = root.LSJ;

  const DAYS = ['星期五', '星期六', '星期日', '星期一'];
  const BUS_FARE = 200;
  const BUS_MINUTES = 30;
  const CAR_MINUTES = 15;

  const VERB_DEFS = {
    look: ['look', 'l', 'examine', 'x', 'inspect', 'check', 'check out', 'look at', 'view', 'observe', 'study', 'admire', 'watch', 'stare', 'stare at', 'gaze at', 'ogle'],
    search: ['search', 'look in', 'look under', 'look behind', 'look inside', 'look through', 'rummage', 'rummage in', 'rummage through', 'dig', 'dig in', 'dig through', 'check under', 'feel under'],
    read: ['read'],
    take: ['take', 'get', 'grab', 'pick up', 'pick', 'steal', 'snag', 'pocket', 'collect', 'swipe', 'lift', 'borrow', 'accept'],
    drop: ['drop', 'discard', 'throw away', 'toss', 'leave behind'],
    use: ['use', 'operate', 'turn on', 'switch on', 'activate', 'play', 'start', 'boot', 'print', 'log in', 'log into', 'login'],
    open: ['open', 'pop', 'unlock', 'pop open'],
    close: ['close', 'shut'],
    talk: ['talk', 'talk to', 'talk with', 'speak', 'speak to', 'speak with', 'chat', 'chat with', 'ask', 'greet', 'say hi to', 'say hello to', 'converse with', 'hi', 'hello'],
    flirt: ['flirt', 'flirt with', 'hit on', 'wink at', 'wink', 'seduce', 'kiss', 'compliment', 'pick up line', 'smooth talk'],
    give: ['give', 'hand', 'offer', 'show', 'return', 'give back', 'deliver', 'submit', 'turn in', 'hand in'],
    buy: ['buy', 'purchase', 'pay for', 'order'],
    wear: ['wear', 'put on', 'don', 'spray', 'splash', 'pin', 'pin on', 'apply'],
    remove: ['take off', 'remove', 'undress', 'strip'],
    eat: ['eat', 'taste', 'consume', 'try', 'bite', 'devour', 'sample', 'lick'],
    drink: ['drink', 'sip', 'chug', 'gulp', 'quaff', 'pour'],
    sit: ['sit', 'sit on', 'sit in', 'lie on', 'lay on', 'relax', 'lounge', 'lounge on', 'bounce on'],
    sleep: ['sleep', 'nap', 'go to bed', 'go to sleep', 'lie down', 'lay down', 'sleep in', 'sleep on', 'hit hay', 'hit sack', 'turn in for night'],
    kick: ['kick', 'hit', 'punch', 'smash', 'break', 'attack', 'whack', 'beat', 'bash', 'slap', 'thump', 'bang'],
    smell: ['smell', 'sniff', 'whiff'],
    push: ['push', 'press', 'pull', 'move', 'shove', 'jiggle', 'shake', 'wiggle', 'lift up', 'tip'],
    listen: ['listen', 'listen to', 'play messages', 'check messages', 'hear'],
    put: ['put', 'place', 'insert', 'install', 'load', 'attach', 'stick', 'clip', 'fill', 'set', 'connect', 'plug', 'feed', 'refill', 'add'],
    staple: ['staple'],
    clean: ['clean', 'scrub', 'wash', 'rub', 'dab', 'treat', 'remove stain', 'fix stain'],
    renew: ['renew', 'sign up', 'sign up for', 'join', 'reactivate', 'extend'],
    dance: ['dance', 'boogie', 'disco', 'hustle', 'moonwalk'],
    flush: ['flush'],
    comb: ['comb', 'brush', 'style', 'groom', 'fix hair', 'do hair'],
    call: ['call', 'dial', 'phone', 'telephone'],
    wait: ['wait', 'z', 'idle', 'loiter'],
    go: ['go', 'go to', 'go into', 'go in', 'go back to', 'walk', 'walk to', 'walk into', 'run', 'run to', 'head', 'head to', 'head into', 'enter', 'exit', 'leave', 'travel', 'travel to', 'visit', 'return to', 'back to', 'climb', 'get in', 'get into', 'step into', 'move to', 'proceed to'],
    drive: ['drive', 'drive to', 'drive back to', 'drive home'],
    bus: ['bus', 'bus to', 'take bus', 'take bus to', 'ride bus', 'ride bus to', 'catch bus', 'catch bus to', 'board bus', 'board bus to', 'bus home', 'take bus home'],
  };
  const VERB_LIST = [];
  for (const [canon, phrases] of Object.entries(VERB_DEFS)) {
    for (const p of phrases) VERB_LIST.push([p.split(' '), canon]);
  }
  VERB_LIST.sort((a, b) => b[0].length - a[0].length);

  const STOP = new Set(['the', 'a', 'an', 'some', 'my', 'that', 'this', 'these', 'those', 'please', 'around', 'then', 'just', 'again', 'quickly', 'carefully', 'yourself', 'his', 'her']);
  const PREPS = new Set(['on', 'onto', 'to', 'with', 'in', 'into', 'at', 'from', 'under', 'inside', 'for', 'about', 'through']);
  const TWO_OBJ_VERBS = new Set(['use', 'put', 'give', 'staple', 'clean', 'wear', 'drop', 'kick', 'eat', 'drink', 'buy']);

  const tokenize = (s) =>
    String(s).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9$ ]+/g, ' ').split(/\s+/).filter(Boolean);
  const norm = (s) => tokenize(s).filter((t) => !STOP.has(t));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const fmtMoney = (c) => '¥' + (c / 100).toFixed(2);

  function parse(input) {
    const toks = norm(input);
    let verb = null;
    let len = 0;
    for (const [phrase, canon] of VERB_LIST) {
      if (phrase.length <= toks.length && phrase.every((w, i) => toks[i] === w)) {
        verb = canon;
        len = phrase.length;
        break;
      }
    }
    const rest = toks.slice(len);
    // "drive home" / "bus home" consume the word home
    if ((verb === 'drive' || verb === 'bus') && toks.slice(0, len).includes('home')) rest.unshift('home');
    let r = rest;
    while (r.length && PREPS.has(r[0])) r = r.slice(1);
    const idx = r.findIndex((t) => PREPS.has(t));
    const dobj = idx === -1 ? r : r.slice(0, idx);
    const prep = idx === -1 ? null : r[idx];
    const iobj = idx === -1 ? [] : r.slice(idx + 1).filter((t) => !PREPS.has(t));
    return { verb, toks, rest: r, dobj, prep, iobj };
  }

  function matchScore(phraseToks, name) {
    const s = phraseToks.join(' ');
    const n = norm(name).join(' ');
    if (!n) return 0;
    if (s === n) return 1000 + n.length;
    if ((' ' + s + ' ').includes(' ' + n + ' ')) return 500 + n.length;
    if ((' ' + n + ' ').includes(' ' + s + ' ')) return 100 + s.length;
    return 0;
  }

  // ---------------------------------------------------------------------------
  let S = null;
  let out = [];
  let undoStack = [];
  const memStore = {};
  const store = {
    get(k) {
      try { if (root.localStorage) return root.localStorage.getItem(k); } catch (e) { /* ignore */ }
      return memStore[k] || null;
    },
    set(k, v) {
      try { if (root.localStorage) return root.localStorage.setItem(k, v); } catch (e) { /* ignore */ }
      memStore[k] = v;
    },
  };

  const R = () => LSJ.rooms[S.room];
  const D = (id) => LSJ.destinations[id];
  const maxScore = () => Object.values(LSJ.scores).reduce((a, s) => a + s.pts, 0);
  const val = (x, ...args) => (typeof x === 'function' ? x(...args) : x);
  const commandOf = (names, fallback = '') => (names || []).find((n) => /^[a-z0-9 ]+$/i.test(n)) || fallback.replace(/_/g, ' ');

  function fmtTime(min) {
    const day = DAYS[Math.floor(min / 1440)] || 'Day ' + Math.floor(min / 1440);
    const m = min % 1440;
    let h = Math.floor(m / 60);
    const mm = String(m % 60).padStart(2, '0');
    const ampm = h >= 12 ? '下午' : '上午';
    h = h % 12 || 12;
    return `${day}${ampm}${h}:${mm}`;
  }

  const say = (text, type = 'text') => {
    if (text != null && text !== '') out.push({ type, text: String(text) });
  };
  const sfx = (name) => out.push({ type: 'sfx', text: name });

  const g = {
    get state() { return S; },
    say: (t) => say(t),
    sfx,
    flag: (k) => !!S.flags[k],
    get: (k) => S.flags[k],
    set: (k, v = true) => { S.flags[k] = v; },
    unset: (k) => { delete S.flags[k]; },
    has: (id) => S.inventory.includes(id),
    give: (id) => { if (!S.inventory.includes(id)) S.inventory.push(id); },
    lose: (id) => { S.inventory = S.inventory.filter((x) => x !== id); },
    money: () => S.money,
    spend: (c) => { if (S.money < c) return false; S.money -= c; return true; },
    earn: (c) => { S.money += c; },
    fmt: fmtMoney,
    award(id) {
      const s = LSJ.scores[id];
      if (!s) throw new Error('Unknown score id: ' + id);
      if (S.scored[id]) return;
      S.scored[id] = true;
      S.score += s.pts;
      say(`【+${s.pts}分：${s.label}】`, 'score');
    },
    die(title, text) {
      S.dead = { title, text };
      say(text);
      say('*** ' + title + ' ***', 'death');
      say('输入 RESTORE 读档、UNDO 撤销，或 RESTART 重新开始。', 'system');
    },
    end(title, text) {
      S.ended = { title, text };
      say(text);
      say('*** ' + title + ' ***', 'end');
      say(`最终得分：${S.score}/${maxScore()}。输入 RESTART 再玩一次。`, 'system');
    },
    goto: (id) => enterRoom(id),
    advance: (m) => { S.minutes += m; },
    minuteOfDay: () => S.minutes % 1440,
    time: () => S.minutes,
    learn(id) {
      if (S.known[id]) return;
      S.known[id] = true;
      const d = D(id);
      say(`【新地点已解锁：${d.name}。输入 MAP 查看可前往的地点。】`, 'system');
    },
    room: () => S.room,
    carAt: () => S.carAt,
  };

  function newState() {
    const c = LSJ.config;
    const known = {};
    for (const d of Object.values(LSJ.destinations)) if (d.known) known[d.id] = true;
    return {
      room: c.startRoom,
      inventory: [...(c.startInventory || [])],
      money: c.startMoney || 0,
      minutes: c.startMinutes || 0,
      flags: {},
      scored: {},
      score: 0,
      known,
      carAt: c.carStart || null,
      visited: {},
      moves: 0,
      dead: null,
      ended: null,
    };
  }

  function enterRoom(id) {
    const r = LSJ.rooms[id];
    if (!r) throw new Error('Unknown room: ' + id);
    S.room = id;
    const first = !S.visited[id];
    S.visited[id] = true;
    say(r.title, 'room');
    say(val(r.desc, g, first));
    if (r.onEnter) {
      const t = r.onEnter(g, first);
      if (typeof t === 'string') say(t);
    }
  }

  function visibleObjects() {
    const r = R();
    const list = [];
    for (const [id, def] of Object.entries(r.objects || {})) {
      if (val(def.hidden, g)) continue;
      list.push({ id, def, where: 'room' });
    }
    return list;
  }

  function scope() {
    const list = visibleObjects();
    for (const id of S.inventory) list.push({ id, def: LSJ.items[id], where: 'inv' });
    if (LSJ.self) list.push({ id: 'jeff', def: LSJ.self, where: 'self' });
    return list;
  }

  function resolve(toks) {
    if (!toks.length) return null;
    let best = null;
    let bestScore = 0;
    for (const o of scope()) {
      for (const n of o.def.names || []) {
        const sc = matchScore(toks, n);
        if (sc > bestScore) { bestScore = sc; best = o; }
      }
    }
    return best;
  }

  const nameOf = (o) => val(o.def.name, g) || o.id;

  function run(h, ctx) {
    if (h == null) return false;
    if (typeof h === 'function') {
      const r = h(g, ctx);
      if (r === false) return false;
      if (typeof r === 'string') say(r);
      return true;
    }
    say(h);
    return true;
  }

  // ------------------------------------------------------------------ travel
  function exitsOf(room) {
    return (room.exits || []).filter((e) => !val(e.hidden, g));
  }

  function findExit(toks) {
    let best = null;
    let bestScore = 0;
    for (const e of exitsOf(R())) {
      const names = [...(e.names || []), e.label, ...(LSJ.rooms[e.to].names || [])];
      for (const n of names) {
        const sc = matchScore(toks, n);
        if (sc > bestScore) { bestScore = sc; best = e; }
      }
    }
    return bestScore >= 500 || (best && bestScore > 100) ? best : null;
  }

  function findRoomInDest(toks) {
    const here = R().dest;
    let best = null;
    let bestScore = 0;
    for (const r of Object.values(LSJ.rooms)) {
      if (r.dest !== here || r.id === S.room) continue;
      for (const n of [r.title, ...(r.names || [])]) {
        const sc = matchScore(toks, n);
        if (sc > bestScore) { bestScore = sc; best = r; }
      }
    }
    return bestScore >= 500 ? best : null;
  }

  function findDest(toks) {
    let best = null;
    let bestScore = 0;
    for (const d of Object.values(LSJ.destinations)) {
      for (const n of [d.name, ...(d.names || [])]) {
        const sc = matchScore(toks, n);
        if (sc > bestScore) { bestScore = sc; best = d; }
      }
    }
    return bestScore >= 500 ? best : null;
  }

  function useExit(e) {
    const c = val(e.cond, g);
    if (typeof c === 'string') { say(c); return; }
    if (c === false) return;
    if (S.dead) return;
    if (e.msg) say(val(e.msg, g));
    if (e.sfx) sfx(e.sfx);
    enterRoom(e.to);
  }

  // Walk through same-location rooms (BFS) so "go to break room" works from the lobby.
  function walkTo(roomId) {
    const prev = {};
    const q = [S.room];
    const seen = { [S.room]: true };
    while (q.length) {
      const cur = q.shift();
      if (cur === roomId) break;
      for (const e of LSJ.rooms[cur].exits || []) {
        if (!seen[e.to] && LSJ.rooms[e.to].dest === R().dest) {
          seen[e.to] = true;
          prev[e.to] = { from: cur, exit: e };
          q.push(e.to);
        }
      }
    }
    if (!seen[roomId]) return false;
    const path = [];
    for (let n = roomId; n !== S.room; n = prev[n].from) path.unshift(prev[n].exit);
    for (const e of path) {
      const c = val(e.cond, g);
      if (typeof c === 'string' || c === false || S.dead) {
        if (typeof c === 'string') say(c);
        if (S.room !== e.to && path[0] !== e) enterRoom(S.room);
        return true;
      }
      S.room = e.to;
    }
    enterRoom(roomId);
    return true;
  }

  function travel(dest, mode) {
    const hereId = R().dest;
    if (dest.id === hereId) {
      say(`你已经在${dest.name}了。点击下方出口，或输入 GO 加英文地点代号移动。`);
      return;
    }
    if (!S.known[dest.id]) {
      say('老刘听说过这个地方，但现在还去不了。输入 MAP 查看已开放地点。');
      return;
    }
    if (dest.comingSoon) { say(val(dest.comingSoon, g)); return; }
    const carHere = g.flag('car_fixed') && S.carAt === hereId;
    const how = mode || (carHere ? 'car' : 'bus');
    if (how === 'car' && !carHere) {
      if (!g.flag('car_fixed')) {
        say(`车还停在青年人才公寓，电瓶已经报废，暂时开不了。试试 TAKE BUS TO ${dest.names[0].toUpperCase()} 坐公交。`);
      } else {
        say(`车停在${D(S.carAt).name}。老刘的车不会自己开过来，请坐公交。`);
      }
      return;
    }
    if (how === 'bus' && S.money < BUS_FARE) {
      say(`公交票价${fmtMoney(BUS_FARE)}，你只有${fmtMoney(S.money)}。司机看了看你的余额，摇摇头。`);
      return;
    }
    const hereDest = D(hereId);
    if (hereDest.onDepart && hereDest.onDepart(g, dest, how) === false) return;
    if (how === 'car') {
      S.carAt = dest.id;
      S.minutes += CAR_MINUTES;
      sfx('car');
      say(pick(LSJ.config.driveLines || ['你开车出发。']).replace('{dest}', dest.prose || dest.name));
      g.award('first_drive');
    } else {
      S.money -= BUS_FARE;
      S.minutes += BUS_MINUTES;
      sfx('bus');
      say(`【公交车费：-${fmtMoney(BUS_FARE)}】`, 'system');
      say(pick(LSJ.config.busLines || ['你坐公交出发。']).replace('{dest}', dest.prose || dest.name));
    }
    enterRoom(dest.hub);
    if (dest.onArrive) {
      const t = dest.onArrive(g, how);
      if (typeof t === 'string') say(t);
    }
  }

  function doGo(toks, mode) {
    if (!toks.length) {
      if (mode) { say(`${mode === 'car' ? 'DRIVE TO' : 'TAKE BUS TO'} 后面要加地点代号。输入 MAP 查看地点。`); return; }
      const exits = exitsOf(R());
      if (exits.length === 1) return useExit(exits[0]);
      say('要去哪里？点击下方出口，或输入 GO TO 加地点代号跨区移动。也可输入 MAP 查看地图。');
      return;
    }
    if (!mode) {
      const e = findExit(toks);
      if (e) return useExit(e);
      const room = findRoomInDest(toks);
      if (room && walkTo(room.id)) return;
    }
    const dest = findDest(toks);
    if (dest) return travel(dest, mode);
    if (!mode) {
      const o = resolve(toks);
      if (o && o.def.verbs && o.def.verbs.go && run(o.def.verbs.go, {})) return;
      if (o) { say(`你走到${nameOf(o)}旁边。距离是近了一点，事情还没办成。`); return; }
    }
    say(`老刘不知道“${toks.join(' ')}”在哪里。输入 MAP 查看地点，或点击画面下方的出口。`);
  }

  // ------------------------------------------------------------------ verbs
  const DEFAULTS = {
    look: (o) => `你仔细看了看${nameOf(o)}。它看起来就是你想的那样。`,
    take: (o) => (o.where === 'inv' ? '你已经拿着了。老刘的口袋管理能力暂时在线。' : pick(['这个不能拿。', '这不是你的东西。老刘反对偷窃，主要是因为他不擅长。', '试过了，它纹丝不动。'])),
    drop: (o) => (o.where === 'inv' ? '还是留着吧，之后可能用得上。' : '你没有这个东西。'),
    use: () => pick(['你没想明白该怎么用。', '你摆弄了一下，什么也没发生。这很符合今天的工作进展。', '具体要怎么用？']),
    open: () => '打不开。',
    close: () => '它现在没有打开。',
    talk: (o) => (o.def.person ? `${nameOf(o)}现在似乎不想说话。` : pick(['它没有回应。连物品都不想理老刘。', '你跟它聊了几句。至少它没有打断你。'])),
    flirt: (o) => (o.def.person ? `你对${nameOf(o)}挑了挑眉。什么也没发生，只有眉毛抽筋了。` : '你对它眨了眨眼。老刘，那是个物品。'),
    give: (o) => `要把${nameOf(o)}交给谁？`,
    buy: () => '这个不卖。虽然大多数东西都有价格。',
    wear: () => '这个没法穿。硬穿也不合适。',
    remove: () => '你没有穿着这个。',
    eat: () => pick(['老刘也不是逮什么都吃。', '这不是吃的，放下吧。']),
    drink: () => '这个不能喝。你确认过了。',
    sit: () => '你不能坐在这个上面。',
    sleep: () => '这里睡不了。老刘需要家里的水床。',
    kick: (o) => (o.def.person ? '暴力解决不了问题，而且对方可能更能打。' : '你踢了一脚。脚趾疼了，物品毫不在意。'),
    smell: () => '闻起来像一个加班太久、需要通风的办公室。',
    push: () => '什么也没发生。',
    listen: () => '你没听见什么特别的声音。',
    put: () => '要放到哪里？试试 USE <物品英文代号> ON <目标英文代号>。',
    staple: () => '这个不用装订。',
    clean: () => '清理这个不是当前优先事项。',
    renew: () => '这个不用续费。也许只有会员身份需要。',
    dance: () => '你跳了两步。物品没有表现出兴趣。',
    flush: () => '这个不能冲进马桶。',
    comb: () => '这个不需要梳。',
    call: () => '你没法给这个打电话。',
    search: (o) => `你搜了搜${nameOf(o)}，没发现什么。`,
    read: (o) => `${nameOf(o)}上没什么可读的。`,
  };

  const NO_OBJ = {
    look: () => describeRoom(),
    dance: () => '你跳起招牌舞步“互联网人下班摇”。动作融合了广场舞和久坐后的腰椎警报。没人看见，挺好。',
    sleep: () => '这里没有地方睡。老刘需要回家躺水床。输入 GO TO HOME。',
    listen: () => '你听见日光灯嗡嗡响，远处似乎还有工作群提示音。',
    smell: () => '你闻到了格子衬衫的味道。那是老刘本人。',
    sit: () => '这里没什么适合坐的地方。老刘继续站着，像一个等待需求的接口。',
    wait: () => { S.minutes += 15; return '你等了十五分钟。时间和发际线一样，不会因为你不看就停下来。'; },
    flirt: () => '要和谁调情？这里得先有个人愿意聊。',
    kick: () => '你踢了一脚空气。久坐一天后，这算运动。',
    call: () => '要给谁打电话？家里的电话留言机还在等你。',
    clean: () => '要清理什么？',
    comb: () => '用什么梳？手指吗？你试过，效果不太理想。',
    renew: () => '要续什么？',
    talk: () => '要和谁说话？',
    buy: () => '要买什么？',
    flush: () => '要冲走什么？',
  };
  const VERB_ZH = {
    look: '看', search: '搜', read: '读', take: '拿', drop: '放下', use: '用', open: '打开', close: '关闭',
    talk: '交谈', flirt: '调情', give: '交给', buy: '买', wear: '穿戴', remove: '脱下', eat: '吃',
    drink: '喝', sit: '坐', sleep: '睡觉', kick: '踢', smell: '闻', push: '推', listen: '听',
    put: '放置', staple: '装订', clean: '清理', renew: '续费', dance: '跳舞', flush: '冲水',
    comb: '梳理', call: '打电话', wait: '等待', go: '前往', drive: '开车去', bus: '坐公交去',
  };

  function describeRoom() {
    const r = R();
    say(r.title, 'room');
    say(val(r.desc, g, false));
  }

  function act(p) {
    const { verb } = p;
    if (verb === 'go' && !p.rest.length && ['enter', 'in'].includes(p.toks[0])) return doGo(['inside']);
    if (verb === 'go' && !p.rest.length && ['exit', 'leave'].includes(p.toks[0])) return doGo(['out']);
    if (verb === 'go') return doGo(p.rest);
    if (verb === 'drive') return doGo(p.rest, 'car');
    if (verb === 'bus') return doGo(p.rest, 'bus');

    const roomVerb = R().verbs && R().verbs[verb];

    if (!p.dobj.length) {
      if (roomVerb && run(roomVerb, {})) return;
      for (const o of visibleObjects()) {
        if (o.def.verbs && o.def.verbs[verb] && o.def.defaultFor && o.def.defaultFor.includes(verb)) {
          if (run(o.def.verbs[verb], { verb })) return;
        }
      }
      if (NO_OBJ[verb]) return run(NO_OBJ[verb], {});
      say(`你想${VERB_ZH[verb] || '做什么'}？请点选下方物品，或输入英文代号。`);
      return;
    }

    const A = resolve(p.dobj);
    if (!A) {
      // single-word/phrase input that is actually a place
      const e = findExit(p.dobj);
      if (e && (verb === 'use' || verb === 'take')) return useExit(e);
      say(pick([
        `这里没有“${p.dobj.join(' ')}”。`,
        `“${p.dobj.join(' ')}”？老刘茫然地环顾四周。没有。`,
      ]));
      return;
    }

    if (p.iobj.length && verb !== 'talk' && verb !== 'take' && verb !== 'look' && verb !== 'search') {
      const B = resolve(p.iobj);
      if (!B) { say(`这里没有“${p.iobj.join(' ')}”。`); return; }
      let instr = A;
      let target = B;
      if (p.prep === 'with' && verb !== 'flirt') { instr = B; target = A; }
      const ctx = { verb, instr, target };
      const h1 = instr.def.useOn && instr.def.useOn[target.id];
      if (h1 != null && run(h1, ctx)) return;
      const h2 = target.def.receive && target.def.receive[instr.id];
      if (h2 != null && run(h2, ctx)) return;
      if (verb === 'give') { say(target.def.person ? `${nameOf(target)}不想收下${nameOf(instr)}。` : '不能把东西交给物品，它们从来不说谢谢。'); return; }
      say(pick(['没有任何效果。', `你把${nameOf(instr)}用在${nameOf(target)}上，什么也没发生，只是显得很忙。`]));
      return;
    }

    const ctx = { verb, about: p.iobj.length ? resolve(p.iobj) : null };
    const verbs = A.def.verbs || {};
    if (verbs[verb] != null && run(verbs[verb], ctx)) return;
    if ((verb === 'read' || verb === 'search') && verbs.look != null) { if (run(verbs.look, ctx)) return; }
    if (verb === 'look' || verb === 'read' || verb === 'search') {
      if (A.def.desc != null) return void say(val(A.def.desc, g));
    }
    if (verb === 'flirt' && verbs.talk != null && !A.def.person) { /* fall through */ }

    // Item used/put/given without a target: find a single sensible target in view.
    if (['use', 'put', 'give', 'staple', 'clean', 'wear'].includes(verb)) {
      const candidates = [];
      for (const o of scope()) {
        if (o.id === A.id) continue;
        if (A.def.useOn && A.def.useOn[o.id] != null) candidates.push([A.def.useOn[o.id], o]);
        else if (o.def.receive && o.def.receive[A.id] != null) candidates.push([o.def.receive[A.id], o]);
      }
      if (candidates.length === 1) {
        if (run(candidates[0][0], { verb, instr: A, target: candidates[0][1] })) return;
      }
    }

    if (verb === 'look' && A.where === 'self') return void say(val(LSJ.self.desc, g));
    const d = DEFAULTS[verb];
    say(d ? d(A) : '这个操作做不了。');
  }

  // ------------------------------------------------------------------ meta
  function help() {
    say(LSJ.config.helpText || '输入 HELP 查看英文指令。', 'system');
  }

  function inventory() {
    const items = S.inventory.filter((id) => !LSJ.items[id].worn).map((id) => val(LSJ.items[id].name, g));
    const worn = S.inventory.filter((id) => LSJ.items[id].worn).map((id) => val(LSJ.items[id].name, g));
    say('背包：' + (items.length ? items.join('、') : '只有希望') + '。');
    if (worn.length) say('穿着：' + worn.join('、') + '。');
    say('现金：' + fmtMoney(S.money) + '。');
  }

  function map() {
    const lines = ['老刘知道的地点：'];
    for (const d of Object.values(LSJ.destinations)) {
      if (S.known[d.id]) {
        const here = R().dest === d.id ? '  ← 你在这里' : '';
        const car = S.carAt === d.id ? (g.flag('car_fixed') ? '  [你的车]' : '  [你的车没电了]') : '';
        lines.push(`  ${d.name}${d.comingSoon ? '（后续章节开放）' : ''}${here}${car}`);
      } else {
        lines.push('  未知地点');
      }
    }
    lines.push(`公交：${fmtMoney(BUS_FARE)}，${BUS_MINUTES}分钟。开车：免费，${CAR_MINUTES}分钟（前提是车能启动）。`);
    lines.push('输入 GO TO <英文地点代号>、DRIVE TO <代号> 或 TAKE BUS TO <代号>。');
    say(lines.join('\n'), 'system');
  }

  function snapshot() {
    undoStack.push(JSON.stringify(S));
    if (undoStack.length > 30) undoStack.shift();
  }

  function meta(toks, raw) {
    const w = toks[0];
    const rest = toks.slice(1).join(' ');
    switch (w) {
      case 'help': case '?': case 'commands': help(); return true;
      case 'i': case 'inv': case 'inventory': case 'items': case 'pockets': inventory(); return true;
      case 'score': case 'points': say(`得分：${S.score}/${maxScore()}。老刘已行动${S.moves}次。`, 'system'); return true;
      case 'time': case 'clock': say(`现在是${fmtTime(S.minutes)}。`, 'system'); return true;
      case 'map': case 'places': case 'destinations': case 'where': map(); return true;
      case 'hint': case 'hints': say(LSJ.config.hint ? LSJ.config.hint(g) : '暂时没有提示。', 'system'); return true;
      case 'save': {
        const slot = rest || 'quick';
        store.set('lsj-save-' + slot, JSON.stringify(S));
        say(`已保存到存档槽“${slot}”。`, 'system');
        return true;
      }
      case 'restore': case 'load': {
        if (w === 'load' && toks.length > 1 && resolve(norm(rest))) return false;
        const slot = rest || 'quick';
        const data = store.get('lsj-save-' + slot);
        if (!data) { say(`存档槽“${slot}”里没有存档。`, 'system'); return true; }
        S = JSON.parse(data);
        say(`已从“${slot}”读档。`, 'system');
        describeRoom();
        return true;
      }
      case 'restart': { const o = start(); out.push(...o); return true; }
      case 'undo': case 'oops': {
        if (!undoStack.length) { say('还没有可以撤销的操作。', 'system'); return true; }
        S = JSON.parse(undoStack.pop());
        say('已撤销上一步。时间倒流了，现实生活要是也能这样就好了。', 'system');
        describeRoom();
        return true;
      }
      case 'quit': case 'q': say('没有退出键，只有 RESTART 和默默叹气。', 'system'); return true;
      case 'xyzzy': say('空洞的声音说：“输错游戏了，朋友。”'); return true;
      default: return false;
    }
  }

  // ------------------------------------------------------------------ api
  function start() {
    S = newState();
    out = [];
    undoStack = [];
    say(LSJ.config.intro, 'intro');
    enterRoom(S.room);
    return flush();
  }

  function flush() {
    const o = out;
    out = [];
    return o;
  }

  function exec(raw) {
    out = [];
    const input = String(raw || '').trim();
    if (!input) return flush();
    const toks = norm(input);
    const rawToks = tokenize(input);
    if (S.dead || S.ended) {
      if (['restore', 'load', 'restart', 'undo', 'oops', 'help', 'score'].includes(rawToks[0])) meta(rawToks, input);
      else say(S.dead ? '老刘现在没法做这个。输入 RESTORE 读档、UNDO 撤销，或 RESTART 重来。' : '本幕已经结束！输入 RESTART 再玩一次。', 'system');
      return flush();
    }
    if (meta(rawToks, input)) return flush();
    if (!toks.length) { say('老刘没看懂。试试输入 HELP 查看英文指令。'); return flush(); }

    snapshot();
    let p = parse(input);
    if (!p.verb) {
      // Bare place/exit/object names: "bathroom", "costco"
      const e = findExit(toks);
      const d = findDest(toks);
      if (e) p = { verb: 'go', rest: toks, dobj: toks, iobj: [], toks };
      else if (d) p = { verb: 'go', rest: toks, dobj: toks, iobj: [], toks };
      else if (resolve(toks)) p = { verb: 'look', rest: toks, dobj: toks, iobj: [], toks: ['look', ...toks] };
      else {
        undoStack.pop();
        say(pick([
          `老刘没看懂“${input}”。输入 HELP 查看可用英文指令。`,
          `“${toks[0]}”不是老刘认识的指令。输入 HELP 查看示例。`,
          `现在还不能“${toks[0]}”。输入 HELP 查看可用操作。`,
        ]));
        return flush();
      }
    }
    S.moves += 1;
    S.minutes += 1;
    act(p);
    if (!S.dead && !S.ended) {
      const d = D(R().dest);
      if (d && d.tick) d.tick(g);
      if (!S.dead && R().tick) R().tick(g);
    }
    return flush();
  }

  const isWide = (ch) => /[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe10-\ufe6f\uff01-\uff60\uffe0-\uffe6]/u.test(ch);
  const displayWidth = (text) => Array.from(String(text)).reduce((n, ch) => n + (isWide(ch) ? 2 : 1), 0);

  // Square up boxed scenes by terminal display columns, including full-width CJK glyphs.
  function tidyArt(art) {
    const lines = String(art).split('\n');
    const top = lines.find((l) => /^ _{20,}\s*$/.test(l));
    if (!top) return art;
    const W = displayWidth(top.trimEnd()) + 1;
    return lines
      .map((l) => {
        const t = l.trimEnd();
        if (!t.startsWith('|') || !t.endsWith('|')) return l;
        let inner = t.slice(1, -1).trimEnd();
        const rail = inner.startsWith('_') && inner.endsWith('_');
        if (rail) while (displayWidth(inner) > W - 2) inner = inner.slice(0, -1);
        const width = displayWidth(inner);
        if (width > W - 2) return l;
        return '|' + inner + (rail ? '_'.repeat(W - 2 - width) : ' '.repeat(W - 2 - width)) + '|';
      })
      .join('\n');
  }

  function view() {
    const r = R();
    const objs = visibleObjects().filter((o) => !o.def.scenery).map((o) => ({ id: o.id, name: nameOf(o), command: commandOf(o.def.names, o.id) }));
    const exits = exitsOf(r).map((e) => ({ label: e.label, command: commandOf(e.names, LSJ.rooms[e.to].id) }));
    const travel = Object.values(LSJ.destinations)
      .filter((d) => S.known[d.id] && !d.comingSoon && d.id !== r.dest)
      .map((d) => ({ id: d.id, name: d.short || d.name, command: commandOf(d.names, d.id) }));
    return {
      score: S.score,
      maxScore: maxScore(),
      time: fmtTime(S.minutes),
      money: fmtMoney(S.money),
      title: r.title,
      dest: r.dest,
      art: tidyArt(val(r.art, g)),
      objects: objs,
      exits,
      travel,
      dead: S.dead,
      ended: S.ended,
    };
  }

  LSJ.Engine = {
    start,
    exec,
    view,
    parse,
    get state() { return S; },
    set state(v) { S = v; },
    api: g,
    fmtTime,
  };
})(typeof window !== 'undefined' ? window : globalThis);
