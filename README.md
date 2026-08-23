# QuantumNode-js VM Obfuscator

Ultra-powerful Luau VM Obfuscator - Combines 9 different obfuscation techniques in one tool.

## Features

- 9 Obfuscation Layers:
  1. VM Virtualization (Stack + Register-based)
  2. Opcode Randomization (per-build)
  3. Control Flow Flattening
  4. Opaque Predicates
  5. String Encryption (XOR + AES)
  6. Number Obfuscation
  7. Dead Code Injection
  8. Polymorphic Bytecode
  9. Anti-Tamper Protection

- Output Features:
  - Ultra-randomized bytecode
  - LZMA compression
  - Hex-encoded constants
  - Randomized variable names
  - Encrypted payload container
  - Self-contained Luau script

## Quick Start

### Install

In Termux:
```bash
git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git
cd QuantumNode-js-obf
npm install
# OR
pip install -r requirements.txt
```

### Usage

#### Node.js CLI

```bash
# Basic obfuscation
node cli.js -i script.lua -o obfuscated.lua --level 9

# With all options
node cli.js -i input.lua -o output.lua --level 9 --vm-type both --seed 12345 --compress --anti-tamper

# Batch processing
node cli.js --batch ./scripts/ -o ./obfuscated/ --level 9
```

#### Python CLI

```bash
python3 main.py -i script.lua -o obfuscated.lua --level 9
python3 main.py --batch ./scripts/ --level 9
```

#### Termux Commands

```bash
# Install Node.js in Termux
pkg install nodejs

# Install Python in Termux
pkg install python

# Install dependencies
npm install
pip install -r requirements.txt

# Run obfuscator
node cli.js -i hello.lua -o obfuscated.lua --level 9

# Make executable
chmod +x cli.js
./cli.js -i hello.lua -o out.lua --level 9
```

## Architecture

```
QuantumNode-js-obf/
|-- src/
|   |-- vm/
|   |   |-- stack_vm.js          # Stack-based VM
|   |   |-- register_vm.js        # Register-based VM
|   |   |-- opcode_gen.js         # Opcode randomizer
|   |   |-- dispatcher.js         # Polymorphic dispatcher
|   |-- transforms/
|   |   |-- control_flow.js       # Control flow flattening
|   |   |-- predicates.js         # Opaque predicates
|   |   |-- strings.js            # String encryption
|   |   |-- numbers.js            # Number obfuscation
|   |   |-- dead_code.js          # Dead code injection
|   |   |-- polymorphic.js        # Polymorphic transforms
|   |-- pipeline/
|   |   |-- parser.js             # Luau parser
|   |   |-- compiler.js           # Bytecode compiler
|   |   |-- emitter.js            # Output emitter
|   |   |-- scheduler.js          # Transform scheduler
|   |-- utils/
|       |-- encoder.js            # Encoding utilities
|       |-- crypto.js             # Encryption
|       |-- names.js              # Random name generator
|       |-- lzma.js               # Compression
|-- python/
|   |-- main.py                   # Python CLI
|   |-- vm_engine.py              # VM implementation
|   |-- transforms.py             # Transform passes
|   |-- utils.py                  # Utility functions
|-- cli.js                        # Node.js CLI
|-- package.json
|-- requirements.txt
|-- examples/
|-- docs/
    |-- ARCHITECTURE.md
    |-- API.md
    |-- TECHNIQUES.md
```

## Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| --level | 1-9 | 5 | Obfuscation intensity |
| --vm-type | stack/register/both | both | VM architecture |
| --seed | number | random | Randomization seed |
| --compress | true/false | true | LZMA compression |
| --anti-tamper | true/false | true | Add anti-tamper code |
| --strings | true/false | true | Encrypt strings |
| --numbers | true/false | true | Obfuscate numbers |
| --control-flow | true/false | true | Flatten control flow |
| --dead-code | true/false | true | Inject dead code |

## Performance

| Level | Speed | Size | Security | Use Case |
|-------|-------|------|----------|----------|
| 1 | Fast | 1.1x | Low | Fast iteration |
| 5 | Medium | 1.5x | Medium | Balanced |
| 9 | Slow | 2.5x | High | Maximum security |

## Requirements

- Node.js 16+ (for JS version)
- Python 3.8+ (for Python version)
- Termux compatible

## License

MIT
