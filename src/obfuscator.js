const fs = require('fs');
const path = require('path');
const StackVM = require('./src/vm/stack_vm');
const RegisterVM = require('./src/vm/register_vm');
const OpcodeGenerator = require('./src/vm/opcode_gen');
const PolymorphicDispatcher = require('./src/vm/dispatcher');
const ControlFlowFlattener = require('./src/transforms/control_flow');
const OpaquePredicates = require('./src/transforms/predicates');
const StringEncryptor = require('./src/transforms/strings');
const NumberObfuscator = require('./src/transforms/numbers');
const DeadCodeInjector = require('./src/transforms/dead_code');
const PolymorphicTransforms = require('./src/transforms/polymorphic');
const BytecodeCompiler = require('./src/pipeline/compiler');
const { NameGenerator, Encoder, CryptoUtils } = require('./src/utils/names');
const { Compressor, AntiTamper } = require('./src/utils/compression');

class MegaVMObfuscator {
  constructor(config = {}) {
    this.config = {
      level: config.level || 5,
      vmType: config.vmType || 'both',
      seed: config.seed || Math.floor(Math.random() * 0xFFFFFFFF),
      compress: config.compress !== false,
      antiTamper: config.antiTamper !== false,
      encryptStrings: config.encryptStrings !== false,
      obfuscateNumbers: config.obfuscateNumbers !== false,
      controlFlow: config.controlFlow !== false,
      deadCode: config.deadCode !== false,
      ...config
    };

    this.opcodeGen = new OpcodeGenerator(this.config.seed);
    this.opcodes = this.opcodeGen.getAllOpcodes();
    this.nameGen = new NameGenerator({ seed: this.config.seed });
  }

  async obfuscate(sourceCode) {
    console.log('Starting obfuscation...');
    console.log(`Level: ${this.config.level}`);
    console.log(`Seed: ${this.config.seed}`);

    try {
      let code = sourceCode;

      // Step 1: Parse and basic transformations
      const ast = this.parseCode(code);
      console.log('Parsed AST');

      // Step 2: Apply transforms based on level
      let transformedAst = ast;
      transformedAst = this.applyTransforms(transformedAst);
      console.log('Applied transforms');

      // Step 3: Compile to bytecode
      const bytecodeData = this.compileBytecode(transformedAst);
      console.log('Compiled bytecode');

      // Step 4: Encrypt bytecode
      const encryptedBytecode = this.encryptBytecode(bytecodeData);
      console.log('Encrypted bytecode');

      // Step 5: Generate VM
      const vmCode = this.generateVM(encryptedBytecode, bytecodeData.constants);
      console.log('Generated VM');

      // Step 6: Wrap with anti-tamper if needed
      let output = vmCode;
      if (this.config.antiTamper) {
        output = this.wrapWithAntiTamper(output);
        console.log('Added anti-tamper protection');
      }

      // Step 7: Compress if needed
      if (this.config.compress) {
        output = await this.compressOutput(output);
        console.log('Compressed output');
      }

      console.log('Obfuscation complete!');
      return output;
    } catch (error) {
      console.error('Obfuscation failed:', error);
      throw error;
    }
  }

  parseCode(code) {
    // Simplified parser - returns basic AST structure
    return {
      type: 'block',
      body: [{
        type: 'raw',
        code: code
      }]
    };
  }

  applyTransforms(ast) {
    const level = this.config.level;

    if (level >= 1 && this.config.encryptStrings) {
      const stringEncryptor = new StringEncryptor({ key: this.config.seed.toString() });
      ast = stringEncryptor.obfuscateAST(ast);
    }

    if (level >= 2 && this.config.obfuscateNumbers) {
      const numberObf = new NumberObfuscator();
      ast = numberObf.obfuscateAST(ast);
    }

    if (level >= 3 && this.config.deadCode) {
      const deadCodeInjector = new DeadCodeInjector({ rate: 0.2 * (level / 9) });
      ast = deadCodeInjector.injectDeadCode(ast);
    }

    if (level >= 4) {
      const predicates = new OpaquePredicates();
      ast = predicates.injectPredicates(ast);
    }

    if (level >= 5 && this.config.controlFlow) {
      const cff = new ControlFlowFlattener();
      ast = cff.flattenControlFlow(ast);
    }

    if (level >= 6) {
      const poly = new PolymorphicTransforms();
      ast = poly.applyPolymorphic(ast, this.config.seed);
    }

    if (level >= 9) {
      // Maximum obfuscation - apply all transforms multiple times
      for (let i = 0; i < 3; i++) {
        ast = this.applyTransforms(ast);
      }
    }

    return ast;
  }

