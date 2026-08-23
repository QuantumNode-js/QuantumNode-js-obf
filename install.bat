@echo off
echo QuantumNode-js Mega VM Obfuscator - Installation Script (Windows)
echo ================================================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js not found. Please install from https://nodejs.org/
    exit /b 1
)

echo Node.js found: 
node --version

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python not found. Please install from https://www.python.org/
    exit /b 1
)

echo Python found: 
python --version

echo Installing npm dependencies...
call npm install

echo Installing Python dependencies...
call pip install -r requirements.txt

echo.
echo Installation complete!
echo.
echo Quick start:
echo   node cli.js -i examples/hello.lua -o out.lua --level 9
echo   python main.py -i examples/hello.lua -o out.lua --level 9
echo.
