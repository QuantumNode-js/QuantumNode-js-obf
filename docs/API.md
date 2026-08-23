# QuantumNode-js Obfuscator - API Reference

## JavaScript API

### MegaVMObfuscator

```javascript
const MegaVMObfuscator = require('./src/obfuscator');

const obfuscator = new MegaVMObfuscator({
  level: 9,
  vmType: 'both',
  seed: 12345,
  compress: true,
  antiTamper: true,
  encryptStrings: true,
  obfuscateNumbers: true,
  controlFlow: true,
  deadCode: true
});

const obfuscated = await obfuscator.obfuscate(sourceCode);
```

### Configuration Options

```javascript
const config = {
  // Obfuscation intensity (1-9, default: 5)
  level: 9,
  
  // VM architecture: 'stack', 'register', or 'both'
  vmType: 'both',
  
  // Random seed for reproducibility (default: random)
  seed: 12345,
  
  // Enable LZMA compression (default: true)
  compress: true,
  
  // Enable anti-tamper protection (default: true)
  antiTamper: true,
  
  // Enable string encryption (default: true)
  encryptStrings: true,
  
  // Enable number obfuscation (default: true)
  obfuscateNumbers: true,
  
  // Enable control flow flattening (default: true)
  controlFlow: true,
  
  // Enable dead code injection (default: true)
  deadCode: true
};
```

## Python API

```python
from python.main import MegaVMObfuscatorPython

obfuscator = MegaVMObfuscatorPython({
    'level': 9,
    'vm_type': 'both',
    'seed': 12345,
    'compress': True,
    'anti_tamper': True,
    'encrypt_strings': True,
    'obfuscate_numbers': True,
    'control_flow': True,
    'dead_code': True
})

obfuscated = obfuscator.obfuscate(source_code)
```

## Module Structure

### src/vm/

**stack_vm.js** - Stack-based virtual machine
- `StackVM` class
- Methods: `push()`, `pop()`, `emit()`, `execute()`, `serialize()`

**register_vm.js** - Register-based virtual machine
- `RegisterVM` class
- Methods: `getRegister()`, `setRegister()`, `emit()`, `execute()`, `serialize()`

**opcode_gen.js** - Opcode randomization
- `OpcodeGenerator` class
- Methods: `randomize()`, `getOpcode()`, `getAllOpcodes()`, `generateOpcodeTable()`

**dispatcher.js** - Polymorphic dispatch
- `PolymorphicDispatcher` class
- Methods: `generateDispatcher()`, `generateSwitchDispatcher()`, `generateIndirectDispatcher()`

### src/transforms/

**control_flow.js** - Control flow flattening
- `ControlFlowFlattener` class
- Converts branches to state machine

**predicates.js** - Opaque predicates
- `OpaquePredicates` class
- Adds mathematical noise

**strings.js** - String encryption
- `StringEncryptor` class
- XOR and AES encryption

**numbers.js** - Number obfuscation
- `NumberObfuscator` class
- Splits numbers into expressions

**dead_code.js** - Dead code injection
- `DeadCodeInjector` class
- Adds fake functions and variables

**polymorphic.js** - Polymorphic transforms
- `PolymorphicTransforms` class
- Randomized AST transformations

### src/pipeline/

**compiler.js** - Bytecode compiler
- `BytecodeCompiler` class
- Compiles AST to bytecode instructions

### src/utils/

**names.js** - Name generation and encoding
- `NameGenerator` class
- `Encoder` class
- `CryptoUtils` class

**compression.js** - Compression and anti-tamper
- `Compressor` class
- `AntiTamper` class

## CLI Usage

```bash
node cli.js [options]

Options:
  -i, --input <file>         Input file
  -o, --output <file>        Output file
  --batch <dir>              Batch process directory
  --level <number>           Obfuscation level (1-9)
  --vm-type <type>           VM type (stack/register/both)
  --seed <number>            Random seed
  --compress                  Enable compression
  --anti-tamper              Enable anti-tamper
  --strings                  Enable string encryption
  --numbers                  Enable number obfuscation
  --control-flow            Enable control flow flattening
  --dead-code               Enable dead code injection
```

## Python CLI Usage

```bash
python3 main.py [options]

Options:
  -i, --input <file>         Input file
  -o, --output <file>        Output file
  --batch <dir>              Batch process directory
  --level <number>           Obfuscation level (1-9)
  --vm-type <type>           VM type (stack/register/both)
  --seed <number>            Random seed
  --compress                 Enable compression
  --anti-tamper             Enable anti-tamper
  --strings                 Enable string encryption
  --numbers                 Enable number obfuscation
  --control-flow           Enable control flow flattening
  --dead-code              Enable dead code injection
```

## Examples

### JavaScript Library Usage

```javascript
const fs = require('fs');
const MegaVMObfuscator = require('./src/obfuscator');

const source = fs.readFileSync('script.lua', 'utf8');
const obfuscator = new MegaVMObfuscator({ level: 9 });
const result = await obfuscator.obfuscate(source);
fs.writeFileSync('obfuscated.lua', result);
```

### Python Library Usage

```python
from python.main import MegaVMObfuscatorPython

with open('script.lua', 'r') as f:
    source = f.read()

obfuscator = MegaVMObfuscatorPython({'level': 9})
obfuscated = obfuscator.obfuscate(source)

with open('obfuscated.lua', 'w') as f:
    f.write(obfuscated)
```

## Return Values

Both JavaScript and Python versions return a string containing the obfuscated Luau code.

## Error Handling

```javascript
try {
  const result = await obfuscator.obfuscate(source);
} catch (error) {
  console.error('Obfuscation failed:', error.message);
}
```

```python
try:
    result = obfuscator.obfuscate(source)
except Exception as e:
    print(f'Obfuscation failed: {e}')
```

## Performance Tips

1. Use level 5-7 for balance between speed and security
2. Use level 9 only for critical code (slower)
3. Use `--seed` to make results reproducible
4. Batch process multiple files for efficiency
5. Disable `--compress` for faster processing

## Debugging

Enable verbose output:

```bash
node cli.js -i script.lua -o out.lua --level 9 2>&1 | tee output.log
```
