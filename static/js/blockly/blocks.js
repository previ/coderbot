/**
  * Copyright (C) 2014 Roberto Previtera
  *
  * This program is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License.
  *
  * This program is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */

'use strict';

// Extensions to Blockly's language and JavaScript generator.

Blockly.Blocks['coderbot_moveForward'] = {
  // Block for moving forward.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendField('moveForward');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('CoderBot_moveForwardTooltip');
  }
};

Blockly.JavaScript['coderbot_moveForward'] = function(block) {
  // Generate JavaScript for moving forward.
  return 'bot.forward(elapse=0.25);\n';
};

Blockly.Python['coderbot_moveForward'] = function(block) {
  // Generate Python for moving forward.
  return 'bot.forward(elapse=0.25)\n';
};

Blockly.Blocks['coderbot_moveBackward'] = {
  // Block for moving forward.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendField('moveBackward');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('CoderBot_moveBackwardTooltip');
  }
};

Blockly.JavaScript['coderbot_moveBackward'] = function(block) {
  // Generate JavaScript for moving forward.
  return 'bot.backward(elapse=0.25);\n';
};

Blockly.Python['coderbot_moveBackward'] = function(block) {
  // Generate Python for moving forward.
  return 'bot.backward(elapse=0.25)\n';
};

Blockly.Blocks['coderbot_turnLeft'] = {
  // Block for turning left.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(290);
    this.appendDummyInput()
        .appendField("turnLeft");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_turnTooltip'));
  }
};

Blockly.JavaScript['coderbot_turnLeft'] = function(block) {
  // Generate JavaScript for turning left.
  return 'bot.left(elapse=0.15);\n';
};

Blockly.Python['coderbot_turnLeft'] = function(block) {
  // Generate Python for turning left.
  return 'bot.left(elapse=0.15)\n';
};

Blockly.Blocks['coderbot_turnRight'] = {
  // Block for turning right.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(290);
    this.appendDummyInput()
        .appendField("turnRight");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_turnTooltip'));
  }
};

Blockly.JavaScript['coderbot_turnRight'] = function(block) {
  // Generate JavaScript for turning left or right.
  return 'bot.right(elapse=0.15);\n';
};

Blockly.Python['coderbot_turnRight'] = function(block) {
  // Generate Python for turning left or right.
  return 'bot.right(elapse=0.15)\n';
};

Blockly.Blocks['coderbot_say'] = {
  // Block for text to speech.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Say');
    this.setColour(290);
    this.appendValueInput('TEXT')
        .setCheck(["String", "Number", "Date"])
        .appendField('say');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_sayTooltip'));
  }
};

Blockly.JavaScript['coderbot_say'] = function(block) {
  // Generate JavaScript for turning left or right.
  var text = Blockly.JavaScript.valueToCode(block, 'TEXT',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'bot.say(' + text + ');\n';
};

Blockly.Python['coderbot_say'] = function(block) {
  // Generate Python for turning left or right.
  var text = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_NONE) || '\'\'';
  return 'bot.say(' + text + ')\n';
};

Blockly.Blocks['coderbot_sleep'] = {
  // Block for text to sleep.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Sleep');
    this.setColour(290);
    this.appendValueInput('ELAPSE')
        .setCheck(["Number"])
        .appendField('sleep');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_sleepTooltip'));
  }
};

