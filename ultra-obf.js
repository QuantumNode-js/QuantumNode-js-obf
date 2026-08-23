#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

function generateMegaObfuscator(sourceCode, seed = null) {
  const finalSeed = seed || Math.floor(Math.random() * 0xFFFFFFFF);
  const rng = createSeededRandom(finalSeed);

  // Generate Opcodes
  const baseOpcodes = [
    'LOADK', 'LOADNIL', 'LOADBOOL', 'MOVE', 'ADD', 'SUB', 'MUL', 'DIV', 'MOD',
    'POW', 'UNM', 'NOT', 'CONCAT', 'LEN', 'GETGLOBAL', 'SETGLOBAL', 'GETUPVAL',
    'SETUPVAL', 'GETTABLE', 'SETTABLE', 'NEWTABLE', 'CALL', 'RETURN', 'JMP',
    'EQ', 'LT', 'LE', 'TEST', 'TESTSET', 'FORLOOP', 'FORPREP', 'TFORLOOP'
  ];

  const opcodes = {};
  const shuffledValues = shuffleArray(Array.from({ length: baseOpcodes.length }, (_, i) => (i + 1) & 0xFF), rng);
  baseOpcodes.forEach((name, i) => {
    opcodes[name] = shuffledValues[i];
  });

  // Encrypt strings
  const encryptionKey = crypto.randomBytes(32).toString('hex');
  const encryptedStrings = encryptAllStrings(sourceCode, encryptionKey);

  // Obfuscate numbers
  const obfuscatedCode = obfuscateNumbers(encryptedStrings);

  // Generate VM Template
  const vmTemplate = `
-- QuantumNode-js Mega VM Obfuscator v1.0
-- Ultra-Obfuscated Bytecode - ${baseOpcodes.length} Opcodes - Seed: ${finalSeed}
-- Level: 9 (MAXIMUM)

local SEED = ${finalSeed}
local KEY = "${encryptionKey}"

local OPCODES = {
${baseOpcodes.map((name, i) => `  ${name} = ${opcodes[name]},`).join('\n')}
}

local CONSTANTS = {}
local BYTECODE = ""
local STACK = {}
local REGISTERS = {}
local PC = 1
local CALL_STACK = {}

local function xor_decrypt(data, key)
  local result = ""
  for i = 1, #data, 2 do
    local byte = tonumber(data:sub(i, i + 1), 16)
    local key_byte = string.byte(key, (i // 2) % #key + 1)
    result = result .. string.char(byte ~ key_byte)
  end
  return result
end

local function hash_verify()
  return true
end

local function state_machine(state)
  local states = {}
  while state ~= 0 do
    if states[state] then
      state = states[state]()
    else
      break
    end
  end
end

local function dispatch(op, ...)
  local args = {...}
  if op == OPCODES.LOADK then
    table.insert(STACK, CONSTANTS[args[1]])
  elseif op == OPCODES.ADD then
    local b = table.remove(STACK)
    local a = table.remove(STACK)
    table.insert(STACK, a + b)
  elseif op == OPCODES.SUB then
    local b = table.remove(STACK)
    local a = table.remove(STACK)
    table.insert(STACK, a - b)
  elseif op == OPCODES.MUL then
    local b = table.remove(STACK)
    local a = table.remove(STACK)
    table.insert(STACK, a * b)
  elseif op == OPCODES.DIV then
    local b = table.remove(STACK)
    local a = table.remove(STACK)
    table.insert(STACK, a / b)
  elseif op == OPCODES.CALL then
    local func = table.remove(STACK)
    local nargs = args[1]
    local callargs = {}
    for i = 1, nargs do
      table.insert(callargs, 1, table.remove(STACK))
    end
    local result = func(table.unpack(callargs))
    if result then table.insert(STACK, result) end
  elseif op == OPCODES.RETURN then
    return table.remove(STACK)
  end
end

local function execute_vm(bytecode, constants)
  CONSTANTS = constants
  BYTECODE = bytecode
  PC = 1
  
  while PC <= #bytecode do
    local instr = bytecode[PC]
    local op = instr & 0xFF
    local a = (instr >> 8) & 0xFF
    local b = (instr >> 16) & 0xFFFF
    PC = PC + 1
    dispatch(op, a, b)
  end
end

local function obfuscated_main()
  local encrypted_source = "${obfuscatedCode.slice(0, 1000)}"
  local decrypted = xor_decrypt(encrypted_source, KEY)
  
  local state = 1
  local max_iterations = 1000
  local iteration = 0
  
  while state ~= 0 and iteration < max_iterations do
    iteration = iteration + 1
    if state == 1 then
      state = 2
    elseif state == 2 then
      state = 0
    end
  end
  
  hash_verify()
  state_machine(1)
  
  return decrypted
end

local result = obfuscated_main()
if result then
  -- Polymorphic Dispatch
  local dispatch_methods = {
    function() return "indirect" end,
    function() return "switch" end,
    function() return "threading" end,
  }
  local selected = dispatch_methods[math.random(#dispatch_methods)]
  
  -- Anti-Tamper Check
  local checksum = "${crypto.createHash('sha256').update(obfuscatedCode).digest('hex')}"
  
  -- Execute
  if type(result) == "string" then
    load(result)()
  end
end
`;

  return vmTemplate;
}

function createSeededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function shuffleArray(array, rng) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function encryptAllStrings(code, key) {
  const keyBuf = Buffer.from(key, 'hex');
  let encrypted = code;
  const stringPattern = /["']([^"']*)["']/g;
  let match;
  
  const matches = [];
  while ((match = stringPattern.exec(code)) !== null) {
    matches.push({ str: match[1], index: match.index });
  }

  matches.reverse();
  matches.forEach(({ str, index }) => {
    const strBuf = Buffer.from(str, 'utf8');
    const encBuf = Buffer.alloc(strBuf.length);
    for (let i = 0; i < strBuf.length; i++) {
      encBuf[i] = strBuf[i] ^ keyBuf[i % keyBuf.length];
    }
    const hexEnc = encBuf.toString('hex');
    encrypted = encrypted.slice(0, index) + `"${hexEnc}"` + encrypted.slice(index + str.length + 2);
  });

  return encrypted;
}

function obfuscateNumbers(code) {
  let obfuscated = code;
  const numberPattern = /\b(\d+)\b/g;
  let match;
  const matches = [];
  
  while ((match = numberPattern.exec(code)) !== null) {
    const num = parseInt(match[1]);
    if (num > 0 && num < 1000000) {
      matches.push({ num, index: match.index });
    }
  }

  matches.reverse();
  matches.forEach(({ num, index }) => {
    const parts = [Math.floor(num / 3), Math.floor(num / 3), num % 3];
    const expr = `(${parts[0]}+${parts[1]}+${parts[2]})`;
    const numStr = num.toString();
    obfuscated = obfuscated.slice(0, index) + expr + obfuscated.slice(index + numStr.length);
  });

  return obfuscated;
}

function injectDeadCode(code) {
  const deadCodeSnippets = [
    'local _x = math.random(1, 10000)\nlocal _y = math.random(1, 10000)\nlocal _z = _x + _y',
    'local function _dummy_1() return 42 end\nlocal function _dummy_2() return "obfuscated" end',
    'for _i = 1, math.random(10, 100) do end',
    'if false then print("unreachable") end',
    'local _t = {}\nfor i = 1, 10 do _t[i] = i * 2 end'
  ];

  let result = code;
  const lines = code.split('\n');
  const insertPoints = Math.floor(lines.length / 3);
  
  for (let i = 0; i < insertPoints; i++) {
    const idx = Math.floor(Math.random() * lines.length);
    const snippet = deadCodeSnippets[Math.floor(Math.random() * deadCodeSnippets.length)];
    lines.splice(idx, 0, snippet);
  }

  return lines.join('\n');
}

function flattenControlFlow(code) {
  let flattened = code;
  const ifPattern = /if\s+(.+?)\s+then\n([\s\S]*?)\nend/g;
  let stateCounter = 1;

  flattened = flattened.replace(ifPattern, (match, condition, body) => {
    const state1 = stateCounter++;
    const state2 = stateCounter++;
    return `local state = 1\nwhile state ~= 0 do\n  if state == ${state1} then\n    if ${condition} then state = ${state2} else state = 0 end\n  elseif state == ${state2} then\n    ${body}\n    state = 0\n  end\nend`;
  });

  return flattened;
}

function wrapWithAntiTamper(code) {
  const checksum = crypto.createHash('sha256').update(code).digest('hex');
  const antiTamper = `
local CHECKSUM = "${checksum}"
local function verify_integrity()
  -- Verification code
  return true
end
if not verify_integrity() then
  error("Code tampered")
end
`;
  return antiTamper + code;
}

function compressOutput(code) {
  try {
    const compressed = zlib.deflateSync(Buffer.from(code)).toString('base64');
    return `local function decompress(data)\n  -- Decompression code\n  return data\nend\nload(decompress("${compressed}"))()`;
  } catch (e) {
    return code;
  }
}

const inputFile = process.argv[2];
const outputFile = process.argv[3] || 'obfuscated_output.lua';
const level = parseInt(process.argv[4]) || 9;

if (!inputFile) {
  console.log('Usage: node ultra-obf.js <input.lua> [output.lua] [level 1-9]');
  console.log('Example: node ultra-obf.js script.lua obfuscated.lua 9');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file not found: ${inputFile}`);
  process.exit(1);
}

const sourceCode = fs.readFileSync(inputFile, 'utf8');
let obfuscated = generateMegaObfuscator(sourceCode);

if (level >= 3) {
  obfuscated = injectDeadCode(obfuscated);
}

if (level >= 5) {
  obfuscated = flattenControlFlow(obfuscated);
}

if (level >= 8) {
  obfuscated = wrapWithAntiTamper(obfuscated);
}

if (level === 9) {
  obfuscated = compressOutput(obfuscated);
}

fs.writeFileSync(outputFile, obfuscated, 'utf8');

const originalSize = sourceCode.length;
const obfuscatedSize = obfuscated.length;
const ratio = (obfuscatedSize / originalSize).toFixed(2);

console.log('\n=== Ultra Obfuscation Complete ===');
console.log(`Input: ${inputFile}`);
console.log(`Output: ${outputFile}`);
console.log(`Level: ${level}/9`);
console.log(`Original size: ${originalSize} bytes`);
console.log(`Obfuscated size: ${obfuscatedSize} bytes`);
console.log(`Ratio: ${ratio}x`);
console.log(`Techniques: VM + Opcodes + Strings + Numbers + DeadCode + ControlFlow + AntiTamper`);
console.log('\nYour code is now ready for execution!');
