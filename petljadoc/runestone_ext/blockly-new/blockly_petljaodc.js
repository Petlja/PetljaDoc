window.addEventListener("load", function(){
    var toolbox = {
        "kind": "flyoutToolbox",
        "contents": [
          {
            "kind": "block",
            "type": "controls_if"
          },
          {
            "kind": "block",
            "type": "controls_repeat_ext"
          },
          {
            "kind": "block",
            "type": "logic_compare"
          },
          {
            "kind": "block",
            "type": "math_number"
          },
          {
            "kind": "block",
            "type": "math_arithmetic"
          },
          {
            "kind": "block",
            "type": "text"
          },
          {
            "kind": "block",
            "type": "text_print"
          },
        ]
      }
    var div = document.getElementById("blocklyDiv")
    var workspace = Blockly.inject(div, {toolbox: toolbox});
    
    this.document.getElementById("eval").addEventListener("click", function(){
        var code = Blockly.JavaScript.workspaceToCode(workspace);
        code = code  + 'desno();';       
        function initApi(interpreter, globalObject) {
            var wrapper = function(text) {
              return alert(arguments.length ? text : '');
            };
            interpreter.setProperty(globalObject, 'alert',
                interpreter.createNativeFunction(wrapper));
        }
          

        var myInterpreter = new Interpreter(code, initApi);
        console.log(code)
        myInterpreter.run();
    })
});