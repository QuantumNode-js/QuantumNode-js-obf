# QuantumNode-js Ultra Obfuscator - One Command All-in-One

Esta es la version MEGA COMPLETA que combina TODOS los 9 ofuscadores en UN SOLO COMANDO.

## Uso Instantaneo

### Node.js (Recomendado)

```bash
node ultra-obf.js input.lua
node ultra-obf.js input.lua output.lua 9
node ultra-obf.js hello.lua obfuscated.lua 9
```

### Python

```bash
python3 ultra-obf.py input.lua
python3 ultra-obf.py input.lua output.lua 9
python3 ultra-obf.py hello.lua obfuscated.lua 9
```

### Termux

```bash
pkg install nodejs
node ultra-obf.js hello.lua out.lua 9

# O con Python
pkg install python3
python3 ultra-obf.py hello.lua out.lua 9
```

## Lo que Hace en UN Comando

1. Genera VM personalizada (Stack + Register)
2. Randomiza TODOS los opcodes (seed-based)
3. Encripta TODAS las strings (XOR)
4. Obfusca TODOS los numeros (expresiones)
5. Inyecta dead code (fake functions)
6. Aplana control flow (state machine)
7. Genera dispatcher polimorfico
8. Agrega anti-tamper check
9. Output auto-ejecutable en Roblox/Luau

## Resultado

Archivo completamente obfuscado en UN ARCHIVO que:
- Es ejecutable directamente
- Contiene todo el codigo combinado
- No necesita funciones ni modulos
- Es imposible de reversear
- Totalmente randomizado cada vez

## Ejemplo

```bash
# Input: hello.lua
local function add(a, b)
  return a + b
end
print(add(5, 3))

# Command
node ultra-obf.js hello.lua obfuscated.lua 9

# Output: obfuscated.lua (completamente obfuscado, auto-ejecutable)
```

## Features

- Un solo archivo de salida
- Sin dependencias externas
- Sin funciones helper
- Todo embebido en el bytecode
- Lista para ejecutar en Roblox
- Completamente randomizado
- Seed reproducible
- Nivel 1-9 configurable
