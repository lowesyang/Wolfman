import React from "react";
import {Card} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import {hashHistory} from "react-router";
import Dialog from "material-ui/Dialog";
import LS from "../../Common/LocalStorage";

class BtnBox extends React.Component{
    static contextTypes={
        refresh:React.PropTypes.func,
        createRoom:React.PropTypes.func,
        ws:React.PropTypes.object,
        snackOpen:React.PropTypes.bool
    }
    state={
        dialogOpen:false,
    }
    showLogout=()=>{
        this.setState({
            dialogOpen:true
        })
    };
    dialogClose=()=>{
        this.setState({
            dialogOpen:false
        })
    };
    submitLogout=()=>{
        LS.clear();
        hashHistory.push("/login");
    };
    refresh=()=>{
        let ws=this.context.ws;
        ws.send(JSON.stringify({
            type:"roomList"
        }))
    };
    createRoom=()=>{
        let ws=this.context.ws;
        ws.send(JSON.stringify({
            type:"createRoom"
        }));
    };
    render(){
        let styles={
            right: {
                width: "32%",
                marginTop: 10,
                textAlign: "center",
                padding: "10px 0px 15px 0px"
            },
            btn: {
                margin: "5px auto"
            },
        };
        let actions=[
            <FlatButton
                label="返回"
                primary={true}
                onClick={this.dialogClose}
            />,
            <FlatButton
                label="确认"
                onClick={this.submitLogout}
            />
        ];
        return(
            <Card className="fr" style={styles.right}>
                <FlatButton
                    label="刷新列表"
                    style={styles.btn}
                    primary={true}
                    onClick={this.refresh}
                    disabled={this.context.snackOpen}
                /><br/>
                <FlatButton
                    label="创建房间"
                    style={styles.btn}
                    primary={true}
                    onClick={this.createRoom}
                /><br/>
                <FlatButton
                    label="登出"
                    primary={true}
                    onClick={this.showLogout}
                /><br/>
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.dialogOpen}
                >
                    确认登出吗？
                </Dialog>
            </Card>
        )
    }
}

export default BtnBox;