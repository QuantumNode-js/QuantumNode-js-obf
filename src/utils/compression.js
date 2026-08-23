const crypto = require('crypto');
const zlib = require('zlib');

class Compressor {
  static compress(data) {
    return new Promise((resolve, reject) => {
      zlib.deflate(Buffer.from(data), (err, compressed) => {
        if (err) reject(err);
        else resolve(compressed.toString('hex'));
      });
    });
  }

  static decompress(data) {
    return new Promise((resolve, reject) => {
      zlib.inflate(Buffer.from(data, 'hex'), (err, decompressed) => {
        if (err) reject(err);
        else resolve(decompressed.toString());
      });
    });
  }
}

class AntiTamper {
  constructor(config = {}) {
    this.config = config;
    this.checksum = null;
  }

  generateChecksum(bytecode) {
    this.checksum = crypto.createHash('sha256').update(bytecode).digest('hex');
    return this.checksum;
  }

  verifyChecksum(bytecode) {
    const hash = crypto.createHash('sha256').update(bytecode).digest('hex');
    return hash === this.checksum;
  }

  generateAntiTamperCode(checksum) {
    return `
local function verify_integrity()
  local expected = "${checksum}"
  local current = "verification_code_here"
  if current ~= expected then
    error("Code has been tampered with")
  end
end
verify_integrity()
    `;
  }
}

module.exports = {
  Compressor,
  AntiTamper
};
