import os, json
import matplotlib.pyplot as plt
import numpy as np

def plot_for_mesh(outputs_dir, meshname):
    rpt_path = os.path.join(outputs_dir, 'reconstructed', f"{meshname}_error_report.json")
    with open(rpt_path) as f:
        r = json.load(f)
    mm = np.array(r['minmax']['mse_axis'])
    us = np.array(r['unitsphere']['mse_axis'])
    labels = ['x','y','z']
    x = np.arange(len(labels))
    plt.figure()
    plt.bar(x-0.15, mm, width=0.3, label='MinMax')
    plt.bar(x+0.15, us, width=0.3, label='UnitSphere')
    plt.xticks(x, labels)
    plt.ylabel('MSE')
    plt.title(f'{meshname} MSE per axis')
    plt.legend()
    os.makedirs(os.path.join(outputs_dir,'plots'), exist_ok=True)
    plt.savefig(os.path.join(outputs_dir,'plots', f'{meshname}_mse_per_axis.png'))
    plt.close()
    print("Saved plot:", os.path.join(outputs_dir,'plots', f'{meshname}_mse_per_axis.png'))

if __name__ == '__main__':
    outputs_dir = 'outputs'
    for fname in os.listdir(os.path.join(outputs_dir,'reconstructed')):
        if fname.endswith('_error_report.json'):
            meshname = fname.replace('_error_report.json','')
            plot_for_mesh(outputs_dir, meshname)
