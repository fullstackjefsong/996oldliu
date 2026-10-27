(function () {
  'use strict';
  const L = LSJ;

  L.addRoom({
    id: 'work_lobby', dest: 'work', title: '无限对齐科技大堂', names: ['lobby', 'reception', 'front desk'],
    art: String.raw`
 ________________________________________________________________________
|         无限对齐科技                       .-------------------------. |
|  “把明天的对齐提前到今天”                 |        团队协作         | |
|                                           | 一个人犯傻是错误，       | |
|       ___                                 | 一群人犯傻叫共识。       | |
|      (o.o)  小佩         .-------.          '-------------------------' |
|   ____\-/____________    |  [=]  |                  顾问      顾问     |
|  | “请稍候。”       |   |       |                (o_o)     (o_o)      |
|  |___________________|   |   >   | 电梯           /|##|\    /|##|\      |
|  |                   |   |       | 通工位          _|  |______|  |_      |
|  |___________________|   '-------'               |__组织效能顾问_|      |
|________________________________________________________________________|
                [ 玻璃门 ]  --> 公交站，前往家或山姆`,
    desc: (g, first) =>
      '无限对齐科技的大堂，梦想来这里接受编制优化。前台小佩戴着耳机。' +
      '两位组织效能顾问穿着同款马甲，拿着夹板坐在沙发上。墙上挂着团队协作海报。' +
      '电梯通往工位，玻璃门外是42路公交站。',
    objects: {
      peggy: {
        name: '小佩', person: true, names: ['peggy', 'receptionist', 'woman', 'lady', 'front desk', 'desk'],
        desc: '小佩守前台二十二年。她的耳机、发型与声音都经过了长期稳定性验证。',
        verbs: {
          talk: (g) => {
            g.award('talk_peggy');
            return '“无限对齐科技，请稍候。”她按一下按钮，你当面进入了等待队列。音乐过后，她抬头：“哦，老刘。王总在催周报，说有个新版封面通知。”';
          },
          flirt: '你靠在前台试图散发成熟魅力。她又按了一下按钮，等待音乐这次更响了。',
          kick: '小佩掌握所有电话。小佩掌握一切。别。',
        },
        receive: {
          tps_report: '“材料交王总，我只负责转接。请稍候。”',
          cake: '“我在控糖，给真正需要的人吧。”她看向工位区。',
        },
      },
      todds: {
        name: '两位组织效能顾问', person: true, names: ['todds', 'todd', 'consultants', 'consultant', 'men', 'guys', 'vests'],
        desc: '同款抓绒马甲、同款笑容，同款“不会影响大家”。两人都说自己负责赋能，没人能分清谁负责最后那封通知。',
        verbs: {
          talk: (g) => {
            g.award('talk_todds');
            return '“老刘，简单聊聊，平时具体做什么？”你说：参加讨论下次会议的会议，再把邮件转给本来已经被抄送的人。一位顾问慢慢点头：“所以你是……人工转发中台。”另一位在夹板写下“协同冗余”，画了两道线。';
          },
          flirt: '两位同时低头记笔记。这件事会出现在某次你不知道的评审里。',
          kick: '把顾问踢出去，是让自己先离开的高效方式。',
        },
      },
      poster: {
        name: '团队协作海报', names: ['poster', 'motivational poster', 'teamwork', 'sign'],
        desc: '团队协作：一个人犯傻是错误，一群人犯傻叫共识。人力部门觉得这很励志，人力部门偶尔也需要帮助。',
        verbs: { take: '螺栓固定，管理层预判了你的管理建议。' },
      },
      elevator: {
        name: '电梯', scenery: true, names: ['elevator', 'lift', 'button'],
        desc: '通往工位层。检验贴纸早过期了，它仍凭职业惯性坚持运行。',
        verbs: { use: (g) => g.goto('work_cubes'), push: (g) => g.goto('work_cubes') },
      },
      bus_stop_w: {
        name: '公交站', scenery: true, names: ['bus stop', 'bus', 'glass doors', 'doors', 'stop'],
        desc: '玻璃门外是42路公交站，每次2.00元。TAKE BUS TO HOME 回家，TAKE BUS TO COSTCO 去山姆。',
      },
    },
    exits: [{ to: 'work_cubes', label: '工位', sfx: 'ding', names: ['cubicles', 'cubicle', 'cubes', 'elevator', 'upstairs', 'up', 'in', 'inside', 'my desk'] }],
  });

  L.addRoom({
    id: 'work_cubes', dest: 'work', title: '无限对齐科技工位区', names: ['cubicles', 'cubicle', 'cubes', 'cubicle farm', 'my desk', 'desk'],
    art: (g) => String.raw`
  ______________     ______________     _____________     _______________
 |  老刘        |   |  老莫        |   | （已优化）  |   |  王总         |
 |  工位        |   |  工位        |   |             |   |  办公室       |
 |    ______    |   |    .---.     |   |   蜘蛛网    |   |  .---------.  |
 |   |:::::|    |   |   ( -_- )    |   |   ~ ~ ~ ~   |   |  | 差不多 |  |
 |   |_____|电脑|   |   /|   |\    |   |             |   |  | 好领导 |  |
 |   /_____\    |   |    ${g.flag('stapler_lent') ? '[      ]' : '[订书机]'} |   |   一盆      |   |  |        |  |
 | ${g.has('tps_report') || g.flag('report_given') ? '      ' : '[周报]'} [通知]|   |    老莫      |   |   枯树      |   |  '---------'  |
 |______________|   |______________|   |_____________|   |______________|
       <-- 大堂（电梯）                                  茶水间 -->`,
    desc: (g) =>
      '灰色隔板组成一片工位迷宫，梦想在这里被拆成季度目标。你的桌上有电脑' +
      (g.has('tps_report') || g.flag('report_given') ? '和通知。' : '、通知，以及尚未拿走的周报。') +
      '隔壁的老莫弓着背' + (g.flag('stapler_lent') && !g.flag('stapler_returned') ? '，盯着桌上的空位，像在等一个永远不回消息的人。' : '，守着他的橙色订书机。') +
      '旁边有个空工位，自从上一轮“组织升级”后就一直空着。王总办公室在走道尽头，转角是茶水间，电梯通往大堂。',
    objects: {
      computer: {
        name: '电脑', names: ['computer', 'pc', 'monitor', 'screen', 'keyboard', 'terminal', 'email', 'inbox', 'cover sheet template'],
        desc: '一台被公司当成固定资产传承的旧电脑。收件箱有147封未读邮件，全是围绕“谁在茶水间热鱼”的全员回复。桌面上有《新版周报封面》。',
        verbs: {
          use: (g) => {
            if (g.flag('tps_stapled') || g.has('cover_sheet') || g.flag('cover_in_tray')) return '封面已经打印过了。别再浪费纸，这里的纸还兼职承重。';
            if (g.flag('print_queued')) return '封面已经在打印队列里。打印机还在等纸。';
            g.sfx('printer'); g.award('print_cover');
            if (g.flag('printer_loaded')) {
              g.set('cover_in_tray');
              return '你点击打印。走廊那边传来运转声，封面已经在茶水间等你。';
            }
            g.set('print_queued');
            return '你打开新版封面模板，点击打印。弹窗提示：打印失败，请装入纸张。你盯着它看了半天。打印机在茶水间。';
          },
          read: '主题：关于鱼的回复的回复的回复。正文只有：“如我上一封邮件所述。”剩下146封你不看了。',
          kick: '显示器闪了一下，弹出纸牌胜利动画。连电脑都知道你想摸鱼。',
        },
      },
      solitaire: {
        name: '纸牌', scenery: true, names: ['solitaire', 'game', 'cards', 'minesweeper'],
        desc: '纸牌：数字化生产力的隐形底座。',
        verbs: {
          use: (g) => { g.sfx('beep'); g.award('solitaire'); g.advance(10); return '你快速打了一局纸牌，赢了。十分钟过去，这是你本周最有成就感的十分钟。'; },
        },
      },
      tps_desk: {
        name: '周报', names: ['tps report', 'report', 'tps', 'tps reports'],
        hidden: (g) => g.has('tps_report') || g.flag('report_given'),
        desc: '四十页没人会看的数字。按通知要求，必须附上新版封面。',
        verbs: {
          take: (g) => { g.give('tps_report'); g.award('take_report'); return '你拿起周报。它还有点热，可能来自阳光、暖气，也可能来自羞耻。'; },
        },
      },
      memo: {
        name: '通知', names: ['memo', 'note', 'paper memo', 'notice'],
        desc: '发件人：王总，组织协同副总裁。主题：周报格式升级。\n即日起，所有周报必须装订新版封面。模板已放在各位电脑上。未按要求提交者，将进行一次深入沟通。收到请回复。\n附：本周工资在收到合规周报后发放。',
        verbs: {
          read: (g) => { g.award('read_memo'); return L.rooms.work_cubes.objects.memo.desc; },
          look: (g) => { g.award('read_memo'); return L.rooms.work_cubes.objects.memo.desc; },
          take: '你不需要带走通知。你已经无法摆脱它。通知是一种精神状态。',
        },
      },
      merv: {
        name: '老莫', person: true, names: ['merv', 'mervin', 'coworker', 'guy', 'man', 'mervs cubicle'],
        desc: (g) =>
          '老莫的工龄比这栋楼还长。厚眼镜、短袖衬衫、胸前插笔。' +
          (g.flag('stapler_lent') ? '他不安地望着桌上原本放订书机的位置。' : '他抱着橙色订书机，像抱着最后一项不会被外包的技能。'),
        verbs: {
          talk: (g) => {
            if (g.flag('stapler_returned')) return '“你真的还回来了。别人借走的东西，从来不回来了。”你可能意外获得了一段终身同事情谊。';
            if (g.flag('stapler_lent')) return '“你……会还的吧？订书机？他们上次也说只是临时借调……”他望向天花板。';
            return '“……工位搬了四次……以前靠窗……今天小戴过生日，有蛋糕。没人给我。一直都没人给我……订书机也别想拿走。”他又抱紧了一点。';
          },
          flirt: '老莫连人带椅子慢慢挪远，每一声滚轮响都像拒绝。',
          kick: '你想踢椅子，又看见他的眼神。这个需求的潜在影响范围可能是整栋楼。算了。',
        },
        receive: {
          cake: (g) => {
            g.lose('cake');
            g.set('stapler_lent');
            g.give('stapler');
            g.award('merv_stapler');
            return '老莫看看蛋糕，又看看你。“给……我的？还是奶油最多的边角？”他分四口吃完，郑重递出橙色订书机。“借。只是借。我还要用的。”';
          },
          stapler: (g) => {
            g.lose('stapler');
            g.set('stapler_returned');
            g.award('return_stapler');
            return '你把订书机还给老莫。他轻轻吸了口气，像见到失散多年的亲人。“真的还了……”十一年来，他第一次在工位上笑了。';
          },
          tps_report: '“这个找王总。什么都要交给王总，然后就再也没消息。”老莫打了个寒战。',
        },
      },
      merv_stapler: {
        name: '橙色订书机', names: ['stapler', 'orange stapler', 'mervs stapler', 'swingline'],
        hidden: (g) => g.flag('stapler_lent') && !g.flag('stapler_returned'),
        desc: '沉甸甸的橙色订书机，老莫的骄傲，整层楼唯一能用的订书机。',
        verbs: {
          take: (g) =>
            g.flag('stapler_returned')
              ? '已经借过一次了，别透支信用。老莫的眼皮开始跳。'
              : '你刚伸手，老莫喉咙里就响起一阵受伤路由器般的低鸣。先给他一点善意吧。',
          use: '老莫不让你动。没有蛋糕，不谈共享资源。',
        },
      },
      empty_cube: {
        name: '空工位', scenery: true, names: ['empty cubicle', 'downsized', 'ficus', 'plant', 'cobwebs', 'empty'],
        desc: '这里以前坐着小高，直到两位组织效能顾问来访。现在只剩一盆发蔫的绿植，以及一张纸条：“长期离线，已完成组织毕业。”',
      },
    },
    exits: [
      { to: 'work_lobby', label: '大堂', sfx: 'ding', names: ['lobby', 'elevator', 'down', 'downstairs', 'out', 'reception'] },
      { to: 'work_break', label: '茶水间', names: ['break room', 'breakroom', 'kitchen', 'kitchenette', 'printer room', 'lounge'] },
      { to: 'work_boss', label: '王总办公室', names: ['brumleys office', 'boss', 'bosss office', 'boss office', 'office', 'brumley'] },
    ],
  });

  L.addRoom({
    id: 'work_break', dest: 'work', title: '无限对齐科技茶水间', names: ['break room', 'breakroom', 'kitchen'],
    art: (g) => String.raw`
 ________________________________________________________________________
| ** 周五强制快乐！出勤留痕 **                               .--------. |
|                                                             | 公告栏 | |
|  .-------------.     .--------.     ${g.flag('cake_taken') ? '               ' : '  __[蛋糕]__   '}       |        | |
|  |   打印机    |     |  冰箱  |     ${g.flag('cake_taken') ? '   （碎屑）    ' : ' | 生日快乐|   '}       |  徽章  | |
|  | ${g.flag('printer_loaded') ? '   就绪    ' : '   缺纸    '} |     |  “勿  |     ${g.flag('cake_taken') ? '               ' : ' |__ 小戴 _|   '}       '--------' |
|  |  [_______]  |     |   动” |    ========================               |
|  |_____________|     |        |           台面              咖啡        |
|                      |________|                             [__]~ 陈年  |
|                                                         ${g.flag('table_down') ? '  ___________   ' : ' _|________|_   '}  |
|                                                         ${g.flag('table_down') ? ' /__/_____\\__\\  ' : ' |  瘸腿桌 |   '}  |
|                                                         ${g.flag('table_down') ? '   （已塌）     ' : ' |__[ 纸 ]_|   '}  |
|________________________________________________________________________|`,
    desc: (g) =>
      '横幅写着“周五强制快乐，出勤留痕”。角落里的打印机' +
      (g.flag('printer_loaded') ? '满意地嗡嗡响，暂时没有新的需求。' : '闪着缺纸提示。') +
      '冰箱贴满情绪稳定但措辞激烈的便条，' +
      (g.flag('cake_taken') ? '台面只剩碎屑，福利领取完毕。' : '台面上有生日蛋糕，') +
      '旁边是咖啡壶和公告栏。' +
      (g.flag('table_down') ? '桌子塌成了一件现代艺术作品。' : '一张瘸腿桌正靠整包打印纸维持平衡。'),
    objects: {
      printer: {
        name: '打印机', names: ['printer', 'copier', 'laser printer', 'pc load letter', 'error', 'paper tray', 'tray'],
        desc: (g) =>
          g.flag('printer_loaded')
            ? '打印机正在安静运转。暂时。'
            : '庞大的办公打印机，屏幕反复提示缺纸，纸盒里空空如也。',
        verbs: {
          kick: (g) => {
            g.sfx('clunk'); g.award('kick_printer');
            return '你深呼吸，踢一下，再踢一下。脑内响起反抗职场的节奏。爽了，打印机仍然缺纸。它需要耗材，不需要心理疏导。';
          },
          open: (g) => (g.flag('printer_loaded') ? '纸盒满着。人生难得有个东西状态正常。' : '空的。原来缺纸就是缺纸，老刘完成了一次高质量问题定位。'),
          use: (g) => (g.flag('printer_loaded') ? '能用了。回工位从电脑发送打印任务。' : '先装纸。光有主人翁精神不行。'),
        },
        receive: {
          paper: (g) => {
            g.lose('paper');
            g.set('printer_loaded');
            g.sfx('printer'); g.award('load_printer');
            if (g.flag('print_queued')) {
              g.unset('print_queued');
              g.set('cover_in_tray');
              return '你装入整包纸，机器思考了一下，终于吐出新版周报封面，温热而自满。';
            }
            return '缺纸提示消失，屏幕显示就绪。现在回工位打印封面。';
          },
        },
      },
      tray_cover: {
        name: '周报封面', names: ['cover sheet', 'cover', 'sheet', 'printout', 'cover page'],
        hidden: (g) => !g.flag('cover_in_tray') || g.has('cover_sheet') || g.flag('tps_stapled'),
        desc: '你的新版周报封面躺在出纸托盘里。',
        verbs: {
          take: (g) => { g.give('cover_sheet'); g.unset('cover_in_tray'); g.award('get_cover'); return '你取出封面，仍然温热，像刚出炉的流程饼干。'; },
        },
      },
      table: {
        name: '瘸腿桌', names: ['table', 'wobbly table', 'leg'],
        desc: (g) => (g.flag('table_down') ? '后勤预计六到八个工作季度内修复，请耐心等待。' : '廉价贴面桌，短了一条腿，整包打印纸替它承担了编外岗位。'),
        verbs: { push: '它晃了晃。下面那包纸是唯一的稳定性保障。', sit: '桌子发出风险预警，你立即站起来。' },
      },
      paper_ream: {
        name: '一包打印纸', names: ['paper', 'ream', 'ream of paper', 'printer paper', 'letter paper', 'letter'],
        hidden: (g) => g.flag('table_down'),
        desc: '整包打印纸，正垫在桌子的短腿下面。',
        verbs: {
          take: (g) => {
            g.set('table_down');
            g.give('paper');
            g.sfx('crash');
            return '你抽出纸包，桌子认真思考了自己的使命，随后轰然倒地。某位后勤负责人忽然心头一紧。你获得一包打印纸。';
          },
        },
      },
      cake: {
        name: '生日蛋糕', names: ['cake', 'birthday cake', 'sheet cake', 'slice', 'slice of cake'],
        hidden: (g) => g.flag('cake_taken'),
        desc: '超市蛋糕上写着“小戴生日快乐”。没人知道小戴坐哪儿。还剩一块奶油最多的边角。',
        verbs: {
          take: (g) => { g.set('cake_taken'); g.give('cake'); g.award('take_cake'); return '你拿走最后一块蛋糕。小戴，生日快乐，虽然不知道你是谁。'; },
          eat: '你决定先留着，说不定有人更需要。老刘未必节俭，但也不总是乱吃。',
        },
      },
      fridge_w: {
        name: '冰箱', names: ['fridge', 'refrigerator', 'note', 'notes', 'freezer'],
        desc: '便条写着：“这里不是你家，吃完请收拾。”“拿我酸奶的人：我知道。”“小郭，鱼不是微波炉食品。”',
        verbs: { open: (g) => { g.set('fridge_open_w'); return '里面有一杯草莓酸奶，标签写着“陈姐的，不许吃，我数过了”，另有一盒已经发展出自主管理能力的剩菜。'; } },
      },
      yogurt: {
        name: '陈姐的酸奶', names: ['yogurt', 'karens yogurt', 'strawberry yogurt', 'tupperware'],
        hidden: (g) => !g.flag('fridge_open_w'),
        desc: '“陈姐的，不许吃，我数过了。”笔画里全是未发送的群消息。',
        verbs: {
          take: (g) => L.rooms.work_break.objects.yogurt.verbs.eat(g),
          eat: (g) => g.die('陈姐知道了', '你撕开酸奶盖，刚吃一口，茶水间就刮起一阵冷风，灯闪了。身后传来一句：“谁动了我的东西？让你负责人来。”\n\n此后再没人见过老刘。人力系统将离线原因登记为“酸奶归属争议”。'),
        },
      },
      coffee: {
        name: '咖啡壶', names: ['coffee', 'coffee pot', 'pot', 'coffee maker', 'mug', 'java', '1997'],
        desc: '牌子写着“新鲜咖啡，请勿倒掉”，落款是多年前。咖啡已形成独立意识，并要求参与绩效评审。',
        verbs: {
          drink: (g) => g.die('这杯不是续命', '咖啡不是倒出来的，是缓缓爬出来的。你抿一口，心跳开始发送求救电报码。隧道尽头有光——原来是打印机屏幕，提示：“请装入老刘。”'),
          take: '按资产盘点口径，它已经是建筑的一部分。',
          smell: '焦硬币和上一个技术周期的味道。',
        },
      },
      bulletin: {
        name: '公告栏', names: ['bulletin board', 'board', 'bulletin', 'flyer', 'flyers', 'notices', 'memos'],
        desc: (g) =>
          '“因小郭的行为，花衬衫日取消。”“寻物：红色订书机，不是老莫的，老莫的是橙色。”“文化徽章十五枚是最低要求。”' +
          (g.flag('flair_taken') ? '' : '板上还别着一枚备用文化徽章。'),
      },
      flair_board: {
        name: '企业文化徽章', names: ['flair', 'button', 'flair button', 'pin', 'badge'],
        hidden: (g) => g.flag('flair_taken'),
        desc: '“我爱对齐”圆徽章，唯一的好处是不用扫码。',
        verbs: { take: (g) => { g.set('flair_taken'); g.give('flair'); return '你拿到一枚。最低要求十五枚，你已有一枚。进度可视化了。'; } },
      },
    },
    exits: [{ to: 'work_cubes', label: '工位', names: ['cubicles', 'cubicle', 'cubes', 'out', 'back', 'my desk'] }],
  });

  L.addRoom({
    id: 'work_boss', dest: 'work', title: '无限对齐科技王总办公室', names: ['brumleys office', 'boss office', 'bosss office'],
    art: String.raw`
 ________________________________________________________________________
|  .-------------------.                      .------------------------. |
|  |      窗户         |       ,----,         | 本月优秀员工：         | |
|  |    （窗外是       |      / __  \         |        王总            | |
|  |     停车场）      |     | (o)(o)|        | （已连任十二个月）     | |
|  |___________________|      \  -- /         '------------------------' |
|                         ___/|____|\___                                  |
|         /\              |   背带     |          .---.                   |
|        /  \ 高尔夫      |____________|          |杯子| “差不多好领导”  |
|       |推杆| ___________|__________|__________ '---'                    |
|        \__/  |          王总办公桌           |                         |
|______________|_______________________________|__________________________|`,
    desc: '王总躺在皮椅里，穿着背带，拿着印有“差不多好领导”的杯子。角落靠着高尔夫球杆，窗外是停车场。这里最大的工作成果是让你站着等。',
    objects: {
      brumley: {
        name: '王总', person: true, names: ['brumley', 'bill', 'bill brumley', 'boss', 'manager'],
        desc: '王总说“嗯，是这样”时，你的灵魂会自动打开离职申请。他有一种从未亲手干过活的人才有的镇定。',
        verbs: {
          talk: (g) => {
            if (g.flag('paid')) return '“对了，明天周六，九点来简单同步一下，不会占用你太多休息时间。”你不回答。有些战斗留到第二幕。';
            if (g.flag('tps_stapled')) return '“嗯，这就是周报？封面也有？先交过来，工资再说。”';
            return '“嗯，是这样，老刘。周报得交一下，要新版封面。通知看了吧？没看我让小佩再发一遍。工资嘛，材料齐了就走流程。理解一下。”';
          },
          flirt: '“这个互动方式不太合适。”他在便利贴上记了一笔，贴到你的档案上。',
          kick: '你在脑中完成了动作，而且回放了好几遍。但工资还在他手里。',
        },
        receive: {
          tps_report: (g) => {
            if (!g.flag('tps_stapled')) return '王总叹气。“现在所有周报都要新版封面。你先把格式对齐，我们再谈下一步。”他把周报退回来。';
            g.lose('tps_report');
            g.set('report_given');
            g.set('paid');
            g.earn(25000);
            g.sfx('cash'); g.award('paid');
            return '王总举起封面，对着光看了看，又闻了闻。“嗯，是封面。”他把周报扔进标着“待碎纸”的抽屉，递给你一个信封。“本周工资走现金，别问。”\n\n里面是250.00元！［现金：+250.00元］\n\n“老刘，这衬衫挺有特色。胸前那块……是工牌？”';
          },
          cake: '“我控糖，最近在做身体管理。你们也要有自驱力。”',
          stapler: '“这是老莫的吧？赶紧还，别把简单的事搞成重大风险。”',
        },
      },
      putter: {
        name: '高尔夫球杆', names: ['putter', 'golf club', 'club', 'golf', 'putt'],
        desc: '镀金推杆。你汇报绩效时，王总会练习短推，仿佛你的职业发展是一块练习草坪。',
        verbs: { take: '“这个先放下。”你还没碰，他已经知道。' },
      },
      mug: {
        name: '杯子', scenery: true, names: ['mug', 'cup', 'okayest', 'worlds okayest boss'],
        desc: '“差不多好领导”。他自己买的，而且是真心的。',
        verbs: { take: '王总握紧杯柄。“这个不行。”' },
      },
      window_b: {
        name: '窗户', scenery: true, names: ['window', 'view', 'parking lot'],
        desc: '停车场景色极佳。王总的豪车横跨三个车位，空间利用率也有自己的管理口径。',
      },
      plaque: {
        name: '优秀员工奖牌', scenery: true, names: ['plaque', 'employee of month', 'employee'],
        desc: '本月优秀员工：王总。连任十二个月。评选委员会主任也是王总。',
      },
    },
    exits: [{ to: 'work_cubes', label: '工位', names: ['cubicles', 'cubicle', 'cubes', 'out', 'back', 'leave'] }],
  });
})();
