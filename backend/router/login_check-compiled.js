var router = require("express").Router();
var config = require("./config");
var client = config.db,
    decrypt = config.decrypt;

router.all('*', function (req, res, next) {
    var token = req.body.token;
    if (token == "login" || token == "register") return next();
    try {
        var decoded = decrypt(token);
    } catch (err) {
        return res.json({
            code: -1,
            msg: "身份认证失败，请重新登录!"
        });
    }

    var userName = decoded.userName;
    client.query("select * from users where userName=?", [userName], function (err, data) {
        if (err) {
            return res.json({
                code: 1,
                msg: err.toString()
            });
        }
        if (data[0]) {
            req.token = token; //保存在req对象中
            next();
        } else {
            return res.json({
                code: -1,
                msg: "身份认证失败，请重新登录!"
            });
        }
    });
});

module.exports = router;

//# sourceMappingURL=login_check-compiled.js.map