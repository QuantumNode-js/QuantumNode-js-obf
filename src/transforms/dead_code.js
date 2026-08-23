class DeadCodeInjector {
  constructor(config = {}) {
    this.config = config;
    this.injectionRate = config.rate || 0.3;
  }

  injectDeadCode(ast) {
    const deadCodeBlocks = [];
    const injectionPoints = this.findInjectionPoints(ast);

    injectionPoints.forEach(point => {
      if (Math.random() < this.injectionRate) {
        const deadBlock = this.generateDeadCodeBlock();
        deadCodeBlocks.push({
          point: point,
          code: deadBlock
        });
      }
    });

    return this.insertDeadCode(ast, deadCodeBlocks);
  }

  generateDeadCodeBlock() {
    const types = [
      this.generateFakeVariable(),
      this.generateFakeFunction(),
      this.generateUnreachableCode(),
      this.generateNoOpLoop()
    ];

    return types[Math.floor(Math.random() * types.length)];
  }

  generateFakeVariable() {
    const names = ['_', '__', '___', '_x', '_y', '_z'];
    const name = names[Math.floor(Math.random() * names.length)];
    const value = Math.floor(Math.random() * 1000);
    return `local ${name} = ${value}`;
  }

  generateFakeFunction() {
    const name = this.randomName();
    return `local function ${name}() end`;
  }

  generateUnreachableCode() {
    return `if false then print("unreachable") end`;
  }

  generateNoOpLoop() {
    const iterations = Math.floor(Math.random() * 100) + 1;
    return `for i = 1, ${iterations} do end`;
  }

  findInjectionPoints(ast) {
    const points = [];
    if (ast && ast.body) {
      ast.body.forEach((stmt, i) => {
        points.push(i);
      });
    }
    return points;
  }

  insertDeadCode(ast, deadCodeBlocks) {
    if (!ast || !ast.body) return ast;

    const newBody = [];
    ast.body.forEach((stmt, i) => {
      newBody.push(stmt);
      deadCodeBlocks.forEach(block => {
        if (block.point === i) {
          newBody.push({
            type: 'raw',
            code: block.code
          });
        }
      });
    });

    ast.body = newBody;
    return ast;
  }

  randomName() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
    let name = '';
    for (let i = 0; i < 8; i++) {
      name += chars[Math.floor(Math.random() * chars.length)];
    }
    return name;
  }
}

module.exports = DeadCodeInjector;
