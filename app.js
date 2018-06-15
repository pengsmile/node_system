const express = require('express'),
    app = express(),
    path = require('path'),
    url = require('url'),
    session = require('express-session'),
    cookieParser = require('cookie-parser');
fs = require('fs')
bodyParser = require('body-parser'),
    router = require('./router')

app.use('/public/', express.static(path.join(__dirname, './public')))

app.engine('html', require('express-art-template'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
    // app.use(session({
    //     secret: 'hubwiz app', //secret的值建议使用随机字符串
    //     cookie: {
    //         // maxAge: 60 * 1000 * 30
    //         maxAge: 8000
    //     } // 过期时间（毫秒）
    // }));
app.use(session({
    secret: 'hubwiz app', //secret的值建议使用随机字符串
    cookie: { maxAge: 60 * 1000 * 30 } // 过期时间（毫秒）
}));
app.use(router)


app.listen(3000, () => {
    console.log('running...http://127.0.0.1:3000');
})