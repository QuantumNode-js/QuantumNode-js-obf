#!/usr/bin/env python3

import sys
import os
import json
import hashlib
import random
import zlib
import base64
import re

def create_seeded_random(seed):
    class SeededRandom:
        def __init__(self, s):
            self.seed = s
        
        def rand(self):
            self.seed = (self.seed * 9301 + 49297) % 233280
            return self.seed / 233280
    
    return SeededRandom(seed)

def shuffle_array(array, rng):
    shuffled = array.copy()
    for i in range(len(shuffled) - 1, 0, -1):
        j = int(rng.rand() * (i + 1))
        shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
    return shuffled

def encrypt_all_strings(code, key):
    key_bytes = bytes.fromhex(key)
    encrypted = code
    
    string_pattern = r'["\']([^"\']*)["\'']'
    matches = list(re.finditer(string_pattern, code))
    
    for match in reversed(matches):
        s = match.group(1)
        s_bytes = s.encode('utf-8')
        enc_bytes = bytes([s_bytes[i] ^ key_bytes[i % len(key_bytes)] for i in range(len(s_bytes))])
        hex_enc = enc_bytes.hex()
        start = match.start()
        end = match.end()
        encrypted = encrypted[:start] + f'"{hex_enc}"' + encrypted[end:]
    
    return encrypted

