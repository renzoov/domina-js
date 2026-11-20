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
    modoPizarron: z.enum(['pila', 'variables']).default('pila'),
    /** Qué mirar en el pizarrón (va junto a él en la primera pantalla) */
    guia: z.object({ titulo: z.string(), texto: z.string() }).optional(),
    /** Nota ¡ojo! junto al pizarrón (HTML simple) */
    nota: z.string().optional(),
    ejercicios: z.array(z.string()).default([]),
  }),
});

export const collections = { lecciones };
