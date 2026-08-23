class StackVM {
  constructor(config = {}) {
    this.config = config;
    this.bytecode = [];
    this.constants = [];
    this.stack = [];
    this.frames = [];
    this.pc = 0;
    this.env = {};
    this.instructionCount = 0;
  }

  push(value) {
    this.stack.push(value);
  }

  pop() {
    return this.stack.pop();
  }

  emit(opcode, ...args) {
    const instr = {
      op: opcode,
      args: args,
      encoded: this.encodeInstruction(opcode, args)
    };
    this.bytecode.push(instr);
    this.instructionCount++;
    return this.bytecode.length - 1;
  }

  encodeInstruction(opcode, args) {
    let encoded = opcode & 0xFF;
    if (args.length > 0) encoded |= (args[0] & 0xFF) << 8;
    if (args.length > 1) encoded |= (args[1] & 0xFFFF) << 16;
    return encoded;
  }

  compileExpression(expr, opcodes) {
    if (typeof expr === 'number') {
      return this.emit(opcodes.LOADK, this.addConstant(expr));
    }
    if (typeof expr === 'string') {
      return this.emit(opcodes.LOADK, this.addConstant(expr));
    }
    if (expr.type === 'binary') {
      const left = this.compileExpression(expr.left, opcodes);
      const right = this.compileExpression(expr.right, opcodes);
      const op = this.getBinaryOpcode(expr.operator, opcodes);
      return this.emit(op, left, right);
    }
    if (expr.type === 'call') {
      return this.emit(opcodes.CALL, expr.func, expr.args.length);
    }
    return null;
  }

  getBinaryOpcode(operator, opcodes) {
    const map = {
      '+': opcodes.ADD,
      '-': opcodes.SUB,
      '*': opcodes.MUL,
      '/': opcodes.DIV,
      '%': opcodes.MOD,
      '==': opcodes.EQ,
      '<': opcodes.LT,
      '>': opcodes.GT,
      '..': opcodes.CONCAT
    };
    return map[operator] || opcodes.ADD;
  }

  addConstant(value) {
    const index = this.constants.indexOf(value);
    if (index !== -1) return index;
    this.constants.push(value);
    return this.constants.length - 1;
  }

  execute(bytecode, constants, env) {
    this.bytecode = bytecode;
    this.constants = constants;
    this.env = env || {};
    this.stack = [];
    this.pc = 0;
    const results = [];

    while (this.pc < bytecode.length) {
      const instr = bytecode[this.pc++];
      const result = this.executeInstruction(instr);
      if (result !== undefined) results.push(result);
    }

    return results;
  }

  executeInstruction(instr) {
    // Simplified execution - actual implementation depends on opcodes
    return null;
  }

  serialize() {
    return {
      bytecode: this.bytecode.map(i => i.encoded),
      constants: this.constants,
      instructionCount: this.instructionCount
    };
  }
}

module.exports = StackVM;
