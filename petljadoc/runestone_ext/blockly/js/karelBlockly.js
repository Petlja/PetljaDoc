"use strict";

$(document).ready(function () {
  var errorText = {};

  errorText.ErrorTitle = $.i18n("msg_activecode_error_title");
  errorText.DescriptionTitle = $.i18n("msg_activecode_description_title");
  errorText.ToFixTitle = $.i18n("msg_activecode_to_fix_title");
  errorText.ParseError = $.i18n("msg_activecode_parse_error");
  errorText.ParseErrorFix = $.i18n("msg_activecode_parse_error_fix");
  errorText.TypeError = $.i18n("msg_activecode_type_error");
  errorText.TypeErrorFix = $.i18n("msg_activecode_type_error_fix");
  errorText.NameError = $.i18n("msg_activecode_name_error");
  errorText.NameErrorFix = $.i18n("msg_activecode_name_error_fix");
  errorText.ValueError = $.i18n("msg_activecode_value_error");
  errorText.ValueErrorFix = $.i18n("msg_activecode_value_error_fix");
  errorText.AttributeError = $.i18n("msg_activecode_attribute_error");
  errorText.AttributeErrorFix = $.i18n("msg_activecode_attribute_error_fix");
  errorText.TokenError = $.i18n("msg_activecode_token_error");
  errorText.TokenErrorFix = $.i18n("msg_activecode_token_error_fix");
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




  $('[data-component=blocklyKarel]').each(function (index) {
    var outerDiv = $(this)[0];
    var canvas = $(this).find(".world")[0];
    var problemId = this.id;
    var configarea = $(this).find(".configArea")[0];
    var config = (new Function('return ' + configarea.value.replace('<!--x', '').replace('x-->', '')))();
    var div = document.getElementById("blocklyKarelDiv");
    var categoriesFilter = JSON.parse(div.getAttribute("data-categories"));
    for(var i= 0;i<categoriesFilter.length;i++)
      toolbox.contents.push(categories[categoriesFilter[i]]);
    var workspace = Blockly.inject(div, { toolbox:  toolbox});

    var setup = config.setup();
    var robot = setup.robot;
    var world = setup.world;
    robot.setWorld(world)
    var drawer = new RobotDrawer(canvas, 0);
    drawer.drawFrame(robot);


    function initApi(interpreter, globalObject) {
      var wrapper = function (text) {
        return alert(arguments.length ? text : '');
      };
      interpreter.setProperty(globalObject, 'alert', interpreter.createNativeFunction(wrapper));
      wrapper = function(text) {
        return prompt(text);
      };
      interpreter.setProperty(globalObject, 'prompt', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        robot.move();
        drawer.drawFrame(robot.clone());
      };
      interpreter.setProperty(globalObject, 'move_forward', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        robot.turnLeft();
        drawer.drawFrame(robot.clone());
      };
      interpreter.setProperty(globalObject, 'turn_left', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        robot.turnRight();
        drawer.drawFrame(robot.clone());
      };
      interpreter.setProperty(globalObject, 'turn_right', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        robot.pickBall();
        drawer.drawFrame(robot.clone());
      };
      interpreter.setProperty(globalObject, 'pick_up', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        robot.putBall();
        drawer.addFrame(robot.clone());
      };
      interpreter.setProperty(globalObject, 'drop_off', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        return robot.frontIsClear()
      };
      interpreter.setProperty(globalObject, 'can_move', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        return robot.ballsPresent()
      };
      interpreter.setProperty(globalObject, 'balls_present', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        return robot.getBalls() != 0;
      };
      interpreter.setProperty(globalObject, 'has_ball', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        return robot.countBalls();
      };
      interpreter.setProperty(globalObject, 'count_balls', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        return robot.getBalls();
      };
      interpreter.setProperty(globalObject, 'count_balls_on_hand', interpreter.createNativeFunction(wrapper));
      wrapper = function (id) {
        workspace.highlightBlock(id);
      };
      interpreter.setProperty(globalObject, 'highlightBlock', interpreter.createNativeFunction(wrapper));
      wrapper = function (value) {
      return JSON.stringify([...Array(value).keys()]);    
      };
      interpreter.setProperty(globalObject, 'range', interpreter.createNativeFunction(wrapper));
    }

    $(this).find(".run-button").click(function () {
      $('.run-button').attr('disabled', 'disabled');
      clearError();
      setup = config.setup();
      robot = setup.robot;
      world = setup.world;
      robot.setWorld(world)
      drawer = new RobotDrawer(canvas, 0);
      drawer.drawFrame(robot);
      var code = Blockly.JavaScript.workspaceToCode(workspace);
      console.log(code)
      var myInterpreter = new Interpreter(code, initApi);
      drawer.start()
      function nextStep() {
        try {
          if (myInterpreter.step()) {
            setTimeout(nextStep, 65);
          }
          else {
            $('.run-button').removeAttr('disabled', 'disabled');
            var result = config.isSuccess(robot, world);
            if (result) {
              showEndMessageSuccess();
            } else {
              showEndMessageError($.i18n("msg_karel_incorrect"));
            }
          }
        }
        catch (err) {
          $('.run-button').removeAttr('disabled', 'disabled');
          drawer.stop(function () {
            var message = "";
            var otherError = false;
            if ((err == "crashed") || (err == "no_ball") || (err == "out_of_bounds") || (err == "no_balls_with_robot"))
              message = $.i18n("msg_karel_" + err);
            else {
              showError(err);
              otherError = true;
            }
            if (!otherError)
              showEndMessageError(message);

          });
        }
      }
      nextStep();
    });

    $(this).find(".reset-button").click(function () {
      clearError();
      reset();
    });

    $(this).find(".blockly-button").click(function () {
      var code = editor.getValue().replace(/\?\?\?\s+/g, "___ ")
        .replace(/\?\?\?/g, "___");
      var bpm = new BlocklPyModal();
      bpm.open(Blockly.Msg.Title[$.i18n().locale], 700, 500, code, eBookConfig.staticDir + 'blockly/',
        function (src) {
          if (src) {
            editor.setValue("from karel import * \n" + src.replace(/\_\_\_/g, "???"));
          }
        });
    });


    function reset() {
      var setup = config.setup();
      var robot = setup.robot;
      var world = setup.world;
      robot.setWorld(world)
      var drawer = new RobotDrawer(canvas, 0);
      drawer.drawFrame(robot);
    }

    function showEndMessageSuccess() {
      var eContainer = outerDiv.appendChild(document.createElement('div'));
      eContainer.className = 'col-md-12 alert alert-success mt-2';
      eContainer.id = problemId + "-success";
      var msgHead = $('<p>').html($.i18n("msg_karel_correct"));
      eContainer.appendChild(msgHead[0]);
      $('.run-button').removeAttr('disabled')
      $('.reset-button').removeAttr('disabled');;
    }

    function showEndMessageError(message) {
      var eContainer = outerDiv.appendChild(document.createElement('div'));
      eContainer.className = 'col-md-12 alert alert-danger mt-2';
      eContainer.id = problemId + "-error";
      var msgHead = $('<p>').html(message);
      eContainer.appendChild(msgHead[0]);
      $('.run-button').removeAttr('disabled');
      $('.reset-button').removeAttr('disabled');
    }

    function showError(err) {
      //logRunEvent({'div_id': this.divid, 'code': this.prog, 'errinfo': err.toString()}); // Log the run event
      var errHead = $('<h3>').html(errorText.ErrorTitle);
      var eContainer = outerDiv.appendChild(document.createElement('div'));
      eContainer.className = 'col-md-12 error alert alert-danger mt-2';
      eContainer.appendChild(errHead[0]);
      var errText = eContainer.appendChild(document.createElement('pre'));
      var errString = err.toString();
      var to = errString.indexOf(":");
      var errName = errString.substring(0, to);
      errText.innerHTML = errString;
      var desc = errorText[errName];
      var fix = errorText[errName + 'Fix'];
      if (desc) {
        $(eContainer).append('<h3>' + errorText.DescriptionTitle + '</h3>');
        var errDesc = eContainer.appendChild(document.createElement('p'));
        errDesc.innerHTML = desc;
      }
      if (fix) {
        $(eContainer).append('<h3>' + errorText.ToFixTitle + '</h3>');
        var errFix = eContainer.appendChild(document.createElement('p'));
        errFix.innerHTML = fix;
      }
      //var moreInfo = '../ErrorHelp/' + errName.toLowerCase() + '.html';
      console.log("Runtime Error: " + err.toString());
      $('.run-button').removeAttr('disabled');
      $('.reset-button').removeAttr('disabled');
    };

    function clearError() {
      $(outerDiv).find(".alert-success").remove();
      $(outerDiv).find(".alert-danger").remove();
    }

    reset();
  });
});

