/* =========================================================
   LIFE RPG v2 — your life, your rules.
   Solo Leveling-inspired life gamification.
   Daily / weekly / monthly quests · weekly boss · stats & classes
   random System quests · shareable card · monthly reports
   cloud sync (Supabase) · every rule editable in Settings
   ========================================================= */

const KEY = 'liferpg_v1';

const AVATARS = ['⚔️','🗡️','🌙','👁️','🔥','⚡','💀','🐺','🦅','🌊','🎯','🛡️'];


const CAT_STAT = { Body:'STR', Mind:'INT', Discipline:'VIT', Social:'CHA' };
const START_SIGILS = ['\u2694\uFE0F','\u{1F5E1}\uFE0F','\u{1F319}','\u{1F441}\uFE0F'];
const TITLES = ['The Unbroken','Night Blade','Iron Will','Silent Storm','First of the Dawn','Abyss Walker','King of the Night','Eclipse','Stormcaller','The Patient Hunter'];
const RANKS = [
  { r:'BRONZE',   icon:'\u{1F949}', exp:0 },
  { r:'SILVER',   icon:'\u{1F948}', exp:500 },
  { r:'GOLD',     icon:'\u{1F947}', exp:1000 },
  { r:'PLATINUM', icon:'\u{1F3C6}', exp:1500 },
  { r:'DIAMOND',  icon:'\u{1F48E}', exp:2000 },
  { r:'CROWN',    icon:'\u{1F451}', exp:2500 },
];
const CRATES = {
  wood:    { icon:'\u{1F4E6}', name:'Wooden Crate',  desc:'Earn 100 EXP today',             goals:{quests:0, exp:100, perfect:0}, rewardHint:'20\u201345 \u25C8 \u00B7 EXP' },
  gold:    { icon:'\u{1F4B0}', name:'Gold Crate',    desc:'Earn 250 EXP today',             goals:{quests:0, exp:250, perfect:0}, rewardHint:'50\u2013100 \u25C8 \u00B7 potion \u00B7 title' },
  diamond: { icon:'\u{1F48E}', name:'Diamond Crate', desc:'Earn 500 EXP + 5 quests today',  goals:{quests:5, exp:500, perfect:0}, rewardHint:'120\u2013220 \u25C8 \u00B7 saver \u00B7 title' },
};
const QUOTES = [
  'Only you level up.',
  'The System does not negotiate. But it keeps the score.',
  'Every quest you complete is a wall the darkness cannot cross.',
  'Arise.',
  'Body, mind, discipline, people \u2014 that is the whole build.',
  'A streak is a promise you make to your future self.',
  'Gold is just a memory of effort.',
  'The dungeon is life. Enter anyway.',
  'You do not find your path. You check in on it, daily.',
  'Monarchs are made on ordinary days.',
];
function dailyQuote(){
  const d = new Date();
  const doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  return QUOTES[doy % QUOTES.length];
}
function timeLeftToday(){
  const now = new Date();
  const end = new Date(now); end.setHours(24, 0, 0, 0);
  const ms = end - now;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h + 'h ' + String(m).padStart(2, '0') + 'm';
}
const statForCategory = c => CAT_STAT[c] || null;

const DEFAULT_QUESTS = [
  // daily
  { id:'q1', name:'50 push-ups',                     icon:'💪', exp:50,  gold:5,  dailyLimit:1, category:'Body',       freq:'daily' },
  { id:'q2', name:'Read 20 pages',                   icon:'📖', exp:60,  gold:6,  dailyLimit:1, category:'Mind',       freq:'daily' },
  { id:'q3', name:'Drink 8 glasses of water',        icon:'💧', exp:40,  gold:4,  dailyLimit:1, category:'Body',       freq:'daily' },
  { id:'q4', name:'Walk or workout 30 min',          icon:'🏃', exp:70,  gold:7,  dailyLimit:1, category:'Body',       freq:'daily' },
  { id:'q5', name:'No social media before noon',     icon:'📵', exp:30,  gold:3,  dailyLimit:1, category:'Discipline', freq:'daily' },
  // weekly
  { id:'q6', name:'Deep work block (4 focused hours)', icon:'🧠', exp:200, gold:20, dailyLimit:1, category:'Mind',       freq:'weekly' },
  { id:'q7', name:'Weekly review + plan next week',    icon:'🗺️', exp:150, gold:15, dailyLimit:1, category:'Discipline', freq:'weekly' },
  // monthly
  { id:'q8', name:'Big monthly milestone (main goal)', icon:'🏔️', exp:500, gold:50, dailyLimit:1, category:'Discipline', freq:'monthly' },
  { id:'q9', name:'Savings target: put money aside',   icon:'💰', exp:400, gold:40, dailyLimit:1, category:'Discipline', freq:'monthly' },
];

const DEFAULT_REWARDS = [
  { id:'r1', name:'Movie night',            icon:'🍿', cost:50 },
  { id:'r2', name:'1 hour of gaming',       icon:'🎮', cost:100 },
  { id:'r3', name:'Buy something you want', icon:'🛍️', cost:250 },
  { id:'r4', name:'Full cheat day',         icon:'🍔', cost:300 },
];

const BOSS_POOL = [
  'The Procrastination Dragon','The Distraction Serpent','The Comfort Zone Golem','The Excuses Wraith',
  'The Late-Night Scroll Beast','The Perfectionism Titan','The Sugar Phantom','The Doom-Scroll Hydra',
  'The Comparison Lich','The Burnout Colossus'
];

const SYS_POOL = [
  { n:'Call someone you miss',             i:'📞', e:60, g:6 },
  { n:'Tidy one drawer or shelf',          i:'🧹', e:50, g:5 },
  { n:'Take a cold shower (1 min+)',       i:'🚿', e:70, g:7 },
  { n:'Write 3 goals for next month',      i:'✍️', e:60, g:6 },
  { n:'Do 20 squats in 60 seconds',        i:'🦵', e:50, g:5 },
  { n:'Declutter your phone home screen',  i:'📱', e:40, g:4 },
  { n:'Give one sincere compliment',       i:'💬', e:45, g:5 },
  { n:'Plan tomorrow\'s meals',            i:'🍳', e:40, g:4 },
  { n:'Walk 15 min without your phone',    i:'🌳', e:60, g:6 },
  { n:'Do one thing you keep putting off', i:'⏳', e:80, g:8 },
  { n:'Drink a glass of water right now',  i:'💧', e:20, g:2 },
  { n:'Clear 5 emails / notifications',    i:'📬', e:40, g:4 },
  { n:'Practice a new skill for 15 min',   i:'🎯', e:70, g:7 },
  { n:'Thank someone for something specific', i:'🙏', e:45, g:5 },
  { n:'Photograph something beautiful',    i:'📷', e:35, g:4 },
  { n:'Read one article fully, no skimming', i:'📰', e:45, g:5 },
  { n:'Sit in complete silence for 5 min', i:'🕯️', e:55, g:5 },
  { n:'Stretch for 5 minutes',             i:'🤸', e:40, g:4 },
  { n:'Cook instead of ordering out',      i:'👨‍', e:65, g:6 },
  { n:'Go to bed before midnight',         i:'🌙', e:50, g:5 },
];

const BADGES = [
  { id:'first',    icon:'✨', name:'Awakening',    desc:'Complete your first quest',  test:s=>s.totalQuests>=1 },
  { id:'q10',      icon:'🎖️', name:'Ten Deeds',    desc:'Complete 10 quests',         test:s=>s.totalQuests>=10 },
  { id:'q100',     icon:'🏛️', name:'Centurion',    desc:'Complete 100 quests',        test:s=>s.totalQuests>=100 },
  { id:'streak3',  icon:'🔥', name:'Ignited',      desc:'Reach a 3-day streak',       test:s=>s.streak>=3 },
  { id:'streak7',  icon:'☄️', name:'Blazing',      desc:'Reach a 7-day streak',       test:s=>s.streak>=7 },
  { id:'streak30', icon:'🌋', name:'Unstoppable',  desc:'Reach a 30-day streak',      test:s=>s.streak>=30 },
  { id:'lv10',     icon:'🌪️', name:'Rising Power', desc:'Reach level 10',             test:s=>levelFromExp(s.exp).level>=10 },
  { id:'lv25',     icon:'🌌', name:'Elite',        desc:'Reach level 25',             test:s=>levelFromExp(s.exp).level>=25 },
  { id:'gold1k',   icon:'👑', name:'Wealthy',      desc:'Earn 1,000 total gold',      test:s=>s.totalGold>=1000 },
  { id:'boss1',    icon:'🗡️', name:'Boss Slayer',  desc:'Defeat your first weekly boss', test:s=>(s.bossKills||0)>=1 },
  { id:'boss10',   icon:'⚔️', name:'Demon Hunter', desc:'Defeat 10 weekly bosses',    test:s=>(s.bossKills||0)>=10 },
  { id:'stat100',  icon:'🧬', name:'Awakened',     desc:'Reach 5,000 total EXP', test:s=>s.exp>=5000 },
];

const DEFAULT_SETTINGS = {
  sound:true,
  expBase:100, expGrowth:1.35,
  rankD:5, rankC:10, rankB:15, rankA:20, rankS:30,
  hpPenalty:20, hpHeal:2, maxHp:100,
  perfectDayGold:25, perfectWeekGold:75, perfectMonthGold:150,
  bossExp:500, bossGold:100, bossPhases:3, bossKillBonus:50,
  randomQuests:true,
  hideCompleted:true,
  theme:'cyan', questLayout:'path',
  sync:{ url:'', key:'', auto:false, lastPush:null, lastPull:null, playerId:'' },
};

/* ---------------- state ---------------- */

let state = null;
let editingQuest = null;
let editingReward = null;
let pickedAvatar = AVATARS[0];
let pickedClass = 'warrior';

function newPlayerId(){
  try{ return crypto.randomUUID(); }catch(e){ return 'p'+Date.now()+Math.floor(Math.random()*1e6); }
}

function newBoss(week){
  return { week: week || periodFor('weekly'), boss: BOSS_POOL[Math.floor(Math.random()*BOSS_POOL.length)], done:0 };
}
function newSystemQuest(day){
  const p = SYS_POOL[Math.floor(Math.random()*SYS_POOL.length)];
  return { day: day || todayStr(), name:p.n, icon:p.i, exp:p.e, gold:p.g, done:false, dismissed:false };
}

function defaultState(){
  const s = {
    created: Date.now(),
    character: { name:'Player', avatar:'👁️' },
    class:'warrior',
    stats: { STR:0, INT:0, VIT:0, CHA:0 },
    exp:0, hp:100, gold:0, totalGold:0, totalQuests:0,
    streak:0, bestStreak:0, lastQuestDay:null,
    day: todayStr(),
    view:'character',
    perfect:{},
    inventory:{ streakSaver:0, hpPotion:0, xpPotion:0, armor:0, salmon:0, seerStone:0, frozenFlame:0 },
    xpMultiplier:0,
    streakFrozenDays:0,
    lastBlessingDay:null,
    missions:{ day:null, list:[] },
    crates:{ day:null, tier:null, progress:{quests:0,exp:0,perfect:0}, done:false, claimed:false },
    dayExp:0,
    viewModes:{ quests:'path', shop:'grid', crates:'grid' },
    season:{ num:1, drop:0 },
    collection:{ sigils: START_SIGILS.slice(), titles:[]},
    activeTitle:null,
    dayQuests:0, bestQuestsDay:0,
    freeSupplyDay:null,
    quests: DEFAULT_QUESTS.map(q => ({ ...q, timesDone:0, resetKey:periodFor(q.freq) })),
    rewards: DEFAULT_REWARDS,
    bought:[], log:[], badges:[],
    bossKills:0,
    boss: newBoss(),
    bossCustomName:'',
    systemQuest: newSystemQuest(),
    lastReportMonth:null,
    settings: null,
  };
  s.settings = Object.assign({}, DEFAULT_SETTINGS, {
    sync: Object.assign({}, DEFAULT_SETTINGS.sync, { playerId:newPlayerId() }),
  });
  return s;
}

function migrate(s){
  const def = defaultState();
  for(const k of Object.keys(def)) if(s[k] === undefined) s[k] = def[k];
  s.settings = Object.assign({}, DEFAULT_SETTINGS, s.settings || {});
  s.settings.sync = Object.assign({}, def.settings.sync, s.settings.sync || {});
  if(!s.settings.sync.playerId) s.settings.sync.playerId = newPlayerId();
  s.stats = Object.assign({ STR:0, INT:0, VIT:0, CHA:0 }, s.stats || {});
  s.perfect = Object.assign({}, s.perfect || {});
  const maxH = Math.max(1, Number(s.settings?.maxHp) || 100);
  if(s.hp > maxH) s.hp = maxH;
  if(!s.class) s.class = 'warrior';
  s.inventory = Object.assign({ streakSaver:0, hpPotion:0, xpPotion:0, armor:0, salmon:0, seerStone:0, frozenFlame:0 }, s.inventory || {});
  for(const k of ['streakSaver', 'hpPotion', 'xpPotion', 'armor', 'salmon', 'seerStone', 'frozenFlame']){
    s.inventory[k] = Math.max(0, Math.floor(Number(s.inventory[k]) || 0));
  }
  s.xpMultiplier = Math.max(0, Math.floor(Number(s.xpMultiplier) || 0));
  s.streakFrozenDays = Math.max(0, Math.floor(Number(s.streakFrozenDays) || 0));
  if(!['character','quests','crates','log','shop','settings'].includes(s.view)) s.view = 'character';
  if(!isFinite(Number(s.bestStreak))) s.bestStreak = 0;
  s.lastBlessingDay = (s.lastBlessingDay === null || typeof s.lastBlessingDay === 'string') ? s.lastBlessingDay : null;
  if(!s.missions || typeof s.missions !== 'object') s.missions = { day:null, list:[] };
  if(!Array.isArray(s.missions.list)) s.missions.list = [];
  if(!s.crates || typeof s.crates !== 'object') s.crates = { day:null, tier:null, progress:{quests:0,exp:0,perfect:0}, done:false, claimed:false };
  if(!s.crates.progress || typeof s.crates.progress !== 'object') s.crates.progress = {quests:0,exp:0,perfect:0};
  if(!['wood','gold','diamond'].includes(s.crates.tier)) s.crates.tier = null;
  s.crates.progress.quests = Math.max(0, Number(s.crates.progress.quests) || 0);
  s.crates.progress.exp = Math.max(0, Number(s.crates.progress.exp) || 0);
  s.crates.progress.perfect = Math.max(0, Number(s.crates.progress.perfect) || 0);
  if(!isFinite(Number(s.dayExp))) s.dayExp = 0;
  s.missions.list = s.missions.list.map(m => ({
    id: String(m.id || 'm'), icon: String(m.icon || '⭐'), desc: String(m.desc || 'Mission'),
    target: Math.max(1, Number(m.target) || 1), key: String(m.key || ''),
    progress: Math.max(0, Number(m.progress) || 0), reward: Math.max(0, Number(m.reward) || 0),
    claimed: !!m.claimed,
  }));
  if(!s.collection || typeof s.collection !== 'object') s.collection = { sigils: START_SIGILS.slice(), titles:[] };
  s.collection.sigils = Array.isArray(s.collection.sigils) ? s.collection.sigils.filter(x => typeof x === 'string' && AVATARS.includes(x)) : START_SIGILS.slice();
  s.collection.titles = Array.isArray(s.collection.titles) ? s.collection.titles.filter(x => typeof x === 'string' && TITLES.includes(x)) : [];
  if(s.activeTitle !== null && (typeof s.activeTitle !== 'string' || !s.collection.titles.includes(s.activeTitle))) s.activeTitle = null;
  if(!isFinite(Number(s.dayQuests))) s.dayQuests = 0;
  if(!isFinite(Number(s.bestQuestsDay))) s.bestQuestsDay = 0;
  s.freeSupplyDay = (s.freeSupplyDay === null || typeof s.freeSupplyDay === 'string') ? s.freeSupplyDay : null;
  if(s.settings){
    if(!['cyan','gold','red'].includes(s.settings.theme)) s.settings.theme = 'cyan';
    if(!['path','list'].includes(s.settings.questLayout)) s.settings.questLayout = 'path';
  }
  if(!s.viewModes || typeof s.viewModes !== 'object') s.viewModes = { quests: (s.settings.questLayout === 'list') ? 'list' : 'path', shop:'grid', crates:'grid' };
  if(s.viewModes.quests !== 'list') s.viewModes.quests = 'path';
  if(s.viewModes.shop !== 'list') s.viewModes.shop = 'grid';
  if(s.viewModes.crates !== 'list') s.viewModes.crates = 'grid';
  if(!s.season || typeof s.season !== 'object') s.season = { num:1, drop:0 };
  s.season.num = Math.max(1, Math.floor(Number(s.season.num) || 1));
  s.season.drop = Math.max(0, Math.min(5, Math.floor(Number(s.season.drop) || 0)));
  if(s.bossKills === undefined) s.bossKills = 0;
  if(s.bossCustomName === undefined) s.bossCustomName = '';
  if(s.lastReportMonth === undefined) s.lastReportMonth = null;
  s.quests.forEach(q => {
    if(!q.freq) q.freq = 'daily';
    if(!q.category) q.category = 'Other';
    if(q.dailyLimit === undefined) q.dailyLimit = 1;
    if(!q.resetKey) q.resetKey = periodFor(q.freq);
  });
  if(!s.boss) s.boss = newBoss();
  if(!s.systemQuest) s.systemQuest = newSystemQuest();
  return s;
}

