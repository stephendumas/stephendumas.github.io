/* Progressive enhancements; page content and ordinary navigation need no JavaScript. */
(() => {
  'use strict';
  const root = document.documentElement;
  const media = matchMedia('(prefers-color-scheme: dark)');
  const palettes = ['heraldic', 'collegiate', 'northern', 'graphite'];
  const names = {heraldic: 'Heraldic', collegiate: 'Collegiate', northern: 'Northern', graphite: 'Graphite'};
  let mode = root.dataset.mode || 'system';
  let palette = root.dataset.palette || 'heraldic';
  const status = document.getElementById('appearance-status');
  const modeToggle = document.getElementById('mode-toggle');

  function applyPreferences(announce = false) {
    const theme = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
    root.dataset.mode = mode;
    root.dataset.theme = theme;
    root.dataset.palette = palette;
    try { localStorage.setItem('smd-mode', mode); localStorage.setItem('smd-palette', palette); } catch (_) {}
    document.querySelectorAll('[name="palette"]').forEach(input => { input.checked = input.value === palette; });
    document.querySelectorAll('[name="display-mode"]').forEach(input => { input.checked = input.value === mode; });
    document.querySelectorAll('[data-select-palette]').forEach(button => {
      const active = button.dataset.selectPalette === palette;
      button.setAttribute('aria-pressed', String(active));
      const label = button.querySelector('[data-palette-button-text]');
      if (label) label.textContent = active ? 'Selected palette' : 'Try this palette';
    });
    document.querySelectorAll('[data-selected-palette-name]').forEach(el => { el.textContent = names[palette]; });
    const toggleLabel = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    modeToggle?.setAttribute('aria-label', toggleLabel);
    modeToggle?.setAttribute('title', toggleLabel);
    if (announce && status) status.textContent = `${names[palette]} palette, ${theme} mode${mode === 'system' ? ', following your device' : ''}.`;
  }

  document.querySelectorAll('[name="palette"]').forEach(input => input.addEventListener('change', () => {
    if (palettes.includes(input.value)) { palette = input.value; applyPreferences(true); }
  }));
  document.querySelectorAll('[data-select-palette]').forEach(button => button.addEventListener('click', () => {
    if (palettes.includes(button.dataset.selectPalette)) { palette = button.dataset.selectPalette; applyPreferences(true); }
  }));
  document.querySelectorAll('[name="display-mode"]').forEach(input => input.addEventListener('change', () => {
    if (['light', 'dark', 'system'].includes(input.value)) { mode = input.value; applyPreferences(true); }
  }));
  modeToggle?.addEventListener('click', () => { mode = root.dataset.theme === 'light' ? 'dark' : 'light'; applyPreferences(true); });
  media.addEventListener('change', () => { if (mode === 'system') applyPreferences(); });

  const dialog = document.getElementById('appearance-dialog');
  let opener;
  document.querySelectorAll('[data-open-appearance]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    if (!dialog.open) dialog.showModal();
  }));
  document.getElementById('appearance-close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
  dialog?.addEventListener('close', () => opener?.focus());

  const header = document.querySelector('.site-header');
  const menu = document.getElementById('menu-toggle');
  const interests = document.getElementById('interests-toggle');
  const panel = document.getElementById('interests-panel');
  const setInterests = open => {
    interests?.setAttribute('aria-expanded', String(open));
    interests?.setAttribute('aria-label', `${open ? 'Collapse' : 'Expand'} Other Interests`);
    if (panel) panel.hidden = !open;
  };
  const setMenu = open => {
    header.dataset.menuOpen = String(open);
    menu?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-label', `${open ? 'Close' : 'Open'} main menu`);
    if (!open) setInterests(false);
  };
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  interests?.addEventListener('click', () => setInterests(interests.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('click', event => { if (!header.contains(event.target)) setInterests(false); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || dialog?.open) return;
    if (panel && !panel.hidden) { setInterests(false); interests.focus(); }
    else if (menu?.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
  });
  matchMedia('(min-width: 761px)').addEventListener('change', () => setMenu(false));
  setMenu(false);
  applyPreferences();
})();
