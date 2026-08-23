# QuantumNode-js Mega VM Obfuscator - Quick Start

## Install

### On Linux/Mac

```bash
git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git
cd QuantumNode-js-obf
npm install
```

### On Termux (Android)

```bash
pkg update
pkg install git nodejs
git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git
cd QuantumNode-js-obf
npm install
```

## Usage

### Single File Obfuscation

```bash
node cli.js -i hello.lua -o obfuscated.lua --level 9
```

### Batch Processing

```bash
node cli.js --batch ./scripts/ -o ./obfuscated/ --level 9
```

### With Custom Options

```bash
node cli.js -i script.lua -o out.lua \
  --level 9 \
  --vm-type both \
  --seed 12345 \
  --compress true \
  --anti-tamper true
```

### Python Version

```bash
pip install -r requirements.txt
python3 main.py -i script.lua -o out.lua --level 9
```

## Obfuscation Levels

| Level | Features | Speed | Size |
|-------|----------|-------|------|
| 1 | String encryption | Fast | 1.1x |
| 2 | Number obfuscation | Fast | 1.2x |
| 3 | Dead code injection | Medium | 1.4x |
| 4 | Opaque predicates | Medium | 1.5x |
| 5 | Control flow flattening | Slow | 1.8x |
| 6 | Polymorphic transforms | Slow | 2.0x |
| 7 | Register VM | Very Slow | 2.2x |
| 8 | Stack VM | Very Slow | 2.3x |
| 9 | Maximum (all layers) | Extreme | 2.5x+ |

## Options

- `--level 1-9` : Obfuscation intensity (default: 5)
- `--vm-type stack|register|both` : VM architecture (default: both)
- `--seed <number>` : Randomization seed (default: random)
- `--compress true|false` : LZMA compression (default: true)
- `--anti-tamper true|false` : Anti-tamper protection (default: true)
- `--strings true|false` : String encryption (default: true)
- `--numbers true|false` : Number obfuscation (default: true)
- `--control-flow true|false` : Control flow flattening (default: true)
- `--dead-code true|false` : Dead code injection (default: true)

## Example

### Before

```lua
local function greet(name)
  return "Hello, " .. name
end

local msg = greet("World")
print(msg)
```

### After (Level 9)

Completely randomized bytecode, encrypted strings, flattened control flow, impossible to reverse engineer.

## Termux Commands

```bash
# Make CLI executable
chmod +x cli.js

# Run directly
./cli.js -i hello.lua -o obfuscated.lua --level 9

# Or use node
node cli.js -i hello.lua -o obfuscated.lua --level 9
```

## Troubleshooting

### Permission Denied

```bash
chmod +x cli.js
```

### Module Not Found

```bash
npm install
```

### Python Issues

```bash
pip3 install -r requirements.txt
python3 main.py -i hello.lua -o out.lua --level 9
```

## Support

For issues, create an issue on GitHub or check the docs folder.
