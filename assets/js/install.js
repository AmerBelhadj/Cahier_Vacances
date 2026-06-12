// install.js — Gestion de l'installation PWA (Android + iOS)
// Affiche un bouton d'installation personnalisé car Android ne montre pas toujours le bouton automatique.

(function () {
  'use strict';

  let deferredPrompt = null;

  // Détections
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
  }
  function isIOS() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream;
  }

  // Crée la bannière d'installation (cachée par défaut)
  function buildBanner() {
    if (document.getElementById('install-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.innerHTML = `
      <div class="install-inner">
        <div class="install-emoji">🦋🚀</div>
        <div class="install-text">
          <div class="install-title">Installer l'application</div>
          <div class="install-sub" id="install-sub">Accès rapide + fonctionne hors ligne !</div>
        </div>
        <button id="install-action" class="install-btn">Installer</button>
        <button id="install-close" class="install-close" aria-label="Fermer">✕</button>
      </div>`;
    document.body.appendChild(banner);

    document.getElementById('install-close').addEventListener('click', hideBanner);
    document.getElementById('install-action').addEventListener('click', onInstallClick);
  }

  function showBanner() {
    buildBanner();
    const b = document.getElementById('install-banner');
    if (b) b.classList.add('visible');
  }
  function hideBanner() {
    const b = document.getElementById('install-banner');
    if (b) b.classList.remove('visible');
  }

  // Clic sur "Installer"
  async function onInstallClick() {
    if (deferredPrompt) {
      // Android / Chrome : déclenche le vrai prompt natif
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch (e) {}
      deferredPrompt = null;
      hideBanner();
    } else if (isIOS()) {
      // iOS : pas de prompt natif, on explique la manip
      showIOSInstructions();
    }
  }

  function showIOSInstructions() {
    const sub = document.getElementById('install-sub');
    const action = document.getElementById('install-action');
    if (sub) sub.innerHTML = "Appuie sur <b>Partager</b> ⬆️ puis <b>« Sur l'écran d'accueil »</b>";
    if (action) action.style.display = 'none';
  }

  // ----- Événements PWA -----

  // Android/Chrome : l'événement arrive quand l'app est installable
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();      // empêche la mini-infobar par défaut
    deferredPrompt = e;      // on garde l'événement pour plus tard
    if (!isStandalone()) showBanner();
  });

  // Quand l'app vient d'être installée
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideBanner();
  });

  // Au chargement : si déjà installée, rien. Si iOS et pas installée, proposer la manip.
  window.addEventListener('load', () => {
    if (isStandalone()) return; // déjà installée → pas de bannière

    if (isIOS()) {
      // iOS ne déclenche jamais beforeinstallprompt → on montre la bannière avec instructions
      setTimeout(() => {
        buildBanner();
        const action = document.getElementById('install-action');
        if (action) action.textContent = "Comment installer ?";
        showBanner();
      }, 2500);
    }
    // Android : on attend beforeinstallprompt (peut prendre quelques secondes,
    // et nécessite que le SW soit actif + critères PWA remplis + HTTPS)
  });
})();
