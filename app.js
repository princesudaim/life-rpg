/* =========================================================
   LIFE RPG v2 — your life, your rules.
   Solo Leveling-inspired life gamification.
   Daily / weekly / monthly quests · weekly boss · stats & classes
   random System quests · shareable card · monthly reports
   cloud sync (Supabase) · every rule editable in Settings
   ========================================================= */

const KEY = 'liferpg_v1';

const AVATARS = ['⚔️','🛡️','🗡️','','🔥','️','⚡','','👁️','💀','🦅','🐺'];

const CLASSES = {
  warrior:   { name:'Warrior',   icon:'⚔️', stat:'STR', desc:'+25% EXP from Body quests' },
  mage:      { name:'Mage',      icon:'🔮', stat:'INT', desc:'+25% EXP from Mind quests' },
  guardian:  { name:'Guardian',  icon:'🛡️', stat:'VIT', desc:'+25% EXP from Discipline quests' },
  trickster: { name:'Trickster', icon:'🃏', stat:'CHA', desc:'+25% EXP from Social quests' },
};
const CAT_STAT = { Body:'STR', Mind:'INT', Discipline:'VIT', Social:'CHA' };
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
  { id:'stat100',  icon:'🧬', name:'Awakened',     desc:'Reach 100 total stat points', test:s=>(s.stats.STR+s.stats.INT+s.stats.VIT+s.stats.CHA)>=100 },
];

const DEFAULT_SETTINGS = {
  sound:true,
  expBase:100, expGrowth:1.35,
  rankD:5, rankC:10, rankB:15, rankA:20, rankS:30,
  hpPenalty:20, hpHeal:2, maxHp:100,
  perfectDayGold:25, perfectWeekGold:75, perfectMonthGold:150,
  bossExp:500, bossGold:100, bossPhases:3, bossKillBonus:50,
  randomQuests:true,
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
    streak:0, lastQuestDay:null,
    perfect:{},
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
  if(!s.class) s.class = 'warrior';
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

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return null;
    return migrate(JSON.parse(raw));
  }catch(e){ return null; }
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
  return Math.round(state.settings.expBase * Math.pow(level, state.settings.expGrowth));
}
function levelFromExp(total){
  let level = 1, rem = total;
  while(rem >= expNeededFor(level)){ rem -= expNeededFor(level); level++; }
  return { level, into:rem, needed:expNeededFor(level) };
}
function rankForLevel(l){
  const s = state.settings;
  if(l >= s.rankS) return 'S';
  if(l >= s.rankA) return 'A';
  if(l >= s.rankB) return 'B';
  if(l >= s.rankC) return 'C';
  if(l >= s.rankD) return 'D';
  return 'E';
}
function titleForLevel(l){
  if(l >= 30) return 'Shadow Monarch';
  if(l >= 20) return 'National-Level Hunter';
  if(l >= 15) return 'Elite Hunter';
  if(l >= 10) return 'Rising Hunter';
  if(l >= 5)  return 'The Awakened';
  return 'Novice';
}
function maxHp(){ return state.settings.maxHp + (levelFromExp(state.exp).level - 1) * 5; }
function statPoints(exp){ return Math.max(1, Math.round(exp / 50)); }

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
      if(state.streak > 1) toast('💤 Streak broken. The System deducts ' + state.settings.hpPenalty + ' HP.');
      state.streak = 0;
      state.hp = Math.max(0, state.hp - state.settings.hpPenalty);
    }
    state.day = t;
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
  state.lastQuestDay = t;
}

/* ---------------- core reward engine ---------------- */

