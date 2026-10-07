// Lys/mørk modus. Lastes i <head> så siden ikke blinker i feil farge.
// Uten lagret valg følger siden innstillingen på enheten.
(() => {
  const root = document.documentElement;
  const dark = matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try {
    saved = localStorage.getItem('tm-theme');
  } catch {}
  if (saved) root.dataset.theme = saved;

  const current = () => root.dataset.theme || (dark.matches ? 'dark' : 'light');
  const label = (btn) => {
    const isDark = current() === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Bytt til lys modus' : 'Bytt til mørk modus');
    btn.title = btn.getAttribute('aria-label');
    btn.dataset.mode = current();
  };

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    label(btn);
    dark.addEventListener('change', () => label(btn));
    btn.addEventListener('click', () => {
      root.dataset.theme = current() === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('tm-theme', root.dataset.theme);
      } catch {}
      label(btn);
    });
  });
})();
