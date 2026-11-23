import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lecciones = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lecciones' }),
  schema: z.object({
    titulo: z.string(),
    /** slug de la sección en src/data/temario.ts */
    seccion: z.string(),
    /** slug del tema dentro de la sección */
    tema: z.string(),
    minutos: z.number(),
    resumen: z.string(),
    /** Párrafo inicial (HTML simple), va junto al pizarrón en la primera pantalla */
    intro: z.string(),
    /** id del visualizador principal en src/data/visualizaciones.ts */
    pizarron: z.string().optional(),
    /** false: el pizarrón principal no muestra la pila (antes de explicarla) */
    mostrarPila: z.boolean().default(true),
    /** 'variables': la columna del pizarrón muestra variables en vez de la pila */
    modoPizarron: z.enum(['pila', 'variables', 'eventloop']).default('pila'),
    /** Qué mirar en el pizarrón (va junto a él en la primera pantalla) */
    guia: z.object({ titulo: z.string(), texto: z.string() }).optional(),
    /** Nota ¡ojo! junto al pizarrón (HTML simple) */
    nota: z.string().optional(),
    ejercicios: z.array(z.string()).default([]),
  }),
});

// Reto del motor: uno al final de cada sección, mezcla los formatos de ejercicio de toda la sección
const retos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/retos' }),
  schema: z.object({
    /** slug de la sección en src/data/temario.ts */
    seccion: z.string(),
    minutos: z.number(),
    resumen: z.string(),
    /** Párrafo inicial (HTML simple) */
    intro: z.string(),
    nota: z.string().optional(),
    ejercicios: z.array(z.string()).min(1),
  }),
});

// Proyectos: la guía paso a paso de cada uno. El código vive en proyectos/<carpeta>/ (submódulo
// domina-js-proyectos); la solución de cada paso se lee de final/app.js (src/lib/pasos-proyecto.mjs)
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/proyectos' }),
  schema: z.object({
    /** slug de src/data/proyectos.ts */
    slug: z.string(),
    /** carpeta dentro de proyectos/ */
    carpeta: z.string(),
    /** horas aproximadas */
    horas: z.number(),
    /** Párrafo de apertura (HTML simple) */
    intro: z.string(),
    /** Lecciones que conviene tener frescas, como sección/tema */
    lecciones: z.array(z.string()),
  }),
});

export const collections = { lecciones, retos, proyectos };
