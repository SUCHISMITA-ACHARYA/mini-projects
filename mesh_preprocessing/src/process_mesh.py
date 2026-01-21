import os
import numpy as np
from .utils import load_mesh, save_mesh_vertices_to_obj, vertices_stats, save_json, mse_per_axis, mae_per_axis
from .normalize import minmax_normalize, unit_sphere_normalize
from .quantize import quantize, dequantize
import trimesh

def inspect_mesh(inpath, outdir):
    mesh = load_mesh(inpath)
    verts = np.array(mesh.vertices)
    stats = vertices_stats(verts)
    fn = os.path.splitext(os.path.basename(inpath))[0]
    save_json(stats, os.path.join(outdir, f"{fn}_stats.json"))
    print(f"Saved stats for {fn}")
    return mesh, verts, stats

def run_normalize_and_quantize(mesh_path, outdir, bins=1024):
    mesh = load_mesh(mesh_path)
    verts = np.array(mesh.vertices)
    faces = np.array(mesh.faces) if hasattr(mesh, 'faces') else None
    fn = os.path.splitext(os.path.basename(mesh_path))[0]

    norm_mm, params_mm = minmax_normalize(verts)
    q_mm = quantize(norm_mm, n_bins=bins)
    dq_mm = dequantize(q_mm, n_bins=bins)
    norm_obj_path = os.path.join(outdir, 'normalized', f"{fn}_minmax_normalized.obj")
    save_mesh_vertices_to_obj(norm_mm, faces, norm_obj_path)
    quant_obj_path = os.path.join(outdir, 'quantized', f"{fn}_minmax_quantized.obj")
    save_mesh_vertices_to_obj(dq_mm, faces, quant_obj_path)
    np.save(os.path.join(outdir, 'quantized', f"{fn}_minmax_q.npy"), q_mm)
    save_json(params_mm, os.path.join(outdir, 'normalized', f"{fn}_minmax_params.json"))

    norm_us, params_us = unit_sphere_normalize(verts)
    mapped = (norm_us + 1.0) / 2.0
    q_us = quantize(mapped, n_bins=bins)
    dq_us = dequantize(q_us, n_bins=bins)
    dq_us_back = dq_us * 2.0 - 1.0
    norm_us_path = os.path.join(outdir, 'normalized', f"{fn}_unitsphere_normalized.obj")
    save_mesh_vertices_to_obj(norm_us, faces, norm_us_path)
    quant_us_path = os.path.join(outdir, 'quantized', f"{fn}_unitsphere_quantized.obj")
    save_mesh_vertices_to_obj(dq_us_back, faces, quant_us_path)
    np.save(os.path.join(outdir, 'quantized', f"{fn}_unitsphere_q.npy"), q_us)
    save_json(params_us, os.path.join(outdir, 'normalized', f"{fn}_unitsphere_params.json"))

def reconstruct_and_measure(mesh_path, outdir, bins=1024):
    mesh = load_mesh(mesh_path)
    verts = np.array(mesh.vertices)
    faces = np.array(mesh.faces) if hasattr(mesh, 'faces') else None
    fn = os.path.splitext(os.path.basename(mesh_path))[0]
    import json
    report = {}

    with open(os.path.join(outdir, 'normalized', f"{fn}_minmax_params.json"), 'r') as f:
        params_mm = json.load(f)
    vmin = np.array(params_mm['vmin'])
    vmax = np.array(params_mm['vmax'])
    q_mm = np.load(os.path.join(outdir, 'quantized', f"{fn}_minmax_q.npy"))
    dq_mm = dequantize(q_mm, n_bins=bins)
    recon_mm = dq_mm * (vmax - vmin) + vmin
    recon_mm_path = os.path.join(outdir, 'reconstructed', f"{fn}_minmax_recon.obj")
    save_mesh_vertices_to_obj(recon_mm, faces, recon_mm_path)
    mse_axis_mm, mse_overall_mm = mse_per_axis(verts, recon_mm)
    mae_axis_mm, mae_overall_mm = mae_per_axis(verts, recon_mm)
    report['minmax'] = {'mse_axis': mse_axis_mm, 'mse_overall': mse_overall_mm, 'mae_axis': mae_axis_mm, 'mae_overall': mae_overall_mm}

    with open(os.path.join(outdir, 'normalized', f"{fn}_unitsphere_params.json"), 'r') as f:
        params_us = json.load(f)
    centroid = np.array(params_us['centroid'])
    scale = float(params_us['scale'])
    q_us = np.load(os.path.join(outdir, 'quantized', f"{fn}_unitsphere_q.npy"))
    dq_us = dequantize(q_us, n_bins=bins)
    dq_us_back = dq_us * 2.0 - 1.0
    recon_us = dq_us_back * scale + centroid
    recon_us_path = os.path.join(outdir, 'reconstructed', f"{fn}_unitsphere_recon.obj")
    save_mesh_vertices_to_obj(recon_us, faces, recon_us_path)
    mse_axis_us, mse_overall_us = mse_per_axis(verts, recon_us)
    mae_axis_us, mae_overall_us = mae_per_axis(verts, recon_us)
    report['unitsphere'] = {'mse_axis': mse_axis_us, 'mse_overall': mse_overall_us, 'mae_axis': mae_axis_us, 'mae_overall': mae_overall_us}

    save_json(report, os.path.join(outdir, 'reconstructed', f"{fn}_error_report.json"))
    print(f"Processed {fn}")
