var CryptoJS = require("crypto-js");

var keyStr = 'SAASINSU';
var ivHex = '520Gg520';
let plaintText = {
    DB_NAME: "OA_PROD",
    SP_NAME: "SP_TEST"
}
plaintText = JSON.stringify(plaintText);
let aes = getAES(plaintText, keyStr, ivHex);
console.log(aes);
let basedata = getDAes(aes, keyStr, ivHex);
// console.log(basedata);

function getAesString(data, key, iv) { //加密
    var key = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString(); //返回的是base64格式的密文
}

function getDAesString(encrypted, key, iv) { //解密
    var key = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function getAES(data, key, iv) { //加密
    // var key = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'; //密钥
    // var iv = '1234567812345678';
    var encrypted = getAesString(data, key, iv); //密文
    var encrypted1 = CryptoJS.enc.Utf8.parse(encrypted);
    return encrypted;
}

function getDAes(data, key, iv) { //解密
    // var key = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'; //密钥
    // var iv = '1234567812345678';
    var decryptedStr = getDAesString(data, key, iv);
    return decryptedStr;
}