/* Deep type-safety: no save (old, corrupted or foreign) can ever crash the game */
function sanitize(d){
  const def = defaultState();
  d.created = Number(d.created) || Date.now();
  d.class = typeof d.class === 'string' ? d.class : 'warrior';
  d.exp = Math.max(0, Number(d.exp) || 0);
  const maxSanH = Math.max(1, Number(d.settings?.maxHp) || 100);
  d.hp = Math.max(0, Math.min(maxSanH, Number(d.hp) || 0));
  d.gold = Math.max(0, Number(d.gold) || 0);
  d.totalGold = Math.max(0, Number(d.totalGold) || 0);
  d.totalQuests = Math.max(0, Number(d.totalQuests) || 0);
  d.streak = Math.max(0, Number(d.streak) || 0);
  d.bossKills = Math.max(0, Number(d.bossKills) || 0);
  d.bestStreak = Math.max(0, Number(d.bestStreak) || 0);
  d.inventory = Object.assign({ streakSaver:0, hpPotion:0, xpPotion:0, armor:0, salmon:0, seerStone:0, frozenFlame:0 }, d.inventory || {});
  for(const k of ['streakSaver', 'hpPotion', 'xpPotion', 'armor', 'salmon', 'seerStone', 'frozenFlame']){
    d.inventory[k] = Math.max(0, Math.floor(Number(d.inventory[k]) || 0));
  }
  d.xpMultiplier = Math.max(0, Math.floor(Number(d.xpMultiplier) || 0));
  d.streakFrozenDays = Math.max(0, Math.floor(Number(d.streakFrozenDays) || 0));
  d.lastBlessingDay = (d.lastBlessingDay === null || typeof d.lastBlessingDay === 'string') ? d.lastBlessingDay : null;
  d.lastQuestDay = typeof d.lastQuestDay === 'string' ? d.lastQuestDay : null;
  if(!['character','quests','crates','log','shop','settings'].includes(d.view)) d.view = 'character';
  d.missions = { day: typeof d.missions?.day === 'string' ? d.missions.day : null, list: Array.isArray(d.missions?.list) ? d.missions.list : [] };
  d.crates = {
    day: typeof d.crates?.day === 'string' ? d.crates.day : null,
    tier: ['wood','gold','diamond'].includes(d.crates?.tier) ? d.crates.tier : null,
    progress:{ quests:Math.max(0,Number(d.crates?.progress?.quests)||0), exp:Math.max(0,Number(d.crates?.progress?.exp)||0), perfect:Math.max(0,Number(d.crates?.progress?.perfect)||0) },
    done:!!d.crates?.done, claimed:!!d.crates?.claimed,
  };
  d.dayExp = Math.max(0, Number(d.dayExp) || 0);
  d.viewModes = (d.viewModes && typeof d.viewModes === 'object') ? d.viewModes : {};
  d.viewModes.quests = d.viewModes.quests === 'list' ? 'list' : 'path';
  d.viewModes.shop = d.viewModes.shop === 'list' ? 'list' : 'grid';
  d.viewModes.crates = d.viewModes.crates === 'list' ? 'list' : 'grid';
  d.season = (d.season && typeof d.season === 'object') ? d.season : { num:1, drop:0 };
  d.season.num = Math.max(1, Math.floor(Number(d.season.num) || 1));
  d.season.drop = Math.max(0, Math.min(5, Math.floor(Number(d.season.drop) || 0)));
  d.collection = { sigils: Array.isArray(d.collection?.sigils) ? d.collection.sigils.filter(x => typeof x === 'string') : START_SIGILS.slice(), titles: Array.isArray(d.collection?.titles) ? d.collection.titles.filter(x => typeof x === 'string') : [] };
  d.activeTitle = typeof d.activeTitle === 'string' ? d.activeTitle : null;
  d.dayQuests = Math.max(0, Number(d.dayQuests) || 0);
  d.bestQuestsDay = Math.max(0, Number(d.bestQuestsDay) || 0);
  d.freeSupplyDay = (d.freeSupplyDay === null || typeof d.freeSupplyDay === 'string') ? d.freeSupplyDay : null;
  if(typeof d.day !== 'string') d.day = todayStr();
  d.lastReportMonth = (d.lastReportMonth === null || typeof d.lastReportMonth === 'string') ? d.lastReportMonth : null;
  d.character = (d.character && typeof d.character === 'object')
    ? { name: String(d.character.name || 'Player'), avatar: String(d.character.avatar || '👁️') }
    : { name:'Player', avatar:'👁️' };
  d.stats = Object.assign({ STR:0, INT:0, VIT:0, CHA:0 }, d.stats || {});
  for(const k in d.stats) d.stats[k] = Math.max(0, Number(d.stats[k]) || 0);
  d.quests = Array.isArray(d.quests) ? d.quests.map(q => {
    const freq = (q && (q.freq === 'weekly' || q.freq === 'monthly')) ? q.freq : 'daily';
    return {
      id: String((q && q.id) || ('q' + Math.random().toString(36).slice(2))),
      name: String((q && q.name) || 'Quest'),
      icon: String((q && q.icon) || '⭐'),
      category: (q && CAT_STAT[q.category]) ? q.category : 'Other',
      freq,
      exp: Math.max(1, Number(q && q.exp) || 1),
      gold: Math.max(0, Number(q && q.gold) || 0),
      dailyLimit: Math.min(10, Math.max(1, Number(q && q.dailyLimit) || 1)),
      timesDone: Math.max(0, Number(q && q.timesDone) || 0),
      resetKey: (q && typeof q.resetKey === 'string') ? q.resetKey : periodFor(freq),
    };
  }) : [];
  d.rewards = Array.isArray(d.rewards) ? d.rewards.map(r => ({
    id: String((r && r.id) || ('r' + Math.random().toString(36).slice(2))),
    name: String((r && r.name) || 'Reward'),
    icon: String((r && r.icon) || '🎁'),
    cost: Math.max(1, Number(r && r.cost) || 1),
  })) : DEFAULT_REWARDS.map(r => ({ ...r }));
  d.bought = Array.isArray(d.bought) ? d.bought : [];
  d.log = Array.isArray(d.log) ? d.log.filter(l => l && Number.isFinite(l.ts)) : [];
  d.badges = Array.isArray(d.badges) ? d.badges.filter(b => typeof b === 'string') : [];
  d.perfect = (d.perfect && typeof d.perfect === 'object') ? d.perfect : {};
  d.settings = Object.assign({}, DEFAULT_SETTINGS, (d.settings && typeof d.settings === 'object') ? d.settings : {});
  for(const k of ['expBase','expGrowth','hpPenalty','hpHeal','maxHp','perfectDayGold','perfectWeekGold','perfectMonthGold','bossExp','bossGold','bossKillBonus']){
    const n = Number(d.settings[k]);
    if(!isFinite(n)) d.settings[k] = DEFAULT_SETTINGS[k];
  }
  d.settings.expBase = Math.min(500, Math.max(1, d.settings.expBase));
  d.settings.expGrowth = Math.min(2.5, Math.max(0.5, d.settings.expGrowth));
  d.settings.bossPhases = Math.min(5, Math.max(1, Math.round(Number(d.settings.bossPhases) || 3)));
  for(const k of ['rankD','rankC','rankB','rankA','rankS']){
    const n = Number(d.settings[k]);
    if(!isFinite(n) || n < 1) d.settings[k] = DEFAULT_SETTINGS[k];
  }
  d.settings.sound = d.settings.sound !== false;
  d.settings.hideCompleted = d.settings.hideCompleted !== false;
  d.settings.randomQuests = d.settings.randomQuests !== false;
  d.settings.sync = Object.assign({}, def.settings.sync, (d.settings.sync && typeof d.settings.sync === 'object') ? d.settings.sync : {});
  if(!d.settings.sync.playerId) d.settings.sync.playerId = newPlayerId();
  d.boss = (d.boss && typeof d.boss === 'object' && d.boss.week)
    ? { week: String(d.boss.week), boss: String(d.boss.boss) || BOSS_POOL[0], done: Math.max(0, Math.min(10, Number(d.boss.done) || 0)) }
    : newBoss();
  d.bossCustomName = typeof d.bossCustomName === 'string' ? d.bossCustomName : '';
  d.systemQuest = (d.systemQuest && typeof d.systemQuest === 'object' && d.systemQuest.name)
    ? {
        day: String(d.systemQuest.day || todayStr()), name: String(d.systemQuest.name),
        icon: String(d.systemQuest.icon || '⭐'), exp: Math.max(1, Number(d.systemQuest.exp) || 30),
        gold: Math.max(0, Number(d.systemQuest.gold) || 3), done: !!d.systemQuest.done, dismissed: !!d.systemQuest.dismissed,
      }
    : newSystemQuest();
  return d;
}

function load(){
  let raw;
  try{
    raw = localStorage.getItem(KEY);
    if(!raw) return null;
    return sanitize(migrate(JSON.parse(raw)));
  }catch(e){
    // save is unparseable — park it aside, start fresh (a good import can still fix everything)
    try{ if(raw) localStorage.setItem(KEY + '_corrupt', raw); }catch(e2){}
    return null;
  }
}
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }

/* ---------------- time ---------------- */

