const crypto = require('crypto');

class OpcodeGenerator {
  constructor(seed = null) {
    this.seed = seed || Math.floor(Math.random() * 0xFFFFFFFF);
    this.baseOpcodes = {
      LOADK: 0x01,
      LOADNIL: 0x02,
      LOADBOOL: 0x03,
      MOVE: 0x04,
      ADD: 0x05,
      SUB: 0x06,
      MUL: 0x07,
      DIV: 0x08,
      MOD: 0x09,
      POW: 0x0A,
      UNM: 0x0B,
      NOT: 0x0C,
      CONCAT: 0x0D,
      LEN: 0x0E,
      GETGLOBAL: 0x0F,
      SETGLOBAL: 0x10,
      GETUPVAL: 0x11,
      SETUPVAL: 0x12,
      GETTABLE: 0x13,
      SETTABLE: 0x14,
      NEWTABLE: 0x15,
      CALL: 0x16,
      RETURN: 0x17,
      JMP: 0x18,
      EQ: 0x19,
      LT: 0x1A,
      LE: 0x1B,
      TEST: 0x1C,
      TESTSET: 0x1D,
      FORLOOP: 0x1E,
      FORPREP: 0x1F,
      TFORLOOP: 0x20,
      SETLIST: 0x21,
      CLOSURE: 0x22
    };
    this.randomizedOpcodes = {};
    this.reverseOpcodes = {};
    this.randomize();
  }

  randomize() {
    const opcodeNames = Object.keys(this.baseOpcodes);
    const opcodeValues = this.generateShuffledValues(opcodeNames.length);
    
    opcodeNames.forEach((name, index) => {
      this.randomizedOpcodes[name] = opcodeValues[index];
      this.reverseOpcodes[opcodeValues[index]] = name;
    });
  }

  generateShuffledValues(count) {
    const values = Array.from({ length: count }, (_, i) => (i + 1) & 0xFF);
    return this.shuffle(values);
  }

  shuffle(array) {
    const rng = this.seededRandom();
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  seededRandom() {
    let seed = this.seed;
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  getOpcode(name) {
    return this.randomizedOpcodes[name];
  }

  getOpcodeName(value) {
    return this.reverseOpcodes[value];
  }

  getAllOpcodes() {
    return { ...this.randomizedOpcodes };
  }

  getOpcodeMapping() {
    return {
      forward: { ...this.randomizedOpcodes },
      reverse: { ...this.reverseOpcodes },
      seed: this.seed
    };
  }

  generateOpcodeTable() {
    const lines = [];
    lines.push('local OPCODES = {');
    Object.entries(this.randomizedOpcodes).forEach(([name, value]) => {
      lines.push(`  ${name} = ${value},`);
    });
    lines.push('}');
    lines.push('');
    return lines.join('\n');
  }
}

module.exports = OpcodeGenerator;
