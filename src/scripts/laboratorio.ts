import { EditorView } from 'codemirror';
import { extensionesTiza } from './editor-tiza';
import { marcarEjercicio } from './progreso';
import { ejecutarEnPagina, usaFoco } from './sandbox-pagina';

const LIMITE_MS = 4500;

export function iniciarLaboratorios() {
  document.querySelectorAll<HTMLElement>('[data-lab]').forEach((el) => {
    if (el.dataset.listo) return;
    el.dataset.listo = '1';
    iniciar(el);
  });
}

function iniciar(el: HTMLElement) {
  const config = JSON.parse(el.querySelector('[data-config]')!.textContent || '{}') as {
    inicial: string;
    verificaciones: string[];
    pistas: string[];
    pagina?: string;
  };
  const marcoPagina = el.querySelector<HTMLIFrameElement>('[data-vista]');
  const id = el.dataset.id!;
  const contenedor = el.querySelector<HTMLElement>('[data-editor]')!;
  const respaldo = contenedor.querySelector('textarea')!;
  const checks = Array.from(el.querySelectorAll<HTMLLIElement>('[data-checks] li'));
  const salida = el.querySelector<HTMLOutputElement>('[data-salida]')!;
  const btnPista = el.querySelector<HTMLButtonElement>('[data-pista]')!;
  const pistaN = el.querySelector<HTMLElement>('[data-pista-n]')!;
  const listaPistas = el.querySelector<HTMLOListElement>('[data-pistas]')!;
  const btnSolucion = el.querySelector<HTMLButtonElement>('[data-ver-solucion]')!;
  const solucion = el.querySelector<HTMLElement>('[data-solucion]')!;

  let worker: Worker | null = null;
  let reloj: number | undefined;
  let espera: number | undefined;
  let pistasDadas = 0;
  let intentos = 0;
  // La primera ejecución (al cargar) muestra el estado inicial y no cuenta como intento
  let primera = true;

  const vista = new EditorView({
    doc: respaldo.value,
    extensions: [
      ...extensionesTiza,
      EditorView.contentAttributes.of({ 'aria-label': 'Tu código' }),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) programar();
      }),
    ],
  });
  // Si una línea no entra, el editor se desplaza de lado: con el teclado también tiene que poder hacerse
  vista.scrollDOM.tabIndex = 0;
  respaldo.remove();
  setTimeout(ejecutar, 0);
  contenedor.querySelector('label')?.remove();
  contenedor.append(vista.dom);

  function nuevoWorker() {
    worker?.terminate();
    worker = new Worker(new URL('./lab-worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      clearTimeout(reloj);
      pintar(e.data);
    };
  }

  function programar() {
    clearTimeout(espera);
    espera = window.setTimeout(ejecutar, 600);
  }

  let turno = 0;
  function ejecutar() {
    if (config.pagina !== undefined && marcoPagina) {
      // Con página: corre en un iframe visible, con DOM. Solo vale la ejecución más reciente.
      // Las verificaciones hacen clics y cambian la página: corren en una copia oculta,
      // y la vista visible muestra solo lo que hizo el código del lector.
      const mio = ++turno;
      const codigo = vista.state.doc.toString();
      Promise.all([
        ejecutarEnPagina(config.pagina, codigo, [], marcoPagina, LIMITE_MS),
        // Si el ejercicio trata del foco, la copia de las verificaciones lo necesita mientras corre
        ejecutarEnPagina(config.pagina, codigo, config.verificaciones, undefined, LIMITE_MS, usaFoco(codigo + config.verificaciones.join(' '))),
      ]).then(([visible, oculta]) => {
        if (mio !== turno) return;
        const r = { ...visible, resultados: oculta.resultados, tiempo: visible.tiempo || oculta.tiempo };
        if (r.tiempo) {
          salida.classList.add('error');
          salida.textContent = 'Tu código tardó demasiado. ¿Hay un bucle o una recursión que nunca termina?';
          checks.forEach((li) => estado(li, 'mal'));
        } else pintar(r);
      });
      return;
    }
    if (!worker) nuevoWorker();
    clearTimeout(reloj);
    reloj = window.setTimeout(() => {
      nuevoWorker();
      salida.classList.add('error');
      salida.textContent = 'Tu código tardó demasiado. ¿Hay un bucle o una recursión que nunca termina?';
      checks.forEach((li) => estado(li, 'mal'));
    }, LIMITE_MS);
    worker!.postMessage({ codigo: vista.state.doc.toString(), pruebas: config.verificaciones });
  }

  function estado(li: HTMLLIElement, e: 'ok' | 'mal' | 'pendiente') {
    li.dataset.estado = e;
    const sr = li.querySelector('[data-sr]');
    if (sr) sr.textContent = e === 'ok' ? ' (cumplido)' : e === 'mal' ? ' (todavía no)' : ' (pendiente)';
  }

  function pintar(r: { salida: string[]; error: string | null; resultados: boolean[] }) {
    const esInicial = primera;
    if (primera) primera = false;
    else {
      intentos++;
      btnSolucion.disabled = false;
    }
    if (r.error) {
      salida.classList.add('error');
      salida.textContent = [...r.salida, r.error].join('\n');
    } else {
      salida.classList.remove('error');
      salida.textContent = r.salida.length ? r.salida.join('\n') : '(sin salida)';
    }
    r.resultados.forEach((bien, k) => estado(checks[k], bien ? 'ok' : 'mal'));
    if (!esInicial && r.resultados.length && r.resultados.every(Boolean)) marcarEjercicio(id);
  }

  btnPista.addEventListener('click', () => {
    if (pistasDadas >= config.pistas.length) return;
    const li = document.createElement('li');
    li.innerHTML = config.pistas[pistasDadas];
    listaPistas.append(li);
    pistasDadas++;
    if (pistasDadas >= config.pistas.length) {
      btnPista.disabled = true;
      pistaN.textContent = '(no quedan)';
    } else pistaN.textContent = `(${pistasDadas + 1} de ${config.pistas.length})`;
  });

  btnSolucion.addEventListener('click', () => {
    if (!intentos) return;
    solucion.hidden = false;
    btnSolucion.disabled = true;
    solucion.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  });

  el.querySelector('[data-restaurar]')!.addEventListener('click', () => {
    vista.dispatch({ changes: { from: 0, to: vista.state.doc.length, insert: config.inicial } });
  });
}
