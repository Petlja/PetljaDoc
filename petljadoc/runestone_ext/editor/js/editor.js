function WrappingAscorinaion(){
    var editorArray = [];

    

    function Editor(opts){
        if(opts){
        this.init(opts);
        }
    }

    Editor.prototype.init =  function(opts){
        this.opts = opts;
        this.data = JSON.parse(popAttribute(opts,"data"));
        this.id = opts.id;
        this.lang = document.documentElement.lang || 'sr';
    }

    Editor.prototype.funkcija = function(group){
        
        // nesto
    }


    function popAttribute(element, atribute, fallback){
        var atr = fallback;
        if (element.hasAttribute(atribute)){
            atr = element.getAttribute(atribute);
            element.removeAttribute(atribute);
        }
        return atr;
    }

    function getEditorFiles(editor) {
        var files = [];
        ['html', 'js', 'css'].forEach(function(type) {
            if (editor.data.hasOwnProperty(type)) {
                files.push(editor.data[type].name);
            }
        });
        return files;
    }

    function getEditorLabel(editor) {
        var files = getEditorFiles(editor);
        if (files.length) {
            return 'Petlja editor: ' + files.join(', ');
        }
        return 'Petlja editor';
    }

    function getPreviewTitle(editor) {
        return $.i18n('show_page') + ': ' + editor.id;
    }

    function ensureDocumentLang(htmlData, lang) {
        if (/<html\b[^>]*\slang=/i.test(htmlData) || !/<html\b/i.test(htmlData)) {
            return htmlData;
        }

        return htmlData.replace(/<html\b/i, '<html lang="' + lang + '"');
    }

    function setCodeMirrorLabel(codeMirror, label, lang) {
        var inputField = codeMirror.getInputField();
        var wrapper = codeMirror.getWrapperElement();

        if (inputField) {
            inputField.setAttribute('aria-label', label);
            inputField.setAttribute('lang', lang);
        }

        if (wrapper) {
            wrapper.setAttribute('lang', lang);
        }
    }

    function createEditorPanel(editor, type, hidden) {
        var panel = document.createElement('div');
        panel.setAttribute('class', hidden ? 'editor-container d-none' : 'editor-container');
        panel.setAttribute('id', type + 'editor-' + editor.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', type + 'tab-' + editor.id);
        panel.setAttribute('lang', editor.lang);
        if (hidden) {
            panel.setAttribute('hidden', 'hidden');
        }
        return panel;
    }

    function createTabButton(editor, type, label, selected) {
        var tabButton = document.createElement('button');
        tabButton.setAttribute('type', 'button');
        tabButton.setAttribute('class', selected ? 'editor-title active' : 'editor-title');
        tabButton.setAttribute('data-editorid', editor.id);
        tabButton.setAttribute('data-tab', type);
        tabButton.setAttribute('id', type + 'tab-' + editor.id);
        tabButton.setAttribute('role', 'tab');
        tabButton.setAttribute('aria-controls', type + 'editor-' + editor.id);
        tabButton.setAttribute('aria-selected', selected ? 'true' : 'false');
        tabButton.setAttribute('tabindex', selected ? '0' : '-1');
        tabButton.setAttribute('lang', editor.lang);
        tabButton.textContent = label;
        return tabButton;
    }

    function setTabSelection(tabButton, selected) {
        tabButton.classList.toggle('active', selected);
        tabButton.setAttribute('aria-selected', selected ? 'true' : 'false');
        tabButton.setAttribute('tabindex', selected ? '0' : '-1');
    }

    function setPanelVisibility(panel, hidden) {
        panel.classList.toggle('d-none', hidden);
        if (hidden) {
            panel.setAttribute('hidden', 'hidden');
        }
        else {
            panel.removeAttribute('hidden');
        }
    }

    function activateTab(editorId, tab) {
        var root = document.getElementById(editorId);
        if (!root) {
            return;
        }

        Array.prototype.forEach.call(root.querySelectorAll('.editor-title[role="tab"]'), function(tabButton) {
            setTabSelection(tabButton, tabButton.dataset.tab === tab);
        });

        Array.prototype.forEach.call(root.querySelectorAll('.editor-container[role="tabpanel"]'), function(panel) {
            setPanelVisibility(panel, panel.id !== tab + 'editor-' + editorId);
        });

        var preview = document.getElementById(editorId + '-iframe');
        if (preview) {
            preview.classList.add('d-none');
            preview.setAttribute('hidden', 'hidden');
        }
    }

    function showPreview(editorId) {
        var root = document.getElementById(editorId);
        if (!root) {
            return;
        }

        Array.prototype.forEach.call(root.querySelectorAll('.editor-title[role="tab"]'), function(tabButton) {
            setTabSelection(tabButton, false);
        });

        Array.prototype.forEach.call(root.querySelectorAll('.editor-container[role="tabpanel"]'), function(panel) {
            setPanelVisibility(panel, true);
        });

        var preview = document.getElementById(editorId + '-iframe');
        if (preview) {
            preview.classList.remove('d-none');
            preview.removeAttribute('hidden');
        }
    }

    window.addEventListener('load',function() {
        var editors = document.getElementsByClassName('petlja-editor');
        for (var i = 0; i < editors.length; i++) {
            editorArray[i] = new Editor(editors[i]);		
        }

        editorArray.forEach(editor => {
            editor.opts.setAttribute('role', 'region');
            editor.opts.setAttribute('aria-label', getEditorLabel(editor));
            editor.opts.setAttribute('lang', editor.lang);

            var editorsContainer = document.createElement('div');
            editorsContainer.setAttribute('class', 'editor-cotainer');
            var editorsContainerTabs = document.createElement('div');
            editorsContainerTabs.setAttribute('id', 'tabs-' + editor.id);
            editorsContainerTabs.setAttribute('class','title-tab');
            editorsContainerTabs.setAttribute('role', 'tablist');
            editorsContainerTabs.setAttribute('aria-label', 'Datoteke editora');
            editorsContainer.append(editorsContainerTabs);
            document.getElementById(editor.id).append(editorsContainer);
            if (editor.data.hasOwnProperty('html')) {
                var htmlDiv = createEditorPanel(editor, 'html', false);
                var editorTabLabel = createTabButton(editor, 'html', editor.data['html'].name, true);
                editorsContainerTabs.append(editorTabLabel);
                document.getElementById(editor.id).append(htmlDiv);
                var htmlCodeMirror = CodeMirror(htmlDiv, {
                    value: editor.data['html'].source,
                    mode:  "htmlmixed",
                    lineNumbers: true,
                    id: 'codeMirror-' + editor.id + '-html',
                    lineWrapping: true,
                  });
                  htmlCodeMirror.setSize(null,275);
                                    setCodeMirrorLabel(htmlCodeMirror, editor.data['html'].name, editor.lang);
                  editor.htmlEditor  = htmlCodeMirror;
            }

            if (editor.data.hasOwnProperty('js')) {
                                var jsDiv = createEditorPanel(editor, 'js', true);
                                var editorTabLabel = createTabButton(editor, 'js', editor.data['js'].name, false);
                editorsContainerTabs.append(editorTabLabel);
                document.getElementById(editor.id).append(jsDiv);
                var jsCodeMirror = CodeMirror(jsDiv, {
                    value: editor.data['js'].source,
                    mode:  "javascript",
                    lineNumbers: true,
                    id: 'codeMirror-' + editor.id + '-js'
                  });
                  jsCodeMirror.setSize(null,275);
                                setCodeMirrorLabel(jsCodeMirror, editor.data['js'].name, editor.lang);
                editor.jsEditor  = jsCodeMirror;
            }
            if (editor.data.hasOwnProperty('css')) {
                                var cssDiv = createEditorPanel(editor, 'css', true);
                                var editorTabLabel = createTabButton(editor, 'css', editor.data['css'].name, false);
                editorsContainerTabs.append(editorTabLabel);
                document.getElementById(editor.id).append(cssDiv);
                var cssCodeMirror = CodeMirror(cssDiv, {
                    value: editor.data['css'].source,
                    mode:  "css",
                    lineNumbers: true,
                    id: 'codeMirror-' + editor.id + '-css'
                  });
                  cssCodeMirror.setSize(null,275);
                  setCodeMirrorLabel(cssCodeMirror, editor.data['css'].name, editor.lang);
                  editor.cssEditor  = cssCodeMirror;
            }


            Array.prototype.forEach.call(editorsContainerTabs.querySelectorAll('.editor-title[role="tab"]'), function(elem) {
                elem.addEventListener('click', function(e) {
                    var editorId = e.currentTarget.dataset.editorid;
                    var tab = e.currentTarget.dataset.tab;
                    activateTab(editorId, tab);
                    document.getElementById(tab + 'editor-' + editorId).children[0].CodeMirror.refresh();
                });
            })
            

            var htmliframe = document.createElement('iframe');
            htmliframe.setAttribute('class', 'editor-container d-none');
            htmliframe.setAttribute('id', editor.id + "-iframe");
            htmliframe.setAttribute('title', getPreviewTitle(editor));
            htmliframe.setAttribute('lang', editor.lang);
            htmliframe.setAttribute('hidden', 'hidden');
            document.getElementById(editor.id).append(htmliframe);
                
            var playBtn = document.createElement('button');
            playBtn.setAttribute('type', 'button');
            playBtn.textContent = $.i18n("show_page");
            playBtn.setAttribute('data-editorid', editor.id);
            playBtn.setAttribute('class', 'editor-play');
            playBtn.setAttribute('lang', editor.lang);
            playBtn.addEventListener('click', function(e) {
                var editorsId = e.currentTarget.dataset.editorid;
                var editor = editorArray.find(e => e.id == editorsId);

                var htmlData = ensureDocumentLang(editor.htmlEditor.getValue(), editor.lang);

                if (editor.data.hasOwnProperty('css')) {
                    var cssBlob = new Blob(["" + editor.cssEditor.getValue()], {type: "text/css"});
                    htmlData = htmlData.replaceAll(editor.data["css"].name, URL.createObjectURL(cssBlob));

                }
                
                if (editor.data.hasOwnProperty('js')) {
                    var jsBlob = new Blob(["" + editor.jsEditor.getValue()], {type: "text/javascript"});
                    htmlData = htmlData.replaceAll(editor.data["js"].name, URL.createObjectURL(jsBlob));

                }


                var htmlBlob = new  Blob(["" + htmlData], {type: "text/html"});
                var htmlURL = URL.createObjectURL(htmlBlob);

                if(!document.getElementById(editor.id + "-iframe")) {
                var htmliframe = document.createElement('iframe');
                htmliframe.setAttribute('style', 'width: calc(50% - 3px); height: 330px; display: none;');
                htmliframe.setAttribute('id', editor.id + "-iframe");
                htmliframe.setAttribute('title', getPreviewTitle(editor));
                htmliframe.setAttribute('lang', editor.lang);
                document.getElementById(editor.id).append(htmliframe);
                } else {
                    showPreview(editor.id);
                }
                
                document.getElementById(editor.id + "-iframe").setAttribute('src', htmlURL);

                

            });


            var downloadBtn = document.createElement('button');
            downloadBtn.setAttribute('type', 'button');
            downloadBtn.innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>';
            downloadBtn.setAttribute('data-editorid', editor.id);
            downloadBtn.setAttribute('class', 'editor-play ml-3');
            downloadBtn.setAttribute('aria-label', 'Preuzmi datoteke editora');
            downloadBtn.setAttribute('lang', editor.lang);
            downloadBtn.addEventListener('click', function(e) {
                var editorsId = e.currentTarget.dataset.editorid;
                var editor = editorArray.find(e => e.id == editorsId);

                var zip = new JSZip();
                zip.file(editor.data["html"].name, editor.htmlEditor.getValue());
                if (editor.data.js)
                    zip.file(editor.data["js"].name, editor.jsEditor.getValue());
                if (editor.data.css)
                zip.file(editor.data["css"].name , editor.cssEditor.getValue());


                zip.generateAsync({type:"base64"}).then(function (content) {
                    var link = document.createElement('a');
                    link.href = "data:application/zip;base64," + content;
                    link.download = "petlja-files.zip";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
               });

                

            });
            var btnDiv = document.createElement('div');
            editorsContainerTabs.append(downloadBtn)
            editorsContainerTabs.append(playBtn);
            btnDiv.setAttribute('class', 'editor-btn');
            document.getElementById(editor.id).append(btnDiv);
        });


    });
}
WrappingAscorinaion();