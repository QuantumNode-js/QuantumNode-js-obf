# QuantumNode-js Obfuscator - Guia Completa Termux

## Instalacion Rapida en Termux

### Paso 1: Actualizar Termux

```bash
pkg update -y
pkg upgrade -y
```

### Paso 2: Instalar Node.js

```bash
pkg install nodejs -y
node --version  # Verificar
```

### Paso 3: Instalar Python (Opcional)

```bash
pkg install python -y
python3 --version  # Verificar
```

### Paso 4: Clonar Repositorio

```bash
pkg install git -y
git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git
cd QuantumNode-js-obf
```

### Paso 5: Instalar Dependencias

```bash
npm install
pip install -r requirements.txt  # Si quieres usar Python
```

## Uso Inmediato

### Opcion 1: Ultra Obfuscador (Recomendado - UN COMANDO)

```bash
# Basico
node ultra-obf.js examples/hello.lua

# Con salida especifica
node ultra-obf.js examples/hello.lua salida.lua 9

# Con nivel custom (1-9)
node ultra-obf.js script.lua obfuscated.lua 5
```

### Opcion 2: CLI Completo

```bash
# Archivo single
node cli.js -i script.lua -o obfuscated.lua --level 9

# Batch (carpeta completa)
node cli.js --batch ./scripts/ -o ./obfuscated/ --level 9

# Con opciones
node cli.js -i script.lua -o out.lua --level 9 --vm-type both --seed 12345
```

### Opcion 3: Python

```bash
python3 ultra-obf.py examples/hello.lua
python3 ultra-obf.py script.lua output.lua 9
python3 main.py -i script.lua -o out.lua --level 9
```

## Ejemplo Practico Paso a Paso

### 1. Crear Script Simple

```bash
cat > myscript.lua << 'EOF'
local function multiply(a, b)
  return a * b
end

local x = 10
local y = 20
local resultado = multiply(x, y)
print("Resultado: " .. resultado)
EOF
```

### 2. Obfuscar en UN Comando

```bash
node ultra-obf.js myscript.lua myscript_obf.lua 9
```

### 3. Resultado

```bash
cat myscript_obf.lua
# OUTPUT: Archivo completamente obfuscado, imposible de entender
```

### 4. Ejecutar (Roblox/Luau)

```bash
# Copiar contenido de myscript_obf.lua a Roblox
# O ejecutar localmente con Luau
luau myscript_obf.lua
```

## Cmdos Completos para Copiar/Pegar

### Setup Completo (Desde Cero)

```bash
# Todo en uno
pkg update -y && pkg install nodejs git -y && git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git && cd QuantumNode-js-obf && npm install && node ultra-obf.js examples/hello.lua
```

### Obfuscar Archivos

```bash
# Un archivo
node ultra-obf.js input.lua output.lua 9

# Multiples archivos
for file in *.lua; do node ultra-obf.js "$file" "obf_${file}" 9; done

# Toda una carpeta
mkdir obfuscated
for file in scripts/*.lua; do node ultra-obf.js "$file" "obfuscated/$(basename $file)" 9; done
```

### Ver Resultado

```bash
# Ver archivo obfuscado
cat output.lua

# Ver tamaño
ls -lh input.lua output.lua

# Contar lineas
wc -l input.lua output.lua
```

## Niveles de Obfuscacion

```bash
# Minimo (rapido)
node ultra-obf.js script.lua out.lua 1

# Bajo
node ultra-obf.js script.lua out.lua 2

# Medio-Bajo
node ultra-obf.js script.lua out.lua 3

# Medio
node ultra-obf.js script.lua out.lua 5

# Fuerte
node ultra-obf.js script.lua out.lua 7

# Maximo (muy lento)
node ultra-obf.js script.lua out.lua 9
```

## Tips y Trucos

### Guardar Salida en Variable

```bash
OBFUSCADO=$(node ultra-obf.js script.lua)
echo "$OBFUSCADO" > output.lua
```

### Automatizar Proceso

```bash
#!/bin/bash
# Crear archivo: obfuscate.sh

for file in "$@"; do
  echo "Obfuscando $file..."
  node ultra-obf.js "$file" "obf_${file}" 9
  echo "Listo: obf_${file}"
done
```

