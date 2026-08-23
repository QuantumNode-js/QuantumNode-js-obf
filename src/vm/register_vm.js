class RegisterVM {
  constructor(config = {}) {
    this.config = config;
    this.registers = new Array(256).fill(null);
    this.bytecode = [];
    this.constants = [];
    this.pc = 0;
    this.callStack = [];
    this.instructionCount = 0;
  }

  emit(opcode, a, b = 0, c = 0) {
    const instr = {
      op: opcode,
      a: a,
      b: b,
      c: c,
      encoded: this.encodeInstruction(opcode, a, b, c)
    };
    this.bytecode.push(instr);
    this.instructionCount++;
    return this.bytecode.length - 1;
  }

  encodeInstruction(opcode, a, b, c) {
    let encoded = (opcode & 0x3F);
    encoded |= ((a & 0xFF) << 6);
    encoded |= ((b & 0x1FF) << 14);
    encoded |= ((c & 0x1FF) << 23);
    return encoded;
  }

  getRegister(r) {
    return this.registers[r] || null;
  }

  setRegister(r, value) {
    this.registers[r] = value;
  }

  getConstant(k) {
    return this.constants[k];
  }

  addConstant(value) {
    const index = this.constants.indexOf(value);
    if (index !== -1) return index;
    this.constants.push(value);
    return this.constants.length - 1;
  }

  compileExpression(expr) {
    if (typeof expr === 'number') {
      const reg = this.allocRegister();
      this.emit('LOADK', reg, this.addConstant(expr));
      return reg;
    }
    if (typeof expr === 'string') {
      const reg = this.allocRegister();
      this.emit('LOADK', reg, this.addConstant(expr));
      return reg;
    }
    if (expr.type === 'binary') {
      const leftReg = this.compileExpression(expr.left);
      const rightReg = this.compileExpression(expr.right);
      const resultReg = this.allocRegister();
      const opcode = this.getBinaryOpcode(expr.operator);
      this.emit(opcode, resultReg, leftReg, rightReg);
      return resultReg;
    }
    return null;
  }

  getBinaryOpcode(operator) {
    const map = {
      '+': 'ADD',
      '-': 'SUB',
      '*': 'MUL',
      '/': 'DIV',
      '%': 'MOD',
      '^': 'POW',
      '..': 'CONCAT'
    };
    return map[operator] || 'ADD';
  }

  allocRegister() {
    for (let i = 0; i < 256; i++) {
      if (this.registers[i] === null) return i;
    }
    throw new Error('Out of registers');
  }

  freeRegister(r) {
    this.registers[r] = null;
  }

  execute(bytecode, constants) {
    this.bytecode = bytecode;
    this.constants = constants;
    this.registers = new Array(256).fill(null);
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
    // Simplified execution
    return null;
  }

  serialize() {
    return {
      bytecode: this.bytecode.map(i => i.encoded),
      constants: this.constants,
      registerCount: 256,
      instructionCount: this.instructionCount
    };
  }
}

module.exports = RegisterVM;
