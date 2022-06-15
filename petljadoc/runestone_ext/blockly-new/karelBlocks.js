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
    return ['balls_present()\n', Blockly.JavaScript.ORDER_FUNCTION_CALL];
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
        "tooltip": 'Da li robot ima lopticu kod sebe'
      });
    }
  };
  
  Blockly.JavaScript['has_balls'] = function (block) {
    // Generate JavaScript for moving forward.
    return ['has_ball()\n', Blockly.JavaScript.ORDER_FUNCTION_CALL];
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
  
  Blockly.Blocks['controls_whileUntil_has_ball'] = {
    init: function () {
      this.jsonInit(   {
        'type': 'controls_whileUntil',
        'message0': '%1 %2',
        'args0': [
          {
            'type': 'field_dropdown',
            'name': 'MODE',
            'options': [
              ['%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_WHILE}', 'WHILE'],
              ['%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_UNTIL}', 'UNTIL'],
            ],
          },
          {
            'type': 'field_dropdown',
            'name': 'KAREL_BOOL',
            'options': [
              ['има лопту', 'has_ball()'],
              ['постоји лопта на пољу', 'balls_present()'],
              ['може напред', 'moze_napred()'],
            ],
          },
        ],
        'message1': '%{BKY_CONTROLS_REPEAT_INPUT_DO} %1',
        'args1': [{
          'type': 'input_statement',
          'name': 'DO',
        }],
        'previousStatement': null,
        'nextStatement': null,
        'style': 'loop_blocks',
        'helpUrl': '%{BKY_CONTROLS_WHILEUNTIL_HELPURL}',
        'extensions': ['controls_whileUntil_tooltip'],
      },)
  }
}

Blockly.JavaScript['controls_whileUntil_has_ball'] = function (block) {
  // Do while/until loop.
  const until = block.getFieldValue('MODE') === 'UNTIL';
  let argument0 = block.getFieldValue('KAREL_BOOL')
  let branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};