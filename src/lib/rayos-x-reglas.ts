// Comprueba los objetivos de un desafío de Rayos X mirando los pasos generados: lo mismo que ve el lector.
import type { DatosVisualizador, Paso } from './visualizador';
import type { Regla } from '../data/rayos-x';

/** Cuántas funciones hay en la pila en un paso (cuenta las que Rayos X juntó en «… N llamadas más») */
export function profundidad(p: Paso): number {
  return p.pila.reduce((n, m) => {
    const juntas = /^… (\d+) llamadas más$/.exec(m.nombre);
    return n + (juntas ? Number(juntas[1]) : 1);
  }, 0);
}

export function cumple(regla: Regla, datos: DatosVisualizador): boolean {
  const { pasos, codigo } = datos;
  const ultimo = pasos.at(-1);
  const conError = ultimo?.evento === 'error';
  const consola = (ultimo?.consola ?? []).filter((l) => !l.startsWith('Uncaught '));
  if ('consola' in regla) return consola.join('\n') === regla.consola.join('\n');
  if ('consolaIncluye' in regla) return consola.some((l) => l.includes(regla.consolaIncluye));
  if ('profundidad' in regla) return Math.max(0, ...pasos.map(profundidad)) >= regla.profundidad;
  if ('error' in regla) return conError && new RegExp(regla.error).test(ultimo!.texto + ' ' + (ultimo!.consola.at(-1) ?? ''));
  if ('sinError' in regla) return !conError;
  if ('recuerda' in regla) return pasos.some((p) => p.pila.some((m) => m.nota?.includes('(recordada)')));
  if ('codigo' in regla) return new RegExp(regla.codigo).test(codigo);
  return false;
}
