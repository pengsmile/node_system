　　
var CryptoJS = require("crypto-js");
let plaintText = {
    DB_NAME: "OA_PROD",
    SP_NAME: "SP_TEST"
}
plaintText = JSON.stringify(plaintText);
var keyStr = 'SAASINSU'; // 一般key为一个字符串  
var ivHex = '520Gg520';

let encrybase = encryptByDESModeCBC(plaintText, keyStr, ivHex);
console.log(encrybase)
    // let dr = decryptByDESModeCBC(encrybase, keyStr, ivHex);
    // console.log(dr);

function encryptByDESModeCBC(message, key, iv) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var ivHex = CryptoJS.enc.Utf8.parse(iv);
    encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
}


function decryptByDESModeCBC(ciphertext2, key, iv) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var ivHex = CryptoJS.enc.Utf8.parse(iv);
    // direct decrypt ciphertext
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Hex.parse(ciphertext2)
    }, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}



function Cryptos() {
    //参看官网文档， AES方法是支持AES - 128、 AES - 192 和AES - 256 的， 加密过程中使用哪种加密方式取决于传入key的类型， 否则就会按照AES - 256 的方式加密。　　 CryptoJS supports AES - 128, AES - 192, and AES - 256. It will pick the variant by the size of the key you pass in .If you use a passphrase, then it will generate a 256 - bit key.　　由于Java就是按照128bit给的， 但是由于是一个字符串， 需要先在前端将其转为128bit的才行。
    //最开始以为使用CryptoJS.enc.Hex.parse就可以正确地将其转为128bit的key。 但是不然...
    //经过多次尝试， 需要使用CryptoJS.enc.Utf8.parse方法才可以将key转为128bit的。 好吧， 既然说了是多次尝试， 那么就不知道原因了， 后期再对其进行更深入的研究。　　 // 字符串类型的key用之前需要用uft8先parse一下才能用
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv = CryptoJS.enc.Utf8.parse(ivHex);
    //由于后端使用的是PKCS5Padding， 但是在使用CryptoJS的时候发现根本没有这个偏移， 查询后发现PKCS5Padding和PKCS7Padding是一样的东东， 使用时默认就是按照PKCS7Padding进行偏移的。　　 // 加密
    var encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
        iv: iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    // //由于CryptoJS生成的密文是一个对象， 如果直接将其转为字符串是一个Base64编码过的， 在encryptedData.ciphertext上的属性转为字符串才是后端需要的格式。　　
    var encryptedBase64Str = encryptedData.toString();
    // // 需要读取encryptedData上的ciphertext.toString()才能拿到跟Java一样的密文
    var encryptedStr = encryptedData.ciphertext.toString();
    // //由于加密后的密文为128位的字符串， 那么解密时， 需要将其转为Base64编码的格式。
    // //那么就需要先使用方法CryptoJS.enc.Hex.parse转为十六进制， 再使用CryptoJS.enc.Base64.stringify将其变为Base64编码的字符串， 此时才可以传入CryptoJS.AES.decrypt方法中对其进行解密。　　 // 拿到字符串类型的密文需要先将其用Hex方法parse一下
    var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedStr);

    // // 将密文转为Base64的字符串
    // // 只有Base64类型的字符串密文才能对其进行解密
    var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);　　
    // //使用转为Base64编码后的字符串即可传入CryptoJS.AES.decrypt方法中进行解密操作。　　 // 解密
    var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
        iv: iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });　　
    // //经过CryptoJS解密后， 依然是一个对象， 将其变成明文就需要按照Utf8格式转为字符串。　　 // 解密后，需要按照Utf8的方式将明文转位字符串
    var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
    console.log(decryptedStr); // 'aaaaaaaaaaaaaaaa'
}