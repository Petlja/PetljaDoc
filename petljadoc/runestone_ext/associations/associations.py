__author__ = 'petlja'

import os
import shutil

from docutils import nodes
from docutils.parsers.rst import directives
from docutils.parsers.rst import Directive


def setup(app):
    app.connect('html-page-context', html_page_context_handler)
    app.add_directive('associations', AssociationsDirective)

    app.add_stylesheet('associations.css')

    app.add_javascript('associations.js')

    app.add_node(AssociationsQNode, html=(visit_info_note_node, depart_info_note_node))


def html_page_context_handler(app, pagename, templatename, context, doctree):
    app.builder.env.h_ctx = context

TEMPLATE_START = """
    <div id="%(divid)s" class="associations" data-code="%(code)s" %(imgpath)s %(scale)s>
"""

TEMPLATE_END = """
    </div>
"""


class AssociationsQNode(nodes.General, nodes.Element):
    def __init__(self, content):
        super(AssociationsQNode, self).__init__()
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


class AssociationsDirective(Directive):
    required_arguments = 1
    optional_arguments = 0
    has_content = False
    option_spec = {}
    option_spec.update({
        'folder': directives.unchanged,
        'script': directives.unchanged,
        'images': directives.unchanged,
        'scale': directives.unchanged,
    })
    def run(self):
        env = self.state.document.settings.env 
        self.options['divid'] = self.arguments[0]
        ascnode = AssociationsDirective(self.options)
        return [ascnode]

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
