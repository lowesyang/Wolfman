import React from "react";
import {Card} from "material-ui/Card";
import {List,ListItem} from "material-ui/List";
import TitleIcon from "material-ui/svg-icons/action/record-voice-over";
import SendIcon from "material-ui/svg-icons/content/send";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/FontIcon";
import {blue500} from "material-ui/styles/colors";
import LS from "../../Common/LocalStorage";
import {hashHistory} from "react-router";


class PublicBox extends React.Component{
    static contextTypes={
        midHeight:React.PropTypes.number,
        themeColor:React.PropTypes.string,
        roomID:React.PropTypes.number,
        alertWarning:React.PropTypes.func,
        msgList:React.PropTypes.array,
        addMsg:React.PropTypes.func,
        recorder:React.PropTypes.object,
        isStart:React.PropTypes.bool
    };
    state={
        message:"",
        timeLimit:3000,
        sendTime:0,
        ws:new WebSocket("wss://tx.zhelishi.cn:9503"),
        audioSource1:null,
        audioSource2:null,
        interval:null
    };
    componentDidMount(){
        this.socketInit();
        this.audioInit();
    };
    componentWillUnmount=()=>{
        let ws=this.state.ws;
        ws.close();
    };
    msgInput=(event)=>{
        this.setState({
            message:event.target.value
        })
    };
    sendMsg=(e)=>{
        if(e.keyCode!=13 && e.type!= "click") return;
        let userInfo=LS.getItem("userInfo");
        var startTime=new Date().getTime(),offset;
        if((offset=startTime-this.state.sendTime)<=this.state.timeLimit){
            return this.context.alertWarning("请"+Math.floor((5000-offset)/1000)+"秒后再发言");
        }
        let name;
        if(!userInfo.seatID || userInfo.seatID==0)
            name=userInfo.userName;
        else
            name=userInfo.seatID+"号玩家";

        let newMsg=name+" : "+this.state.message;
        this.context.addMsg(newMsg);
        let msg=JSON.stringify({
            type:"broadcast",
            res:{
                roomID:this.context.roomID,
                message:newMsg
            }
        });
        this.state.ws.send(msg);
        this.setState({
            message:"",
            sendTime:startTime
        });

        ////控制滚动条保持在底部
        //let chatBox=$(".chatBox");
        //chatBox.scrollTop(chatBox[0].scrollHeight);
    };
    socketInit=()=>{
        let ws=this.state.ws;
        ws.onopen=(e)=>{
            this.context.addMsg("成功连入聊天室!");
            ws.send(JSON.stringify({
                type:"sync",
                res:{
                    userName:LS.getItem("userInfo").userName,
                    roomID:this.context.roomID
                }
            }))
        };
        ws.onmessage=(msg)=>{
            let msgJson=JSON.parse(msg.data);
            if(msgJson.type=="broadcast")
                this.context.addMsg(msgJson.res.message);
            if(msgJson.type=="audio") {
                if(!this.state.audioSource1) {
                    this.setState({
                        audioSource1: msgJson.res.message,
                        audioSource2:null
                    })
                }
                else this.setState({
                        audioSource2: msgJson.res.message,
                        audioSource1:null
                    })
            }
            if(msgJson.type=="reject") ws.close();
        };
        ws.onclose=()=>{
        };
        ws.onerror=()=>{
            this.context.addMsg("公共频道连接失败");
        }
    };
    audioInit=()=>{         //音频输入相关初始化
        let ws=this.state.ws;
        let userInfo=LS.getItem("userInfo");
        $(window).keydown(function(e){
            if(e.keyCode!=83
                || this.state.interval
                || !userInfo.seatID) return;    //todo 须针对进程控制作修改
            let recorder=this.context.recorder,interval;
            recorder.start();
            interval=setInterval(function(){
                ws.send(JSON.stringify({
                    type:"audio",
                    res:{
                        roomID:this.context.roomID,
                        audio:window.URL.createObjectURL(recorder.getBlob())
                    }
                }));
                recorder.clear();
            }.bind(this),500);
            this.setState({
                interval:interval
            });
        }.bind(this));
        $(window).keyup(function(e){
            if(e.keyCode==83 && this.state.interval) {
                clearInterval(this.state.interval);
                this.setState({
                    interval:null
                })
            }
        }.bind(this))
    };
    render(){
        let styles={
            container:{
                width:650,
                height:this.context.midHeight,
                float:"left",
                marginLeft:11,
                wordWrap:"break-word",
            },
            publicBox:{
                backgroundColor:this.context.themeColor,
                fontSize:16
            },
            chatBox:{
                overflowY:"scroll",
                height:this.context.midHeight-115
            },
            chatItem:{
                fontSize:14,
            },
            textField:{
                marginLeft:15,
                width:"90%"
            },
            sendBtn:{
                cursor:"pointer",
                height:40,
                width:40,
                textAlign:"center",
                marginRight:5,
                marginTop:10,
            }
        };
        let msgList=this.context.msgList.map((item,i)=>(
            <ListItem
                style={styles.chatItem}
                primaryText={item}
                key={i}
            />
        ))
        return(
            <Card style={styles.container}>
                <ListItem
                    primaryText="公共频道"
                    style={styles.publicBox}
                    leftIcon={<TitleIcon />}
                />
                <List style={styles.chatBox} className="chatBox">
                    {msgList}
                </List>
                <TextField
                    style={styles.textField}
                    hintText="输入您想发送的信息~"
                    value={this.state.message}
                    onChange={this.msgInput}
                    onKeyDown={this.sendMsg}
                />
                <IconButton
                    style={styles.sendBtn}
                    className="fr"
                    onClick={this.sendMsg}
                >
                    <SendIcon color={blue500}/>
                </IconButton>
                <div className="cl"></div>
                <audio autoPlay="autoplay" src={this.state.audioSource1}>您的设备不支持音频播放</audio>
                <audio autoPlay="autoplay" src={this.state.audioSource2}>您的设备不支持音频播放</audio>
            </Card>
        )
    }
}

export default PublicBox;