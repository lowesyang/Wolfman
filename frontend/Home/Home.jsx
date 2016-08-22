import React from "react";
import RoomList from "./RoomList/RoomList.jsx";
import BtnBox from "./BtnBox/BtnBox.jsx";
import {Card,CardTitle} from "material-ui/Card";
import {hashHistory} from "react-router";
import LS from "../Common/LocalStorage";
import SnackBar from "material-ui/Snackbar";

class Home extends React.Component{
    constructor(){
        super();
        var userInfo=LS.getItem("userInfo");
        if(!userInfo) return hashHistory.push("/login");
        this.setState({
            userInfo:userInfo
        })
    }

    static childContextTypes={
        roomList:React.PropTypes.array,
        refresh:React.PropTypes.func,
        createRoom:React.PropTypes.func,
        ws:React.PropTypes.object,
        snackOpen:React.PropTypes.bool
    }

    getChildContext(){
        return{
            roomList:this.state.roomList,
            refresh:this.refresh,
            createRoom:this.createRoom,
            ws:this.state.ws,
            snackOpen:this.state.open
        }
    }
    state={
        roomList:[],
        userInfo:{},
        open:false,
        warning:"",
        ws:null
    };
    socketInit=()=>{
        let ws=new WebSocket("wss://127.0.0.1:9504");
        ws.onopen=()=>{
            ws.send(JSON.stringify({
                type:"roomList",
            }))
        };
        ws.onmessage=(message)=>{
            let msgJson=JSON.parse(message.data);
            if(msgJson.type=="roomList"){
                this.alertWarning("房间列表更新成功!");
                this.setState({
                    roomList:msgJson.res.roomList
                })
            }
            if(msgJson.type=="roomOK"){
                let roomID=msgJson.res.roomID;
                hashHistory.push("/room/"+roomID);
            }
            if(msgJson.type=="roomFailed"){
                this.alertWarning("创建房间失败,已达到最大房间数量!");
            }
        };
        ws.onerror=()=>{
            this.alertWarning("服务器无响应，请检查网络配置!");
        };
        ws.onclose=()=>{

        }
        this.setState({
            ws:ws
        })
    }
    componentDidMount(){
        this.socketInit();
    }
    alertWarning=(msg)=>{
        this.setState({
            open:true,
            warning:msg
        })
    };
    warningClose=()=>{
        this.setState({
            open:false,
            warning:""
        })
    };
    render(){
        let styles={
            container:{
                width: "80%",
                minWidth: 800,
                margin: "0px auto"
            },
            right: {
                width: "32%",
                marginTop: 10,
                textAlign: "center",
                padding: "10px 0px 15px 0px"
            }
        }
        return (
            <div style={styles.container}>
                <RoomList />
                <Card style={styles.right} className="fr">
                    <CardTitle title="Web版狼人游戏" titleStyle={styles.title}/>
                </Card>
                <BtnBox />
                <div className="cl"></div>
                <SnackBar
                    open={this.state.open}
                    message={this.state.warning}
                    autoHideDuration={3000}
                    onRequestClose={this.warningClose}
                />
            </div>
        )
    }
}

export default Home;