var categories = {
  'KarelCommands' : {
    "kind": "category",
    "name": "Наредбе роботу",
    "colour": 295,
    "contents": [
      {
        "kind": "block",
        "type": "move",
      },
      {
        "kind": "block",
        "type": "turn_left"
      },
      {
        "kind": "block",
        "type": "turn_right"
      },
      {
        "kind": "block",
        "type": "pick_up"
      },
      {
        "kind": "block",
        "type": "drop_off"
      },
    ]
  },
  'KarelBrain' :{
    "kind": "category",
    "name": "Питај робота",
    "colour": 275,
    "contents": [
      {
        "kind": "block",
        "type": "balls_present",
      },
      {
        "kind": "block",
        "type": "can_move",
      },
      {
        "kind": "block",
        "type": "has_balls",
      },
      {
        "kind": "block",
        "type": "count_balls_on_hand",
      },
      {
        "kind": "block",
        "type": "count_balls",
      },
    ]
  },
  'Values':{
    "kind": "category",
    "name": "Вредности",
    "colour": 110,
    "contents": [    
      {
        "kind": "block",
        "type": "math_number",
      },   
    ]
  },
  'Brenching':    {
    "kind": "category",
    "name": "Гранање",
    "colour": 130,
    "contents": [
      {
        "kind": "block",
        "type": "controls_if",
      },
      {
        "kind": "block",
        "type": "controls_ifelse",
      },
    ]
  },
  'KarelBreacnhing':    {
    "kind": "category",
    "name": "Гранање карел",
    "colour": 150,
    "contents": [
      {
        "kind": "block",
        "type": "controls_if_simple",
      },
      {
        "kind": "block",
        "type": "controls_ifelse_simple",
      },
    ]
  },
  'Loops': {
    "kind" : "category",
    "name" : "Петље",
    "colour": 190,
    "contents":[
      {
        "kind" : "block",
        "type" : "controls_repeat"
      },
      {
        "kind" : "block",
        "type" : "controls_whileUntil"
      }
    ]
  },
  'KarelLoops':    {
    "kind" : "category",
    "name" : "Петље карел",
    "colour": 210,
    "contents":[
      {
        "kind" : "block",
        "type" : "karel_controls_whileUntil"
      },
    ]
  },
  'Logic': {
    "kind": "category",
    "name": "Логички оператори",
    "colour": 240,
    "contents": [
      {
        "kind": "block",
        "type": "logic_compare",
      },
      {
        "kind": "block",
        "type": "logic_operation",
      },
      {
        "kind": "block",
        "type": "logic_negate",
      },
    ]
  },
}
var toolbox = {
  "kind": "categoryToolbox",
  "contents": []
}



Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
Blockly.JavaScript.addReservedWords('highlightBlock');
