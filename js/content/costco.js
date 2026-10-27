(function () {
  'use strict';
  const L = LSJ;
  const BATTERY_PRICE = 8999;
  const RENEW_PRICE = 6500;
  const HOT_DOG_PRICE = 150;

  const isClosed = (g) => g.minuteOfDay() >= L.config.costcoClose || g.minuteOfDay() < 10 * 60;

  L.addRoom({
    id: 'costco_lot', dest: 'costco', title: '山姆会员店停车场', names: ['parking lot', 'lot', 'outside'],
    art: (g) => String.raw`
     _________________________________________________________________
    |       山姆会员店                          [ 营业10:00-20:30 ]    |
    |_________________________________________________________________|
    |      .--------------------.                 .---------.         |
    |      |        入口        |                 |  餐饮   |         |
    |      |    >>  [ ]  <<     |                 |   区    |         |
    |______|____________________|_________________|_________|_________|
        _ _ _ _ _ _ _ _ _                        ${g.carAt() === 'costco' ? '    ______________    ' : '                      '}
       |=|=|=|=|=|=|=|=|=|  购物车回收区          ${g.carAt() === 'costco' ? ' __/  []  []      \\__ ' : '     [ 空车位 ]       '}
       |_|_|_|_|_|_|_|_|_|                        ${g.carAt() === 'costco' ? '| 你的代步车（能跑）|' : '                      '}
                                                  ${g.carAt() === 'costco' ? "'--(O)--------(O)---'" : '                      '}
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      42路公交站                     前往家或公司`,
    desc: (g) =>
      '广阔的停车场，七座车为了一个近门车位展开低速博弈。前面是仓储店入口，侧边是餐饮区。' +
      (g.has('cart') ? '' : '购物车回收区堆着巨型购物车。') +
      (g.carAt() === 'costco' ? '你的代步车斜着占了两个车位，姿态比车价更自信。' : '') +
      '路边是公交站。',
    objects: {
      carts: {
        name: '购物车', names: ['cart', 'carts', 'shopping cart', 'shopping carts', 'cart corral', 'corral', 'trolley', 'buggy'],
        hidden: (g) => g.has('cart'),
        desc: '能装下全家生活用品的巨大购物车，或者一整托盘厕纸。',
        verbs: {
          take: (g) => {
            g.give('cart');
            g.set('cart_taken_once');
            g.sfx('cart'); g.award('take_cart');
            return '你抽出一辆，左前轮立刻尖叫并开始自行寻找方向。你现在是有车的人——购物车。生活开始有了明确运力。';
          },
          push: (g) => L.rooms.costco_lot.objects.carts.verbs.take(g),
          use: (g) => L.rooms.costco_lot.objects.carts.verbs.take(g),
        },
      },
      sign: {
        name: '招牌', scenery: true, names: ['sign', 'hours', 'costco sign'],
        desc: '山姆会员店。营业10:00—20:30。会员资格必需，体面可自备。',
      },
      fiero_c: {
        name: '二手代步车', scenery: true, names: ['car', 'fiero', 'pontiac'],
        hidden: (g) => g.carAt() !== 'costco',
        desc: '代步车横跨两个车位，旁边车主看着它，它没有回应。',
        verbs: { use: 'DRIVE TO HOME 回家，或 DRIVE TO WORK 去公司。' },
      },
      bus_stop_c: { name: '公交站', scenery: true, names: ['bus stop', 'bus', 'stop'], desc: '42路，去家和公司，每次2.00元。TAKE BUS TO HOME 或 TAKE BUS TO WORK。' },
    },
    exits: [
      {
        to: 'costco_entrance', label: '商店入口', names: ['entrance', 'warehouse', 'inside', 'in', 'store', 'doors', 'costco', 'door', 'sam'],
        cond: (g) => {
          if (!isClosed(g)) return true;
          if (!g.has('battery') && !g.flag('car_fixed')) {
            g.die('电瓶需求已过窗口期',
              '门锁着，20:30已经过去。电瓶在货架上安静地嘲笑你的时间管理。没有它，代步车继续躺平；老刘只能坐公交去聚会，带着邻座保温杯汤的气味赶到。聚会群决定未来二十年都由你负责冰块。');
            return false;
          }
          return '门锁着，20:30就关店了。好在关键物资已经买到。';
        },
      },
      { to: 'costco_food', label: '餐饮区', names: ['food court', 'food', 'hot dog stand', 'snack bar', 'hot dogs'] },
    ],
  });

  L.addRoom({
    id: 'costco_entrance', dest: 'costco', title: '山姆会员店入口', names: ['entrance', 'membership desk', 'front'],
    art: String.raw`
 ________________________________________________________________________
|  ====================  欢迎来到山姆  ================================  |
|                                                                       |
|     .---.                                  .------------------------. |
|    ( ^_^ )  老顾                           |       会员服务         | |
|     /|V|\   （迎宾大爷）                    |    .---.               | |
|      | |    “请出示会员卡！”               |   (o_o)   店员        | |
|     _| |_                                  |___/|__|\_______________| |
|                                                                       |
|   .------------------------------------------.                        |
|   |  >> 货架区 >>      （会员通道）           |    <-- 停车场         |
|   '------------------------------------------'    <-- 餐饮区         |
|_______________________________________________________________________|`,
    desc: (g) =>
      '老顾守在会员通道，他的职业续航看起来比所有会员都长。' +
      '右边是会员服务台，小田正用已经解释过四万次权益的眼神望着远方。' +
      '货架区在里面，停车场在身后。',
    objects: {
      gus: {
        name: '老顾', person: true, names: ['gus', 'greeter', 'old man', 'man', 'door guy'],
        desc: '八十七岁的迎宾大爷，握手有力。你当年烫头来购物，他都记得。',
        verbs: {
          talk: (g) => {
            g.award('greeter');
            return g.flag('membership_valid')
              ? '“进去吧老刘，十二号通道有试吃香肠，别错过！”'
              : '“请出示会员卡。哎，过期了。我也想放你进去，但流程就是流程。服务台在右边。”';
          },
          flirt: '你眨眼，老顾也眨眼。这位大爷的熟练度比你工龄还长。',
          kick: '不可以。传说老顾曾为最后一只烤鸡独自稳住半个停车场。',
        },
        receive: {
          costco_card: (g) => (g.flag('membership_valid') ? '“状态不错，进去吧！”' : '“过期啦，先去服务台。”'),
        },
      },
      desk: {
        name: '会员服务台', names: ['membership desk', 'desk', 'clerk', 'desk clerk', 'membership', 'membership services', 'services'],
        person: true,
        desc: '胸牌写着“小田——欢迎咨询高阶会员”，他眼神恳求你不要真的咨询。',
        verbs: {
          talk: (g) => (g.flag('membership_valid') ? '“办好了！考虑升级高阶会员吗？不？好的。”最后两个字像熄灭的蜡烛。' : '“欢迎来到山姆。您的会员过期了，续费65.00元，要续吗？输入 RENEW MEMBERSHIP。”'),
          renew: (g) => L.renew(g),
          use: (g) => L.renew(g),
          buy: (g) => L.renew(g),
          flirt: '“你经常来这儿吗？”“先生，我在这儿上班。”成熟魅力对工时没有豁免。',
        },
        receive: { costco_card: (g) => L.renew(g), wallet: (g) => L.renew(g) },
      },
    },
    exits: [
      { to: 'costco_lot', label: '停车场', names: ['parking lot', 'lot', 'out', 'outside', 'exit'] },
      {
        to: 'costco_aisles', label: '货架区', names: ['aisles', 'aisle', 'store', 'warehouse', 'inside', 'in', 'samples'],
        cond: (g) => (g.flag('membership_valid') ? true : '老顾突然出现在你面前。“卡过期啦，服务台就在那儿。”没有会员，不开放通道。'),
        msg: (g) => (g.flag('membership_valid') ? '老顾看卡挥手。“试吃愉快！”' : ''),
      },
      { to: 'costco_food', label: '餐饮区', names: ['food court', 'food', 'hot dogs'] },
    ],
  });

  L.renew = (g) => {
    if (g.flag('membership_valid')) return '“已经续好了！那高阶会员……？”你拒绝。';
    if (!g.spend(RENEW_PRICE)) return `“续费65.00元。”你看了看钱包里的${g.fmt(g.money())}。小田补充说可以刷卡，可你此刻真正缺的是工资。`;
    g.set('membership_valid');
    g.sfx('cash'); g.award('renew');
    return '你付出65.00元。小田贴上“已续费”，例行询问是否升级，你例行拒绝。消费身份恢复正常。［现金：-65.00元］';
  };

  L.addRoom({
    id: 'costco_aisles', dest: 'costco', title: '山姆会员店货架区', names: ['aisles', 'aisle', 'warehouse'],
    art: String.raw`
 ________________________________________________________________________
| [120吋电视][120吋电视][120吋电视]         | 大桶   |   | 72卷    |   |
| [ ~~~~~~~ ][ ~~~~~~~~ ][ ~~~~~~~~ ]        | 蛋黄酱 |   | 厕纸    |   |
|  o  o  o  <- 围观人群                     |________|   |         |   |
| /|\/|\/|\                                               |_________|   |
|                .---.                                                   |
|      ________ (^o^)  马姐             .----------.   .--------------.  |
|     |试吃香肠|/|\                     | 大桶喷雾 |   |     烤鸡     |  |
|     |__[==]__|_|_     “尝一口！”     |          |   |   4.99元     |  |
|                                       '----------'   '--------------'  |
|                                                                        |
|   <-- 入口                                       汽配区 -->            |
|________________________________________________________________________|`,
    desc: '空旷货架间回音很大，商品规格仿佛面向四十口之家。120英寸电视前站着一排沉默男人。马姐在发试吃香肠。旁边是大桶蛋黄酱、72卷厕纸、大桶清新喷雾和4.99元烤鸡。汽配区在后面。',
    objects: {
      sample_lady: {
        name: '试吃员马姐', person: true, names: ['sample lady', 'lady', 'woman', 'sample', 'samples', 'demo', 'demo lady', 'marge'],
        desc: (g) =>
          '发网、围裙，发过两百万份试吃依然精力充沛。她对产品的热情比你对工作高得多。' +
          (g.flag('sample_eaten') && !g.flag('pen_taken') ? '她也在演示去污笔。' : ''),
        verbs: {
          talk: (g) => {
            if (!g.flag('sample_eaten')) return '“来根香肠，今天的试吃。”她视线停在你胸前。“吃完，还有个东西适合你。”';
            if (!g.flag('pen_taken')) return '“我们也在演示去污笔，草渍、酒渍、口红、螺蛳粉……”她看着工牌形污渍。“拿一支吧，算为了周围的人。”';
            return '“常来，帮我宣传一下香肠，别只记得去污。”';
          },
          flirt: (g) => '“别闹。”她笑着拿铲子拍你胳膊。老刘本周第一次在非绩效语境里被叫“有点东西”，决定永远记住。',
          take: (g) => L.rooms.costco_aisles.objects.weenies.verbs.eat(g),
        },
      },
      weenies: {
        name: '试吃香肠', names: ['weenie', 'weenies', 'cocktail weenie', 'cocktail weenies', 'sample', 'toothpick', 'hot dog sample', 'free sample'],
        desc: '牙签串着小香肠，在灯下闪闪发亮。免费，是打工人听得懂的通用语言。',
        verbs: {
          eat: (g) => {
            if (g.flag('sample_eaten')) return '“每人一份。”她没抬头，但她知道。她一直知道。';
            g.set('sample_eaten');
            g.sfx('gulp'); g.award('eat_sample');
            return '你一口吃掉，按试吃礼仪大声表示“好吃”。马姐笑了：“愿意认真体验的顾客！现在聊聊你那块污渍。”她举起去污笔。';
          },
          take: (g) => L.rooms.costco_aisles.objects.weenies.verbs.eat(g),
        },
      },
      pen_demo: {
        name: '去污笔', names: ['pen', 'stain pen', 'stain-b-gone', 'stain b gone', 'stain remover', 'stain b gone pen'],
        hidden: (g) => !g.flag('sample_eaten') || g.flag('pen_taken'),
        desc: '自有品牌去污笔，去除草渍、酒渍、口红和加班夜宵的痕迹，不负责清除精神内耗。',
        verbs: {
          take: (g) => { g.set('pen_taken'); g.give('stain_pen'); g.award('stain_pen'); return '马姐把笔塞进你手里。“免费样品，你是我见过最有需求的人。”你获得去污笔。'; },
          buy: (g) => L.rooms.costco_aisles.objects.pen_demo.verbs.take(g),
        },
      },
      tvs: {
        name: '电视墙', names: ['tv', 'tvs', 'televisions', 'wall of tvs', 'tv wall', 'men', 'guys', 'starers'],
        desc: '巨屏播放瀑布。一排男人抱着胳膊默默看，没人打算买，人人都很平静。',
        verbs: {
          look: (g) => { g.award('stare_tvs'); g.advance(10); return '你加入队列，抱臂，缓慢点头。八千线瀑布，无人发言。十分钟过去，你比在公司任何一次团建里都更有团队归属感。'; },
          buy: '装不进代步车，也装不进房间、预算或人生规划。',
          talk: '“黑色真黑。”“嗯。”对话结束，沟通效率极高。',
        },
      },
      mayo: {
        name: '大桶蛋黄酱', names: ['mayo', 'mayonnaise', 'jar', '5 gallon mayo', 'tub'],
        desc: '大得离谱的一桶蛋黄酱。总有一个家庭真的需要，你希望永远不认识负责吃完它的人。',
        verbs: {
          eat: (g) => g.die('调料反客为主', '你打开大桶蛋黄酱，开始认真履行一个不存在的试吃任务。第一阶段自信，第二阶段恍惚，第三阶段看见人生的尽头也是一罐蛋黄酱。最终复盘写着：“主次不分，摄入失控。”'),
          take: '太重，也没用。山姆可能没有边界，你的腰有。',
          buy: '你不需要这么多蛋黄酱，老刘，聚焦主线。',
        },
      },
      tp: {
        name: '72卷厕纸', names: ['toilet paper', 'tp', '72 pack', 'paper towels'],
        desc: '塑封像城墙，足够老刘用到下一次同学聚会。',
        verbs: { take: '你有任务，任务不是囤厕纸。', buy: '你有任务，任务不是囤厕纸。', sit: '舒服得出乎意料。店员很快请你离开这块临时人体工学区。' },
      },
      cologne_jug: {
        name: '大桶清新喷雾', names: ['cologne', 'gallon cologne', '1 gallon cologne', 'jug', 'eau de musk', 'perfume'],
        desc: '带压泵的大桶喷雾，宣传语是“气场不能输”。试用嘴边已经结壳。',
        verbs: {
          wear: (g) => {
            if (g.flag('cologne')) return '已经够香了，再混合可能诞生新的空气污染物。';
            g.set('cologne');
            g.sfx('spray'); g.award('cologne');
            return '你按一下，气味像松林里的保洁和老虎同时开始团建。旁边三人整齐打喷嚏。你的气味管理上线了。';
          },
          drink: (g) => g.die('气味管理越界', '你把压泵对准嘴。舌头、脸和自我认知依次离线。最后听见老顾喊：“十二号通道需要清理！不是试吃的别往嘴里送！”'),
          buy: '89.99元，能喷四百年。你现在更需要一块电瓶。',
          smell: '鼻毛决定提交正式投诉。',
        },
      },
      chicken: {
        name: '烤鸡', names: ['chicken', 'chickens', 'rotisserie chicken', 'rotisserie'],
        desc: '4.99元烤鸡，香得像对打工人的补贴。这是游戏里的虚构价格，不是现实促销。',
        verbs: {
          buy: '真想来一只，但车优先。烤鸡会一直在这里，电瓶故障不会自己解决。',
          eat: '店里别直接开吃，老刘，你还有一点体面。先记到聚会后的愿望清单。',
          smell: '闻起来像下班。',
          take: '真想来一只，但车优先。烤鸡会一直在这里，电瓶故障不会自己解决。',
        },
      },
    },
    exits: [
      { to: 'costco_entrance', label: '入口', names: ['entrance', 'front', 'exit', 'out', 'membership desk'] },
      { to: 'costco_tire', label: '汽配区', names: ['tire center', 'tires', 'tire', 'auto', 'auto center', 'batteries', 'back'] },
    ],
  });

  L.addRoom({
    id: 'costco_tire', dest: 'costco', title: '山姆会员店汽配区', names: ['tire center', 'tires', 'auto center'],
    art: String.raw`
 ________________________________________________________________________
|          汽配区                       “道路保障请咨询”               |
|                                                                        |
|    ___   ___   ___   ___            .------------------------------.   |
|   (   ) (   ) (   ) (   )           |          汽车电瓶            |   |
|   ( O ) ( O ) ( O ) ( O )           |  [+  -] [+  -] [+  -] [+  -] |   |
|   (___) (___) (___) (___)           |       耐久电瓶  89.99元      |   |
|                                     '------------------------------'   |
|         .---.                                                          |
|        ( >_<)  老修                                                    |
|        /|##|\  （师傅）          ____________ 柜台 _________________   |
|         |  |                                                           |
|____________________________________________________________ 货架区 -->|`,
    desc: '橡胶和机油的味道很实在。轮胎堆在墙边，柜台旁是一排89.99元的耐久电瓶。老修拿着一块比手更脏的布擦手，熟练得令人放心。',
    objects: {
      rusty: {
        name: '老修', person: true, names: ['rusty', 'mechanic', 'guy', 'man', 'clerk', 'counter'],
        desc: '油渍工装，见过世面的胡子。胸牌写着老修，像一个比真名更可靠的职业称谓。',
        verbs: {
          talk: (g) => {
            if (g.has('battery') || g.flag('car_fixed')) return '“红接红，黑接黑。你能行。大概。”';
            return '“要电瓶？89.99元。我们最好的一款，也是唯一一款。记得拿购物车，十八公斤多，你这腰别硬撑。”';
          },
          flirt: '“有家有口，没空陪你演。买电瓶还是先让一让？”',
          buy: (g) => L.buyBattery(g),
        },
        receive: { coupon: (g) => L.buyBattery(g), costco_card: (g) => L.buyBattery(g), cart: (g) => L.buyBattery(g), wallet: (g) => L.buyBattery(g) },
      },
      batteries: {
        name: '汽车电瓶', names: ['battery', 'batteries', 'car battery', 'car batteries', 'dieharder', 'rack'],
        desc: '耐久电瓶89.99元，十八公斤多。提手设计者显然从来不需要自己搬。',
        verbs: {
          buy: (g) => L.buyBattery(g),
          take: (g) => L.buyBattery(g),
          use: (g) => L.buyBattery(g),
        },
      },
      tires: {
        name: '轮胎', scenery: true, names: ['tires', 'tire', 'wheels', 'rubber'],
        desc: '代步车轮胎有点秃，但技术上还能用。这个问题留到第二幕，别把所有技术债一次结清。',
        verbs: { kick: '你踢了一脚，老修点头：“好胎吧？”中年男性的低成本社交完成。', buy: '一次处理一个危机，老刘。' },
      },
    },
    exits: [{ to: 'costco_aisles', label: '货架区', names: ['aisles', 'aisle', 'back', 'out', 'store'] }],
  });

  L.buyBattery = (g) => {
    if (g.has('battery') || g.flag('car_fixed')) return '一块够了。除非要造机器人，但那不是本次需求。';
    if (!g.has('cart')) return '你试着抬起，腰发出一声零食筒开盖般的响动。老修说：“购物车，停车场，别逞强。”';
    const coupon = g.has('coupon');
    const price = coupon ? BATTERY_PRICE - 1000 : BATTERY_PRICE;
    if (!g.spend(price)) return `价格${g.fmt(price)}，余额${g.fmt(g.money())}。老修等，你也等，没有人能等出现金来。先回公司领工资。`;
    g.give('battery');
    g.sfx('cash'); g.award('buy_battery');
    let msg = '';
    if (coupon) {
      g.lose('coupon');
      g.award('use_coupon');
      msg = '你把垃圾箱优惠券放上柜台，老修闻了闻。“披萨味。”还是给你减了10.00元。';
    }
    return msg + `老修结账：${g.fmt(price)}，把电瓶搬进购物车。“红接红，黑接黑。”你买到了新电瓶！［现金：-${g.fmt(price)}］`;
  };

  L.addRoom({
    id: 'costco_food', dest: 'costco', title: '山姆会员店餐饮区', names: ['food court', 'food', 'snack bar'],
    art: String.raw`
 ________________________________________________________________________
|           餐饮区                                                       |
|  .------------------------------------------------------------------.  |
|  | 热狗加汽水 1.50元    |  披萨 1.99元       |  糖条 1.00元         |  |
|  |              不涨价是我们的倔强                                  |  |
|  '------------------------------------------------------------------'  |
|        .---.                                                           |
|       ( o.o)  收银                     [      调料台      ]           |
|      __|__|_______                     番茄酱   芥末   洋葱            |
|                                                                        |
|     ____     ____     ____          （固定桌椅，自有道理）              |
|    |____|   |____|   |____|                                            |
|________________________________________________ <-- 停车场 ____________|`,
    desc: '热狗套餐1.50元，像平行世界留下的价格锚。红色塑料桌牢牢固定在地上，收银员站在调料台旁，手摇洋葱机等待下一位参与者。',
    objects: {
      register: {
        name: '收银台', person: true, names: ['register', 'clerk', 'cashier', 'counter', 'menu', 'hot dog', 'hot dogs', 'hot dog combo', 'combo', 'dog'],
        desc: '热狗加汽水1.50元；披萨1.99元；糖条1.00元。收银员看着和菜单一样饱经岁月。',
        verbs: {
          buy: (g) => L.buyHotDog(g),
          talk: '“热狗？”这不像问题，更像预言。',
          eat: (g) => (g.has('hot_dog') ? L.items.hot_dog.verbs.eat(g) : L.buyHotDog(g)),
          take: (g) => L.buyHotDog(g),
        },
      },
      pizza: {
        name: '披萨与糖条', scenery: true, names: ['pizza', 'slice', 'pizza slice', 'churro'],
        desc: '披萨像井盖，糖条像可以当教鞭。',
        verbs: { buy: '你想了想，还是热狗更符合本次预算口径。', eat: '买热狗吧，这是本作的传统，不是隐藏采购系统。' },
      },
      condiments: {
        name: '调料台', names: ['condiment station', 'condiments', 'mustard', 'ketchup', 'onions', 'onion grinder', 'grinder'],
        desc: '番茄酱、芥末、酸黄瓜，还有那台著名的手摇洋葱机。摇过的人很多，清过的人很少。',
        verbs: {
          use: (g) => (g.has('hot_dog') ? '洋葱、芥末、少量酸黄瓜。你的个人定制版完成了。' : '你对着空气摇洋葱。有人看着你，你摇得更快。双方都不知道为什么。'),
          eat: '你直接吃了一勺酸黄瓜。大家都看见了，这段记录无法撤回。',
          drink: '你往嘴里挤芥末，旁边孩子哭了。不是你的高光时刻。',
        },
      },
      tables: {
        name: '桌椅', scenery: true, names: ['tables', 'table', 'chair', 'seat', 'bench'],
        desc: '红色塑料桌固定在地上，一张刻着“老顾永远年轻”。',
        verbs: { sit: '出乎意料地平静。你与大包装经济暂时和解。' },
      },
    },
    exits: [
      { to: 'costco_lot', label: '停车场', names: ['parking lot', 'lot', 'out', 'outside', 'exit'] },
      { to: 'costco_entrance', label: '商店入口', names: ['entrance', 'warehouse', 'inside', 'store', 'in'], cond: (g) => (isClosed(g) ? '仓储店已经关门，只有餐饮区还亮着，像价格友好的灯塔。' : true) },
    ],
  });

  L.buyHotDog = (g) => {
    if (g.has('hot_dog')) return '你已经有了。吃掉它，老刘，别把热狗也做成积压需求。';
    if (!g.spend(HOT_DOG_PRICE)) return '连1.50元也拿不出了。先别急着让这件事代表人生。';
    g.give('hot_dog');
    g.sfx('cash');
    return '你用1.50元买下热狗套餐。收银员庄重递给你，好像交接了一项民生保障。［现金：-1.50元］';
  };
})();
