// Los 30 proyectos de la sección «Proyectos», en orden (plan completo en docs/PROYECTOS.md, sección 10).
// Por ahora solo alimenta la portada de /proyectos; cuando exista cada guía, estos datos pasarán al
// frontmatter de la colección `proyectos`.

export type Nivel = 'facil' | 'intermedio' | 'avanzado' | 'final';

/**
 * Tamaño de la tarjeta en el bento (rejilla de 12 columnas):
 * - chico: 3 columnas;
 * - destacado: 6 columnas y 2 filas, a la izquierda o a la derecha (el hueco lo llenan cuatro chicos);
 * - ancho: 6 columnas; tercio: 4 columnas;
 * - final: las 12 columnas.
 */
export type Tamano = 'chico' | 'destacado' | 'destacado-der' | 'ancho' | 'tercio' | 'final';

export interface Proyecto {
  numero: number;
  slug: string;
  titulo: string;
  /** Una o dos líneas, máximo 110 caracteres */
  resumen: string;
  nivel: Nivel;
  /** Hasta tres, para las etiquetas de la tarjeta */
  temas: string[];
  tamano: Tamano;
  /** Solo en las tarjetas destacadas: lo que hace la aplicación, en tres o cuatro frases cortas */
  puntos?: string[];
  /** Necesita Node (proyectos con servidor) */
  servidor?: boolean;
  /** Ya tiene su guía: la tarjeta enlaza a ella. Si no, se muestra apagada, con «Próximamente» */
  publicado?: boolean;
}

export const NIVELES: Record<Nivel, { nombre: string; plural: string; color: string }> = {
  facil: { nombre: 'Fácil', plural: 'Fáciles', color: 'lima' },
  intermedio: { nombre: 'Intermedio', plural: 'Intermedios', color: 'azul' },
  avanzado: { nombre: 'Avanzado', plural: 'Avanzados', color: 'naranja' },
  final: { nombre: 'Proyecto final', plural: 'Proyecto final', color: 'lila' },
};

