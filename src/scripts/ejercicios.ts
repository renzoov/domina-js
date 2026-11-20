import { marcarEjercicio } from './progreso';
import { conTransicion } from './transiciones';

const ok = (t: string) => `<span class="ok">${t}</span> `;
const no = (t: string) => `<span class="no">${t}</span> `;

function una(el: HTMLElement) {
  if (el.dataset.listo) return false;
  el.dataset.listo = '1';
  return true;
}

/* ── Sé el motor ───────────────────────────────────────────── */
interface Movimiento { accion: 'apilar' | 'desapilar'; funcion?: string; linea: number }

export function iniciarMotores() {
  document.querySelectorAll<HTMLElement>('[data-motor]').forEach((el) => {
    if (!una(el)) return;
    const movs: Movimiento[] = JSON.parse(el.querySelector('[data-movs]')!.textContent || '[]');
    const pila = el.querySelector<HTMLOListElement>('[data-pila]')!;
    const avance = el.querySelector<HTMLElement>('[data-avance]')!;
    const feedback = el.querySelector<HTMLElement>('[data-feedback]')!;
    const lineas = Array.from(el.querySelectorAll<HTMLElement>('.l'));
    const botones = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-apilar], [data-desapilar]'));
    let i = 0;
    const marcarLinea = (n: number) => lineas.forEach((l) => l.classList.toggle('on', Number(l.dataset.l) === n));

    function reiniciar() {
      i = 0;
      pila.replaceChildren();
      feedback.textContent = '';
      avance.textContent = `Movimiento 1 de ${movs.length}`;
      botones.forEach((b) => (b.disabled = false));
      marcarLinea(0);
    }

    function intentar(accion: 'apilar' | 'desapilar', funcion?: string) {
      const esperado = movs[i];
      if (!esperado) return;
      const bien = esperado.accion === accion && (accion === 'desapilar' || esperado.funcion === funcion);
      if (!bien) {
        let pista = 'Mira el código: ¿qué línea se está ejecutando ahora?';
        if (esperado.accion === 'desapilar' && accion === 'apilar')
          pista = 'La función de la cima ya no llama a nadie más: terminó. ¿Qué le pasa?';
        else if (esperado.accion === 'apilar' && accion === 'desapilar')
          pista = 'La función de la cima todavía no terminó: llama a otra función antes.';
        else if (esperado.accion === 'apilar')
          pista = `Esa no. ¿A qué función se llama desde ${pila.lastElementChild?.textContent ?? 'el código principal'}?`;
        feedback.innerHTML = no('Todavía no.') + pista;
        return;
      }
      if (accion === 'apilar') {
        const li = document.createElement('li');
        li.textContent = funcion!;
        pila.append(li);
      } else {
        pila.lastElementChild?.remove();
      }
      marcarLinea(esperado.linea);
      i++;
      if (i === movs.length) {
        feedback.innerHTML = ok('¡Lo hiciste como el motor!') + 'La pila quedó vacía: el programa terminó.';
        avance.textContent = `${movs.length} de ${movs.length} movimientos`;
        botones.forEach((b) => (b.disabled = true));
        marcarEjercicio(el.dataset.id!);
      } else {
        feedback.innerHTML = ok('Bien.');
        avance.textContent = `Movimiento ${i + 1} de ${movs.length}`;
      }
    }

    el.querySelectorAll<HTMLButtonElement>('[data-apilar]').forEach((b) =>
      b.addEventListener('click', () => intentar('apilar', b.dataset.apilar)),
    );
    el.querySelector('[data-desapilar]')!.addEventListener('click', () => intentar('desapilar'));
    el.querySelector('[data-reiniciar]')!.addEventListener('click', reiniciar);
  });
}

/* ── Ordena la salida ─────────────────────────────────────── */
export function iniciarOrdenar() {
  document.querySelectorAll<HTMLElement>('[data-ordena]').forEach((el) => {
    if (!una(el)) return;
    const lista = el.querySelector<HTMLOListElement>('[data-lista]')!;
    const feedback = el.querySelector<HTMLElement>('[data-feedback]')!;
    const explica = el.querySelector<HTMLElement>('[data-explica]')!;
    let arrastrado: HTMLLIElement | null = null;

    const limpiar = () => lista.querySelectorAll('li').forEach((li) => li.classList.remove('bien', 'mal'));

    lista.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('button');
      const li = b?.closest('li') as HTMLLIElement | null;
      if (!b || !li) return;
      if (b.hasAttribute('data-subir') && li.previousElementSibling) lista.insertBefore(li, li.previousElementSibling);
      else if (b.hasAttribute('data-bajar') && li.nextElementSibling) lista.insertBefore(li.nextElementSibling, li);
      else return;
      limpiar();
      b.focus();
    });

    lista.addEventListener('dragstart', (e) => {
      arrastrado = (e.target as HTMLElement).closest('li');
      arrastrado?.classList.add('arrastrando');
      e.dataTransfer?.setData('text/plain', '');
    });
    lista.addEventListener('dragend', () => {
      arrastrado?.classList.remove('arrastrando');
      arrastrado = null;
      limpiar();
    });
    lista.addEventListener('dragover', (e) => {
      e.preventDefault();
      const sobre = (e.target as HTMLElement).closest('li');
      if (!arrastrado || !sobre || sobre === arrastrado) return;
      const r = sobre.getBoundingClientRect();
      lista.insertBefore(arrastrado, e.clientY < r.top + r.height / 2 ? sobre : sobre.nextElementSibling);
    });

    el.querySelector('[data-comprobar]')!.addEventListener('click', () => {
      const items = Array.from(lista.querySelectorAll<HTMLLIElement>('li'));
      let bien = 0;
      items.forEach((li, pos) => {
        const acierto = Number(li.dataset.k) === pos;
        li.classList.toggle('bien', acierto);
        li.classList.toggle('mal', !acierto);
        if (acierto) bien++;
      });
      if (bien === items.length) {
        feedback.innerHTML = ok('¡Orden correcto!');
        explica.hidden = false;
        marcarEjercicio(el.dataset.id!);
      } else {
        feedback.innerHTML = no(`${bien} de ${items.length} en su lugar.`) + 'Sigue el código línea por línea, como lo haría el motor.';
      }
    });
  });
}

