// progress.js — Progression locale (Phase 1)
// Granularité : enfant > matière > rubrique

const STORAGE_KEY = 'maya-aaron-progress-v2';

const Progress = (() => {
  const defaultState = () => ({ maya: {}, aaron: {}, lastVisit: null });
  // Structure : state[child][matiereId] = { revision: bool, preparation: bool, etude: bool }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!parsed.maya || !parsed.aaron) return defaultState();
      return parsed;
    } catch { return defaultState(); }
  }

  function save(state) {
    try {
      state.lastVisit = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { console.warn('[Progress] save échouée:', e); }
  }

  function complete(child, matiereId, rubrique) {
    const state = load();
    if (!state[child][matiereId]) state[child][matiereId] = {};
    state[child][matiereId][rubrique] = true;
    save(state);
    return state;
  }

  function isDone(child, matiereId, rubrique) {
    const state = load();
    return !!(state[child][matiereId] && state[child][matiereId][rubrique]);
  }

  // Nombre de rubriques complétées pour un enfant
  function countDone(child) {
    const state = load();
    let n = 0;
    for (const mat in state[child]) {
      for (const rub in state[child][mat]) {
        if (state[child][mat][rub]) n++;
      }
    }
    return n;
  }

  function getState() { return load(); }
  function reset() { save(defaultState()); }

  return { complete, isDone, countDone, getState, reset };
})();

window.Progress = Progress;