function dateStr(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function todayStr(){ return dateStr(new Date()); }
function yesterdayStr(){ return dateStr(new Date(Date.now() - 86400000)); }
function mondayStr(d){
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  const m = new Date(d);
  m.setDate(d.getDate() - day);
  return dateStr(m);
}
function monthStrOf(d){ return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0'); }
function monthStrNow(){ return monthStrOf(new Date()); }
function monthName(ms){
  const [y, m] = ms.split('-').map(Number);
  return new Date(y, m-1, 1).toLocaleDateString(undefined, { month:'long', year:'numeric' });
}
function periodFor(freq){
  const d = new Date();
  if(freq === 'weekly') return 'w:' + mondayStr(d);
  if(freq === 'monthly') return 'm:' + monthStrOf(d);
  return 'd:' + dateStr(d);
}

/* ---------------- progression ---------------- */

function expNeededFor(level){
  return Math.max(1, Math.round(state.settings.expBase * Math.pow(level, state.settings.expGrowth)));
}
function levelFromExp(total){
  let level = 1, rem = total;
  while(rem >= expNeededFor(level)){ rem -= expNeededFor(level); level++; }
  return { level, into:rem, needed:expNeededFor(level) };
}
function rankIndexForExp(expTotal){
  const te = Math.max(0, Number(expTotal) || 0);
  if(te >= 2500) return 5;
  if(te >= 2000) return 4;
  if(te >= 1500) return 3;
  if(te >= 1000) return 2;
  if(te >= 500)  return 1;
  return 0;
}
function rankForLevel(l){
  if(typeof l === 'number'){
    if(l === 1) return 'BRONZE';
    if(l === 30) return 'CROWN';
    if(state && state.exp !== undefined && levelFromExp(state.exp).level === l){
      return rankAtExp(state.exp);
    }
    const s = state ? state.settings : DEFAULT_SETTINGS;
    if(l >= s.rankS) return 'CROWN';
    if(l >= s.rankA) return 'DIAMOND';
    if(l >= s.rankB) return 'PLATINUM';
    if(l >= s.rankC) return 'GOLD';
    if(l >= s.rankD) return 'SILVER';
    return 'BRONZE';
  }
  return rankAtExp(state ? state.exp : 0);
}
function rankIndexForLevel(l){
  if(typeof l === 'number') return RANKS.findIndex(r => r.r === rankForLevel(l));
  return rankIndexForExp(state ? state.exp : 0);
}
function rankAtExp(expTotal){
  const baseIdx = rankIndexForExp(expTotal);
  const drop = (state && state.season && Number(state.season.drop)) || 0;
  return RANKS[Math.max(0, baseIdx - drop)].r;
}

/* ---------------- seasons (PUBG-style: one month, rank drops two at the start) ---------------- */
function seasonStart(n){
  const c = new Date(Number(state.created) || Date.now());
  return new Date(c.getFullYear(), c.getMonth() + (n - 1), c.getDate());
}
function seasonInfo(){
  const now = new Date();
  let n = 1;
  for(let i = 0; i < 600; i++){
    if(seasonStart(n + 1) <= now) n++; else break;
  }
  const end = seasonStart(n + 1);
  return { num: n, end, daysLeft: Math.max(0, Math.ceil((end - now) / 86400000)) };
}
function seasonTick(){
  if(!state) return;
  if(!state.season || typeof state.season !== 'object') state.season = { num:1, drop:0 };
  state.season.num = Math.max(1, Math.floor(Number(state.season.num) || 1));
  const cur = seasonInfo();
  if(cur.num > state.season.num){
    const base = rankIndexForExp(state.exp);
    state.season.drop = Math.min(base, 2);
    state.season.num = cur.num;
    save();
    const from = RANKS[base].r, to = RANKS[Math.max(0, base - state.season.drop)].r;
    el('fxContent').innerHTML =
      '<div class="fx-kicker">System Notification</div>' +
      '<div class="fx-big">SEASON ' + cur.num + '</div>' +
      (to !== from
        ? '<div class="fx-sub">Rank reset: <b>' + from + '</b> &rarr; <b>' + to + '</b></div>'
        : '<div class="fx-sub">No rank change — the floor is BRONZE.</div>') +
      '<div class="fx-sub" style="margin-top:8px">Push back up. The System never forgets.</div>';
    showOverlay(el('fxOverlay'), 3000);
    sfxLevelUp();
  }
}
function rankIcon(name){
  const r = RANKS.find(x => x.r === name);
  return r ? r.icon : RANKS[0].icon;
}
function titleForLevel(l){
  if(l >= 30) return 'Shadow Monarch';
  if(l >= 20) return 'National-Level Hunter';
  if(l >= 15) return 'Elite Hunter';
  if(l >= 10) return 'Rising Hunter';
  if(l >= 5)  return 'The Awakened';
  return 'Novice';
}
function maxHp(){ return Math.max(1, Number(state && state.settings ? state.settings.maxHp : 100) || 100); }

function rankLadder(){
  const info = rankInfo();
  const se = seasonInfo();
  return `<div class="rank-ladder">
    <div class="rl-season"><span>SEASON ${se.num}</span><span>${se.daysLeft}d left</span></div>
    <div class="rl-top">
      <span class="rl-icon">${info.cur.icon}</span>
      <div class="rl-main">
        <div class="rl-name">RANK &nbsp;<b>${info.cur.r}</b></div>
        <div class="rl-next">${info.next ? fmt(info.toGo) + ' EXP to ' + info.next.icon + ' ' + info.next.r : '★ MAX RANK REACHED'}</div>
      </div>
    </div>
    <div class="bar" style="margin-top:10px"><i style="width:${info.pct}%"></i></div>
    ${info.drop > 0 ? '<div class="rl-drop">⚠ Season drop active: −' + info.drop + ' — earn EXP to push back up</div>' : ''}
    <div class="rl-best">⭐ best day ${state.bestQuestsDay || 0} quests</div>
  </div>`;
}
function statPoints(exp){ return Math.max(1, Math.round(exp / 50)); }

function totalExp(){
  const cur = levelFromExp(state.exp);
  let t = cur.into;
  for(let l = 1; l < cur.level; l++) t += expNeededFor(l);
  return Math.round(t);
}

function expToReachLevel(L){
  let t = 0;
  for(let l = 1; l < L; l++) t += expNeededFor(l);
  return t;
}
function rankInfo(){
  const te = state ? Math.max(0, Number(state.exp) || 0) : 0;
  const { level } = levelFromExp(te);
  const baseIdx = rankIndexForExp(te);
  const drop = (state && state.season && Number(state.season.drop)) || 0;
  const effIdx = Math.max(0, baseIdx - drop);
  const cur = RANKS[effIdx];
  const next = effIdx < RANKS.length - 1 ? RANKS[effIdx + 1] : null;
  let pct = 100, toGo = 0;
  if(next){
    const targetExp = next.exp;
    const prevExp = cur.exp;
    toGo = Math.max(0, targetExp - te);
    const span = Math.max(1, targetExp - prevExp);
    pct = Math.min(100, Math.max(0, Math.round((te - prevExp) / span * 100)));
  }
  return { level, te, cur, next, pct, toGo, drop, baseIdx, effIdx };
}

/* ---------------- themes ---------------- */

function applyTheme(){
  document.body.setAttribute('data-theme', (state && state.settings && state.settings.theme) || 'cyan');
}

/* ---------------- day/week/month rollover ---------------- */

function rollover(){
  const pd = periodFor('daily'), pw = periodFor('weekly'), pm = periodFor('monthly');
  let changed = false;

  for(const q of state.quests){
    const p = q.freq === 'daily' ? pd : q.freq === 'weekly' ? pw : pm;
    if(q.resetKey !== p){ q.timesDone = 0; q.resetKey = p; changed = true; }
  }

  if(state.boss.week !== pw){ state.boss = newBoss(pw); changed = true; }

  if(state.settings.randomQuests && state.systemQuest.day !== pd){
    state.systemQuest = newSystemQuest(pd);
    changed = true;
  }

  // streak & HP penalty — checked ONCE per calendar day (day app was last opened),
  // never repeatedly on every app open
  const t = todayStr();
  if(state.day !== t){
    if(state.lastQuestDay !== yesterdayStr()){
      const pen = state.settings.hpPenalty;
      if(state.inventory.frozenFlame > 0){
        state.inventory.frozenFlame--;
        state.streakFrozenDays = (state.streakFrozenDays || 0) + 3;
        state.lastQuestDay = yesterdayStr();
        toast('❄️ Frozen Flame activated! Streak guarded for 4 full days.');
      } else if(state.streakFrozenDays > 0){
        state.streakFrozenDays--;
        state.lastQuestDay = yesterdayStr();
        toast('❄️ Frozen Flame vacation shield active — streak protected.');
      } else if(state.inventory.streakSaver > 0){
        state.inventory.streakSaver--;
        state.lastQuestDay = yesterdayStr();
        toast('🧊 Streak Saver activated — your streak is frozen. That day does not count.');
      } else if(state.inventory.armor > 0){
        state.inventory.armor--;
        if(state.streak > 1) toast('🛡️ System Armor absorbed the hit! HP protected.');
        state.streak = 0;
      } else {
        if(state.streak > 1) toast('💤 Streak broken. The System deducts ' + pen + ' HP.');
        state.streak = 0;
        state.hp = Math.max(0, state.hp - pen);
      }
    }
    state.day = t;
    state.dayQuests = 0;
    state.dayExp = 0;
    crateReset();
    changed = true;
  }

  // monthly report when the month flips
  const cur = monthStrNow();
  if(state.lastReportMonth && state.lastReportMonth !== cur){
    const prev = state.lastReportMonth;
    state.lastReportMonth = cur;
    changed = true;
    setTimeout(() => {
      if(monthStats(prev).quests > 0) showReport(prev, monthName(prev) + ' — Final Report');
    }, 800);
  } else if(!state.lastReportMonth){
    state.lastReportMonth = cur;
    changed = true;
  }

  if(changed) save();
}

function touchStreak(){
  const t = todayStr(), y = yesterdayStr();
  if(state.lastQuestDay === t) return;
  state.streak = (state.lastQuestDay === y) ? state.streak + 1 : 1;
  state.bestStreak = Math.max(state.bestStreak || 0, state.streak);
  state.lastQuestDay = t;
}

/* ---------------- core reward engine ---------------- */

function applyReward({ exp, gold = 0, name, icon, statKey = null, ev = null }){
  let awardExp = exp;
  if(state.xpMultiplier > 0){
    awardExp = exp * 2;
    state.xpMultiplier--;
    if(ev) floatText('🔥 2× XP BOOST (' + state.xpMultiplier + ' left)', ev.clientX, ev.clientY - 24, 'gold');
  }
  const before = levelFromExp(state.exp);
  const prevRank = rankAtExp(state.exp);

  state.exp += awardExp;
  state.gold += gold;
  state.totalGold += gold;
  state.totalQuests++;
  state.dayQuests++;
  state.dayExp = (state.dayExp || 0) + awardExp;
  state.bestQuestsDay = Math.max(state.bestQuestsDay || 0, state.dayQuests);
  if(statKey) state.stats[statKey] += statPoints(awardExp);
  state.hp = Math.min(maxHp(), state.hp + state.settings.hpHeal);
  state.log.unshift({ ts:Date.now(), name, icon:icon || '⭐', exp:awardExp, gold });
  state.log = state.log.slice(0, 500);
  touchStreak();

  const after = levelFromExp(state.exp);
  const newRank = rankAtExp(state.exp);

  save();
  renderAll();

  if(ev){
    floatText('+' + awardExp + ' EXP', ev.clientX, ev.clientY);
    if(gold > 0) floatText('+' + gold + ' ◈', ev.clientX, ev.clientY + 24, 'gold');
  }
  sfxCheckIn();

  if(after.level > before.level) levelUpFX(before.level, after.level, prevRank, newRank);
  else if(newRank !== prevRank) rankUpFX(newRank);

  checkBadges();

  const s = state.settings.sync;
  if(s.auto && s.url && s.key) syncPush(true);

  return { before, after };
}

/* ---------------- actions ---------------- */

function checkIn(qid, ev){
  rollover();
  const q = state.quests.find(x => x.id === qid);
  if(!q) return;
  if(q.timesDone >= q.dailyLimit){ toast('Already at the limit for this period.'); return; }
  q.timesDone++;
  const exp = q.exp;
  const cat = statForCategory(q.category);
  applyReward({ exp, gold:q.gold, name:q.name, icon:q.icon, statKey:cat, ev });
  checkPerfects(q.freq);
  crateBump();
  // variable reward: the System occasionally smiles (15% luck)
  if(Math.random() < 0.15){
    const bonus = 5 + Math.floor(Math.random() * 3) * Math.max(1, q.gold);
    state.gold += bonus; state.totalGold += bonus;
    state.log.unshift({ ts:Date.now(), name:'Lucky find — the System smiles', icon:'🍀', exp:0, gold:bonus });
    save(); renderAll();
    if(ev) floatText('🍀 LUCKY +' + bonus + ' ◈', ev.clientX, ev.clientY - 50, 'lucky');
    sfxBadge();
  }
  // 5% rare drop on quest completion (XP Potion, Baked Salmon, Seer Stone, Frozen Flame)
  if(Math.random() < 0.05){
    const rareDrops = [
      { key:'xpPotion', name:'XP Potion', icon:'⚡', desc:'2× XP for next 3 quests' },
      { key:'salmon', name:'Baked Salmon', icon:'🐟', desc:'+40 HP & +20 EXP feast' },
      { key:'seerStone', name:'Seer Stone', icon:'🔮', desc:'auto-completes 1 daily quest' },
      { key:'frozenFlame', name:'Frozen Flame', icon:'❄️', desc:'4-day streak protection shield' },
    ];
    const drop = rareDrops[Math.floor(Math.random() * rareDrops.length)];
    state.inventory[drop.key] = (state.inventory[drop.key] || 0) + 1;
    state.log.unshift({ ts:Date.now(), name:'Rare Drop: ' + drop.name, icon:drop.icon, exp:0, gold:0 });
    save(); renderAll();
    if(ev) floatText('🎁 ' + drop.name.toUpperCase() + '!', ev.clientX, ev.clientY - 70, 'lucky');
    toast('🎁 RARE DROP! Found ' + drop.name + ' (' + drop.desc + ')!');
    sfxBadge();
  }
}

function bossHit(ev){
  rollover();
  const b = state.boss, s = state.settings;
  if(b.done >= s.bossPhases){ toast('This week\'s boss is already defeated.'); return; }
  b.done++;
  const per = Math.floor(s.bossExp / s.bossPhases);
  const gper = Math.floor(s.bossGold / s.bossPhases);
  const title = (state.bossCustomName || ('Defeat ' + b.boss));
  applyReward({ exp:per, gold:gper, name:'🐉 Boss: ' + title, icon:'🐉', statKey:null, ev });
  if(b.done >= s.bossPhases){
    state.bossKills++;
    state.gold += s.bossKillBonus;
    state.totalGold += s.bossKillBonus;
    save();
    renderAll();
    bossDefeatedFX();
    checkBadges();
  } else {
    toast('💥 ' + (s.bossPhases - b.done) + ' phase(s) left. The boss is wounded!');
    renderAll();
  }
}

function systemHit(ev){
  rollover();
  const sq = state.systemQuest;
  if(sq.done) return;
  sq.done = true;
  applyReward({ exp:sq.exp, gold:sq.gold, name:'📡 System: ' + sq.name, icon:sq.icon, statKey:null, ev });
  toast('📡 The System acknowledges your compliance.');
}

function systemIgnore(){
  state.systemQuest.dismissed = true;
  save();
  renderAll();
  toast('📡 The System notes your refusal.');
}

function buyReward(id, ev){
  const r = state.rewards.find(x => x.id === id);
  if(!r) return;
  if(state.gold < r.cost){ toast('Not enough gold. The System is watching.'); return; }
  state.gold -= r.cost;
  state.bought.unshift({ ts:Date.now(), name:r.name, icon:r.icon, cost:r.cost });
  save();
  renderAll();
  sfxCheckIn();
  if(ev) floatText('-' + r.cost + ' ◈', ev.clientX, ev.clientY, 'gold');
  toast('🎁 Redeemed: ' + r.name + '. Go enjoy it — you earned it.');
}

function checkPerfects(freq){
  const key = { daily:'d', weekly:'w', monthly:'m' }[freq];
  const p = periodFor(freq);
  if(state.perfect[key] === p) return;
  const group = state.quests.filter(q => q.freq === freq);
  if(group.length && group.every(q => q.timesDone >= q.dailyLimit)){
    state.perfect[key] = p;
    const bonus = freq === 'daily' ? state.settings.perfectDayGold
      : freq === 'weekly' ? state.settings.perfectWeekGold
      : state.settings.perfectMonthGold;
    state.gold += bonus;
    state.totalGold += bonus;
    save();
    renderAll();
    toast('🌟 PERFECT ' + (freq === 'daily' ? 'DAY' : freq === 'weekly' ? 'WEEK' : 'MONTH') +
      ' — all ' + freq + ' quests done! +' + bonus + ' ◈');
    sfxLevelUp();
    if(freq === 'daily' && state.crates && state.crates.tier){ state.crates.progress.perfect = 1; crateBump(); }
  }
}

function checkBadges(){
  const earned = [];
  for(const b of BADGES){
    if(!state.badges.includes(b.id) && b.test(state)){
      state.badges.push(b.id);
      earned.push(b);
    }
  }
  if(earned.length){
    save();
    toast('🏅 Badge earned: ' + earned.map(b => b.name).join(', '));
    sfxBadge();
  }
}

/* ---------------- monthly report ---------------- */

function monthStats(ms){
  let exp = 0, quests = 0, gold = 0, longest = 0, cur = 0, lastDay = null;
  const days = new Set();
  for(const l of state.log){
    const d = new Date(l.ts);
    if(monthStrOf(d) !== ms) continue;
    exp += l.exp; quests++; gold += l.gold;
    days.add(dateStr(d));
  }
  for(const ds of [...days].sort()){
    cur = (lastDay && (new Date(ds + 'T00:00:00') - new Date(lastDay + 'T00:00:00')) === 86400000) ? cur + 1 : 1;
    longest = Math.max(longest, cur);
    lastDay = ds;
  }
  return { exp, quests, gold, longest };
}

function showReport(ms, label){
  const m = monthStats(ms);
  el('fxContent').innerHTML = `
    <div class="fx-kicker">System Report</div>
    <div class="fx-big" style="font-size:30px;letter-spacing:3px">${esc(label)}</div>
    <div class="fx-rows">
      <div class="fx-row"><span>EXP earned</span><b>${fmt(m.exp)}</b></div>
      <div class="fx-row"><span>Quests completed</span><b>${m.quests}</b></div>
      <div class="fx-row"><span>Gold earned</span><b>${fmt(m.gold)} ◈</b></div>
      <div class="fx-row"><span>Best streak</span><b>${m.longest} day${m.longest === 1 ? '' : 's'}</b></div>
    </div>
    <div class="fx-flavor">"Progress confirmed. Continue, Player."</div>`;
  showOverlay(el('fxOverlay'), 9000);
}

/* ---------------- rendering ---------------- */

const el = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString();
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function renderAll(){
  if(!state) return;
  renderTopbar();
  renderCharacter();
  renderQuests();
  renderCrates();
  renderLog();
  renderShop();
  renderSettings();
  renderRail();
}

function renderTopbar(){
  const { level } = levelFromExp(state.exp);
  el('tbLevel').textContent = `Lv ${level} · ${rankIcon(rankAtExp(state.exp))}`;
  el('tbGold').textContent = `◈ ${fmt(state.gold)}`;
  const vt = el('viewToggleBtn');
  if(vt){
    const tog = { quests: state.viewModes.quests, shop: state.viewModes.shop, crates: state.viewModes.crates };
    if(tog[state.view]){
      vt.style.display = '';
      const next = tog[state.view] === 'list' ? (state.view === 'quests' ? 'path' : 'grid') : 'list';
      vt.textContent = state.view === 'quests' ? (next === 'list' ? '📋' : '🗺️') : (next === 'list' ? '≣' : '▦');
      vt.title = 'Switch layout → ' + next;
    } else vt.style.display = 'none';
  }
  const sbL = el('sbLevel'), sbG = el('sbGold');
  if(sbL) sbL.textContent = `Lv ${level} · ${rankAtExp(state.exp)}`;
  if(sbG) sbG.textContent = `◈ ${fmt(state.gold)}`;
}

function crateNearMissInfo(){
  const c = state && state.crates;
  if(!c) return null;
  if(!c.tier){
    return {
      tier: null,
      status: 'unselected',
      headline: 'NO CRATE CHOSEN TODAY',
      nearText: 'Pick your challenge in Crates — the clock is ticking!',
      pct: 0,
    };
  }
  const r = CRATES[c.tier];
  if(!r) return null;
  const g = r.goals;
  const p = c.progress;
  const expNeed = Math.max(0, (g.exp || 0) - (p.exp || 0));
  const questNeed = Math.max(0, (g.quests || 0) - (p.quests || 0));
  const pct = c.done ? 100 : Math.min(99, Math.round(
    g.exp && g.quests
      ? ((p.exp / g.exp) + (p.quests / g.quests)) / 2 * 100
      : (g.exp ? (p.exp / g.exp * 100) : (p.quests / g.quests * 100))
  ));

  if(c.claimed){
    return {
      tier: c.tier,
      name: r.name,
      status: 'claimed',
      headline: 'CRATE COLLECTED',
      nearText: '✓ Today\'s crate reward claimed — next crate unlocks at midnight',
      pct: 100,
    };
  }

  if(c.done){
    return {
      tier: c.tier,
      name: r.name,
      status: 'unlocked',
      headline: 'CRATE UNLOCKED!',
      nearText: '🎉 Challenge complete! Tap to open and claim your reward!',
      pct: 100,
      canOpen: true,
    };
  }

  const openDailies = state.quests.filter(q => q.freq === 'daily' && q.timesDone < q.dailyLimit);
  const biggestExp = openDailies.length ? Math.max(...openDailies.map(q => q.exp)) : 50;
  let urgency = 'normal';
  let nearText = '';

  if((g.quests && questNeed === 1) || (g.exp && expNeed > 0 && expNeed <= biggestExp)){
    urgency = 'critical';
    nearText = '⚡ ONE MORE CHECK-IN CRACKS IT! (' + (expNeed ? expNeed + ' EXP to go' : '1 quest to go') + ')';
  } else if(pct >= 60){
    urgency = 'close';
    nearText = '🔥 SO CLOSE! Only ' + (expNeed ? expNeed + ' EXP' : questNeed + ' quests') + ' left — finish before midnight!';
  } else if(pct >= 25){
    urgency = 'progress';
    nearText = '🎯 ' + pct + '% complete — ' + (expNeed ? expNeed + ' EXP' : questNeed + ' quests') + ' remaining today!';
  } else {
    urgency = 'start';
    nearText = '⏳ ' + (expNeed ? expNeed + ' EXP' : questNeed + ' quests') + ' to crack today\'s ' + r.name + ' · ' + timeLeftToday() + ' left!';
  }

  return {
    tier: c.tier,
    name: r.name,
    status: 'progress',
    headline: r.name.toUpperCase(),
    nearText,
    urgency,
    pct,
    expProg: g.exp ? (fmt(p.exp) + ' / ' + fmt(g.exp) + ' EXP') : '',
    questProg: g.quests ? (p.quests + ' / ' + g.quests + ' quests') : '',
  };
}

function crateBanner(){
  const info = crateNearMissInfo();
  if(!info) return '';
  const c = state.crates;
  const time = timeLeftToday();

  if(info.status === 'unselected'){
    return `
    <div class="crate-banner-card unchosen">
      <div class="cbc-head">
        <span class="cbc-kicker">📦 DAILY CRATE CHALLENGE</span>
        <span class="time-chip">⏳ ${time} left</span>
      </div>
      <div class="cbc-body">
        <div class="cbc-text">
          <div class="cbc-title">No challenge locked in for today</div>
          <div class="cbc-sub near">⚡ Choose Wood, Gold, or Diamond to start earning bonus EXP & gold!</div>
        </div>
        <button class="btn primary small" data-crate-banner-choose="1">Choose Crate</button>
      </div>
    </div>`;
  }

  const r = CRATES[c.tier];
  if(info.status === 'claimed'){
    return `
    <div class="crate-banner-card claimed">
      <div class="cbc-head">
        <span class="cbc-kicker"><span class="mini-cv">${crateVisual(c.tier, true)}</span> ${esc(r.name).toUpperCase()}</span>
        <span class="time-chip">✓ Collected</span>
      </div>
      <div class="cbc-body">
        <div class="cbc-text">
          <div class="cbc-sub">✓ Today's crate reward was collected — next challenge opens at midnight.</div>
        </div>
      </div>
    </div>`;
  }

  if(info.status === 'unlocked'){
    return `
    <div class="crate-banner-card unlocked">
      <div class="cbc-head">
        <span class="cbc-kicker"><span class="mini-cv">${crateVisual(c.tier, true)}</span> ${esc(r.name).toUpperCase()} — UNLOCKED!</span>
        <span class="time-chip">Ready to open</span>
      </div>
      <div class="cbc-body">
        <div class="cbc-text">
          <div class="cbc-title" style="color:#6ee7b7">Challenge Complete!</div>
          <div class="cbc-near near">🎉 Tap to crack open your crate and claim your loot!</div>
        </div>
        <button class="btn primary" data-crate-banner-open="1">OPEN CRATE</button>
      </div>
    </div>`;
  }

  return `
  <div class="crate-banner-card in-progress ${info.urgency === 'critical' ? 'critical' : ''}">
    <div class="cbc-head">
      <span class="cbc-kicker"><span class="mini-cv">${crateVisual(c.tier, true)}</span> ${esc(r.name).toUpperCase()}</span>
      <span class="time-chip">⏳ ${time} left</span>
    </div>
    <div class="cbc-body-row">
      <div class="cbc-main">
        <div class="cbc-prog-row">
          <span>${esc(r.desc)}</span>
          <span class="cbc-prog-val">${info.expProg ? info.expProg : ''}${info.expProg && info.questProg ? ' · ' : ''}${info.questProg ? info.questProg : ''}</span>
        </div>
        <div class="bar"><i style="width:${info.pct}%"></i></div>
        <div class="cbc-near ${info.urgency === 'critical' || info.urgency === 'close' ? 'near' : ''}">${info.nearText}</div>
      </div>
    </div>
  </div>`;
}

function crateMini(){
  const info = crateNearMissInfo();
  if(!info || info.status === 'unselected'){
    return '<div class="hint">No crate chosen today — <button class="btn-link" onclick="switchTab(\'crates\')">pick one in Crates</button>.</div>';
  }
  const c = state.crates;
  const r = CRATES[c.tier];
  return `<div class="rail-boss-name"><span class="mini-cv">${crateVisual(c.tier, true)}</span>${esc(r.name)}${c.done ? ' \u2713' : ''}</div>
    <div class="bar" style="margin-top:8px"><i style="width:${info.pct}%"></i></div>
    <div class="hint" style="margin-top:6px">${c.done ? (c.claimed ? 'Collected \u2713' : '<button class="btn primary small" onclick="claimCrate()" style="margin-top:4px;width:100%">OPEN CRATE</button>') : '<span class="near">' + info.nearText + '</span>'}</div>`;
}


function renderRail(){
  const r = el('rail');
  if(!r) return;
  const { level, into, needed } = levelFromExp(state.exp);
  const rank = rankAtExp(state.exp);
  const mh = maxHp();
  const b = state.boss, bs = state.settings;
  const bdef = b.done >= bs.bossPhases;
  const bpct = Math.round(b.done / bs.bossPhases * 100);
  r.innerHTML = `
    <div class="sys-window rail-card">
      <div class="win-bar"><span class="win-title">${esc(state.character.name)}</span><span class="rank-chip rank-${rank}">${rankIcon(rank)}</span></div>
      <div class="win-body">
        <div class="bar-block"><div class="bar-label"><span>Level ${level}</span><span>${fmt(into)} / ${fmt(needed)} EXP</span></div>
          <div class="bar"><i style="width:${Math.min(100, Math.round(into / needed * 100))}%"></i></div></div>
        <div class="bar-block"><div class="bar-label"><span>HP</span><span>${Math.round(state.hp)} / ${mh}</span></div>
          <div class="bar hp"><i style="width:${Math.max(0, Math.min(100, Math.round(state.hp / mh * 100)))}%"></i></div></div>
        <div class="rail-stats"><span>◈ ${fmt(state.gold)}</span><span>⭐ ${fmt(state.totalQuests)}</span></div>
      </div>
    </div>
    <div class="sys-window rail-card">
      <div class="win-bar"><span class="win-title">Crate</span><span class="time-chip">⏳ ${timeLeftToday()}</span></div>
      <div class="win-body">${crateMini()}</div>
    </div>
    <div class="sys-window rail-card">
      <div class="win-bar"><span class="win-title">Boss</span>${bdef ? '<span class="win-sub">defeated</span>' : ''}</div>
      <div class="win-body">
        <div class="rail-boss-name">${esc(state.bossCustomName || b.boss)}</div>
        <div class="bar" style="margin-top:8px"><i style="width:${bpct}%"></i></div>
        <div class="hint" style="margin-top:6px">${bdef ? 'New boss next Monday.' : b.done + '/' + bs.bossPhases + ' phases · Quests tab'}</div>
      </div>
    </div>`;
}

function renderCharacter(){
  const { level, into, needed } = levelFromExp(state.exp);
  const rank = rankAtExp(state.exp);
  const mh = maxHp();
  if(state.hp > mh) state.hp = mh;
  const expPct = Math.min(100, Math.round(into / needed * 100));
  const hpPct = Math.max(0, Math.min(100, Math.round(state.hp / mh * 100)));
  const badges = BADGES.filter(b => state.badges.includes(b.id))
    .map(b => `<div class="badge" title="${esc(b.desc)}">${b.icon}<span>${esc(b.name)}</span></div>`).join('');
  const av = /^data:/.test(state.character.avatar)
    ? `<img src="${state.character.avatar}" alt="avatar">`
    : esc(state.character.avatar);
  const saverNote = state.inventory.streakSaver > 0 ? ` · 🧊 ×${state.inventory.streakSaver} auto-saver ready` : '';
  el('view-character').innerHTML = `
    <div class="sys-window player-card">
      <div class="win-bar"><span></span><span class="rank-chip rank-${rank}">${rank} RANK</span></div>
      <div class="win-body">
        <div class="p-top">
          <div class="p-avatar">${av}</div>
          <div style="flex:1;min-width:0">
            <div class="p-name">${esc(state.character.name)}</div>
            <div class="p-title">${esc(titleForLevel(level))}${state.activeTitle ? ` <span class="p-atitle">◆ ${esc(state.activeTitle)}</span>` : ''}</div>
          </div>
          <div class="p-lvl"><b>${level}</b><span>LEVEL</span></div>
        </div>
        <div class="streak-row">
          <div class="streak-big"><span class="flame f${flameTier(state.streak)}"></span>${state.streak}<small>DAY STREAK · BEST ${state.bestStreak || 0}</small></div>
          <div class="streak-note">Do at least 1 quest today to keep the fire alive.${saverNote}</div>
        </div>
        <div class="bar-block">
          <div class="bar-label"><span>Experience</span><span>${fmt(into)} / ${fmt(needed)}</span></div>
          <div class="bar"><i style="width:${expPct}%"></i></div>
        </div>
        <div class="bar-block">
          <div class="bar-label"><span>HP</span><span>${Math.round(state.hp)} / ${mh}</span></div>
          <div class="bar hp"><i style="width:${hpPct}%"></i></div>
        </div>
        ${rankLadder()}
        <div class="p-foot-row">
          <div class="p-foot">⭐ ${fmt(state.totalQuests)} quests · ◈ ${fmt(state.gold)} gold · 🏅 ${state.badges.length} badges · 🐉 ${state.bossKills || 0} bosses · since ${new Date(state.created).toLocaleDateString()}</div>
          <div class="p-actions">
            <button class="btn" id="shareCardBtn" title="Share card image">📸</button>
            <button class="btn" id="saveCardBtn" title="Save card image">⬇</button>
            <button class="btn" id="reportBtn" title="Month report">📊</button>
          </div>
        </div>
        ${badges ? `<div class="badges">${badges}</div>` : ''}
        <div class="p-quote">"Only you level up." — The System</div>
      </div>
    </div>`;
  el('shareCardBtn').addEventListener('click', shareCard);
  el('saveCardBtn').addEventListener('click', saveCardPng);
  el('reportBtn').addEventListener('click', () => showReport(monthStrNow(), 'This Month So Far'));
}

function daysLeft(freq){
  const d = new Date();
  if(freq === 'weekly'){
    const day = (d.getDay() + 6) % 7; // 0 = Monday
    return 7 - day;
  }
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return last - d.getDate();
}

function questCard(q){
  const done = q.timesDone >= q.dailyLimit;
  return `
  <div class="quest ${done ? 'is-done' : ''}" data-check-q="${q.id}">
    <div class="q-icon" data-edit-q="${q.id}" title="Tap icon to customize">${esc(q.icon || '⭐')}</div>
    <div class="q-meta">
      <div class="q-name">${esc(q.name)}</div>
      <div class="q-sub">+${q.exp} EXP · +${q.gold} ◈${q.dailyLimit > 1 ? ' · ' + q.timesDone + '/' + q.dailyLimit : ''}${q.freq !== 'daily' ? ` · <span class="q-days">${daysLeft(q.freq)}d left</span>` : ''}</div>
    </div>
    <button class="check-btn" data-q="${q.id}" ${done ? 'disabled' : ''}>${done ? '✓' : 'Check In'}</button>
  </div>`;
}

function questGroup(freq, label){
  const all = state.quests.filter(q => q.freq === freq);
  const group = (freq === 'daily' && state.settings.hideCompleted) ? all.filter(q => q.timesDone < q.dailyLimit) : all;
  const done = all.filter(q => q.timesDone >= q.dailyLimit).length;
  const body = group.length
    ? group.map(questCard).join('')
    : (done ? `<div class="empty small">✓ All ${label.toLowerCase()} quests done for today</div>`
            : `<div class="empty small">No ${label.toLowerCase()} quests yet — tap "+ New".</div>`);
  return `<div class="group-head"><span>${label}</span><span class="g-count">${done}/${all.length}</span></div>${body}`;
}

function bossCard(){
  const b = state.boss, s = state.settings;
  const defeated = b.done >= s.bossPhases;
  const per = Math.floor(s.bossExp / s.bossPhases);
  const pips = Array.from({ length:s.bossPhases }, (_, i) => `<i class="pip ${i < b.done ? 'on' : ''}"></i>`).join('');
  return `
  <div class="boss-card ${defeated ? 'is-dead' : ''}">
    <div class="boss-head">
      <span class="boss-kicker">🐉 Boss</span>
      <span class="boss-name" title="${esc(state.bossCustomName || b.boss)}">${esc(state.bossCustomName || b.boss)}</span>
      <span class="pips">${pips}</span>
    </div>
    <div class="boss-actions">
      <button class="boss-btn" id="bossHitBtn" ${defeated ? 'disabled' : ''}>
        ${defeated ? 'Defeated — new boss Monday' : 'Hit the Boss · +' + per + ' EXP'}
      </button>
      <button class="boss-edit" id="bossEditBtn" title="Change boss task">✎</button>
    </div>
  </div>`;
}

function systemCard(){
  const sq = state.systemQuest;
  if(!state.settings.randomQuests || sq.done || sq.dismissed) return '';
  return `
  <div class="system-card">
    <div class="sysq-main">
      <span class="sysq-icon">${esc(sq.icon)}</span>
      <div class="sysq-txt">
        <div class="sysq-name">📡 ${esc(sq.name)}</div>
        <div class="sysq-sub">System quest · +${sq.exp} EXP · +${sq.gold} ◈</div>
      </div>
    </div>
    <div class="sysq-actions">
      <button class="btn primary small" id="sysHitBtn">Accept</button>
      <button class="btn small ghost" id="sysIgnoreBtn" title="Ignore today">✕</button>
    </div>
  </div>`;
}

function questPath(){
  const dailies = state.quests.filter(q => q.freq === 'daily');
  if(!dailies.length) return '';
  const shown = state.settings.hideCompleted ? dailies.filter(q => q.timesDone < q.dailyLimit) : dailies;
  const nodes = shown.map(q => {
    const isDone = q.timesDone >= q.dailyLimit;
    return `
    <div class="qg-card ${isDone ? 'done' : ''}" data-check-q="${q.id}">
      <div class="qg-top">
        <span class="qg-ic" data-edit-q="${q.id}" title="Tap icon to customize">${esc(q.icon || '⭐')}</span>
        <span class="qg-name">${esc(q.name)}${q.dailyLimit > 1 ? ` <small>(${q.timesDone}/${q.dailyLimit})</small>` : ''}</span>
      </div>
      <div class="qg-sub">+${q.exp} EXP · +${q.gold} ◈</div>
      <button class="check-btn qg-btn" data-q="${q.id}" ${isDone ? 'disabled' : ''}>${isDone ? '✓ Done' : 'Check In'}</button>
    </div>`;
  }).join('');

  const doneCount = dailies.filter(q => q.timesDone >= q.dailyLimit).length;
  const others = state.quests.filter(q => q.freq !== 'daily');
  const chapters = others.length ? `
    <div class="sys-window" style="margin-top:14px">
      <div class="win-bar"><span class="win-title">Chapters</span><span class="win-sub">weekly &amp; monthly · ${others.length} quests</span></div>
      <div class="win-body">${others.map(questCard).join('')}</div>
    </div>` : '';

  return `
    <div class="path-section">
      <div class="path-head"><span class="path-cat">Daily Quests</span><span class="g-count">${doneCount}/${dailies.length}</span></div>
      <div class="qgrid">${nodes || '<div class="qgrid-empty">✓ All done for today</div>'}</div>
    </div>${chapters}`;
}

function renderQuests(){
  const usePath = state.viewModes.quests === 'path';
  el('view-quests').innerHTML = `
    ${bossCard()}
    ${crateBanner()}
    ${systemCard()}
    <div class="sys-window">
      <div class="win-bar"><span class="win-title">${usePath ? 'Quest Path' : 'Quest Board'}</span>
        <button class="mini-btn" id="addQuestBtn">+ New</button></div>
      <div class="win-body">
        ${usePath
          ? (questPath() || '<div class="empty">No daily quests yet \u2014 tap "+ New".</div>')
          : (questGroup('daily', 'Daily') + questGroup('weekly', 'Weekly') + questGroup('monthly', 'Monthly'))}
        <p class="board-hint">tap icon to customize · tap card or button to check in</p>
      </div>
    </div>`;

  // 1. ONLY clicking/tapping the icon opens customization!
  document.querySelectorAll('[data-edit-q]').forEach(ic => {
    ic.addEventListener('click', e => {
      e.stopPropagation();
      openQuestEditor(ic.dataset.editQ);
    });
  });

  // 2. Button check-in
  document.querySelectorAll('.check-btn').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      checkIn(b.dataset.q, e);
    });
  });

  // 3. BIG HITBOX: tapping the card / text also checks in!
  document.querySelectorAll('[data-check-q]').forEach(card => {
    card.addEventListener('click', e => {
      if(e.target.closest('[data-edit-q]')) return;
      if(e.target.closest('.check-btn')) return;
      const qid = card.dataset.checkQ;
      const q = state.quests.find(x => x.id === qid);
      if(q && q.timesDone < q.dailyLimit){
        checkIn(qid, e);
      }
    });
  });
  el('addQuestBtn').addEventListener('click', () => openQuestEditor(null));
  el('bossHitBtn').addEventListener('click', e => bossHit(e));
  el('bossEditBtn').addEventListener('click', () => openBossEditor());
  const sh = el('sysHitBtn');
  if(sh) sh.addEventListener('click', e => systemHit(e));
  const si = el('sysIgnoreBtn');
  if(si) si.addEventListener('click', systemIgnore);
  document.querySelectorAll('[data-crate-banner-open]').forEach(b =>
    b.addEventListener('click', claimCrate));
  document.querySelectorAll('[data-crate-banner-choose]').forEach(b =>
    b.addEventListener('click', () => switchTab('crates')));
}

