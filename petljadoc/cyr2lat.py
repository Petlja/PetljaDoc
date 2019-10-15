import os
import re
import shutil
import datetime
import jinja2
import sys
import cyrtranslit

extensionList = ['md', 'rst', 'ipynb', 'txt', 'html', 'js', 'css'] 

def cyr2latTranslate(src_dir, dest_dir):
    # print(f"D {src_dir} -> {dest_dir}")
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
    for item in os.listdir(src_dir):
        extension = os.path.splitext(item)[1][1:]
        s = os.path.join(src_dir, item) 
        d = os.path.join(dest_dir, item)
        shutil.copyfile(s,d)
        f = open(s, encoding="utf8")
        content = f.read()
        newF = open(d, "w", encoding="utf8")
        newF.truncate(0)
        
        if extension in extensionList:
            newF.write(cyrtranslit.to_latin(content, 'sr'))
        else:
            newF.write(content)
        newF.close()
        #print(f"C {s} -> {d}")
