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




  $('[data-component=karel]').each(function (index) {
    var outerDiv = $(this)[0];
    var canvas = $(this).find(".world")[0];
    var problemId = this.id;
    var configarea = $(this).find(".configArea")[0];
    var config = (new Function('return ' + configarea.value.replace('<!--x', '').replace('x-->', '')))();
    var div = document.getElementById("blocklyDiv")
    var workspace = Blockly.inject(div, { toolbox: toolbox });

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
      wrapper = function () {
        robot.move();
        drawer.drawFrame(robot.clone());
      };
      interpreter.setProperty(globalObject, 'napred', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        robot.turnLeft();
        drawer.drawFrame(robot.clone());
      };
      interpreter.setProperty(globalObject, 'levo', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        robot.turnRight();
        drawer.drawFrame(robot.clone());
      };
      interpreter.setProperty(globalObject, 'desno', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        robot.pickBall();
        drawer.drawFrame(robot.clone());
      };
      interpreter.setProperty(globalObject, 'pokupi', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        robot.putBall();
        drawer.addFrame(robot.clone());
      };
      interpreter.setProperty(globalObject, 'ostavi', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        return robot.frontIsClear()
      };
      interpreter.setProperty(globalObject, 'moze_napred', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        return robot.ballsPresent()
      };
      interpreter.setProperty(globalObject, 'ima_loptica', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        return robot.getBalls() != 0;
      };
      interpreter.setProperty(globalObject, 'ima_lopticu_kod_sebe', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        return robot.countBalls();
      };
      interpreter.setProperty(globalObject, 'koliko_loptica_na_polju', interpreter.createNativeFunction(wrapper));
      wrapper = function () {
        return robot.getBalls();
      };
      interpreter.setProperty(globalObject, 'koliko_loptica_kod_sebe', interpreter.createNativeFunction(wrapper));
      wrapper = function (id) {
        workspace.highlightBlock(id);
      };
      interpreter.setProperty(globalObject, 'highlightBlock', interpreter.createNativeFunction(wrapper));
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
      var myInterpreter = new Interpreter(code, initApi);
      drawer.start()
      function nextStep() {
        try {
          if (myInterpreter.step()) {
            setTimeout(nextStep, 75);
          }
          else {
            var result = config.isSuccess(robot, world);
            if (result) {
              showEndMessageSuccess();
            } else {
              showEndMessageError($.i18n("msg_karel_incorrect"));
            }
          }
        }
        catch (err) {
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
      setTimeout(() => { $('.run-button').removeAttr('disabled', 'disabled'); }, drawer.frames.length * drawer.sleep);
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


var toolbox = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "Karel",
      "colour": 150,
      "contents": [
        {
          "kind": "block",
          "type": "maze_moveForward"
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
        {
          "kind": "block",
          "type": "can_move"
        },
        {
          "kind": "block",
          "type": "balls_present",
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
    {
      "kind": "category",
      "name": "Variables",
      "colour": 50,
      "custom": "VARIABLE"
    },
    {
      "kind": "category",
      "name": "Logic",
      "colour": 150,
      "contents": [
        {
          "kind": "block",
          "type": "controls_if",
        },
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
  ]
};


Blockly.Blocks['maze_moveForward'] = {
  /**
   * Block for moving forward.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      "message0": 'napred',
      "previousStatement": null,
      "nextStatement": null,
      "colour": 250,
      "tooltip": 'napred'
    });
  }
};

Blockly.JavaScript['maze_moveForward'] = function (block) {
  // Generate JavaScript for moving forward.
  return 'napred()\n';
};

Blockly.Blocks['turn_left'] = {
  /**
   * Block for moving forward.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      "message0": 'levo',
      "previousStatement": null,
      "nextStatement": null,
      "colour": 250,
      "tooltip": 'levo'
    });
  }
};

Blockly.JavaScript['turn_left'] = function (block) {
  // Generate JavaScript for moving forward.
  return 'levo()\n';
};
Blockly.Blocks['turn_right'] = {
  /**
   * Block for moving forward.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      "message0": 'desno',
      "previousStatement": null,
      "nextStatement": null,
      "colour": 250,
      "tooltip": 'desno'
    });
  }
};

Blockly.JavaScript['turn_right'] = function (block) {
  // Generate JavaScript for moving forward.
  return 'desno()\n';
};

Blockly.Blocks['pick_up'] = {
  /**
   * Block for moving forward.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      "message0": 'pokupi',
      "previousStatement": null,
      "nextStatement": null,
      "colour": 250,
      "tooltip": 'pokupi'
    });
  }
};

Blockly.JavaScript['pick_up'] = function (block) {
  // Generate JavaScript for moving forward.
  return 'pokupi()\n';
};


Blockly.Blocks['drop_off'] = {
  /**
   * Block for moving forward.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      "message0": 'ostavi',
      "previousStatement": null,
      "nextStatement": null,
      "colour": 250,
      "tooltip": 'ostavi'
    });
  }
};

Blockly.JavaScript['drop_off'] = function (block) {
  // Generate JavaScript for moving forward.
  return 'ostavi()\n';
};

Blockly.Blocks['can_move'] = {
  /**
   * Block for moving forward.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      "message0": 'moze_napred',
      "output": "Boolean",
      "colour": 250,
      "tooltip": 'moze_napred'
    });
  }
};

Blockly.JavaScript['can_move'] = function (block) {
  // Generate JavaScript for moving forward.
  return ['moze_napred()\n', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.Blocks['balls_present'] = {
  /**
   * Block for moving forward.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      "message0": 'ima_loptica',
      "output": "Boolean",
      "colour": 250,
      "tooltip": 'ima_loptica'
    });
  }
};

Blockly.JavaScript['balls_present'] = function (block) {
  // Generate JavaScript for moving forward.
  return ['ima_loptica()\n', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.Blocks['has_balls'] = {
  /**
   * Block for moving forward.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      "message0": 'ima_lopticu_kod_sebe',
      "output": "Boolean",
      "colour": 250,
      "tooltip": 'ima_lopticu_kod_sebe'
    });
  }
};

Blockly.JavaScript['has_balls'] = function (block) {
  // Generate JavaScript for moving forward.
  return ['ima_lopticu_kod_sebe()\n', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['count_balls'] = {
  /**
   * Block for moving forward.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      "message0": 'koliko_loptica_na_polju',
      "output": "Number",
      "colour": 250,
      "tooltip": 'koliko_loptica_na_polju'
    });
  }
};

Blockly.JavaScript['count_balls'] = function (block) {
  // Generate JavaScript for moving forward.
  return ['koliko_loptica_na_polju()\n', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['count_balls_on_hand'] = {
  /**
   * Block for moving forward.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      "message0": 'koliko_loptica_kod_sebe',
      "output": "Number",
      "colour": 250,
      "tooltip": 'koliko_loptica_kod_sebe'
    });
  }
};

Blockly.JavaScript['count_balls_on_hand'] = function (block) {
  // Generate JavaScript for moving forward.
  return ['koliko_loptica_kod_sebe()\n', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
Blockly.JavaScript.addReservedWords('highlightBlock');

