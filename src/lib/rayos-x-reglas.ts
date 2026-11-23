// Comprueba los objetivos de un desafío de Rayos X mirando los pasos generados: lo mismo que ve el lector.
import type { DatosVisualizador, Paso } from './visualizador';
import type { Regla } from '../data/rayos-x';

/**
 * Cuántas funciones hay en la pila en un paso (cuenta las que Rayos X juntó en «… N llamadas más»).
 * En el modo event loop no cuenta el programa principal ni las tarjetas del runtime y las colas.
 */
export function profundidad(p: Paso): number {
  return p.pila.reduce((n, m) => {
    if ((m.tipo && m.tipo !== 'pila') || m.nombre === 'programa principal') return n;
    const juntas = /^… (\d+) llamadas más$/.exec(m.nombre);
    return n + (juntas ? Number(juntas[1]) : 1);
  }, 0);
}

export function cumple(regla: Regla, datos: DatosVisualizador): boolean {
  const { pasos, codigo } = datos;
  const ultimo = pasos.at(-1);
  // Errores sin atrapar: en el modo event loop el programa sigue después de uno, así que se buscan en la consola
  const errores = (ultimo?.consola ?? []).filter((l) => l.startsWith('Uncaught '));
  const conError = errores.length > 0 || ultimo?.evento === 'error';
  const consola = (ultimo?.consola ?? []).filter((l) => !l.startsWith('Uncaught '));
  if ('consola' in regla) return consola.join('\n') === regla.consola.join('\n');
  if ('consolaIncluye' in regla) return consola.some((l) => l.includes(regla.consolaIncluye));
  if ('profundidad' in regla) return Math.max(0, ...pasos.map(profundidad)) >= regla.profundidad;
  if ('error' in regla) { const re = new RegExp(regla.error); return conError && (errores.some((l) => re.test(l)) || re.test(ultimo!.texto)); }
  if ('sinError' in regla) return !conError;
  if ('recuerda' in regla) return pasos.some((p) => p.pila.some((m) => m.nota?.includes('(recordada)')));
  if ('zona' in regla) return pasos.some((p) => p.pila.some((m) => m.tipo === regla.zona));
  if ('pausa' in regla) return pasos.some((p) => p.pila.some((m) => m.tipo === 'objeto' && m.nota?.startsWith('en pausa')));
  if ('codigo' in regla) return new RegExp(regla.codigo).test(codigo);
  return false;
}
