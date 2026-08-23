class StackVM:
    def __init__(self, config=None):
        if config is None:
            config = {}
        self.config = config
        self.bytecode = []
        self.constants = []
        self.stack = []
        self.frames = []
        self.pc = 0
        self.env = {}
        self.instruction_count = 0

    def push(self, value):
        self.stack.append(value)

    def pop(self):
        return self.stack.pop() if self.stack else None

    def emit(self, opcode, *args):
        instr = {
            'op': opcode,
            'args': args,
            'encoded': self.encode_instruction(opcode, args)
        }
        self.bytecode.append(instr)
        self.instruction_count += 1
        return len(self.bytecode) - 1

    def encode_instruction(self, opcode, args):
        encoded = opcode & 0xFF
        if len(args) > 0:
            encoded |= (args[0] & 0xFF) << 8
        if len(args) > 1:
            encoded |= (args[1] & 0xFFFF) << 16
        return encoded

    def add_constant(self, value):
        try:
            idx = self.constants.index(value)
            return idx
        except ValueError:
            self.constants.append(value)
            return len(self.constants) - 1

    def serialize(self):
        return {
            'bytecode': [i['encoded'] for i in self.bytecode],
            'constants': self.constants,
            'instruction_count': self.instruction_count
        }

class RegisterVM:
    def __init__(self, config=None):
        if config is None:
            config = {}
        self.config = config
        self.registers = [None] * 256
        self.bytecode = []
        self.constants = []
        self.pc = 0
        self.call_stack = []
        self.instruction_count = 0

    def get_register(self, r):
        return self.registers[r] if r < len(self.registers) else None

    def set_register(self, r, value):
        if r < len(self.registers):
            self.registers[r] = value

    def add_constant(self, value):
        try:
            idx = self.constants.index(value)
            return idx
        except ValueError:
            self.constants.append(value)
            return len(self.constants) - 1

    def alloc_register(self):
        for i in range(len(self.registers)):
            if self.registers[i] is None:
                return i
        raise RuntimeError('Out of registers')

    def serialize(self):
        return {
            'bytecode': self.bytecode,
            'constants': self.constants,
            'register_count': 256,
            'instruction_count': self.instruction_count
        }
