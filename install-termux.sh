#!/data/data/com.termux/files/usr/bin/bash

echo "QuantumNode-js Mega VM Obfuscator - Termux Installation"
echo "========================================================"

echo "Updating packages..."
pkg update -y

echo "Installing Node.js..."
pkg install -y nodejs

echo "Installing Python..."
pkg install -y python

echo "Installing git..."
pkg install -y git

echo "Cloning repository..."
git clone https://github.com/QuantumNode-js/QuantumNode-js-obf.git
cd QuantumNode-js-obf

echo "Installing npm dependencies..."
npm install

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Making CLI executable..."
chmod +x cli.js
chmod +x main.py

echo ""
echo "Installation complete!"
echo ""
echo "Quick start:"
echo "  node cli.js -i examples/hello.lua -o out.lua --level 9"
echo "  python3 main.py -i examples/hello.lua -o out.lua --level 9"
echo ""
echo "For more info, run: cat QUICKSTART.md"
echo ""
