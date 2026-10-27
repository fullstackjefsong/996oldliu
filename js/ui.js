(function () {
  'use strict';
  const E = LSJ.Engine;
  const $ = (id) => document.getElementById(id);
  const log = $('log');
  const cmd = $('cmd');
  const history = [];
  let hIdx = 0;
  let onTitle = true;

  function print(text, cls) {
    const p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    log.appendChild(p);
    while (log.childNodes.length > 300) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
  }

  function printAll(outputs) {
    for (const o of outputs) if (o.type !== 'sfx') print(o.text, o.type === 'text' ? '' : o.type);
  }

  // ------------------------------------------------------------- sound
  const A = LSJ.Audio;
  const themeFor = (dest) => LSJ.music.themes[dest] || 'title';
  const songName = () => (A.playing && LSJ.music.songs[A.playing] ? LSJ.music.songs[A.playing].name : null);

  function soundtrack(outputs) {
    for (const o of outputs) if (o.type === 'sfx') A.sfx(o.text);
    const has = (t) => outputs.some((o) => o.type === t);
    const v = E.view();
    if (v.dead) { if (has('death')) A.playMusic('death', { loop: false }); return; }
    if (v.ended) { if (has('end')) A.playMusic('fanfare', { loop: false, then: 'title' }); return; }
    if (has('intro')) A.playMusic('title', { loop: false, then: themeFor(v.dest) });
    else A.playMusic(themeFor(v.dest));
    if (has('score')) A.jingle('points');
  }

  function updateSoundButton() {
    const on = A.settings.music || A.settings.sfx;
    const b = $('snd');
    b.textContent = on ? '\u266A 声音开' : '\u266A 声音关';
    b.classList.toggle('off', !on);
  }

  function audioCommand(input) {
    const m = /^\s*(music|sfx|sound|sounds|volume|vol)\b\s*(.*)$/i.exec(input);
    if (!m) return false;
    const what = m[1].toLowerCase();
    const arg = m[2].trim().toLowerCase();
    const on = arg === 'on' ? true : arg === 'off' ? false : null;
    if (arg && on === null && !what.startsWith('vol')) return false;
    print('> ' + input.toUpperCase(), 'echo');
    A.unlock();
    if (what.startsWith('vol')) {
      const n = parseInt(arg, 10);
      if (!isNaN(n)) A.setVolume(n);
      print(`音量：${A.settings.volume}/10。${isNaN(n) ? '输入 VOLUME 0-10 调节。' : ''}`, 'system');
    } else if (what === 'music') {
      const v = on === null ? !A.settings.music : on;
      A.setMusic(v);
      print(v ? '音乐已开启。' + (songName() ? ` \u266A 正在播放：《${songName()}》` : '') : '音乐已关闭。老刘改为自己哼歌。', 'system');
    } else if (what === 'sfx') {
      const v = on === null ? !A.settings.sfx : on;
      A.setSfx(v);
      print(v ? '音效已开启。' : '音效已关闭。', 'system');
    } else {
      const v = on === null ? !(A.settings.music || A.settings.sfx) : on;
      A.setMusic(v);
      A.setSfx(v);
      print(v ? '音乐和音效已开启。' : '音乐和音效已关闭。终于清静了。', 'system');
    }
    updateSoundButton();
    return true;
  }

  function chip(label, onClick) {
    const s = document.createElement('span');
    s.className = 'chip';
    s.textContent = label;
    s.addEventListener('click', onClick);
    return s;
  }

  function fillChips(el, items, labelOf, onClick) {
    el.innerHTML = '';
    if (!items.length) { el.textContent = '（无）'; return; }
    items.forEach((it, i) => {
      if (i) el.appendChild(document.createTextNode(', '));
      el.appendChild(chip(labelOf(it), () => onClick(it)));
    });
  }

  function insertNoun(name) {
    cmd.value = cmd.value.trim() ? cmd.value.trimEnd() + ' ' + name : 'look at ' + name;
    cmd.focus();
  }

  function tokenLabel(item) {
    const label = item.name || item.label;
    return item.command ? `${label} (${item.command.toUpperCase()})` : label;
  }

  function render() {
    const v = E.view();
    $('st-score').textContent = `得分：${v.score}/${v.maxScore}`;
    $('st-right').textContent = `${v.time}  ${v.money}`;
    const art = $('art');
    art.classList.toggle('death', !!v.dead);
    if (v.dead) art.textContent = LSJ.config.deathArt + '\n\n' + centered(v.dead.title);
    else if (v.ended) art.textContent = LSJ.config.endArt;
    else art.textContent = v.art.replace(/^\n/, '');
    $('loc').textContent = v.dead ? '*** 游戏结束 ***' : v.title;
    fillChips($('see'), v.objects, tokenLabel, (o) => insertNoun(o.command));
    fillChips($('exits'), v.exits, tokenLabel, (e) => run('go ' + e.command));
    fillChips($('travel'), v.travel, tokenLabel, (t) => run('go to ' + t.command));
  }

  function centered(s) {
    const pad = Math.max(0, Math.floor((60 - s.length) / 2));
    return ' '.repeat(pad) + s;
  }

  function showTitle() {
    onTitle = true;
    $('art').textContent = LSJ.config.titleArt.replace(/^\n/, '');
    $('loc').textContent = '一款中文文字冒险游戏';
    $('see').textContent = '';
    $('exits').textContent = '';
    $('travel').textContent = '';
    $('st-score').textContent = '';
    $('st-right').textContent = '';
    print('按 ENTER 开始新游戏；输入 RESTORE 读取快速存档。', 'system');
    print('只需输入英文指令，不用中文输入法。常用：LOOK、TAKE、GO TO、TALK TO、HELP。', 'system');
    print('本游戏保留复古 FM 配乐。输入 SOUND OFF 或点击右侧音符按钮可静音。', 'system');
  }

  function run(input) {
    if (audioCommand(input)) return;
    if (onTitle) {
      onTitle = false;
      log.innerHTML = '';
      const out = E.start();
      if (/^\s*(restore|load)\b/i.test(input)) out.push(...E.exec(input));
      printAll(out);
      render();
      soundtrack(out);
      return;
    }
    if (!input.trim()) return;
    print('> ' + input.toUpperCase(), 'echo');
    const out = E.exec(input);
    printAll(out);
    render();
    soundtrack(out);
  }

  function wake() {
    A.unlock();
    if (onTitle && !A.playing) A.playMusic('title');
  }
  document.addEventListener('pointerdown', wake);

  $('snd').addEventListener('click', () => {
    A.unlock();
    const v = !(A.settings.music || A.settings.sfx);
    A.setMusic(v);
    A.setSfx(v);
    if (v && onTitle) A.playMusic('title');
    updateSoundButton();
    cmd.focus();
  });

  cmd.addEventListener('keydown', (e) => {
    wake();
    if (e.key === 'Enter') {
      const v = cmd.value;
      cmd.value = '';
      if (v.trim()) { history.push(v); hIdx = history.length; }
      run(v);
    } else if (e.key === 'ArrowUp') {
      if (hIdx > 0) { hIdx -= 1; cmd.value = history[hIdx]; }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (hIdx < history.length - 1) { hIdx += 1; cmd.value = history[hIdx]; } else { hIdx = history.length; cmd.value = ''; }
      e.preventDefault();
    }
  });

  document.addEventListener('click', (e) => {
    if (!window.getSelection().toString() && !e.target.classList.contains('chip')) cmd.focus();
  });

  showTitle();
  updateSoundButton();
  cmd.focus();
})();
