var https=require("https");
var fs=require("fs");
var server=https.createServer({
    key:fs.readFileSync("../ssl/server.key"),
    cert:fs.readFileSync("../ssl/server.crt")
}).listen(9503);
var websocket=require("ws").Server;
var ws=new websocket({server:server});
var rooms=[];

//---------聊天室 rooms[key]结构
//  userList:[] 在该房间内的玩家列表，包括各自的信息

//---------message结构
//  type: 事件类型，有"broadcast"(广播事件)
//        "sync"(信息同步事件),"audio"(音频通讯事件)
//  res: 传输的消息,包含用户名称，座位ID。

ws.on('connection',function(conn){

    conn.on('message',function(message){
        var msgJson=JSON.parse(message);
        var roomID=msgJson.res.roomID;
        if(!rooms[roomID]){
            //create
            rooms[roomID]={
                userList:[],    // 玩家列表，用于广播
            }
        }
        if(msgJson.type=="sync"){
            conn.userInfo={
                usrName:msgJson.res.userName,
                roomID:roomID
            };
            if(rooms[roomID].userList.length<18){
                rooms[roomID].userList.push(conn);
            }
            else{
                return conn.send(JSON.stringify({
                    type:"reject"
                }))
            }
        }
        if(msgJson.type=="broadcast")
            broadcast(roomID,msgJson.res.message,"broadcast");

        if(msgJson.type=="audio") {
            broadcast(roomID, msgJson.res.audio, "audio");
        }

    });

    conn.on('close',function(){
        var userList=rooms[conn.userInfo.roomID].userList;
        userList.splice(userList.indexOf(conn),1);
        rooms[conn.userInfo.roomID].userList=userList;
    })

    function broadcast(roomID,msg,type){
        var userList=rooms[roomID].userList;
        for(var i=0;i<userList.length;i++){
            if(userList[i]!=conn) {
                userList[i].send(JSON.stringify({
                    type: type,
                    res: {
                        message: msg
                    }
                }))
            }
        }
    }
})
