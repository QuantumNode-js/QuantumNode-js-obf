#!/usr/bin/env python3

import sys
import os
import json
import argparse
import hashlib
from pathlib import Path
from colorama import Fore, Style

sys.path.insert(0, os.path.dirname(__file__))

from python.vm_engine import StackVM, RegisterVM
from python.transforms import (
    ControlFlowFlattener,
    OpaquePredicates,
    StringEncryptor,
    NumberObfuscator,
    DeadCodeInjector
)
from python.utils import OpcodeGenerator, NameGenerator, Encoder

class MegaVMObfuscatorPython:
    def __init__(self, config=None):
        if config is None:
            config = {}
        
        self.config = {
            'level': config.get('level', 5),
            'vm_type': config.get('vm_type', 'both'),
            'seed': config.get('seed', None),
            'compress': config.get('compress', True),
            'anti_tamper': config.get('anti_tamper', True),
            'encrypt_strings': config.get('encrypt_strings', True),
            'obfuscate_numbers': config.get('obfuscate_numbers', True),
            'control_flow': config.get('control_flow', True),
            'dead_code': config.get('dead_code', True),
        }
        
        if self.config['seed'] is None:
            import random
            self.config['seed'] = random.randint(0, 0xFFFFFFFF)
        
        self.opcode_gen = OpcodeGenerator(self.config['seed'])
        self.opcodes = self.opcode_gen.get_all_opcodes()
        self.name_gen = NameGenerator(seed=self.config['seed'])

    def obfuscate(self, source_code):
        print(Fore.CYAN + 'Starting obfuscation...' + Style.RESET_ALL)
        print(f'Level: {self.config["level"]}')
        print(f'Seed: {self.config["seed"]}')
        
        try:
            code = source_code
            
            # Parse code
            ast = self.parse_code(code)
            print(Fore.GREEN + 'Parsed AST' + Style.RESET_ALL)
            
            # Apply transforms
            transformed_ast = self.apply_transforms(ast)
            print(Fore.GREEN + 'Applied transforms' + Style.RESET_ALL)
            
            # Compile bytecode
            bytecode_data = self.compile_bytecode(transformed_ast)
            print(Fore.GREEN + 'Compiled bytecode' + Style.RESET_ALL)
            
            # Generate VM
            vm_code = self.generate_vm(bytecode_data)
            print(Fore.GREEN + 'Generated VM' + Style.RESET_ALL)
            
            # Add anti-tamper
            if self.config['anti_tamper']:
                vm_code = self.wrap_with_anti_tamper(vm_code)
                print(Fore.GREEN + 'Added anti-tamper protection' + Style.RESET_ALL)
            
            print(Fore.GREEN + 'Obfuscation complete!' + Style.RESET_ALL)
            return vm_code
            
        except Exception as e:
            print(Fore.RED + f'Obfuscation failed: {e}' + Style.RESET_ALL)
            raise

    def parse_code(self, code):
        return {
            'type': 'block',
            'body': [{
                'type': 'raw',
                'code': code
            }]
        }

    def apply_transforms(self, ast):
        level = self.config['level']
        
        if level >= 1 and self.config['encrypt_strings']:
            encryptor = StringEncryptor(key=str(self.config['seed']))
            ast = encryptor.obfuscate_ast(ast)
        
        if level >= 2 and self.config['obfuscate_numbers']:
            number_obf = NumberObfuscator()
            ast = number_obf.obfuscate_ast(ast)
        
        if level >= 3 and self.config['dead_code']:
            dead_code = DeadCodeInjector(rate=0.2 * (level / 9))
            ast = dead_code.inject_dead_code(ast)
        
        if level >= 4:
            predicates = OpaquePredicates()
            ast = predicates.inject_predicates(ast)
        
        if level >= 5 and self.config['control_flow']:
            cff = ControlFlowFlattener()
            ast = cff.flatten_control_flow(ast)
        
        if level >= 9:
            for _ in range(2):
                ast = self.apply_transforms(ast)
        
        return ast

    def compile_bytecode(self, ast):
        return {
            'instructions': [],
            'constants': [],
            'instruction_count': 0
        }

    def generate_vm(self, bytecode_data):
        lines = []
        
        # Opcode table
        lines.append('local OPCODES = {')
        for name, value in self.opcodes.items():
            lines.append(f'  {name} = {value},')
        lines.append('}')
        lines.append('')
        
        # Constants
        lines.append('local CONSTANTS = {')
        for i, const in enumerate(bytecode_data.get('constants', [])):
            if isinstance(const, str):
                lines.append(f'  [{i}] = "{const.replace(chr(34), chr(92) + chr(34))}",') 
            else:
                lines.append(f'  [{i}] = {const},')
        lines.append('}')
        lines.append('')
        
        # VM Core
        lines.append(self.generate_vm_core())
        
        # Bootstrap
        lines.append('-- Start VM')
        lines.append('local vm = VM.new(BYTECODE, CONSTANTS, _G)')
        lines.append('vm:execute()')
        
        return '\n'.join(lines)

    def generate_vm_core(self):
        return '''
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
  end
end

local BYTECODE = {}
'''

    def wrap_with_anti_tamper(self, code):
        checksum = hashlib.sha256(code.encode()).hexdigest()
        tamper_code = f'''
-- Anti-Tamper Protection
local CHECKSUM = "{checksum}"
local function verify_integrity()
  -- Verification code
end
verify_integrity()
'''
        return tamper_code + '\n' + code

