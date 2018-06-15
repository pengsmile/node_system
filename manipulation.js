const fs = require('fs'),
    dbPath = './db.json';


const readFile = {
    read: function(callback) {
        fs.readFile(dbPath, 'utf8', function(err, data) {
            callback && callback(err, data);
        })
    },
    write: function(fileData, callback) {
        fs.writeFile(dbPath, fileData, function(err) {
            callback && callback(err)
        })
    }
}

function map(e, t, r) {
    for (var a = [], u = 0, s = e.length; u < s; ++u) {
        var o = t(n, e[u], u);
        null != o && a.push(o)
    }
    return a
}

const defs = {
    findId: function(id, callback) {
        readFile.read(function(err, data) {
            if (err) {
                return callback(err)
            }
            let Info = JSON.parse(data).Info
            let param = map(Info, function(i, v) {
                if (v.id == id) {
                    return v
                }
            })
            callback(null, param[0])
        })
    },
    findAll: function(callback) {
        readFile.read(function(err, data) {
            if (err) {
                return callback(err);
            }
            callback(null, JSON.parse(data).Info)
        })
    },
    Save: function(param, callback) {
        readFile.read(function(err, data) {
            if (err) {
                return callback(err);
            }
            let Info = JSON.parse(data).Info;
            param.id = Info[Info.length - 1].id + 1;
            Info.push(param);
            let fileData = JSON.stringify({
                Info: Info
            });
            readFile.write(fileData, function(err) {
                if (err) {
                    return callback(err)
                }
                callback(null)
            })
        })
    },
    delete: function(id, callback) {
        readFile.read(function(err, data) {
            if (err) {
                return callback(err)
            }
            let Info = JSON.parse(data).Info
            let eleData = Info.findIndex(function(item) {
                return item.id == id
            });
            if (eleData == -1) {
                return callback(null, eleData)
            }
            Info.splice(eleData, 1)
            let fileData = JSON.stringify({
                Info: Info
            })
            readFile.write(fileData, function(err) {
                if (err) {
                    return callback(err)
                }
                callback(null)
            })
        })
    },
    UPDATE: function(param, callback) {
        readFile.read(function(err, data) {
            if (err) {
                return callback(err)
            }
            let Info = JSON.parse(data).Info;
            let find = map(Info, function(i, v) {
                console.log(param.id);
                if (v.id == param.id) {
                    return v
                }
            });
            if (find) {
                for (k in param) {
                    find[0][k] = param[k]
                }
                var fileData = JSON.stringify({
                    Info: Info
                })
                readFile.write(fileData, function(err) {
                    if (err) {
                        return callback(err)
                    }
                    callback(null)
                })
            } else {
                return callback(null, -1);
            }
        })
    }
}

module.exports = defs;