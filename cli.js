#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');
const glob = require('glob');
const MegaVMObfuscator = require('./src/obfuscator');

program
  .version('1.0.0')
  .description('QuantumNode-js Mega VM Obfuscator')
  .option('-i, --input <file>', 'Input Luau file')
  .option('-o, --output <file>', 'Output file')
  .option('--batch <dir>', 'Batch process directory')
  .option('--level <number>', 'Obfuscation level (1-9)', 5)
  .option('--vm-type <type>', 'VM type: stack, register, both', 'both')
  .option('--seed <number>', 'Random seed')
  .option('--compress', 'Enable compression', true)
  .option('--anti-tamper', 'Enable anti-tamper', true)
  .option('--strings', 'Encrypt strings', true)
  .option('--numbers', 'Obfuscate numbers', true)
  .option('--control-flow', 'Control flow flattening', true)
  .option('--dead-code', 'Dead code injection', true)
  .parse();

const options = program.opts();

async function obfuscateFile(inputFile, outputFile, opts) {
  try {
    if (!fs.existsSync(inputFile)) {
      console.error(chalk.red(`Error: Input file not found: ${inputFile}`));
      return false;
    }

    const source = fs.readFileSync(inputFile, 'utf8');
    const obfuscator = new MegaVMObfuscator({
      level: parseInt(opts.level) || 5,
      vmType: opts.vmType || 'both',
      seed: opts.seed ? parseInt(opts.seed) : undefined,
      compress: opts.compress !== false,
      antiTamper: opts.antiTamper !== false,
      encryptStrings: opts.strings !== false,
      obfuscateNumbers: opts.numbers !== false,
      controlFlow: opts.controlFlow !== false,
      deadCode: opts.deadCode !== false
    });

    console.log(chalk.blue(`Obfuscating: ${inputFile}`));
    const obfuscated = await obfuscator.obfuscate(source);

    fs.writeFileSync(outputFile, obfuscated, 'utf8');
    console.log(chalk.green(`Success: ${outputFile}`));
    console.log(chalk.gray(`Original size: ${source.length} bytes`));
    console.log(chalk.gray(`Obfuscated size: ${obfuscated.length} bytes`));
    console.log(chalk.gray(`Compression ratio: ${(obfuscated.length / source.length).toFixed(2)}x`));
    return true;
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    return false;
  }
}

async function main() {
  if (options.batch) {
    // Batch mode
    console.log(chalk.cyan('Batch mode enabled'));
    const pattern = path.join(options.batch, '**/*.lua');
    glob(pattern, async (err, files) => {
      if (err) {
        console.error(chalk.red(`Error: ${err}`));
        return;
      }

      console.log(chalk.blue(`Found ${files.length} files to obfuscate`));

      for (const file of files) {
        const relative = path.relative(options.batch, file);
        const outDir = options.output || './obfuscated';
        const outFile = path.join(outDir, relative);

        // Create output directory
        const outDirPath = path.dirname(outFile);
        if (!fs.existsSync(outDirPath)) {
          fs.mkdirSync(outDirPath, { recursive: true });
        }

        await obfuscateFile(file, outFile, options);
      }

      console.log(chalk.green('Batch obfuscation complete!'));
    });
  } else if (options.input && options.output) {
    // Single file mode
    await obfuscateFile(options.input, options.output, options);
  } else {
    console.log(chalk.yellow('Usage:'));
    console.log('  node cli.js -i input.lua -o output.lua --level 9');
    console.log('  node cli.js --batch ./scripts/ -o ./obfuscated/ --level 9');
    console.log('');
    console.log(chalk.yellow('Options:'));
    program.help();
  }
}

main().catch(console.error);
