import numpy as np

def minmax_normalize(vertices):
    vmin = vertices.min(axis=0)
    vmax = vertices.max(axis=0)
    denom = vmax - vmin
    denom[denom == 0] = 1.0
    normalized = (vertices - vmin) / denom
    params = {'vmin': vmin.tolist(), 'vmax': vmax.tolist()}
    return normalized, params

def unit_sphere_normalize(vertices):
    centroid = vertices.mean(axis=0)
    centered = vertices - centroid
    radii = (centered**2).sum(axis=1)**0.5
    max_r = float(radii.max()) if radii.size > 0 else 1.0
    if max_r == 0:
        max_r = 1.0
    normalized = centered / max_r
    params = {'centroid': centroid.tolist(), 'scale': max_r}
    return normalized, params
