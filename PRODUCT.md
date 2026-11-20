# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (proyecto existente, Astro 7). Interactividad: delegated — se eligió JS puro dentro de componentes Astro (sin React) porque los visualizadores son máquinas de pasos simples y así el sitio sigue siendo estático y liviano; React queda como opción si un visualizador futuro lo justifica. Lecciones en MDX con content collections. Despliegue: aún no decidido; lo más probable es Cloudflare Pages (salida estática).

## Users

Personas hispanohablantes que aprenden JavaScript, desde quien empieza hasta quien ya programa y quiere entender cómo funciona el lenguaje por dentro. Llegan con una duda concreta ("¿cómo puede JS ser de un solo hilo?") o siguiendo un temario ordenado, y leen a su ritmo, normalmente con el editor abierto al lado.

## Product Purpose

Una web pública y gratuita para aprender JavaScript paso a paso en español, organizada en secciones con varios temas cada una. Cada tema combina explicación, código de ejemplo y, cuando el concepto es invisible (pila de llamadas, event loop, scope), un visualizador interactivo que se avanza paso a paso. Éxito: que el lector pueda contar con sus propias palabras qué hace el motor en cada línea.

## Positioning

Los conceptos internos de JS se muestran en movimiento: cada paso del visualizador resalta la línea que se ejecuta, muestra el estado del motor (pila, colas, consola) y lo explica en una frase, en español.

## Operating Context

Lectura en escritorio y en móvil; el lector avanza los visualizadores con botones o con el teclado. El contenido crece por secciones: la v1 trae la estructura completa del temario, con los temas futuros marcados como "próximamente".

## Capabilities and Constraints

- v1: portada, temario con secciones y temas, y una lección completa: "La pila de llamadas (call stack)", con su visualizador paso a paso (Anterior / Siguiente / Reiniciar).
- Los visualizadores funcionan a partir de datos (código + lista de pasos), así una lección nueva no necesita código nuevo.
- Sitio estático; no hay cuentas ni backend en v1. Por definir: guardar el progreso (probablemente localStorage), buscador, ejercicios y exámenes.

## Brand Commitments

Nombre: domina-js. Idioma: español.

Compromisos visuales fijados por el usuario (2026-11-20):
- **Fondo oscuro siempre.** El usuario lo pidió porque el fondo blanco le cansa la vista; el sitio no se diseña sobre fondo claro.
- **El amarillo del logo de JavaScript (#F7DF1E) es la base de la paleta**: cualquier dirección visual construye su paleta a partir de él.
- Le gustó la referencia "cracktro" de la demoscene (texto quieto y nítido sobre un vacío negro con capas que se mueven detrás). Es una referencia que le gusta, no una regla. Referencia que el usuario hizo explícita solo como estructura (secciones → temas, lección con navegación), no como diseño: aprenderust.dev.

## Evidence on Hand

Visualizador de referencia (capturas que dio el usuario): panel CALL STACK + código con líneas resaltadas + "Paso N de 8" + explicación + botones Anterior/Siguiente/Reiniciar. No hay testimonios, métricas ni número de usuarios: no se deben inventar.

## Product Principles

1. Mostrar antes que afirmar: si un concepto se puede visualizar, se visualiza paso a paso.
2. Un paso, una idea: cada paso cambia una sola cosa y la explica en una frase.
3. Español claro y preciso; los términos técnicos en inglés aparecen la primera vez junto a su traducción.
4. Crecer sin rehacer: las secciones y los visualizadores nuevos se agregan como contenido.

## Accessibility & Inclusion

Los visualizadores se pueden usar con teclado; cada paso se anuncia a lectores de pantalla (aria-live); se respeta prefers-reduced-motion; el contraste del código resaltado cumple WCAG AA.