function renderCrates(){
  crateReset();
  const c = state.crates;
  const cards = Object.keys(CRATES).map(k => {
    const r = CRATES[k];
    const isChosen = c.tier === k;
    const dimmed = !!c.tier && !isChosen;
    let inner = '';
    if(isChosen){
      const g = r.goals, p = c.progress;
      const bars = [];
      if(g.quests) bars.push('<div class="bar"><i style="width:' + Math.min(100, Math.round(p.quests / g.quests * 100)) + '%"></i></div><div class="crate-prog">' + p.quests + '/' + g.quests + ' quests</div>');
      if(g.exp) bars.push('<div class="bar"><i style="width:' + Math.min(100, Math.round(p.exp / g.exp * 100)) + '%"></i></div><div class="crate-prog">' + fmt(p.exp) + '/' + fmt(g.exp) + ' EXP</div>');
      const info = crateNearMissInfo();
      const nearMsg = (info && info.nearText) ? '<div class="crate-near-msg near">' + info.nearText + '</div>' : '';
      inner = c.done ? (c.claimed
        ? '<div class="crate-status">✓ COLLECTED</div>'
        : '<button class="btn primary" data-crate-open="1">OPEN</button>') : (bars.join('') + nearMsg);
    } else {
      inner = '<button class="btn small ' + (dimmed ? 'ghost' : 'primary') + '" data-crate="' + k + '" ' + (dimmed ? 'disabled' : '') + '>' + (dimmed ? 'Locked' : 'Choose') + '</button>';
    }
    return '<div class="crate ' + (isChosen ? 'chosen' : '') + ' ' + (dimmed ? 'dim' : '') + '">' +
      '<div class="crate-icon">' + crateVisual(k) + '</div>' +
      '<div class="crate-name">' + r.name + '</div>' +
      '<div class="crate-goal">' + r.desc + '</div>' +
      '<div class="crate-reward">' + r.rewardHint + '</div>' +
      inner +
    '</div>';
  }).join('');
  el('view-crates').innerHTML = `
    <div class="sys-window">
      <div class="win-bar"><span class="win-title">Crates</span>
        <span class="time-chip">\u23F3 ${timeLeftToday()} left</span></div>
      <div class="win-body">
        <div class="gold-note">Pick <b>one</b> crate per day — it's a challenge, not a mission. The clock starts when you choose, and you cannot switch. Beat it before midnight and the crate opens.</div>
        <div class="crates-row${state.viewModes.crates === 'list' ? ' list' : ''}">${cards}</div>
        <div class="quote-box">
          <div class="quote">\u201C${esc(dailyQuote())}\u201D</div>
          <div class="quote-src">\u2014 The System, ${new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </div>`;
  document.querySelectorAll('[data-crate]').forEach(b =>
    b.addEventListener('click', () => chooseCrate(b.dataset.crate)));
  const openBtn = document.querySelector('#view-crates [data-crate-open]');
  if(openBtn) openBtn.addEventListener('click', claimCrate);
}

