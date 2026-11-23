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
  if (!shell || !nav) return;

  const flyouts = window.matchMedia('(min-width: 961px)');
  const hoverMenus = window.matchMedia('(min-width: 961px) and (hover: hover)');
  const branches = Array.from(nav.querySelectorAll('.submenu-toggle')).map(button => ({
    button,
    panel: document.getElementById(button.getAttribute('aria-controls')),
    owner: button.closest('li'),
    openTimer: null,
    closeTimer: null
  })).filter(branch => branch.panel && branch.owner);
  const rootBranch = branches.find(branch => branch.button.id === 'interests-toggle');
  const isOpen = branch => branch.button.getAttribute('aria-expanded') === 'true';

  function clearTimers(branch) {
    window.clearTimeout(branch.openTimer);
    window.clearTimeout(branch.closeTimer);
  }

  function positionPanel(branch) {
    branch.panel.style.top = '';
    branch.panel.style.maxHeight = '';
    branch.panel.style.overflowY = '';
    if (!flyouts.matches || branch === rootBranch || !isOpen(branch)) return;
    // A short viewport can scroll the final list without clipping any flyouts.
    if (!branch.panel.querySelector('.submenu')) {
      branch.panel.style.maxHeight = `${Math.max(120, window.innerHeight - 24)}px`;
      branch.panel.style.overflowY = 'auto';
    }
    const bounds = branch.panel.getBoundingClientRect();
    const overflow = bounds.bottom - window.innerHeight + 12;
    if (overflow > 0) {
      const top = parseFloat(window.getComputedStyle(branch.panel).top) || 0;
      branch.panel.style.top = `${top - Math.min(overflow, Math.max(0, bounds.top - 12))}px`;
    }
  }

  function closeBranch(branch, returnFocus = false) {
    clearTimers(branch);
    if (returnFocus || branch.panel.contains(document.activeElement)) branch.button.focus();
    branches.filter(child => branch.panel.contains(child.button)).forEach(child => {
      clearTimers(child);
      child.button.setAttribute('aria-expanded', 'false');
      child.button.setAttribute('aria-label', `Open ${child.button.dataset.submenuLabel} submenu`);
      child.panel.hidden = true;
    });
    branch.button.setAttribute('aria-expanded', 'false');
    branch.button.setAttribute('aria-label', `Open ${branch.button.dataset.submenuLabel} submenu`);
    branch.panel.hidden = true;
  }

  function openBranch(branch, focusFirst = false) {
    clearTimers(branch);
    // Only one sibling branch is open at each level of the navigation tree.
    branches.filter(other => other !== branch && other.owner.parentElement === branch.owner.parentElement)
      .forEach(other => closeBranch(other));
    branch.button.setAttribute('aria-expanded', 'true');
    branch.button.setAttribute('aria-label', `Close ${branch.button.dataset.submenuLabel} submenu`);
    branch.panel.hidden = false;
    positionPanel(branch);
    if (focusFirst) branch.panel.querySelector('a')?.focus();
  }

  function closeAllBranches() {
    if (rootBranch) closeBranch(rootBranch);
  }

  function setMenu(open, returnFocus = false) {
    shell.dataset.menuOpen = String(open);
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', `${open ? 'Close' : 'Open'} main menu`);
    }
    if (!open) closeAllBranches();
    if (returnFocus) menuToggle?.focus();
  }

  branches.forEach(branch => {
    branch.panel.hidden = true;
    branch.button.hidden = false;
    branch.button.addEventListener('click', () => {
      clearTimers(branch);
      if (isOpen(branch)) closeBranch(branch);
      else openBranch(branch);
    });
    branch.button.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      openBranch(branch, true);
    });
    branch.owner.addEventListener('pointerenter', event => {
      if (!hoverMenus.matches || event.pointerType === 'touch') return;
      clearTimers(branch);
      branch.openTimer = window.setTimeout(() => openBranch(branch), 160);
    });
    branch.owner.addEventListener('pointerleave', event => {
      if (!hoverMenus.matches || event.pointerType === 'touch') return;
      clearTimers(branch);
      branch.closeTimer = window.setTimeout(() => {
        if (!branch.owner.contains(document.activeElement)) closeBranch(branch);
      }, 240);
    });
  });

  if (menuToggle) {
    menuToggle.hidden = false;
    menuToggle.addEventListener('click', () => {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const focused = document.activeElement;
    const focusedPanel = focused.closest?.('.submenu');
    const branch = branches.find(item => item.button === focused && isOpen(item))
      || branches.find(item => item.panel === focusedPanel && isOpen(item))
      || branches.slice().reverse().find(isOpen);
    if (branch) {
      event.preventDefault();
      closeBranch(branch, true);
    } else if (!desktop.matches && shell.dataset.menuOpen === 'true') {
      event.preventDefault();
      setMenu(false, true);
    }
  });
  document.addEventListener('click', event => {
    if (shell.contains(event.target)) return;
    closeAllBranches();
    if (!desktop.matches) setMenu(false, nav.contains(document.activeElement));
  });
  nav.addEventListener('focusout', event => {
    if (!event.relatedTarget) return;
    branches.slice().reverse().forEach(branch => {
      if (isOpen(branch) && !branch.owner.contains(event.relatedTarget)) closeBranch(branch);
    });
  });
  const viewportChanged = () => {
    const hiddenFocus = !desktop.matches && nav.contains(document.activeElement);
    const menuHadFocus = desktop.matches && document.activeElement === menuToggle;
    setMenu(false, hiddenFocus);
    if (menuHadFocus) nav.querySelector('a')?.focus();
  };
  if (desktop.addEventListener) desktop.addEventListener('change', viewportChanged);
  else desktop.addListener(viewportChanged);
  window.addEventListener('resize', () => {
    branches.filter(isOpen).forEach(positionPanel);
  });
  setMenu(false);
  shell.classList.add('navigation-ready');
})();
