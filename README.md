# Wolfman
使用纯Html5开发的在线狼人游戏，非Flash版本

## 技术选型
* 前端:
  * React+Material-ui 开发界面
  * webpack 打包
  * 主要使用ES6，部分使用ES7语法
* 后端:
  * Express+MySQL 
  * Websocket 用于通讯

## 主要功能
1. 登录注册
2. 房间系统
3. 游戏身份配置更改
4. 文字、语音聊天室
5. 狼人游戏进程控制系统 (未完成)

## 如何运行
* 线上: [传送门](https://tx.zhelishi.cn:2016)
* 本地:
  1. git pull
  2. npm install
  3. webpack -p
  4. node server.js
  5. node backend/socket/chat.js (新进程)
  6. node backend/socket/gamectrl.js (新进程)
* 测试账号: 账号admin，密码admin

