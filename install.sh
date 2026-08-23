#!/bin/bash

echo "QuantumNode-js Mega VM Obfuscator - Installation Script"
echo "======================================================"

if command -v node &> /dev/null; then
    echo "Node.js found: $(node --version)"
else
    echo "Node.js not found. Installing..."
    if command -v apt &> /dev/null; then
        sudo apt update
        sudo apt install -y nodejs npm
    elif command -v pacman &> /dev/null; then
        sudo pacman -S nodejs npm
    elif command -v brew &> /dev/null; then
        brew install node
    else
        echo "Please install Node.js manually from https://nodejs.org/"
        exit 1
    fi
fi

if command -v python3 &> /dev/null; then
    echo "Python3 found: $(python3 --version)"
else
    echo "Python3 not found. Installing..."
    if command -v apt &> /dev/null; then
        sudo apt update
        sudo apt install -y python3 python3-pip
    elif command -v pacman &> /dev/null; then
        sudo pacman -S python python-pip
    elif command -v brew &> /dev/null; then
        brew install python3
    else
        echo "Please install Python3 manually from https://www.python.org/"
        exit 1
    fi
fi

echo "Installing npm dependencies..."
npm install

echo "Installing Python dependencies..."
pip3 install -r requirements.txt

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