function applyReward({ exp, gold = 0, name, icon, statKey = null, ev = null }){
  const before = levelFromExp(state.exp);
  const prevRank = rankForLevel(before.level);

  state.exp += exp;
  state.gold += gold;
  state.totalGold += gold;
  state.totalQuests++;
  if(statKey) state.stats[statKey] += statPoints(exp);
  state.hp = Math.min(maxHp(), state.hp + state.settings.hpHeal);
  state.log.unshift({ ts:Date.now(), name, icon:icon || '⭐', exp, gold });
  state.log = state.log.slice(0, 500);
  touchStreak();

  const after = levelFromExp(state.exp);
  const newRank = rankForLevel(after.level);

  save();
  renderAll();

  if(ev){
    floatText('+' + exp + ' EXP', ev.clientX, ev.clientY);
    if(gold > 0) floatText('+' + gold + ' ◈', ev.clientX, ev.clientY + 24, true);
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
  let exp = q.exp;
  const cat = statForCategory(q.category);
  const cls = CLASSES[state.class];
  if(cls && cat && cls.stat === cat) exp = Math.round(q.exp * 1.25);
  applyReward({ exp, gold:q.gold, name:q.name, icon:q.icon, statKey:cat, ev });
  checkPerfects(q.freq);
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
  if(ev) floatText('-' + r.cost + ' ◈', ev.clientX, ev.clientY, true);
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
  renderLog();
  renderShop();
  renderSettings();
}

function renderTopbar(){
  const { level } = levelFromExp(state.exp);
  el('tbLevel').textContent = `Lv ${level} · ${rankForLevel(level)}`;
  el('tbGold').textContent = `◈ ${fmt(state.gold)}`;
  el('tbStreak').textContent = `🔥 ${state.streak}`;
}

function renderCharacter(){
  const { level, into, needed } = levelFromExp(state.exp);
  const rank = rankForLevel(level);
  const cls = CLASSES[state.class] || CLASSES.warrior;
  const mh = maxHp();
  const expPct = Math.min(100, Math.round(into / needed * 100));
  const hpPct = Math.max(0, Math.min(100, Math.round(state.hp / mh * 100)));
  const badges = BADGES.filter(b => state.badges.includes(b.id))
    .map(b => `<div class="badge" title="${esc(b.desc)}">${b.icon}<span>${esc(b.name)}</span></div>`).join('');
  el('view-character').innerHTML = `
    <div class="sys-window player-card">
      <div class="win-bar"><span class="win-title">Player</span><span class="rank-chip rank-${rank}">${rank} RANK</span></div>
      <div class="win-body">
        <div class="p-row">
          <div class="p-avatar">${esc(state.character.avatar)}</div>
          <div style="flex:1;min-width:0">
            <div class="p-name">${esc(state.character.name)}</div>
            <div class="p-title">${esc(titleForLevel(level))} · ${cls.icon} ${cls.name}</div>
            <div class="p-level">LEVEL<b>${level}</b></div>
          </div>
        </div>
        <div class="bar-block">
          <div class="bar-label"><span>Experience</span><span>${fmt(into)} / ${fmt(needed)}</span></div>
          <div class="bar"><i style="width:${expPct}%"></i></div>
        </div>
        <div class="bar-block">
          <div class="bar-label"><span>HP</span><span>${Math.round(state.hp)} / ${mh}</span></div>
          <div class="bar hp"><i style="width:${hpPct}%"></i></div>
        </div>
        <div class="stat-line">
          <span class="st-str">STR ${state.stats.STR}</span>
          <span class="st-int">INT ${state.stats.INT}</span>
          <span class="st-vit">VIT ${state.stats.VIT}</span>
          <span class="st-cha">CHA ${state.stats.CHA}</span>
          <span class="st-gold">◈ ${fmt(state.gold)}</span>
        </div>
        <div class="share-row">
          <button class="btn" id="shareCardBtn">📸 Share</button>
          <button class="btn" id="saveCardBtn">⬇ Save</button>
          <button class="btn" id="reportBtn">📊 Report</button>
        </div>
        <div class="p-foot">⭐ ${fmt(state.totalQuests)} quests &nbsp;·&nbsp; 🏅 ${state.badges.length} badges &nbsp;·&nbsp; 🐉 ${state.bossKills || 0} bosses &nbsp;·&nbsp; since ${new Date(state.created).toLocaleDateString()}</div>
        ${badges ? `<div class="badges">${badges}</div>` : ''}
        <div class="p-quote">"Only you level up." — The System</div>
      </div>
    </div>`;
  el('shareCardBtn').addEventListener('click', shareCard);
  el('saveCardBtn').addEventListener('click', saveCardPng);
  el('reportBtn').addEventListener('click', () => showReport(monthStrNow(), 'This Month So Far'));
}

function questCard(q){
  const done = q.timesDone >= q.dailyLimit;
  return `
  <div class="quest ${done ? 'is-done' : ''}">
    <div class="q-icon">${esc(q.icon || '⭐')}</div>
    <div class="q-meta" data-q="${q.id}">
      <div class="q-name">${esc(q.name)}</div>
      <div class="q-sub">+${q.exp} EXP · +${q.gold} ◈${q.dailyLimit > 1 ? ' · ' + q.timesDone + '/' + q.dailyLimit : ''}</div>
    </div>
    <button class="check-btn" data-q="${q.id}" ${done ? 'disabled' : ''}>${done ? '✓' : 'Check In'}</button>
  </div>`;
}

function questGroup(freq, label){
  const group = state.quests.filter(q => q.freq === freq);
  const done = group.filter(q => q.timesDone >= q.dailyLimit).length;
  const body = group.length
    ? group.map(questCard).join('')
    : `<div class="empty small">No ${label.toLowerCase()} quests yet — tap "+ New".</div>`;
  return `<div class="group-head"><span>${label}</span><span class="g-count">${done}/${group.length}</span></div>${body}`;
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

function renderQuests(){
  el('view-quests').innerHTML = `
    ${bossCard()}
    ${systemCard()}
    <div class="sys-window">
      <div class="win-bar"><span class="win-title">Quest Board</span>
        <button class="mini-btn" id="addQuestBtn">+ New</button></div>
      <div class="win-body">
        ${questGroup('daily', 'Daily')}
        ${questGroup('weekly', 'Weekly')}
        ${questGroup('monthly', 'Monthly')}
        <p class="board-hint">tap a quest to edit it</p>
      </div>
    </div>`;

  document.querySelectorAll('.check-btn').forEach(b =>
    b.addEventListener('click', e => checkIn(b.dataset.q, e)));
  document.querySelectorAll('.q-meta[data-q]').forEach(m =>
    m.addEventListener('click', () => openQuestEditor(m.dataset.q)));
  el('addQuestBtn').addEventListener('click', () => openQuestEditor(null));
  el('bossHitBtn').addEventListener('click', e => bossHit(e));
  el('bossEditBtn').addEventListener('click', () => openBossEditor());
  const sh = el('sysHitBtn');
  if(sh) sh.addEventListener('click', e => systemHit(e));
  const si = el('sysIgnoreBtn');
  if(si) si.addEventListener('click', systemIgnore);
}

function renderLog(){
  const items = state.log.slice(0, 60).map(l => {
    const d = new Date(l.ts);
    const when = d.toLocaleDateString(undefined, { month:'short', day:'numeric' }) +
      ' · ' + d.toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' });
    return `<div class="log-entry"><span class="le-icon">${esc(l.icon || '⭐')}</span>
      <div><div class="le-name">${esc(l.name)}</div><div class="log-date">${when}</div></div>
      <span class="le-exp">+${l.exp} EXP</span></div>`;
  }).join('') || '<div class="empty">No deeds recorded yet. Go complete something, Player.</div>';
  el('view-log').innerHTML = `
    <div class="sys-window">
      <div class="win-bar"><span class="win-title">Activity Log</span><span class="win-sub">${state.log.length} deeds</span></div>
      <div class="win-body" style="padding-top:6px">${items}</div>
    </div>`;
}

function renderShop(){
  const items = state.rewards.map(r => `
    <div class="reward">
      <div class="r-icon">${esc(r.icon || '🎁')}</div>
      <div class="q-meta" data-r="${r.id}">
        <div class="q-name">${esc(r.name)}</div>
        <div class="q-sub"><span>cost ${r.cost} ◈</span></div>
      </div>
      <button class="buy-btn" data-r="${r.id}" ${state.gold < r.cost ? 'disabled' : ''}>
        ${state.gold >= r.cost ? 'Redeem' : 'Need ' + r.cost + ' ◈'}
      </button>
    </div>`).join('') || '<div class="empty">No rewards yet. Add one — what do you allow yourself to earn?</div>';

  const bought = state.bought.slice(0, 20).map(b => {
    const d = new Date(b.ts);
    return `<div class="log-entry"><span class="le-icon">${esc(b.icon || '🎁')}</span>
      <div class="le-name">${esc(b.name)}</div>
      <div class="log-date">${d.toLocaleDateString()}</div></div>`;
  }).join('') || '<div class="empty">Nothing redeemed yet. Earn gold, then claim what you deserve.</div>';

  el('view-shop').innerHTML = `
    <div class="sys-window">
      <div class="win-bar"><span class="win-title">Reward Market</span>
        <button class="mini-btn" id="addRewardBtn">+ New</button></div>
      <div class="win-body">
        <div class="gold-note">Your gold: <b>${fmt(state.gold)} ◈</b> — earn it from quests, spend it on REAL rewards.</div>
        ${items}
      </div>
    </div>
    <div class="sys-window" style="margin-top:14px">
      <div class="win-bar"><span class="win-title">Redeemed</span></div>
      <div class="win-body" style="padding-top:6px">${bought}</div>
    </div>`;

  document.querySelectorAll('.buy-btn').forEach(b =>
    b.addEventListener('click', e => buyReward(b.dataset.r, e)));
  document.querySelectorAll('.q-meta[data-r]').forEach(m =>
    m.addEventListener('click', () => openRewardEditor(m.dataset.r)));
  el('addRewardBtn').addEventListener('click', () => openRewardEditor(null));
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

      <div class="set-sec">
        <div class="set-title">Character</div>
        <label class="field"><span>PLAYER NAME</span>
          <input id="setName" maxlength="24" value="${esc(state.character.name)}" autocomplete="off">
        </label>
        <div class="row2">
          <label class="field"><span>AVATAR</span>
            <input id="setAvatar" maxlength="4" value="${esc(state.character.avatar)}" autocomplete="off">
          </label>
          <label class="field"><span>CLASS</span>
            <select id="setClass">${Object.entries(CLASSES).map(([k, c]) =>
              `<option value="${k}" ${state.class === k ? 'selected' : ''}>${c.icon} ${c.name}</option>`).join('')}
            </select>
          </label>
        </div>
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
            `<label class="field"><span>${k.slice(4)} RANK</span><input type="number" min="1" data-set="${k}" value="${s[k]}"></label>`).join('')}
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

      <div class=""checkbox" id="setRandom" data-set="randomQuests" ${s.randomQuests ? 'checked' : ''}><i></i></label><b></b>
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
          <b>No files need updating</b> — the app talks to it by itself.</p>
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
    });
  });

  el('saveChar').addEventListener('click', () => {
    state.character.name = el('setName').value.trim() || 'Player';
    state.character.avatar = el('setAvatar').value.trim() || '👁️';
    state.class = el('setClass').value;
    save(); renderAll(); toast('Character updated.');
  });

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