```bash
# Usar
chmod +x obfuscate.sh
./obfuscate.sh script1.lua script2.lua script3.lua
```

### Upload a GitHub desde Termux

```bash
# Configurar Git
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Agregar archivos
git add obfuscated.lua
git commit -m "Add obfuscated code"
git push origin main
```

## Troubleshooting

### Error: command not found

```bash
# Reinstalar Node.js
pkg remove nodejs
pkg install nodejs -y

# Verificar
node --version
npm --version
```

### Error: Cannot find module

```bash
# Reinstalar dependencias
cd QuantumNode-js-obf
rm -rf node_modules
npm install
```

### Error: Permission denied

```bash
# Dar permisos
chmod +x ultra-obf.js cli.js main.py
chmod +x install-termux.sh
```

### Errores de Python

```bash
# Reinstalar Python
pkg remove python -y
pkg install python -y

# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall
```

### Falta espacio

```bash
# Ver espacio disponible
df -h

# Limpiar cache
pkg clean

# Borrar archivos temporales
rm -rf /data/data/com.termux/cache/*
```

## Casos de Uso

### 1. Proteger Scripts de Roblox

```bash
# Tu script
echo 'print("Hola")' > script.lua

# Obfuscar
node ultra-obf.js script.lua protected.lua 9

# Copiar a Roblox
cat protected.lua  # Copiar salida
```

### 2. Ofuscar Libreria Completa

```bash
# Crear carpeta con archivos
mkdir mylib
echo 'local M = {}' > mylib/init.lua
echo 'function M.hello() print("Hi") end' > mylib/utils.lua

# Obfuscar todos
for f in mylib/*.lua; do
  node ultra-obf.js "$f" "obf_${f}" 9
done
```

### 3. Batch Processing

```bash
# 100 archivos a la vez
mkdir scripts obfuscated
for i in {1..100}; do echo "print($i)" > scripts/script_$i.lua; done

for f in scripts/*.lua; do
  echo "Procesando: $f"
  node ultra-obf.js "$f" "obfuscated/$(basename $f)" 9
done

echo "Listos todos los archivos en ./obfuscated/"
```

## Rendimiento

### Velocidad de Obfuscacion

- Nivel 1-3: < 1 segundo (Archivo pequeño)
- Nivel 5: 1-5 segundos
- Nivel 7: 5-15 segundos
- Nivel 9: 10-30 segundos (Maximo)

### Aumento de Tamaño

- Nivel 1: 1.1x original
- Nivel 5: 1.5x original
- Nivel 9: 2.5x original

## Comandos Rapidos Cheatsheet

```bash
# Instalacion
pkg update && pkg install nodejs git && git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git && cd QuantumNode-js-obf && npm install

# Obfuscar (basico)
node ultra-obf.js input.lua output.lua 9

# Obfuscar (batch)
for f in *.lua; do node ultra-obf.js "$f" "obf_${f}" 9; done

# Ver resultado
cat output.lua | head -50

# Limpiar
rm output.lua && node ultra-obf.js input.lua output.lua 9
```

## Video Tutorial (Comandos)

```bash
# Paso 1: Abrir Termux
# (Ya lo hiciste)

# Paso 2: Copiar/Pegar esto
pkg update -y && pkg install nodejs -y

# Paso 3: Copiar/Pegar esto
git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git && cd QuantumNode-js-obf && npm install

# Paso 4: Crear archivo
echo 'print("Hello World")' > test.lua

# Paso 5: Obfuscar
node ultra-obf.js test.lua obfuscated.lua 9

# Paso 6: Ver resultado
cat obfuscated.lua

# LISTO! Tu codigo esta protegido
```

## Soporte

- GitHub Issues: https://github.com/QuantumNode-js/QuantumNode-js-obf/issues
- Documentacion: Ver carpeta `docs/`
- Ejemplos: Ver carpeta `examples/`

## Proximas Caracteristicas

- Compilador a bytecode directo
- Integracion con Roblox Studio
- GUI para Termux
- Soporte para mas lenguajes
- Ofuscacion en tiempo real

---

Hecho con amor para la comunidad QuantumNode-js. Mantenganse seguros!
