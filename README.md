# PetljaDoc - Petlja's tool for interactive books

Tools are based on https://github.com/RunestoneInteractive/RunestoneComponents and https://github.com/sphinx-doc/sphinx and includes:

- additional Sphinx extensions 
- partial Pygame implementation for Sculpt (https://github.com/Petlja/pygame4skulpt)
- additional ActiveCode features
- customized Sphinx theme 
- customized project tempate 
- ``petljadoc`` command line interface

PetljaDoc currenty depends on forked RunestoneComonents, but we are gradually closing the gap with the upstream repository through pull requests.

## Instalation

Use `pip` to `install` DetljaDoc:

`pip3 install https://github.com/Petlja/PetljaDoc/archive/master.zip`

If you use Windows and previous command does not work, try:

`py -3 -m pip install https://github.com/Petlja/PetljaDoc/archive/master.zip`

## Usage

`petljadoc [OPTIONS] COMMAND [ARGS]...`

Options:
  - `--help`&nbsp;&nbsp;&nbsp;&nbsp;Show help mesage 

Commands:
  - `init-runestone`&nbsp;&nbsp;&nbsp;&nbsp;Create a new Runestone project in your current directory
  - `preview`&nbsp;&nbsp;&nbsp;&nbsp;Build a Runstone projec (like `runestone build --all`), open it in browser, watch for changes, rebuild changed files and refresh browser after rebuild (using [sphinx-autobuild](https://github.com/GaretJax/sphinx-autobuild))
  - `publish`&nbsp;&nbsp;&nbsp;&nbsp;Build a Runestone project (like `runestone build --all`) and copy produced content in `docs` subfolder (ready to be published using GitHub Pages)

By using `petljadoc preview`, an author may keep opend a browser window for preview. Any saved changes will be updated in browser in about 5-10 seconds.

By using `petljadoc publish`, an author can easily publish current version on GitHub Pages (if already use GitHub).



