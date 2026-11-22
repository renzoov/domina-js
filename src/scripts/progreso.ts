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

// ── Copia del progreso ─────────────────────────────────────────
// El progreso vive solo en este navegador. Una copia en un archivo JSON permite no perderlo
// (si se borran los datos del sitio) y llevarlo a otro navegador o a otro equipo.

const APP = 'domina-js';
const VERSION = 1;

/** El progreso como texto JSON, listo para guardarse en un archivo */
export function exportarProgreso(): string {
  return JSON.stringify({ app: APP, version: VERSION, fecha: new Date().toISOString(), progreso: leer() }, null, 2);
}

/**
 * Carga una copia y la combina con el progreso actual: un ejercicio resuelto en cualquiera de los dos
 * queda resuelto. Devuelve cuántos ejercicios nuevos sumó, o lanza un Error con un mensaje para mostrar.
 */
export function importarProgreso(texto: string): { nuevos: number; total: number } {
  let datos: { app?: unknown; progreso?: { ejercicios?: unknown; predicciones?: { aciertos?: unknown; total?: unknown } } };
  try {
    datos = JSON.parse(texto);
  } catch {
    throw new Error('El archivo no es una copia válida: no se pudo leer como JSON.');
  }
  const ejercicios = datos?.progreso?.ejercicios;
  if (datos?.app !== APP || !ejercicios || typeof ejercicios !== 'object' || Array.isArray(ejercicios)) {
    throw new Error('Ese archivo no es una copia del progreso de domina-js.');
  }
  const actual = leer();
  let nuevos = 0;
  for (const id of Object.keys(ejercicios)) {
    if (typeof id === 'string' && id.length < 100 && !actual.ejercicios[id]) {
      actual.ejercicios[id] = true;
      nuevos++;
    }
  }
  const p = datos.progreso?.predicciones;
  if (p && typeof p.aciertos === 'number' && typeof p.total === 'number' && p.total > actual.predicciones.total) {
    actual.predicciones = { aciertos: Math.min(p.aciertos, p.total), total: p.total };
  }
  guardar(actual);
  return { nuevos, total: Object.keys(actual.ejercicios).length };
}
