import numpy as np

def quantize(normalized, n_bins=1024):
    arr = normalized.copy()
    arr = np.clip(arr, 0.0, 1.0)
    q = np.floor(arr * (n_bins - 1)).astype(np.int32)
    return q

def dequantize(q, n_bins=1024):
    return q.astype(np.float64) / (n_bins - 1)
