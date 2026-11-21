import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { marcarEjercicio } from './progreso';

const temaTiza = EditorView.theme(
  {
    '&': { color: '#eceae2', backgroundColor: 'transparent', fontSize: '0.85rem', minHeight: '240px' },
    '.cm-content': { fontFamily: "'Fira Code', ui-monospace, monospace", caretColor: '#f7df1e', padding: '10px 0' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#f7df1e', borderLeftWidth: '2px' },
    '&.cm-focused': { outline: 'none' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: 'rgba(247,223,30,.28)' },
    '.cm-gutters': { backgroundColor: 'transparent', color: '#8fd0f7', border: 'none' },
    '.cm-activeLine': { backgroundColor: 'rgba(236,234,226,.05)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#f7df1e' },
    '.cm-matchingBracket': { backgroundColor: 'rgba(247,223,30,.18)', outline: 'none' },
    '.cm-tooltip': { backgroundColor: '#15211b', border: '2px solid rgba(236,234,226,.15)', color: '#eceae2' },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': { backgroundColor: 'rgba(247,223,30,.2)', color: '#eceae2' },
    '.cm-foldPlaceholder': { backgroundColor: 'transparent', border: 'none', color: '#8fd0f7' },
  },
  { dark: true },
);

const colores = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword, t.bool, t.null], color: '#8fd0f7' },
  { tag: [t.string, t.special(t.string)], color: '#f2a7b8' },
  { tag: t.number, color: '#ffb36b' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#eceae2', fontWeight: '600' },
  { tag: t.comment, color: '#97a29a', fontStyle: 'italic' },
  { tag: [t.operator, t.punctuation], color: '#b8bcb4' },
]);

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
  };
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
      basicSetup,
      javascript(),
      temaTiza,
      syntaxHighlighting(colores),
      EditorView.contentAttributes.of({ 'aria-label': 'Tu código' }),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) programar();
      }),
    ],
  });
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

  function ejecutar() {
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
