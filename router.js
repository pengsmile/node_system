const express = require('express'),
    path = require('path'),
    url = require('url'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    Manipulation = require('./manipulation'),
    request = require('request'),
    Crypto = require('crypto');

var CryptoJS = require("crypto-js");
router.get('/', (req, res) => {
    // console.log(req.session);

    fs.readFile('./db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Server Err')
        }
        res.cookie('heheheh', 'name1=value1&name2=value2', {
            maxAge: 5000,
            path: '/',
            httpOnly: true
        });
        res.render('index.html', {
            info: JSON.parse(data).Info
        })
    })

    // var method = req.method.toUpperCase();


})
router.post('/INSERT', (req, res) => {
    let param = req.body
    let ref = validate('INSERT', 'SP_INSERT', param);

    var proxy_url = 'http://139.196.108.200/BFInsuredPlatInterface/';

    var keyStr = 'SAASINSU';
    var ivHex = '520Gg520';
    let plaintText = {
        DB_NAME: "OA_PROD",
        SP_NAME: "SP_TEST"
    }
    plaintText = JSON.stringify(plaintText);
    let aes = encryptByDESModeCBC(plaintText, keyStr, ivHex);
    console.log(aes);
    var options = {
        url: proxy_url,
        method: 'POST',
        json: true,
        body: aes,
        // headers: {
        //     "Content-Type": 'application/x-www-form-urlencoded'
        // },
        headers: {
            "content-type": "application/json"
        }
    };

    function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            // console.log('------接口数据------', data);
            // let basedata = decryptByDESModeCBC(data, keyStr, ivHex);
            // let basedata = getDAes(data, keyStr, ivHex);
            res.json(data)
        }
    }

    request(options, callback);


    // if (ref.m && ref.SP_NAME) {
    //     let submitdata = separate(param);

    //     Manipulation.Save(submitdata, function(err) {
    //         if (err) {
    //             res.status(500).send('Server Error')
    //         } else {
    //             res.send(ret(0, '添加成功'));
    //         }
    //     });
    // } else {
    //     let retu = ret(99, '缺少参数');
    //     res.send(retu);
    // }

})

router.post('/DEL', (req, res) => {
    let param = req.body
    let ref = validate('DELETE', 'SP_DELETE', param);
    if (ref.SP_NAME && ref.m) {
        let submitdata = separate(param);
        Manipulation.delete(submitdata.id, function(err, data) {
            if (err) {
                res.status(500).send('Server Error')
            } else {
                if (data == -1) {
                    return res.send(ret(99, '未找到数据'));
                }
                res.send(ret(0, '删除成功'));
            }
        })
    } else {
        let retu = ret(99, '缺少参数');
        res.send(retu);
    }
})

router.post('/UPDATE', (req, res) => {

    let param = req.body
    let ref = validate('UPDATE', 'SP_UPDATE', param);
    if (ref.SP_NAME && ref.m) {
        let submitdata = separate(param);
        Manipulation.UPDATE(submitdata, function(err, data) {
            if (err) {
                res.status(500).send('Server Error')
            } else {
                if (data == -1) {
                    return res.send(ret(99, '未找到数据'));
                }
                res.send(ret(0, '更新成功'));
            }
        })
    } else {
        let retu = ret(99, '缺少参数');
        res.send(retu);
    }
})

router.post('/SEARCH', (req, res) => {
    let param = req.body
    let ref = validate('SEARCH', 'SP_SEARCH', param);
    if (ref.SP_NAME && ref.m) {
        let submitdata = separate(param);
        Manipulation.findId(submitdata.id, function(err, data) {
            if (err) {
                res.status(500).send('Server Error')
            } else {
                if (data) {
                    res.send([data]);
                } else {
                    res.send([]);
                }
            }
        })
    } else {
        let retu = ret(99, '缺少参数');
        res.send(retu);
    }
})

function ret(status, message) {
    status = status || 0;
    message = message || ""
    return {
        RETURN_CODE: status,
        RETURN_MESSAGE: message
    }
}

function separate(param) {
    let Submitparam = {},
        red = {}
    for (n in param) {
        n === 'm' ? red[n] = param[n] : n == 'SP_NAME' ? red[n] = param[n] : Submitparam[n] = param[n];
    }
    return Submitparam

}

function validate(m, sp_name, param) {
    let M, SP_NAME;
    for (data in param) {
        if (data === 'm' && param[data] === m) {
            M = param[data]
        }
        if (data === 'SP_NAME' && param[data] === sp_name) {
            SP_NAME = param[data]
        }
    }
    return {
        m: M,
        SP_NAME: SP_NAME
    }
}

function getAesString(data, key, iv) {
    var key = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // console.log(encrypted.ciphertext.toString());
    // console.log(encrypted.toString());
    return encrypted.toString() //返回base64格式密文
}

function getDAesString(encrypted, key, iv) {
    var key = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var encryptedHexStr = CryptoJS.enc.Hex.parse(encrypted);
    console.log(encryptedHexStr);
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    console.log(decrypted)
        // return decrypted.toString(CryptoJS.enc.Utf8);
}

function getAES(data, key, iv) {
    var encrypted = getAesString(data, key, iv); //密文
    var encrypted1 = CryptoJS.enc.Utf8.parse(encrypted);
    return encrypted1;
}

function getDAes(data, key, iv) {
    var decryptedStr = getDAesString(data, key, iv);
    return decryptedStr;
}






function decryptByDESModeCBC(ciphertext2, key, iv) {
    // console.log(ciphertext2);
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var ivHex = CryptoJS.enc.Utf8.parse(iv);
    // direct decrypt ciphertext
    var decrypted = CryptoJS.AES.decrypt(CryptoJS.enc.Hex.parse(ciphertext2), keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    console.log(decrypted)
    return decrypted.toString(CryptoJS.enc.Utf8);
}

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

function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        // if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
        // guid += "-";
    }
    return guid;
}
module.exports = router