# Plan: sección «Librerías»

> Estado: **planificado, sin implementar.** En la navegación ya está el botón «Librerías» (tiza naranja), tachado y con el aviso «Próximamente».
> Es la continuación de [`PROYECTOS.md`](PROYECTOS.md): primero los 30 proyectos con JavaScript solo, después estos 10 con las librerías más usadas para hacer aplicaciones.

## 1. Objetivo

En el trabajo real casi nadie escribe todo desde cero: se apoya en librerías probadas. Esta sección enseña **las más usadas para hacer aplicaciones**, en 10 proyectos guiados. No son frameworks de interfaz (React, Vue y compañía están en la sección 17 del curso, a alto nivel). Son piezas concretas: validar datos, guardar contraseñas, hablar con una base de datos, dibujar un mapa, generar un PDF.

Tres ideas guían la sección:

- **Primero lo nativo, después la librería.** Quien llega acá ya hizo los 30 proyectos con JavaScript solo. Cada proyecto muestra qué resuelve la librería que antes había que programar a mano, y cuándo **no** hace falta instalarla.
- **Comparar.** Varias librerías aparecen de a pares para ver sus diferencias: ws y Socket.IO, Prisma y Drizzle, bcrypt y argon2, axios y `fetch`, uuid y `crypto.randomUUID()`. Y los proyectos con servidor se hacen **dos veces**: con `node:http` y con Express.
- **Pocas librerías por proyecto:** dos o tres, cuatro como máximo, para que se entienda qué hace cada una.

## 2. Formato

Es el mismo de la sección Proyectos (ver `PROYECTOS.md`, secciones 2 a 5), con estas diferencias:

- **Se instala con npm.** Cada proyecto trae un `package.json` con las versiones **fijas** (sin `^`), para que la guía coincida siempre con lo instalado. El primer paso es `npm install`. Los zips no incluyen `node_modules`.
- **«Lo nuevo de este proyecto» presenta las librerías:** qué problema resuelven, cómo se instalan, su documentación oficial (con el componente `Oficial`, que abre otra pestaña) y, cuando aplica, **qué ofrece ya el lenguaje** sin instalar nada.
- **Los proyectos en el navegador** usan Vite para importar las librerías (lo enseña la lección *Vite y el bundling moderno*).
- **Los proyectos con servidor (7 a 10) tienen dos versiones**, ver la sección 4.
- **Diseño:** el sistema del sitio, con el **naranja** (`--naranja`) como color de la sección, para distinguirla del azul de Rayos X y del lila de Proyectos.

## 3. Las 24 librerías

| Para qué | Librerías |
|---|---|
| Validar datos | **Zod** |
| Leer y escribir CSV | **Papa Parse** |
| Identificadores únicos | **uuid** (frente a `crypto.randomUUID()`) |
| Markdown y HTML seguro | **marked**, **DOMPurify** |
| Arrastrar y animar | **SortableJS**, **GSAP** |
| Mapas, búsqueda y almacenamiento | **Leaflet**, **Fuse.js**, **idb** |
| Peticiones y gráficos | **axios** (frente a `fetch`), **Chart.js** |
| Pruebas | **MSW** |
| Tiempo real y registros | **ws**, **Socket.IO**, **pino** |
| Bases de datos | **Prisma**, **Drizzle** |
| Contraseñas y sesiones | **bcrypt**, **argon2**, **jose** |
| Archivos | **sharp**, **pdf-lib**, **fflate** |
| Servidor (alternativa en 7 a 10) | **Express** |

**Lo que reemplaza a librerías viejas** (Temporal, `structuredClone`, `Object.groupBy`, `node --env-file`, `styleText` y `parseArgs`) ya se usa en los 30 proyectos de JavaScript, así que acá no se repite. Solo se suman dos comparaciones: `crypto.randomUUID()` con uuid (proyecto 1) y `fetch` con axios (proyecto 5).

## 4. Los servidores: nativo y con Express

Los proyectos 7, 8, 9 y 10 se hacen **dos veces**, con la misma lógica, la misma base de datos y las mismas pruebas:

1. **Versión nativa**, con `node:http`, como en los proyectos de JavaScript: rutas, lectura del cuerpo, encabezados y errores, todo a mano.
2. **Versión con Express**, la librería de servidor más usada: `app.get`, middlewares como `express.json()`, `express.static` y un manejador de errores, con Express 5, que ya atrapa los errores de las funciones `async`.

Cada proyecto termina con una **tabla de comparación** entre las dos versiones: cuántas líneas ocupa cada parte, qué hay que resolver a mano en `node:http` (rutas con parámetros, leer el cuerpo, `Content-Type`, códigos de estado, errores) y qué agrega Express. Las librerías del proyecto (Socket.IO, Prisma, Drizzle…) se usan igual en las dos: Socket.IO y ws se enganchan al mismo servidor HTTP en ambos casos.

En el repositorio, cada uno tiene `final-nativo/` y `final-express/`, y la guía tiene los pasos comunes, más los pasos propios de cada versión en pestañas.

