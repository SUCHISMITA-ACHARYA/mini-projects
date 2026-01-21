# 3D Mesh Preprocessing and Analysis

This project implements a full mesh preprocessing pipeline for eight 3D models. 
The workflow includes inspection, normalization, quantization, and reconstruction, 
and evaluates accuracy using mean squared error (MSE).

## Contents
- src/ — Python scripts for mesh processing
- data/ — Original OBJ meshes
- outputs/ — Normalized, quantized, and reconstructed files
- screenshots/ — Images used in the report
- MIXAR ASSIGNMENT REPORT.docx — Final report document

## Requirements
Python 3.10+
Libraries: numpy, trimesh, open3d, matplotlib, pandas, tqdm

## Usage
1. Activate the virtual environment  
   `source venv_mesh/bin/activate`  (Linux/macOS)  
   or  
   `.\\venv_mesh\\Scripts\\activate`  (Windows)

2. Run the batch processor:  
   `python -m src.batch_run --input_dir data --output_dir outputs --bins 1024`

3. The program outputs normalized, quantized, and reconstructed meshes along with error plots.

## Visualization
Use MeshLab or Blender to view the OBJ files and verify normalization and reconstruction.

## Author
Suchismita Acharya 
SRM Institute of Science and Technology, 2025
