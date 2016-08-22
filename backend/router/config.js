var client=require("mysql").createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'root'
})
var DB_NAME='wolfman';
client.connect();
client.query("USE "+DB_NAME);

//加解密模块
var crypto=require("crypto");
var key="LowesYang";
function encrypt_token(obj){
    var plainText=JSON.stringify(obj);
    var encrypted="";
    var cipher=crypto.createCipher("aes192",key);
    encrypted+=cipher.update(plainText,'utf8','hex');
    encrypted+=cipher.final('hex');
    return encrypted;
}
function decrypt_token(str){
    var decrypted="";
    var decipher=crypto.createDecipher("aes192",key);
    decrypted+=decipher.update(str,'hex','binary');
    decrypted+=decipher.final('binary');
    return JSON.parse(decrypted);
}

module.exports={
    db:client,
    encrypt:encrypt_token,
    decrypt:decrypt_token
};