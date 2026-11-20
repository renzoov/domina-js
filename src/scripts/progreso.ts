// Progreso del lector, guardado solo en su navegador.
// Si el almacenamiento no está disponible (modo privado, bloqueado), todo sigue funcionando sin guardar.

const CLAVE = 'domina-js:progreso:v1';

interface Progreso {
  ejercicios: Record<string, true>;
  predicciones: { aciertos: number; total: number };
}

function leer(): Progreso {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (crudo) {
      const p = JSON.parse(crudo);
      return { ejercicios: p.ejercicios ?? {}, predicciones: p.predicciones ?? { aciertos: 0, total: 0 } };
    }
  } catch {}
  return { ejercicios: {}, predicciones: { aciertos: 0, total: 0 } };
}

function guardar(p: Progreso) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(p));
  } catch {}
  document.dispatchEvent(new CustomEvent('domina:progreso'));
}

export function marcarEjercicio(id: string) {
  const p = leer();
  if (p.ejercicios[id]) return;
  p.ejercicios[id] = true;
  guardar(p);
}

export function ejercicioResuelto(id: string) {
  return !!leer().ejercicios[id];
}

export function registrarPrediccion(bien: boolean) {
  const p = leer();
  p.predicciones.total++;
  if (bien) p.predicciones.aciertos++;
  guardar(p);
}

export function resumen() {
  return leer();
}
