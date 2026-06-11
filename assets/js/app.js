// app.js — Les Vacances de Maya et Aaron
// Application principale PWA

'use strict';

// ==========================================
//  État global de l'application
// ==========================================
const AppState = {
  currentScreen: 'home',
  currentChild: null,        // 'maya' | 'aaron'
  currentSession: null,      // objet session complet
  content: null,             // données JSON
  correctionVisible: {},     // {exo_id: bool}
};

// ==========================================
//  Initialisation
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  // Charger le contenu pédagogique
  try {
    const res = await fetch('./data/content.json');
    AppState.content = await res.json();
  } catch (e) {
    console.error('[App] Erreur chargement contenu:', e);
    // Afficher une erreur douce
    document.querySelector('.loader-title').textContent = '⚠️ Erreur de chargement. Vérifie ta connexion.';
    return;
  }

  // Masquer l'écran de chargement
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.add('hidden');
  }, 800);

  // Rendre l'écran d'accueil
  renderHome();

  // Écouter la navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.screen;
      if (target === 'maya' || target === 'aaron') {
        showChildScreen(target);
      } else if (target === 'progress') {
        showScreen('progress');
        renderProgress();
      } else {
        showScreen('home');
        renderHome();
      }
    });
  });

  // Enregistrer le Service Worker
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js', { scope: './' });
      console.log('[SW] Enregistré avec succès');
    } catch (e) {
      console.warn('[SW] Enregistrement échoué:', e);
    }
  }
});

// ==========================================
//  Navigation
// ==========================================
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + screenId);
  if (target) target.classList.add('active');

  // Mettre à jour la nav active
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screenId);
  });

  AppState.currentScreen = screenId;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
//  Écran d'accueil
// ==========================================
function renderHome() {
  const maya = AppState.content.maya;
  const aaron = AppState.content.aaron;
  const totalSessions = maya.sessions.length + aaron.sessions.length;
  const mayaCompleted = Progress.getCompletedCount('maya');
  const aaronCompleted = Progress.getCompletedCount('aaron');
  const totalCompleted = mayaCompleted + aaronCompleted;
  const totalStars = Progress.getStars('maya') + Progress.getStars('aaron');

  const mayaPct = Math.round((mayaCompleted / maya.sessions.length) * 100);
  const aaronPct = Math.round((aaronCompleted / aaron.sessions.length) * 100);

  document.getElementById('screen-home').innerHTML = `
    <div class="home-hero">
      <span class="hero-emojis">🦋🚀</span>
      <h1 class="hero-title">Les Vacances de<br><span class="highlight-maya">Maya</span> et <span class="highlight-aaron">Aaron</span> !</h1>
      <p class="hero-subtitle">✨ Le cahier de vacances magique ✨</p>
    </div>

    <div class="children-cards">
      <button class="child-card maya" onclick="showChildScreen('maya')" aria-label="Aller au cahier de Maya">
        <span class="child-card-emoji">🦋</span>
        <div class="child-card-name">Maya</div>
        <div class="child-card-level">${maya.niveau}</div>
        <div class="child-progress-bar">
          <div class="child-progress-fill" style="width: ${mayaPct}%"></div>
        </div>
        <div style="font-size:0.7rem; color: var(--maya-primary); font-weight: 700; margin-top: 0.25rem;">${mayaCompleted}/${maya.sessions.length} activités</div>
      </button>
      <button class="child-card aaron" onclick="showChildScreen('aaron')" aria-label="Aller au cahier d'Aaron">
        <span class="child-card-emoji">🚀</span>
        <div class="child-card-name">Aaron</div>
        <div class="child-card-level">${aaron.niveau}</div>
        <div class="child-progress-bar">
          <div class="child-progress-fill" style="width: ${aaronPct}%"></div>
        </div>
        <div style="font-size:0.7rem; color: var(--aaron-primary); font-weight: 700; margin-top: 0.25rem;">${aaronCompleted}/${aaron.sessions.length} activités</div>
      </button>
    </div>

    <div class="home-stats">
      <div class="stat-card">
        <div class="stat-number">${totalCompleted}</div>
        <div class="stat-label">Activités ✅</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${totalStars} ⭐</div>
        <div class="stat-label">Étoiles gagnées</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${totalSessions}</div>
        <div class="stat-label">Activités total</div>
      </div>
    </div>

    <div style="text-align:center; padding: 0.5rem 1rem 2rem; color: var(--text-light); font-size: 0.8rem;">
      💡 Chaque activité complétée = 1 étoile ! Bonne chance Maya et Aaron ! 🌟
    </div>
  `;

  showScreen('home');
}

