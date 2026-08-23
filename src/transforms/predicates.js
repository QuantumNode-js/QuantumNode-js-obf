class OpaquePredicates {
  constructor(config = {}) {
    this.config = config;
    this.predicates = [
      '(x * 2) % 2 == 0',
      '(x + 1) > x',
      'x == x',
      '1 + 1 == 2',
      'true or false',
      'not false'
    ];
  }

  generateOpaquePredicate() {
    return this.predicates[Math.floor(Math.random() * this.predicates.length)];
  }

  injectPredicates(ast) {
    this.walkAST(ast);
    return ast;
  }

  walkAST(node) {
    if (!node) return;

    if (node.type === 'if') {
      if (Math.random() < 0.3) {
        node.condition = {
          type: 'binary',
          operator: 'and',
          left: node.condition,
          right: this.generateOpaquePredicate()
        };
      }
    }

    if (Array.isArray(node)) {
      node.forEach(n => this.walkAST(n));
    } else if (typeof node === 'object') {
      Object.values(node).forEach(n => this.walkAST(n));
    }
  }
}

module.exports = OpaquePredicates;
