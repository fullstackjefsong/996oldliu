# 大厂白领社畜老刘

一款采用 EGA 风格像素插画与复古 CRT 界面的中文纯键盘冒险。故事发生在无限对齐科技、青年人才公寓和山姆会员店。老刘要在周五下班前领到工资、修好车、洗净衬衫，给周六的同学聚会留点体面。

**在线游玩：** https://fullstackjefsong.github.io/996oldliu/

**完全攻略：** [《电子游戏天地》1993年11月号·攻略秘技](https://fullstackjefsong.github.io/996oldliu/walkthrough.html)（仿九十年代初国内游戏杂志的130分满分攻略，附 EGA 截图和戏仿广告）

**用户使用手册：** [《大厂白领社畜老刘》用户使用手册](https://fullstackjefsong.github.io/996oldliu/manual.html)（仿九十年代初国产软件说明书，附漫画插图；只给提示、不剧透，照着想就能拿满130分）

## 怎么玩

画面和剧情使用简体中文，操作输入英文指令。无需中文输入法。点击画面下方的物品、出口或地点，会自动填入可用的英文代号。

常用指令：

- `HELP`：查看中文操作指南
- `LOOK`、`LOOK AT MEMO`、`READ MEMO`：观察房间、物品和通知
- `TAKE REPORT`、`OPEN CABINET`、`SEARCH COUCH`：拿取、打开和搜寻
- `TALK TO MERV`、`GIVE CAKE TO MERV`：交谈和交付物品
- `GO CUBICLES`：在当前地点步行；`GO TO HOME`：跨区前往
- `TAKE BUS TO SAM`：坐公交；修好车后可用 `DRIVE TO WORK`
- `INVENTORY`、`SCORE`、`TIME`、`MAP`、`HINT`：查看状态和提示
- `SAVE`、`RESTORE`、`UNDO`、`RESTART`：存档、读档、撤销和重来
- `MUSIC ON/OFF`、`SFX ON/OFF`、`SOUND ON/OFF`、`VOLUME 0-10`：控制声音

## 本地运行与测试

在浏览器中打开 `index.html` 即可游玩。运行完整流程和回归测试：

```text
node test/walkthrough.js
```

## 像素画面

标题、全部12个房间、死亡与结局均使用固定16色 EGA 调色板。画面由 JavaScript 在320×200像素的 Canvas 中逐像素绘制，以4:3比例和最近邻方式显示，模拟老式显示器的非方形像素；这是 EGA 风格插画，不是原版 Sierra 引擎的硬件仿真。

插画不依赖字体、图片下载或动画。拿走物品、打开柜门、打印封面、修车等操作会改变场景；文字说明与英文操作提示继续显示在画面下方，手机也能完整显示插画。渲染代码位于 `js/graphics.js`，同一测试命令会检查场景覆盖、16色限制和关键状态变化。

游戏保留原有的实时合成 FM 配乐、音效、谜题结构和英文解析器。曲名和玩家可见文案已本地化。
