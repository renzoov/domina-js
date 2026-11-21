// Convierte los bloques de código de la lección en "pizarras de prueba":
// barra con nombre de archivo, botón Copiar y, si el ejemplo imprime algo, botón Ejecutar.

const LIMITE_MS = 1500;
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
    // Los ejemplos asíncronos imprimirían después de que el worker responde, y los módulos
    // necesitan archivos que el sandbox no tiene: se dejan solo para copiar
    const asincrono =
      /\b(setTimeout|setInterval|fetch)\s*\(|\bawait\b/.test(codigo) || /^\s*(import|export)\s/m.test(codigo);
    const ejecutable = /^(js|javascript)$/.test(lenguaje) && /console\.log\s*\(/.test(codigo) && !asincrono;

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
      correr.addEventListener('click', async () => {
        correr.disabled = true;
        const r = await ejecutar(codigo);
        correr.disabled = false;
        salida!.hidden = false;
        salida!.classList.toggle('error', !!r.error || r.tiempo);
        const lineas = r.tiempo ? ['El ejemplo tardó demasiado y se detuvo.'] : [...r.salida, ...(r.error ? [r.error] : [])];
        salida!.innerHTML = `<span class="cv-prompt">$ node ${NOMBRES.js}</span>\n${lineas.map((l) => l.replace(/&/g, '&amp;').replace(/</g, '&lt;')).join('\n') || '(sin salida)'}`;
      });
      acciones.append(correr);
    }
    barra.append(acciones);

    pre.replaceWith(figura);
    figura.append(barra, pre);
    if (salida) figura.append(salida);
  });
}
