class BytecodeCompiler {
  constructor(config = {}) {
    this.config = config;
    this.instructions = [];
    this.constants = [];
  }

  compile(ast, opcodes) {
    this.instructions = [];
    this.constants = [];
    this.compileBlock(ast, opcodes);
    return {
      instructions: this.instructions,
      constants: this.constants
    };
  }

  compileBlock(block, opcodes) {
    if (!block || !block.body) return;

    block.body.forEach(stmt => {
      this.compileStatement(stmt, opcodes);
    });
  }

  compileStatement(stmt, opcodes) {
    if (!stmt) return;

    if (stmt.type === 'assignment') {
      this.compileAssignment(stmt, opcodes);
    } else if (stmt.type === 'if') {
      this.compileIf(stmt, opcodes);
    } else if (stmt.type === 'while') {
      this.compileWhile(stmt, opcodes);
    } else if (stmt.type === 'call') {
      this.compileCall(stmt, opcodes);
    }
  }

  compileAssignment(stmt, opcodes) {
    // Compile assignment statement
    const valueInstr = this.compileExpression(stmt.value, opcodes);
    this.instructions.push({
      op: opcodes.SETGLOBAL || 0x10,
      target: stmt.target,
      value: valueInstr
    });
  }

  compileIf(stmt, opcodes) {
    const condInstr = this.compileExpression(stmt.condition, opcodes);
    const jumpFalse = this.instructions.length;
    this.instructions.push({
      op: opcodes.JMP || 0x18,
      cond: condInstr,
      target: -1 // Will be patched
    });

    this.compileBlock(stmt.consequent, opcodes);

    if (stmt.alternate) {
      const jumpEnd = this.instructions.length;
      this.instructions.push({ op: opcodes.JMP || 0x18, target: -1 });
      this.instructions[jumpFalse].target = this.instructions.length;
      this.compileBlock(stmt.alternate, opcodes);
      this.instructions[jumpEnd].target = this.instructions.length;
    } else {
      this.instructions[jumpFalse].target = this.instructions.length;
    }
  }

  compileWhile(stmt, opcodes) {
    const loopStart = this.instructions.length;
    const condInstr = this.compileExpression(stmt.condition, opcodes);
    const jumpFalse = this.instructions.length;
    this.instructions.push({
      op: opcodes.JMP || 0x18,
      cond: condInstr,
      target: -1
    });

    this.compileBlock(stmt.body, opcodes);

    this.instructions.push({
      op: opcodes.JMP || 0x18,
      target: loopStart
    });

    this.instructions[jumpFalse].target = this.instructions.length;
  }

  compileCall(stmt, opcodes) {
    this.instructions.push({
      op: opcodes.CALL || 0x16,
      func: stmt.callee,
      args: stmt.arguments.length
    });
  }

  compileExpression(expr, opcodes) {
    if (typeof expr === 'number') {
      const idx = this.constants.indexOf(expr);
      const constIdx = idx !== -1 ? idx : this.addConstant(expr);
      return {
        op: opcodes.LOADK || 0x01,
        const: constIdx
      };
    }
    if (typeof expr === 'string') {
      const idx = this.constants.indexOf(expr);
      const constIdx = idx !== -1 ? idx : this.addConstant(expr);
      return {
        op: opcodes.LOADK || 0x01,
        const: constIdx
      };
    }
    if (expr.type === 'binary') {
      const left = this.compileExpression(expr.left, opcodes);
      const right = this.compileExpression(expr.right, opcodes);
      const op = this.getBinaryOp(expr.operator, opcodes);
      return { op, left, right };
    }
    return { op: opcodes.LOADK || 0x01, const: 0 };
  }

  getBinaryOp(operator, opcodes) {
    const map = {
      '+': opcodes.ADD || 0x05,
      '-': opcodes.SUB || 0x06,
      '*': opcodes.MUL || 0x07,
      '/': opcodes.DIV || 0x08,
      '%': opcodes.MOD || 0x09,
      '==': opcodes.EQ || 0x19,
      '<': opcodes.LT || 0x1A,
      '..': opcodes.CONCAT || 0x0D
    };
    return map[operator] || opcodes.ADD || 0x05;
  }

  addConstant(value) {
    this.constants.push(value);
    return this.constants.length - 1;
  }
}

module.exports = BytecodeCompiler;
