class PolymorphicDispatcher {
  constructor(config = {}) {
    this.config = config;
    this.dispatchType = config.dispatchType || 'switch';
    this.dispatchMethods = ['switch', 'indirect', 'threading', 'computed_goto'];
    this.selectedMethod = this.selectDispatcher();
  }

  selectDispatcher() {
    if (this.config.dispatchType) {
      return this.config.dispatchType;
    }
    return this.dispatchMethods[Math.floor(Math.random() * this.dispatchMethods.length)];
  }

  generateDispatcher(opcodes, handlers) {
    switch (this.selectedMethod) {
      case 'switch':
        return this.generateSwitchDispatcher(opcodes, handlers);
      case 'indirect':
        return this.generateIndirectDispatcher(opcodes, handlers);
      case 'threading':
        return this.generateThreadingDispatcher(opcodes, handlers);
      case 'computed_goto':
        return this.generateComputedGotoDispatcher(opcodes, handlers);
      default:
        return this.generateSwitchDispatcher(opcodes, handlers);
    }
  }

  generateSwitchDispatcher(opcodes, handlers) {
    const lines = [];
    lines.push('local function dispatch(op, ...) ');
    lines.push('  local args = {...}');
    lines.push('  while true do');
    lines.push('    if op == ' + opcodes.ADD + ' then');
    lines.push('      ' + handlers.ADD);
    lines.push('    elseif op == ' + opcodes.SUB + ' then');
    lines.push('      ' + handlers.SUB);
    lines.push('    else');
    lines.push('      break');
    lines.push('    end');
    lines.push('  end');
    lines.push('end');
    return lines.join('\n');
  }

  generateIndirectDispatcher(opcodes, handlers) {
    const lines = [];
    lines.push('local dispatch_table = {}');
    
    Object.entries(opcodes).forEach(([name, value]) => {
      if (handlers[name]) {
        lines.push(`dispatch_table[${value}] = function(...) ${handlers[name]} end`);
      }
    });
    
    lines.push('local function dispatch(op, ...) ');
    lines.push('  local handler = dispatch_table[op]');
    lines.push('  if handler then handler(...) end');
    lines.push('end');
    
    return lines.join('\n');
  }

  generateThreadingDispatcher(opcodes, handlers) {
    const lines = [];
    lines.push('local pc = 1');
    lines.push('local code = {...}');
    lines.push('while pc <= #code do');
    lines.push('  local instr = code[pc]');
    lines.push('  local op = instr & 0xFF');
    lines.push('  if op == ' + opcodes.ADD + ' then');
    lines.push('    ' + handlers.ADD);
    lines.push('  end');
    lines.push('  pc = pc + 1');
    lines.push('end');
    return lines.join('\n');
  }

  generateComputedGotoDispatcher(opcodes, handlers) {
    const lines = [];
    const labels = Object.keys(opcodes).map((name, i) => ({
      name,
      offset: i * 4
    }));
    
    lines.push('local dispatch = {}');
    labels.forEach(label => {
      lines.push(`dispatch[${label.offset}] = function() -- ${label.name}`);
      if (handlers[label.name]) {
        lines.push('  ' + handlers[label.name]);
      }
      lines.push('end');
    });
    
    return lines.join('\n');
  }

  getDispatcherCode() {
    return `-- Polymorphic Dispatcher (${this.selectedMethod})\n`;
  }
}

module.exports = PolymorphicDispatcher;
