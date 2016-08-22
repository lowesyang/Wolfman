var https=require("https");
var fs=require("fs");
var server=https.createServer({
    key:fs.readFileSync("../ssl/server.key"),
    cert:fs.readFileSync("../ssl/server.crt")
}).listen(9504);
var websocket=require("ws").Server;
var ws=new websocket({server:server});
var rooms=new Array(100);  //最多1000个房间
var home=[];    //在首页的玩家列表


//--------房间初始化---------
for(var i=0;i<rooms.length;i++){
    rooms[i]={
        gameStart:0,
        userList:[],    //客户端列表，用于广播
        gameSetting:{},
        gameProcess:{},
        isAutoSet:true,   //是否自动配置，默认为是
        gamerList:new Array(18)    //用于记录座位与对应的玩家名称
    }
}

ws.on('connection',function(conn){

    conn.on('message',function(message){
        var msgJson=JSON.parse(message);
        var roomID="";
        if(msgJson.res) roomID=msgJson.res.roomID||"";

        if(msgJson.type=="sync"){
            conn.userInfo={
                userName:msgJson.res.userName,
                roomID:roomID,
                seatID:-1
            };
            if(rooms[roomID].userList.length>=18) {
                return conn.send(JSON.stringify({
                    type: "reject",
                    res:{
                        msg:"房间已满,请选择其他房间~"
                    }
                }))
            }
            rooms[roomID].userList.push(conn);
            conn.send(JSON.stringify({
                type: "sync",
                res: {
                    gamerList: rooms[roomID].gamerList
                }
            }))
        }
        if(msgJson.type=="userAction"){
            var room=rooms[roomID];
            if(conn.userInfo.seatID!=-1 && msgJson.res.seatID!=conn.userInfo.seatID) {
                room.gamerList[conn.userInfo.seatID] = null;
            }
            conn.userInfo.seatID = parseInt(msgJson.res.seatID);
            if(msgJson.res.seatID!=-1) {
                room.gamerList[msgJson.res.seatID] = conn.userInfo.userName;
            }
            for(var i=0;i<room.userList.length;i++){
                if(conn==room.userList[i]) continue;
                room.userList[i].send(JSON.stringify({
                    type:"userAction",
                    res:{
                        gamerList:room.gamerList
                    }
                }))
            }
        }

        if(msgJson.type=="roomList"){
            if(home.indexOf(conn)==-1) home.push(conn);
            var rmList=[];
            for(var i=0;i<rooms.length;i++){
                if(rooms[i].userList.length!=0){
                    rmList.push({
                        roomId:i,
                        title:"狼人游戏",
                        currNum:rooms[i].userList.length,
                        isStart:rooms[i].gameStart
                    })
                }
            }
            conn.send(JSON.stringify({
                type:"roomList",
                res:{
                    roomList:rmList
                }
            }))
        }

        if(msgJson.type=="createRoom"){
            var id;
            for(var i=0;i<rooms.length;i++){
                if(rooms[i].userList.length==0){
                    id=i;
                    break;
                }
            }
            if(id!=rooms.length){
                conn.send(JSON.stringify({
                    type:"roomOK",
                    res:{
                        roomID:id
                    }
                }));
            }
            else{
                conn.send(JSON.stringify({
                    type:"roomFailed"
                }))
            }
        }

        if(msgJson.type=="setting"){
            var setting=msgJson.res.setting;
            var room=rooms[roomID];
            room.isAutoSet=msgJson.res.isAutoSet;
            room.gameSetting={
                gamerNum:setting.gamerNum,
                roleSetting:setting.roleSetting
            };
            for(var i=0;i<room.userList.length;i++) {
                room.userList[i].send(JSON.stringify({
                    type: "settingOK",
                    res: {
                        gamerNum: setting.gamerNum,
                        roles: setting.roleSetting
                    }
                }))
            }
        }

        //todo 游戏进程控制系统
        if(msgJson.type=="gameStart"){
            rooms[roomID].gameStart++;
            if(rooms[roomID].gameSetting.gamerNum==rooms[roomID].gameStart){    //准备人数与玩家人数相同
                var seatInfo=[];

                rooms[roomID].gameProcess={
                    round:0,
                    period:0,
                    speakers:[],
                    voteList:{},
                    police:-1,
                    dead:[],
                    tools:{}
                }
            }
        }

        if(msgJson.type=="game"){

        }
    });

    conn.on('close',function(){
        if(conn.userInfo) {
            var gamerList = rooms[conn.userInfo.roomID].gamerList;
            var userList = rooms[conn.userInfo.roomID].userList;
            gamerList[conn.userInfo.seatID] = null;
            userList.splice(userList.indexOf(conn), 1);
            for (var i = 0; i < userList.length; i++) {
                userList[i].send(JSON.stringify({
                    type: "userAction",
                    res: {
                        gamerList: gamerList
                    }
                }))
            }
        }
        var index;
        if((index=home.indexOf(conn))!=-1) home.splice(index,1);
    })
})