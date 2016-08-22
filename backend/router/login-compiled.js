var router = require("express").Router();
var config = require("./config");
var client = config.db,
    encrypt = config.encrypt;

router.post('/login', function (req, res) {
    var result = {
        userName: req.body.userName,
        password: encrypt(req.body.psword)
    };
    client.query("select * from users where userName=? and password=?", [result.userName, result.password], function (err, data) {
        if (err) {
            return res.json({
                code: 1,
                msg: err.toString()
            });
        }
        if (data[0]) {
            var token = encrypt({ userName: result.userName });
            res.json({
                code: 0,
                token: token,
                msg: "登录成功!"
            });
        } else {
            res.json({
                code: 1,
                msg: "用户名或密码错误!"
            });
        }
    });
});

router.post('/register', function (req, res) {
    var result = {
        userName: req.body.userName,
        password: req.body.psword,
        cfpsword: req.body.cfpsword
    };
    if (result.password != result.cfpsword) {
        return res.json({
            code: 1,
            msg: "两次密码输入不一致!"
        });
    }

    client.query("select * from users where userName=?", [result.userName], function (err, data) {
        if (err) {
            return res.json({
                code: 1,
                msg: err.toString()
            });
        }

        if (data[0]) {
            return res.json({
                code: 1,
                msg: "该用户名已存在!"
            });
        } else {
            client.query("insert into users(userName,password) values (?,?)", [result.userName, encrypt(result.password)], function (err, resp) {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: err.toString()
                    });
                }

                if (resp) {
                    var token = encrypt({ userName: result.userName });
                    return res.json({
                        code: 0,
                        token: token,
                        msg: "注册成功!"
                    });
                } else {
                    return res.json({
                        code: 1,
                        msg: "注册失败.请检查网络配置!"
                    });
                }
            });
        }
    });
});

module.exports = router;

//# sourceMappingURL=login-compiled.js.map