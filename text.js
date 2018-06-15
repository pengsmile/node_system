var crypto = require('crypto');

var b = new Buffer('520Gg520');
console.log(b);



// function Encrypt(plainText, workingKey) {
//     var m = crypto.createHash('md5');
//     m.update(workingKey);
//     var key = m.digest();
//     var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
//     var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
//     var encoded = cipher.update(plainText, 'utf8', 'hex');
//     encoded += cipher.final('hex');
//     return encoded;
// };

function Encrypt(plainText, workingKey) {
    var m = crypto.createHash('md5');
    m.update(workingKey);
    var key = m.digest();
    var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    var encoded = cipher.update(plainText, 'utf8', 'hex');
    encoded += cipher.final('hex');
    return encoded;
};

console.log(Encrypt('OA_PROD', 'SAASINSU'))

function Decrypt(encText, workingKey) {
    var m = crypto.createHash('md5');
    m.update(workingKey)
    var key = m.digest('binary');
    var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decoded = decipher.update(encText, 'hex', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};
console.log(Decrypt('OA_PROD', 'SAASINSU'))