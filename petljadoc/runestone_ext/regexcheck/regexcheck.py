__author__ = 'petlja'

import os
import shutil
import json

from docutils import nodes
from docutils.parsers.rst import directives
from docutils.parsers.rst import Directive
from runestone.common.runestonedirective import add_i18n_js


def setup(app):
    app.connect('html-page-context', html_page_context_handler)
    app.add_directive('regex-check', RegexCheckDirective)

    app.add_stylesheet('regex-check.css')

    app.add_javascript('regex-check.js')
    add_i18n_js(app, {"en","sr-Cyrl","sr","sr-Latn"},"regex-check-i18n")

    app.add_node(RegexCheckQNode, html=(visit_regex_check_note_node, depart_regex_check_note_node))


def html_page_context_handler(app, pagename, templatename, context, doctree):
    app.builder.env.h_ctx = context

TEMPLATE_START = """
    <div id="%(divid)s" class="regex-check">
"""

TEMPLATE_END = """
    </div>
"""


class RegexCheckQNode(nodes.General, nodes.Element):
    def __init__(self, content):
        super(RegexCheckQNode, self).__init__()
        self.components = content


def visit_regex_check_note_node(self, node):
    node.delimiter = "_start__{}_".format(node.components['divid'])
    self.body.append(node.delimiter)
    res = TEMPLATE_START % node.components
    self.body.append(res)


def depart_regex_check_note_node(self, node):
    res = TEMPLATE_END
    self.body.append(res)
    self.body.remove(node.delimiter)


class RegexCheckDirective(Directive):
    required_arguments = 1
    optional_arguments = 0
    has_content = False
    option_spec = {}
    option_spec.update({
        'final_answer': directives.unchanged,
    })
    def run(self):
        env = self.state.document.settings.env 
        self.options['divid'] = self.arguments[0]
        ascnode = RegexCheckQNode(self.options)
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