  compileBytecode(ast) {
    const compiler = new BytecodeCompiler();
    return compiler.compile(ast, this.opcodes);
  }

  encryptBytecode(bytecodeData) {
    const bytecodeStr = JSON.stringify(bytecodeData);
    const encrypted = CryptoUtils.xor(bytecodeStr, this.config.seed.toString());
    return encrypted;
  }

  generateVM(encryptedBytecode, constants) {
    const lines = [];

    // Opcode table
    lines.push(this.opcodeGen.generateOpcodeTable());

    // Constants pool
    lines.push('local CONSTANTS = {');
    constants.forEach((c, i) => {
      if (typeof c === 'string') {
        lines.push(`  [${i}] = "${c.replace(/"/g, '\\"')}",`);
      } else {
        lines.push(`  [${i}] = ${c},`);
      }
    });
    lines.push('}');
    lines.push('');

    // Encrypted bytecode
    lines.push(`local BYTECODE = "${encryptedBytecode}"`);
    lines.push('');

    // VM Implementation
    lines.push(this.generateVMCore());

    // Dispatcher
    const dispatcher = new PolymorphicDispatcher({ dispatchType: this.config.dispatchType });
    lines.push(dispatcher.getDispatcherCode());

    // Bootstrap
    lines.push('-- Start VM');
    lines.push('local vm = VM.new(BYTECODE, CONSTANTS, _G)');
    lines.push('vm:execute()');

    return lines.join('\n');
  }

  generateVMCore() {
    const vmType = this.config.vmType;
    let vmCode = '';

    if (vmType === 'stack' || vmType === 'both') {
      vmCode += this.generateStackVMCode();
    }

    if (vmType === 'register' || vmType === 'both') {
      vmCode += '\n' + this.generateRegisterVMCode();
    }

    return vmCode;
  }

  generateStackVMCode() {
    return `
local VM = {}
VM.__index = VM

function VM.new(bytecode, constants, env)
  local self = setmetatable({}, VM)
  self.bytecode = bytecode
  self.constants = constants
  self.stack = {}
  self.pc = 1
  self.env = env or _G
  return self
end

function VM:execute()
  while self.pc <= #self.bytecode do
    local instr = self.bytecode[self.pc]
    self.pc = self.pc + 1
    -- Execute instruction
  end
end
`;
  }

  generateRegisterVMCode() {
    return `
local RegisterVM = {}
RegisterVM.__index = RegisterVM

function RegisterVM.new(bytecode, constants)
  local self = setmetatable({}, RegisterVM)
  self.bytecode = bytecode
  self.constants = constants
  self.registers = {}
  self.pc = 1
  return self
end

function RegisterVM:execute()
  while self.pc <= #self.bytecode do
    local instr = self.bytecode[self.pc]
    self.pc = self.pc + 1
    -- Execute instruction
  end
end
`;
  }

  wrapWithAntiTamper(code) {
    const checksum = Encoder.generateHash(code);
    const antiTamper = new AntiTamper();
    const tamperCode = antiTamper.generateAntiTamperCode(checksum);
    return tamperCode + '\n' + code;
  }

  async compressOutput(code) {
    try {
      const compressed = await Compressor.compress(code);
      return `-- COMPRESSED\nlocal code = "${compressed}"\nload(code)()`;
    } catch (error) {
      console.warn('Compression failed, returning uncompressed:', error);
      return code;
    }
  }
}

module.exports = MegaVMObfuscator;
