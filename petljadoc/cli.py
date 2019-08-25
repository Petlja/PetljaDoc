import os
import sys
import re
import shutil
from pathlib import Path
import getpass
import click
from pkg_resources import resource_filename
from paver.easy import sh
from petljadoc import bootstrap_petlja_theme
from .templateutil import apply_template_dir, default_template_arguments

def _prompt(text, default=None, hide_input=False, confirmation_prompt=False,
            type=None, #pylint: disable=redefined-builtin
            value_proc=None, prompt_suffix=': ', show_default=True, err=False, show_choices=True,
            force_default=False):
    if default and force_default:
        print(text+prompt_suffix+str(default), file=sys.stderr if err else sys.stdout)
        return default
    return click.prompt(text, default=default, hide_input=hide_input,
                        confirmation_prompt=confirmation_prompt, type=type, value_proc=value_proc,
                        prompt_suffix=prompt_suffix, show_default=show_default, err=err,
                        show_choices=show_choices)

@click.group()
def main():
    """
    Petlja's command-line interface for learning content

    For help on specific command, use: petljadoc [COMMAND] --help
    """

@main.command('init-runestone')
@click.option("--yes","-y", is_flag=True, help="Answer positive to all confirmation questions.")
@click.option("--defaults", is_flag=True, help="Always select the default answer.")
def init_runestone(yes, defaults):
    """
    Create a new Runestone project in your current directory
    """
    template_dir = resource_filename('petljadoc', 'project-templates/runestone')
    print("This will create a new Runestone project in your current directory.")
    if os.listdir('.'):
        raise click.ClickException("Current directrory in not empty")
    if not yes:
        click.confirm("Do you want to proceed? ", abort=True, default=True)
    ta = default_template_arguments()
    default_project_name = re.sub(r'\s+', '-', os.path.basename(os.getcwd()))
    ta['project_name'] = _prompt("Project name: (one word, no spaces)",
                                 default=default_project_name, force_default=defaults)
    while ' ' in ta['project_name']:
        ta['project_name'] = click.prompt("Project name: (one word, NO SPACES)")
    ta['build_dir'] = "./_build"
    ta['dest'] = "../../static"
    ta['use_services'] = "false"
    ta['author'] = _prompt("Author's name", default=getpass.getuser(), force_default=defaults)
    ta['project_title'] = _prompt("Project title",
                                  default=f"Online Book {os.path.basename(os.getcwd())}",
                                  force_default=defaults)
    ta['python3'] ="true"
    ta['default_ac_lang'] = _prompt("Default ActiveCode language", default="python",
                                    force_default=defaults)
    ta['basecourse'] = ta['project_name']
    ta['login_req'] = "false"
    ta['master_url'] = "http://127.0.0.1:8000"
    ta['master_app'] = "runestone"
    ta['logging'] = False
    ta['log_level'] = 0
    ta['dburl'] = ""
    ta['enable_chatcodes'] = 'false'
    ta['downloads_enabled'] = 'false'
    ta['templates_path'] = '_templates'
    ta['html_theme_path'] = '_templates/plugin_layouts'
    custom_theme = _prompt("Copy HTML theme into project",type=bool, 
                           default="yes", force_default=defaults)
    if custom_theme:
        ta['html_theme'] = 'custom_theme'
    else:
        ta['html_theme'] = 'bootstrap_petlja_theme'
    apply_template_dir(template_dir, '.', ta)
    if custom_theme:
        apply_template_dir(os.path.join(bootstrap_petlja_theme.get_html_theme_path(),
                                        'bootstrap_petlja_theme'),
                           os.path.join(ta['html_theme_path'], ta['html_theme']), {},
                           lambda dir, fname: fname not in ['__init__.py','__pycache__'])


def projectPath():
    p = Path(os.getcwd())
    while True:
        if p.joinpath('pavement.py').exists() and p.joinpath('conf.py').exists():
            return p
        if p == p.parent:
            return None
        p = p.parent

def build_or_autobuild(cmd_name, port=None, sphinx_build=False, sphinx_autobuild=False):
    path = projectPath()
    if not path:
        raise click.ClickException(
            f"You must be in a Runestone project to execute {cmd_name} command")
    os.chdir(path)
    sys.path.insert(0, str(path))
    from pavement import options as paver_options  #pylint: disable=import-error
    buildPath = Path(paver_options.build.builddir)
    if not buildPath.exists:
        os.makedirs(buildPath)
    args = []
    if sphinx_autobuild:
        args.append(f'--port {port}')
        args.append('-B')
        args.append('--no-initial')
        build_module = "sphinx_autobuild"
    if sphinx_build:
        build_module = "sphinx.cmd.build"
        args.append('-a')
        args.append('-E')
    args.append('-b html')
    args.append(f'-c "{paver_options.build.confdir}"')
    args.append(f'-d "{paver_options.build.builddir}/doctrees"')
    for k, v in paver_options.build.template_args.items():
        args.append(f'-A "{k}={v}"')
    args.append(f'"{paver_options.build.sourcedir}"')
    args.append(f'"{paver_options.build.builddir}"')

    sh(f'"{sys.executable}" -m {build_module} '+ " ".join(args))

@main.command()
@click.option("--port","-p", default=8000, type=int,help="HTTP port numpber (default 8000)")
def preview(port):
    """
    Build and preview the Runestone project in browser
    """
    build_or_autobuild("preview", port=port, sphinx_build=True)
    build_or_autobuild("preview", port=port, sphinx_autobuild=True)


def copy_dir(src_dir, dest_dir, filter_name=None):
    # print(f"D {src_dir} -> {dest_dir}")
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
    for item in os.listdir(src_dir):
        if filter_name and not filter_name(src_dir, item):
            continue
        s = os.path.join(src_dir, item)
        if os.path.isdir(s):
            d = os.path.join(dest_dir, item)
            copy_dir(s, d, filter_name)
        else:
            d = os.path.join(dest_dir, item)
            shutil.copyfile(s,d)
            #print(f"C {s} -> {d}")

@main.command()
def publish():
    """
    Build and copy the publish folder (docs)
    """
    build_or_autobuild("publish", sphinx_build=True)
    path = projectPath()
    if not path:
        raise click.ClickException("You must be in a Runestone project to execute publish command")
    os.chdir(path)
    sys.path.insert(0, str(path))
    from pavement import options as paver_options  #pylint: disable=import-error
    buildPath = Path(paver_options.build.builddir)
    publishPath = path.joinpath("docs")
    click.echo(f'Publishing to {publishPath}')
    def filter_name(src_dir, item):
        if src_dir != publishPath:
            return True
        return item not in {"doctrees", "sources", ".buildinfo","search.html",
                            "searchindex.js", "objects.inv","pavement.py"}
    copy_dir(buildPath, publishPath, filter_name)
    open(publishPath.joinpath(".nojekyll"),"w").close()
