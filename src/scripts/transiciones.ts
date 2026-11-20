// Transición de vista dentro de la página (mismo documento).
// Solo se animan los elementos con view-transition-name; si el navegador no la soporta
// o se pidió reducir el movimiento, el cambio se aplica directo.

export function conTransicion(cambio: () => void) {
  const doc = document as Document & { startViewTransition?: (fn: () => void) => { finished: Promise<void> } };
  if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cambio();
    return;
  }
  const html = document.documentElement;
  html.classList.add('vt-local');
  const t = doc.startViewTransition(cambio);
  t.finished.finally(() => html.classList.remove('vt-local'));
}
