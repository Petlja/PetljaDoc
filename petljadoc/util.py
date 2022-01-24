import os
import shutil


_FILTER_ = {"doctrees", "_sources", ".buildinfo", "search.html",
                        "searchindex.js", "objects.inv", "pavement.py","course-errors.js","genindex.html","index.yaml"}

def filter_name(item):
        if item not in _FILTER_:
            return True
        else:
            return False


def copy_dir(src_dir, dest_dir, filter_name=None):
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
    for item in os.listdir(src_dir):
        if filter_name and not filter_name(item):
            continue
        s = os.path.join(src_dir, item)
        if os.path.isdir(s):
            d = os.path.join(dest_dir, item)
            copy_dir(s, d, filter_name)
        else:
            d = os.path.join(dest_dir, item)
            try:
                shutil.copyfile(s, d)
            except FileNotFoundError:
                pass