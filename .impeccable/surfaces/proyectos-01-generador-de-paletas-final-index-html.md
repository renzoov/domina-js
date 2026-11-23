---
version: 1
slug: "proyectos-01-generador-de-paletas-final-index-html"
primary_target: "proyectos/01-generador-de-paletas/final/index.html"
related_targets: ["proyectos/01-generador-de-paletas/final/estilos.css","proyectos/01-generador-de-paletas/final/app.js"]
---

# Generador de paletas (proyecto 1 de domina-js)

Scope: la aplicación terminada del proyecto 1, `proyectos/01-generador-de-paletas/final/`. Modo: Operate. JS puro, sin librerías, se abre con doble clic en index.html (file://). Su diseño es propio, no usa el pizarrón de domina-js.

Audiencia: personas que aprenden JS y construyen su primer proyecto completo. Tarea: generar paletas armónicas, fijar colores, revisar contraste, copiar y exportar. Restricción: el código se enseña paso a paso, así que app.js va ordenado por `// PASO n` … `// FIN PASO n`.

## Direction contract

THESIS: cada color es un chip de tinta plana de un abanico de imprenta, con su ficha técnica impresa debajo. Se niega a las columnas sin datos de la categoría (Coolors), donde la información aparece solo al pasar el mouse.

OWN-WORLD: una mesa grafito (#1c1d20) con cinco chips de papel (#f4f2ec): la tinta arriba y una franja de datos en tinta negra (#111). El magenta de proceso (#e4007c) es el único acento: la acción principal y el foco. Barlow Condensed para los códigos, en cifras tabulares; Barlow para la interfaz. Reglas de 1 px y estados como marcas impresas: lleno es fijado o elegido, hueco es libre. La escala tipográfica es corta: la jerarquía la llevan el peso y las mayúsculas.

STORY: la persona entiende al instante que son cinco colores con sus datos. Pulsa espacio, fija los que le gustan, mira el contraste, copia un hex o exporta las variables CSS, comparte el enlace o saca la paleta de una foto.

FIRST VIEWPORT: barra superior de 68 px con la marca (cinco tiras de la paleta actual y el nombre), las armonías en un control segmentado, deshacer y rehacer, «Desde una foto», «Exportar» y «Generar» en magenta. Debajo, cinco chips altos que llenan la mesa: N.º 01–05, la tinta en un 60–65 % y la ficha abajo (HEX grande, RGB, HSL, contraste contra blanco y negro con el mejor marcado en negro lleno, «Fijar» y «Copiar»). Al pie van los atajos y «5 de 5 ranuras · N fijadas». En el teléfono, los chips pasan a filas.

FORM: abanico de muestras de imprenta, candidato 3 de 7 de la lista propia, asignado por el sorteo. seed:195d8e30d54514d4. Movimiento propio: al generar, los chips libres se abren como un abanico desde la base (giro escalonado) y se asientan; los fijados no se mueven.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
