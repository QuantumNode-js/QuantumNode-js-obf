class NumberObfuscator {
  constructor(config = {}) {
    this.config = config;
    this.obfuscationMethod = config.method || 'arithmetic';
  }

  obfuscateNumber(num) {
    if (this.obfuscationMethod === 'arithmetic') {
      return this.obfuscateArithmetic(num);
    }
    if (this.obfuscationMethod === 'bitwise') {
      return this.obfuscateBitwise(num);
    }
    if (this.obfuscationMethod === 'factorial') {
      return this.obfuscateFactorial(num);
    }
    return `(${num})`;
  }

  obfuscateArithmetic(num) {
    const parts = [];
    let remaining = num;

    // Split into multiple terms
    for (let i = 0; i < 3; i++) {
      const part = Math.floor(remaining / 3);
      parts.push(part);
      remaining -= part;
    }
    parts.push(remaining);

    const expr = parts.map((p, i) => {
      if (i === 0) return `${p}`;
      if (i % 2 === 0) return `+${p}`;
      return `-${p}`;
    }).join('');

    return `(${expr})`;
  }

  obfuscateBitwise(num) {
    const xor = Math.floor(Math.random() * 0xFFFFFFFF);
    const obfuscated = num ^ xor;
    return `(${obfuscated} ~ ${xor})`;
  }

  obfuscateFactorial(num) {
    // Use factorial-based representation
    let expr = '1';
    for (let i = 2; i <= Math.min(10, num); i++) {
      expr += `*${i}`;
    }
    return `(${expr})`;
  }

  obfuscateAST(ast) {
    this.walkAST(ast);
    return ast;
  }

  walkAST(node) {
    if (!node) return;
    
    if (node.type === 'number') {
      node.value = this.obfuscateNumber(node.value);
    } else if (Array.isArray(node)) {
      node.forEach(n => this.walkAST(n));
    } else if (typeof node === 'object') {
      Object.values(node).forEach(n => this.walkAST(n));
    }
  }
}

module.exports = NumberObfuscator;
