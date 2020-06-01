import os
import sys
import re
import shutil
import json
from pathlib import Path
import getpass
import click
import yaml
from colorama import Fore,init,Style
from pkg_resources import resource_filename
from paver.easy import sh
from petljadoc import bootstrap_petlja_theme
from .templateutil import apply_template_dir, default_template_arguments
from .cyr2lat import cyr2latTranslate
from .course import Activity,Lesson,Course,PetljadocError

INDEX_TEMPLATE_HIDDEN = '''
.. toctree:: 
    :hidden:
    :maxdepth: {}

'''
INDEX_TEMPLATE= '''
.. toctree:: 
    :maxdepth: {}

'''
YOUTUBE_TEMPLATE = '''
.. ytpopup:: {}
      :width: 735
      :height: 415
      :align: center
'''
PDF_TEMPLATE = '''
.. raw:: html

  <embed src="{}" width="100%" height="700px" type="application/pdf">
'''

def init_template_arguments(template_dir, defaults,project_type):
    ta = default_template_arguments()
    default_project_name = re.sub(r'\s+', '-', os.path.basename(os.getcwd()))
    ta['project_name'] = _prompt("Project name: (one word, no spaces)",
                                 default=default_project_name, force_default=defaults)
    while ' ' in ta['project_name']:
        ta['project_name'] = click.prompt("Project name: (one word, NO SPACES)")
    ta['project_type'] = project_type
    ta['build_dir'] = "./_build"
    ta['dest'] = "../../static"
    ta['use_services'] = "false"
    ta['author'] = _prompt("Author's name", default=getpass.getuser(), force_default=defaults)
    ta['project_title'] = _prompt("Project title",
                                  default=f"Petlja course {os.path.basename(os.getcwd())}",
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
        if project_type == 'runestone':
            theme_path = os.path.join(bootstrap_petlja_theme.runestone_theme.get_html_theme_path(),
                                      'runestone_theme')
        else:
            theme_path = os.path.join(bootstrap_petlja_theme.runestone_theme.get_html_theme_path(),
                                      'course_theme')
        apply_template_dir(theme_path,
                           os.path.join(ta['html_theme_path'], ta['html_theme']), {},
                           lambda dir, fname: fname not in ['__init__.py','__pycache__'])


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

def parse_yaml(path):
    with open('_sources/index.yaml', encoding='utf8') as f:
        data = yaml.load(f, Loader=yaml.FullLoader,)
        course = check_structure(data)
        index = open('_intermediate/index.rst',mode = 'w+',encoding='utf-8')
        write_to_index(index,course)
        path = path.joinpath('_intermediate')
        for lesson in course.active_lessons:
            copy_dir('_sources/'+lesson.title,'_intermediate/'+lesson.title)
            index.write(' '*4+ lesson.title +'/index\n')
            section_index = open(path.joinpath(lesson.title).joinpath('index.rst'),
                                 mode = 'w+',
                                 encoding='utf-8')
            section_index.write("="*len(lesson.title)+'\n'+
                                lesson.title+'\n'+
                                "="*len(lesson.title)+'\n')
            section_index.write(INDEX_TEMPLATE.format(1))
            for activity in lesson.active_activies:
                if activity.activity_type in ['reading','quiz']:
                    if activity.get_src_ext() == 'rst':
                        section_index.write(' '*4+activity.src+'\n')
                    if activity.get_src_ext() == 'pdf':
                        pdf_rst = open('_intermediate/'+lesson.title+'/'+activity.title+'.rst',
                                       mode = 'w+',encoding='utf-8')
                        pdf_rst.write(activity.title+'\n'+"="*len(activity.title)+'\n')
                        pdf_rst.write(PDF_TEMPLATE.format('/_static/'+activity.src))
                        section_index.write(' '*4+activity.title+'.rst\n')
                if activity.activity_type == 'video':
                    video_rst = open('_intermediate/'+lesson.title+'/'+activity.title+'.rst',
                                     mode = 'w+',encoding='utf-8')
                    video_rst.write(activity.title+'\n'+"="*len(activity.title)+'\n')
                    video_rst.write(YOUTUBE_TEMPLATE.format(activity.src.rsplit('/',1)[1]))
                    section_index.write(' '*4+activity.title+'.rst\n')

def prebuild():
    p = Path(os.getcwd())
    if not p.joinpath('_sources/index.yaml').exists():
        raise click.ClickException("index.yaml is not present in source directory")
    if not p.joinpath('_intermediate').exists():
        os.mkdir('_intermediate')
    parse_yaml(p)


@click.group()
def main():
    """
    Petlja's command-line interface for learning content

    For help on specific command, use: petljadoc [COMMAND] --help
    """

@main.command('init-course')
@click.option("--yes","-y", is_flag=True, help="Answer positive to all confirmation questions.")
@click.option("--defaults", is_flag=True, help="Always select the default answer.")
def init_course(yes, defaults):
    """
    Create a new Runestone project in your current directory
    """
    template_dir = resource_filename('petljadoc', 'project-templates/course')
    print("This will create a new Runestone project in your current directory.")
    if [f for f in os.listdir() if f[0] != '.']:
        raise click.ClickException("Current directrory in not empty")
    if not yes:
        click.confirm("Do you want to proceed? ", abort=True, default=True)
    init_template_arguments(template_dir,defaults,'course')



@main.command('init-runestone')
@click.option("--yes","-y", is_flag=True, help="Answer positive to all confirmation questions.")
@click.option("--defaults", is_flag=True, help="Always select the default answer.")
def init_runestone(yes, defaults):
    """
    Create a new Runestone project in your current directory
    """
    template_dir = resource_filename('petljadoc', 'project-templates/runestone')
    print("This will create a new Runestone project in your current directory.")
    if [f for f in os.listdir() if f[0] != '.']:
        raise click.ClickException("Current directrory in not empty")
    if not yes:
        click.confirm("Do you want to proceed? ", abort=True, default=True)
    init_template_arguments(template_dir,defaults,'runestone')


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
    p = Path(os.getcwd())
    if p.joinpath('conf-petljadoc.json').exists():
        with open('conf-petljadoc.json') as f:
            data = json.load(f)
            if data["project_type"] == "course":
                prebuild()
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


@main.command()
def cyr2lat():
    """
    Translate from cyrilic to latin letters. Source folder must end with 'Cyrl'.
    """
    sourcePath = os.getcwd()
    print(sourcePath)
    if sourcePath.endswith('Cyrl'):
        destinationPath = Path(sourcePath.split('Cyrl')[0] + "Lat")
        print(destinationPath)
        cyr2latTranslate(sourcePath, destinationPath)
    else:
        print('Folder name must end with Cyrl')

def check_structure(data):
    error_log = {}
    archived_lessons = []
    active_lessons = []
    error_log['courseId'], courseId = check_component(data,'courseId',PetljadocError.ERROR_ID)
    error_log['lang'], lang = check_component(data, 'lang', PetljadocError.ERROR_LANG)
    error_log['title'], title_course = check_component(data, 'title', PetljadocError.ERROR_TITLE)
    error_log['description'],_ = check_component(data, 'description', PetljadocError.ERROR_DESC)
    if error_log['description']:
        error_log['willLearn'] ,willLearn = check_component(data['description'],'willLearn',PetljadocError.ERROR_WILL_LEARN)
        error_log['requirements'] ,requirements = check_component(data['description'],'requirements',PetljadocError.ERROR_REQUIREMENTS)
        error_log['toc'], toc = check_component(data['description'],'toc',PetljadocError.ERROR_TOC)
        error_log['externalLinks'], externalLinks = check_component(data['description'],'externalLinks','',False)
    error_log['lessons'], _ = check_component(data, 'lessons', PetljadocError.ERROR_LESSONS)
    if error_log['lessons']:
        lessons = data['lessons'][0]
        start_index = 0
        if 'archived' in lessons:
            start_index = 1
            for arhived_lesson in lessons['archived']:
                error_log['archived_lesson_guid'], archived_guid =  check_component(arhived_lesson,'guid','')
                if error_log['archived_lesson_guid']:
                    archived_lessons.append(archived_guid)
        for i,lesson in enumerate(data['lessons'][start_index:],start=1):
            error_log[str(i)+'_lesson_title'], title = check_component(lesson['lesson'],'title',PetljadocError.ERROR_LESSON_TITLE.format(i))
            error_log[str(i)+'_lesson_guid'],guid = check_component(lesson['lesson'],'guid',PetljadocError.ERROR_LESSON_GUID.format(i))
            error_log[str(i)+'_lesson_description'], description = check_component(lesson['lesson'],'description','',False)
            error_log[str(i)+'_lesson_activities'], lesson_activities = check_component(lesson['lesson'],'activities',PetljadocError.ERROR_LESSON_ACTIVITIES.format(i))
            if error_log[str(i)+'_lesson_activities']:
                first_lesson_activities = lesson_activities[0]
                start_index_activities = 0
                archived_activities = []
                if 'archived' in first_lesson_activities:
                    start_index_activities = 1
                    if first_lesson_activities['archived']:
                        for archived_activity in first_lesson_activities['archived']:
                            error_log[str(i)+'_archived_activity_guid'], archived_activity_guid =  check_component(archived_activity,'guid','')
                            if error_log[str(i)+'_archived_activity_guid']:
                                archived_activities.append(archived_activity_guid)
                active_activies =[]
                for j,activity in enumerate(lesson_activities[start_index_activities:],start=1):
                    activity_type =list(activity.keys())[0]
                    error_log[str(i)+'_'+str(j)+'_activity_title'] = activity_type in ['reading','video','quiz']
                    if not error_log[str(i)+'_'+str(j)+'_activity_title']:
                        print_error(PetljadocError.ERROR_UNKNOWN_ACTIVITY.format(i))
                    error_log[str(i)+'_'+str(j)+'_activity_title'], activity_title = check_component(activity,'title',PetljadocError.ERROR_ACTIVITY_TITLE.format(i,j))
                    error_log[str(i)+'_'+str(j)+'_activity_guid'], activity_guid = check_component(activity,'guid',PetljadocError.ERROR_ACTIVITY_GUID.format(i,j))
                    error_log[str(i)+'_'+str(j)+'_activity_descripiton'], activity_description = check_component(activity,'description','',False)
                    error_log[str(i)+'_'+str(j)+'_activity_src'], activity_src =  check_component(activity,'file','')
                    if not error_log[str(i)+'_'+str(j)+'_activity_src']:
                        error_log[str(i)+'_'+str(j)+'_activity_src'], activity_src =  check_component(activity,'url','')
                    if not error_log[str(i)+'_'+str(j)+'_activity_src']:
                        print_error(PetljadocError.ERROR_ACTIVITY_SRC)
                    active_activies.append(Activity(activity_type,activity_title,activity_src,activity_guid,activity_description))
                active_lessons.append(Lesson(title,guid,description,archived_activities,active_activies))

    course = Course(courseId,lang,title_course,willLearn,requirements,toc,externalLinks,archived_lessons,active_lessons)
    error_log['guid_integrity'] = course.guid_check()
    if not course.guid_check():
        print_error(PetljadocError.ERROR_DUPLICATE_GUID)
    error_log['source_integrity'],missing_src = course.source_check()
    if not error_log['source_integrity']:
        print_error(PetljadocError.ERROR_SOURCE_MISSING)
        for src in missing_src:
            print(src)
        print()
    if False in error_log.values():
        print_error(PetljadocError.ERROR_MSG_BUILD)
        exit(-1)

    return course

def check_component(dictionary,component,error_msg,required = True):
    try:
        item = dictionary[component]
    except KeyError:
        if required:
            if error_msg != '':
                print_error(error_msg)
            return [False,'']
        else:
            return [True,'']
    else:
        return [True,item]


def write_to_index(index,course):
    index.write("="*len(course.title)+'\n'+
                course.title+'\n'+
                "="*len(course.title)+'\n')
    index.write('\n')
    index.write('Sta cete nauciti:\n')
    for willlearn in course.willlearn:
        index.write(' '*4+'- '+willlearn+'\n')
    index.write('\n')
    index.write('Potrebon:\n')
    for requirements in course.requirements:
        index.write(' '*4+'- '+requirements+'\n')
    index.write('\n')
    index.write('Sadrzaj kursa:'+'\n')
    for toc in course.toc:
        index.write(' '*4+'- '+toc+'\n')
    index.write('\n')
    index.write(INDEX_TEMPLATE_HIDDEN.format(3))


def print_error(error):
    init()
    print(Fore.RED, error)
    print(Style.RESET_ALL)
