(function () {
  'use strict';
  const L = LSJ;

  L.cleanSuit = (g) => {
    if (g.flag('suit_clean')) return '衬衫已经干净了。过度优化容易出事故。';
    g.set('suit_clean');
    g.lose('stain_pen');
    g.sfx('spray'); g.award('clean_suit');
    return '你用去污笔点了点那块工牌形状的螺蛳粉污渍。它先缩成访客证，再缩成二维码，最后彻底消失，顺带带走几根纤维。格子衬衫干净了！去污笔也完成了一次性职业生涯。';
  };
  L.stapleReport = (g) => {
    if (g.flag('tps_stapled')) return '周报已经装好封面了。再订一次属于无效加班。';
    if (!g.has('tps_report')) return '你还没有周报。';
    if (!g.has('cover_sheet')) return '拿什么订？通知要求的是新版封面。';
    if (!g.has('stapler')) return '需要订书机。回形针不符合流程，申请例外还得再写一份周报。';
    g.set('tps_stapled');
    g.lose('cover_sheet');
    g.sfx('stapler'); g.award('staple_report');
    return '咔嗒！老莫的橙色订书机一口咬穿封面和周报。内容有没有价值不重要，形式上的闭环已经完成。';
  };
  L.addItem({
    id: 'suit', worn: true,
    name: (g) => (g.flag('suit_clean') ? '格子衬衫（干净）' : '格子衬衫（有污渍）'),
    names: ['suit', 'leisure suit', 'jacket', 'pants', 'polyester', 'stain', 'lapels', 'clothes', 'chili stain', 'ohio'],
    desc: (g) => g.flag('suit_clean')
      ? '一件格子衬衫。洗净后格子都显得更有边界感，终于不是工牌的背景板了。'
      : '一件穿出了资深工程师气质的格子衬衫。胸前有块工牌形状的螺蛳粉污渍，是某次深夜上线留下的技术债。',
    verbs: {
      remove: '老刘自从上次团建换装事故后就不在公共场合脱衬衫了。事故细节不在本次复盘范围。',
      wear: '已经穿着了。精神上，你入职时就被焊在这件衬衫里。',
      drop: '然后穿背心去见王总？这不是那种职场模拟器。',
      take: '你正穿着呢。',
      smell: (g) => (g.flag('cologne') ? '清新喷雾混着格子衬衫的味道：努力装成生活赢家。' : '螺蛳粉、樟脑丸和淡淡的绩效焦虑。'),
      clean: (g) => (g.has('stain_pen') ? L.cleanSuit(g) : g.flag('suit_clean') ? '已经干净了。' : '你沾了点水搓污渍。现在它成了一块湿工牌。需要专业去污工具。'),
      eat: '你考虑把污渍舔掉，随后想起那顿螺蛳粉吃在上一个财年。',
    },
    receive: { stain_pen: (g) => L.cleanSuit(g) },
  });
  L.addItem({
    id: 'wallet', name: '钱包', names: ['wallet', 'billfold', 'money', 'cash', 'dollars'],
    desc: (g) => `一只魔术贴钱包。里面有${g.fmt(g.money())}、山姆会员卡，还有一张早已失效的健身体验券。你的自律一直处于待激活状态。`,
    verbs: {
      open: (g) => `刺啦——魔术贴响得像撕开绩效结果。里面有${g.fmt(g.money())}、山姆会员卡和一张过期健身体验券。`,
      drop: '你的全部身家都在里面。钱不多，但会员身份让人产生阶层错觉。',
    },
  });
  L.addItem({
    id: 'keys', name: '车钥匙', names: ['keys', 'key', 'car keys', 'keychain', 'disco ball'],
    desc: '二手代步车的钥匙，挂着公司年会发的“未来可期”钥匙扣。未来没来，电瓶先走了。',
    verbs: { use: '拿去开青年人才公寓停车场里的车。就是那辆不肯启动的。', drop: '老刘曾把钥匙锁车里三天。交过的学费不能白交。' },
  });
  L.addItem({
    id: 'costco_card',
    name: (g) => (g.flag('membership_valid') ? '山姆会员卡（有效）' : '山姆会员卡（过期）'),
    names: ['costco card', 'card', 'membership card', 'membership', 'gold star card', 'sam card'],
    desc: (g) => '山姆会员卡。照片还是当年烫着头、相信期权能买房的老刘。' +
      (g.flag('membership_valid') ? '上面新贴了“已续费”，身份危机暂时解除。' : '红章写着“已过期”，连消费资格都要维护。'),
    verbs: { eat: '这不是免费试吃。', drop: '进店还得靠它，别把身份也弄丢了。' },
  });
  L.addItem({
    id: 'tps_report',
    name: (g) => (g.flag('tps_stapled') ? '周报（已装封面）' : '周报'),
    names: ['tps report', 'report', 'tps', 'tps reports', 'testing procedure specification'],
    desc: (g) => g.flag('tps_stapled')
      ? '周报已订上新版封面，完全合规。没有信息增量，但看着很有颗粒度。'
      : '四十页没人会看的数字。按通知要求，必须附上新版封面。',
    verbs: {
      read: '第一页：“本周进展”。第二页：持续推进。第三页：积极对齐。第四十页：形成闭环。周二你花十一分钟写完了。',
      staple: (g) => L.stapleReport(g),
      drop: '王总会知道的。王总不懂业务，但总能知道谁没交材料。',
      eat: '销毁证据也没用，王总会要求你补交。',
    },
    receive: {
      cover_sheet: (g) => (g.has('stapler') ? L.stapleReport(g) : '你把封面贴在周报上。还得用订书机正式装订。'),
      stapler: (g) => L.stapleReport(g),
    },
  });
  L.addItem({
    id: 'cover_sheet', name: '新版周报封面', names: ['cover sheet', 'cover', 'sheet', 'cover page', 'tps cover sheet'],
    desc: '新版周报封面。和旧版的唯一区别：公司标志大了百分之二。',
    useOn: { tps_report: (g) => (g.has('stapler') ? L.stapleReport(g) : '得订上去。整层楼只有老莫的订书机能用。') },
    verbs: { read: '周报封面，第七版。“无限对齐，从你开始！”' },
  });
  L.addItem({
    id: 'paper', name: '一包打印纸', names: ['paper', 'ream', 'ream of paper', 'printer paper', 'letter paper', 'letter'],
    desc: '五百张打印纸。常年垫桌脚，边角略微压实，承担了不属于它的岗位职责。',
    verbs: { eat: '膳食纤维不是这个意思。', read: '一片空白，像全员大会上你听完战略后的大脑。' },
  });
  L.addItem({
    id: 'cake', name: '生日蛋糕', names: ['cake', 'slice', 'slice of cake', 'birthday cake', 'piece of cake'],
    desc: '员工生日会剩下的边角蛋糕，奶油特别厚，上面还能看见“生日”的半个字。降本后难得的优质资产。',
    verbs: {
      eat: '你举起蛋糕又放下了。办公室里好像有人比你更需要被记得。那人不是今天过生日的同事。',
      smell: '糖、奶油和茶水间冰箱的复合气息。',
    },
  });
  L.addItem({
    id: 'stapler', name: '老莫的橙色订书机', names: ['stapler', 'orange stapler', 'mervs stapler', 'swingline'],
    desc: '沉甸甸的橙色订书机，老莫最后的岗位安全感。还带着他的手温。',
    useOn: { tps_report: (g) => L.stapleReport(g), cover_sheet: (g) => L.stapleReport(g) },
    verbs: { drop: '老莫会知道。他什么都知道，只是不在群里说。', staple: (g) => L.stapleReport(g) },
  });
  L.addItem({
    id: 'stain_pen', name: '去污笔', names: ['pen', 'stain pen', 'stain-b-gone', 'stain b gone', 'stain remover', 'stain b gone pen'],
    desc: '山姆自有品牌去污笔。“去除草渍、酒渍、口红和加班夜宵的痕迹。”不负责清除精神内耗。',
    useOn: { suit: (g) => L.cleanSuit(g), jeff: (g) => L.cleanSuit(g) },
    verbs: { eat: '这是去污笔，不是试吃。' },
  });
  L.addItem({
    id: 'battery', name: '汽车电瓶', names: ['battery', 'car battery', 'new battery', 'dieharder'],
    desc: '十八公斤多的山姆自有品牌耐久电瓶。拿起它，你就知道什么叫沉没成本。',
    verbs: { drop: '放下就抬不起来了。你的腰已经替你做出了风险评估。', eat: '别把自己做成安全培训案例。' },
  });
  L.addItem({
    id: 'cart', name: '购物车', names: ['cart', 'shopping cart', 'trolley', 'buggy'],
    desc: '巨大的山姆购物车，装下三代人的纸巾需求绰绰有余。左前轮持续尖叫，很像周一的你。',
    verbs: { drop: '你停好它，又拉回来。搬电瓶还得靠它。', sit: '你爬进购物车，没人愿意推你。成年人的快乐需要自己提供运力。你又爬出来。' },
  });
  L.addItem({
    id: 'coupon', name: '电瓶优惠券', names: ['coupon', 'battery coupon', 'mailer'],
    desc: '山姆优惠券：“任意汽车电瓶立减10.00元，仅限今日。”带着一点披萨味，原来增量藏在垃圾箱。',
    verbs: { read: '“任意汽车电瓶立减10.00元，仅限今日，每位会员限用一张。”' },
  });
  L.addItem({
    id: 'hot_dog', name: '热狗', names: ['hot dog', 'hotdog', 'dog', 'frank', 'wiener', 'hot dog combo'],
    desc: '热狗加汽水套餐，1.50元。在万物涨价的平行世界里，这是老刘最后的确定性。',
    verbs: {
      eat: (g) => {
        g.lose('hot_dog');
        g.sfx('gulp'); g.award('hot_dog');
        return g.flag('suit_clean')
          ? '你前倾四十五度，像审核上线方案一样谨慎地吃完热狗。衬衫一滴没沾。旁边有人鼓掌，可能只是拍蚊子。'
          : '你三口吞下热狗，一滴芥末落在工牌形状的螺蛳粉污渍上。技术债又叠了一层，底层架构毫不在意。';
      },
    },
  });
  L.addItem({
    id: 'cologne', name: '清新喷雾', names: ['cologne', 'brut force', 'brut', 'aftershave', 'bottle', 'perfume'],
    desc: '一瓶清新喷雾，标签写着“开会前一喷，假装睡够八小时”。只剩最后一点。',
    verbs: {
      wear: (g) => {
        if (g.flag('cologne')) return '已经够香了。再喷就要触发办公室空气质量应急预案。';
        g.set('cologne');
        g.sfx('spray'); g.award('cologne');
        return '你往脖子、手腕和衬衫领口各喷一下。周围空气仿佛都完成了消杀。你闻起来像一个成功管理睡眠的人。';
      },
      use: (g) => L.items.cologne.verbs.wear(g),
      drink: (g) => g.die('清新过头', '你猛灌一口清新喷雾，尝到了松树和项目延期的味道。视线逐渐模糊。告别会上大家一致认为：老刘走得很香，但这不属于有效健康管理。'),
      smell: '松木、酒精和共享会议室的洁净幻觉。',
    },
    useOn: { jeff: (g) => L.items.cologne.verbs.wear(g), suit: (g) => L.items.cologne.verbs.wear(g) },
  });
  L.addItem({
    id: 'comb', name: '梳子', names: ['comb', 'pocket comb', 'brush'],
    desc: '缺了两颗齿的黑塑料梳子。和主人一样，人手不足但还在坚持。',
    verbs: { use: (g) => L.combHair(g), comb: (g) => L.combHair(g) },
    useOn: { jeff: (g) => L.combHair(g) },
  });
  L.addItem({
    id: 'flair', name: '企业文化徽章', names: ['flair', 'button', 'flair button', 'pin', 'badge'],
    desc: '圆徽章上写着“我爱对齐”。公司要求每人佩戴十五枚文化徽章。这是其中一枚，形式大于一切。',
    verbs: {
      wear: (g) => {
        if (g.flag('flair_worn')) return '已经戴着了。至于是否自豪，不纳入本次考核。';
        g.set('flair_worn');
        g.award('wear_flair');
        return '你把“我爱对齐”别在衬衫上。企业文化落地，归属感增加百分之六，生命力减少百分之四十。';
      },
    },
  });
})();
