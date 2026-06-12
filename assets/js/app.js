// app.js — Les Vacances de Maya et Aaron (Phase 1)
// Navigation : Accueil → Enfant → Matière → Rubrique → Contenu

'use strict';

const State = {
  content: null,
  child: null,        // 'maya' | 'aaron'
  matiere: null,      // objet matière
  rubrique: null,     // 'revision' | 'preparation' | 'etude'
  corr: {},           // visibilité corrections
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('./data/content.json');
    State.content = await res.json();
  } catch (e) {
    console.error('[App] chargement contenu échoué:', e);
    const t = document.querySelector('.loader-title');
    if (t) t.textContent = '⚠️ Erreur de chargement. Vérifie ta connexion.';
    return;
  }

  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.add('hidden');
  }, 700);

  renderHome();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.screen;
      if (target === 'maya' || target === 'aaron') showMatieres(target);
      else if (target === 'progress') { renderProgress(); showScreen('progress'); setNav('progress'); }
      else { renderHome(); }
    });
  });

  if ('serviceWorker' in navigator) {
    try { await navigator.serviceWorker.register('./sw.js', { scope: './' }); }
    catch (e) { console.warn('[SW] échec:', e); }
  }
});

// ---------- Helpers ----------
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const t = document.getElementById('screen-' + id);
  if (t) t.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function setNav(screen) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.screen === screen));
}
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ---------- Accueil ----------
function renderHome() {
  const maya = State.content.enfants.maya;
  const aaron = State.content.enfants.aaron;

  const totalRub = (c) => c.matieres.length * 3;
  const mayaTotal = totalRub(maya), aaronTotal = totalRub(aaron);
  const mayaDone = Progress.countDone('maya'), aaronDone = Progress.countDone('aaron');
  const mayaPct = mayaTotal ? Math.round(mayaDone / mayaTotal * 100) : 0;
  const aaronPct = aaronTotal ? Math.round(aaronDone / aaronTotal * 100) : 0;

  document.getElementById('screen-home').innerHTML = `
    <div class="home-hero">
      <span class="hero-emojis">🦋🚀</span>
      <h1 class="hero-title">Les Vacances de<br><span class="highlight-maya">Maya</span> et <span class="highlight-aaron">Aaron</span> !</h1>
      <p class="hero-subtitle">✨ Le cahier de vacances magique ✨</p>
    </div>
    <div class="children-cards">
      <button class="child-card maya" onclick="showMatieres('maya')">
        <span class="child-card-emoji">🦋</span>
        <div class="child-card-name">Maya</div>
        <div class="child-card-level">${esc(maya.niveau)}</div>
        <div class="child-progress-bar"><div class="child-progress-fill" style="width:${mayaPct}%"></div></div>
        <div style="font-size:0.7rem;color:var(--maya-primary);font-weight:700;margin-top:0.25rem;">${mayaDone}/${mayaTotal} étapes</div>
      </button>
      <button class="child-card aaron" onclick="showMatieres('aaron')">
        <span class="child-card-emoji">🚀</span>
        <div class="child-card-name">Aaron</div>
        <div class="child-card-level">${esc(aaron.niveau)}</div>
        <div class="child-progress-bar"><div class="child-progress-fill" style="width:${aaronPct}%"></div></div>
        <div style="font-size:0.7rem;color:var(--aaron-primary);font-weight:700;margin-top:0.25rem;">${aaronDone}/${aaronTotal} étapes</div>
      </button>
    </div>
    <div class="home-stats">
      <div class="stat-card"><div class="stat-number">${mayaDone + aaronDone}</div><div class="stat-label">Étapes ✅</div></div>
      <div class="stat-card"><div class="stat-number">${mayaDone + aaronDone} ⭐</div><div class="stat-label">Étoiles</div></div>
      <div class="stat-card"><div class="stat-number">${mayaTotal + aaronTotal}</div><div class="stat-label">Étapes total</div></div>
    </div>
    <div style="text-align:center;padding:0.5rem 1rem 2rem;color:var(--text-light);font-size:0.8rem;">
      💡 Chaque matière a 3 étapes : 🔄 Révision · 🌉 Préparation · 🚀 Étude
    </div>`;
  showScreen('home');
  setNav('home');
}

