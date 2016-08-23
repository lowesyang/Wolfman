import React from "react";
import Card from "material-ui/Card";
import ProcessBox from "./ProcessBox/ProcessBox.jsx";
import PublicBox from "./PublicBox/PublicBox.jsx";
import InfoBox from "./InfoBox/InfoBox.jsx";
import Seat from "./Seat/Seat.jsx";
import LS from "../Common/LocalStorage.js";
import SnackBar from "material-ui/Snackbar";
import {hashHistory} from "react-router";
import SRecorder from "../Common/SRecorder";

class Room extends React.Component{
    constructor(){
        super();
        let userInfo=LS.getItem("userInfo");
        if(!userInfo) return hashHistory.push("/login");
        for(let i=0;i<18;i++){      //对作为信息初始化
            this.state.seatsInfo.push({
                isSeated:false,
                sitter:null,
                isSpeak:false
            });
        }
        this.setState({
            seatsInfo:this.state.seatsInfo
        })
    }
    static childContextTypes={
        midHeight:React.PropTypes.number,
        themeColor:React.PropTypes.string,
        sitDown:React.PropTypes.func,
        roomID:React.PropTypes.number,
        alertWarning:React.PropTypes.func,
        msgList:React.PropTypes.array,
        addMsg:React.PropTypes.func,
        processList:React.PropTypes.array,
        startGame:React.PropTypes.func,
        isStart:React.PropTypes.bool,
        standUp:React.PropTypes.func,
        gameWs:React.PropTypes.object,
        seatsInfo:React.PropTypes.array,
        getRoleName:React.PropTypes.func,
        recorder:React.PropTypes.object,
        speakingID:React.PropTypes.number,
        speakTime:React.PropTypes.number
    };
    getChildContext(){
        return {
            midHeight:this.state.midHeight,
            themeColor:"#E6E6E6",
            sitDown:this.sitDown,
            roomID:this.state.roomID,
            alertWarning:this.alertWarning,
            msgList:this.state.msgList,
            addMsg:this.addMsg,
            processList:this.state.processList,
            startGame:this.startGame,
            isStart:this.state.isStart,
            standUp:this.standUp,
            gameWs:this.state.gameWs,
            seatsInfo:this.state.seatsInfo,
            getRoleName:this.getRoleName,
            recorder:this.state.recorder,
            speakingID:this.state.speakingID,
            speakTime:this.state.speakTime
        }
    };
    state={
        roomID:null,   //房间号
        midHeight:0,    //中间交互区高度
        seatsInfo:[],   //座位信息
        isStart:false,  //游戏是否开始
        open:false,     //snackbar隐藏显示
        warning:"",     //snackbar信息
        msgList:["正在进入房间，请稍后......"],   //公共频道消息列表
        processList:[         //游戏进程消息列表
            {
                type:"day",
                msg:"第一天"
            },
            {
                type:"kill",
                msg:"玩家被杀害"
            }
        ],
        gameWs:new WebSocket("wss://127.0.0.1:9504"), //游戏控制websocket,
        recorder:null,
        isKeyDown:false,
        speakingID:-1,
        speakTime:60
    };
    componentWillMount(){
        let userInfo=LS.getItem("userInfo");
        userInfo.roomID=this.props.params.id;
        LS.setItem("userInfo",userInfo);
        this.setState({
            roomID:this.props.params.id
        })
    }
    componentWillUnmount(){
        let ws=this.state.gameWs;
        ws.close();
    }
    getRoleName=(key)=>{    //将key值转换为角色中文名
        let name;
        switch(key){
            case "wolf":name="狼人";break;
            case "witch":name="女巫";break;
            case "seer":name="预言家";break;
            case "guard":name="守卫";break;
            case "hunter":name="猎人";break;
            case "elder":name="长老";break;
            case "idiot":name="白痴";break;
            case "cupid":name="丘比特";break;
            case "thief":name="盗贼";break;
            case "villager":name="村民";break;
            default:name="未知";break;
        }
        return name;
    };
    startGame=()=>{     //game start!
        let ws=this.state.gameWs;
        ws.send(JSON.stringify({
            type:"gameStart",
            res:{
                roomID:this.state.roomID
            }
        }));
        this.setState({
            isStart:true
        })
    };
    addMsg=(msg)=>{     //公共频道添加信息
        let newList=this.state.msgList;
        newList.push(msg);
        this.setState({
            msgList:newList
        })
    };
    alertWarning=(msg)=>{       //弹出警告
        this.setState({
            open:true,
            warning:msg
        })
    };
    warningClose=()=>{          //警告框自动关闭
        this.setState({
            open:false,
            warning:""
        })
    };
    sitDown=(newNum)=>{         //坐下
        if(this.state.isStart) return this.alertWarning("游戏一开始，不能更换座位!")
        newNum--;
        let userInfo=LS.getItem("userInfo");
        let oldNum=-1;
        for(var i=0;i<18;i++){
            if(this.state.seatsInfo[i].sitter==userInfo.userName) {
                oldNum=i;
                break;
            }
        }
        if(newNum==oldNum) return;
        else {
            if(oldNum!=-1) {
                this.state.seatsInfo[oldNum]={
                    sitter:null,
                    isSeated:false
                }
            }
            this.state.seatsInfo[newNum].sitter=userInfo.userName;
            this.state.seatsInfo[newNum].isSeated=true;

            userInfo.seatID=newNum+1;
            LS.setItem("userInfo",userInfo);
            this.setState({
                seatsInfo: this.state.seatsInfo
            });
            let ws=this.state.gameWs;
            ws.send(JSON.stringify({
                type:"userAction",
                res:{
                    roomID:this.state.roomID,
                    seatID:newNum
                }
            }))
        }
    };
    standUp=()=>{       //离开座位
        let ws=this.state.gameWs;
        let userInfo=LS.getItem("userInfo");
        if(userInfo.seatID>0){
            this.state.seatsInfo[userInfo.seatID-1]={
                sitter:null,
                isSeated:false
            }
            this.setState({
                seatsInfo:this.state.seatsInfo
            })
        }
        userInfo.seatID=0;
        LS.setItem("userInfo",userInfo);
        ws.send(JSON.stringify({
            type:"userAction",
            res:{
                roomID:this.state.roomID,
                seatID:-1
            }
        }))
    };
    resetMidConHeight=()=>{     //自适应中部高度
        var btmConTop=$(".bottomCon").offset().top;
        var midConTop=$(".midCon").offset().top;
        this.setState({
            midHeight:btmConTop-midConTop-15
        })
    };
    updateSeatsInfo=(newList)=>{        //(开始游戏前)更新座位信息
        for(var i=0;i<newList.length;i++){
            if(newList[i] && newList[i]!=""){
                this.state.seatsInfo[i].isSeated=true;
                this.state.seatsInfo[i].sitter=newList[i];
            }
            else{
                this.state.seatsInfo[i].isSeated=false;
                this.state.seatsInfo[i].sitter=null;
            }
        }
        this.setState({
            seatsInfo:this.state.seatsInfo
        })
    };
    addProcessMsg=(type,msg)=>{
        let process=this.state.processList;
        process.push({
            type:type,
            msg:msg
        });
    }
    socketInit=()=>{        //websocket初始化函数
        let ws=this.state.gameWs;
        ws.onopen=()=>{
            ws.send(JSON.stringify({
                type:"sync",
                res:{
                    userName:LS.getItem("userInfo").userName,
                    roomID:this.state.roomID    //测试用房间号
                }
            }))
        };
        ws.onmessage=(messages)=>{
            let msgJson=JSON.parse(messages.data);
            if(msgJson.type=="reject"){
                this.alertWarning(msgJson.res.msg);
                ws.close();
                hashHistory.push("/home")
            }
            if(msgJson.type=="sync"){
                this.addMsg("获取房间信息成功!");
                this.updateSeatsInfo(msgJson.res.gamerList);
            }
            if(msgJson.type=="userAction"){
                this.updateSeatsInfo(msgJson.res.gamerList);
            }
            if(msgJson.type=="settingOK"){
                this.alertWarning("房间配置变更成功!");
                let roles=msgJson.res.roles;
                let newMsg="系统：房间配置已变更为";
                let isEmptyObj=true,setMsg="";
                for(var key in roles){      //判断对象是否为空
                    isEmptyObj=false;
                    if(roles[key]) {
                        setMsg += this.getRoleName(key) + Number(roles[key]) + "人，"
                    }
                }
                if(isEmptyObj)
                    newMsg+="[自动配置]。";
                else {
                    setMsg=setMsg.substring(0,setMsg.length-1)+"。";
                    newMsg+="：";
                    newMsg += "玩家" + msgJson.res.gamerNum + "人，";
                    newMsg+=setMsg;
                }
                this.addMsg(newMsg);
            }

            if(msgJson.type=="game"){

            }
        };
        ws.onclose=()=>{
            console.log("close");
        };
        ws.onerror=()=>{
            this.addMsg("连接游戏服务器失败~");
            this.alertWarning("请检查网络配置~");
        }
    };
    audioInit=()=>{         //即时语音初始化
        navigator.getUserMedia=navigator.getUserMedia||
            navigator.webkitGetUserMedia||
            navigator.mozGetUserMedia||
            navigator.msGetUserMedia;
        if(navigator.getUserMedia){
            navigator.getUserMedia({audio:true},function(stream){
                let recorder=new SRecorder(stream);
                this.setState({
                    recorder:recorder
                })
            }.bind(this),function(){
                this.context.alertWarning("请检查您的麦克风是否已禁用!");
            })
        }
    };
    componentDidMount(){
        this.resetMidConHeight();
        $(window).resize(this.resetMidConHeight);
        this.socketInit();
        this.audioInit();
    }
    render(){
        let styles={
            container:{
                height:"100vh",
                minHeight:600,
                width:1300,
                margin:"0px auto",
                position:"relative"
            },
            topCon:{
                textAlign:"center"
            },
            midCon:{
                width:"96%",
                height:this.state.midHeight,
                margin:"10px auto"
            },
            bottomCon:{
                position:"absolute",
                textAlign:"center",
                bottom:0,
                left:0,
                right:0,
            }
        };
        let topSeats=[],bottomSeats=[];
        this.state.seatsInfo.map((item,i)=>{
            if(i<9){
                topSeats.push(<Seat key={i} num={i+1} info={item}/>);
            }
            else{
                bottomSeats.push(<Seat key={i} num={i+1} info={item}/>);
            }
        });
        return(
            <div style={styles.container}>
                <div style={styles.topCon}>
                    {topSeats}
                </div>
                <div style={styles.midCon} className="midCon">
                    <ProcessBox />
                    <PublicBox />
                    <InfoBox />
                    <div className="cl"></div>
                </div>
                <div style={styles.bottomCon} className="bottomCon">
                    {bottomSeats}
                </div>
                <SnackBar
                    open={this.state.open}
                    message={this.state.warning}
                    autoHideDuration={4000}
                    onRequestClose={this.warningClose}
                />
            </div>
        )
    }
};

export default Room;