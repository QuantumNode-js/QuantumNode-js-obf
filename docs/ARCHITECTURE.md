# Architecture: Mega VM Obfuscator

## Overview

This obfuscator combines 9 techniques from the following sources:

1. Clyde Protection - Stack/Register VM, Polymorphic Dispatch
2. obscura (vo3pal) - Control Flow Flattening, Opaque Predicates
3. MathOBF-lua - VM Bytecode, Custom Opcodes
4. luau-obf - Multi-stage IR pipeline (AST>HIR>MIR>LIR)
5. FerretVM - Transform engine
6. XellObfuscator - 10-stage pipeline with Darklua
7. LemonObfuscator - Bytecode compression
8. disrobe - Detection/analysis patterns
9. Custom Enhancements - Polymorphic VM dispatch, per-build opcode randomization

## Pipeline

```
Source Code (Luau)
    |
    v
[1] Parser > AST
    |
    v
[2] Semantic Analysis (scope resolution, type stripping)
    |
    v
[3] Transform Passes (in configurable order):
    - Control Flow Flattening
    - Opaque Predicates
    - String Encryption
    - Number Obfuscation
    - Dead Code Injection
    - Polymorphic Transforms
    |
    v
[4] IR Lowering (AST > Bytecode instructions)
    |
    v
[5] Opcode Randomization (seed-based, per-build)
    |
    v
[6] VM Compilation (Stack-based AND/OR Register-based)
    |
    v
[7] Bytecode Encryption (XOR + optional AES)
    |
    v
[8] Compression (LZMA)
    |
    v
[9] VM Injection (generate interpreter)
    |
    v
[10] Anti-Tamper Wrapping
    |
    v
Obfuscated Luau Output (self-contained script)
```

## 9 Obfuscation Layers Explained

### Layer 1: VM Virtualization

From: Clyde, MathOBF, luau-obf, FerretVM

Stack-based VM:
- PUSH, POP, LOAD, STORE operations
- Global/local variable access via stack indices
- Function calls via CALL opcode

Register-based VM:
- Fixed number of registers (256)
- MOVE, LOADK, ARITH operations
- Optimized for constant folding

Output: Custom bytecode that looks nothing like Luau

### Layer 2: Opcode Randomization

From: Clyde, XellObfuscator, disrobe analysis

- Each build gets unique opcode numbering
- Seed-based: reproducible with same seed
- Opcode table shuffled: ADD might be 0x42, not 0x01
- VM must include mapping to execute correctly

### Layer 3: Control Flow Flattening

From: obscura, XellObfuscator

- All branches converted to computed GOTO
- Hidden dispatch table
- Loop/conditional logic becomes state machine
- Significantly increases code size

### Layer 4: Opaque Predicates

From: obscura

- Insert branches that always/never execute
- Based on mathematical properties
- Adds noise to control flow analysis

### Layer 5: String Encryption

From: Clyde, obscura, XellObfuscator

- Strings stored encrypted in constant pool
- Runtime decryption on access
- Algorithm: XOR + optional AES
- Key derived from seed

### Layer 6: Number Obfuscation

From: obscura

- Constants split into arithmetic expressions
- Evaluated at compile-time or runtime

### Layer 7: Dead Code Injection

From: obscura

- Random functions that do nothing
- Fake variable assignments
- Unreachable code blocks
- Increases file size, confuses analyzers

### Layer 8: Polymorphic Bytecode

From: Clyde, XellObfuscator

- Dispatcher uses different dispatch techniques per build
- Constant pool format changes
- Instruction encoding varies

### Layer 9: Anti-Tamper Protection

From: Clyde, XellObfuscator

- Checksum validation
- Bytecode integrity checks
- VM metadata validation
- Detects modifications at runtime
