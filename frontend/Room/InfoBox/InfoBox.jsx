import React from "react";
import {Card} from "material-ui/Card";
import {ListItem} from "material-ui/List";
import RaisedButton  from "material-ui/RaisedButton";
import TitleIcon from "material-ui/svg-icons/action/info-outline";
import {hashHistory} from "react-router";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import LS from "../../Common/LocalStorage";
import GameSetting from "./RoomSetting.jsx";

class InfoBox extends React.Component{
    static contextTypes={
        midHeight:React.PropTypes.number,
        themeColor:React.PropTypes.string,
        startGame:React.PropTypes.func,
        isStart:React.PropTypes.bool,
        standUp:React.PropTypes.func,
        gameWs:React.PropTypes.object,
        roomID:React.PropTypes.number
    };
    state={
        dialogOpen:false,
        settingOpen:false,
        role:"暂无身份"
    };
    leaveRoom=()=>{
        let ws=this.context.gameWs;
        ws.close();
        this.setState({
            dialogOpen:true
        })
    };
    confirmLeave=()=>{
        let oldUserInfo=LS.getItem("userInfo");
        LS.setItem("userInfo",{
            userName:oldUserInfo.userName,
            seatID:0,
            roomID:null
        });
        hashHistory.replace("/home");
    };
    showGameSetting=()=>{
        this.setState({
            settingOpen:true
        })
    };
    dialogClose=()=>{
        this.setState({
            dialogOpen:false,
            settingOpen:false
        })
    };
    render(){
        let styles={
            container:{
                position:"relative",
                width:290,
                height:this.context.midHeight,
                float:"left",
                marginLeft:12
            },
            infoBox:{
                backgroundColor:this.context.themeColor
            },
            gamerType:{
                textAlign:"center",
                fontSize:28,
                marginTop:20,
                marginBottom:20
            },
            btnBox:{
                width:200,
                margin:"5px auto"
            },
            btn:{
                marginLeft:20,
                marginTop:10
            },
            tips:{
                width:"100%",
                position:"absolute",
                textAlign:"center",
                fontSize:14,
                bottom:10
            },
            gameBox:{
                textAlign:"center"
            }
        };
        const actions=[
            <FlatButton
                label="留下"
                primary={true}
                onClick={this.dialogClose}
            />,
            <FlatButton
                label="离开"
                onClick={this.confirmLeave}
            />
        ]
        return(
            <Card style={styles.container}>
                <ListItem
                    primaryText={"狼人游戏 "+this.context.roomID+" 号房"}
                    leftIcon={<TitleIcon />}
                    style={styles.infoBox}
                />
                <div style={styles.gameBox}>
                    <h1 style={styles.gamerType}>{this.state.role}</h1>
                    <RaisedButton
                        label="结束发言"
                        onClick={this.overSpeak}
                        disabled={!this.context.isStart}
                        secondary={true}
                    />
                </div>
                <div style={styles.btnBox}>
                    <RaisedButton
                        label="房间配置"
                        onClick={this.showGameSetting}
                        disabled={this.context.isStart}
                    />
                    <RaisedButton
                        label="离开座位"
                        style={styles.btn}
                        onClick={this.context.standUp}
                        disabled={this.context.isStart}
                    />
                    <RaisedButton
                        label="准备"
                        secondary={true}
                        disabled={this.context.isStart}
                        onClick={this.context.startGame}
                    />
                    <RaisedButton
                        label="离开房间"
                        primary={true}
                        style={styles.btn}
                        onClick={this.leaveRoom}
                        disabled={this.context.isStart}
                    />
                </div>
                <div style={styles.tips}>
                    <p>Tips: 按住键盘'S'键开启语音功能~</p>
                </div>
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.dialogClose}
                >确认要离开房间吗？</Dialog>
                <GameSetting
                    settingOpen={this.state.settingOpen}
                    dialogClose={this.dialogClose}
                />
            </Card>
        )
    }
}

export default InfoBox;