Blockly.JavaScript['coderbot_sleep'] = function(block) {
  // Generate JavaScript for sleeping.
  var elapse = Blockly.JavaScript.valueToCode(block, 'ELAPSE',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'cam.sleep(' + elapse + ');\n';
};

Blockly.Python['coderbot_sleep'] = function(block) {
  // Generate Python for sleeping.
  var elapse = Blockly.Python.valueToCode(block, 'ELAPSE',
      Blockly.Python.ORDER_NONE) || '\'\'';
  return 'cam.sleep(' + elapse + ')\n';
};

Blockly.Blocks['coderbot_adv_move'] = {
  // Block for moving forward.
  init: function() {
    var ACTIONS =
        [['forward', 'FORWARD'],
        ['backward', 'BACKWARD'],
        ['left', 'LEFT'],
        ['right', 'RIGHT']]
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.interpolateMsg("move bot ",
                        ['TEXT', null, Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    
    this.appendDummyInput("ACTION")
       .appendField(new Blockly.FieldDropdown(ACTIONS), 'ACTION');
    this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField("at speed");
    this.appendValueInput('ELAPSE')
        .setCheck('Number')
        .appendField("for");
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('ACTION');
      var TOOLTIPS = {
        FORWARD: "Move forward",
        BACKWARD: "Move backward",
        LEFT: "Turn left",
        RIGHT: "Turn right",
      };
      return TOOLTIPS[mode] + " at speed (0-100%) for time (seconds)";
    });
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['coderbot_adv_move'] = function(block) {
  // Generate JavaScript for moving forward.
  return 'bot.forward();\n';
};

Blockly.Python['coderbot_adv_move'] = function(block) {
  // Generate Python for moving forward.
  var OPERATORS = {
    FORWARD: ['forward'],
    BACKWARD: ['backward'],
    LEFT: ['left'],
    RIGHT: ['right']
  };
  var tuple = OPERATORS[block.getFieldValue('ACTION')];
  var action = tuple[0];
  var speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_NONE);
  var elapse = Blockly.Python.valueToCode(block, 'ELAPSE', Blockly.Python.ORDER_NONE);
  var code = "bot." + action + "(speed=" + speed + ", elapse="+elapse+")\n";
  return code;
};

Blockly.Blocks['coderbot_adv_stop'] = {
  // Block to stop the bot.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Stop');
    this.setColour(290);
    this.appendDummyInput()
        .appendField("stop");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(('CoderBot_stopTooltip'));
  }
};

Blockly.JavaScript['coderbot_adv_stop'] = function(block) {
  // Generate JavaScript to stop the bot.
  return 'bot.stop();\n';
};

Blockly.Python['coderbot_adv_stop'] = function(block) {
  // Generate Python to stop the bot.
  return 'bot.stop()\n';
};


Blockly.Blocks['coderbot_adv_pathAhead'] = {
  /**
   * Block for pathAhead function.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(290);
    this.appendDummyInput()
        .appendField('pathAhead');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  }
};

Blockly.JavaScript['coderbot_adv_pathAhead'] = function(block) {
  // Boolean values true and false.
  var code = 'cam.path_ahead()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['coderbot_adv_pathAhead'] = function(block) {
  // Boolean values true and false.
  var code = 'cam.path_ahead()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['coderbot_adv_findLine'] = {
  /**
   * Block for pathAhead function.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(290);
    this.appendDummyInput()
        .appendField('findLine');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  }
};

Blockly.JavaScript['coderbot_adv_findLine'] = function(block) {
  // Boolean values true and false.
  var code = 'cam.find_line()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['coderbot_adv_findLine'] = function(block) {
  // Boolean values true and false.
  var code = 'cam.find_line()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['coderbot_adv_findSignal'] = {
  /**
   * Block for findSignal function.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(290);
    this.appendDummyInput()
        .appendField('findSignal');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  }
};

Blockly.JavaScript['coderbot_adv_findSignal'] = function(block) {
  // Boolean values true and false.
  var code = 'cam.find_signal()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['coderbot_adv_findSignal'] = function(block) {
  // Boolean values true and false.
  var code = 'cam.find_signal()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['coderbot_adv_findFace'] = {
  /**
   * Block for findFace function.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(290);
    this.appendDummyInput()
        .appendField('findFace');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  }
};

Blockly.JavaScript['coderbot_adv_findFace'] = function(block) {
  // Boolean values true and false.
  var code = 'cam.find_face()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['coderbot_adv_findFace'] = function(block) {
  // Boolean values true and false.
  var code = 'cam.find_face()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['coderbot_adv_findCode'] = {
  /**
   * Block for findSignal function.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(290);
    this.appendDummyInput()
        .appendField('findCode');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  }
};

Blockly.JavaScript['coderbot_adv_findCode'] = function(block) {
  // Boolean values true and false.
  var code = 'cam.find_code()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['coderbot_adv_findCode'] = function(block) {
  // Boolean values true and false.
  var code = 'cam.find_code()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};
