// Página Rayos X: editor con el tema de tiza, ejecución en un Worker, pizarrón que se rearma solo y desafíos.
import { EditorView } from 'codemirror';
import { extensionesTiza } from './editor-tiza';
import { iniciarVisualizadores } from './visualizador';
import { marcarEjercicio, ejercicioResuelto } from './progreso';
import { resaltarLinea } from '../lib/resaltar';
import { cumple } from '../lib/rayos-x-reglas';
import type { DatosVisualizador } from '../lib/visualizador';
import type { Pizarron, Desafio } from '../data/rayos-x';

const nombresEvento: Record<string, string> = { inicio: 'inicio', entra: 'entra a la pila', sale: 'sale de la pila', ejecuta: 'ejecuta', imprime: 'imprime', error: 'error', fin: 'fin' };
const suave = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

export function iniciarRayosX() {
  const raiz = document.querySelector<HTMLElement>('[data-rayosx]');
  if (!raiz) return;
  const { pizarrones, desafios } = JSON.parse(raiz.querySelector('[data-config]')!.textContent || '{}') as { pizarrones: Pizarron[]; desafios: Desafio[] };
  const aviso = raiz.querySelector<HTMLElement>('[data-aviso]')!;
  const banner = raiz.querySelector<HTMLElement>('[data-activo]')!;
  const contenedor = raiz.querySelector<HTMLElement>('[data-editor]')!;
  const respaldo = contenedor.querySelector('textarea')!;

  const vista = new EditorView({
    doc: respaldo.value,
    extensions: [...extensionesTiza, EditorView.contentAttributes.of({ 'aria-label': 'Tu código' })],
  });
  respaldo.remove();
  contenedor.append(vista.dom);
  const leer = () => vista.state.doc.toString();
  const escribir = (codigo: string) => vista.dispatch({ changes: { from: 0, to: vista.state.doc.length, insert: codigo } });

  let original = leer();
  let activo: Desafio | null = null;

  // ── Pizarrones listos ──────────────────────────────────────────────────
  const tarjetas = Array.from(raiz.querySelectorAll<HTMLButtonElement>('[data-pizarron]'));
  tarjetas.forEach((b) => b.addEventListener('click', () => {
    const p = pizarrones.find((x) => x.id === b.dataset.pizarron)!;
    salirDelDesafio();
    tarjetas.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    original = p.codigo;
    escribir(p.codigo);
    ejecutar(true);
  }));

  // ── Desafíos ───────────────────────────────────────────────────────────
  const pintarEstados = () => raiz.querySelectorAll<HTMLElement>('[data-tarjeta-desafio]').forEach((t) => {
    const hecho = ejercicioResuelto(t.dataset.tarjetaDesafio!);
    t.classList.toggle('hecho', hecho);
    t.querySelector<HTMLElement>('[data-estado]')!.hidden = !hecho;
  });
  pintarEstados();

  raiz.querySelectorAll<HTMLButtonElement>('[data-desafio]').forEach((b) => b.addEventListener('click', () => {
    const d = desafios.find((x) => x.id === b.dataset.desafio)!;
    activo = d;
    tarjetas.forEach((x) => x.setAttribute('aria-pressed', 'false'));
    original = d.codigo;
    escribir(d.codigo);
    banner.querySelector('[data-activo-titulo]')!.textContent = d.titulo;
    banner.querySelector('[data-activo-enunciado]')!.innerHTML = d.enunciado;
    banner.querySelector('[data-activo-pista]')!.innerHTML = d.pista;
    (banner.querySelector('details') as HTMLDetailsElement).open = false;
    const lista = banner.querySelector('[data-objetivos]')!;
    lista.replaceChildren(...d.objetivos.map((o) => {
      const li = document.createElement('li');
      li.textContent = o.texto;
      return li;
    }));
    banner.classList.remove('superado');
    banner.querySelector<HTMLElement>('[data-superado]')!.hidden = true;
    banner.hidden = false;
    aviso.textContent = 'Modifica el código y pulsa «Ejecutar» para comprobarlo.';
    aviso.className = 'aviso';
    banner.scrollIntoView({ behavior: suave(), block: 'start' });
    vista.focus();
  }));

  function salirDelDesafio() {
    activo = null;
    banner.hidden = true;
  }
  banner.querySelector('[data-salir]')!.addEventListener('click', salirDelDesafio);

  function comprobar(datos: DatosVisualizador) {
    if (!activo) return;
    const items = Array.from(banner.querySelectorAll<HTMLLIElement>('[data-objetivos] li'));
    const resultados = activo.objetivos.map((o) => cumple(o.regla, datos));
    items.forEach((li, i) => {
      li.classList.toggle('ok', resultados[i]);
      li.classList.toggle('no', !resultados[i]);
    });
    if (resultados.every(Boolean)) {
      marcarEjercicio(activo.id);
      banner.classList.add('superado');
      banner.querySelector<HTMLElement>('[data-superado]')!.hidden = false;
      aviso.textContent = '¡Desafío superado! Avanza por el pizarrón para ver cómo lo hizo el motor.';
      aviso.className = 'aviso bien';
      pintarEstados();
    } else {
      aviso.textContent = `Todavía no: se cumplen ${resultados.filter(Boolean).length} de ${resultados.length} objetivos. Mira el pizarrón y vuelve a intentarlo.`;
      aviso.className = 'aviso';
    }
  }

  // ── Ejecutar ───────────────────────────────────────────────────────────
  raiz.querySelector('[data-ejecutar]')!.addEventListener('click', () => ejecutar());
  raiz.querySelector('[data-restaurar]')!.addEventListener('click', () => { escribir(original); ejecutar(true); });
  vista.contentDOM.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); ejecutar(); }
  });

  let trabajador: Worker | null = null;
  function ejecutar(sinDesplazar = false) {
    trabajador?.terminate();
    trabajador = new Worker(new URL('./rayos-x-worker.ts', import.meta.url), { type: 'module' });
    const corte = setTimeout(() => {
      trabajador?.terminate();
      trabajador = null;
      aviso.textContent = 'Tardó demasiado y se detuvo.';
      aviso.className = 'aviso mal';
    }, 3000);
    aviso.textContent = 'Analizando…';
    aviso.className = 'aviso';
    trabajador.onmessage = (e: MessageEvent<{ datos?: DatosVisualizador; error?: string }>) => {
      clearTimeout(corte);
      trabajador?.terminate();
      trabajador = null;
      if (e.data.error) {
        aviso.innerHTML = e.data.error;
        aviso.className = 'aviso mal';
        return;
      }
      const datos = e.data.datos!;
      montar(datos);
      const ultimo = datos.pasos.at(-1)!;
      if (ultimo.evento === 'error') {
        aviso.textContent = /se detuvo/.test(ultimo.texto)
          ? `Se detuvo a los ${datos.pasos.length - 1} pasos: parece un bucle que no termina. Mira el último paso.`
          : `${datos.pasos.length} pasos, y termina con un error. Avanza para ver dónde y por qué.`;
        aviso.className = 'aviso mal';
      } else {
        aviso.textContent = `Listo: ${datos.pasos.length} pasos. Avanza con «Siguiente» o con las flechas.`;
        aviso.className = 'aviso bien';
      }
      comprobar(datos);
      if (!sinDesplazar) document.getElementById('rx')!.scrollIntoView({ behavior: suave(), block: 'start' });
    };
    trabajador.postMessage({ codigo: leer() });
  }
}

