import os, argparse, glob
from .process_mesh import inspect_mesh, run_normalize_and_quantize, reconstruct_and_measure


def main(input_dir, output_dir, bins):
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(os.path.join(output_dir,'plots'), exist_ok=True)
    os.makedirs(os.path.join(output_dir,'normalized'), exist_ok=True)
    os.makedirs(os.path.join(output_dir,'quantized'), exist_ok=True)
    os.makedirs(os.path.join(output_dir,'reconstructed'), exist_ok=True)
    mesh_paths = glob.glob(os.path.join(input_dir, '*.obj'))
    if len(mesh_paths) == 0:
        print("No .obj files found in", input_dir)
        return
    for path in mesh_paths:
        print("Processing", path)
        inspect_mesh(path, output_dir)
        run_normalize_and_quantize(path, output_dir, bins=bins)
        reconstruct_and_measure(path, output_dir, bins=bins)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_dir', default='data')
    parser.add_argument('--output_dir', default='outputs')
    parser.add_argument('--bins', type=int, default=1024)
    args = parser.parse_args()
    main(args.input_dir, args.output_dir, args.bins)
