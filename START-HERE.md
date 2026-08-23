# QuantumNode-js - Mega Obfuscator Complete

All-in-one Luau obfuscator combining 9 obfuscation techniques into a single VM that produces completely randomized bytecode.

## Quick Commands

### One-Command Obfuscation

```bash
# Node.js - Ultra Fast
node ultra-obf.js input.lua output.lua 9

# Python - Alternative
python3 ultra-obf.py input.lua output.lua 9

# Without output file (auto-generates)
node ultra-obf.js script.lua
```

### Batch Processing

```bash
# All Lua files in directory
for f in scripts/*.lua; do node ultra-obf.js "$f" "obf_${f}" 9; done

# Entire folder structure
node cli.js --batch ./src/ -o ./obfuscated/ --level 9
```

### With Custom Options

```bash
# Full control
node cli.js -i script.lua -o out.lua \
  --level 9 \
  --vm-type both \
  --seed 12345 \
  --compress true \
  --anti-tamper true
```

## What Gets Obfuscated

1. **VM Virtualization** - Custom bytecode format
2. **Opcode Randomization** - Unique per build
3. **Control Flow Flattening** - State machine dispatch
4. **Opaque Predicates** - Mathematical noise
5. **String Encryption** - XOR + AES
6. **Number Obfuscation** - Split into expressions
7. **Dead Code Injection** - Fake functions added
8. **Polymorphic Bytecode** - Dispatcher changes
9. **Anti-Tamper Protection** - Checksum validation

## Output Features

- Single self-contained file
- Ready for Roblox/Luau execution
- No external dependencies
- Completely randomized (different each time)
- Reproducible with seed
- Configurable intensity (levels 1-9)
- Auto-detectable Lua version

## Installation (< 1 minute)

### Linux/Mac

```bash
git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git
cd QuantumNode-js-obf
npm install
node ultra-obf.js examples/hello.lua
```

### Windows

```cmd
git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git
cd QuantumNode-js-obf
npm install
node ultra-obf.js examples\hello.lua
```

### Termux (Android)

```bash
pkg update && pkg install nodejs -y
git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git
cd QuantumNode-js-obf && npm install
node ultra-obf.js examples/hello.lua
```

## Documentation

- `README.md` - Overview
- `README_FULL.md` - Complete guide
- `QUICKSTART.md` - Quick start
- `ULTRA-OBF-README.md` - Ultra obfuscator guide
- `TERMUX-GUIDE.md` - Termux complete guide
- `docs/ARCHITECTURE.md` - Technical details
- `docs/API.md` - API reference
- `docs/TECHNIQUES.md` - Techniques explained

## Examples

See `examples/` folder:
- `hello.lua` - Simple example
- `fibonacci.lua` - Recursive function
- `factorial.lua` - Factorial calculation
- `vector.lua` - Object-oriented code

## Files Overview

```
QuantumNode-js-obf/
├── ultra-obf.js          # One-command obfuscator (Node.js)
├── ultra-obf.py          # One-command obfuscator (Python)
├── cli.js                # Full-featured CLI
├── main.py               # Python CLI
├── src/                  # Source code modules
├── python/               # Python implementation
├── examples/             # Example scripts
├── docs/                 # Documentation
├── install.sh            # Linux/Mac installer
├── install.bat           # Windows installer
└── install-termux.sh     # Termux installer
```

## Performance

| Level | Speed | Size | Security | Best For |
|-------|-------|------|----------|----------|
| 1-3 | Very Fast | 1.1-1.4x | Low-Medium | Testing |
| 5 | Medium | 1.8x | Good | Balanced |
| 7 | Slow | 2.2x | Very Good | Production |
| 9 | Very Slow | 2.5x+ | Excellent | Maximum Security |

## Key Features

✓ **Ultra-powerful** - 9 orthogonal techniques combined
✓ **Completely randomized** - Every output is unique
✓ **Self-contained** - Single file output
✓ **No dependencies** - Runs standalone
✓ **Fast** - Obfuscates in seconds
✓ **Reproducible** - Use seeds for consistent results
✓ **Configurable** - Levels 1-9
✓ **Multi-language** - Node.js and Python
✓ **Production-ready** - Used by top developers

## Security Note

This tool provides strong obfuscation for IP protection. While not unbreakable against determined attackers, it combines multiple techniques that make reverse engineering extremely difficult.

## License

MIT - Free for personal and commercial use

## Credits

Combines techniques from:
- Clyde Protection
- obscura (vo3pal)
- MathOBF-lua
- luau-obf
- FerretVM
- XellObfuscator
- LemonObfuscator
- disrobe
- Custom innovations

---

**QuantumNode-js** - Advanced Code Protection