// ==========================================
//  Écran d'un enfant (liste sessions)
// ==========================================
function showChildScreen(child) {
  AppState.currentChild = child;
  const data = AppState.content[child];

  const sessionsHtml = data.sessions.map(session => {
    const done = Progress.isCompleted(child, session.id);
    return `
      <button class="session-card ${child}" onclick="showSession('${child}', '${session.id}')" aria-label="Ouvrir l'activité ${session.titre}">
        <div class="session-emoji-wrap">${session.emoji}</div>
        <div class="session-info">
          <div class="session-matiere">${session.matiere}</div>
          <div class="session-titre">${session.titre}</div>
        </div>
        <div class="session-status">${done ? '✅' : '▶️'}</div>
      </button>
    `;
  }).join('');

  document.getElementById('screen-child').innerHTML = `
    <div class="child-screen-header ${child}">
      <button class="back-btn" onclick="renderHome(); document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.screen==='home'));" aria-label="Retour à l'accueil">←</button>
      <div class="child-screen-title ${child}">${data.emoji} ${data.nom}</div>
      <div class="child-screen-subtitle">${data.niveau} · ${data.age}</div>
    </div>
    <div class="sessions-grid">
      <p style="font-size:0.85rem; color: var(--text-light); text-align:center; padding: 0.5rem 0 0.25rem;">Clique sur une activité pour commencer ! 👇</p>
      ${sessionsHtml}
    </div>
  `;

  showScreen('child');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.screen === child));
}

// ==========================================
//  Écran de session (détail)
// ==========================================
function showSession(child, sessionId) {
  const data = AppState.content[child];
  const session = data.sessions.find(s => s.id === sessionId);
  if (!session) return;

  AppState.currentSession = session;
  AppState.correctionVisible = {};

  const exercicesHtml = session.exercices.map((exo, idx) => {
    const exoKey = `${sessionId}_${idx}`;
    return `
      <div class="exercice-card">
        <div class="exo-header">
          <span class="exo-niveau">${exo.emoji}</span>
          <span class="exo-titre">${exo.titre}</span>
        </div>
        <div class="exo-consigne">${exo.consigne}</div>
        <textarea class="response-area" placeholder="✏️ Écris ta réponse ici…" aria-label="Réponse à l'exercice ${exo.titre}"></textarea>
        <div class="correction-toggle">
          <button class="btn btn-outline btn-sm" onclick="toggleCorrection('${exoKey}')" id="btn-corr-${exoKey}">
            🗝️ Voir la correction
          </button>
          <div class="correction-content" id="corr-${exoKey}">
            <div class="correction-label">🗝️ Correction</div>
            ${exo.correction}
          </div>
        </div>
      </div>
    `;
  }).join('');

  const done = Progress.isCompleted(child, sessionId);

  document.getElementById('screen-session').innerHTML = `
    <div class="session-detail">
      <div class="session-detail-header ${child}">
        <button class="back-btn" onclick="showChildScreen('${child}')" aria-label="Retour à la liste des activités">←</button>
        <div class="session-detail-meta">${session.emoji} ${session.matiere}</div>
        <div class="session-detail-title">${session.titre}</div>
      </div>

      <div class="session-detail-body">
        <div class="lecon-card">
          <div class="lecon-label">📖 La leçon</div>
          <div class="lecon-text">${session.lecon}</div>
          <div class="memo-box">
            <div class="memo-label">✏️ Je retiens</div>
            ${session.memo}
          </div>
        </div>

        <div class="section-title">✏️ Exercices</div>
        ${exercicesHtml}

        <div class="section-title">🎮 Jeu pédagogique</div>
        <div class="jeu-card">
          <div class="jeu-header">
            <div class="jeu-icon">🎲</div>
            <div class="jeu-titre">${session.jeu.titre}</div>
          </div>
          <div class="jeu-description">${session.jeu.description}</div>
        </div>

        <div class="section-title">⚡ Défi du jour</div>
        <div class="defi-card">
          <div class="defi-header">
            <div class="defi-icon">⚡</div>
            <div class="defi-titre">Ton défi !</div>
          </div>
          <div class="defi-text">"${session.defi}"</div>
        </div>

        <div class="session-complete-wrap">
          ${done
            ? `<div class="confetti-msg visible">🎉 Super ! Tu as déjà terminé cette activité ! ⭐</div>`
            : `<button class="btn btn-${child} btn-block" onclick="markSessionDone('${child}', '${sessionId}')" style="font-size: 1.1rem; padding: 1rem;">
                ✅ J'ai terminé cette activité !
               </button>`
          }
          <div class="confetti-msg" id="done-msg-${sessionId}"></div>
        </div>

        <div style="text-align: center; padding: 0.5rem 0 1rem;">
          <button class="btn btn-outline btn-sm" onclick="showChildScreen('${child}')">
            ← Retour aux activités
          </button>
        </div>
      </div>
    </div>
  `;

  showScreen('session');
}

