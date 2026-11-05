"""
Convierte la sección DXF de un sistema de perfiles (exportación Schüco con bloques PRJ_INSERT_*)
en un JSON de contornos para el modelo 3D (src/three/profiles/*.json).

Uso:  python3 scripts/dxf/dxf_to_profile.py "Seccion living.dxf" src/three/profiles/living.json
Requiere: pip install ezdxf

Ejes de salida (mm):
  u = distancia en el plano de la ventana desde el canto exterior del MARCO hacia el hueco (x del DXF)
  v = profundidad desde la cara exterior del marco hacia el interior (yExt - y del DXF)
El DXF original NO se publica: solo se guarda el contorno simplificado.
"""
import sys, json, math
import ezdxf
from ezdxf import path as P

src, dst = sys.argv[1], sys.argv[2]
doc = ezdxf.readfile(src)
msp = doc.modelspace()

def walk(entities, chain, out):
    for e in entities:
        if e.dxftype() == 'INSERT':
            walk(e.virtual_entities(), chain + [e.dxf.name], out)
        else:
            out.append((chain, e))

items = []
walk(msp, [], items)
blocks = {}
for chain, e in items:
    key = next((c for c in reversed(chain) if c.startswith('PRJ_INSERT')), None)
    if key is None or e.dxftype() not in ('POLYLINE', 'LWPOLYLINE') or not e.is_closed:
        continue
    blocks.setdefault(key, []).append(e)

def pts(e, tol=0.06):
    p = P.make_path(e)
    v = [(round(q.x, 3), round(q.y, 3)) for q in p.flattening(tol)]
    if len(v) > 1 and v[0] == v[-1]:
        v.pop()
    # quitar puntos colineales
    out = []
    n = len(v)
    for i in range(n):
        a, b, c = v[i - 1], v[i], v[(i + 1) % n]
        cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
        if abs(cross) > 1e-4 and (b != a):
            out.append(b)
    return out

def area(v):
    return 0.5 * sum(v[i][0] * v[(i + 1) % len(v)][1] - v[(i + 1) % len(v)][0] * v[i][1] for i in range(len(v)))

def inside(pt, poly):
    x, y = pt; c = False
    for i in range(len(poly)):
        x1, y1 = poly[i]; x2, y2 = poly[(i + 1) % len(poly)]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            c = not c
    return c

def bbox(v):
    xs = [p[0] for p in v]; ys = [p[1] for p in v]
    return min(xs), min(ys), max(xs), max(ys)

def shapes(ents, outer_layers, hole_layers):
    outers = [pts(e) for e in ents if e.dxf.layer in outer_layers]
    holes = [pts(e) for e in ents if e.dxf.layer in hole_layers]
    res = []
    for o in sorted(outers, key=lambda v: -abs(area(v))):
        hs = [h for h in holes if inside(h[0], o)]
        res.append({'outer': o, 'holes': hs})
    return res

# Clasificación de bloques por capas y posición
parts = {}
glass = None
pvc = []
for k, ents in blocks.items():
    layers = {e.dxf.layer for e in ents}
    if any(l.startswith('GLAS') for l in layers):
        glass = ents
    elif 'PVC_OUTSIDE' in layers and 'PVC_INSIDE' in layers:
        pvc.append((k, [e for e in ents if not e.dxf.layer.startswith('GASKET')]))
        if 'GASKET_OUTSIDE' in layers:  # junta integrada en el junquillo
            parts.setdefault('gasket', []).extend(shapes(ents, {'GASKET_OUTSIDE'}, {'GASKET_INSIDE'}))
    elif 'STEEL_OUTSIDE' in layers:
        parts.setdefault('steel', []).extend(shapes(ents, {'STEEL_OUTSIDE'}, set()))
    elif 'GASKET_OUTSIDE' in layers:
        parts.setdefault('gasket', []).extend(shapes(ents, {'GASKET_OUTSIDE'}, {'GASKET_INSIDE'}))

# marco = el que empieza en x mínimo; hoja = el más ancho restante; junquillo = el más pequeño
pvc.sort(key=lambda kv: bbox(pts([e for e in kv[1] if e.dxf.layer == 'PVC_OUTSIDE'][0]))[0])
named = {}
rest = []
for k, ents in pvc:
    s = shapes(ents, {'PVC_OUTSIDE'}, {'PVC_INSIDE'})
    bb = bbox(s[0]['outer'])
    rest.append((bb, s))
rest.sort(key=lambda r: r[0][0])
frame = rest[0]
others = sorted(rest[1:], key=lambda r: -(r[0][2] - r[0][0]) * (r[0][3] - r[0][1]))
sash, bead = others[0], others[1]
named['frame'] = frame[1]; named['sash'] = sash[1]; named['bead'] = bead[1]

yExt = frame[0][3]
xRef = frame[0][0]
T = lambda v: [[round(x - xRef, 2), round(yExt - y, 2)] for x, y in v]
def tr(shs):
    return [{'outer': T(s['outer']), 'holes': [T(h) for h in s['holes']]} for s in shs]

out = {'units': 'mm', 'axes': 'u: desde canto exterior del marco hacia el hueco; v: desde cara exterior hacia interior'}
for n in ('frame', 'sash', 'bead'):
    out[n] = tr(named[n])
# Asignar acero y juntas al marco o a la hoja según su posición u
sashU0 = sash[0][0] - xRef
out['sashU0'] = round(sashU0, 2)
for n in ('steel', 'gasket'):
    for s in tr(parts.get(n, [])):
        u0 = min(p[0] for p in s['outer'])
        # el acero del marco empieza dentro del marco; el resto pertenece a la hoja
        owner = 'frame' if (n == 'steel' and u0 < sashU0) or (n == 'gasket' and min(p[1] for p in s['outer']) < 20 and u0 < 75 and u0 > 50) else 'sash'
        out.setdefault(f'{n}_{owner}', []).append(s)

# Vidrio: canto, láminas y cámaras
if glass:
    g = {}
    for e in glass:
        v = T(pts(e))
        bb = bbox(v)
        g.setdefault(e.dxf.layer, []).append(bb)
    panes = sorted([b for l, bs in g.items() if l in ('GLAS_G0', 'GLAS_G1', 'GLAS_G2', 'GLAS_G3', 'GLAS_G4') for b in bs], key=lambda b: b[1])
    out['glass'] = {
        'edgeU': round(min(b[0] for b in panes), 2),
        'panes': [[round(b[1], 2), round(b[3], 2)] for b in panes],
        'spacer': [[round(b[1], 2), round(b[3], 2), round(b[2] - b[0], 2)] for b in g.get('GLASDISTANCER_WARM', [])],
    }

for k in ('frame', 'sash', 'bead'):
    s = out[k][0]
    xs = [p[0] for p in s['outer']]; ys = [p[1] for p in s['outer']]
    print(k, 'u', min(xs), max(xs), 'v', min(ys), max(ys), 'pts', len(s['outer']), 'holes', len(s['holes']), 'hole pts', sum(len(h) for h in s['holes']))
for k in out:
    if k.startswith('steel') or k.startswith('gasket'):
        print(k, len(out[k]), [ (min(p[0] for p in s['outer']), min(p[1] for p in s['outer'])) for s in out[k]])
print('glass', out.get('glass'))
json.dump(out, open(dst, 'w'), separators=(',', ':'))
