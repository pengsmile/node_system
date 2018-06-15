var crypto = require('crypto');
var CryptoJS = require("crypto-js");

/**
 * 加密方法
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
var encrypt = function(key, iv, data) {
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    var crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    crypted = new Buffer(crypted, 'binary').toString('base64');
    return crypted;
};

/**
 * 解密方法
 * @param key      解密的key
 * @param iv       向量
 * @param crypted  密文
 * @returns string
 */
var decrypt = function(key, iv, crypted) {
    crypted = new Buffer(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};


// var key = '751f621ea5c8f930';
// console.log('加密的key:', key.toString('hex'));
// var iv = '2624750004598718';
// var data = "Hello, nodejs. 演示aes-128-cbc加密和解密";
// var crypted = encrypt(key, iv, data);
// console.log("数据加密后:", crypted);
// var dec = decrypt(key, iv, crypted);
// console.log("数据解密后:", dec);


function cbcEncrypt(data, secretKey, iv) {
    secretKey = new Buffer(secretKey, "utf8");
    secretKey = crypto.createHash("md5").update(secretKey).digest("hex");
    secretKey = new Buffer(secretKey, "hex");
    var cipher = crypto.createCipheriv("aes-128-cbc", secretKey, iv),
        coder = [];
    coder.push(cipher.update(data, "utf8", "hex"));
    coder.push(cipher.final("hex"));
    return coder.join("");
}

function cbcEncryptBase(data, secretKey, iv) {
    secretKey = new Buffer(secretKey, "base64");
    secretKey = crypto.createHash("md5").update(secretKey).digest("hex");
    secretKey = new Buffer(secretKey, "hex");
    var cipher = crypto.createCipheriv("aes-128-cbc", secretKey, iv),
        coder = [];
    coder.push(cipher.update(data, "base64", "hex"));
    coder.push(cipher.final("hex"));
    return coder.join("");
}

function cbcDecrypt(data, secretKey, iv) {
    secretKey = Buffer(secretKey, "utf8");
    secretKey = crypto.createHash("md5").update(secretKey).digest("hex");
    secretKey = new Buffer(secretKey, "hex");
    var cipher = crypto.createDecipheriv("aes-128-cbc", secretKey, iv),
        coder = [];
    coder.push(cipher.update(data, "hex", "utf8"));
    coder.push(cipher.final("utf8"));
    return coder.join("");
}

function cbcDecryptBase(data, secretKey, iv) {
    secretKey = Buffer(secretKey, "base64");
    secretKey = crypto.createHash("md5").update(secretKey).digest("hex");
    secretKey = new Buffer(secretKey, "hex");
    var cipher = crypto.createDecipheriv("aes-128-cbc", secretKey, iv),
        coder = [];
    coder.push(cipher.update(data, "hex", "utf8"));
    coder.push(cipher.final("utf8"));
    return coder.join("");
}

// let key = CryptoJS.enc.Hex.parse('520Gg520');
// let iv = CryptoJS.enc.Hex.parse('SAASINSU');
// console.log('密钥：' + key + '----' + 'IV' + iv);

var ivs = new Buffer("520Gg520", "utf8").toString('hex');
var keys = new Buffer("SAASINSU", "utf8").toString('hex');
// var aes_cbc1 = cbcEncrypt('OA_PROD', key, iv);

// var aes_cbc2 = cbcDecrypt(aes_cbc1, key, iv);
// console.log(aes_cbc2);
let data = {
    DB_NAME: "OA_PROD",
    SP_NAME: "SP_TEST"
}
data = JSON.stringify(data);
// let aes = encrypt(keys, ivs, data);
// console.log(aes);
// let aesbd = decrypt(keys, ivs, aes);
// console.log(JSON.parse(aesbd));


var encrypt = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse('SAASINSU'), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
});
let d = encrypt.ciphertext.toString();

var encryptedHexStr = CryptoJS.enc.Hex.parse(d);
var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, CryptoJS.enc.Utf8.parse('SAASINSU'), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
});

console.log(decryptedData);
/*

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), 'SAASINSU');
console.dir(ciphertext);
// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'SAASINSU');
var plaintext = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log(plaintext); */