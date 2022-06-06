"use strict";

$(document).ready(function() {
    var errorText = {};
    
    errorText.ErrorTitle = $.i18n("msg_activecode_error_title");
    errorText.DescriptionTitle = $.i18n("msg_activecode_description_title");
    errorText.ToFixTitle = $.i18n("msg_activecode_to_fix_title");
    errorText.ParseError = $.i18n("msg_activecode_parse_error");
    errorText.ParseErrorFix = $.i18n( "msg_activecode_parse_error_fix");
    errorText.TypeError = $.i18n("msg_activecode_type_error");
    errorText.TypeErrorFix = $.i18n("msg_activecode_type_error_fix");
    errorText.NameError = $.i18n("msg_activecode_name_error");
    errorText.NameErrorFix = $.i18n("msg_activecode_name_error_fix");
    errorText.ValueError = $.i18n("msg_activecode_value_error");
    errorText.ValueErrorFix = $.i18n("msg_activecode_value_error_fix");
    errorText.AttributeError = $.i18n("msg_activecode_attribute_error");
    errorText.AttributeErrorFix = $.i18n("msg_activecode_attribute_error_fix");
    errorText.TokenError = $.i18n("msg_activecode_token_error");
    errorText.TokenErrorFix =  $.i18n("msg_activecode_token_error_fix");
    errorText.TimeLimitError = $.i18n("msg_activecode_time_limit_error");
    errorText.TimeLimitErrorFix = $.i18n("msg_activecode_time_limit_error_fix");
    errorText.Error = $.i18n("msg_activecode_general_error");
    errorText.ErrorFix = $.i18n("msg_activecode_general_error_fix");
    errorText.SyntaxError = $.i18n("msg_activecode_syntax_error");
    errorText.SyntaxErrorFix = $.i18n("msg_activecode_syntax_error_fix");
    errorText.IndexError = $.i18n("msg_activecode_index_error");
    errorText.IndexErrorFix = $.i18n("msg_activecode_index_error_fix");
    errorText.URIError = $.i18n("msg_activecode_uri_error");
    errorText.URIErrorFix = $.i18n("msg_activecode_uri_error_fix");
    errorText.ImportError = $.i18n("msg_activecode_import_error");
    errorText.ImportErrorFix = $.i18n("msg_activecode_import_error_fix");
    errorText.ReferenceError = $.i18n("msg_activecode_reference_error");
    errorText.ReferenceErrorFix = $.i18n("msg_activecode_reference_error_fix");
    errorText.ZeroDivisionError = $.i18n("msg_activecode_zero_division_error");
    errorText.ZeroDivisionErrorFix = $.i18n("msg_activecode_zero_division_error_fix");
    errorText.RangeError = $.i18n("msg_activecode_range_error");
    errorText.RangeErrorFix = $.i18n("msg_activecode_range_error_fix");
    errorText.InternalError = $.i18n("msg_activecode_internal_error");
    errorText.InternalErrorFix = $.i18n("msg_activecode_internal_error_fix");
    errorText.IndentationError = $.i18n("msg_activecode_indentation_error");
    errorText.IndentationErrorFix = $.i18n("msg_activecode_indentation_error_fix");
    errorText.NotImplementedError = $.i18n("msg_activecode_not_implemented_error");
    errorText.NotImplementedErrorFix = $.i18n("msg_activecode_not_implemented_error_fix");
    
    $('[data-component=karel]').each( function(index ) {
        var outerDiv = $(this)[0];
        var canvas = $(this).find(".world")[0];
        var textarea = $(this).find(".codeArea")[0];
        var configarea = $(this).find(".configArea")[0];
        var problemId  = this.id;

        var editor = CodeMirror.fromTextArea(textarea,{lineNumbers: true,
            mode: "python", indentUnit: 4,
            matchBrackets: true, autoMatchParens: true,
            extraKeys: {"Tab": "indentMore", "Shift-Tab": "indentLess"}});
	    var config = (new Function('return '+configarea.value.replace('<!--x','').replace('x-->','')))();
	    var code = config.setup().code;
	    code = (code ?
		    (code.length ? code.join("\n") : code)
		    : "from karel import * \n");
	    editor.setValue(code);

        var div = document.getElementById("blocklyDiv")
        var workspace = Blockly.inject(div, {toolbox: toolbox});
               
        var setup = config.setup();
        var robot = setup.robot;
        var world = setup.world;
        robot.setWorld(world)
        var drawer = new RobotDrawer(canvas, 500);
        drawer.drawFrame(robot);


        function initApi(interpreter, globalObject) {
            drawer.start();
                var wrapper = function(text) {
                return alert(arguments.length ? text : '');
            };
            interpreter.setProperty(globalObject, 'alert',
            interpreter.createNativeFunction(wrapper));
            wrapper = function() {
                robot.move();
                drawer.addFrame(robot.clone());
            };
            interpreter.setProperty(globalObject, 'napred',
            interpreter.createNativeFunction(wrapper));
        }

        $(this).find(".run-button").click(function () {
            var code = Blockly.JavaScript.workspaceToCode(workspace);      
            var myInterpreter = new Interpreter(code, initApi);
            console.log(code)
            myInterpreter.run();
        });

        $(this).find(".reset-button").click(function () {
            reset();
        });

        $(this).find(".blockly-button").click(function () {
            var code = editor.getValue().replace(/\?\?\?\s+/g, "___ ")
            .replace(/\?\?\?/g,"___");
            var bpm = new BlocklPyModal();
            bpm.open(Blockly.Msg.Title[$.i18n().locale], 700, 500, code, eBookConfig.staticDir + 'blockly/',
               function(src) {
                  if(src) {
                    editor.setValue("from karel import * \n" + src.replace(/\_\_\_/g,"???"));
                  }
               });
        });

        function outf(text){
            console.log(text);
        }

        function reset(){

        }

        function builtinRead(x) {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
            return Sk.builtinFiles["files"][x];
        }

		function showEndMessageSuccess(){
            var eContainer = outerDiv.appendChild(document.createElement('div'));
            eContainer.className = 'col-md-12 alert alert-success';
            eContainer.id = problemId+"-success"; 
            var msgHead = $('<p>').html($.i18n("msg_karel_correct"));
            eContainer.appendChild(msgHead[0]);
            $('.run-button').removeAttr('disabled')
            $('.reset-button').removeAttr('disabled');;
		}

		function showEndMessageError(message){
            var eContainer = outerDiv.appendChild(document.createElement('div'));
            eContainer.className = 'col-md-12 alert alert-danger';
            eContainer.id = problemId+"-error";
            var msgHead = $('<p>').html(message);
            eContainer.appendChild(msgHead[0]);
            $('.run-button').removeAttr('disabled');
            $('.reset-button').removeAttr('disabled');
		}

        function showError(err) {
            //logRunEvent({'div_id': this.divid, 'code': this.prog, 'errinfo': err.toString()}); // Log the run event
            var errHead = $('<h3>').html(errorText.ErrorTitle);
            var eContainer = outerDiv.appendChild(document.createElement('div'));
            eContainer.className = 'col-md-12 error alert alert-danger';
            eContainer.appendChild(errHead[0]);
            var errText = eContainer.appendChild(document.createElement('pre'));
            var errString = err.toString();
            var to = errString.indexOf(":");
            var errName = errString.substring(0, to);
            errText.innerHTML = errString;
			var desc = errorText[errName];
			var fix = errorText[errName+'Fix'];
			if(desc){
				$(eContainer).append('<h3>' + errorText.DescriptionTitle + '</h3>');
				var errDesc = eContainer.appendChild(document.createElement('p'));
				errDesc.innerHTML = desc;
			}
			if(fix){
				$(eContainer).append('<h3>' + errorText.ToFixTitle + '</h3>');
				var errFix = eContainer.appendChild(document.createElement('p'));
				errFix.innerHTML = fix;
			}
            //var moreInfo = '../ErrorHelp/' + errName.toLowerCase() + '.html';
            console.log("Runtime Error: " + err.toString());
            $('.run-button').removeAttr('disabled');
            $('.reset-button').removeAttr('disabled');
        };

        function clearError(){
            $(outerDiv).find(".alert-success").remove();
            $(outerDiv).find(".alert-danger").remove();
        }

        reset();
    });
});

