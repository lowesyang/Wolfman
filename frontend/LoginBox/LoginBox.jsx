import React from "react";
import {Card,CardTitle} from "material-ui/Card";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import CircularProgress from "material-ui/CircularProgress";
import {hashHistory} from "react-router";
import SnackBar from "material-ui/Snackbar";
import LS from "../Common/LocalStorage";

class LoginBox extends React.Component{
    constructor(){
        super();
        let userInfo=LS.getItem("userInfo");
        if(userInfo) return hashHistory.push("/home");
    }
    state={
        isLoading:false,
        userName:"",
        password:"",
        open:false,
        warning:""
    };
    goLogin=(e)=>{
        if(e.keyCode!=13 && e.type!= "click") return;
        if(!this.state.userName)
            return this.setState({
                open:true,
                warning:"用户名不能为空!"
            });
        if(!this.state.password)
            return this.setState({
                open:true,
                warning:"密码不能为空!"
            });
        this.setState({
            isLoading:true
        });
        $.ajax({
            type:"POST",
            url:"/user/login",
            dataType:"json",
            data:{
                userName:this.state.userName,
                psword:this.state.password,
                token:"login"
            },
            success:function(res){
                if(res.code==0){
                    var userInfo={
                        userName:this.state.userName,
                        token:res.token
                    };
                    LS.setItem("userInfo",userInfo);
                    setTimeout(()=>{
                        hashHistory.push("/home");
                    },1000);
                }
                else this.setState({
                    isLoading:false
                })
                this.setState({
                    open:true,
                    warning:res.msg
                });
            }.bind(this),
            error:function(err){
                this.setState({
                    isLoading:false
                })
            }.bind(this)
        });
    };
    getUserName=(e)=>{
        this.setState({
            userName:e.target.value
        })
    };
    getPsword=(e)=>{
        this.setState({
            password:e.target.value
        })
    };
    warningClose=(e)=>{
        this.setState({
            open:false
        })
    }
    render(){
        let styles= {
            con:{
                position:"absolute",
                width: 400,
                height:300,
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:"auto",
            },
            card:{
                position:"relative",
                zIndex:2
            },
            form:{
                width: "65%",
                margin: "10px auto",
                textAlign: "center",
                paddingBottom: 20
            },
            btn:{
                marginTop: 10,
                display: this.state.isLoading ? "none" : "block"
            },
            circle:{
                display: this.state.isLoading ? "block" : "none"
            },
            wolfImg:{
                position:"absolute",
                top:-220,
                left:0,
                right:0,
                margin:"auto",
                zIndex:0
            }
        };
        return(
            <div style={styles.con}>
                <img
                    src="/frontend/LoginBox/static/wolf.png"
                    style={styles.wolfImg}
                />
                <Card style={styles.card}>
                    <form style={styles.form}>
                        <CardTitle title="登录"/>
                        <TextField
                            floatingLabelText="用户名"
                            onChange={this.getUserName}
                            onKeyDown={this.goLogin}
                        /><br/>
                        <TextField
                            floatingLabelText="密码"
                            type="password"
                            onChange={this.getPsword}
                            onKeyDown={this.goLogin}
                        /><br/>
                        <FlatButton
                            className="fr"
                            label="登录"
                            primary={true}
                            style={styles.btn}
                            onClick={this.goLogin}
                        />
                        <FlatButton
                            className="fr"
                            label="前往注册"
                            style={styles.btn}
                            href="#/register"
                        />
                        <CircularProgress
                            className="fr"
                            size={0.5}
                            style={styles.circle}/>
                        <div className="cl"></div>
                    </form>
                    <SnackBar
                        open={this.state.open}
                        message={this.state.warning}
                        autoHideDuration={4000}
                        onRequestClose={this.warningClose}
                    />
                </Card>
            </div>
        )
    }
}

export default LoginBox;