function renderLog(){
  const items = state.log.slice(0, 60).map(l => {
    const d = new Date(l.ts);
    const when = d.toLocaleDateString(undefined, { month:'short', day:'numeric' }) +
      ' · ' + d.toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' });
    return `<div class="log-entry"><span class="le-icon">${esc(l.icon || '⭐')}</span>
      <div><div class="le-name">${esc(l.name)}</div><div class="log-date">${when}</div></div>
      <span class="le-exp">${l.exp > 0 ? '+' + l.exp + ' EXP' : '+' + l.gold + ' ◈'}</span></div>`;
  }).join('') || '<div class="empty">No deeds recorded yet. Go complete something, Player.</div>';
  el('view-log').innerHTML = `
    <div class="sys-window">
      <div class="win-bar"><span class="win-title">Activity Log</span><span class="win-sub">${state.log.length} deeds</span></div>
      <div class="win-body" style="padding-top:6px">${items}</div>
    </div>`;
}

function renderShop(){
  const isGrid = state.viewModes.shop === 'grid';

  const items = state.rewards.map(r => isGrid ? `
    <div class="shop-card reward-card" data-r="${r.id}">
      <div class="sc-icon">${esc(r.icon || '🎁')}</div>
      <div class="sc-name">${esc(r.name)}</div>
      <div class="sc-desc">${r.cost} ◈</div>
      <div class="sc-actions">
        <button class="buy-btn btn small ${state.gold < r.cost ? 'ghost' : 'primary'}" data-r="${r.id}" ${state.gold < r.cost ? 'disabled' : ''}>
          ${state.gold >= r.cost ? 'Redeem' : r.cost + ' ◈'}
        </button>
      </div>
    </div>` : `
    <div class="reward" data-r="${r.id}">
      <div class="r-icon">${esc(r.icon || '🎁')}</div>
      <div class="q-meta">
        <div class="q-name">${esc(r.name)}</div>
        <div class="q-sub"><span>cost ${r.cost} ◈</span></div>
      </div>
      <button class="buy-btn btn small ${state.gold < r.cost ? 'ghost' : 'primary'}" data-r="${r.id}" ${state.gold < r.cost ? 'disabled' : ''}>
        ${state.gold >= r.cost ? 'Redeem' : 'Need ' + r.cost + ' ◈'}
      </button>
    </div>`).join('') || '<div class="empty">No rewards yet. Add one — what do you allow yourself to earn?</div>';

  const bought = state.bought.slice(0, 20).map(b => {
    const d = new Date(b.ts);
    return `<div class="log-entry"><span class="le-icon">${esc(b.icon || '🎁')}</span>
      <div class="le-name">${esc(b.name)}</div>
      <div class="log-date">${d.toLocaleDateString()}</div></div>`;
  }).join('') || '<div class="empty">Nothing redeemed yet. Earn gold, then claim what you deserve.</div>';

  const inv = state.inventory || {};
  const supply = [
    { vis:'bag', name:'Free Supply', desc:'10–30 ◈ daily gift.',
      b1:{t: state.freeSupplyDay === todayStr() ? 'Tomorrow' : 'Claim', d: state.freeSupplyDay === todayStr()}, id:'free' },
    { vis:'chest', name:'Mystery Chest', desc:'Drops gold, EXP, rare powerups, titles.',
      b1:{t: state.gold >= 60 ? 'Open · 60' : '60 ◈', d: state.gold < 60}, id:'chest' },
    { vis:'armor', name:'System Armor', desc:'Shields HP on missed days. Owned ×' + (inv.armor || 0) + '.',
      b1:{t: state.gold >= 80 ? 'Buy · 80' : '80 ◈', d: state.gold < 80}, id:'buy-armor' },
    { vis:'ice', name:'Streak Saver', desc:'1-day auto streak freeze. Owned ×' + (inv.streakSaver || 0) + '.',
      b1:{t: state.gold >= 150 ? 'Buy · 150' : '150 ◈', d: state.gold < 150}, id:'saver' },
    { vis:'flask', name:'HP Potion', desc:'Heals 50 HP. Owned ×' + (inv.hpPotion || 0) + '.',
      b1:{t: state.gold >= 100 ? 'Buy · 100' : '100 ◈', d: state.gold < 100}, id:'potion',
      b2:{t:'Drink', d:(inv.hpPotion || 0) <= 0}, id2:'drink' },
    // Rare loot: only found in chests or quests
    { vis:'xp', name:'XP Potion', desc: (inv.xpPotion ? 'Owned ×' + inv.xpPotion + (state.xpMultiplier ? ' (ACTIVE ×' + state.xpMultiplier + ')' : '') + '.' : 'Rare drop · Find in Chests or Quests.'),
      b1:{t: (inv.xpPotion || 0) > 0 ? 'Drink' : 'Rare Drop', d:(inv.xpPotion || 0) <= 0}, id:'use-xpPotion' },
    { vis:'salmon', name:'Baked Salmon', desc: (inv.salmon ? 'Owned ×' + inv.salmon + ' · +40 HP feast.' : 'Rare drop · Find in Chests or Quests.'),
      b1:{t: (inv.salmon || 0) > 0 ? 'Eat' : 'Rare Drop', d:(inv.salmon || 0) <= 0}, id:'eat-salmon' },
    { vis:'seer', name:'Seer Stone', desc: (inv.seerStone ? 'Owned ×' + inv.seerStone + ' · Auto-completes 1 quest.' : 'Epic drop · Find in Chests or Quests.'),
      b1:{t: (inv.seerStone || 0) > 0 ? 'Use' : 'Epic Drop', d:(inv.seerStone || 0) <= 0}, id:'use-seer' },
    { vis:'frozen-flame', name:'Frozen Flame', desc: (inv.frozenFlame ? 'Owned ×' + inv.frozenFlame + ' · 4-day freeze shield.' : 'Epic drop · Find in Chests or Quests.'),
      b1:{t: (inv.frozenFlame || 0) > 0 ? 'Active' : 'Epic Drop', d:true}, id:'none' },
  ];

  const cardBtns = it =>
    '<button class="btn small primary" data-shop="' + it.id + '"' + (it.b1.d ? ' disabled' : '') + '>' + it.b1.t + '</button>' +
    (it.b2 ? '<button class="btn small ghost" data-shop="' + it.id2 + '"' + (it.b2.d ? ' disabled' : '') + '>' + it.b2.t + '</button>' : '');

  const supplyHtml = (state.viewModes.shop === 'list')
    ? supply.map(it => '<div class="shop-row"><div class="sri">' + supplyVisual(it.vis, true) + '</div>' +
        '<div class="srm"><b>' + esc(it.name) + '</b><small>' + it.desc + '</small></div>' +
        '<div class="sc-actions">' + cardBtns(it) + '</div></div>').join('')
    : supply.map(it => '<div class="shop-card"><div class="sc-icon">' + supplyVisual(it.vis) + '</div>' +
        '<div class="sc-name">' + esc(it.name) + '</div><div class="sc-desc">' + esc(it.desc) + '</div>' +
        '<div class="sc-actions">' + cardBtns(it) + '</div></div>').join('');

  el('view-shop').innerHTML = `
    <div class="sys-window">
      <div class="win-bar"><span class="win-title">Reward Market</span>
        <button class="mini-btn" id="addRewardBtn">+ New</button></div>
      <div class="win-body">
        <div class="gold-note">Your gold: <b>${fmt(state.gold)} ◈</b> — earn it from quests, spend it on REAL rewards.</div>
        <div class="${isGrid ? 'shop-grid-cards' : 'reward-list'}">${items}</div>
      </div>
    </div>
    <div class="sys-window" style="margin-top:14px">
      <div class="win-bar"><span class="win-title">Supply Drop & Power-ups</span><span class="win-sub">use layout button up top</span></div>
      <div class="win-body" style="padding-top:8px">
        <div class="${isGrid ? 'shop-grid-cards' : 'shop-list'}">${supplyHtml}</div>
      </div>
    </div>
    <div class="sys-window" style="margin-top:14px">
      <div class="win-bar"><span class="win-title">Badge Collection</span><span class="win-sub">${state.badges.length}/${BADGES.length} badges · ${state.collection.titles.length} titles</span></div>
      <div class="win-body" style="padding-top:8px">
        <div class="col-badges">${BADGES.map(b => {
          const owned = state.badges.includes(b.id);
          return owned
            ? `<span class="col-badge" title="${esc(b.desc)}">${b.icon}<small>${esc(b.name)}</small></span>`
            : `<span class="col-badge locked" title="Locked — ${esc(b.desc)}">❓<small>Locked</small></span>`;
        }).join('')}</div>
        <div class="col-titles">
          ${state.collection.titles.length ? state.collection.titles.map(t =>
            `<button class="col-title ${state.activeTitle === t ? 'worn' : ''}" data-t="${esc(t)}">◆ ${esc(t)}${state.activeTitle === t ? ' · worn' : ''}</button>`).join('')
          : '<div class="hint">No bonus titles yet — Mystery Chests can grant them. Your level title is automatic.</div>'}
        </div>
      </div>
    </div>
    <div class="sys-window" style="margin-top:14px">
      <div class="win-bar"><span class="win-title">Redeemed</span></div>
      <div class="win-body" style="padding-top:6px">${bought}</div>
    </div>`;

  document.querySelectorAll('.buy-btn[data-r]').forEach(b =>
    b.addEventListener('click', e => { e.stopPropagation(); buyReward(b.dataset.r, e); }));
  document.querySelectorAll('[data-r]').forEach(m => {
    m.addEventListener('click', e => {
      if(e.target.closest('.buy-btn')) return;
      openRewardEditor(m.dataset.r);
    });
  });
  el('addRewardBtn').addEventListener('click', () => openRewardEditor(null));

  document.querySelectorAll('#view-shop [data-shop]').forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.shop;
    if(a === 'free') openChest(true);
    else if(a === 'chest') openChest(false);
    else if(a === 'saver') buyPowerup('streakSaver', 150);
    else if(a === 'potion') buyPowerup('hpPotion', 100);
    else if(a === 'drink'){
      if(state.inventory.hpPotion <= 0) return;
      state.inventory.hpPotion--;
      state.hp = Math.min(maxHp(), state.hp + 50);
      save(); renderAll(); sfxCheckIn();
      toast('🧪 +50 HP. The System notices.');
    }
    else if(a === 'buy-xpPotion') buyPowerup('xpPotion', 50);
    else if(a === 'use-xpPotion'){
      if(state.inventory.xpPotion <= 0) return;
      state.inventory.xpPotion--;
      state.xpMultiplier = (state.xpMultiplier || 0) + 3;
      save(); renderAll(); sfxCheckIn();
      toast('⚡ 2× XP activated for your next 3 quest check-ins!');
    }
    else if(a === 'buy-armor') buyPowerup('armor', 80);
    else if(a === 'buy-salmon') buyPowerup('salmon', 30);
    else if(a === 'eat-salmon'){
      if(state.inventory.salmon <= 0) return;
      state.inventory.salmon--;
      state.hp = Math.min(maxHp(), state.hp + 40);
      state.exp += 20;
      save(); renderAll(); sfxCheckIn();
      toast('🐟 Ate Baked Salmon: +40 HP and +20 energy EXP!');
    }
    else if(a === 'buy-seer') buyPowerup('seerStone', 90);
    else if(a === 'use-seer'){
      if(state.inventory.seerStone <= 0) return;
      const openQ = state.quests.find(q => q.freq === 'daily' && q.timesDone < q.dailyLimit);
      if(!openQ){ toast('All daily quests are already done today!'); return; }
      state.inventory.seerStone--;
      save();
      checkIn(openQ.id, null);
      toast('🔮 Seer Stone consumed: "' + openQ.name + '" auto-completed without penalty!');
    }
    else if(a === 'buy-frozenFlame') buyPowerup('frozenFlame', 180);
  }));

  document.querySelectorAll('.col-title').forEach(b => b.addEventListener('click', () => {
    state.activeTitle = state.activeTitle === b.dataset.t ? null : b.dataset.t;
    save(); renderAll(); toast(state.activeTitle ? 'Title equipped: ' + state.activeTitle : 'Title removed.');
  }));
}

/* ---------------- settings (Game Master) ---------------- */

function setRow(label, key, min, max, step, val, fmtV){
  const shown = fmtV ? fmtV(val) : val;
  return `<div class="set-row"><span>${label}</span>
    <input type="range" data-set="${key}" min="${min}" max="${max}" step="${step}" value="${val}">
    <b data-v="${key}">${shown}</b></div>`;
}