// Vuelve a armar el pizarrón con pasos nuevos. Clona sus propias piezas para conservar los estilos del componente.
function montar(datos: DatosVisualizador) {
  const viejo = document.getElementById('rx')!;
  const el = viejo.cloneNode(true) as HTMLElement;
  delete el.dataset.listo;
  const { pasos } = datos;
  const total = pasos.length;

  const code = el.querySelector('pre.codigo code')!;
  const molde = code.querySelector('.l')!;
  const moldeNum = molde.querySelector('i')!;
  code.replaceChildren(...datos.codigo.split('\n').map((texto, i) => {
    const l = molde.cloneNode(false) as HTMLElement;
    l.className = 'l';
    l.dataset.l = String(i + 1);
    const n = moldeNum.cloneNode(false) as HTMLElement;
    n.textContent = String(i + 1);
    l.append(n);
    l.insertAdjacentHTML('beforeend', resaltarLinea(texto) || ' ');
    return l;
  }));

  el.querySelector('[data-pila]')!.replaceChildren();
  (el.querySelector('[data-vacia]') as HTMLElement).hidden = false;
  el.querySelector('[data-anotacion]')!.textContent = '';
  el.querySelector('[data-consola]')!.textContent = '(vacía)';
  el.querySelector('[data-texto]')!.innerHTML = pasos[0].texto;
  (el.querySelector('[data-prediccion]') as HTMLElement).hidden = true;

  const n = el.querySelector('[data-n]')!;
  n.textContent = '1';
  el.querySelector('.contador')!.replaceChildren('Paso ', n, ` de ${total}`);

  // Gráfica de profundidad: los mismos cálculos que StepVisualizer.astro
  const W = 1000, H = 70;
  const maxProf = Math.max(1, ...pasos.map((p) => p.pila.length));
  const x = (i: number) => (total === 1 ? W / 2 : (i * W) / (total - 1));
  const y = (d: number) => H - 6 - (d / maxProf) * (H - 18);
  const puntos = pasos.map((p, i) => `${x(i).toFixed(1)},${y(p.pila.length).toFixed(1)}`).join(' ');
  el.querySelectorAll('polyline').forEach((pl) => pl.setAttribute('points', puntos));
  const marca = el.querySelector('[data-marca]')!;
  marca.setAttribute('cx', String(x(0)));
  marca.setAttribute('cy', String(y(0)));
  el.querySelector('[data-clip]')!.setAttribute('width', '24');

  const linea = el.querySelector('ol.linea')!;
  const moldePunto = linea.querySelector('li')!;
  linea.replaceChildren(...pasos.map((p, i) => {
    const li = moldePunto.cloneNode(true) as HTMLElement;
    const b = li.querySelector('button')!;
    b.className = `punto ${p.evento ?? 'ejecuta'}`;
    b.dataset.ir = String(i);
    b.setAttribute('aria-label', `Paso ${i + 1}: ${nombresEvento[p.evento ?? 'ejecuta']}`);
    if (i === 0) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    b.textContent = String(i + 1);
    return li;
  }));

  const alt = el.querySelector('details.alt ol')!;
  alt.replaceChildren(...pasos.map((p, i) => {
    const li = document.createElement('li');
    li.textContent = `Paso ${i + 1}: ${p.texto.replace(/<[^>]+>/g, '')} Pila: ${p.pila.length ? p.pila.map((m) => m.nombre).join(' → ') : 'vacía'}.`;
    return li;
  }));

  // Con muchos pasos, la línea de tiempo se desplaza de lado en vez de salirse del pizarrón
  el.classList.toggle('muchos-pasos', total > 24);
  el.querySelector('[data-datos]')!.textContent = JSON.stringify(datos);
  viejo.replaceWith(el);
  iniciarVisualizadores();
}
