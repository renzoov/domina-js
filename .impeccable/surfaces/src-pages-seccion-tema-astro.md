---
version: 1
slug: "src-pages-seccion-tema-astro"
primary_target: "src/pages/[seccion]/[tema].astro"
related_targets: ["src/pages/index.astro","src/pages/temario.astro"]
---

## Scope

Lecciones de domina-js (ruta `/[seccion]/[tema]`), más el temario y la portada en el mismo mundo. Modo: Read para lecciones y temario; la portada demuestra el visualizador funcionando en la primera pantalla. Audiencia: hispanohablantes que aprenden JS. Tarea: entender un concepto invisible viéndolo paso a paso, predecir y practicar.

## Direction contract

THESIS: La lección es una clase en el pizarrón: el maestro escribe, subraya en amarillo lo que importa y borra lo que sale de la pila. Rechaza la documentación por defecto (barra lateral + tarjetas sobre gris neutro) y la consola oscura de editor.

OWN-WORLD: Pizarrón verde-negro #1B2A23 con textura de tiza (gradientes finos, manchas de borrado) dentro de un marco más oscuro con su bandeja de tizas al pie. Tiza blanca #ECEAE2 para el texto, tiza amarilla #F7DF1E solo para subrayar, marcar lo activo y lo que cambia, tiza rosa #F2A7B8 para las notas «¡ojo!», salvia #8FB7A1 para metadatos y sintaxis. Cabin Sketch solo en títulos y anotaciones a mano; Atkinson Hyperlegible para leer; Fira Code para código. Bordes de tiza con radios irregulares y subrayados SVG trazados a mano. Los iconos son trazos SVG de tiza.

STORY: El lector llega con la duda («¿cómo hace JS una cosa a la vez?»), lee una introducción corta, avanza el visualizador paso a paso prediciendo qué pasa, entiende LIFO y el stack overflow, y lo practica en cuatro ejercicios (Sé el motor, Ordena la salida, Detective, Laboratorio).

FIRST VIEWPORT: Logo de tiza arriba a la izquierda y la sección arriba a la derecha. Columna izquierda de 220px con los temas de la sección (el actual subrayado en amarillo). Título en Cabin Sketch de unos 72px con subrayado amarillo de tiza, metadatos debajo, y el párrafo inicial a la medida de lectura. A la derecha, el visualizador «En el pizarrón»: código, pila, consola, explicación, línea de tiempo y controles. La acción principal es «Siguiente» en tiza amarilla.

FORM: Pizarrón y tiza amarilla, posición 1 de mi lista ordenada (IMPECCABLE’S PICK, ronda de re-roll 1). seed:6dd47b018115be2b. Interacción distintiva: la tiza. Un marco que entra a la pila se escribe (revelado de izquierda a derecha); uno que sale se borra con un borrón (blur + fundido). El subrayado amarillo se traza bajo la línea activa. Gramática de movimiento: escribir 280ms con ease-out exponencial, borrar 220ms; con reduced-motion los cambios son instantáneos.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