function turnLeft(robot,drawer) {
	robot.turnLeft();
	drawer.addFrame(robot.clone());
    }

    function turnRight() {
	robot.turnRight();
	drawer.addFrame(robot.clone());
    }



    function frontIsClear() {
	return robot.frontIsClear();
    }

    function ballsPresent() {
	return robot.ballsPresent();
    }

    function getBalls() {
	return robot.getBalls();
    }
    
    function hasBalls() {
	return robot.getBalls() != 0;
    }
    

    function countBalls() {
	return robot.countBalls();
    }
    

    function pickBall() {
	robot.pickBall();
	drawer.addFrame(robot.clone());
    }
    
    function putBall() {
	robot.putBall();
	drawer.addFrame(robot.clone());
    }

    function showMessage(m) {
	robot.turnMessagesOn();
	robot.show(m);
	drawer.addFrame(robot.clone());
	robot.turnMessagesOff();
    }

    function move(robot,drawer) {
        robot.move();
        drawer.addFrame(robot); 
    }


   var  toolbox = `
   <xml>
   <block type="procedures_callnoreturn" id="?0N*#E8mUZumC}Sh./?G" deletable="false" movable="false" x="10" y="10">
   <mutation connections="BOTH"/>
   <field name="NAME">napred</field>
   <field name="INLINE">AUTO</field>
   <field name="CONNECTIONS">BOTH</field>
   <value name="TOOLTIP">
   <block type="text" id="{jRA5F3e1V$Xk$%9~Wf." deletable="false" movable="false">
   <field name="TEXT">tooltip</field>
   </block>
   </value>
   <value name="HELPURL">
   <block type="text" id="I$ag3[+Kp4CxK2AbqIhg" deletable="false" movable="false">
   <field name="TEXT"/>
   </block>
   </value>
   <value name="BOTTOMTYPE">
   <shadow type="type_null" id="[u(eK/%cX+~=,0_P!RAY"/>
   </value>
   <value name="TOPTYPE">
   <shadow type="type_null" id="eHU{4U-sjeM$O+T7ASW"/>
   </value>
   <value name="COLOUR">
   <block type="colour_hue" id="WRxQPm4nkt~W.1d#YD-9">
   <mutation colour="#5b80a5"/>
   <field name="HUE">210</field>
   </block>
   </value>
   </block>
   </xml>`
