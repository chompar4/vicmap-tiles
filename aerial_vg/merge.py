"""Copy valid pixels from input files to an output file."""


import logging
import math
import warnings

import numpy as np

import rasterio
from rasterio import windows
from rasterio.transform import Affine


logger = logging.getLogger(__name__)

MERGE_METHODS = ('first', 'last', 'min', 'max')

def merge(datasets, bounds=None, res=None, nodata=None, dtype=None, precision=10,
          indexes=None, output_count=None, method='first'):
    
    first = rasterio.open(datasets[0])
    first_res = first.res
    nodataval = first.nodatavals[0]
    dt = first.dtypes[0]

    if method not in MERGE_METHODS and not callable(method):
        raise ValueError('Unknown method {0}, must be one of {1} or callable'
                         .format(method, MERGE_METHODS))

    # Determine output band count
    if indexes is None:
        src_count = first.count
    elif isinstance(indexes, int):
        src_count = indexes
    else:
        src_count = len(indexes)

    if not output_count:
        output_count = src_count

    # Extent from option or extent of all inputs
    if bounds:
        dst_w, dst_s, dst_e, dst_n = bounds
    else:
        # scan input files
        xs = []
        ys = []
        for name in datasets:
            src = rasterio.open(name)
            left, bottom, right, top = src.bounds
            xs.extend([left, right])
            ys.extend([bottom, top])
            src.close()
        dst_w, dst_s, dst_e, dst_n = min(xs), min(ys), max(xs), max(ys)

    logger.debug("Output bounds: %r", (dst_w, dst_s, dst_e, dst_n))
    output_transform = Affine.translation(dst_w, dst_n)
    logger.debug("Output transform, before scaling: %r", output_transform)

    # Resolution/pixel size
    if not res:
        res = first_res
    elif not np.iterable(res):
        res = (res, res)
    elif len(res) == 1:
        res = (res[0], res[0])
    output_transform *= Affine.scale(res[0], -res[1])
    logger.debug("Output transform, after scaling: %r", output_transform)

    # Compute output array shape. We guarantee it will cover the output
    # bounds completely
    # if res[0] == 0 or res[1] == 0: import ipdb; ipdb.set_trace()
    output_width = int(math.ceil((dst_e - dst_w) / max(res[0], 1)))
    output_height = int(math.ceil((dst_n - dst_s) / max(res[1], 10)))

    # Adjust bounds to fit
    dst_e, dst_s = output_transform * (output_width, output_height)
    logger.debug("Output width: %d, height: %d", output_width, output_height)
    logger.debug("Adjusted bounds: %r", (dst_w, dst_s, dst_e, dst_n))

    if dtype is not None:
        dt = dtype
        logger.debug("Set dtype: %s", dt)

    # create destination array
    dest = np.zeros((output_count, output_height, output_width), dtype=dt)

    if nodata is not None:
        nodataval = nodata
        logger.debug("Set nodataval: %r", nodataval)

    if nodataval is not None:
        # Only fill if the nodataval is within dtype's range
        inrange = False
        if np.dtype(dtype).kind in ('i', 'u'):
            info = np.iinfo(dtype)
            inrange = (info.min <= nodataval <= info.max)
        elif np.dtype(dtype).kind == 'f':
            info = np.finfo(dtype)
            if np.isnan(nodataval):
                inrange = True
            else:
                inrange = (info.min <= nodataval <= info.max)
        if inrange:
            dest.fill(nodataval)
        else:
            warnings.warn(
                "Input file's nodata value, %s, is beyond the valid "
                "range of its data type, %s. Consider overriding it "
                "using the --nodata option for better results." % (
                    nodataval, dtype))
    else:
        nodataval = 0

    if method == 'first':
        def copyto(old_data, new_data, old_nodata, new_nodata, **kwargs):
            mask = np.logical_and(old_nodata, ~new_nodata)
            old_data[mask] = new_data[mask]

    elif method == 'last':
        def copyto(old_data, new_data, old_nodata, new_nodata, **kwargs):
            mask = ~new_nodata
            old_data[mask] = new_data[mask]

    elif method == 'min':
        def copyto(old_data, new_data, old_nodata, new_nodata, **kwargs):
            mask = np.logical_and(~old_nodata, ~new_nodata)
            old_data[mask] = np.minimum(old_data[mask], new_data[mask])

            mask = np.logical_and(old_nodata, ~new_nodata)
            old_data[mask] = new_data[mask]

    elif method == 'max':
        def copyto(old_data, new_data, old_nodata, new_nodata, **kwargs):
            mask = np.logical_and(~old_nodata, ~new_nodata)
            old_data[mask] = np.maximum(old_data[mask], new_data[mask])

            mask = np.logical_and(old_nodata, ~new_nodata)
            old_data[mask] = new_data[mask]

    elif callable(method):
        copyto = method

    else:
        raise ValueError(method)

    for idx, name in enumerate(datasets):
        # Real World (tm) use of boundless reads.
        # This approach uses the maximum amount of memory to solve the
        # problem. Making it more efficient is a TODO.

        src = rasterio.open(name)

        if not src.transform.is_degenerate:

            # 1. Compute spatial intersection of destination and source
            src_w, src_s, src_e, src_n = src.bounds

            int_w = src_w if src_w > dst_w else dst_w
            int_s = src_s if src_s > dst_s else dst_s
            int_e = src_e if src_e < dst_e else dst_e
            int_n = src_n if src_n < dst_n else dst_n

            # 2. Compute the source window
            src_window = windows.from_bounds(
                int_w, int_s, int_e, int_n, src.transform, precision=precision)
            logger.debug("Src %s window: %r", src.name, src_window)

            src_window = src_window.round_shape()

            # 3. Compute the destination window
            dst_window = windows.from_bounds(
                int_w, int_s, int_e, int_n, output_transform, precision=precision)

            # 4. Read data in source window into temp
            trows, tcols = (
                int(round(dst_window.height)), int(round(dst_window.width)))
            temp_shape = (src_count, trows, tcols)
            temp = src.read(out_shape=temp_shape, window=src_window,
                            boundless=False, masked=True, indexes=indexes)

            # 5. Copy elements of temp into dest
            roff, coff = (
                int(round(dst_window.row_off)), int(round(dst_window.col_off)))

            region = dest[:, roff:roff + trows, coff:coff + tcols]
            if np.isnan(nodataval):
                region_nodata = np.isnan(region)
                temp_nodata = np.isnan(temp)
            else:
                region_nodata = region == nodataval
                temp_nodata = temp.mask

            copyto(region, temp, region_nodata, temp_nodata,
                index=idx, roff=roff, coff=coff)

        src.close()

    return dest, output_transform
