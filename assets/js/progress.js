// progress.js — Gestion de la progression locale (localStorage)
// Les Vacances de Maya et Aaron

const STORAGE_KEY = 'maya-aaron-progress-v1';

const Progress = (() => {

  // État initial
  const defaultState = () => ({
    maya: { completed: [], stars: 0 },
    aaron: { completed: [], stars: 0 },
    lastVisit: null
  });

  // Chargement depuis localStorage
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      // Vérification structure
      if (!parsed.maya || !parsed.aaron) return defaultState();
      return parsed;
    } catch {
      return defaultState();
    }
  }

  // Sauvegarde dans localStorage
  function save(state) {
    try {
      state.lastVisit = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[Progress] Impossible de sauvegarder:', e);
    }
  }

  // Marquer une session comme terminée
  function completeSession(child, sessionId) {
    const state = load();
    if (!state[child].completed.includes(sessionId)) {
      state[child].completed.push(sessionId);
      state[child].stars += 1;
    }
    save(state);
    return state;
  }

  // Vérifier si une session est terminée
  function isCompleted(child, sessionId) {
    const state = load();
    return state[child].completed.includes(sessionId);
  }

  // Obtenir le nombre de sessions terminées pour un enfant
  function getCompletedCount(child) {
    return load()[child].completed.length;
  }

  // Obtenir les étoiles d'un enfant
  function getStars(child) {
    return load()[child].stars;
  }

  // Obtenir l'état complet
  function getState() {
    return load();
  }

  // Réinitialiser
  function reset() {
    save(defaultState());
  }

  return { completeSession, isCompleted, getCompletedCount, getStars, getState, reset };
})();

window.Progress = Progress;