function renderSettings(){
  const s = state.settings;
  el('view-settings').innerHTML = `
  <div class="sys-window">
    <div class="win-bar"><span class="win-title">Game Master</span><span class="win-sub">every rule is yours</span></div>
    <div class="win-body">

      <div class="btnrow" style="margin-top:0"><button class="btn primary" id="openRulesBtn">📖 Read the System's Laws (Rules Book)</button></div>

      <div class="set-sec">
        <div class="set-title">Appearance</div>
        <div class="set-row"><span>THEME</span>
          <div class="theme-row">
            ${['cyan','gold','red'].map(t => `<button class="theme-dot ${t} ${s.theme === t ? 'sel' : ''}" data-theme="${t}" title="${t === 'cyan' ? 'System Cyan' : t === 'gold' ? 'Monarch Gold' : 'Shadow Red'}"></button>`).join('')}
          </div>
        </div>
      </div>

      <div class="set-sec">
        <div class="set-title">Character</div>
        <label class="field"><span>PLAYER NAME</span>
          <input id="setName" maxlength="24" value="${esc(state.character.name)}" autocomplete="off">
        </label>
        <div class="row2">
          <label class="field"><span>SIGIL (EMOJI AVATAR)</span>
            <input id="setAvatar" maxlength="4" value="${/^data:/.test(state.character.avatar) ? '' : esc(state.character.avatar)}" placeholder="pick an emoji" autocomplete="off">
          </label>
        </div>
        <div class="row2">
          <button class="btn" id="uploadAvBtn">📷 Upload photo avatar</button>
          <button class="btn" id="removeAvBtn" ${/^data:/.test(state.character.avatar) ? '' : 'disabled'}>↺ Back to sigil</button>
        </div>
        <input type="file" id="setAvatarFile" accept="image/*" class="file-hidden">
        <div class="set-row"><span>SOUND FX</span>
          <label class="switch"><input type="checkbox" id="setSound" data-set="sound" ${s.sound ? 'checked' : ''}><i></i></label><b></b>
        </div>
        <button class="btn primary" id="saveChar">Save Character</button>
      </div>

      <div class="set-sec">
        <div class="set-title">Leveling Curve</div>
        ${setRow('EXP BASE (level 1→2)', 'expBase', 50, 500, 10, s.expBase)}
        ${setRow('CURVE STEEPNESS', 'expGrowth', 1.0, 2.0, 0.05, s.expGrowth, v => (+v).toFixed(2))}
        <div class="rank-row">
          ${['rankD','rankC','rankB','rankA','rankS'].map(k =>
            `<label class="field"><span>${({rankD:'SILVER',rankC:'GOLD',rankB:'PLATINUM',rankA:'DIAMOND',rankS:'CROWN'})[k]} RANK</span><input type="number" min="1" data-set="${k}" value="${s[k]}"></label>`).join('')}
        </div>
        <p class="hint">Reaching level N needs expBase × N^steepness EXP. Steeper = levels get harder faster.</p>
      </div>

      <div class="set-sec">
        <div class="set-title">Survival Rules</div>
        ${setRow('HP PENALTY (miss a day)', 'hpPenalty', 0, 50, 5, s.hpPenalty)}
        ${setRow('HP HEAL (per check-in)', 'hpHeal', 0, 10, 1, s.hpHeal)}
        ${setRow('MAX HP', 'maxHp', 50, 300, 10, s.maxHp)}
      </div>

      <div class="set-sec">
        <div class="set-title">Perfect Bonus (gold)</div>
        ${setRow('PERFECT DAY (all daily)', 'perfectDayGold', 0, 100, 5, s.perfectDayGold)}
        ${setRow('PERFECT WEEK (all weekly)', 'perfectWeekGold', 0, 300, 25, s.perfectWeekGold)}
        ${setRow('PERFECT MONTH (all monthly)', 'perfectMonthGold', 0, 1000, 50, s.perfectMonthGold)}
      </div>

      <div class="set-sec">
        <div class="set-title">Weekly Boss</div>
        ${setRow('BOSS TOTAL EXP', 'bossExp', 100, 2000, 50, s.bossExp)}
        ${setRow('BOSS TOTAL GOLD', 'bossGold', 20, 500, 10, s.bossGold)}
        ${setRow('BOSS PHASES (hits to defeat)', 'bossPhases', 1, 5, 1, s.bossPhases)}
        ${setRow('KILL BONUS (gold)', 'bossKillBonus', 0, 200, 10, s.bossKillBonus)}
      </div>

      <div class="set-sec">
        <div class="set-title">Quests</div>
        <div class="set-row"><span>RANDOM QUESTS</span>
          <label class="switch"><input type="checkbox" id="setRandom" data-set="randomQuests" ${s.randomQuests ? 'checked' : ''}><i></i></label><b></b>
        </div>
        <div class="set-row"><span>HIDE COMPLETED DAILY QUESTS</span>
          <label class="switch"><input type="checkbox" id="setHideDone" data-set="hideCompleted" ${s.hideCompleted ? 'checked' : ''}><i></i></label><b></b>
        </div>
      </div>

      <div class="set-sec">
        <div class="set-title">Cloud Sync (optional, free)</div>
        <label class="field"><span>SUPABASE URL</span>
          <input id="syncUrl" placeholder="https://xxxx.supabase.co" value="${esc(s.sync.url)}" autocomplete="off">
        </label>
        <label class="field"><span>ANON KEY</span>
          <input id="syncKey" type="password" placeholder="eyJhbGciOi..." value="${esc(s.sync.key)}" autocomplete="off">
        </label>
        <div class="btnrow">
          <button class="btn primary" id="syncPushBtn">⬆ Push my save</button>
          <button class="btn" id="syncPullBtn">⬇ Pull cloud save</button>
        </div>
        <div class="set-row" style="margin-top:10px"><span>AUTO-SYNC AFTER EACH CHECK-IN</span>
          <label class="switch"><input type="checkbox" id="syncAuto" data-set="sync.auto" ${s.sync.auto ? 'checked' : ''}><i></i></label><b></b>
        </div>
        <div class="sync-last">${s.sync.lastPush ? 'Last push: ' + new Date(s.sync.lastPush).toLocaleString()
          : (s.sync.lastPull ? 'Last pull: ' + new Date(s.sync.lastPull).toLocaleString() : 'Not synced yet.')}</div>
        <details class="help">
          <summary>How to set up cloud sync (free, ~3 min)</summary>
          <p style="margin-bottom:10px">The URL you paste is your <b>Supabase Project URL</b> — it looks like
          <code>https://abcdefgh1234.supabase.co</code>. It is NOT your app link and NOT a GitHub link.
          <b>No files need updating</b> — the app talks to it by itself.<br>
          ⚠️ Use the <b>"anon public"</b> key — never the "service_role / secret" key.</p>
          <ol>
            <li>Sign up free at <b>supabase.com</b> → "New project" (any region).</li>
            <li>Open <b>SQL Editor</b> → paste this → Run:
              <pre>create table public.saves (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.saves enable row level security;
create policy "open personal sync"
  on public.saves for all
  using (true) with check (true);</pre>
            </li>
            <li>In <b>Project Settings → API</b> copy the "Project URL" and "anon public key" into the boxes above.</li>
            <li>Tap <b>Push</b>. On any other device: same URL + key → <b>Pull</b>.</li>
          </ol>
          <p>Treat your URL + key like a password — anyone with both can read this save.</p>
        </details>
      </div>

      <div class="set-sec">
        <div class="set-title">Data</div>
        <div class="btnrow">
          <button class="btn" id="exportBtn">⬇ Export backup</button>
          <button class="btn" id="importBtn">⬆ Import backup</button>
        </div>
        <input type="file" id="importFile" accept="application/json,.json" class="file-hidden">
        <div class="btnrow">
          <button class="btn" id="resetRulesBtn">↺ Reset rules to defaults</button>
          <button class="btn danger" id="resetBtn">Reset ALL (danger)</button>
        </div>
        <p class="hint" style="margin-top:14px">Your data lives in this browser. Export a backup regularly —
        that JSON file is your save file.</p>
      </div>

    </div>
  </div>`;

  // live rule bindings (data-set keys, incl. sync.* nested)
  document.querySelectorAll('#view-settings [data-set]').forEach(inp => {
    inp.addEventListener('input', () => {
      let v;
      if(inp.type === 'checkbox') v = inp.checked;
      else if(inp.type === 'number' || inp.type === 'range') v = Number(inp.value);
      else v = inp.value;
      const k = inp.dataset.set;
      if(k.indexOf('sync.') === 0) state.settings.sync[k.slice(5)] = v;
      else state.settings[k] = v;
      if(inp.type === 'range'){
        const ve = document.querySelector('#view-settings b[data-v="' + k + '"]');
        if(ve) ve.textContent = v;
      }
      save();
      if(k === 'hideCompleted') renderAll();
    });
  });

  el('saveChar').addEventListener('click', () => {
    state.character.name = el('setName').value.trim() || 'Player';
    const av = el('setAvatar').value.trim();
    if(av) state.character.avatar = av;
    save(); renderAll(); toast('Character updated.');
  });
  const upBtn = el('uploadAvBtn');
  if(upBtn) upBtn.addEventListener('click', () => el('setAvatarFile').click());
  const upFile = el('setAvatarFile');
  if(upFile) upFile.addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    pickAvatarImage(f, img => {
      upFile.value = '';
      state.character.avatar = img;
      save(); renderAll(); toast('Avatar updated. Looking sharp, ' + state.character.name + '.');
    }, () => { upFile.value = ''; });
  });
  const rmBtn = el('removeAvBtn');
  if(rmBtn) rmBtn.addEventListener('click', () => {
    state.character.avatar = '👁️';
    save(); renderAll(); toast('Back to sigil mode.');
  });
  const orb = el('openRulesBtn');
  if(orb) orb.addEventListener('click', openRulesBook);
  document.querySelectorAll('.theme-dot').forEach(d => d.addEventListener('click', () => {
    state.settings.theme = d.dataset.theme;
    save(); applyTheme(); renderAll(); toast('Theme set.');
  }));

  el('syncUrl').addEventListener('change', e => { state.settings.sync.url = e.target.value.trim(); save(); });
  el('syncKey').addEventListener('change', e => { state.settings.sync.key = e.target.value.trim(); save(); });
  el('syncPushBtn').addEventListener('click', () => syncPush(false));
  el('syncPullBtn').addEventListener('click', syncPull);

  el('exportBtn').addEventListener('click', exportData);
  el('importBtn').addEventListener('click', () => el('importFile').click());
  el('importFile').addEventListener('change', e => {
    if(e.target.files && e.target.files[0]) importData(e.target.files[0]);
  });
  el('resetRulesBtn').addEventListener('click', () => {
    const keepSync = state.settings.sync;
    state.settings = Object.assign({}, DEFAULT_SETTINGS, { sync: keepSync });
    save(); renderAll(); toast('Rules reset to defaults.');
  });
  el('resetBtn').addEventListener('click', () => {
    if(confirm('Erase your entire game life and start over? This cannot be undone.')){
      localStorage.removeItem(KEY);
      location.reload();
    }
  });
}

/* ---------------- rules book ---------------- */

const RULES_TEXT = `
<div class="rules-row"><span class="rules-num">1</span><div><b>Quests.</b> Daily quests reset at midnight. Weekly quests reset on Monday. Monthly quests reset on the 1st. Check in ONLY when you truly did the thing — the System can feel a lie.</div></div>
<div class="rules-row"><span class="rules-num">2</span><div><b>Streak.</b> Complete at least ONE quest each day and your streak grows by 1. Miss a day and it breaks — and the System takes HP for it. A Streak Saver, if you own one, freezes one missed day so the streak survives.</div></div>
<div class="rules-row"><span class="rules-num">3</span><div><b>EXP &amp; Levels.</b> Every quest gives EXP. Level up when your bar fills. Higher level = higher EXP need, prestige titles, and hunter progression. Titles: Novice, Challenger, Warrior, Elite, Hero, Hunter, Shadow Monarch, Archon, Sovereign.</div></div>
<div class="rules-row"><span class="rules-num">4</span><div><b>Truth only.</b> The System rewards actions, not words. Check in ONLY when you truly did the thing — a fake check-in is a debt, and the System keeps a ledger.</div></div>
<div class="rules-row"><span class="rules-num">5</span><div><b>Quest Discipline.</b> Complete your quests daily to build unstoppable momentum. Consistency fuels your rank progression and strengthens your hunter identity.</div></div>
<div class="rules-row"><span class="rules-num">6</span><div><b>HP.</b> HP is your health (default 100 max HP). Breaking your streak hurts you (Guardian: half as much). At zero HP the System gives you a quest — finish it and you get 30 HP back. You can also drink HP Potions from the Shop.</div></div>
<div class="rules-row"><span class="rules-num">7</span><div><b>Gold.</b> Every quest earns gold. Spend it on real-world rewards you create in the Shop, or on Mystery Chests, Streak Savers (150), System Armor (80), and HP Potions (100).</div></div>
<div class="rules-row"><span class="rules-num">8</span><div><b>Boss Fight.</b> A boss with its own HP bar appears every day. Daily quests deal damage. Kill it for a big EXP and gold drop and a fresh, stronger boss appears. You can name your boss.</div></div>
<div class="rules-row"><span class="rules-num">9</span><div><b>Perfect Days.</b> Finish every daily quest in a day and earn the "Flawless" badge. Complete a whole week and earn "Undeniable". Perfect days are counted per week.</div></div>
<div class="rules-row"><span class="rules-num">10</span><div><b>Daily Blessing.</b> Open the game each day and the System greets you with gold: 10 ◈ plus 2 ◈ per streak day. It is a small thank-you for showing up.</div></div>
<div class="rules-row"><span class="rules-num">11</span><div><b>Luck &amp; Rare Drops.</b> 15% of check-ins bring a lucky gold bonus. Quests also have a 5% chance to drop rare legendary powerups like XP Potions, Baked Salmon, Seer Stones, or Frozen Flames.</div></div>
<div class="rules-row"><span class="rules-num">12</span><div><b>System Ranks.</b> Your rank climbs every 500 EXP: BRONZE (0) → SILVER (500) → GOLD (1,000) → PLATINUM (1,500) → DIAMOND (2,000) → CROWN (2,500). Every completed quest pushes you closer to the next tier.</div></div>
<div class="rules-row"><span class="rules-num">13</span><div><b>Crates.</b> Each day the System offers three crates — a challenge, not a mission: Wooden (earn 100 EXP, small reward), Gold (earn 250 EXP, medium reward), Diamond (earn 500 EXP + 5 quests, big reward). Choose ONE — the clock starts immediately and you cannot switch. Beat the goal and the crate is UNLOCKED — tap OPEN to collect your reward.</div></div>
<div class="rules-row"><span class="rules-num">14</span><div><b>Chests &amp; Collection.</b> The Shop has a Free Supply (10–30 ◈, once a day) and a Mystery Chest (60 ◈) with random drops: gold, EXP, HP Potion, Streak Saver, rare powerups, or a new title. Your Badge Collection shows every badge you have earned. Bonus titles from chests can be worn on your card.</div></div>
<div class="rules-row"><span class="rules-num">15</span><div><b>Seasons.</b> The System runs in seasons — each one lasts a month, counted from the day you were awakened. When a new season begins, your rank drops two steps (never below BRONZE); your level and progress stay. Push your rank back up. No one stays on top forever.</div></div>
<div class="rules-row"><span class="rules-num">16</span><div><b>Your life, your rules.</b> Every number on this page — EXP, gold, HP, bosses, seasons, themes, layouts — can be changed in Settings → Game Master. The System obeys you, Player. Even this book does not stop you rewriting the world.</div></div>
`;

function openRulesBook(){
  el('rulesBody').innerHTML = RULES_TEXT;
  show(el('rulesModal'));
}

/* ---------------- daily blessing ---------------- */

function maybeBlessing(delay){
  if(!state || state.lastBlessingDay === todayStr()) return;
  const amt = 10 + (state.streak || 0) * 2;
  setTimeout(() => {
    if(!state || state.lastBlessingDay === todayStr()) return;
    el('blessingAmt').textContent = '+' + amt + ' ◈';
    el('blessingGreet').textContent = 'The System greets you, ' + state.character.name + '. You opened your game for a new day.';
    show(el('blessingModal'));
  }, delay || 0);
}

/* ---------------- avatar upload ---------------- */

function pickAvatarImage(file, cb, errCb){
  try{
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        const S = 128;
        c.width = S; c.height = S;
        const x = c.getContext('2d');
        const m = Math.min(img.width, img.height);
        x.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
        cb(c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => { toast('Could not read that image. Try another photo.'); if(errCb) errCb(); };
      img.src = fr.result;
    };
    fr.onerror = () => { toast('Could not read that file.'); if(errCb) errCb(); };
    fr.readAsDataURL(file);
  }catch(e){ toast('Could not use that image.'); if(errCb) errCb(); }
}

/* ---------------- modals ---------------- */

function openQuestEditor(id){
  editingQuest = id;
  const q = id ? state.quests.find(x => x.id === id) : null;
  el('qmTitle').textContent = q ? 'EDIT QUEST' : 'NEW QUEST';
  el('qmName').value = q ? q.name : '';
  el('qmIcon').value = q ? (q.icon || '') : '';
  const cat = q ? (q.category || 'Body') : 'Body';
  el('qmCat').value = cat;
  document.querySelectorAll('.cat-pill').forEach(p =>
    p.classList.toggle('active', p.dataset.cat === cat));
  el('qmExp').value = q ? q.exp : 50;
  el('qmGold').value = q ? q.gold : 5;
  el('qmLimit').value = q ? q.dailyLimit : 1;
  el('qmFreq').value = q ? q.freq : 'daily';
  el('qmDelete').style.display = q ? '' : 'none';
  show(el('questModal'));
  setTimeout(() => el('qmName').focus(), 50);
}

function saveQuest(){
  const name = el('qmName').value.trim();
  if(!name){ toast('Give your quest a name.'); return; }
  const data = {
    name,
    icon: el('qmIcon').value.trim() || '⭐',
    category: el('qmCat').value,
    freq: el('qmFreq').value,
    exp: Math.max(1, parseInt(el('qmExp').value, 10) || 1),
    gold: Math.max(0, parseInt(el('qmGold').value, 10) || 0),
    dailyLimit: Math.min(10, Math.max(1, parseInt(el('qmLimit').value, 10) || 1)),
  };
  if(editingQuest){
    const q = state.quests.find(x => x.id === editingQuest);
    Object.assign(q, data);
    // if frequency changed, re-key the period
    q.resetKey = periodFor(q.freq);
  } else {
    state.quests.push({ id:'q' + Date.now(), timesDone:0, resetKey:periodFor(data.freq), ...data });
  }
  save(); renderAll(); hide(el('questModal')); toast('Quest saved. The System accepts it.');
}

function deleteQuest(){
  if(!editingQuest) return;
  if(!confirm('Delete this quest forever?')) return;
  state.quests = state.quests.filter(x => x.id !== editingQuest);
  save(); renderAll(); hide(el('questModal')); toast('Quest removed.');
}

function openRewardEditor(id){
  editingReward = id;
  const r = id ? state.rewards.find(x => x.id === id) : null;
  el('rmTitle').textContent = r ? 'EDIT REWARD' : 'NEW REWARD';
  el('rmName').value = r ? r.name : '';
  el('rmIcon').value = r ? (r.icon || '') : '';
  el('rmCost').value = r ? r.cost : 50;
  el('rmDelete').style.display = r ? '' : 'none';
  show(el('rewardModal'));
  setTimeout(() => el('rmName').focus(), 50);
}

function saveReward(){
  const name = el('rmName').value.trim();
  if(!name){ toast('Give your reward a name.'); return; }
  const data = {
    name,
    icon: el('rmIcon').value.trim() || '🎁',
    cost: Math.max(1, parseInt(el('rmCost').value, 10) || 1),
  };
  if(editingReward){
    Object.assign(state.rewards.find(x => x.id === editingReward), data);
  } else {
    state.rewards.push({ id:'r' + Date.now(), ...data });
  }
  save(); renderAll(); hide(el('rewardModal')); toast('Reward saved.');
}

function deleteReward(){
  if(!editingReward) return;
  if(!confirm('Delete this reward?')) return;
  state.rewards = state.rewards.filter(x => x.id !== editingReward);
  save(); renderAll(); hide(el('rewardModal')); toast('Reward removed.');
}

function openBossEditor(){
  el('bmName').value = state.bossCustomName || '';
  show(el('bossModal'));
  setTimeout(() => el('bmName').focus(), 50);
}

function buyPowerup(key, cost){
  if(state.gold < cost){ toast('Not enough gold. The System is watching.'); return; }
  state.gold -= cost;
  state.inventory[key] = (state.inventory[key] || 0) + 1;
  save(); renderAll(); sfxCheckIn();
  const msgs = {
    streakSaver: 'Streak Saver acquired — guards your streak for 1 day.',
    hpPotion: 'HP Potion acquired (+50 HP).',
    xpPotion: 'XP Potion acquired — drink to gain 2× XP on next 3 check-ins.',
    armor: 'System Armor acquired — shields HP and penalties on missed days.',
    salmon: 'Baked Salmon acquired — rich meal for +40 HP & +20 EXP energy.',
    seerStone: 'Seer Stone acquired — consume to auto-complete 1 daily quest.',
    frozenFlame: 'Frozen Flame acquired — guards streak for 4 full days.',
  };
  toast(msgs[key] || (key + ' acquired.'));
}

/* ---------------- chests & collection ---------------- */

