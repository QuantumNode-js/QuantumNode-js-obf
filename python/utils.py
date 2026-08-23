import random
import hashlib

class OpcodeGenerator:
    def __init__(self, seed=None):
        self.seed = seed or random.randint(0, 0xFFFFFFFF)
        self.base_opcodes = {
            'LOADK': 0x01,
            'LOADNIL': 0x02,
            'LOADBOOL': 0x03,
            'MOVE': 0x04,
            'ADD': 0x05,
            'SUB': 0x06,
            'MUL': 0x07,
            'DIV': 0x08,
            'MOD': 0x09,
            'POW': 0x0A,
            'UNM': 0x0B,
            'NOT': 0x0C,
            'CONCAT': 0x0D,
            'LEN': 0x0E,
            'GETGLOBAL': 0x0F,
            'SETGLOBAL': 0x10,
            'CALL': 0x16,
            'RETURN': 0x17,
            'JMP': 0x18,
            'EQ': 0x19,
            'LT': 0x1A,
            'LE': 0x1B,
        }
        self.randomized_opcodes = {}
        self.reverse_opcodes = {}
        self.randomize()

    def randomize(self):
        opcode_names = list(self.base_opcodes.keys())
        opcode_values = self.generate_shuffled_values(len(opcode_names))
        
        for i, name in enumerate(opcode_names):
            self.randomized_opcodes[name] = opcode_values[i]
            self.reverse_opcodes[opcode_values[i]] = name

    def generate_shuffled_values(self, count):
        values = list(range(1, count + 1))
        rng = self.seeded_random()
        for i in range(len(values) - 1, 0, -1):
            j = int(rng() * (i + 1))
            values[i], values[j] = values[j], values[i]
        return values

    def seeded_random(self):
        seed = [self.seed]
        def rand():
            seed[0] = (seed[0] * 9301 + 49297) % 233280
            return seed[0] / 233280
        return rand

    def get_opcode(self, name):
        return self.randomized_opcodes.get(name)

    def get_all_opcodes(self):
        return self.randomized_opcodes.copy()

class NameGenerator:
    def __init__(self, seed=None):
        self.seed = seed or random.random()
        self.name_map = {}

    def generate_name(self, original):
        if original in self.name_map:
            return self.name_map[original]
        
        generated = self.create_random_name()
        self.name_map[original] = generated
        return generated

    def create_random_name(self):
        charsets = ['lI1|_', 'O0o_', string.ascii_lowercase, string.ascii_letters + '_']
        charset = random.choice(charsets)
        length = random.randint(8, 12)
        return '_' + ''.join(random.choices(charset, k=length))

class Encoder:
    @staticmethod
    def encode_hex(s):
        return s.encode().hex()
    
    @staticmethod
    def decode_hex(h):
        return bytes.fromhex(h).decode()
    
    @staticmethod
    def generate_hash(data):
        return hashlib.sha256(data.encode()).hexdigest()

import string
