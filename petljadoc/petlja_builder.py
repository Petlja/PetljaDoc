from os import path

from sphinx.application import Sphinx
from sphinx.builders.html import StandaloneHTMLBuilder

class PetljaBuilder(StandaloneHTMLBuilder):
    name = 'petlja_builder'
    bc_outdir = 'bc_html'

    def __init__(self, app):
        super().__init__(app)
        self.outdir = path.join(self.outdir, self.bc_outdir)

    def get_theme_config(self):
        return 'petljadoc_bc_theme', self.config.html_theme_options

    def dump_search_index(self):
        pass

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