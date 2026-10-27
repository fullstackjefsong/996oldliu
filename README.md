# 大厂白领社畜老刘

一款复古 CRT 风格的中文纯键盘文字冒险。故事发生在无限对齐科技、青年人才公寓和山姆会员店。老刘要在周五下班前领到工资、修好车、洗净衬衫，给周六的同学聚会留点体面。

**在线游玩：** https://fullstackjefsong.github.io/996oldliu/

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

游戏使用原有的实时合成 FM 配乐、音效和谜题结构。音乐旋律与视觉风格不变，曲名和玩家可见文案已本地化。
