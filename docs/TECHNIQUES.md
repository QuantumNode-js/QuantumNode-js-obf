# Obfuscation Techniques - Deep Dive

## Layer 1: VM Virtualization

The core technique. Code is compiled to bytecode for a custom virtual machine.

**Stack-based VM:**
- Classic Lua/Luau bytecode format
- Instructions: PUSH, POP, LOAD, STORE, CALL, RETURN
- All data on stack
- 32-bit instructions with operands

**Register-based VM:**
- Modern bytecode format (like Lua 5.3+)
- Fixed registers (256 available)
- Instructions: MOVE, LOADK, ARITH, CALL
- More compact than stack VM

**Impact:** Code completely unrecognizable as original Luau

## Layer 2: Opcode Randomization

Every build gets unique opcode numbering.

**How it works:**
1. Start with 30+ standard opcodes (ADD=0x05, SUB=0x06, etc.)
2. Shuffle using seeded RNG
3. Each build has different numbering
4. Only the VM knows the mapping

**Example:**
```
Original:  ADD=0x05, SUB=0x06, MUL=0x07
Build 1:   ADD=0x42, SUB=0x1D, MUL=0x88
Build 2:   ADD=0x73, SUB=0x15, MUL=0x3F
```

**Impact:** Attackers can't compare bytecode between different obfuscated versions

## Layer 3: Control Flow Flattening

Transforms all branches into a state machine with hidden dispatcher.

**Original:**
```lua
if x > 5 then
  print("big")
else
  print("small")
end
```

**Flattened:**
```lua
local state = 1
while state ~= 0 do
  if state == 1 then
    if x > 5 then state = 2 else state = 3 end
  elseif state == 2 then
    print("big")
    state = 0
  elseif state == 3 then
    print("small")
    state = 0
  end
end
```

**Impact:** Original branching logic hidden in state machine

## Layer 4: Opaque Predicates

Adds branches that always or never execute, based on mathematical properties.

**Examples:**
```lua
if (x * 2) % 2 == 0 then -- Always true
  real_code()
else
  fake_code()
end

if 1 + 1 == 2 and condition then -- Always evaluates condition
  code()
end
```

**Impact:** Adds noise to control flow analysis

## Layer 5: String Encryption

All strings encrypted at compile time, decrypted at runtime.

**Algorithm:**
```
Original: "Hello World"
Key: SHA256(seed)
Encrypted (XOR): 3A 2B 1C 4D 5E (hex)
Stored as: local S="3A2B1C4D5E"
Runtime: decrypt_string("3A2B1C4D5E", key) -> "Hello World"
```

**Impact:** Strings not readable in source

## Layer 6: Number Obfuscation

Numbers split into arithmetic expressions.

**Example:**
```lua
Original: 42
Obfuscated: (20 + 22) or (50 - 8) or (21 * 2)
```

**Complex expressions:**
```lua
((10 + 5) * 2) - (6 / 2) + 3
```

**Impact:** Hard to find magic numbers

## Layer 7: Dead Code Injection

Adds fake functions, variables, and unreachable code.

**Example:**
```lua
local _x = 12345
local _y = 67890

local function _dummy_func_1()
  local z = _x + _y
  return z * 2
end

if false then
  print("This never runs")
end
```

**Impact:** Increases file size, confuses analysis

## Layer 8: Polymorphic Bytecode

Dispatcher implementation changes per build.

**Three dispatcher types:**

**Switch-based:**
```lua
while true do
  if op == OPCODES.ADD then ... 
  elseif op == OPCODES.SUB then ...
  end
end
```

**Indirect dispatch (table):**
```lua
local handlers = {
  [OPCODES.ADD] = function() ... end,
  [OPCODES.SUB] = function() ... end,
}
local handler = handlers[op]
if handler then handler() end
```

**Threading:**
```lua
local pc = 1
while pc <= #bytecode do
  local instr = bytecode[pc]
  -- execute
  pc = pc + 1
end
```

**Impact:** VM implementation varies, harder to reverse engineer

## Layer 9: Anti-Tamper Protection

Checksum validation to detect modifications.

**How it works:**
```lua
local EXPECTED_CHECKSUM = "a7f3e8d2c9b1..."

local function verify_integrity()
  local current = sha256(bytecode)
  if current ~= EXPECTED_CHECKSUM then
    error("Code has been modified")
  end
end

verify_integrity()
-- Rest of code
```

**Impact:** Prevents tampering and reinjection attacks

## Combining All Layers

At level 9, all techniques are applied multiple times:

1. String encryption (1st pass)
2. Number obfuscation (1st pass)
3. Dead code injection (1st pass)
4. Opaque predicates (1st pass)
5. Control flow flattening (1st pass)
6. Polymorphic transforms (1st pass)
7. Repeat passes 1-6 two more times (3 total)
8. VM compilation (Stack and Register)
9. Opcode randomization
10. Bytecode encryption (XOR)
11. Anti-tamper wrapping
12. LZMA compression (optional)

**Result:** Completely unrecognizable output

## Security Analysis

### Strengths

1. **Multiple orthogonal techniques** - No single weak point
2. **Per-build randomization** - Each output unique
3. **Bytecode virtualization** - Not standard Lua format
4. **Layered encryption** - Strings and bytecode encrypted
5. **Control flow hidden** - State machine dispatch
6. **Opcode variability** - Different numbering per build

### Limitations

1. **Observable runtime behavior** - Attackers can hook function calls
2. **VM can be reverse-engineered** - With effort and skills
3. **Performance overhead** - 10-20x slower than original
4. **Not suitable for client-side secrets** - Runtime inspection possible
5. **Decompilers emerging** - Some tools can partially decompile

### Attack Scenarios

**Scenario 1: Static analysis**
- Attacker: Reads obfuscated source
- Defense: All techniques applied
- Result: Cannot understand logic

**Scenario 2: Bytecode decompilation**
- Attacker: Extracts bytecode, decompiles
- Defense: Custom VM bytecode format
- Result: Decompiler doesn't work (non-standard)

**Scenario 3: Runtime hooking**
- Attacker: Hooks print(), calls, etc.
- Defense: None (inherent limitation)
- Result: Can observe behavior
- Mitigation: Don't put secrets in observable functions

**Scenario 4: VM reverse engineering**
- Attacker: Reverse engineers VM
- Defense: Polymorphic dispatch changes per build
- Result: Very difficult, requires sophisticated tools

## Best Practices

1. Use level 9 for sensitive code
2. Use consistent seed during development
3. Don't put real secrets in obfuscated code
4. Combine with server-side validation
5. Use anti-tamper for detection
6. Periodically reobfuscate with new seeds

## References

- Clyde Protection: Stack/Register VM implementation
- obscura: Control flow flattening algorithm
- MathOBF-lua: Bytecode instruction encoding
- luau-obf: Multi-stage IR pipeline
- XellObfuscator: Polymorphic dispatcher techniques
- Research: "Code Obfuscation and Evasion" academic papers
