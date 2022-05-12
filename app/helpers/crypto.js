const crypto = require('crypto');

const hashKEY = function(key, opt) {
	if (opt === 'base64' || opt === 'hex') {
		return crypto
			.createHash('sha256')
			.update(key, 'utf8')
			.digest(opt);
	} else if (opt === 'binary') {
		return crypto
			.createHash('sha256')
			.update(key)
			.digest();
	} else {
		console.log('Error en hashKEY');
	}
};

const encrypt = function(key, opt, iv, data) {
	if (opt === 'base64' || opt === 'hex') {
		let cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
		let crypted = cipher.update(data, 'utf8', opt);
		crypted += cipher.final(opt);
		crypted.trim();
		return crypted;
	} else if (opt === 'binary') {
		let cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
		let crypted = cipher.update(data, 'utf8', opt);
		crypted += cipher.final(opt);
		crypted.trim();
		crypted = Buffer.from(crypted, 'binary').toString('base64');
		return crypted;
	} else {
		console.log('Error en encrypt');
	}
};

const decrypt = function(key, opt, iv, crypted) {
	if (opt === 'base64' || opt === 'hex') {
		var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
		var decoded = decipher.update(crypted, opt, 'utf8');
		decoded += decipher.final('utf8');
		return decoded;
	} else if (opt === 'binary') {
		crypted = Buffer.from(crypted, 'base64').toString('binary');
		var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
		var decoded = decipher.update(crypted, opt, 'utf8');
		decoded += decipher.final('utf8');
		return decoded;
	} else {
		console.log('Error en decrypt');
	}
};


exports.crypto = {
  hashKEY,
  encrypt,
  decrypt
}
