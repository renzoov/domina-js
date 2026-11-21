import { ZONAS, type DatosVisualizador, type Marco } from '../lib/visualizador';
import { registrarPrediccion } from './progreso';

const ANCHO = 1000;
const ALTO = 70;

export function iniciarVisualizadores() {
  document.querySelectorAll<HTMLElement>('[data-visualizador]').forEach((el) => {
    if (el.dataset.listo) return;
    el.dataset.listo = '1';
    iniciar(el);
  });
}

function iniciar(el: HTMLElement) {
  const datos: DatosVisualizador = JSON.parse(el.querySelector('[data-datos]')!.textContent || '{}');
  const { pasos } = datos;
  const total = pasos.length;
  const id = el.id;
  const q = <T extends Element = HTMLElement>(s: string) => el.querySelector(s) as T;

  const lineas = Array.from(el.querySelectorAll<HTMLElement>('.l'));
  const pila = q<HTMLOListElement>('[data-pila]');
  const vacia = q('[data-vacia]');
  const anotacion = q('[data-anotacion]');
  const consola = q<HTMLOutputElement>('[data-consola]');
  const texto = q('[data-texto]');
  const contador = q('[data-n]');
  const clip = q<SVGRectElement>('[data-clip]');
  const marca = q<SVGCircleElement>('[data-marca]');
  const puntos = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-ir]'));
  const anterior = q<HTMLButtonElement>('[data-anterior]');
  const siguiente = q<HTMLButtonElement>('[data-siguiente]');
  const reiniciar = q<HTMLButtonElement>('[data-reiniciar]');
  const caja = q('[data-prediccion]');
  const pregunta = q('[data-pregunta]');
  const opciones = q('[data-opciones]');
  const resultado = q('[data-resultado]');

  const maxProf = Math.max(1, ...pasos.map((p) => p.pila.length));
  const x = (i: number) => (total === 1 ? ANCHO / 2 : (i * ANCHO) / (total - 1));
  const y = (d: number) => ALTO - 6 - (d / maxProf) * (ALTO - 18);
  const sinMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  let actual = 0;
  // Lo que hay dibujado ahora en la pila (puede diferir del paso si se limpió)
  let enPantalla: Marco[] = pasos[0]?.pila ?? [];
  let maxVisto = 0;
  const respondidas = new Set<number>();
  let pendiente: number | null = null;

  function pintarPila(despues: Marco[], animar: boolean) {
    const antes = enPantalla;
    enPantalla = despues;
    let comun = 0;
    while (comun < antes.length && comun < despues.length && antes[comun].nombre === despues[comun].nombre && antes[comun].tipo === despues[comun].tipo) comun++;
    const vivos = Array.from(pila.querySelectorAll<HTMLLIElement>('li:not(.borra)'));
    // borra lo que salió (de arriba hacia abajo)
    vivos.slice(comun).forEach((li) => {
      if (animar && !sinMovimiento()) {
        li.classList.add('borra');
        li.classList.remove('cima');
        li.addEventListener('animationend', () => li.remove(), { once: true });
      } else li.remove();
    });
    // actualiza notas de los que quedan
    vivos.slice(0, comun).forEach((li, k) => {
      li.querySelector('small')?.remove();
      if (despues[k].nota) li.append(nota(despues[k].nota!));
    });
    // escribe lo que entró
    despues.slice(comun).forEach((m) => {
      const li = document.createElement('li');
      // Las zonas llevan prefijo (z-pila…) para no chocar con las clases del componente
      li.className = !m.tipo ? 'marco caja' : m.tipo === 'objeto' ? 'marco caja objeto' : `marco caja z-${m.tipo}`;
      if (m.tipo && ZONAS[m.tipo]) li.dataset.zona = ZONAS[m.tipo];
      li.textContent = m.nombre;
      if (m.nota) li.append(nota(m.nota));
      if (animar && !sinMovimiento()) {
        li.classList.add('escribe');
        // Al terminar se quita: el recorte de la animación taparía el rótulo de la zona
        li.addEventListener('animationend', () => li.classList.remove('escribe'), { once: true });
      }
      // los que se borran siguen en el DOM un instante: los nuevos van antes de ellos
      const primeroBorrado = pila.querySelector('li.borra');
      pila.insertBefore(li, primeroBorrado);
    });
    const finales = Array.from(pila.querySelectorAll<HTMLLIElement>('li:not(.borra)'));
    const destacado = despues.findIndex((m) => m.destacar);
    const marcado = destacado >= 0 ? destacado : finales.length - 1;
    finales.forEach((li, k) => li.classList.toggle('cima', k === marcado));
    vacia.hidden = despues.length > 0;
  }

  function nota(t: string) {
    const s = document.createElement('small');
    s.textContent = t;
    return s;
  }

  function mostrar(n: number, animar = true, extra = '') {
    const antes = pasos[actual];
    const p = pasos[n];
    actual = n;
    maxVisto = Math.max(maxVisto, n);
    lineas.forEach((l) => {
      const k = Number(l.dataset.l);
      l.classList.toggle('on', p.lineas.includes(k));
      l.classList.toggle('espera', !!p.espera?.includes(k));
    });
    pintarPila(p.pila, animar && antes !== p);
    anotacion.textContent = p.anotacion ?? '';
    if (p.evento === 'entra') anotacion.dataset.flecha = 'entra';
    else if (p.evento === 'sale' || p.evento === 'fin') anotacion.dataset.flecha = 'sale';
    else delete anotacion.dataset.flecha;
    consola.textContent = p.consola.length ? p.consola.join('\n') : '(vacía)';
    consola.classList.toggle('vacia-c', !p.consola.length);
    texto.innerHTML = extra + p.texto;
    contador.textContent = String(n + 1);
    clip.setAttribute('width', String(x(n) + 24));
    marca.setAttribute('cx', String(x(n)));
    marca.setAttribute('cy', String(y(p.pila.length)));
    puntos.forEach((b, k) => {
      if (k === n) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
      b.classList.toggle('visto', k < maxVisto && k !== n);
    });
    anterior.disabled = n === 0;
    siguiente.disabled = n === total - 1;
    caja.hidden = true;
    texto.hidden = false;
    pendiente = null;
  }

  function preguntar(n: number) {
    const pr = pasos[n].prediccion!;
    pendiente = n;
    pregunta.textContent = pr.pregunta;
    resultado.textContent = '';
    opciones.replaceChildren(
      ...pr.opciones.map((o, k) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn';
        b.textContent = o;
        b.addEventListener('click', () => responder(n, k));
        return b;
      }),
    );
    texto.hidden = true;
    caja.hidden = false;
    siguiente.disabled = true;
    (opciones.firstElementChild as HTMLButtonElement | null)?.focus({ preventScroll: true });
  }

  function responder(n: number, k: number) {
    const pr = pasos[n].prediccion!;
    const bien = k === pr.correcta;
    respondidas.add(n);
    registrarPrediccion(bien);
    const encabezado = bien
      ? `<span class="ok">¡Bien predicho!</span> `
      : `<span class="no">Casi. Era «${escapar(pr.opciones[pr.correcta])}».</span> `;
    mostrar(n, true, `${encabezado}${pr.explicacion} `);
    actualizarHash(n);
  }

  function ir(n: number, desdeUsuario = true) {
    if (n < 0 || n >= total) return;
    if (n === actual + 1 && pasos[n].prediccion && !respondidas.has(n)) {
      preguntar(n);
      return;
    }
    mostrar(n, Math.abs(n - actual) === 1);
    if (desdeUsuario) actualizarHash(n);
  }

  function actualizarHash(n: number) {
    history.replaceState(null, '', `#${id}-paso-${n + 1}`);
  }

  anterior.addEventListener('click', () => (pendiente !== null ? mostrar(actual, false) : ir(actual - 1)));
  siguiente.addEventListener('click', () => ir(actual + 1));
  reiniciar.addEventListener('click', () => {
    respondidas.clear();
    maxVisto = 0;
    pila.replaceChildren();
    enPantalla = [];
    mostrar(0, false);
    history.replaceState(null, '', location.pathname + location.search);
  });
  puntos.forEach((b) => b.addEventListener('click', () => ir(Number(b.dataset.ir))));

  el.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); if (pendiente === null) ir(actual + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); pendiente !== null ? mostrar(actual, false) : ir(actual - 1); }
    else if (e.key === 'Home') { e.preventDefault(); ir(0); }
    else if (e.key === 'End') { e.preventDefault(); ir(total - 1); }
  });

  // Enlace directo a un paso: #<id>-paso-N
  const m = location.hash.match(new RegExp(`^#${id}-paso-(\\d+)$`));
  if (m) {
    const n = Math.min(total, Math.max(1, Number(m[1]))) - 1;
    pila.replaceChildren();
    enPantalla = [];
    mostrar(n, false);
    el.scrollIntoView({ block: 'center' });
  }
}

function escapar(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
