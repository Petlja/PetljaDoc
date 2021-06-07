
__author__ = 'petlja'

from docutils import nodes
from docutils.parsers.rst import directives
from docutils.parsers.rst import Directive


def setup(app):
    app.add_directive('videop', YtPopUp)
    app.add_stylesheet('https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css')
    app.add_stylesheet('video.css')
    app.add_javascript('petljavideo.js')


SOURCE = """<source src="%s" type="video/%s"></source>"""



class IframeVideo(Directive):
    has_content = False
    required_arguments = 1
    optional_arguments = 0
    final_argument_whitespace = False
    option_spec = {
        'height': directives.nonnegative_int,
        'width': directives.nonnegative_int,
        'divid': directives.unchanged
    }
    default_width = 500
    default_height = 281

    def run(self):
        self.options['video_id'] = directives.uri(self.arguments[0])
        if not self.options.get('width'):
            self.options['width'] = self.default_width
        if not self.options.get('height'):
            self.options['height'] = self.default_height
        if not self.options.get('align'):
            self.options['align'] = 'left'
        if not self.options.get('http'):
            self.options['http'] = 'https'
        if not self.options.get('divid'):
            self.options['divid'] = self.arguments[0]
        
        res = self.html % self.options
        raw_node = nodes.raw(self.block_text, res, format='html')
        raw_node.source, raw_node.line = self.state_machine.get_source_and_line(self.lineno)
        return [raw_node]

class YtPopUp(IframeVideo):
    """
.. youtube:: YouTubeID
   :height: 315
   :width: 560
   """
    html = '''
    <div  id="%(video_id)s" class="ytvideo-petlja"  style="text-align: center; margin: 15px; cursor:pointer;">
        <div style="background-image: url('https://img.youtube.com/vi/%(video_id)s/mqdefault.jpg'); background-repeat: no-repeat;background-position: center; height: 210px; width: 310px; margin: 0 auto; border: 1px solid #20c997">
            <img src="/_static/images/play_button.svg" style="margin-top: 78px;" /> 
        </div>
      

        </div>
    <div id="modal-%(video_id)s" class="ytvideo-closepetlja" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(128, 182, 128, 0.3); z-index: 10000;">
        <div style="background-color: white; position: fixed; top: 4vh; left: 5vw; width:  90vw; height:  90vh; z-index: 100;" id="YTmodal-%(video_id)s">
        </div>
    </div>
    
    
    '''
    def run(self):
            raw_node = super(YtPopUp, self).run()
            return raw_node

