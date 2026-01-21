import numpy as np
import trimesh
import json
import os

def load_mesh(path):
    import trimesh
    try:
        mesh = trimesh.load_mesh(path, process=False)
    except Exception:
        mesh = trimesh.load(path, force='mesh', process=False)
    if hasattr(mesh, 'vertices') and len(mesh.vertices) > 0:
        return mesh
    raise ValueError(f"Could not load mesh vertices from {path}")


def save_mesh_vertices_to_obj(vertices, faces, outpath):
    mesh = trimesh.Trimesh(vertices=vertices, faces=faces, process=False)
    mesh.export(outpath)
    return outpath

def vertices_stats(vertices):
    stats = {
        'n_vertices': int(vertices.shape[0]),
        'min': vertices.min(axis=0).tolist(),
        'max': vertices.max(axis=0).tolist(),
        'mean': vertices.mean(axis=0).tolist(),
        'std': vertices.std(axis=0).tolist()
    }
    return stats

def save_json(obj, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        json.dump(obj, f, indent=2)

def mse_per_axis(orig, recon):
    diff = (orig - recon).astype(np.float64)
    mse_axis = np.mean(diff**2, axis=0)
    mse_overall = np.mean(np.sum(diff**2, axis=1))
    return mse_axis.tolist(), float(mse_overall)

def mae_per_axis(orig, recon):
    diff = np.abs(orig - recon).astype(np.float64)
    mae_axis = np.mean(diff, axis=0)
    mae_overall = np.mean(np.sum(diff, axis=1)**0.5)
    return mae_axis.tolist(), float(mae_overall)
