import React from "react";
import {Card,CardTitle} from "material-ui/Card";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import SnackBar from "material-ui/Snackbar";
import CircularProgress from "material-ui/CircularProgress";
import {hashHistory} from "react-router";
import LS from "../Common/LocalStorage";

class RegisterBox extends React.Component{
    constructor(){
        super();
        let userInfo=LS.getItem("userInfo");
        if(userInfo) return hashHistory.push("/home");
    }
    state={
        isLoading:false,
        userName:"",
        password:"",
        cfpassword:"",
        open:false,
        warning:""
    };
    alertWarning=(msg)=>{
        this.setState({
            open:true,
            warning:msg
        })
    };
    goRegister=(e)=>{
        //暂时不开放注册
        return this.alertWarning("注册暂不开放!");
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
        if(!this.state.cfpassword)
            return this.setState({
                open:true,
                warning:"确认密码不能为空!"
            });
        if(this.state.password!=this.state.cfpassword)
            return this.setState({
                open:true,
                warning:"两次密码输入不一致!"
            })
        this.setState({
            isLoading:true
        });
        $.ajax({
            type:"POST",
            url:"/user/register",
            dataType:"json",
            data:{
                userName:this.state.userName,
                psword:this.state.password,
                cfpsword:this.state.cfpassword,
                token:"register"
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
                    },2000);

                }
                this.alertWarning(res.msg);
                this.setState({
                    isLoading:false
                });
            }.bind(this),
            error:function(err){
                this.alertWarning("请检查网络配置!");
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
    getCfPsword=(e)=>{
        this.setState({
            cfpassword:e.target.value
        })
    }
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
                height:370,
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:"auto"
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
            witchImg:{
                position:"absolute",
                width:365,
                top:-185,
                left:0,
                right:0,
                margin:"auto",
                borderRadius:20
            }
        };
        return(
            <div style={styles.con}>
                <img
                    src="/frontend/LoginBox/static/witch.jpg"
                    style={styles.witchImg}
                />
                <Card style={styles.card}>
                    <form style={styles.form}>
                        <CardTitle title="注册~"/>
                        <TextField
                            floatingLabelText="用户名"
                            onChange={this.getUserName}
                            onKeyDown={this.goRegister}
                        /><br/>
                        <TextField
                            floatingLabelText="密码"
                            type="password"
                            onChange={this.getPsword}
                            onKeyDown={this.goRegister}
                        /><br/>
                        <TextField
                            floatingLabelText="确认密码"
                            type="password"
                            onChange={this.getCfPsword}
                            onKeyDown={this.goRegister}
                        /><br/>
                        <FlatButton
                            className="fr"
                            label="注册"
                            primary={true}
                            style={styles.btn}
                            onClick={this.goRegister}
                        />
                        <FlatButton
                            className="fr"
                            label="前往登录"
                            style={styles.btn}
                            href="#/login"
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

export default RegisterBox;