/* ---------------- modals ---------------- */

function openQuestEditor(id){
  editingQuest = id;
  const q = id ? state.quests.find(x => x.id === id) : null;
  el('qmTitle').textContent = q ? 'EDIT QUEST' : 'NEW QUEST';
  el('qmName').value = q ? q.name : '';
  el('qmIcon').value = q ? (q.icon || '') : '';
  el('qmCat').value = q ? (q.category || 'Other') : 'Body';
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
      state = migrate(d);
      save();
      location.reload();
    }catch(e){ toast('Import failed — not a valid backup file.'); }
  };
  fr.readAsText(file);
}

/* ---------------- cloud sync (Supabase REST) ---------------- */

function syncHeaders(){
  const s = state.settings.sync;
  return { 'Content-Type':'application/json', 'apikey':s.key, 'Authorization':'Bearer ' + s.key };
}

async function syncPush(silent){
  const s = state.settings.sync;
  if(!s.url || !s.key){ if(!silent) toast('Enter your Supabase URL and key first.'); return; }
  try{
    const res = await fetch(s.url.replace(/\/+$/, '') + '/rest/v1/saves', {
      method:'POST',
      headers: Object.assign({}, syncHeaders(), { 'Prefer':'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ id:s.playerId, data:state, updated_at:new Date().toISOString() }),
    });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    s.lastPush = new Date().toISOString();
    save();
    if(!silent){ toast('☁️ Save pushed to cloud.'); renderSettings(); }
  }catch(err){
    if(!silent) toast('☁️ Push failed: ' + err.message);
  }
}

async function syncPull(){
  const s = state.settings.sync;
  if(!s.url || !s.key){ toast('Enter your Supabase URL and key first.'); return; }
  try{
    const res = await fetch(s.url.replace(/\/+$/, '') + '/rest/v1/saves?id=eq.' + encodeURIComponent(s.playerId), {
      headers: syncHeaders(),
    });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const rows = await res.json();
    if(!rows.length){ toast('No cloud save found yet.'); return; }
    if(!confirm('Replace your current save with the cloud save?')) return;
    state = migrate(rows[0].data);
    s.lastPull = new Date().toISOString();
    save();
    location.reload();
  }catch(err){
    toast('☁️ Pull failed: ' + err.message);
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

function floatText(txt, x, y, gold = false){
  const d = document.createElement('div');
  d.className = 'float-exp' + (gold ? ' gold' : '');
  d.textContent = txt;
  d.style.left = Math.max(8, (x || innerWidth / 2) - 20 + (Math.random() * 40 - 20)) + 'px';
  d.style.top = (y || innerHeight / 2) - 30 + 'px';
  el('fxLayer').appendChild(d);
  setTimeout(() => d.remove(), 1200);
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

function drawCardCanvas(){
  const W = 720, H = 1000;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');

  x.fillStyle = '#04060d'; x.fillRect(0, 0, W, H);
  const g = x.createRadialGradient(W / 2, 220, 40, W / 2, 220, 620);
  g.addColorStop(0, 'rgba(56,189,248,.16)');
  g.addColorStop(1, 'rgba(56,189,248,0)');
  x.fillStyle = g; x.fillRect(0, 0, W, H);

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
  const rank = rankForLevel(level);
  const cls = CLASSES[state.class] || CLASSES.warrior;

  x.font = '130px system-ui';
  x.fillText(state.character.avatar, W / 2, 285);
  x.font = '800 52px system-ui'; x.fillStyle = '#e0f2fe';
  x.fillText(state.character.name.toUpperCase(), W / 2, 385);
  x.font = '600 24px system-ui'; x.fillStyle = '#7d8db0';
  x.fillText(cls.icon + ' ' + cls.name + '  ·  ' + titleForLevel(level), W / 2, 428);
  x.font = '800 88px system-ui'; x.fillStyle = '#7dd3fc';
  x.shadowColor = 'rgba(56,189,248,.9)'; x.shadowBlur = 28;
  x.fillText('LEVEL ' + level, W / 2, 540);
  x.shadowBlur = 0;
  x.font = '800 30px system-ui'; x.fillStyle = rankColor(rank);
  x.fillText(rank + ' RANK', W / 2, 595);

  cardBar(x, 80, 660, W - 160, 16, into / needed, 'rgba(56,189,248,.95)', 'EXP  ' + fmt(into) + ' / ' + fmt(needed));
  cardBar(x, 80, 730, W - 160, 16, state.hp / maxHp(), 'rgba(248,113,113,.95)', 'HP  ' + Math.round(state.hp) + ' / ' + maxHp());

  const keys = ['STR', 'INT', 'VIT', 'CHA'];
  const colors = { STR:'#f87171', INT:'#7dd3fc', VIT:'#34d399', CHA:'#fbbf24' };
  keys.forEach((k, i) => {
    const cx = 110 + i * 180;
    x.textAlign = 'center';
    x.font = '800 34px system-ui'; x.fillStyle = colors[k];
    x.fillText(state.stats[k], cx, 850);
    x.font = '600 17px system-ui'; x.fillStyle = '#7d8db0';
    x.fillText(k, cx, 880);
  });

  x.textAlign = 'center';
  x.font = '600 22px system-ui'; x.fillStyle = '#7d8db0';
  x.fillText('🔥 ' + state.streak + ' streak    ⭐ ' + fmt(state.totalQuests) + ' quests    🏅 ' +
    state.badges.length + ' badges    🐉 ' + (state.bossKills || 0) + ' bosses', W / 2, 940);
  x.font = '400 17px system-ui'; x.fillStyle = 'rgba(125,141,176,.55)';
  x.fillText(new Date().toLocaleDateString(), W / 2, 972);

  return c;
}

function saveCardPng(){
  try{
    const c = drawCardCanvas();
    c.toBlob(blob => {
      if(!blob){ toast('Could not create the card image.'); return; }
      const url = URL.createObjectURL(blob);
      downloadUrl(url, 'life-rpg-card.png');
      setTimeout(() => URL.revokeObjectURL(url), 15000);
      toast('📸 Card saved — check your Downloads.');
    }, 'image/png');
  }catch(e){ toast('Could not create the card image.'); }
}

async function shareCard(){
  try{
    const c = drawCardCanvas();
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

function sfxCheckIn(){ tone(660, .09, { gain:.1 }); tone(990, .12, { gain:.1, delay:.07 }); }
function sfxLevelUp(){ [523, 659, 784, 1047].forEach((f, i) => tone(f, .22, { gain:.12, delay:i*.09, type:'triangle' })); }
function sfxBadge(){ tone(1200, .15, { gain:.08, type:'triangle' }); }

/* ---------------- tabs ---------------- */

function switchTab(tab){
  el('tabbar').querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  ['character','quests','log','shop','settings'].forEach(v =>
    el('view-' + v).classList.toggle('hidden', v !== tab));
  renderAll();
}

/* ---------------- first run ---------------- */

function setupFirstRun(){
  const box = el('frAvatars');
  box.innerHTML = AVATARS.map(a =>
    `<button type="button" data-a="${a}" class="${a === pickedAvatar ? 'sel' : ''}">${a}</button>`).join('');
  box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    pickedAvatar = b.dataset.a;
    box.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b));
  }));

  const cx = el('frClasses');
  cx.innerHTML = Object.entries(CLASSES).map(([k, c]) =>
    `<button type="button" data-c="${k}" class="class-card ${k === pickedClass ? 'sel' : ''}">
      <span class="cc-icon">${c.icon}</span><span class="cc-name">${c.name}</span>
      <span class="cc-desc">${c.desc}</span></button>`).join('');
  cx.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    pickedClass = b.dataset.c;
    cx.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b));
  }));

  el('frStart').addEventListener('click', startGame);
  el('frName').addEventListener('keydown', e => { if(e.key === 'Enter') startGame(); });
}

function startGame(){
  const name = el('frName').value.trim();
  state = defaultState();
  state.character = { name: name || 'Player', avatar: pickedAvatar };
  state.class = pickedClass;
  save();
  el('firstRun').classList.add('hidden');
  el('app').classList.remove('hidden');
  renderAll();
  ensureAudio();
  sfxLevelUp();
  toast('The System has chosen you. Daily quests are ready.');
}

/* ---------------- init ---------------- */

function init(){
  const loaded = load();
  if(!loaded){
    show(el('firstRun'));
    setupFirstRun();
  } else {
    rollover();
    save();
    el('app').classList.remove('hidden');
    renderAll();
  }

  el('tabbar').querySelectorAll('.tab').forEach(t =>
    t.addEventListener('click', () => switchTab(t.dataset.tab)));

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
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
}

init();
