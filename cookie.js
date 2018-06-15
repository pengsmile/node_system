var express = require('express');
var session = require('express-session');
var app = express();

app.use(session({
    secret: 'hubwiz app', //secret的值建议使用随机字符串
    cookie: { maxAge: 60 * 1000 * 30 } // 过期时间（毫秒）
}));
app.get('/', function(req, res) {
    console.log(req.session);
    if (req.session.sign) { //检查用户是否已经登录
        console.log(req.session); //打印session的值
        res.send('welecome <strong>' + req.session.name + '</strong>, 欢迎你再次登录');
    } else { //否则展示index页面
        req.session.sign = true;
        req.session.name = '汇智网';
        // console.log(req.session);
        res.end('欢迎登陆！');
    }
});
app.listen(9000);