// ==========================================
//  Toggle correction
// ==========================================
function toggleCorrection(exoKey) {
  const corrDiv = document.getElementById('corr-' + exoKey);
  const btn = document.getElementById('btn-corr-' + exoKey);
  if (!corrDiv) return;

  AppState.correctionVisible[exoKey] = !AppState.correctionVisible[exoKey];
  corrDiv.classList.toggle('visible', AppState.correctionVisible[exoKey]);
  btn.textContent = AppState.correctionVisible[exoKey] ? '🙈 Masquer la correction' : '🗝️ Voir la correction';
}

// ==========================================
//  Marquer une session comme terminée
// ==========================================
function markSessionDone(child, sessionId) {
  Progress.completeSession(child, sessionId);

  const btn = document.querySelector('.session-complete-wrap .btn');
  if (btn) btn.remove();

  const msg = document.getElementById('done-msg-' + sessionId);
  if (msg) {
    const childName = child === 'maya' ? 'Maya' : 'Aaron';
    msg.textContent = `🎉 Bravo ${childName} ! Tu as gagné une étoile ⭐ !`;
    msg.classList.add('visible');
  }

  // Petit délai puis retour à la liste
  setTimeout(() => {
    showChildScreen(child);
  }, 2500);
}

// ==========================================
//  Écran progression
// ==========================================
function renderProgress() {
  const state = Progress.getState();
  const maya = AppState.content.maya;
  const aaron = AppState.content.aaron;

  function sessionProgressList(childKey, childData) {
    return childData.sessions.map(session => {
      const done = state[childKey].completed.includes(session.id);
      return `
        <div class="progress-session-item">
          <div class="psi-emoji">${session.emoji}</div>
          <div class="psi-info">
            <div class="psi-title">${session.titre}</div>
            <div class="psi-matiere">${session.matiere}</div>
          </div>
          <div class="psi-status">${done ? '✅' : '○'}</div>
        </div>
      `;
    }).join('');
  }

  const mayaStars = state.maya.stars;
  const aaronStars = state.aaron.stars;
  const allStars = mayaStars + aaronStars;
  const starsStr = '⭐'.repeat(Math.min(allStars, 10));

  document.getElementById('screen-progress').innerHTML = `
    <div class="progress-screen">
      <h2 class="progress-screen-title">🏆 Progression</h2>
      <p class="progress-screen-sub">Regardez tout ce que vous avez appris !</p>

      <div class="stars-display">
        <div class="stars-row">${starsStr || '○ ○ ○'}</div>
        <div class="stars-label">${allStars} étoile${allStars > 1 ? 's' : ''} gagnée${allStars > 1 ? 's' : ''} en tout !</div>
      </div>

      <div class="child-progress-section">
        <div class="cps-header maya">
          <span class="cps-emoji">🦋</span>
          <div>
            <div class="cps-name">Maya</div>
            <div class="cps-count">${state.maya.completed.length}/${maya.sessions.length} activités · ${mayaStars} ⭐</div>
          </div>
        </div>
        ${sessionProgressList('maya', maya)}
      </div>

      <div class="child-progress-section">
        <div class="cps-header aaron">
          <span class="cps-emoji">🚀</span>
          <div>
            <div class="cps-name">Aaron</div>
            <div class="cps-count">${state.aaron.completed.length}/${aaron.sessions.length} activités · ${aaronStars} ⭐</div>
          </div>
        </div>
        ${sessionProgressList('aaron', aaron)}
      </div>

      <div class="reset-zone">
        <button class="btn btn-outline btn-sm" onclick="confirmReset()">🔄 Réinitialiser la progression</button>
      </div>
    </div>
  `;
}

function confirmReset() {
  if (confirm('Veux-tu vraiment remettre la progression à zéro ? Toutes les étoiles seront perdues.')) {
    Progress.reset();
    renderProgress();
    renderHome();
  }
}

// Exposer les fonctions appelées depuis le HTML
window.showChildScreen = showChildScreen;
window.showSession = showSession;
window.toggleCorrection = toggleCorrection;
window.markSessionDone = markSessionDone;
window.renderHome = renderHome;
window.confirmReset = confirmReset;
