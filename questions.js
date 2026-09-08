/* FPTI v2 — original, non-validated self-reflection questionnaire. */
(function (root) {
  'use strict';
  const TYPES = {
    C: { id: 1, name: '合作型', role: '协调者', en: 'COOPERATE', tag: '先让事情和关系运转起来',
      line: '你习惯先找到大家都能往下走的办法。',
      desc: '在这次选择里，你更常优先考虑协作与关系。你会调整表达方式、理解各方需求，也愿意承担让事情顺利推进的工作。',
      strength: '适合需要耐心沟通、协调分工和稳定交付的场合。你通常能看到别人忽略的配合成本。',
      risk: '当“先配合”变成默认答案，自己的时间和意见可能被挤到最后。愿意合作与不得不答应，需要分开看。',
      action: '下一次答应请求前，先说清自己能做的范围：“这部分我可以接，另外那部分需要另作安排。”',
      traits: ['协作优先', '照顾关系', '稳定推进'], color: 'oklch(82% 0.06 60)' },
    A: { id: 2, name: '主导型', role: '掌舵者', en: 'ASSERT', tag: '自己的选择，自己作主',
      line: '你愿意把“我想怎么做”说清楚。',
      desc: '在这次选择里，你更常从自己的判断出发。你愿意表达偏好、争取机会，并在条件不合适时说不，而不必等所有人认可。',
      strength: '适合需要决策、主动推进和明确边界的场合。面对不确定，你更愿意通过行动获得反馈。',
      risk: '判断快不等于信息充分。表达过于直接、过早推进，也可能让协作者来不及补充重要信息。',
      action: '下一次作决定时，先补一句：“我倾向这样做，你看到的最大风险是什么？”听完再决定，不必让出决定权。',
      traits: ['自主判断', '直接表达', '边界清晰'], color: 'oklch(75% 0.07 140)' },
    V: { id: 3, name: '回避型', role: '守望者', en: 'AVOID', tag: '先确认安全，再考虑向前',
      line: '你会先想清楚，迈出这一步可能失去什么。',
      desc: '在这次选择里，你更常关注不确定性和潜在损失。你倾向先观察、延迟回应或减少暴露，给自己保留退路。',
      strength: '适合需要识别风险、谨慎检查的场合。你不容易因为一时兴奋就忽略后果。',
      risk: '等待更稳妥的时机，有时会延长悬而未决的压力。如果迟迟不行动，也就拿不到能修正担忧的新信息。',
      action: '选一件最近拖着的小事，把动作缩到可撤回的一步：只问一个问题、只发一句确认，不要求一次解决全部。',
      traits: ['风险敏感', '先行观察', '保留退路'], color: 'oklch(70% 0.05 220)' },
    R: { id: 4, name: '竞争型', role: '竞逐者', en: 'RIVAL', tag: '不仅要做好，也想赢一次',
      line: '你很在意自己的努力，最后有没有被看见。',
      desc: '在这次选择里，你更常留意比较、认可与位置。看到别人领先，会激起你的行动欲；遇到质疑，你也容易想用成绩回应。',
      strength: '适合目标明确、需要争取资源和持续突破的场合。你对差距敏感，也愿意为追赶付出努力。',
      risk: '当目标只剩“不能输给谁”，你可能在并不想要的赛道上投入过多，或把一次反馈听成对整个人的否定。',
      action: '下一次因比较而加码前，问自己：“如果没有人知道这件事，我还愿意为它花这些时间吗？”再决定投入多少。',
      traits: ['比较驱动', '渴望认可', '争取优势'], color: 'oklch(80% 0.07 30)' }
  };
  const MODE_KEYS = ['C', 'A', 'V', 'R'];
  const CONTEXTS = {
    social: '陌生社交', work: '协作分歧', voice: '自我表达',
    opportunity: '机会选择', boundary: '关系边界', feedback: '失误反馈'
  };
  // Each row's four answers are authored in C/A/V/R order; display positions rotate.
  const ITEMS = [
  [
    "social",
    "独自参加一个几乎没有熟人的聚会，你通常会怎么开始？",
    "先顺着别人的话题聊，让交流自然一点",
    "找一个自己感兴趣的人，主动开启话题",
    "先待在边上观察，等别人来搭话",
    "先看谁最受关注，再想怎么让人记住我"
  ],
  [
    "opportunity",
    "朋友邀请你参加一项从没试过的活动，你更常因为哪一点决定去？",
    "朋友很希望我去，一起参与也挺好",
    "我自己好奇，愿意试一次再判断",
    "有人带着、流程清楚，才比较敢去",
    "这是个展示潜力、让人另眼相看的机会"
  ],
  [
    "boundary",
    "关系不错的人做了一件让你不舒服的事，你更可能？",
    "找个不伤和气的方式提醒，希望彼此调整",
    "明确说出哪件事不舒服，希望以后怎么做",
    "先不提，减少接触，避免正面谈这件事",
    "表面不动声色，之后不想让自己再处于下风"
  ],
  [
    "feedback",
    "你在公开场合说错了一件事，被人指出，你的第一反应更接近？",
    "先回应对方，把场面接下去",
    "确认错误就改口，继续讨论事情",
    "觉得很尴尬，之后一段时间不太想发言",
    "想尽快补充一个有价值的观点，把表现扳回来"
  ],
  [
    "social",
    "一群人聊得热闹，但话题是你完全不了解的领域，你会？",
    "认真听，也回应他们的兴奋点",
    "直接问不懂的地方，不介意从头了解",
    "少说话，怕问出显得外行的问题",
    "找机会转到自己擅长、能表现的话题"
  ],
  [
    "work",
    "同伴提出一个你觉得很难完成的截止时间，你会？",
    "一起重新分配工作，尽量找到折中时间",
    "说明做不到的原因，提出可兑现的期限",
    "不敢当场反对，回去后再为进度发愁",
    "想办法赶出来，不想显得比其他人能力弱"
  ],
  [
    "voice",
    "准备发布一条表达个人观点的内容时，你最容易卡在哪？",
    "怎么说才能让不同立场的人都愿意听",
    "证据够不够支撑我的观点",
    "别人会不会觉得我幼稚，还是先不发",
    "这条够不够有分量，能不能比同类内容更亮眼"
  ],
  [
    "opportunity",
    "有一个名额有限的机会，你基本符合要求，但没有十足把握，你会？",
    "先了解组织方需要什么，看看自己能提供什么",
    "先提交申请，再准备后续需要的材料",
    "想等条件更成熟，担心申请被拒绝",
    "研究其他候选人的优势，争取把自己推到前面"
  ],
  [
    "boundary",
    "家人对你的一项个人选择意见很大，你更可能？",
    "反复沟通，尽量找到双方能接受的安排",
    "听取担心，但保留最后由自己决定",
    "一想到争执就头疼，先搁置这个决定",
    "更想把事情做成，证明他们低估了我"
  ],
  [
    "feedback",
    "与你起点相近的人最近进展很快，你更接近哪种反应？",
    "替对方高兴，聊聊以后有没有合作的地方",
    "看看哪些经验适合自己，继续按自己的目标走",
    "觉得自己落后了，一时不太想看相关消息",
    "立刻想追上去，开始给自己加任务"
  ],
  [
    "work",
    "合作成果不错，但介绍成果时没有提到你的贡献，你会？",
    "私下沟通，希望下一次能把分工交代完整",
    "补充事实，明确自己负责了哪些工作",
    "觉得委屈，但担心开口显得计较",
    "很难不在意，想在下个项目拿到更显眼的位置"
  ],
  [
    "voice",
    "有人当面夸你做得好，你通常怎么回应？",
    "谢谢对方，也提一提其他人的帮助",
    "直接接受夸奖，讲讲自己满意的部分",
    "有点不自在，下意识说“没有没有”",
    "很受鼓舞，也想知道对方是否觉得我比别人突出"
  ],
  [
    "opportunity",
    "一个尝试做了一阵，发现不如预期，你更可能因为什么继续？",
    "还有人依赖我的配合，想把承诺完成",
    "我判断目标仍值得，只是方法要调整",
    "不敢决定停下，怕放弃以后会后悔",
    "不甘心就这样结束，想做出成绩再说"
  ],
  [
    "boundary",
    "需要和一个你很在意的人谈清彼此期待时，你通常会？",
    "先听对方希望怎样相处，愿意为维持关系调整自己的安排",
    "主动说清我想要什么、不能接受什么，让对方明确回应",
    "先不谈这个话题，保持现状，等关系自然发展",
    "不先亮出自己的底牌，想等对方表态后再决定怎么回应"
  ]
];
  const QUESTIONS = ITEMS.map((row, i) => ({
    id: i + 1, context: row[0], text: row[1],
    options: MODE_KEYS.map((_, j) => {
      const index = (j + i) % 4;
      return { key: 'ABCD'[j], text: row[index + 2], mode: MODE_KEYS[index] };
    })
  }));
  const leadersOf = scores => {
    const max = Math.max(...MODE_KEYS.map(k => scores[k]));
    return MODE_KEYS.filter(k => scores[k] === max);
  };
  function calcResult(answers) {
    if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) throw new Error('请完成全部 ' + QUESTIONS.length + ' 道题。');
    const scores = Object.fromEntries(MODE_KEYS.map(k => [k, 0]));
    const contexts = Object.fromEntries(Object.entries(CONTEXTS).map(([k, label]) => [k, { key: k, label, total: 0, scores: { C: 0, A: 0, V: 0, R: 0 } }]));
    QUESTIONS.forEach((q, i) => {
      const option = q.options.find(o => o.key === answers[i]);
      if (!option) throw new Error('第 ' + (i + 1) + ' 题尚未有效作答。');
      scores[option.mode]++;
      contexts[q.context].scores[option.mode]++;
      contexts[q.context].total++;
    });
    const leaders = leadersOf(scores);
    const ranked = MODE_KEYS.slice().sort((a, b) => scores[b] - scores[a]);
    return {
      scores, leaders, ranked, total: QUESTIONS.length,
      // One decimal place; displayed shares may total 99.9/100.1 due to rounding.
      shares: Object.fromEntries(MODE_KEYS.map(k => [k, scores[k] / QUESTIONS.length * 100])),
      contexts: Object.values(contexts).map(c => ({ ...c, leaders: leadersOf(c.scores) }))
    };
  }
  const api = { TYPES, MODE_KEYS, CONTEXTS, QUESTIONS, calcResult };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FPTI = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
