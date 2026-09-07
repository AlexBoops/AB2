(function() {
  const idle = 'url(./angry.cur), auto';
  const press = 'url(./angry2.cur), auto';
  const seen = new WeakSet();
  const active = new Set();

  const isVisible = (el) => {
    if (!el.isConnected) return false;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const force = (c) => {
    try { c.style.setProperty('cursor', c._cur || idle, 'important'); } catch (e) {}
  };

  const setMode = (c, mode) => {
    c._cur = mode;
    force(c);
  };

  const arm = (c) => {
    if (seen.has(c)) return;
    seen.add(c);
    setTimeout(() => {
      if (!isVisible(c)) { seen.delete(c); return; }
      active.add(c);
      c._cur = idle;
      force(c);
      c.addEventListener('pointerdown', () => setMode(c, press));
      setInterval(() => { if (isVisible(c)) force(c); }, 1000);
    }, 5000);
  };

  const release = () => active.forEach((c) => setMode(c, idle));
  window.addEventListener('pointerup', release, true);
  window.addEventListener('pointercancel', release, true);
  window.addEventListener('blur', release, true);

  const scan = () => document.querySelectorAll('canvas').forEach(arm);
  scan();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();