// ---------- Niveau 2 : Matières ----------
function showMatieres(child) {
  State.child = child;
  const data = State.content.enfants[child];

  const cards = data.matieres.map(mat => {
    const r = Progress.isDone(child, mat.id, 'revision');
    const p = Progress.isDone(child, mat.id, 'preparation');
    const e = Progress.isDone(child, mat.id, 'etude');
    return `
      <button class="matiere-card ${child}" onclick="showRubriques('${mat.id}')">
        <div class="matiere-emoji-wrap">${mat.emoji}</div>
        <div class="matiere-info">
          <div class="matiere-nom">${esc(mat.nom)}</div>
          <div class="matiere-meta">3 étapes : révision · préparation · étude</div>
          <div class="matiere-mini-progress">
            <span class="mini-dot rev ${r?'done':''}"></span>
            <span class="mini-dot prep ${p?'done':''}"></span>
            <span class="mini-dot etude ${e?'done':''}"></span>
          </div>
        </div>
        <div class="matiere-arrow">›</div>
      </button>`;
  }).join('');

  document.getElementById('screen-child').innerHTML = `
    <div class="child-header ${child}">
      <button class="back-btn" onclick="renderHome()">←</button>
      <div class="child-header-title ${child}">${data.emoji} ${esc(data.nom)}</div>
      <div class="child-header-subtitle">${esc(data.niveau)} · ${esc(data.age)}</div>
    </div>
    <div class="matieres-grid">
      <p class="intro-hint">Choisis une matière 👇</p>
      ${cards}
    </div>`;
  showScreen('child');
  setNav(child);
}

// ---------- Niveau 3 : Rubriques ----------
function showRubriques(matiereId) {
  const child = State.child;
  const data = State.content.enfants[child];
  const mat = data.matieres.find(m => m.id === matiereId);
  if (!mat) return;
  State.matiere = mat;

  const rubriquesMeta = State.content.rubriques;
  const order = ['revision', 'preparation', 'etude'];

  const cards = order.map(key => {
    const meta = rubriquesMeta[key];
    const done = Progress.isDone(child, mat.id, key);
    return `
      <button class="rubrique-card ${key}" onclick="showRubriqueContent('${key}')">
        <div class="rubrique-emoji">${meta.emoji}</div>
        <div class="rubrique-text">
          <div class="rubrique-label">${meta.label}</div>
          <div class="rubrique-desc">${esc(meta.desc)}</div>
        </div>
        <div class="rubrique-status">${done ? '✅' : '▶️'}</div>
      </button>`;
  }).join('');

  document.getElementById('screen-rubriques').innerHTML = `
    <div class="child-header ${child}">
      <button class="back-btn" onclick="showMatieres('${child}')">←</button>
      <div class="breadcrumb">${data.emoji} ${esc(data.nom)} › ${esc(mat.nom)}</div>
      <div class="child-header-title ${child}">${mat.emoji} ${esc(mat.nom)}</div>
      <div class="child-header-subtitle">Choisis ton étape de travail</div>
    </div>
    <div class="rubriques-wrap">${cards}</div>`;
  showScreen('rubriques');
  setNav(child);
}