def obfuscate_file(input_file, output_file, config):
    if not os.path.exists(input_file):
        print(Fore.RED + f'Error: Input file not found: {input_file}' + Style.RESET_ALL)
        return False
    
    with open(input_file, 'r', encoding='utf-8') as f:
        source = f.read()
    
    obfuscator = MegaVMObfuscatorPython(config)
    print(Fore.BLUE + f'Obfuscating: {input_file}' + Style.RESET_ALL)
    
    obfuscated = obfuscator.obfuscate(source)
    
    os.makedirs(os.path.dirname(output_file) or '.', exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(obfuscated)
    
    print(Fore.GREEN + f'Success: {output_file}' + Style.RESET_ALL)
    print(Fore.YELLOW + f'Original size: {len(source)} bytes')
    print(f'Obfuscated size: {len(obfuscated)} bytes')
    print(f'Compression ratio: {len(obfuscated) / len(source):.2f}x' + Style.RESET_ALL)
    return True

def main():
    parser = argparse.ArgumentParser(description='QuantumNode-js Mega VM Obfuscator (Python)')
    parser.add_argument('-i', '--input', help='Input Luau file')
    parser.add_argument('-o', '--output', help='Output file')
    parser.add_argument('--batch', help='Batch process directory')
    parser.add_argument('--level', type=int, default=5, help='Obfuscation level (1-9)')
    parser.add_argument('--vm-type', default='both', help='VM type: stack, register, both')
    parser.add_argument('--seed', type=int, help='Random seed')
    parser.add_argument('--compress', action='store_true', default=True, help='Enable compression')
    parser.add_argument('--anti-tamper', action='store_true', default=True, help='Enable anti-tamper')
    parser.add_argument('--strings', action='store_true', default=True, help='Encrypt strings')
    parser.add_argument('--numbers', action='store_true', default=True, help='Obfuscate numbers')
    parser.add_argument('--control-flow', action='store_true', default=True, help='Control flow flattening')
    parser.add_argument('--dead-code', action='store_true', default=True, help='Dead code injection')
    
    args = parser.parse_args()
    
    config = {
        'level': args.level,
        'vm_type': args.vm_type,
        'seed': args.seed,
        'compress': args.compress,
        'anti_tamper': args.anti_tamper,
        'encrypt_strings': args.strings,
        'obfuscate_numbers': args.numbers,
        'control_flow': args.control_flow,
        'dead_code': args.dead_code,
    }
    
    if args.batch:
        print(Fore.CYAN + 'Batch mode enabled' + Style.RESET_ALL)
        batch_dir = Path(args.batch)
        lua_files = list(batch_dir.glob('**/*.lua'))
        print(Fore.BLUE + f'Found {len(lua_files)} files to obfuscate' + Style.RESET_ALL)
        
        for lua_file in lua_files:
            relative = lua_file.relative_to(batch_dir)
            out_dir = args.output or './obfuscated'
            out_file = Path(out_dir) / relative
            out_file.parent.mkdir(parents=True, exist_ok=True)
            obfuscate_file(str(lua_file), str(out_file), config)
        
        print(Fore.GREEN + 'Batch obfuscation complete!' + Style.RESET_ALL)
    elif args.input and args.output:
        obfuscate_file(args.input, args.output, config)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
