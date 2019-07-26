import getpass
import click
from pkg_resources import resource_filename
from .templateutil import copy_and_render

@click.group()
def main():
    """
    Petlja's command-line interface for learning content
    """

@main.command()
def hello():
    print("Hello World!")

@main.command('init-runestone')
def init_runestone():
    template_base_dir = resource_filename('petljadoc', '_templates/runestone')
    print("This will create a new Runestone project in your current directory.")
    click.confirm("Do you want to proceed? ", abort=True, default=True)
    tp = {} # template parameters
    tp['project_name'] = click.prompt("Project name: (one word, no spaces)")
    while ' ' in tp['project_name']:
        tp['project_name'] = click.prompt("Project name: (one word, NO SPACES)")
    tp['build_dir'] = "./build"
    tp['dest'] = "../../static"
    tp['use_services'] = "false"
    tp['author'] = click.prompt("Your Name ", default=getpass.getuser())
    tp['project_title'] = click.prompt("Title for this project ", default="Runestone Default")
    tp['python3'] ="true"
    tp['default_ac_lang'] = click.prompt("Default ActiveCode language", default="python")
    tp['basecourse'] = tp['project_name']
    tp['login_req'] = "false"
    tp['master_url'] = "http://127.0.0.1:8000"
    tp['logging'] = False
    tp['log_level'] = 0
    tp['dburl'] = ""
    tp['enable_chatcodes'] = 'false'
    tp['downloads_enabled'] = 'false'
    copy_and_render(template_base_dir, '.', tp)
