from os import path
from pkg_resources import resource_filename

from sphinx.application import Sphinx
from sphinx.builders.html import StandaloneHTMLBuilder
from sphinx.util.fileutil import copy_asset
from sphinx.util.matching import DOTFILES

class PetljaBuilder(StandaloneHTMLBuilder):
    name = 'petlja_builder'
    bc_outdir = 'bc_html'

    def __init__(self, app):
        super().__init__(app)
        self.outdir = path.join(self.outdir, self.bc_outdir)
        self.app.outdir = self.outdir
        self.search = False
        self.copysource = False
        petlja_player_driver = resource_filename('petljadoc', 'themes/bc_theme/platform')
        copy_asset(petlja_player_driver, path.join(self.outdir, 'platform'), excluded=DOTFILES)


    def get_theme_config(self):
        return 'petljadoc_bc_theme', self.config.html_theme_options

    def gen_indices(self):
        pass

    #def dump_search_index(self):
    #    pass

    def write_buildinfo(self):
        pass

    def dump_inventory(self):
        pass

    #def get_outfilename(self, pagename):   
    #    return  path.join(self.outdir, 'bc_content' , pagename + self.out_suffix)

    #def get_target_uri(self, docname, typ=None):
    #    return 'bc_content' + SEP + docname + SEP

def setup(app: Sphinx):
    app.setup_extension('sphinx.builders.html')
    app.add_builder(PetljaBuilder)