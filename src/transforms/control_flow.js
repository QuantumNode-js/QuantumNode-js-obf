class ControlFlowFlattener {
  constructor(config = {}) {
    this.config = config;
    this.stateCounter = 0;
    this.dispatchTable = [];
  }

  flattenControlFlow(ast) {
    const flattened = {
      type: 'block',
      body: [],
      stateVar: this.generateStateName(),
      states: [],
      dispatch: []
    };

    let currentState = 0;
    const stateMap = new Map();

    for (const statement of ast.body) {
      this.flattenStatement(statement, flattened, stateMap, currentState);
      currentState++;
    }

    return this.generateFlatCode(flattened);
  }

  flattenStatement(stmt, flattened, stateMap, currentState) {
    if (stmt.type === 'if') {
      return this.flattenIfStatement(stmt, flattened, stateMap, currentState);
    }
    if (stmt.type === 'while') {
      return this.flattenWhileStatement(stmt, flattened, stateMap, currentState);
    }
    if (stmt.type === 'for') {
      return this.flattenForStatement(stmt, flattened, stateMap, currentState);
    }
    return stmt;
  }

  flattenIfStatement(stmt, flattened, stateMap, currentState) {
    const thenState = this.stateCounter++;
    const elseState = this.stateCounter++;
    const endState = this.stateCounter++;

    const condition = stmt.condition;
    const thenBlock = stmt.consequent;
    const elseBlock = stmt.alternate;

    flattened.states.push({
      state: currentState,
      code: `if ${this.conditionToString(condition)} then state = ${thenState} else state = ${elseState} end`
    });

    thenBlock.body.forEach(s => {
      flattened.states.push({
        state: thenState,
        code: this.statementToString(s)
      });
    });

    if (elseBlock) {
      elseBlock.body.forEach(s => {
        flattened.states.push({
          state: elseState,
          code: this.statementToString(s)
        });
      });
    }

    flattened.states.push({
      state: endState,
      code: '-- end if'
    });

    return { type: 'flattened', states: [thenState, elseState, endState] };
  }

  flattenWhileStatement(stmt, flattened, stateMap, currentState) {
    const loopState = this.stateCounter++;
    const bodyState = this.stateCounter++;
    const endState = this.stateCounter++;

    flattened.states.push({
      state: loopState,
      code: `if ${this.conditionToString(stmt.condition)} then state = ${bodyState} else state = ${endState} end`
    });

    stmt.body.forEach(s => {
      flattened.states.push({
        state: bodyState,
        code: this.statementToString(s)
      });
    });

    flattened.states.push({
      state: bodyState + 1,
      code: `state = ${loopState}`
    });

    return { type: 'flattened', states: [loopState, bodyState, endState] };
  }

  flattenForStatement(stmt, flattened, stateMap, currentState) {
    // Simplified for loop flattening
    return stmt;
  }

  conditionToString(condition) {
    if (typeof condition === 'string') return condition;
    if (condition.type === 'binary') {
      return `${this.exprToString(condition.left)} ${condition.operator} ${this.exprToString(condition.right)}`;
    }
    return 'true';
  }

  exprToString(expr) {
    if (typeof expr === 'string' || typeof expr === 'number') return String(expr);
    if (expr.type === 'identifier') return expr.name;
    if (expr.type === 'binary') {
      return `(${this.exprToString(expr.left)} ${expr.operator} ${this.exprToString(expr.right)})`;
    }
    return 'nil';
  }

  statementToString(stmt) {
    if (stmt.type === 'assignment') {
      return `${stmt.left} = ${this.exprToString(stmt.right)}`;
    }
    if (stmt.type === 'call') {
      return `${stmt.callee}(...)`;
    }
    return '';
  }

  generateFlatCode(flattened) {
    const lines = [];
    lines.push(`local ${flattened.stateVar} = 1`);
    lines.push('while true do');
    flattened.states.forEach(state => {
      lines.push(`  if ${flattened.stateVar} == ${state.state} then`);
      lines.push(`    ${state.code}`);
      lines.push('  end');
    });
    lines.push('end');
    return lines.join('\n');
  }

  generateStateName() {
    const names = ['_s', '_st', '_state', '__s', '__state', 'state_var'];
    return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 10000);
  }
}

module.exports = ControlFlowFlattener;