export const proyectos: Proyecto[] = [
  // ── Fácil ──
  { numero: 1, slug: 'generador-de-paletas', titulo: 'Generador de paletas', nivel: 'facil', tamano: 'chico', publicado: true,
    resumen: 'La barra espaciadora genera colores armónicos; mide su contraste y saca una paleta de tu foto.',
    temas: ['Teclado', 'URL', 'Canvas'] },
  { numero: 2, slug: 'pomodoro', titulo: 'Temporizador Pomodoro', nivel: 'facil', tamano: 'chico',
    resumen: 'Bloques de trabajo y descanso que no se atrasan, aunque la pestaña quede escondida.',
    temas: ['Timers', 'Event loop', 'Notificaciones'] },
  { numero: 3, slug: 'mecanografia', titulo: 'Reto de mecanografía', nivel: 'facil', tamano: 'chico',
    resumen: 'Escribe contra reloj: cuenta bien los acentos, la ñ y los emojis, y dibuja tu resultado.',
    temas: ['Unicode', 'Regex', 'SVG'] },
  { numero: 4, slug: 'relojes-del-mundo', titulo: 'Relojes del mundo', nivel: 'facil', tamano: 'chico',
    resumen: 'Relojes analógicos en SVG, uno por ciudad, que se reordenan arrastrándolos.',
    temas: ['Temporal', 'Intl', 'Arrastrar'] },

  // ── Intermedio ──
  { numero: 5, slug: 'tienda-pequena', titulo: 'Tienda pequeña', nivel: 'intermedio', tamano: 'destacado',
    resumen: 'Un catálogo con la paginación en la URL, un carrito que se sincroniza entre pestañas y un pago simulado.',
    puntos: ["10 productos por página, y el botón Atrás funciona", "El número del carrito sube sin recargar, también en otra pestaña", "Vista rápida en un popover y cantidades editables", "Un pago simulado: «Procesando…» y «¡Pago confirmado!»"],
    temas: ['Clases', 'Eventos propios', 'Popover'] },
  { numero: 6, slug: 'explorador-de-arte', titulo: 'Explorador con scroll infinito', nivel: 'intermedio', tamano: 'chico',
    resumen: 'Obras del Art Institute of Chicago que se cargan solas al llegar al final.',
    temas: ['fetch', 'Observers', '<template>'] },
  { numero: 7, slug: 'autocompletado', titulo: 'Buscador con autocompletado', nivel: 'intermedio', tamano: 'chico',
    resumen: 'Busca en Wikipedia mientras escribes, sin importar las tildes.',
    temas: ['Debounce', 'AbortController', 'Accesibilidad'] },
  { numero: 8, slug: 'notificaciones-toast', titulo: 'Notificaciones toast', nivel: 'intermedio', tamano: 'chico',
    resumen: 'Tu propia librería de avisos, que vas a reutilizar en otros proyectos.',
    temas: ['Web Components', 'Módulos', 'Animaciones'] },
  { numero: 9, slug: 'calendario', titulo: 'Calendario con eventos', nivel: 'intermedio', tamano: 'chico',
    resumen: 'Anota eventos, muévelos de día y expórtalos a tu calendario.',
    temas: ['Temporal', '<dialog>', 'IndexedDB'] },
  { numero: 10, slug: 'control-de-gastos', titulo: 'Control de gastos con reactividad propia', nivel: 'intermedio', tamano: 'destacado-der',
    resumen: 'Gastos en varias monedas, con gráfico y filtros, sobre un sistema reactivo hecho con Proxy.',
    puntos: ["Tasas de cambio reales, guardadas en caché", "Filtros que se combinan y un gráfico que se redibuja solo", "Deshacer cualquier cambio", "Importar y exportar CSV"],
    temas: ['Proxy', 'Microtareas', 'SVG'] },
  { numero: 11, slug: 'puzzle-deslizante', titulo: 'Puzzle deslizante con tu foto', nivel: 'intermedio', tamano: 'chico',
    resumen: 'El rompecabezas de 15 piezas, con tu imagen y un desorden que siempre tiene solución.',
    temas: ['Matrices', 'Canvas', 'Pointer Events'] },
  { numero: 12, slug: 'dividir-la-cuenta', titulo: 'Dividir la cuenta', nivel: 'intermedio', tamano: 'chico',
    resumen: 'Quién le debe a quién, con la menor cantidad de transferencias y en un solo enlace.',
    temas: ['reduce', 'Intl', 'Compresión'] },
  { numero: 13, slug: 'reserva-de-asientos', titulo: 'Reserva de asientos', nivel: 'intermedio', tamano: 'chico',
    resumen: 'Si dos pestañas piden la misma butaca, solo una se la lleva.',
    temas: ['SVG', 'Web Locks', 'BroadcastChannel'] },
  { numero: 14, slug: 'tarjetas-de-idiomas', titulo: 'Tarjetas de idiomas con voz', nivel: 'intermedio', tamano: 'chico',
    resumen: 'Vocabulario con repetición espaciada, que pronuncia cada palabra y te escucha decirla.',
    temas: ['Generadores', 'Voz', 'IndexedDB'] },
  { numero: 15, slug: 'recetario', titulo: 'Recetario en modo cocina', nivel: 'intermedio', tamano: 'ancho',
    resumen: 'Recetas que escalan las porciones, con temporizadores por paso y la pantalla siempre encendida.',
    temas: ['Promesas', 'Wake Lock', 'Voz'] },
  { numero: 16, slug: 'bitacora-gps', titulo: 'Bitácora de paseos con GPS', nivel: 'intermedio', tamano: 'ancho',
    resumen: 'Registra un paseo y dibuja el recorrido sin librerías de mapas. Funciona sin conexión.',
    temas: ['Geolocalización', 'SVG', 'Service Worker'] },

  // ── Avanzado ──
  { numero: 17, slug: 'galeria-spa', titulo: 'Galería SPA con compresor', nivel: 'avanzado', tamano: 'destacado',
    resumen: 'Una galería con router propio y transiciones, que comprime tus fotos sin salir del navegador.',
    puntos: ["Un router propio, con transiciones animadas entre páginas", "Subir fotos arrastrándolas", "Comprimirlas a WebP en un Web Worker, sin servidor", "Comparar el antes y el después"],
    temas: ['Router', 'View Transitions', 'Workers'] },
  { numero: 18, slug: 'editor-markdown', titulo: 'Editor de Markdown', nivel: 'avanzado', tamano: 'chico',
    resumen: 'Vista previa, varios documentos y el parser escrito por ti.',
    temas: ['Regex', 'Recursión', 'XSS'] },
  { numero: 19, slug: 'boveda-de-secretos', titulo: 'Bóveda de secretos', nivel: 'avanzado', tamano: 'chico',
    resumen: 'Genera contraseñas seguras y cifra mensajes que se comparten por un enlace.',
    temas: ['Web Crypto', 'Binarios', 'URL'] },
  { numero: 20, slug: 'visor-json', titulo: 'Visor de JSON gigante', nivel: 'avanzado', tamano: 'chico',
    resumen: 'Un árbol que aguanta 100.000 nodos, con búsqueda y la línea exacta de cada error.',
    temas: ['Generadores', 'Workers', 'Rendimiento'] },
  { numero: 21, slug: 'grabador', titulo: 'Grabador de pantalla y cámara', nivel: 'avanzado', tamano: 'chico',
    resumen: 'Graba la pantalla con tu cámara en un recuadro, y descarga el video.',
    temas: ['MediaRecorder', 'Canvas', 'using'] },
  { numero: 22, slug: 'editor-de-subtitulos', titulo: 'Editor de subtítulos', nivel: 'avanzado', tamano: 'destacado-der',
    resumen: 'Carga un video, escribe los subtítulos sobre su línea de tiempo y descarga el archivo .vtt.',
    puntos: ["Una línea de tiempo para mover y estirar cada subtítulo", "Negrita y cursiva sobre el texto", "Atajos J, K y L, como en los editores de video", "Descargar el archivo .vtt listo para usar"],
    temas: ['Video', 'Pointer Events', 'contenteditable'] },
  { numero: 23, slug: 'auditor-de-accesibilidad', titulo: 'Auditor de accesibilidad', nivel: 'avanzado', tamano: 'chico',
    resumen: 'Un script que revisa cualquier página: alt, contraste, títulos fuera de orden.',
    temas: ['TreeWalker', 'Herencia', 'Shadow DOM'] },
  { numero: 24, slug: 'la-aplicacion-rota', titulo: 'La aplicación rota', nivel: 'avanzado', tamano: 'chico',
    resumen: 'Funciona mal a propósito. Encuentra cada problema con las DevTools y arréglalo.',
    temas: ['DevTools', 'Memoria', 'Rendimiento'] },
  { numero: 25, slug: 'terminal', titulo: 'Terminal en el navegador', nivel: 'avanzado', tamano: 'chico',
    resumen: 'ls, cd, tuberías e historial, con los archivos guardados en el navegador.',
    temas: ['OPFS', 'Generadores', 'Bit a bit'] },
  { numero: 26, slug: 'chat', titulo: 'Chat en tiempo real', nivel: 'avanzado', tamano: 'chico', servidor: true,
    resumen: 'Primero entre pestañas y sin servidor; después, con un servidor Node sin librerías.',
    temas: ['Server-Sent Events', 'node:sqlite', 'BroadcastChannel'] },
  { numero: 27, slug: 'transferencia-p2p', titulo: 'Transferencia de archivos', nivel: 'avanzado', tamano: 'tercio',
    resumen: 'Del teléfono a la computadora, directo, sin subir el archivo a ningún servidor.',
    temas: ['WebRTC', 'ArrayBuffer', 'SHA-256'] },
  { numero: 28, slug: 'acortador', titulo: 'Acortador de enlaces', nivel: 'avanzado', tamano: 'tercio', servidor: true,
    resumen: 'Un servidor Node que acorta enlaces, redirige y cuenta los clics.',
    temas: ['node:http', 'node:sqlite', 'Cookies'] },
  { numero: 29, slug: 'blog-por-terminal', titulo: 'Blog estático por terminal', nivel: 'avanzado', tamano: 'tercio', servidor: true,
    resumen: 'Un comando que convierte una carpeta de Markdown en un sitio web.',
    temas: ['CLI', 'Streams', 'worker_threads'] },

  // ── Proyecto final ──
  { numero: 30, slug: 'kanban-offline', titulo: 'Kanban offline', nivel: 'final', tamano: 'final',
    resumen: 'Un tablero de tareas instalable que funciona sin conexión, armado con las herramientas de un equipo de verdad.',
    temas: ['Vite', 'TypeScript', 'Vitest', 'ESLint', 'IndexedDB', 'Service Worker'] },
];

for (const p of proyectos) {
  if (p.resumen.length > 110 && p.nivel !== 'final') throw new Error(`Proyecto ${p.numero}: el resumen pasa de 110 caracteres (${p.resumen.length})`);
  if (p.temas.length > 3 && p.nivel !== 'final') throw new Error(`Proyecto ${p.numero}: más de tres temas`);
}