function rollChest(){
  const pool = [
    { type:'gold', w:28 },
    { type:'exp', w:14 },
    { type:'potion', w:14 },
    { type:'saver', w:10 },
    { type:'xpPotion', w:10 },
    { type:'salmon', w:10 },
    { type:'seerStone', w:6 },
    { type:'frozenFlame', w:4 },
    { type:'title', w:8 },
  ];
  let tot = 0; for(const p of pool) tot += p.w;
  let r = Math.random() * tot, pick = pool[0];
  for(const p of pool){ r -= p.w; if(r < 0){ pick = p; break; } }
  const res = { type: pick.type };
  const lockedT = TITLES.filter(t => !state.collection.titles.includes(t));
  if(pick.type === 'gold'){ res.visual = supplyVisual('bag'); res.amount = 20 + Math.floor(Math.random() * 41); res.desc = res.amount + ' ◈ gold'; res.tier = 'common'; }
  else if(pick.type === 'exp'){ res.visual = supplyVisual('bag'); res.amount = 50 + Math.floor(Math.random() * 101); res.desc = '+' + res.amount + ' EXP'; res.tier = 'common'; }
  else if(pick.type === 'potion'){ res.visual = supplyVisual('flask'); state.inventory.hpPotion = (state.inventory.hpPotion || 0) + 1; res.desc = 'HP Potion — +50 HP'; res.tier = 'common'; }
  else if(pick.type === 'saver'){ res.visual = supplyVisual('ice'); state.inventory.streakSaver = (state.inventory.streakSaver || 0) + 1; res.desc = 'Streak Saver — auto-protects 1 missed day'; res.tier = 'rare'; }
  else if(pick.type === 'xpPotion'){ res.visual = supplyVisual('xp'); state.inventory.xpPotion = (state.inventory.xpPotion || 0) + 1; res.desc = '⚡ XP Potion (RARE) — 2× XP on next 3 quests!'; res.tier = 'rare'; }
  else if(pick.type === 'salmon'){ res.visual = supplyVisual('salmon'); state.inventory.salmon = (state.inventory.salmon || 0) + 1; res.desc = '🐟 Baked Salmon (RARE) — +40 HP & +20 EXP feast!'; res.tier = 'rare'; }
  else if(pick.type === 'seerStone'){ res.visual = supplyVisual('seer'); state.inventory.seerStone = (state.inventory.seerStone || 0) + 1; res.desc = '🔮 Seer Stone (EPIC) — auto-completes 1 daily quest!'; res.tier = 'epic'; }
  else if(pick.type === 'frozenFlame'){ res.visual = supplyVisual('frozen-flame'); state.inventory.frozenFlame = (state.inventory.frozenFlame || 0) + 1; res.desc = '❄️ Frozen Flame (EPIC) — 4-day streak protection shield!'; res.tier = 'epic'; }
  else {
    if(lockedT.length){ const t = lockedT[Math.floor(Math.random() * lockedT.length)]; state.collection.titles.push(t); res.visual = supplyVisual('chest'); res.desc = 'New title unlocked: "' + t + '"'; res.tier = 'epic'; }
    else { res.visual = supplyVisual('bag'); res.amount = 75; res.desc = '+75 ◈ gold (all titles owned)'; res.tier = 'rare'; }
  }
  if(res.amount){
    if(res.type === 'gold'){ state.gold += res.amount; state.totalGold += res.amount; }
    else if(res.type === 'exp'){ state.exp += res.amount; }
  }
  save(); renderAll();
  return res;
}

function openChest(free){
  if(free){
    if(state.freeSupplyDay === todayStr()){ toast('Free Supply already claimed today. Come back at midnight.'); return; }
    const amt = 10 + Math.floor(Math.random() * 21);
    state.freeSupplyDay = todayStr();
    state.gold += amt; state.totalGold += amt;
    save(); renderAll(); sfxBadge();
    showChestResult({ visual: supplyVisual('bag'), tier:'common', title:'Free Supply', desc: amt + ' ◈ gold from the System.', sub:'One free supply every day.' });
    return;
  }
  if(state.gold < 60){ toast('Not enough gold for a Mystery Chest (60 ◈).'); return; }
  state.gold -= 60;
  const res = rollChest();
  if(res.type === 'exp'){
    const before = levelFromExp(state.exp);
    state.exp += res.amount;
    const after = levelFromExp(state.exp);
    if(after.level > before.level) levelUpFX(before.level, after.level, rankAtExp(before.exp), rankAtExp(state.exp));
  }
  save(); renderAll(); sfxLevelUp();
  showChestResult({ visual: dropVisual(res.type), tier: dropTier(res.type, res.amount), title:'Mystery Chest', desc: res.desc, sub:'Drops: gold · EXP · potion · saver · title' });
}

function dropVisual(type){
  const map = { gold:'bag', exp:'spark', potion:'flask', saver:'ice', title:'gem' };
  return supplyVisual(map[type] || 'bag');
}
function dropTier(type, amount){
  if(type === 'saver' || type === 'title') return 'epic';
  if(type === 'potion') return 'rare';
  if(type === 'gold') return (amount || 0) >= 40 ? 'rare' : 'common';
  return 'common';
}
function showChestResult(r){
  el('chestIcon').innerHTML = r.visual || (r.icon || '');
  el('chestTitle').textContent = r.title;
  el('chestDesc').textContent = r.desc;
  el('chestSub').textContent = r.sub || '';
  const m = el('chestModal');
  m.classList.remove('t-common', 't-rare', 't-epic');
  if(r.tier) m.classList.add('t-' + r.tier);
  if(r.tier === 'epic') sfxEpic();
  else if(r.tier === 'rare') sfxRare();
  else sfxChestOpen();
  show(m);
}

/* ---------------- daily crates (challenges) ---------------- */

function crateReset(){
  const t = todayStr();
  if(!state) return;
  if(!state.crates || state.crates.day !== t){
    const old = state.crates;
    state.crates = { day:t, tier:null, progress:{quests:0, exp:0, perfect:0}, done:false, claimed:false };
    if(old && old.tier && old.done && !old.claimed){
      const res = rollCrateReward(old.tier);
      if(res.type === 'exp') state.exp += res.amount;
      save();
      toast("Last night's " + CRATES[old.tier].name + ' was collected: ' + res.desc);
    }
  }
}

function chooseCrate(tier){
  if(!state || !CRATES[tier]) return;
  const c = state.crates;
  if(c.tier){ toast('Today\'s crate is already locked in. Choose once \u2014 the System respects commitment.'); return; }
  c.tier = tier;
  c.progress = {
    quests: state.dayQuests,
    exp: state.dayExp || 0,
    perfect: (state.perfect && state.perfect.d === periodFor('daily')) ? 1 : 0,
  };
  save(); renderAll();
  toast(CRATES[tier].name + ' locked in: ' + CRATES[tier].desc + ' — the clock starts now.');
  crateBump();
}

function crateBump(){
  const c = state && state.crates;
  if(!c || !c.tier || c.done) return;
  const g = CRATES[c.tier].goals;
  c.progress.quests = Math.max(c.progress.quests, state.dayQuests);
  c.progress.exp = Math.max(c.progress.exp, state.dayExp || 0);
  const ok = (c.progress.quests >= g.quests) && (c.progress.exp >= g.exp) && (c.progress.perfect >= g.perfect);
  if(ok){
    c.done = true;
    save(); renderAll(); sfxLevelUp();
    toast(CRATES[c.tier].name + ' UNLOCKED — open it in the Crates tab to collect your reward!');
  } else {
    save();
  }
}

function claimCrate(){
  const c = state && state.crates;
  if(!c || !c.tier || !c.done || c.claimed) return;
  const res = rollCrateReward(c.tier);
  if(res.type === 'exp'){
    const before = levelFromExp(state.exp);
    state.exp += res.amount;
    const after = levelFromExp(state.exp);
    if(after.level > before.level) levelUpFX(before.level, after.level, rankAtExp(before.exp), rankAtExp(state.exp));
  }
  c.claimed = true;
  save(); renderAll(); sfxLevelUp();
  showChestResult({ visual: crateVisual(c.tier), tier: dropTier(res.type, res.amount), title: CRATES[c.tier].name + ' \u2014 UNLOCKED', desc: res.desc, sub: CRATES[c.tier].desc });
}

function rollCrateReward(tier){
  const pools = {
    wood:    [ {t:'gold', min:20, max:45, w:75}, {t:'exp', min:30, max:60, w:25} ],
    gold:    [ {t:'gold', min:50, max:100, w:45}, {t:'exp', min:80, max:150, w:20}, {t:'potion', w:25}, {t:'title', w:10} ],
    diamond: [ {t:'gold', min:120, max:220, w:30}, {t:'exp', min:200, max:350, w:20}, {t:'saver', w:25}, {t:'title', w:25} ],
  };
  const pool = pools[tier] || pools.wood;
  let tot = 0; for(const p of pool) tot += p.w;
  let r = Math.random() * tot, pick = pool[0];
  for(const p of pool){ r -= p.w; if(r < 0){ pick = p; break; } }
  const res = { type: pick.t };
  const lockedT = TITLES.filter(t => !state.collection.titles.includes(t));
  if(pick.t === 'gold'){ res.icon = '\u25C8'; res.amount = pick.min + Math.floor(Math.random() * (pick.max - pick.min + 1)); res.desc = res.amount + ' \u25C8 gold'; }
  else if(pick.t === 'exp'){ res.icon = '\u2728'; res.amount = pick.min + Math.floor(Math.random() * (pick.max - pick.min + 1)); res.desc = '+' + res.amount + ' EXP'; }
  else if(pick.t === 'potion'){ res.icon = '\u{1F9EA}'; state.inventory.hpPotion++; res.desc = 'HP Potion \u2014 +50 HP'; }
  else if(pick.t === 'saver'){ res.icon = '\u{1F9CA}'; state.inventory.streakSaver++; res.desc = 'Streak Saver'; }
  else {
    if(lockedT.length){ const t = lockedT[Math.floor(Math.random() * lockedT.length)]; state.collection.titles.push(t); res.icon = '\u{1F3F7}\uFE0F'; res.desc = 'New title: ' + t; }
    else { res.icon = '\u25C8'; res.amount = 50; res.desc = '50 \u25C8 (all titles owned)'; }
  }
  if(res.amount){ state.gold += res.amount; state.totalGold += res.amount; }
  return res;
}

/* ---------------- backup ---------------- */

function downloadUrl(url, filename){
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);   // must be in the page — Safari/Firefox ignore clicks otherwise
  a.click();
  setTimeout(() => a.remove(), 5000);
}