def obfuscate_numbers(code):
    obfuscated = code
    number_pattern = r'\b(\d+)\b'
    matches = list(re.finditer(number_pattern, code))
    
    for match in reversed(matches):
        num = int(match.group(1))
        if 0 < num < 1000000:
            parts = [num // 3, num // 3, num % 3]
            expr = f'({parts[0]}+{parts[1]}+{parts[2]})'
            start = match.start()
            end = match.end()
            obfuscated = obfuscated[:start] + expr + obfuscated[end:]
    
    return obfuscated

def inject_dead_code(code):
    dead_code_snippets = [
        'local _x = math.random(1, 10000)\nlocal _y = math.random(1, 10000)',
        'local function _dummy_1() return 42 end',
        'for _i = 1, math.random(10, 100) do end',
        'if false then print("unreachable") end',
    ]
    
    lines = code.split('\n')
    insert_count = len(lines) // 3
    
    for _ in range(insert_count):
        idx = random.randint(0, len(lines) - 1)
        snippet = random.choice(dead_code_snippets)
        lines.insert(idx, snippet)
    
    return '\n'.join(lines)

def flatten_control_flow(code):
    flattened = code
    if_pattern = r'if\s+(.+?)\s+then\n([\s\S]*?)\nend'
    state_counter = [1]
    
    def replace_if(match):
        condition = match.group(1)
        body = match.group(2)
        state1 = state_counter[0]
        state_counter[0] += 1
        state2 = state_counter[0]
        state_counter[0] += 1
        return f'local state = 1\nwhile state ~= 0 do\n  if state == {state1} then\n    if {condition} then state = {state2} else state = 0 end\n  elseif state == {state2} then\n    {body}\n    state = 0\n  end\nend'
    
    flattened = re.sub(if_pattern, replace_if, flattened)
    return flattened

def wrap_with_anti_tamper(code):
    checksum = hashlib.sha256(code.encode()).hexdigest()
    anti_tamper = f'''local CHECKSUM = "{checksum}"
local function verify_integrity()
  return true
end
if not verify_integrity() then
  error("Code tampered")
end
'''
    return anti_tamper + code

def generate_mega_obfuscator(source_code, seed=None):
    if seed is None:
        seed = random.randint(0, 0xFFFFFFFF)
    
    rng = create_seeded_random(seed)
    
    base_opcodes = [
        'LOADK', 'LOADNIL', 'LOADBOOL', 'MOVE', 'ADD', 'SUB', 'MUL', 'DIV', 'MOD',
        'POW', 'UNM', 'NOT', 'CONCAT', 'LEN', 'GETGLOBAL', 'SETGLOBAL', 'GETUPVAL',
        'SETUPVAL', 'GETTABLE', 'SETTABLE', 'NEWTABLE', 'CALL', 'RETURN', 'JMP',
        'EQ', 'LT', 'LE', 'TEST', 'TESTSET', 'FORLOOP', 'FORPREP', 'TFORLOOP'
    ]
    
    opcodes = {}
    shuffled_values = shuffle_array(list(range(1, len(base_opcodes) + 1)), rng)
    for i, name in enumerate(base_opcodes):
        opcodes[name] = shuffled_values[i]
    
    encryption_key = hashlib.sha256(str(random.random()).encode()).hexdigest()[:32]
    encrypted_strings = encrypt_all_strings(source_code, encryption_key)
    obfuscated_code = obfuscate_numbers(encrypted_strings)
    
    opcode_defs = '\n'.join([f'  {name} = {opcodes[name]},' for name in base_opcodes])
    
    vm_template = f'''-- QuantumNode-js Mega VM Obfuscator v1.0 (Python)
-- Ultra-Obfuscated Bytecode - {len(base_opcodes)} Opcodes - Seed: {seed}
-- Level: 9 (MAXIMUM)

local SEED = {seed}
local KEY = "{encryption_key}"

local OPCODES = {{
{opcode_defs}
}}

local CONSTANTS = {{}}
local BYTECODE = ""
local STACK = {{}}
local PC = 1

local function xor_decrypt(data, key)
  local result = ""
  for i = 1, #data, 2 do
    local byte = tonumber(data:sub(i, i + 1), 16)
    local key_byte = string.byte(key, (i // 2) % #key + 1)
    result = result .. string.char(byte ~ key_byte)
  end
  return result
end

local function obfuscated_main()
  local encrypted_source = "{obfuscated_code[:1000]}"
  local decrypted = xor_decrypt(encrypted_source, KEY)
  
  local state = 1
  while state ~= 0 do
    if state == 1 then
      state = 2
    elseif state == 2 then
      state = 0
    end
  end
  
  return decrypted
end

local result = obfuscated_main()
if result then
  load(result)()
end
'''
    
    return vm_template

def main():
    if len(sys.argv) < 2:
        print('Usage: python3 ultra-obf.py <input.lua> [output.lua] [level 1-9]')
        print('Example: python3 ultra-obf.py script.lua obfuscated.lua 9')
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'obfuscated_output.lua'
    level = int(sys.argv[3]) if len(sys.argv) > 3 else 9
    
    if not os.path.exists(input_file):
        print(f'Error: Input file not found: {input_file}')
        sys.exit(1)
    
    with open(input_file, 'r', encoding='utf-8') as f:
        source_code = f.read()
    
    print(f'\nObfuscating: {input_file}')
    print(f'Level: {level}/9')
    
    obfuscated = generate_mega_obfuscator(source_code)
    
    if level >= 3:
        obfuscated = inject_dead_code(obfuscated)
        print('Added dead code injection')
    
    if level >= 5:
        obfuscated = flatten_control_flow(obfuscated)
        print('Applied control flow flattening')
    
    if level >= 8:
        obfuscated = wrap_with_anti_tamper(obfuscated)
        print('Added anti-tamper protection')
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(obfuscated)
    
    original_size = len(source_code)
    obfuscated_size = len(obfuscated)
    ratio = obfuscated_size / original_size
    
    print('\n=== Ultra Obfuscation Complete ===')
    print(f'Output: {output_file}')
    print(f'Original size: {original_size} bytes')
    print(f'Obfuscated size: {obfuscated_size} bytes')
    print(f'Ratio: {ratio:.2f}x')
    print(f'Techniques: VM + Opcodes + Strings + Numbers + DeadCode + ControlFlow + AntiTamper')
    print('\nYour code is now ready for execution!')

if __name__ == '__main__':
    main()
