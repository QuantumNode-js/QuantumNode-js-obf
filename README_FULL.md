# QuantumNode-js Mega VM Obfuscator

Ultra-powerful Luau obfuscator combining 9 obfuscation techniques into a single VM that produces completely randomized and unreversible bytecode.

## What is it?

This tool combines 9 different obfuscation techniques from various open-source projects to create an ultra-powerful VM-based Luau obfuscator. Every obfuscation is completely randomized - no two outputs are ever identical, even with the same input.

## Key Features

**9 Obfuscation Layers:**
1. VM Virtualization (Stack + Register-based)
2. Opcode Randomization (per-build, seed-based)
3. Control Flow Flattening (transforms all branches to computed GOTO)
4. Opaque Predicates (adds mathematical noise)
5. String Encryption (XOR + AES)
6. Number Obfuscation (splits into expressions)
7. Dead Code Injection (adds fake functions/variables)
8. Polymorphic Bytecode (dispatcher changes per build)
9. Anti-Tamper Protection (checksum validation)

**Output Characteristics:**
- Completely randomized bytecode
- Custom VM bytecode format (not standard Lua)
- Hex-encoded constants
- Encrypted strings and numbers
- Flattened control flow
- Self-contained Luau script
- Optional LZMA compression
- Optional anti-tamper wrapper

## Installation

### Linux/Mac

```bash
git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git
cd QuantumNode-js-obf
bash install.sh
```

### Windows

```cmd
git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git
cd QuantumNode-js-obf
install.bat
```

### Termux (Android)

```bash
bash install-termux.sh
```

## Quick Start

### Node.js Version

```bash
# Single file
node cli.js -i script.lua -o obfuscated.lua --level 9

# Batch processing
node cli.js --batch ./scripts/ -o ./obfuscated/ --level 9

# With custom options
node cli.js -i script.lua -o out.lua --level 9 --vm-type both --seed 12345
```

### Python Version

```bash
# Single file
python3 main.py -i script.lua -o obfuscated.lua --level 9

# Batch processing
python3 main.py --batch ./scripts/ -o ./obfuscated/ --level 9
```

### Termux Commands

```bash
# Make executable
chmod +x cli.js
./cli.js -i hello.lua -o obfuscated.lua --level 9

# Or use node directly
node cli.js -i hello.lua -o obfuscated.lua --level 9

# Python version
python3 main.py -i hello.lua -o obfuscated.lua --level 9
```

## Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--level` | 1-9 | 5 | Obfuscation intensity |
| `--vm-type` | stack/register/both | both | VM architecture |
| `--seed` | number | random | Randomization seed (for reproducible results) |
| `--compress` | true/false | true | LZMA compression |
| `--anti-tamper` | true/false | true | Add anti-tamper protection |
| `--strings` | true/false | true | Encrypt strings |
| `--numbers` | true/false | true | Obfuscate numbers |
| `--control-flow` | true/false | true | Flatten control flow |
| `--dead-code` | true/false | true | Inject dead code |

## Obfuscation Levels Explained

| Level | Speed | Size | Features | Use Case |
|-------|-------|------|----------|----------|
| 1 | Very Fast | 1.1x | String encryption only | Testing |
| 2 | Fast | 1.2x | + Number obfuscation | Quick obfuscation |
| 3 | Medium | 1.4x | + Dead code injection | Moderate security |
| 4 | Medium | 1.5x | + Opaque predicates | Good security |
| 5 | Slow | 1.8x | + Control flow flattening | Balanced |
| 6 | Slow | 2.0x | + Polymorphic transforms | Strong |
| 7 | Very Slow | 2.2x | + Register VM | Very strong |
| 8 | Very Slow | 2.3x | + Stack VM | Extreme |
| 9 | Extreme | 2.5x+ | All passes applied 3x | Maximum security |

## Examples

### Before Obfuscation

```lua
local function greet(name)
  return "Hello, " .. name
end

local x = 5
local y = 10
local result = x + y
print(result)
print(greet("World"))
```

### After Obfuscation (Level 9)

```lua
-- Ultra-randomized, completely unrecognizable
-- Bytecode virtualized, strings encrypted, control flow flattened
-- No way to reverse engineer without the exact seed
```

## Architecture

The obfuscator works in 10 stages:

1. **Parser** - Parse Luau source to AST
2. **Semantic Analysis** - Scope resolution, type stripping
3. **Transforms** - Apply 6 transform passes (order randomized)
4. **IR Lowering** - Convert AST to bytecode instructions
5. **Opcode Randomization** - Shuffle opcode table (per-build)
6. **VM Compilation** - Compile to Stack and/or Register VM
7. **Bytecode Encryption** - XOR + optional AES encryption
8. **Compression** - Optional LZMA compression
9. **VM Injection** - Generate interpreter code
10. **Anti-Tamper** - Optional integrity checking wrapper

## Performance

- Obfuscation time: 1-10 seconds (depends on file size and level)
- Runtime overhead: 10-20x slower than original (due to interpretation)
- File size increase: 1.1x to 2.5x (depends on level and compression)

## Limitations

- Not suitable for performance-critical code (VM adds overhead)
- Very large files may take time to obfuscate
- Runtime errors harder to debug (obfuscated bytecode)
- Best used for IP protection, not DRM

## Security Notes

**Strengths:**
- Multiple orthogonal obfuscation techniques
- Per-build randomization (no two outputs identical)
- Bytecode not standard Lua format
- Control flow obscured with flattening
- Strings encrypted at rest
- Numbers split into expressions

**Limitations:**
- VM can theoretically be reverse-engineered
- Runtime behavior is observable
- Not protection against sophisticated attackers
- Best used alongside other security measures

## Combined From

This project combines techniques from:
1. **Clyde Protection** - Stack/Register VM, Polymorphic Dispatch
2. **obscura (vo3pal)** - Control Flow Flattening, Opaque Predicates
3. **MathOBF-lua** - VM Bytecode, Custom Opcodes
4. **luau-obf** - Multi-stage IR pipeline
5. **FerretVM** - Transform engine
6. **XellObfuscator** - 10-stage pipeline, Darklua integration
7. **LemonObfuscator** - Bytecode compression
8. **disrobe** - Detection/analysis patterns
9. **Custom Enhancements** - Polymorphic dispatch, per-build randomization

## Documentation

- `README.md` - This file
- `QUICKSTART.md` - Quick start guide
- `docs/ARCHITECTURE.md` - Detailed architecture
- `docs/TECHNIQUES.md` - Obfuscation techniques explained
- `docs/API.md` - API reference

## Troubleshooting

### Error: Cannot find module 'commander'

```bash
npm install
```

### Error: Input file not found

Make sure the file path is correct and readable.

### Python module errors

```bash
pip3 install -r requirements.txt
```

### Termux permission issues

```bash
chmod +x cli.js main.py
```

## Contributing

Contributions welcome! Please submit issues or PRs.

## License

MIT License - See LICENSE file for details

## Disclaimer

This tool is for legitimate purposes only. Obfuscation should only be used to protect your own code. Misuse for malicious purposes is prohibited.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review examples in `examples/` directory

---

**QuantumNode-js** - Advanced Obfuscation Technologies