// ---------- Niveau 4 : Contenu d'une rubrique ----------
function showRubriqueContent(rubriqueKey) {
  const child = State.child;
  const mat = State.matiere;
  const data = State.content.enfants[child];
  const rub = mat[rubriqueKey];
  const meta = State.content.rubriques[rubriqueKey];
  State.rubrique = rubriqueKey;
  State.corr = {};
  if (!rub) return;

  const numClass = child === 'aaron' ? 'aaron' : '';

  // Bloc intro (révision) ou cours (prépa/étude)
  let head = '';
  if (rubriqueKey === 'revision' && rub.intro) {
    head = `<div class="intro-card"><div class="cours-label">🔄 Au programme de la révision</div><div class="intro-text">${esc(rub.intro)}</div></div>`;
  } else if (rub.cours) {
    const etudeCls = rubriqueKey === 'etude' ? 'etude' : '';
    head = `<div class="cours-card ${etudeCls}"><div class="cours-label">📖 La leçon</div><div class="cours-text">${esc(rub.cours)}</div></div>`;
  }

  // Exercices
  const exos = (rub.exercices || []).map((exo, i) => {
    const key = `${rubriqueKey}_${i}`;
    const refHtml = exo.ref ? `<div class="ref-box">📍 ${esc(exo.ref)}</div>` : '';
    return `
      <div class="exercice-card">
        <div class="exo-header"><div class="exo-num ${numClass}">${i+1}</div></div>
        <div class="exo-consigne">${esc(exo.consigne)}</div>
        <textarea class="response-area" placeholder="✏️ Écris ta réponse ici…"></textarea>
        <div class="correction-toggle">
          <button class="btn btn-outline btn-sm" id="cbtn-${key}" onclick="toggleCorr('${key}')">🗝️ Voir la réponse</button>
          <div class="correction-content" id="cc-${key}">
            <div class="corr-box"><div class="corr-label">✅ Bonne réponse</div>${esc(exo.correction)}</div>
            <div class="expl-box"><div class="corr-label">💡 Explication</div>${esc(exo.explication)}</div>
            ${refHtml}
          </div>
        </div>
      </div>`;
  }).join('');

  // Jeux
  const jeux = (rub.jeux || []).map((j, i) => `
      <div class="jeu-card">
        <div class="jeu-header"><span class="jeu-num">🎲</span><span class="jeu-titre">${esc(j.titre)}</span></div>
        <div class="jeu-description">${esc(j.description)}</div>
      </div>`).join('');

  const done = Progress.isDone(child, mat.id, rubriqueKey);

  document.getElementById('screen-content').innerHTML = `
    <div class="rubrique-header ${rubriqueKey}">
      <button class="back-btn" onclick="showRubriques('${mat.id}')">←</button>
      <div class="breadcrumb">${data.emoji} ${esc(mat.nom)} › ${meta.label}</div>
      <div class="rubrique-header-label">${meta.emoji} ${meta.label}</div>
      <div class="rubrique-header-sub">${esc(meta.desc)}</div>
    </div>
    <div class="rubrique-body">
      ${head}
      <div class="section-title">✏️ Exercices <span class="section-count">${(rub.exercices||[]).length}</span></div>
      ${exos}
      <div class="section-title">🎮 Jeux <span class="section-count">${(rub.jeux||[]).length}</span></div>
      ${jeux}
      <div class="complete-wrap">
        ${done
          ? `<div class="confetti-msg visible">🎉 Étape terminée ! Bravo ! ⭐</div>`
          : `<button class="btn btn-${child} btn-block" style="font-size:1.05rem;padding:1rem;" onclick="markDone('${rubriqueKey}')">✅ J'ai terminé cette étape !</button>`}
        <div class="confetti-msg" id="done-msg"></div>
      </div>
      <div style="text-align:center;padding:0.5rem 0 1rem;">
        <button class="btn btn-outline btn-sm" onclick="showRubriques('${mat.id}')">← Retour aux étapes</button>
      </div>
    </div>`;
  showScreen('content');
  setNav(child);
}

function toggleCorr(key) {
  State.corr[key] = !State.corr[key];
  const cc = document.getElementById('cc-' + key);
  const btn = document.getElementById('cbtn-' + key);
  if (cc) cc.classList.toggle('visible', State.corr[key]);
  if (btn) btn.textContent = State.corr[key] ? '🙈 Masquer la réponse' : '🗝️ Voir la réponse';
}

function markDone(rubriqueKey) {
  const child = State.child, mat = State.matiere;
  Progress.complete(child, mat.id, rubriqueKey);
  const btn = document.querySelector('.complete-wrap .btn-block');
  if (btn) btn.remove();
  const msg = document.getElementById('done-msg');
  if (msg) {
    const name = child === 'maya' ? 'Maya' : 'Aaron';
    msg.textContent = `🎉 Bravo ${name} ! +1 étoile ⭐`;
    msg.classList.add('visible');
  }
  setTimeout(() => showRubriques(mat.id), 2000);
}

// ---------- Progression ----------
function renderProgress() {
  const state = Progress.getState();
  const order = ['revision', 'preparation', 'etude'];
  const rubMeta = State.content.rubriques;

  function childSection(childKey) {
    const data = State.content.enfants[childKey];
    const total = data.matieres.length * 3;
    const done = Progress.countDone(childKey);
    const mats = data.matieres.map(mat => {
      const chips = order.map(k => {
        const d = Progress.isDone(childKey, mat.id, k);
        const cls = k === 'revision' ? 'rev' : (k === 'preparation' ? 'prep' : 'etude');
        return `<span class="pm-chip ${d?'done':''} ${cls}">${rubMeta[k].emoji}</span>`;
      }).join('');
      return `<div class="progress-matiere"><div class="pm-top"><span class="pm-emoji">${mat.emoji}</span><span class="pm-nom">${esc(mat.nom)}</span></div><div class="pm-rubriques">${chips}</div></div>`;
    }).join('');
    return `
      <div class="child-progress-section">
        <div class="cps-header ${childKey}">
          <span class="cps-emoji">${data.emoji}</span>
          <div><div class="cps-name">${esc(data.nom)}</div><div class="cps-count">${done}/${total} étapes terminées</div></div>
        </div>
        ${mats}
      </div>`;
  }

  const allStars = Progress.countDone('maya') + Progress.countDone('aaron');
  const starsStr = allStars > 0 ? '⭐'.repeat(Math.min(allStars, 15)) : '○ ○ ○';

  document.getElementById('screen-progress').innerHTML = `
    <div class="progress-screen">
      <h2 class="progress-screen-title">🏆 Progression</h2>
      <p class="progress-screen-sub">Bravo pour tout ce travail !</p>
      <div class="stars-display">
        <div class="stars-row">${starsStr}</div>
        <div class="stars-label">${allStars} étoile${allStars>1?'s':''} en tout !</div>
      </div>
      ${childSection('maya')}
      ${childSection('aaron')}
      <div class="reset-zone"><button class="btn btn-outline btn-sm" onclick="confirmReset()">🔄 Réinitialiser</button></div>
    </div>`;
}

function confirmReset() {
  if (confirm('Remettre toute la progression à zéro ?')) {
    Progress.reset(); renderProgress(); renderHome(); showScreen('progress'); setNav('progress');
  }
}

// Exposer
window.renderHome = renderHome;
window.showMatieres = showMatieres;
window.showRubriques = showRubriques;
window.showRubriqueContent = showRubriqueContent;
window.toggleCorr = toggleCorr;
window.markDone = markDone;
window.confirmReset = confirmReset;