function exportData(){
  const fname = 'life-rpg-backup-' + todayStr() + '.json';
  try{
    const blob = new Blob([JSON.stringify(state, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    downloadUrl(url, fname);
    setTimeout(() => URL.revokeObjectURL(url), 15000);
    toast('⬇ Backup saved — check your Downloads (phone: Files app).');
  }catch(e){
    downloadUrl('data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state)), fname);
    toast('⬇ Backup opened — tap "Save File" to keep it.');
  }
}

function importData(file){
  const fr = new FileReader();
  fr.onload = () => {
    try{
      const d = JSON.parse(fr.result);
      if(!d || !Array.isArray(d.quests) || typeof d.exp !== 'number') throw new Error('bad file');
      state = sanitize(migrate(d));
      save();
      toast('✅ Import OK — loading your save...');
      setTimeout(() => location.reload(), 500);
    }catch(e){ toast('❌ Import failed — that file is not a valid Life RPG backup (pick the life-rpg-backup-*.json file).'); }
  };
  fr.onerror = () => toast('❌ Could not read that file. Try exporting it again.');
  fr.readAsText(file);
}

/* ---------------- cloud sync (Supabase REST) ---------------- */

function syncHeaders(){
  const s = state.settings.sync;
  return { 'Content-Type':'application/json', 'apikey':s.key, 'Authorization':'Bearer ' + s.key };
}

async function apiErrorMessage(res){
  let msg = 'HTTP ' + res.status;
  try{
    const j = await res.clone().json();
    if(j && (j.message || j.error_description || j.msg)) msg = j.message || j.error_description || j.msg;
  }catch(e){}
  return msg;
}

function checkSyncCreds(showErrors){
  const s = state.settings.sync;
  if(!s.url || !s.key){ if(showErrors) toast('Enter your Supabase URL and key first.'); return false; }
  if(!/^https:\/\/[a-z0-9]+\.supabase\.co/i.test(s.url)){
    if(showErrors) toast('❌ That is not a Supabase URL. It should look like https://abcdefgh.supabase.co — copy "Project URL" from Supabase → Project Settings → API.');
    return false;
  }
  if(!/^(eyJ|sb_publishable_)/.test(s.key)){
    if(showErrors) toast('❌ That does not look like a Supabase publishable/anon key (starts with "sb_publishable_" or "eyJ"). Use the PUBLISHABLE key — never the secret key.');
    return false;
  }
  return true;
}

async function syncPush(silent){
  const s = state.settings.sync;
  if(!checkSyncCreds(!silent)) return;
  try{
    const res = await fetch(s.url.replace(/\/+$/, '') + '/rest/v1/saves', {
      method:'POST',
      headers: Object.assign({}, syncHeaders(), { 'Prefer':'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ id:s.playerId, data:state, updated_at:new Date().toISOString() }),
    });
    if(!res.ok) throw new Error(await apiErrorMessage(res));
    s.lastPush = new Date().toISOString();
    save();
    if(!silent){ toast('☁️ Save pushed to cloud ✅'); renderSettings(); }
  }catch(err){
    if(!silent) toast('☁️ Push failed: ' + err.message.slice(0, 160));
  }
}

async function syncPull(){
  const s = state.settings.sync;
  if(!checkSyncCreds(true)) return;
  try{
    const res = await fetch(s.url.replace(/\/+$/, '') + '/rest/v1/saves?id=eq.' + encodeURIComponent(s.playerId), {
      headers: syncHeaders(),
    });
    if(!res.ok) throw new Error(await apiErrorMessage(res));
    const rows = await res.json();
    if(!rows.length){ toast('No cloud save found yet — Push from this device first.'); return; }
    if(!confirm('Replace your current save with the cloud save?')) return;
    state = sanitize(migrate(rows[0].data));
    s.lastPull = new Date().toISOString();
    save();
    location.reload();
  }catch(err){
    toast('☁️ Pull failed: ' + err.message.slice(0, 160));
  }
}

/* ---------------- fx ---------------- */

let fxTimer = null;
function levelUpFX(from, to, rankFrom, rankTo){
  el('fxContent').innerHTML = `
    <div class="fx-kicker">System Notification</div>
    <div class="fx-big">LEVEL UP</div>
    <div class="fx-sub">Level ${from} → <b>Level ${to}</b></div>
    ${rankTo !== rankFrom ? `<div class="fx-rank">RANK UP — ${rankTo}</div>` : ''}
    <div class="fx-flavor">"Your power has grown. The System is pleased."</div>`;
  showOverlay(el('fxOverlay'), 2600);
  sfxLevelUp();
}

function rankUpFX(rank){
  el('fxContent').innerHTML = `
    <div class="fx-kicker">System Notification</div>
    <div class="fx-rank" style="font-size:44px">RANK UP</div>
    <div class="fx-sub" style="margin-top:10px">You are now <b style="color:var(--gold)">${rank} RANK</b></div>
    <div class="fx-flavor">"The hunters of this world have changed."</div>`;
  showOverlay(el('fxOverlay'), 2600);
  sfxLevelUp();
}

function bossDefeatedFX(){
  el('fxContent').innerHTML = `
    <div class="fx-kicker">Boss Defeated</div>
    <div class="fx-big" style="color:#fca5a5;text-shadow:0 0 30px rgba(248,113,113,.9),0 0 90px rgba(248,113,113,.5)">BOSS DOWN</div>
    <div class="fx-sub">${esc(state.bossCustomName || state.boss.boss)} has fallen</div>
    <div class="fx-rank">+${state.settings.bossKillBonus} ◈ KILL BONUS</div>
    <div class="fx-flavor">"An incredible hunter... The System raises its gaze to you."</div>`;
  showOverlay(el('fxOverlay'), 3200);
  sfxLevelUp();
}

function showOverlay(node, ms){
  node.classList.remove('hidden');
  clearTimeout(fxTimer);
  fxTimer = setTimeout(() => node.classList.add('hidden'), ms);
}

function floatText(txt, x, y, style = ''){
  const d = document.createElement('div');
  d.className = 'float-exp' + (style ? ' ' + style : '');
  d.textContent = txt;
  d.style.left = Math.max(8, (x || innerWidth / 2) - 20 + (Math.random() * 40 - 20)) + 'px';
  d.style.top = (y || innerHeight / 2) - 30 + 'px';
  el('fxLayer').appendChild(d);
  setTimeout(() => d.remove(), 1200);
}

/* drawn visuals (no emoji — like PUBG / Duolingo artwork) */
function crateVisual(tier, sm){ return '<div class="cv cv-crate cv-' + tier + (sm ? ' sm' : '') + '"><i class="cv-band"></i><i class="cv-lock"></i></div>'; }
function supplyVisual(kind, sm){ return '<div class="cv cv-' + kind + (sm ? ' sm' : '') + '"></div>'; }
function flameTier(s){ s = Math.max(0, s | 0); return s >= 30 ? 5 : s >= 14 ? 4 : s >= 7 ? 3 : s >= 3 ? 2 : 1; }

/* the System talks back */
function systemGreeting(){
  const h = new Date().getHours();
  if(state.streak >= 3) return state.streak + ' days in a row. The System is watching \u2014 impressed.';
  if(h < 6) return 'You open me before the world wakes. Arise, early.';
  if(state.hp < maxHp() * .4) return 'Your HP is low. The System watches you carefully.';
  if(state.crates && state.crates.done && !state.crates.claimed) return 'A crate waits to be opened. Claim it.';
  const lines = ['Only you level up.', 'The System does not negotiate. But it keeps the score.', 'Every quest is a wall the darkness cannot cross.', 'Monarchs are made on ordinary days.', 'The dungeon is life. Enter anyway.'];
  return lines[Math.floor(Date.now() / 86400000) % lines.length];
}

let toastTimer = null;
function toast(msg){
  const t = el('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2800);
}

function show(n){ n.classList.remove('hidden'); }
function hide(n){ n.classList.add('hidden'); }

/* ---------------- shareable character card (canvas) ---------------- */

function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function rankColor(r){
  return { E:'#94a3b8', D:'#34d399', C:'#38bdf8', B:'#818cf8', A:'#c084fc', S:'#fbbf24' }[r] || '#7dd3fc';
}

function cardBar(ctx, x, y, w, h, pct, fill, label){
  ctx.fillStyle = 'rgba(148,163,184,.18)';
  roundRect(ctx, x, y, w, h, h / 2); ctx.fill();
  ctx.fillStyle = fill; ctx.shadowColor = fill; ctx.shadowBlur = 14;
  const fw = Math.max(h, w * Math.min(1, Math.max(0, pct)));
  roundRect(ctx, x, y, fw, h, h / 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#7d8db0'; ctx.font = '600 16px system-ui'; ctx.textAlign = 'left';
  ctx.fillText(label, x, y - 8);
}

function loadImg(url){
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
}

async function drawCardCanvas(){
  const W = 720, H = 1000;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');

  x.fillStyle = '#04060d'; x.fillRect(0, 0, W, H);
  const g = x.createRadialGradient(W / 2, 220, 40, W / 2, 220, 620);
  g.addColorStop(0, 'rgba(56,189,248,.16)');
  g.addColorStop(1, 'rgba(56,189,248,0)');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  const g2 = x.createRadialGradient(W / 2, H, 50, W / 2, H, 720);
  g2.addColorStop(0, 'rgba(251,191,36,.12)');
  g2.addColorStop(1, 'rgba(251,191,36,0)');
  x.fillStyle = g2; x.fillRect(0, 0, W, H);

  x.strokeStyle = 'rgba(56,189,248,.5)'; x.lineWidth = 2;
  roundRect(x, 26, 26, W - 52, H - 52, 20); x.stroke();
  x.strokeStyle = '#38bdf8'; x.lineWidth = 5;
  const L = 34;
  [[26, 26, 1, 1], [W - 26, 26, -1, 1], [26, H - 26, 1, -1], [W - 26, H - 26, -1, -1]].forEach(([cx, cy, dx, dy]) => {
    x.beginPath();
    x.moveTo(cx + dx * L, cy); x.lineTo(cx, cy); x.lineTo(cx, cy + dy * L);
    x.stroke();
  });

  x.textAlign = 'center';
  x.fillStyle = 'rgba(125,211,252,.8)'; x.font = '700 22px system-ui';
  x.fillText('L I F E   R P G', W / 2, 92);

  const { level, into, needed } = levelFromExp(state.exp);
  const rank = rankAtExp(state.exp);

  if(/^data:/.test(state.character.avatar)){
    try{
      const img = await loadImg(state.character.avatar);
      x.save();
      roundRect(x, W / 2 - 75, 125, 150, 150, 20);
      x.clip();
      x.drawImage(img, W / 2 - 75, 125, 150, 150);
      x.restore();
      x.strokeStyle = 'rgba(56,189,248,.7)'; x.lineWidth = 3;
      roundRect(x, W / 2 - 75, 125, 150, 150, 20); x.stroke();
    }catch(e){
      x.font = '130px system-ui';
      x.fillText('👤', W / 2, 285);
    }
  } else {
    x.font = '130px system-ui';
    x.fillText(state.character.avatar, W / 2, 285);
  }
  x.font = '800 52px system-ui'; x.fillStyle = '#e0f2fe';
  x.fillText(state.character.name.toUpperCase(), W / 2, 385);
  x.font = '600 24px system-ui'; x.fillStyle = '#7d8db0';
  x.fillText(titleForLevel(level), W / 2, 428);
  x.font = '800 88px system-ui'; x.fillStyle = '#7dd3fc';
  x.shadowColor = 'rgba(56,189,248,.9)'; x.shadowBlur = 28;
  x.fillText('LEVEL ' + level, W / 2, 540);
  x.shadowBlur = 0;
  x.font = '800 30px system-ui'; x.fillStyle = rankColor(rank);
  x.fillText(rank + ' RANK', W / 2, 595);
  const se = seasonInfo();
  x.font = '700 17px system-ui'; x.fillStyle = 'rgba(251,191,36,.85)';
  x.fillText('SEASON ' + se.num, W / 2, 628);
  const fsize = 14 + flameTier(state.streak) * 5;
  x.save();
  x.shadowColor = 'rgba(251,146,60,.9)'; x.shadowBlur = 20;
  x.fillStyle = 'rgba(249,115,22,.92)';
  x.beginPath(); x.ellipse(W - 118, 520, fsize * .6, fsize, 0, 0, Math.PI * 2); x.fill();
  x.restore();
  x.fillStyle = 'rgba(253,224,71,.95)';
  x.beginPath(); x.ellipse(W - 118, 526, fsize * .32, fsize * .5, 0, 0, Math.PI * 2); x.fill();
  x.font = '800 26px system-ui'; x.fillStyle = '#fbbf24';
  x.fillText(state.streak, W - 118, 468);
  x.font = '600 13px system-ui'; x.fillStyle = '#7d8db0';
  x.fillText('STREAK', W - 118, 585);

  cardBar(x, 80, 660, W - 160, 16, into / needed, 'rgba(56,189,248,.95)', 'EXP  ' + fmt(into) + ' / ' + fmt(needed));
  cardBar(x, 80, 730, W - 160, 16, state.hp / maxHp(), 'rgba(248,113,113,.95)', 'HP  ' + Math.round(state.hp) + ' / ' + maxHp());

  const statsCols = [
    { label:'QUESTS', val:fmt(state.totalQuests), col:'#7dd3fc' },
    { label:'GOLD EARNED', val:fmt(state.totalGold || state.gold), col:'#fbbf24' },
    { label:'BEST STREAK', val:(state.bestStreak || state.streak || 0) + 'd', col:'#f97316' },
    { label:'BOSS KILLS', val:state.bossKills || 0, col:'#f87171' },
  ];
  statsCols.forEach((st, i) => {
    const cx = 90 + i * 180;
    x.textAlign = 'center';
    x.font = '800 32px system-ui'; x.fillStyle = st.col;
    x.fillText(st.val, cx, 850);
    x.font = '700 13px system-ui'; x.fillStyle = '#7d8db0';
    x.fillText(st.label, cx, 880);
  });

  x.textAlign = 'center';
  x.font = '600 22px system-ui'; x.fillStyle = '#7d8db0';
  x.fillText(fmt(state.totalQuests) + ' quests    ' + state.badges.length + ' badges    ' + (state.bossKills || 0) + ' bosses', W / 2, 940);
  x.font = '400 17px system-ui'; x.fillStyle = 'rgba(125,141,176,.55)';
  x.fillText(new Date().toLocaleDateString(), W / 2, 972);

  return c;
}

function saveCardPng(){
  drawCardCanvas().then(c => {
    c.toBlob(blob => {
      if(!blob){ toast('Could not create the card image.'); return; }
      const url = URL.createObjectURL(blob);
      downloadUrl(url, 'life-rpg-card.png');
      setTimeout(() => URL.revokeObjectURL(url), 15000);
      toast('📸 Card saved — check your Downloads.');
    }, 'image/png');
  }).catch(() => toast('Could not create the card image.'));
}

async function shareCard(){
  try{
    const c = await drawCardCanvas();
    const blob = await new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(new Error('no blob')), 'image/png'));
    const file = new File([blob], 'life-rpg-card.png', { type:'image/png' });
    if(navigator.canShare && navigator.canShare({ files:[file] })){
      await navigator.share({ files:[file], title:'My Life RPG card' });
      return;
    }
  }catch(e){ /* fall through to download */ }
  saveCardPng();
}

/* ---------------- sound (WebAudio, no files needed) ---------------- */

let actx = null;

function ensureAudio(){
  if(!state || !state.settings || !state.settings.sound) return;
  try{
    if(!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if(actx.state === 'suspended') actx.resume();
  }catch(e){ /* no audio available */ }
}

function tone(freq, dur, { type='sine', gain=0.12, delay=0 } = {}){
  if(!actx || !state || !state.settings || !state.settings.sound) return;
  try{
    const t0 = actx.currentTime + delay;
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }catch(e){}
}

function buzz(p){ try{ if(navigator && navigator.vibrate) navigator.vibrate(p); }catch(e){} }
function sfxCheckIn(){ tone(660, .09, { gain:.1 }); tone(990, .12, { gain:.1, delay:.07 }); tone(1320, .1, { gain:.07, delay:.15, type:'triangle' }); buzz(30); }
function sfxLevelUp(){ [523, 659, 784, 1047, 1568].forEach((f, i) => tone(f, .24, { gain:.12, delay:i*.09, type:'triangle' })); buzz([70, 40, 100]); }
function sfxBadge(){ tone(1200, .15, { gain:.08, type:'triangle' }); buzz(25); }
function sfxRare(){ [784, 1047, 1568].forEach((f, i) => tone(f, .2, { gain:.1, delay:i*.07, type:'triangle' })); buzz(50); }
function sfxEpic(){ [523, 659, 784, 1047, 1318].forEach((f, i) => tone(f, .3, { gain:.09, delay:i*.08, type:'sawtooth' })); tone(2093, .5, { gain:.05, delay:.45 }); buzz([60, 50, 110]); }
function sfxChestOpen(){ tone(150, .12, { gain:.13, type:'square' }); tone(523, .25, { gain:.07, delay:.12 }); buzz(40); }

/* ---------------- tabs ---------------- */

function toggleViewMode(){
  const v = state.view;
  const vm = state.viewModes;
  if(!vm || vm[v] === undefined) return;
  vm[v] = vm[v] === 'list' ? (v === 'quests' ? 'path' : 'grid') : 'list';
  save(); renderAll();
}

function switchTab(tab){
  el('tabbar').querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('#sidebar .sb-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  ['character','quests','crates','log','shop','settings'].forEach(v =>
    el('view-' + v).classList.toggle('hidden', v !== tab));
  state.view = tab;
  if(window.innerWidth < 900) document.body.classList.remove('sb-open');
  renderAll();
}

/* ---------------- first run ---------------- */

function renderFrAvatars(){
  const prev = el('frAvatarPrev');
  if(prev) prev.innerHTML = /^data:/.test(pickedAvatar) ? `<img src="${pickedAvatar}" alt="">` : esc(pickedAvatar);
}

function setupFirstRun(){
  const box = el('frAvatars');
  box.innerHTML = AVATARS.map(a =>
    `<button type="button" data-a="${a}" class="${a === pickedAvatar ? 'sel' : ''}">${a}</button>`).join('');
  box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    pickedAvatar = b.dataset.a;
    box.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b));
    renderFrAvatars();
  }));
  const upb = el('frUploadBtn');
  if(upb) upb.addEventListener('click', () => el('frAvatarFile').click());
  const upf = el('frAvatarFile');
  if(upf) upf.addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    pickAvatarImage(f, img => { upf.value = ''; pickedAvatar = img; renderFrAvatars(); },
      () => { upf.value = ''; });
  });
  renderFrAvatars();

  el('frStart').addEventListener('click', startGame);
  el('frName').addEventListener('keydown', e => { if(e.key === 'Enter') startGame(); });
}

function startGame(){
  const name = el('frName').value.trim();
  state = defaultState();
  state.character = { name: name || 'Player', avatar: pickedAvatar };
  crateReset();
  save();
  el('firstRun').classList.add('hidden');
  el('app').classList.remove('hidden');
  renderAll();
  ensureAudio();
  sfxLevelUp();
  toast('The System has chosen you. Daily quests are ready.');
  maybeBlessing(2500);
}

/* ---------------- init ---------------- */

function init(){
  state = load();
  if(!state){
    show(el('firstRun'));
    setupFirstRun();
  } else {
    rollover();
    crateReset();
    seasonTick();
    save();
    el('app').classList.remove('hidden');
    renderAll();
    maybeBlessing(1500);
    setTimeout(() => toast('THE SYSTEM: ' + systemGreeting()), 1100);
    const remD = state.quests.filter(q => q.freq === 'daily' && q.timesDone < q.dailyLimit).length;
    if(new Date().getHours() >= 18 && remD) setTimeout(() => toast('The fire is still burning — ' + remD + ' check-in' + (remD > 1 ? 's' : '') + ' left to keep it alive.'), 3400);
  }

  el('tabbar').querySelectorAll('.tab').forEach(t =>
    t.addEventListener('click', () => switchTab(t.dataset.tab)));
  document.querySelectorAll('#sidebar .sb-tab').forEach(t =>
    t.addEventListener('click', () => switchTab(t.dataset.tab)));
  const mb = el('menuBtn');
  if(mb) mb.addEventListener('click', () => document.body.classList.toggle('sb-open'));
  const vtb = el('viewToggleBtn');
  if(vtb) vtb.addEventListener('click', toggleViewMode);
  const bd = el('sbBackdrop');
  if(bd) bd.addEventListener('click', () => document.body.classList.remove('sb-open'));
  if(window.matchMedia && window.matchMedia('(min-width:900px)').matches) document.body.classList.add('sb-open');
  applyTheme();
  const chOk = el('chestOk');
  if(chOk) chOk.addEventListener('click', () => hide(el('chestModal')));
  const chX = el('chestClose');
  if(chX) chX.addEventListener('click', () => hide(el('chestModal')));
  el('chestModal').addEventListener('click', e => { if(e.target === el('chestModal')) hide(el('chestModal')); });

  el('tbRules').addEventListener('click', openRulesBook);
  el('rulesClose').addEventListener('click', () => hide(el('rulesModal')));
  el('rulesModal').addEventListener('click', e => { if(e.target === el('rulesModal')) hide(el('rulesModal')); });
  el('blessingClaim').addEventListener('click', () => {
    const amt = 10 + (state.streak || 0) * 2;
    state.gold += amt; state.totalGold += amt;
    state.lastBlessingDay = todayStr();
    save(); hide(el('blessingModal')); renderAll();
    sfxBadge(); toast('🎁 Blessing claimed: +' + amt + ' ◈. See you tomorrow, ' + state.character.name + '.');
  });

  document.querySelectorAll('.cat-pill').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      el('qmCat').value = p.dataset.cat;
    });
  });
  el('qmClose').addEventListener('click', () => hide(el('questModal')));
  el('qmSave').addEventListener('click', saveQuest);
  el('qmDelete').addEventListener('click', deleteQuest);
  el('rmClose').addEventListener('click', () => hide(el('rewardModal')));
  el('rmSave').addEventListener('click', saveReward);
  el('rmDelete').addEventListener('click', deleteReward);
  el('bmClose').addEventListener('click', () => hide(el('bossModal')));
  el('bmSave').addEventListener('click', () => {
    state.bossCustomName = el('bmName').value.trim();
    save(); renderAll(); hide(el('bossModal'));
    toast(state.bossCustomName ? 'Boss task set.' : 'Boss set to auto mode.');
  });
  el('questModal').addEventListener('click', e => { if(e.target === el('questModal')) hide(el('questModal')); });
  el('rewardModal').addEventListener('click', e => { if(e.target === el('rewardModal')) hide(el('rewardModal')); });
  el('bossModal').addEventListener('click', e => { if(e.target === el('bossModal')) hide(el('bossModal')); });

  document.addEventListener('pointerdown', ensureAudio);
  document.addEventListener('visibilitychange', () => {
    if(!document.hidden && state){ rollover(); renderAll(); }
  });

  if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js?v=64', { updateViaCache: 'none' }).then(reg => {
        reg.update();
        reg.onupdatefound = () => {
          const inst = reg.installing;
          if(inst){
            inst.onstatechange = () => {
              if(inst.state === 'installed' && navigator.serviceWorker.controller){
                window.location.reload();
              }
            };
          }
        };
      }).catch(() => {});
    });
  }
}


/* crash guard: the game can never be stuck on a black screen again */
function crashScreen(msg){
  try{
    if(document.getElementById('crashScreen')) return;
    const n = document.createElement('div');
    n.className = 'overlay';
    n.id = 'crashScreen';
    n.innerHTML = '<div class="sys-window" style="max-width:440px;width:100%">' +
      '<div class="win-bar"><span class="win-title">System Error</span></div>' +
      '<div class="win-body">' +
      '<p style="font-size:14px;line-height:1.6">The System hit a wall. Pick one:</p>' +
      '<p style="font-size:11px;color:var(--muted);margin:10px 0;word-break:break-all">' + String(msg || 'unknown').replace(/</g, '&lt;').slice(0, 300) + '</p>' +
      '<div class="btnrow">' +
      '<button class="btn primary" id="crashReload">↺ Try again</button>' +
      '<button class="btn danger" id="crashReset">Reset game (fresh start)</button>' +
      '</div></div></div>';
    document.body.appendChild(n);
    document.getElementById('crashReload').addEventListener('click', () => location.reload());
    document.getElementById('crashReset').addEventListener('click', () => {
      try{ localStorage.removeItem(KEY); }catch(e){}
      location.reload();
    });
  }catch(e2){}
}

window.addEventListener('error', e => crashScreen(e.message));
try{ init(); }catch(e){ crashScreen(e && e.message); }
