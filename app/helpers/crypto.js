const crypto = require('crypto');

exports.hashKEY = (key) => {
  return crypto
    .createHash('sha256')
    .update(key)
    .digest();
}

exports.encrypted = (key, cvv) => {
		let cipher = crypto.createCipheriv('aes-128-ecb', key, '');
		let crypted = cipher.update(cvv, 'utf8', 'binary');
		crypted += cipher.final('binary');
		crypted.trim();
		crypted = Buffer.from(crypted, 'binary').toString('base64');
		return crypted;
}

exports.decipher = (key, crypted) => {
    crypted = Buffer.from(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('aes-128-ecb', key, '');
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
  }
