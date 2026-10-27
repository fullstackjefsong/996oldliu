(function () {
  'use strict';
  const L = LSJ;

  const allDone = (g) => g.flag('paid') && g.flag('car_fixed') && g.flag('suit_clean');

  L.addRoom({
    id: 'home_living', dest: 'home', title: '老刘的家', names: ['living room', 'apartment', 'bedroom', 'inside', 'apt'],
    art: String.raw`
 ________________________________________________________________________
|  .-------------.        _                           .------.  [电话]   |
|  | 狗狗打牌图  |       ( )  氛围      .--------.    | 冰箱 |  [=][o]*  |
|  |             |       |~|   灯       |  电视  |    |      |  留言闪烁 |
|  |  （绒面）   |       |~|            |  ~~~~  |    |  __  |           |
|  '-------------'      /___\           '--------'    | |  | |           |
|                                      ____||____      |_|__|_|           |
|   _____________________________                                .----.  |
|  /  ~  ~  ~   水床    ~  ~  ~  /|        ____________          | 门 |  |
| /______________________________/ |      /    沙发    /|        | 通 |  |
| |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|  /     /____________/ |        |车场|  |
| |_____________________________|/       |____________|/         | o  |  |
|________________________________________________________________________|
                             浴室 -->`,
    desc: (g) =>
      '老刘的一居室，装修风格叫“买的时候就这样，后来一直没空”。水床、氛围灯、狗狗打牌装饰画、电视、格子沙发、冰箱，一样不少。' +
      (g.flag('messages_heard') ? '电话旁的留言机安静下来。未处理事项不会因此自动减少。' : '电话旁的留言机正在闪灯。') +
      '门外是停车场，走廊通浴室。',
    objects: {
      waterbed: {
        name: '水床', names: ['waterbed', 'bed', 'water bed', 'mattress'],
        defaultFor: ['sleep'],
        desc: '加大号水床，软包边框、豹纹床单。你只看一眼，它都能晃出存在感。',
        verbs: {
          sit: (g) => { g.sfx('slosh'); return '你晃，床晃，邻居敲墙。成年人之间的互动就是这么含蓄。'; },
          push: '水波从这头跑到那头，又回来拍你一下。物理规律从不接受临时需求。',
          sleep: (g) => {
            if (allDone(g)) {
              g.sfx('slosh'); g.award('act_end');
              g.end('第一幕结束', '你倒在水床上，床发出胜利的晃动。工资领到了，代步车能跑了，格子衬衫也干净了。\n\n明天还需要一个伴儿、一点尊严，以及聚会群指定由你负责的冰块。但今晚，老刘终于能睡一个把周报交完的人才有的安稳觉。\n\n晚安，老刘。工作群先别响。');
              return;
            }
            const todo = [];
            if (!g.flag('paid')) todo.push('工资还没领');
            if (!g.flag('car_fixed')) todo.push('车还不能启动');
            if (!g.flag('suit_clean')) todo.push('衬衫上那块工牌形状的螺蛳粉污渍还在');
            g.advance(20);
            g.sfx('slosh');
            return '你躺下，盯着天花板。水床在晃，待办在脑中开会：' + todo.join('、') + '。二十分钟后，你还是起来了。';
          },
          kick: '它晃了九分钟，你全程看完。这是今天最没有产出压力的一段时间。',
          smell: '塑料与清新喷雾，独居老刘的家居香型。',
          flirt: '你轻声说“在吗”，床晃了一下。这是本年度最及时的回复。',
        },
      },
      lava_lamp: {
        name: '氛围灯', names: ['lava lamp', 'lamp', 'lava'],
        desc: '琥珀色液体里，泡泡升起、分裂、下沉，完整演示了你一个下午的希望曲线。',
        verbs: {
          use: '你打开灯，氛围到位。至于为谁营造，暂时没有需求方。',
          take: '这插头多年没拔，可能已经承担结构稳定功能。',
        },
      },
      painting: {
        name: '狗狗打牌装饰画', names: ['painting', 'velvet painting', 'dogs', 'poker', 'velvet', 'picture', 'art', 'dogs playing poker'],
        desc: '狗狗打牌图。斗牛犬总是拿最好的牌，你怀疑它既是玩家又是规则制定者。',
        verbs: {
          take: '取下来就能看见墙上的新旧色差，还是让它继续上班吧。',
          search: '画后只有一块旧墙漆，没有保险箱。生活连隐藏福利都没给你留。',
        },
      },
      tv: {
        name: '电视', names: ['tv', 'television', 'telly', 'set', 'remote'],
        desc: '小电视，天线缠着锡纸，技术路线相当稳健。',
        verbs: {
          use: (g) => { g.advance(5); return '你换台：购物广告、养生广告、卖锅的人、给卖锅的人做的广告。你关掉电视。还有正事。'; },
          kick: '照着父亲教的方式拍一下，画面居然好了。你还是关了它。',
        },
      },
      fridge_h: {
        name: '冰箱', names: ['fridge', 'refrigerator', 'icebox', 'freezer'],
        desc: '牛油果绿冰箱，贴满外卖磁贴。它比你的社交圈更丰富。',
        verbs: {
          open: (g) => { g.set('home_fridge_open'); return '一颗橄榄、一盒老得记不清日期的小苏打，以及深深的懊悔。'; },
          search: (g) => { g.set('home_fridge_open'); return '一颗橄榄、一盒老得记不清日期的小苏打，以及深深的懊悔。'; },
        },
      },
      olive: {
        name: '橄榄', names: ['olive', 'baking soda', 'regret'],
        hidden: (g) => !g.flag('home_fridge_open') || g.flag('olive_eaten'),
        desc: '一颗孤零零的绿橄榄。你与它短暂共情。',
        verbs: {
          eat: (g) => { g.set('olive_eaten'); return '你吃掉最后一颗橄榄。真的是最后一颗。事情并没有因此变好。'; },
          take: (g) => { g.set('olive_eaten'); return '你拿起橄榄，一时没忍住吃掉了。真的是最后一颗。事情并没有因此变好。'; },
        },
      },
      couch: {
        name: '格子沙发', names: ['couch', 'sofa', 'cushions', 'cushion', 'plaid couch'],
        desc: '格子沙发，中间有一个永久的老刘形凹陷。',
        verbs: {
          sit: '尺寸正合适，像生活量身定做的疲惫。',
          search: (g) => {
            if (g.flag('quarters')) return '只剩碎屑和旧电视节目表。沙发已完成全部可挖潜空间。';
            g.set('quarters');
            g.earn(75);
            g.sfx('coins'); g.award('couch_quarters');
            return '你从坐垫缝里找到三枚零钱、一根石化零食和一盘《老刘下班金曲第四辑》。你只留下零钱。［现金：+0.75元］';
          },
          sleep: '沙发适合打盹。真正休息得去水床，而且得先清掉主要待办。',
        },
      },
      phone: {
        name: '电话与留言机', names: ['phone', 'telephone', 'answering machine', 'machine', 'messages', 'message', 'blinking light', 'light'],
        desc: (g) => (g.flag('messages_heard') ? '没有新留言。世界又恢复了熟悉的安静。' : '三条新留言。三条！你的私人通信量创造了近期纪录。'),
        verbs: {
          listen: (g) => L.playMessages(g),
          use: (g) => L.playMessages(g),
          push: (g) => L.playMessages(g),
          call: '你认识的人基本都在留言里了。先 LISTEN TO MESSAGES。',
        },
      },
      bath_door: { name: '浴室门', scenery: true, names: ['hall', 'hallway'], desc: '通向浴室的走廊。' },
    },
    verbs: { listen: (g) => L.playMessages(g), call: '你拿起电话，又想起认识的人基本都在留言里了。' },
    exits: [
      { to: 'home_lot', label: '停车场', names: ['door', 'front door', 'parking lot', 'lot', 'outside', 'out', 'car', 'street'] },
      { to: 'home_bath', label: '浴室', names: ['bathroom', 'bath', 'restroom', 'washroom', 'loo', 'mirror'] },
    ],
  });

  L.playMessages = (g) => {
    g.set('messages_heard');
    g.sfx('beep'); g.award('messages');
    return (
      '你按下播放键，机器发出一阵熟悉的机械声。\n\n' +
      '嘀。“小刘啊，妈。明晚同学聚会，穿件精神点的，别又那件格子衬衫。……你是不是就那一件？算了，记得吃饭。”\n\n' +
      '嘀。“老刘，我小唐！周六晚八点，母校体育馆，同学聚会！大家都说要带伴儿！对了，你负责带冰块啊，群公告看一下！”\n\n' +
      '嘀。“这里是山姆会员服务。您的会员资格已过期，请前往服务台续费。祝您购物愉快。”\n\n' +
      '留言播放完毕。妈妈关心你，老同学需要冰，商店需要钱。分工明确。'
    );
  };

  L.addRoom({
    id: 'home_bath', dest: 'home', title: '老刘的浴室', names: ['bathroom', 'bath'],
    art: (g) => String.raw`
 ________________________________________________________________________
|   （牛油果绿瓷砖，从地板到天花板）                                     |
|                    .---------------------.     .----------------.      |
|                    |                     |     |    洗漱柜      |      |
|                    |        镜子         |     |                |      |
|                    |                     |     |  ${g.flag('cabinet_open') ? '[ 已开 ] ' : '[ 关闭 ] '}    |      |
|                    '---------------------'     '----------------'      |
|                         ___________                    ______           |
|                        |  洗手池   |                  /      \          |
|                        |___ (o) ___|                 |  马桶  |  滴答   |
|                            |   |                      \______/          |
|                            |   |                       |____|           |
|_______________________________________________________________________|
                         <-- 客厅`,
    desc: '电话亭大小的浴室，从地板到天花板都是牛油果绿。洗手池上方是镜子，旁边有洗漱柜，马桶的水箱要晃一晃把手才肯停。',
    objects: {
      mirror: {
        name: '镜子', names: ['mirror', 'reflection', 'glass'],
        desc: (g) => {
          g.award('look_mirror');
          return '你看向镜子。一个成熟男人回望你——如果“成熟”包括四十四岁、常吃热狗、每周写四十页周报。' +
            (g.flag('combed') ? '头发是一次优秀的跨区支援。' : '头发急需资源调度。') +
            (g.flag('suit_clean') ? '格子衬衫一尘不染。' : '工牌形状的螺蛳粉污渍仍在胸前打卡。') +
            (g.flag('cologne') ? '周围空气都在宣告清新管理已完成。' : '似乎还缺一点清新感。');
        },
        verbs: { kick: '七年倒霉？先让我把接下来七小时过完。', flirt: '“这位帅哥。”镜子不说话，你决定把沉默视为赞同。' },
      },
      cabinet: {
        name: '洗漱柜', names: ['medicine cabinet', 'cabinet', 'cupboard'],
        desc: (g) => (g.flag('cabinet_open') ? '柜门开着。' : '小小的镜面洗漱柜，关着。'),
        verbs: {
          open: (g) => {
            g.set('cabinet_open');
            const bits = [];
            if (!g.has('cologne') && !g.flag('cologne')) bits.push('清新喷雾');
            if (!g.has('comb')) bits.push('黑色口袋梳');
            return '里面有' + (bits.length ? bits.join('、') + '，还有' : '') + '一瓶空生发液，以及从未拆封的牙线。';
          },
          search: (g) => L.rooms.home_bath.objects.cabinet.verbs.open(g),
          close: (g) => { g.unset('cabinet_open'); return '镜中的自己重新出现，神情略显失望。'; },
        },
      },
      cologne_cab: {
        name: '清新喷雾', names: ['cologne', 'brut force', 'brut', 'aftershave', 'bottle'],
        hidden: (g) => !g.flag('cabinet_open') || g.has('cologne') || g.flag('cologne_taken'),
        desc: '清新喷雾，只剩最后一点。精神状态不能重启，气味可以先遮一下。',
        verbs: {
          take: (g) => { g.set('cologne_taken'); g.give('cologne'); return '你拿起瓶子，感受到命运，以及酒精的重量。'; },
          wear: (g) => { g.set('cologne_taken'); g.give('cologne'); return L.items.cologne.verbs.wear(g); },
        },
      },
      comb_cab: {
        name: '梳子', names: ['comb', 'pocket comb'],
        hidden: (g) => !g.flag('cabinet_open') || g.has('comb'),
        desc: '黑色口袋梳，缺了两颗齿。',
        verbs: {
          take: (g) => { g.give('comb'); return '你把梳子放进口袋，像一位准备认真生活的老派男士。'; },
          use: (g) => { g.give('comb'); return L.combHair(g); },
        },
      },
      sink: {
        name: '洗手池', names: ['sink', 'faucet', 'tap', 'water'],
        desc: '牙膏圈已经形成地层，清洁需求跨了好几个季度。',
        verbs: {
          use: '你洗了手。妈妈会高兴的。虽然她仍不认可这件格子衬衫。',
          drink: '自来水有硬币和老小区管道的味道。',
        },
        receive: { suit: '清水只会把螺蛳粉污渍变成湿污渍。需要真正的去污工具。' },
      },
      toilet: {
        name: '马桶', names: ['toilet', 'john', 'commode', 'handle', 'can'],
        desc: '不停流水，得晃把手。任何长期关系都需要维护。',
        verbs: {
          flush: '哗——它冲完又开始漏。你晃晃把手，终于安静。你俩达成了暂时共识。',
          use: '你使用马桶。省略不必要的细节。好了，记得洗手。',
          push: '水停了。暂时。',
          sit: '你坐在盖子上思考人生，获得了不被打断的四分钟。',
          drink: '不。绝对不。老刘还没有走到这一步。',
        },
      },
    },
    exits: [{ to: 'home_living', label: '客厅', names: ['living room', 'out', 'back', 'hall', 'apartment', 'bedroom'] }],
  });

  L.addRoom({
    id: 'home_lot', dest: 'home', title: '青年人才公寓停车场', names: ['parking lot', 'lot', 'outside', 'car'],
    art: (g) => {
      const car = g.carAt() === 'home';
      const hood = g.flag('hood_open');
      return String.raw`
     青年人才公寓                        青年仅限楼盘命名         _______
  _______________________________                                  |  42   |
 |  [ ]   [ ]   [ ]   [ ]   [#] <-- 老刘家                         | 公交  |
 |  [ ]   [ ]   [ ]   [ ]   [ ]  |                                  |  站   |
 |_______________[ 门 ]_________|       .-----------.             |_______|
                                         |  垃圾箱   |                 |
` + (car ? (hood ? String.raw`        __/ \___________                 |___________|                 |
       | 引擎盖已开    \____                                         |
       | 二手代步车   ${g.flag('car_fixed') ? '(能跑)' : '(没电)'}    \                                       |
       '--(O)--------(O)--'                                           |` : String.raw`           ______________                |___________|                 |
       ___/  [] []        \____                                       |
      | 二手代步车        ${g.flag('car_fixed') ? '(能跑)' : '(没电)'}\                                    |
      '--(O)-----------(O)--'                                          |`) : String.raw`                                         |___________|                 |
                                                                      |
              [ 14号车位：空 ]                                        |
                                                                      |`) + String.raw`
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                 乘公交或开车前往公司、山姆`;
    },
    desc: (g) =>
      '青年人才公寓的停车场。房子没换名字，人才已经住成中年。' +
      (g.carAt() === 'home'
        ? '14号车位里停着你的二手代步车' + (g.flag('car_fixed') ? '，轻轻喘着，像一个终于获批休假的老员工。' : '，没电时像周五六点的你。')
        : '14号车位空着。你的车停在别处，记忆力需要自己维护。') +
      '角落是垃圾箱，路边是42路公交站，身后就是回家的门。',
    objects: {
      car: {
        name: '二手代步车', names: ['car', 'pontiac', 'fiero', 'auto', 'vehicle', 'pontiac fiero', 'ride', 'wheels'],
        hidden: (g) => g.carAt() !== 'home',
        desc: (g) =>
          '香槟米色二手代步车，一只车灯能正常抬起，另一只已经躺平。' +
          (g.flag('car_fixed') ? '车能跑了！输入 DRIVE TO HOME、DRIVE TO WORK 或 DRIVE TO COSTCO 出行。' : '电瓶周二就坏了。你俩都度过了漫长的一周。') +
          (g.flag('hood_open') ? '引擎盖开着。' : ''),
        verbs: {
          use: (g) => (g.flag('car_fixed') ? '代步车准备就绪。DRIVE TO WORK 或 DRIVE TO COSTCO。' : '咔，咔咔。没有启动声。需要新电瓶，不需要继续许愿。'),
          go: (g) => (g.flag('car_fixed') ? '你坐好了。输入 DRIVE TO HOME 等目的地指令。' : '你坐进驾驶位，自己配了两声发动机音效。对实际故障没有帮助，需要新电瓶。'),
          sit: (g) => (g.flag('car_fixed') ? '你坐好了。输入 DRIVE TO HOME 等目的地指令。' : '你坐进驾驶位，自己配了两声发动机音效。对实际故障没有帮助。'),
          open: (g) => L.openHood(g),
          kick: (g) => (g.flag('car_fixed') ? '别踢，它刚开始重新信任你。' : '轮毂盖掉下来。你默默装回去。需要的是电瓶，不是愤怒管理。'),
          flirt: '你抚着翼子板说“谁是好车车”。楼上的邻居拉上了窗帘。',
          close: (g) => { g.unset('hood_open'); return '你关上引擎盖。'; },
          search: '座位下有四根薯条、一张老歌碟和一张旧停车罚单。典型的老刘式资产配置。',
        },
        receive: { battery: (g) => L.installBattery(g), keys: (g) => L.rooms.home_lot.objects.car.verbs.use(g) },
      },
      hood: {
        name: '引擎盖', scenery: true, names: ['hood', 'engine', 'old battery', 'dead battery', 'engine compartment', 'bonnet'],
        hidden: (g) => g.carAt() !== 'home',
        desc: (g) => (g.flag('hood_open') ? (g.flag('car_fixed') ? '新电瓶稳稳坐着，看起来比你更有精气神。' : '旧电瓶结着蓝绿色的壳，离线得十分彻底。') : '代步车前盖。打开才能看见旧电瓶。别靠猜的修车。'),
        verbs: {
          open: (g) => L.openHood(g),
          close: (g) => { g.unset('hood_open'); return '你关上引擎盖。'; },
          take: (g) => (g.flag('hood_open') ? (g.flag('car_fixed') ? '刚装好，别反向优化。' : '旧的不要了。你需要去山姆买块新的。') : '先打开引擎盖。'),
        },
        receive: { battery: (g) => L.installBattery(g) },
      },
      dumpster: {
        name: '垃圾箱', names: ['dumpster', 'trash', 'garbage', 'bin', 'trash can'],
        desc: '绿色大垃圾箱，闻起来像一个坏掉的周二。',
        verbs: {
          search: (g) => {
            if (g.flag('coupon_found')) return '除了不想回忆的画面，没有别的了。';
            g.set('coupon_found');
            g.give('coupon');
            g.award('coupon');
            return '你屏住呼吸，在披萨盒下翻到山姆宣传单，夹着一张“汽车电瓶立减10.00元，仅限今日”的券。原来增量真的藏在存量里。';
          },
          open: (g) => L.rooms.home_lot.objects.dumpster.verbs.search(g),
          eat: '不，不可以。这个需求直接否决。',
          smell: '你明明知道会是什么味道。明明知道。',
          go: '不钻垃圾箱。翻找已经是本作允许的最低姿态。',
        },
      },
      bus_stop_h: {
        name: '公交站', names: ['bus stop', 'stop', 'bus', 'sign', 'schedule'],
        desc: '42路，票价2.00元，去公司或山姆。输入 TAKE BUS TO WORK 或 TAKE BUS TO COSTCO。杆子上有人刻着“老刘到此一游”，你完全不记得。',
      },
      apartments: { name: '公寓楼', scenery: true, names: ['apartments', 'building', 'shady pines', 'windows'], desc: '青年人才公寓：青年负责命名，人才负责按月交租。' },
    },
    exits: [{ to: 'home_living', label: '家中', names: ['apartment', 'door', 'inside', 'in', 'living room', 'apt', 'bedroom', 'my apartment', 'upstairs'] }],
  });

  L.openHood = (g) => {
    if (g.carAt() !== 'home') return '车不在这里。';
    if (g.flag('hood_open')) return '已经开着了。';
    g.set('hood_open');
    g.award('open_hood');
    return g.flag('car_fixed')
      ? '你打开盖子，欣赏那块终于肯上班的新电瓶。'
      : '你打开引擎盖。旧电瓶的状态比周末临时会议还令人绝望。需要换新。';
  };

  L.installBattery = (g) => {
    if (g.flag('car_fixed')) return '车里已经装着新电瓶了。';
    if (!g.has('battery')) return '你还没有新电瓶。';
    const opened = !g.flag('hood_open');
    g.set('hood_open');
    if (opened) g.award('open_hood');
    g.lose('battery');
    g.set('car_fixed');
    g.sfx('car'); g.award('install_battery');
    return (opened ? '你打开引擎盖。' : '') +
      '你拔掉旧电瓶，费力把新电瓶放进去，红接红、黑接黑。拧紧接头，转动钥匙……轰！代步车终于重新上线，那只好用的车灯骄傲地抬了起来。\n\n现在可以用 DRIVE TO 指令免费出行了！';
  };
})();
