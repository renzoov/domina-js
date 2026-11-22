// Rayos X corre aquí, fuera de la página: si algo tarda de más, la página no se congela y se puede cortar.
import { radiografiar } from '../lib/rayos-x';

self.onmessage = (e: MessageEvent<{ codigo: string }>) => {
  (self as unknown as Worker).postMessage(radiografiar(e.data.codigo));
};