/* ── Detective ────────────────────────────────────────────── */
export function iniciarDetectives() {
  document.querySelectorAll<HTMLElement>('[data-detective]').forEach((el) => {
    if (!una(el)) return;
    const culpable = Number(el.dataset.culpable);
    const feedback = el.querySelector<HTMLElement>('[data-feedback]')!;
    const feedback2 = el.querySelector<HTMLElement>('[data-feedback2]')!;
    const arreglos = el.querySelector<HTMLElement>('[data-arreglos]')!;
    const lineas = Array.from(el.querySelectorAll<HTMLButtonElement>('.l'));
    let encontrada = false;

    lineas.forEach((b) =>
      b.addEventListener('click', () => {
        if (encontrada) return;
        const n = Number(b.dataset.l);
        if (n === culpable) {
          encontrada = true;
          lineas.forEach((x) => x.classList.remove('mal'));
          b.classList.add('bien');
          feedback.innerHTML = ok('¡Ahí está!') + (el.dataset.hallazgo ?? '');
          arreglos.hidden = false;
          arreglos.querySelector<HTMLButtonElement>('button')?.focus();
        } else {
          b.classList.add('mal');
          feedback.innerHTML = no('Esa línea no es.') + (el.dataset.pista ?? '');
        }
      }),
    );

    arreglos.querySelectorAll<HTMLButtonElement>('[data-arreglo]').forEach((b) =>
      b.addEventListener('click', () => {
        const bien = b.dataset.correcta === '1';
        b.classList.toggle('bien', bien);
        b.classList.toggle('mal', !bien);
        feedback2.innerHTML = (bien ? ok('¡Caso resuelto!') : no('Ese arreglo no alcanza.')) + (b.dataset.porque ?? '');
        if (bien) marcarEjercicio(el.dataset.id!);
      }),
    );
  });
}

/* ── Autoevaluación: una pregunta a la vez ─────────────────── */
export function iniciarAutoevaluaciones() {
  document.querySelectorAll<HTMLElement>('[data-auto]').forEach((el) => {
    if (!una(el)) return;
    const preguntas = Array.from(el.querySelectorAll<HTMLElement>('[data-pregunta]'));
    const total = el.querySelector<HTMLElement>('[data-total]')!;
    const avance = el.querySelector<HTMLElement>('[data-avance]')!;
    const cual = el.querySelector<HTMLElement>('[data-cual]')!;
    const puntos = Array.from(el.querySelectorAll<HTMLElement>('[data-puntos] .punto'));
    const siguiente = el.querySelector<HTMLButtonElement>('[data-sig-pregunta]')!;
    const acertadas = new Set<number>();
    let actual = 0;

    function mostrar(i: number) {
      actual = i;
      preguntas.forEach((q, k) => (q.hidden = k !== actual));
      pintar();
    }
    function pintar() {
      cual.textContent = `Pregunta ${actual + 1} de ${preguntas.length}`;
      puntos.forEach((p, k) => {
        p.classList.toggle('hecha', acertadas.has(k));
        p.classList.toggle('actual', k === actual);
      });
      const ultima = actual === preguntas.length - 1;
      siguiente.hidden = ultima;
      siguiente.disabled = !acertadas.has(actual);
    }

    preguntas.forEach((q, i) => {
      const correcta = Number(q.dataset.correcta);
      const feedback = q.querySelector<HTMLElement>('[data-feedback]')!;
      const botones = Array.from(q.querySelectorAll<HTMLButtonElement>('[data-opcion]'));
      botones.forEach((b) =>
        b.addEventListener('click', () => {
          if (acertadas.has(i)) return;
          const k = Number(b.dataset.opcion);
          botones.forEach((x) => x.classList.remove('bien', 'mal'));
          if (k === correcta) {
            b.classList.add('bien');
            acertadas.add(i);
            botones.forEach((x) => (x.disabled = x !== b));
            feedback.innerHTML = ok('¡Correcto!') + (q.dataset.explicacion ?? '');
          } else {
            b.classList.add('mal');
            feedback.innerHTML = no('No es esa.') + 'Vuelve a intentarlo.';
          }
          pintar();
          if (acertadas.size === preguntas.length) {
            total.textContent = `¡${preguntas.length} de ${preguntas.length}! Lo tienes.`;
            marcarEjercicio(el.dataset.id!);
          } else if (k === correcta && i < preguntas.length - 1) {
            siguiente.focus();
          }
        }),
      );
    });

    siguiente.addEventListener('click', () => {
      conTransicion(() => {
        mostrar(actual + 1);
        preguntas[actual].querySelector<HTMLButtonElement>('[data-opcion]')?.focus();
      });
    });
    avance.hidden = false;
    mostrar(0);
  });
}
