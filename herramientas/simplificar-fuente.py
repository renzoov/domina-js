# Simplifica los contornos de una fuente TrueType: aplana las curvas y aplica Douglas-Peucker.
import sys, math
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen

def dp(pts, tol):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]
    dx, dy = b[0]-a[0], b[1]-a[1]; L = math.hypot(dx, dy)
    best, idx = -1, 0
    for i in range(1, len(pts)-1):
        p = pts[i]
        d = abs(dy*p[0]-dx*p[1]+b[0]*a[1]-b[1]*a[0])/L if L else math.hypot(p[0]-a[0], p[1]-a[1])
        if d > best: best, idx = d, i
    if best <= tol: return [a, b]
    return dp(pts[:idx+1], tol)[:-1] + dp(pts[idx:], tol)

def aplanar(contorno):
    # contorno: lista de (x, y, on). Devuelve polilínea cerrada.
    n = len(contorno)
    if not any(c[2] for c in contorno):  # todos off-curve
        contorno = [((contorno[i][0]+contorno[(i+1)%n][0])/2, (contorno[i][1]+contorno[(i+1)%n][1])/2, True) if j else contorno[i] for i in range(n) for j in (0,1)]
        n = len(contorno)
    k = next(i for i, c in enumerate(contorno) if c[2])
    c = contorno[k:] + contorno[:k] + [contorno[k]]
    out = [(c[0][0], c[0][1])]; i = 1
    while i < len(c):
        p = c[i]
        if p[2]: out.append((p[0], p[1])); i += 1; continue
        # curva cuadrática desde out[-1] con control p hasta el siguiente on (o punto medio implícito)
        q = c[i+1]
        fin = (q[0], q[1]) if q[2] else ((p[0]+q[0])/2, (p[1]+q[1])/2)
        s = out[-1]
        for t in (0.25, 0.5, 0.75, 1.0):
            x = (1-t)**2*s[0] + 2*(1-t)*t*p[0] + t*t*fin[0]; y = (1-t)**2*s[1] + 2*(1-t)*t*p[1] + t*t*fin[1]
            out.append((x, y))
        i += 2 if q[2] else 1
        if not q[2]: c[i-1] = c[i-1]  # el siguiente off-curve sigue desde el punto medio
    return out

def simplificar(origen, destino, tol):
    f = TTFont(origen); glyf = f['glyf']; antes = despues = 0
    for nombre in f.getGlyphOrder():
        g = glyf[nombre]
        if g.isComposite() or g.numberOfContours <= 0: continue
        coords, ends, flags = g.getCoordinates(glyf)
        pen = TTGlyphPen(None); ini = 0
        for e in ends:
            cont = [(coords[j][0], coords[j][1], bool(flags[j] & 1)) for j in range(ini, e+1)]; ini = e+1
            antes += len(cont)
            poli = aplanar(cont)
            # cerrar: partir en el punto más lejano al inicio para que DP funcione en curva cerrada
            lejos = max(range(len(poli)), key=lambda j: math.hypot(poli[j][0]-poli[0][0], poli[j][1]-poli[0][1]))
            s = dp(poli[:lejos+1], tol)[:-1] + dp(poli[lejos:], tol)
            s = [(round(x), round(y)) for x, y in s[:-1]]
            s = [p for k, p in enumerate(s) if k == 0 or p != s[k-1]]
            if len(s) < 3: continue
            despues += len(s)
            pen.moveTo(s[0]); [pen.lineTo(p) for p in s[1:]]; pen.closePath()
        glyf[nombre] = pen.glyph()
    for t in ('fpgm', 'prep', 'cvt ', 'hdmx', 'LTSH', 'VDMX'):
        if t in f: del f[t]
    f['maxp'].maxSizeOfInstructions = 0
    f.flavor = 'woff2'; f.save(destino)
    print(destino, f'puntos {antes} -> {despues}')

origen, destino, tol = sys.argv[1], sys.argv[2], float(sys.argv[3])
simplificar(origen, destino, tol)
