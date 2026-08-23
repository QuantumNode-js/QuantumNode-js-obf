const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class NameGenerator {
  constructor(config = {}) {
    this.config = config;
    this.nameMap = new Map();
    this.seed = config.seed || Math.random();
    this.prefix = config.prefix || '_';
  }

  generateName(original) {
    if (this.nameMap.has(original)) {
      return this.nameMap.get(original);
    }

    const generated = this.createRandomName();
    this.nameMap.set(original, generated);
    return generated;
  }

  createRandomName() {
    const patterns = [
      () => this.randomChars(8, 'lI1|_'),
      () => this.randomChars(10, 'O0o_'),
      () => this.randomChars(12, 'abcdefghijklmnopqrstuvwxyz'),
      () => this.randomChars(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_')
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return this.prefix + pattern();
  }

  randomChars(length, charset) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
  }

  getMapping() {
    const mapping = {};
    this.nameMap.forEach((value, key) => {
      mapping[key] = value;
    });
    return mapping;
  }
}

class Encoder {
  static encodeHex(str) {
    return Buffer.from(str).toString('hex');
  }

  static decodeHex(hex) {
    return Buffer.from(hex, 'hex').toString();
  }

  static encodeBase64(str) {
    return Buffer.from(str).toString('base64');
  }

  static decodeBase64(b64) {
    return Buffer.from(b64, 'base64').toString();
  }

  static generateHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

class CryptoUtils {
  static xor(data, key) {
    const keyBuf = Buffer.from(key);
    const dataBuf = Buffer.from(data);
    const result = Buffer.alloc(dataBuf.length);

    for (let i = 0; i < dataBuf.length; i++) {
      result[i] = dataBuf[i] ^ keyBuf[i % keyBuf.length];
    }

    return result.toString('hex');
  }

  static unxor(data, key) {
    return this.xor(data, key); // XOR is symmetric
  }
}

module.exports = {
  NameGenerator,
  Encoder,
  CryptoUtils
};
