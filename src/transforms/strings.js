const crypto = require('crypto');

class StringEncryptor {
  constructor(config = {}) {
    this.config = config;
    this.encryptedStrings = new Map();
    this.encryptionKey = config.key || this.generateKey();
    this.algorithm = config.algorithm || 'xor';
  }

  generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  encryptString(str) {
    if (this.encryptedStrings.has(str)) {
      return this.encryptedStrings.get(str);
    }

    let encrypted;
    if (this.algorithm === 'xor') {
      encrypted = this.xorEncrypt(str);
    } else if (this.algorithm === 'aes') {
      encrypted = this.aesEncrypt(str);
    } else {
      encrypted = this.xorEncrypt(str);
    }

    this.encryptedStrings.set(str, encrypted);
    return encrypted;
  }

  xorEncrypt(str) {
    const key = this.encryptionKey;
    const bytes = Buffer.from(str, 'utf8');
    const keyBytes = Buffer.from(key, 'utf8');
    const encrypted = Buffer.alloc(bytes.length);

    for (let i = 0; i < bytes.length; i++) {
      encrypted[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
    }

    return encrypted.toString('hex');
  }

  aesEncrypt(str) {
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decryptString(encrypted) {
    if (this.algorithm === 'xor') {
      return this.xorDecrypt(encrypted);
    } else if (this.algorithm === 'aes') {
      return this.aesDecrypt(encrypted);
    }
    return encrypted;
  }

  xorDecrypt(encrypted) {
    const key = this.encryptionKey;
    const bytes = Buffer.from(encrypted, 'hex');
    const keyBytes = Buffer.from(key, 'utf8');
    const decrypted = Buffer.alloc(bytes.length);

    for (let i = 0; i < bytes.length; i++) {
      decrypted[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
    }

    return decrypted.toString('utf8');
  }

  aesDecrypt(encrypted) {
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  generateDecryptor() {
    const lines = [];
    lines.push('local function decrypt_string(encrypted, key)');
    if (this.algorithm === 'xor') {
      lines.push('  local result = ""');
      lines.push('  for i = 1, #encrypted, 2 do');
      lines.push('    local byte = tonumber(encrypted:sub(i, i+1), 16)');
      lines.push('    local key_byte = string.byte(key, (i/2) % #key + 1)');
      lines.push('    result = result .. string.char(byte ~ key_byte)');
      lines.push('  end');
      lines.push('  return result');
    }
    lines.push('end');
    return lines.join('\n');
  }

  obfuscateAST(ast) {
    this.walkAST(ast);
    return ast;
  }

  walkAST(node) {
    if (!node) return;
    
    if (node.type === 'string') {
      node.value = this.encryptString(node.value);
      node.encrypted = true;
    } else if (Array.isArray(node)) {
      node.forEach(n => this.walkAST(n));
    } else if (typeof node === 'object') {
      Object.values(node).forEach(n => this.walkAST(n));
    }
  }
}

module.exports = StringEncryptor;
