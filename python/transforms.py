import random
import hashlib
import string

class ControlFlowFlattener:
    def __init__(self):
        self.state_counter = 0
        self.dispatch_table = []

    def flatten_control_flow(self, ast):
        return ast

class OpaquePredicates:
    def __init__(self):
        self.predicates = [
            '(x * 2) % 2 == 0',
            '(x + 1) > x',
            'x == x',
            '1 + 1 == 2',
            'true or false',
            'not false'
        ]

    def generate_opaque_predicate(self):
        return random.choice(self.predicates)

    def inject_predicates(self, ast):
        return ast

class StringEncryptor:
    def __init__(self, key=None):
        self.key = key or hashlib.sha256(str(random.random()).encode()).hexdigest()
        self.encrypted_strings = {}

    def encrypt_string(self, s):
        if s in self.encrypted_strings:
            return self.encrypted_strings[s]
        
        encrypted = self.xor_encrypt(s)
        self.encrypted_strings[s] = encrypted
        return encrypted

    def xor_encrypt(self, s):
        key_bytes = self.key.encode()
        s_bytes = s.encode()
        encrypted = bytes([s_bytes[i] ^ key_bytes[i % len(key_bytes)] for i in range(len(s_bytes))])
        return encrypted.hex()

    def obfuscate_ast(self, ast):
        return ast

class NumberObfuscator:
    def __init__(self):
        self.method = 'arithmetic'

    def obfuscate_number(self, num):
        if self.method == 'arithmetic':
            return self.obfuscate_arithmetic(num)
        return str(num)

    def obfuscate_arithmetic(self, num):
        parts = [num // 3, num // 3, num // 3, num % 3]
        expr = f'({parts[0]}+{parts[1]}+{parts[2]}+{parts[3]})'
        return expr

    def obfuscate_ast(self, ast):
        return ast

class DeadCodeInjector:
    def __init__(self, rate=0.3):
        self.injection_rate = rate

    def generate_dead_code_block(self):
        types = [
            self.generate_fake_variable(),
            self.generate_fake_function(),
            self.generate_unreachable_code(),
        ]
        return random.choice(types)

    def generate_fake_variable(self):
        names = ['_', '__', '___', '_x', '_y', '_z']
        name = random.choice(names)
        value = random.randint(0, 1000)
        return f'local {name} = {value}'

    def generate_fake_function(self):
        name = ''.join(random.choices(string.ascii_letters, k=8))
        return f'local function {name}() end'

    def generate_unreachable_code(self):
        return 'if false then print("unreachable") end'

    def inject_dead_code(self, ast):
        return ast
