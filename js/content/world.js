(function () {
  'use strict';
  const L = LSJ;

  L.configure({
    startRoom: 'work_cubes',
    startMoney: 1275,
    startMinutes: 14 * 60 + 30,
    startInventory: ['suit', 'wallet', 'keys', 'costco_card'],
    carStart: 'home',
    costcoClose: 20 * 60 + 30,
    titleArt: String.raw`
 ________________________________________________________________________
|                                                                        |
|                       大厂白领社畜老刘                                 |
|                                                                        |
|                    第一幕：消失的工资条                                |
|                                                                        |
|               格子间里谈理想，到账短信最响亮。                          |
|                                                                        |
|                       纯键盘摸鱼冒险                                   |
|________________________________________________________________________|`,
    deathArt: String.raw`

                         _____________
                        /             \
                       /    安 息      \
                      |                 |
                      |      老刘       |
                      |   已停止响应    |
                      |   请勿再拉群    |
                      |                 |
                 _____|_________________|_____
                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
    endArt: String.raw`
 ________________________________________________________________________
|                                                                        |
|                           第一幕结束                                   |
|                                                                        |
|                  工资到账，车能启动，衬衫洗净。                        |
|                  老刘终于可以不用假装在线了。                          |
|                                                                        |
|                      第二幕：周六还要对齐？                            |
|                            敬请期待                                    |
|________________________________________________________________________|`,
    intro:
      '大厂白领社畜老刘\n第一幕：消失的工资条\n\n' +
      '周五下午两点半，无限对齐科技。明晚八点就是周六晚同学聚会，' +
      '四十四岁的老刘，穿着格子衬衫，准备向同学们证明自己过得还行。\n\n' +
      '小问题：二手代步车电瓶报废了，衬衫上有块工牌形状的螺蛳粉污渍，兜里只有12.75元。' +
      '王总还没发这周的工资。\n\n' +
      '领工资、修好车、洗净衬衫，再睡个好觉。输入 HELP 查看操作；实在卡住就输入 HINT。',
    helpText:
      '玩法：只输入英文指令和界面括号里的英文代号，全程不用切换中文输入法。\n' +
      '观察：LOOK 看房间；LOOK AT MEMO 或 READ MEMO 看通知；INVENTORY（I）看背包。\n' +
      '步行：GO CUBICLES 去工位；GO BREAK ROOM 去茶水间；GO OFFICE 去王总办公室。\n' +
      '跨区：GO TO HOME 回家，GO TO WORK 去公司，GO TO SAM 去山姆（COSTCO 也有效）。\n' +
      '  TAKE BUS TO COSTCO 坐公交（每次2元）；修车后 DRIVE TO HOME 可免费开车。\n' +
      '交流：TALK TO MERV 找老莫聊天；GIVE CAKE TO MERV 把蛋糕交给老莫。\n' +
      '拿取与食用：TAKE REPORT 拿周报；EAT WEENIE 吃试吃香肠；EAT HOT DOG 吃热狗。\n' +
      '打开：OPEN CABINET 打开洗漱柜。\n' +
      '搜寻：SEARCH COUCH 翻沙发；SEARCH DUMPSTER 翻垃圾箱。\n' +
      '使用：USE COMPUTER 操作电脑；PUT PAPER IN PRINTER 给打印机装纸。\n' +
      '装订：拿齐周报、封面和订书机后 STAPLE REPORT；GIVE REPORT TO BOSS 交周报。\n' +
      '购物：在会员服务台 RENEW MEMBERSHIP 续费；BUY BATTERY 买电瓶；BUY HOT DOG 买热狗。\n' +
      '修车：OPEN HOOD 打开引擎盖；PUT BATTERY IN CAR 安装电瓶。\n' +
      '整理：USE STAIN PEN ON SUIT 去污；WEAR COLOGNE 喷清新喷雾；COMB HAIR 梳头。\n' +
      '休息：在家 SLEEP；工资、车和衬衫都搞定才睡得着。\n' +
      '其他：SCORE 分数，TIME 时间，MAP 地图，HINT 提示，SAVE [slot] 存档，RESTORE [slot] 读档。\n' +
      '  UNDO 撤销，RESTART 重来；WEAR/EAT/DRINK/BUY/CLEAN/KICK/SMELL/SIT/FLIRT 也可以试。\n' +
      '声音：MUSIC ON/OFF 音乐，SFX ON/OFF 音效，SOUND ON/OFF 全部，VOLUME 0-10 音量。\n' +
      '小窍门：点图下的名字可填入英文代号；空格也要照写，大小写都行。',
    busLines: [
      '你坐42路前往{dest}。旁边大爷用保温杯盖喝汤，热情邀你尝尝。你婉拒了这次资源共享。',
      '开往{dest}的公交挤满打工人。小伙说你的衬衫“很有老钱风”。你只听清了“有钱”。',
      '你乘公交前往{dest}。司机循环播放提神音乐，老刘跟着哼了两句。司机关了音响，降本增效立竿见影。',
      '去{dest}的车上，大妈问你是不是做互联网的。你点头。她赶紧问怎么关闭自动续费。',
    ],
    driveLines: [
      '你开着二手代步车前往{dest}，车窗摇下，老歌开大。路人纷纷侧目。一定是在羡慕你的松弛感。',
      '你开车前往{dest}。发动机像连开三场复盘会的嗓子，但总算到了。',
      '你开车前往{dest}，一只手搭着窗沿。天快黑了还戴墨镜：老刘的体面不支持自动下线。',
    ],
  });

  L.addDestination({
    id: 'home', name: '家（青年人才公寓）', prose: '青年人才公寓', short: '家', hub: 'home_lot', known: true,
    names: ['home', 'house', 'apartment', 'my apartment', 'my place', 'shady pines', 'pad', 'crib', 'bachelor pad'],
  });
  L.addDestination({
    id: 'work', name: '公司（无限对齐科技）', prose: '无限对齐科技', short: '公司', hub: 'work_lobby', known: true,
    names: ['work', 'office', 'job', 'synergex', 'synergex solutions', 'the office'],
  });
  L.addDestination({
    id: 'costco', name: '山姆会员店', short: '山姆', hub: 'costco_lot', known: true,
    names: ['costco', 'warehouse', 'store', 'costco warehouse', 'wholesale club', 'sam'],
    onDepart(g) {
      if (g.has('cart')) {
        g.lose('cart');
        g.say('你把购物车推回回收区。没有积分返现，但文明社会记你一功。');
        g.award('return_cart');
      }
    },
    tick(g) {
      const closed = g.minuteOfDay() >= L.config.costcoClose || g.minuteOfDay() < 10 * 60;
      if (closed && g.room() !== 'costco_lot' && g.room() !== 'costco_food') {
        g.say('广播响起：“山姆会员店已打烊，请尽快结账。员工也想下班。”店员把你客气地送到停车场。');
        if (g.has('cart')) g.lose('cart');
        g.goto('costco_lot');
      }
    },
  });
  L.addDestination({
    id: 'lefty', name: '左岸小酒馆', short: '小酒馆', hub: null,
    names: ['leftys', 'leftys lounge', 'lefty', 'bar', 'lounge', 'pub'],
    comingSoon: '左岸小酒馆第二幕才开门。老刘目前的酒量配额都留给了生活的苦。',
  });
  L.addDestination({ id: 'gym', name: '自律自由健身房', hub: null, names: ['gym', 'iron paradise', 'health club', 'fitness center'], comingSoon: '第一幕就健身？先把活下去的基础需求对齐吧。第二幕再说。' });
  L.addDestination({ id: 'thrift', name: '闲置回收小店', hub: null, names: ['thrift', 'thrift store', 'second chance', 'goodwill'], comingSoon: '闲置回收小店第二幕开放。你的旧梦想暂不回收。' });
  L.addDestination({ id: 'disco', name: '燃点歌厅', hub: null, names: ['disco', 'disco inferno', 'club', 'nightclub', 'karaoke'], comingSoon: '燃点歌厅第二幕开放。先别急着唱《不想上班》。' });
  L.addDestination({ id: 'school', name: '母校（周六晚同学聚会）', hub: null, names: ['westside', 'westside high', 'high school', 'school', 'reunion', 'gym reunion'], comingSoon: '同学聚会是明晚的事，第三幕才开始。你这车、这衬衫，自己心里没点数吗？' });

  L.addScores({
    read_memo: { pts: 1, label: '已读不代表认同' },
    take_report: { pts: 2, label: '拿到周报' },
    print_cover: { pts: 2, label: '提交封面打印需求' },
    kick_printer: { pts: 2, label: '物理对齐打印机' },
    load_printer: { pts: 3, label: '解决缺纸问题' },
    get_cover: { pts: 2, label: '取得新版封面' },
    take_cake: { pts: 2, label: '领取生日福利' },
    merv_stapler: { pts: 5, label: '获得老莫信任' },
    staple_report: { pts: 5, label: '周报合规闭环' },
    paid: { pts: 10, label: '工资终于到账' },
    return_stapler: { pts: 3, label: '归还订书机' },
    talk_todds: { pts: 2, label: '撑过组织效能访谈' },
    wear_flair: { pts: 2, label: '企业文化上身' },
    solitaire: { pts: 1, label: '有效摸鱼' },
    talk_peggy: { pts: 1, label: '进入人工等待队列' },
    couch_quarters: { pts: 2, label: '沙发零钱到账' },
    messages: { pts: 2, label: '处理未读留言' },
    look_mirror: { pts: 1, label: '完成自我复盘' },
    comb_hair: { pts: 3, label: '发际线战略转移' },
    cologne: { pts: 3, label: '气味管理上线' },
    coupon: { pts: 4, label: '垃圾箱里找增量' },
    open_hood: { pts: 2, label: '打开引擎盖' },
    install_battery: { pts: 10, label: '代步车重新上线' },
    act_end: { pts: 15, label: '完成第一幕' },
    take_cart: { pts: 2, label: '获取搬运工具' },
    renew: { pts: 5, label: '会员身份续命' },
    eat_sample: { pts: 3, label: '积极参与试吃' },
    stain_pen: { pts: 4, label: '领到去污笔' },
    buy_battery: { pts: 8, label: '买到新电瓶' },
    use_coupon: { pts: 2, label: '优惠券精准核销' },
    hot_dog: { pts: 3, label: '吃下1.50元热狗' },
    stare_tvs: { pts: 2, label: '加入电视前沉默群聊' },
    return_cart: { pts: 2, label: '归还购物车' },
    greeter: { pts: 1, label: '向迎宾大爷问好' },
    clean_suit: { pts: 10, label: '螺蛳粉污渍已下线' },
    first_drive: { pts: 3, label: '实现出行自由' },
  });

  L.self = {
    name: '老刘',
    names: ['jeff', 'me', 'self', 'myself', 'yourself', 'jeff lovett', 'lovett', 'hair', 'my hair', 'head', 'face', 'liu'],
    desc: (g) =>
      '老刘，四十四岁，大厂中层，水床所有者，情绪价值自给自足。' +
      (g.flag('combed') ? '头发梳成了壮观的跨区支援造型。' : '头发正进行不可逆的人员优化。') +
      (g.flag('suit_clean') ? '格子衬衫一尘不染。' : '格子衬衫上有块工牌形状的螺蛳粉污渍。') +
      (g.flag('cologne') ? '清新喷雾味非常有存在感，比周会发言还强。' : '身上隐约有打印机碳粉味。'),
    verbs: {
      smell: (g) => (g.flag('cologne') ? '清新喷雾直冲脑门。眼泪是身体给出的正向反馈。' : '碳粉和隐忍。家里应该有清新喷雾。'),
      kick: '你在心里踢了自己一脚。实际操作被腰椎否决了。',
      flirt: '你向自己抛了个媚眼，自己居然脸红了。情绪价值闭环完成。',
      talk: '“老刘，你行的。”“谢谢你，老刘。”这是本周唯一没有附带需求的鼓励。',
      eat: '别把自己也当成耗材。',
      comb: (g) => (g.has('comb') ? L.combHair(g) : '你用手指拢了拢头发。大部分留了下来。还是找把梳子吧。'),
    },
  };
  L.combHair = (g) => {
    if (g.flag('combed')) return '发型已经达到脆弱的最优解，别再调整组织架构了。';
    g.set('combed');
    g.award('comb_hair');
    return '你把两侧头发跨区调度到头顶。远看、夜里、正面，老刘的发量管理堪称行业标杆。';
  };
  L.config.hint = (g) => {
    const f = (k) => g.flag(k);
    if (!f('paid')) {
      if (!g.has('tps_report') && !f('report_given')) return '提示：王总要周报。工位桌上先 READ MEMO，再 TAKE REPORT。回工位用 GO CUBICLES。';
      if (!f('print_queued') && !f('cover_in_tray') && !g.has('cover_sheet') && !f('tps_stapled')) return '提示：周报要新版封面。在工位 USE COMPUTER 打印。';
      if (!f('printer_loaded') && !g.has('cover_sheet') && !f('tps_stapled')) return '提示：打印机缺纸。GO BREAK ROOM；垫桌脚的纸可 TAKE PAPER，再 PUT PAPER IN PRINTER。';
      if (f('cover_in_tray') && !g.has('cover_sheet') && !f('tps_stapled')) return '提示：封面在茶水间打印机托盘里，TAKE COVER SHEET。';
      if (!f('tps_stapled') && !g.has('stapler')) return '提示：需要订书机。茶水间 TAKE CAKE，回工位 GIVE CAKE TO MERV，老莫就愿意借了。';
      if (!f('tps_stapled')) return '提示：拿着周报、封面和订书机，输入 STAPLE REPORT。';
      return '提示：GO OFFICE 找王总，GIVE REPORT TO BOSS 交周报领工资。';
    }
    if (!f('car_fixed') && !g.has('battery')) {
      if (!f('membership_valid')) return '提示：TAKE BUS TO COSTCO 去山姆，GO ENTRANCE 后在服务台 RENEW MEMBERSHIP 续费。';
      if (!g.has('cart')) return '提示：电瓶很重。去山姆停车场 GO PARKING LOT，再 TAKE CART 拿购物车。';
      return '提示：GO AISLES，再 GO TIRE CENTER，BUY BATTERY 买电瓶。家门口 SEARCH DUMPSTER 也许有优惠券。';
    }
    if (!f('suit_clean') && !g.has('stain_pen')) return '提示：山姆货架区 EAT WEENIE 先试吃香肠，再 TAKE STAIN PEN 领去污笔。';
    if (!f('car_fixed')) return '提示：TAKE BUS TO HOME 回公寓停车场，OPEN HOOD，再 PUT BATTERY IN CAR。';
    if (!f('suit_clean')) return '提示：USE STAIN PEN ON SUIT，告别工牌形状的螺蛳粉污渍。';
    return '提示：主要任务都完成了！GO TO HOME，GO APARTMENT 进屋，SLEEP 睡觉。';
  };
})();
