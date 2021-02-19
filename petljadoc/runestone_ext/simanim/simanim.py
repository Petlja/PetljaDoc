__author__ = 'petlja'

import os

from docutils import nodes
from docutils.parsers.rst import directives
from docutils.parsers.rst import Directive


def setup(app):
    app.connect('html-page-context', html_page_context_handler)
    app.add_directive('simanim', SinAnimDirective)

    app.add_stylesheet('simanim.css')

    app.add_javascript('simanim.js')
    app.add_javascript('sim-drawing-api.js')
    app.add_javascript('https://cdn.jsdelivr.net/pyodide/v0.16.1/full/')
    app.add_javascript('https://cdn.jsdelivr.net/pyodide/v0.16.1/full/pyodide.js')

    app.add_node(SinAnimQNode, html=(visit_info_note_node, depart_info_note_node))


def html_page_context_handler(app, pagename, templatename, context, doctree):
    app.builder.env.h_ctx = context

TEMPLATE_START = """
    <div id="%(divid)s" class="simanim" data-code="%(code)s">
"""

TEMPLATE_END = """
    </div>
"""


class SinAnimQNode(nodes.General, nodes.Element):
    def __init__(self, content):
        super(SinAnimQNode, self).__init__()
        self.components = content


def visit_info_note_node(self, node):
    node.delimiter = "_start__{}_".format(node.components['divid'])
    self.body.append(node.delimiter)
    res = TEMPLATE_START % node.components
    self.body.append(res)


def depart_info_note_node(self, node):
    res = TEMPLATE_END
    self.body.append(res)
    self.body.remove(node.delimiter)


class SinAnimDirective(Directive):
    required_arguments = 1
    optional_arguments = 0
    has_content = True
    option_spec = {}
    option_spec.update({
        'includesrc': directives.unchanged
    })
    def run(self):


        env = self.state.document.settings.env

        if 'includesrc' in self.options:
            fname = self.options['includesrc'].replace('\\', '/')
            cwd = os.path.abspath(os.getcwd())
            path = os.path.join(cwd, fname)
            print(path)
            with open(path, encoding='utf-8') as f:
                self.options['code'] = html_escape(f.read())      
        else:
            self.options['code'] = ""

        self.options['divid'] = self.arguments[0]

        simnode = SinAnimQNode(self.options)

        return [simnode]

html_escape_table = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
    ">": "&gt;",
    "<": "&lt;",
    }

def html_escape(text):
    """Produce entities within text."""
    return "".join(html_escape_table.get(c,c) for c in text)
