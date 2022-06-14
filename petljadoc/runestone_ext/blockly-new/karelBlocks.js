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
  
  
  Blockly.Blocks['range_list1'] = {
    init: function() {
      this.appendValueInput('LIMIT')
          .setCheck('Number')
          .appendField("lista od ")
      this.appendDummyInput()
          .appendField(" brojeva");
      this.setInputsInline(true);
      this.setOutput(true, 'Array');
      this.setColour(30);
      var thisBlock = this;
      this.setTooltip(function() {
        return "lista od %1 uzastopnih brojeva počevši od broja 0.".replace('%1',
            Blockly.JavaScript.valueToCode(thisBlock, 'LIMIT', Blockly.JavaScript.ORDER_RELATIONAL) || 0);
      });
      this.setHelpUrl('');
    }
  };
  
  Blockly.JavaScript['range_list1'] = function(block) {
    var value = Blockly.JavaScript.valueToCode(block, 'LIMIT',
        Blockly.JavaScript.ORDER_NONE) || 0;
    var code = 'JSON.parse(range('+value+'))';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };
