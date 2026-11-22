// Direcciones del sitio y del repositorio, en un solo lugar.

export const SITIO = 'https://domina-js.pages.dev';
export const REPO = 'https://github.com/renzoov/domina-js';
export const PERFIL = 'https://github.com/renzoov';

/** Página para elegir qué tipo de problema reportar (los formularios están en .github/ISSUE_TEMPLATE/) */
export const REPORTAR = `${REPO}/issues/new/choose`;

/**
 * Abre el formulario «Error en una lección o ejercicio» con la página y el título ya completados.
 * GitHub completa los campos del formulario que se pasan por su id (aquí, «pagina»).
 */
export function reportarLeccion(ruta: string, titulo: string, tipo: 'Lección' | 'Reto' = 'Lección'): string {
  const q = new URLSearchParams({
    template: '1-error-leccion.yml',
    title: `[${tipo}] ${titulo}: `,
    pagina: `${SITIO}${ruta}`,
  });
  return `${REPO}/issues/new?${q}`;
}
