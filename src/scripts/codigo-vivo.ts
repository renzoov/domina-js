// Convierte los bloques de código de la lección en "pizarras de prueba":
// barra con nombre de archivo, botón Copiar y, si el ejemplo imprime algo, botón Ejecutar.

import { ejecutarEnPagina, usaFoco } from './sandbox-pagina';

const LIMITE_MS = 3000;
const NOMBRES: Record<string, string> = { js: 'ejemplo.js', javascript: 'ejemplo.js', bash: 'terminal', sh: 'terminal', html: 'index.html', css: 'estilos.css', json: 'datos.json' };

const icono = (d: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const JUGAR = 'M7.4 5.2c4 2.1 7.9 4.4 11.6 6.9-3.8 2.4-7.6 4.8-11.5 6.9-.3-4.6-.3-9.2-.1-13.8z';
const COPIAR = 'M8.5 8.4h10v11.1h-10zM5.5 15.6V4.5h10';

export function ejecutar(codigo: string): Promise<{ salida: string[]; error: string | null; tiempo: boolean }> {
  return new Promise((resolver) => {
    const w = new Worker(new URL('./lab-worker.ts', import.meta.url), { type: 'module' });
    const reloj = setTimeout(() => {
      w.terminate();
      resolver({ salida: [], error: null, tiempo: true });
    }, LIMITE_MS);
    w.onmessage = (e) => {
      clearTimeout(reloj);
      w.terminate();
      resolver({ ...e.data, tiempo: false });
    };
    w.postMessage({ codigo, pruebas: [] });
  });
}

export function iniciarCodigoVivo(raiz: ParentNode = document) {
  raiz.querySelectorAll<HTMLPreElement>('.articulo > pre.astro-code').forEach((pre) => {
    if (pre.closest('.codigo-vivo')) return;
    const lenguaje = pre.dataset.language || 'texto';
    const codigo = pre.innerText.replace(/\n$/, '');
    // Se dejan solo para copiar los ejemplos que necesitan lo que el sandbox no tiene:
    // red (fetch), almacenamiento, archivos (módulos) o sintaxis que aún no existe
    const asincrono =
      /\bfetch\s*\(/.test(codigo) ||
      /\b(localStorage|sessionStorage|indexedDB|caches|serviceWorker)\b|document\.cookie/.test(codigo) ||
      /^\s*(import|export)\s/m.test(codigo) ||
      /\bimport\s*(\.\s*meta\b|\()|\brequire\s*\(/.test(codigo) ||
      // Código de servidor: Node.js, Deno y Bun
      /\b(process|Deno|Bun|__dirname|__filename)\b/.test(codigo) ||
      // Continuación de un ejemplo de Node con una base de datos (node:sqlite) abierta más arriba
      /\b(DatabaseSync|db\.(prepare|exec))\b/.test(codigo) ||
      // APIs que el iframe aislado no tiene o no deja usar: red en vivo, permisos, cámara, sonido
      /\bnavigator\.(clipboard|share|geolocation|wakeLock|mediaDevices|locks|storage|permissions)\b/.test(codigo) ||
      /\b(new Notification|Notification\.|WebSocket|EventSource|RTCPeerConnection|MediaRecorder|AudioContext|XMLHttpRequest|PerformanceObserver|showOpenFilePicker|showSaveFilePicker|requestFullscreen)\b/.test(codigo) ||
      // Propuestas que los navegadores todavía no ejecutan: decorators y chunking de iteradores
      /^\s*@\w/m.test(codigo) ||
      /\.(chunks|windows)\s*\(/.test(codigo);
    const ejecutable = /^(js|javascript)$/.test(lenguaje) && /console\.\w+\s*\(/.test(codigo) && !asincrono;
    // Los ejemplos que usan la página corren en un iframe con DOM, y se ve el resultado
    const usaPagina = /\b(document|window|navigator|customElements|HTMLElement)\b/.test(codigo);

    const figura = document.createElement('figure');
    figura.className = `codigo-vivo lang-${lenguaje}`;
    const barra = document.createElement('div');
    barra.className = 'cv-barra';
    barra.innerHTML = `<span class="cv-puntos" aria-hidden="true"><i></i><i></i><i></i></span><span class="cv-nombre">${NOMBRES[lenguaje] ?? lenguaje}</span>`;
    const acciones = document.createElement('span');
    acciones.className = 'cv-acciones';

    const copiar = document.createElement('button');
    copiar.type = 'button';
    copiar.className = 'cv-btn';
    copiar.innerHTML = `${icono(COPIAR)}<span>Copiar</span>`;
    copiar.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codigo);
        copiar.querySelector('span')!.textContent = '¡Copiado!';
      } catch {
        copiar.querySelector('span')!.textContent = 'No se pudo copiar';
      }
      setTimeout(() => (copiar.querySelector('span')!.textContent = 'Copiar'), 1600);
    });
    acciones.append(copiar);

    let salida: HTMLOutputElement | null = null;
    if (ejecutable) {
      const correr = document.createElement('button');
      correr.type = 'button';
      correr.className = 'cv-btn cv-correr';
      correr.innerHTML = `${icono(JUGAR)}<span>Ejecutar</span>`;
      salida = document.createElement('output');
      salida.className = 'cv-salida';
      salida.hidden = true;
      salida.setAttribute('aria-live', 'polite');
      let vistaPagina: HTMLIFrameElement | null = null;
      correr.addEventListener('click', async () => {
        correr.disabled = true;
        if (usaPagina && !vistaPagina) {
          vistaPagina = document.createElement('iframe');
          vistaPagina.className = 'cv-vista';
          vistaPagina.title = 'La página que arma el ejemplo';
          figura.insertBefore(vistaPagina, salida);
        }
        // Que la página del ejemplo quede a la vista: fuera de la pantalla el navegador no la dibuja,
        // y sin cuadros no llegan algunos eventos (el close de un <dialog>)
        vistaPagina?.scrollIntoView({ block: 'nearest' });
        const r = usaPagina ? await ejecutarEnPagina('', codigo, [], vistaPagina!, LIMITE_MS, usaFoco(codigo)) : await ejecutar(codigo);
        correr.disabled = false;
        salida!.hidden = false;
        salida!.classList.toggle('error', !!r.error || r.tiempo);
        const lineas = r.tiempo ? ['El ejemplo tardó demasiado y se detuvo.'] : [...r.salida, ...(r.error ? [r.error] : [])];
        salida!.innerHTML = `<span class="cv-prompt">${usaPagina ? 'Consola del navegador' : `$ node ${NOMBRES.js}`}</span>\n${lineas.map((l) => l.replace(/&/g, '&amp;').replace(/</g, '&lt;')).join('\n') || '(sin salida)'}`;
      });
      acciones.append(correr);
    }
    barra.append(acciones);

    pre.replaceWith(figura);
    figura.append(barra, pre);
    if (salida) figura.append(salida);
  });
}
