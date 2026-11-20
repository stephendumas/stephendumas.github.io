/* Personal Archive: progressive navigation and a remembered color scheme. */
(() => {
  'use strict';

  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const desktop = window.matchMedia('(min-width: 761px)');
  const themeToggle = document.getElementById('theme-toggle');
  const themeStatus = document.getElementById('theme-status');
  const themePreference = document.getElementById('theme-preference');
  const systemButtons = document.querySelectorAll('[data-use-system]');
  const preferences = ['light', 'dark', 'system'];
  let preference = preferences.includes(root.dataset.preference)
    ? root.dataset.preference
    : 'system';

  function applyTheme(announce = false) {
    const theme = preference === 'system'
      ? (systemTheme.matches ? 'dark' : 'light')
      : preference;
    root.dataset.preference = preference;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    if (themeToggle) {
      themeToggle.hidden = false;
      themeToggle.setAttribute('aria-checked', String(theme === 'dark'));
      themeToggle.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
    systemButtons.forEach(button => {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(preference === 'system'));
    });
    const message = preference === 'system'
      ? `Following your device (${theme} mode)`
      : `${theme === 'dark' ? 'Dark' : 'Light'} mode`;
    if (themePreference) themePreference.textContent = message;
    if (announce && themeStatus) themeStatus.textContent = message;
  }

  function chooseTheme(value) {
    if (!preferences.includes(value)) return;
    preference = value;
    try {
      if (preference === 'system') window.localStorage.removeItem('smd-theme');
      else window.localStorage.setItem('smd-theme', preference);
    } catch (_) {
      // The switch still works for this page when browser storage is blocked.
    }
    applyTheme(true);
  }

  themeToggle?.addEventListener('click', () => {
    chooseTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  systemButtons.forEach(button => {
    button.addEventListener('click', () => chooseTheme('system'));
  });
  const systemChanged = () => {
    if (preference === 'system') applyTheme();
  };
  if (systemTheme.addEventListener) systemTheme.addEventListener('change', systemChanged);
  else systemTheme.addListener(systemChanged);
  window.addEventListener('storage', event => {
    if (event.key !== 'smd-theme' && event.key !== null) return;
    preference = preferences.includes(event.newValue) ? event.newValue : 'system';
    applyTheme();
  });
  applyTheme();

  const shell = document.querySelector('.navigation-shell');
  const nav = document.getElementById('primary-navigation');
  const menuToggle = document.getElementById('menu-toggle');
  const interestsToggle = document.getElementById('interests-toggle');
  const interestsPanel = document.getElementById('interests-panel');
  if (!shell || !nav) return;

  function setInterests(open, returnFocus = false) {
    if (!interestsToggle || !interestsPanel) return;
    interestsToggle.setAttribute('aria-expanded', String(open));
    interestsToggle.setAttribute('aria-label', `${open ? 'Close' : 'Open'} Other Interests submenu`);
    interestsPanel.hidden = !open;
    if (returnFocus) interestsToggle.focus();
  }

  function setMenu(open, returnFocus = false) {
    shell.dataset.menuOpen = String(open);
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', `${open ? 'Close' : 'Open'} main menu`);
      if (returnFocus) menuToggle.focus();
    }
    if (!open) setInterests(false);
  }

  if (menuToggle) {
    menuToggle.hidden = false;
    menuToggle.addEventListener('click', () => {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (interestsToggle) {
    interestsToggle.hidden = false;
    interestsToggle.addEventListener('click', () => {
      setInterests(interestsToggle.getAttribute('aria-expanded') !== 'true');
    });
    interestsToggle.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      setInterests(true);
      interestsPanel?.querySelector('a')?.focus();
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (interestsPanel && !interestsPanel.hidden) {
      event.preventDefault();
      setInterests(false, true);
    } else if (!desktop.matches && shell.dataset.menuOpen === 'true') {
      event.preventDefault();
      setMenu(false, true);
    }
  });
  document.addEventListener('click', event => {
    if (shell.contains(event.target)) return;
    setInterests(false);
    if (!desktop.matches) setMenu(false);
  });
  shell.addEventListener('focusout', event => {
    // Keep the submenu open while moving between its trigger and its links.
    if (event.relatedTarget && !shell.contains(event.relatedTarget)) setInterests(false);
  });
  const viewportChanged = () => {
    const hiddenFocus = !desktop.matches && nav.contains(document.activeElement);
    const menuHadFocus = desktop.matches && document.activeElement === menuToggle;
    setMenu(false, hiddenFocus);
    if (menuHadFocus) nav.querySelector('a')?.focus();
  };
  if (desktop.addEventListener) desktop.addEventListener('change', viewportChanged);
  else desktop.addListener(viewportChanged);
  setMenu(false);
})();