## 5. Lista de proyectos

### Fácil

**1. Importador de contactos** · Papa Parse, Zod, uuid
Cargas un CSV con miles de contactos y se lee por partes, sin congelar la página. Zod valida cada fila (correo, teléfono, fecha) y marca el error en la celda exacta, para corregirlo ahí mismo. Cada contacto recibe un id: se compara `crypto.randomUUID()`, que ya viene incluido y alcanza casi siempre, con la librería uuid, útil para la versión 7 (ids ordenables por fecha, buenos para bases de datos). Al final se exporta el CSV limpio.

**2. Notas en Markdown seguras** · marked, DOMPurify
Una libreta de notas en Markdown con vista previa. Una nota «trampa» trae un ataque XSS escondido: primero se ve cómo funciona y después cómo DOMPurify lo neutraliza. Se compara marked con el parser propio del proyecto 18 de la sección Proyectos.

**3. Planificador del día animado** · SortableJS, GSAP
Las tareas se arrastran entre mañana, tarde y noche, también con el dedo. GSAP anima la entrada de cada tarea, el momento de completarla y el cambio de hora del día con una línea de tiempo, y respeta `prefers-reduced-motion`.

### Intermedio

**4. Explorador de ciudades** · Leaflet, Fuse.js, idb
Un mapa de OpenStreetMap donde buscas ciudades aunque escribas mal el nombre («barselona» encuentra Barcelona). Las favoritas se marcan en el mapa y se guardan con idb, comparado con el IndexedDB sin librerías de los proyectos de JavaScript.

**5. Panel del clima** · axios, Chart.js
El pronóstico de las ciudades favoritas del proyecto 4, con la API abierta de Open-Meteo (sin clave). Con axios: interceptores para el estado de carga y los errores, tiempo máximo de espera y cancelación; la misma petición también con `fetch`, para ver qué agrega axios y por qué muchos proyectos ya no la usan. Gráficos de temperatura y lluvia con Chart.js, con una tabla equivalente para los lectores de pantalla.

**6. Pruebas sin internet** · MSW
Pruebas para el panel del clima sin depender de la API real. MSW simula las respuestas (la normal, un error 500, una respuesta lenta, datos vacíos), en las pruebas con Vitest y también al desarrollar en el navegador.

### Avanzado (servidor con Node, en versión nativa y con Express)

**7. Chat con salas** · ws, Socket.IO, Zod, pino
Parte 1, con ws: un chat básico donde hay que programar a mano el latido (*ping* y *pong*), el envío a todos y la reconexión. Parte 2, el mismo chat con Socket.IO: salas, confirmación de cada mensaje y reconexión automática. En las dos, Zod valida cada mensaje y pino registra lo que pasa. Las páginas y las rutas HTTP del chat, con `node:http` y con Express.

**8. Biblioteca de préstamos** · Prisma, bcrypt
Libros, socios y préstamos, con relaciones entre tablas y migraciones para cambiar la base sin perder datos. Los socios se registran con contraseña, guardada con bcrypt, y la sesión se mantiene con una cookie. La API, con `node:http` y con Express.

**9. API de pedidos para la tienda** · Drizzle, argon2, jose, Zod
El backend de la tienda (proyecto 5 de la sección Proyectos): productos con paginación, el carrito convertido en pedido dentro de una transacción, y usuarios con contraseñas en argon2 y tokens JWT con jose. Zod valida cada petición. Hace par con el 8 para comparar Drizzle con Prisma, argon2 con bcrypt y tokens con cookies. La API, con `node:http` y con Express.

**10. Generador de certificados** · sharp, pdf-lib, fflate
Subes un logo y una lista de nombres. sharp ajusta el logo (tamaño y formato), pdf-lib arma un certificado en PDF por persona y fflate los junta en un solo ZIP para descargar. El servidor que recibe los archivos y entrega el ZIP, con `node:http` y con Express.

## 6. Qué librería va en cada proyecto

| Librería | Proyecto |
|---|---|
| Zod | 1, 7, 9 |
| Papa Parse, uuid | 1 |
| marked, DOMPurify | 2 |
| SortableJS, GSAP | 3 |
| Leaflet, Fuse.js, idb | 4 |
| axios, Chart.js | 5 |
| MSW | 6 |
| ws, Socket.IO, pino | 7 |
| Prisma, bcrypt | 8 |
| Drizzle, argon2, jose | 9 |
| sharp, pdf-lib, fflate | 10 |
| Express | 7, 8, 9, 10 (versión alternativa) |

## 7. Decisiones

**Tomadas (2026-11-23):**

- Son 10 proyectos con 24 librerías, más Express como alternativa en los cuatro proyectos con servidor.
- Nada de frameworks de interfaz, ni Bun, ni Deno.
- Los proyectos con servidor se hacen con `node:http` y con Express, para comparar.

**Pendientes:**

- Qué versión de cada librería se fija al empezar a construir.
- Si la sección se publica junto con Proyectos o después.
- El proyecto piloto.
