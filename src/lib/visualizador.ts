// Formato de datos de los visualizadores paso a paso.
// Una lección nueva solo escribe código + pasos; no necesita programar.

export interface Marco {
  /** Lo que se ve en la pila, p. ej. "saludar()" */
  nombre: string;
  /** Detalle bajo el nombre, p. ej. 'nombre = "Mundo"' */
  nota?: string;
  /** Resalta este marco/variable (por defecto se resalta el último) */
  destacar?: boolean;
  /** 'objeto': un valor que vive aparte en memoria (se dibuja distinto a una variable) */
  tipo?: 'objeto';
}

export type Evento = 'inicio' | 'entra' | 'sale' | 'ejecuta' | 'imprime' | 'error' | 'fin';

export interface Prediccion {
  pregunta: string;
  opciones: string[];
  /** Índice de la opción correcta */
  correcta: number;
  /** Por qué es esa (se muestra después de responder) */
  explicacion: string;
}

export interface Paso {
  /** Líneas que se están ejecutando (se subrayan en amarillo) */
  lineas: number[];
  /** Líneas donde una función quedó esperando (se marcan suave) */
  espera?: number[];
  /** Pila de abajo (índice 0) hacia arriba */
  pila: Marco[];
  /** Todo lo impreso hasta este paso */
  consola: string[];
  /** Explicación del paso. Admite <b> y <code>. */
  texto: string;
  evento?: Evento;
  /** Anotación a mano junto a la pila */
  anotacion?: string;
  /** Pregunta antes de revelar este paso */
  prediccion?: Prediccion;
}

export interface DatosVisualizador {
  codigo: string;
  pasos: Paso[];
}
