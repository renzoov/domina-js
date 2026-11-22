# Genera "Tiza Domina": Cabin Sketch recortada a los caracteres que usa el sitio, con contornos simplificados
# (pesa la mitad y el navegador la dibuja más rápido) y con otro nombre, como pide la licencia OFL
# (Cabin Sketch es un Reserved Font Name: una versión modificada no puede llamarse igual).
#
# Uso, desde la raíz del repo:  python herramientas/tiza-domina.py
# Requiere: pip install fonttools brotli
import os, subprocess, sys, tempfile
from fontTools.ttLib import TTFont

AQUI = os.path.dirname(os.path.abspath(__file__))
ORIGEN = 'node_modules/@fontsource/cabin-sketch/files/cabin-sketch-latin-{}-normal.woff2'
DESTINO = 'src/fuentes/tiza-domina-{}.woff2'
UNICODES = 'U+0020-007E,U+00A0-00FF,U+2010-2027,U+2030-203A,U+20AC,U+2190-2193'
TOLERANCIA = '6'
FAMILIA = 'Tiza Domina'
ESTILO = {400: 'Regular', 700: 'Bold'}

def renombrar(ruta, peso):
    f = TTFont(ruta)
    estilo = ESTILO[peso]
    postscript = f'TizaDomina-{estilo}'
    nombres = {
        1: FAMILIA,
        3: f'1.100;domina-js;{postscript}',
        4: f'{FAMILIA} {estilo}' if peso != 400 else FAMILIA,
        6: postscript,
        16: FAMILIA,
        17: estilo,
    }
    tabla = f['name']
    for registro in list(tabla.names):
        if registro.nameID in (16, 17):
            tabla.removeNames(nameID=registro.nameID)
    for id_, texto in nombres.items():
        tabla.setName(texto, id_, 3, 1, 0x409)
    tabla.setName(
        'Derivada de Cabin Sketch (The Cabin Project Authors): recorte de caracteres y contornos simplificados para domina-js.',
        10, 3, 1, 0x409)
    # La OFL pide que el aviso de licencia viaje con la fuente: va en sus metadatos (y en src/fuentes/OFL.txt)
    tabla.setName('This Font Software is licensed under the SIL Open Font License, Version 1.1.', 13, 3, 1, 0x409)
    tabla.setName('https://openfontlicense.org', 14, 3, 1, 0x409)
    f.save(ruta)

os.makedirs(os.path.dirname(DESTINO), exist_ok=True)
for peso in (400, 700):
    with tempfile.TemporaryDirectory() as tmp:
        recorte = os.path.join(tmp, 'recorte.ttf')
        subprocess.run([sys.executable, '-m', 'fontTools.subset', ORIGEN.format(peso),
                        f'--unicodes={UNICODES}', '--no-hinting', '--desubroutinize',
                        '--layout-features=*', f'--output-file={recorte}'], check=True)
        destino = DESTINO.format(peso)
        subprocess.run([sys.executable, os.path.join(AQUI, 'simplificar-fuente.py'), recorte, destino, TOLERANCIA], check=True)
        renombrar(destino, peso)
        print(destino, os.path.getsize(destino) // 1024, 'KB')
