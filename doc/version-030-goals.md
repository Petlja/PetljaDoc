# PetljaDoc - Goals for version 0.3.0

The general goal for the version 0.3.0 is to support the new project type for courses.

Support for collections of quiz-like questions is also planed but may be postponed for a later version. 

Consequently, PetljaDoc need do define new general project structure aimed to support different types or project.

## New PetljaDoc project structure

The PetljaDoc project structure will keep to be compatible with the Runstone project structure with some specific default configuration values as defined in templates for `setup.py` and `pavement.py`. 

Additional `conf-petljadoc.json` may be present in the project root. 

`conf-petljadoc.json` is optional for the Runestone project type and mandatory for all other project types. 

If `conf-petljadoc.json` is not present, default values for all config attributes should be assumed.

General `conf-petljadoc.json` attributes:

- `project_type` : `runestone` or `course` (or some other project type in the future); default: `runestone`

Project source files should always be in the `_sources` and `_static` folders. 

Project build folder should always be `_build` folder.

PetljaDoc 0.3.0, for backward compatibility, will support other  folder layouts for Runestone project type if an layout is properly specified in `conf.py`/`pavement.py`.

Those commands should be supported for all project types:

- `petljadoc init-`*project-type* to initialize a new project
- `petljadoc preview` to build and preview a project
- `petljadoc publish` to copy files for static preview in the `docs` subfolder
- `petljadoc deploy` build for later deployment using target-platform specific tools

## General principles for non-Runestone, but Runstone-dependant project project types

If at least some RST source files are generated in pre-Runestone build phase, then the generated Runestone source files should be stored in subfolders of `_intermediate` and `conf.py`/`pavement.py` should specify appropriate config values.

If RST files, with related images an other files, are also used as true source files (edited by an author), those files should be stored in the `_sources` and `_static` folders and copied (or transformed) into the `_intermediate` folder during pre-Runestone build phase. 

The `_build` folder should contain all files needed for a target-platform deployment. All needed metadata should be extracted in an appropriate way into files inside the `_build` folder. Generally, target-platform independent JSON files are preferred for such a metadata.

## The `course` project type

The structure of YAML source files and other aspects of the source files should be carefully specified. Current format may be redesigned and current courses will be migrated.

Basic instructions for authors will be drafted incrementally and kept up to date during the development process.

During the pre-Runestone build phase, source RST and related files will be copied from the `_source` and `_static` folder into the `_intermediate/_source` and `_intermediate/_static` folders.

The Runestone build phase will use `_intermediate/_source` and `_intermediate/_static` folders for source files. `petljadoc init-course` will initialize `conf.py` and `pavement.py` to reflect that folder structure.

The `index.rst` file should not be present inside the `_source` folder, but will be generated in the pre-Runestone build phase.

The `index.rst` file (or an other generated file referenced from `index.rst`) should contain TOC with references to appropriate RST files as specified in the YAML source. Preview of other relevant information should also be provided. All relevant errors and warnings should be inserted on the top of the `index.rst` file. 

All metadata that is easily accessible during PetljaDoc build process and may be useful for a target-platform deployment should be represented (extracted, copied,...) inside the `_build` folder in an explicit way (e.g. JSON file).

The preview (provided with `petljadoc preview`) should contain all details of deployed content, not necessary with the same look. Author should be able to check (almost) everything on a preview before deployment.

PetljaDoc should try to identify all common mistakes in source files that can be identified in the build process.

Target-platform deployment tool should use just `_build` folder.





