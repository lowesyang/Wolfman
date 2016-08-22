import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import Slider from "material-ui/Slider";
import Checkbox from "material-ui/checkbox";
import Divider from "material-ui/Divider";

class RoomSetting extends React.Component{
    static contextTypes={
        gameWs:React.PropTypes.object,
        seatsInfo:React.PropTypes.array,
        roomID:React.PropTypes.number,
        getRoleName:React.PropTypes.func
    };
    state={
        gamerNum:12,
        roleSetting:{
            wolf:3,         //狼人
            witch:true,     //女巫
            seer:true,      //预言家
            guard:false,    //守卫
            hunter:false,   //猎人
            elder:false,    //长老
            idiot:false,    //白痴
            cupid:false,    //丘比特
            thief:false,     //盗贼
            villager:0        //村民
        },
        autoSetting:true
    };
    componentWillMount(){
        this.updateVillagerNum();
    }
    changeGamerNum=(event,value)=>{
        this.setState({
            gamerNum:value
        });
        this.updateVillagerNum();
    };
    changeWolfNum=(event,value)=>{
        let newSetting=this.state.roleSetting;
        newSetting.wolf=value;
        this.setState({
            roleSetting:newSetting
        });
        this.updateVillagerNum();
    };
    updateRole=(role,e)=>{
        let newSetting=this.state.roleSetting;
        newSetting[role]=e.target.checked;
        this.setState({
            roleSetting:newSetting
        });
        this.updateVillagerNum();
    };
    setAuto=(e)=>{
        this.setState({
            autoSetting:e.target.checked
        })
    };
    updateVillagerNum=()=>{
        let roles=this.state.roleSetting;
        let num=0;
        for(var key in roles){
            if(roles[key]) num++;
        }
        roles.villager=this.state.gamerNum-num;
        this.setState({
            roleSetting:roles
        })
    }
    submitSetting=()=>{
        //配置提交业务

        let ws=this.context.gameWs;
        let setting=!this.state.autoSetting?
        {
            gamerNum: this.state.gamerNum,
            roleSetting:this.state.roleSetting
        }:
        {
            gamerNum:this.context.seatsInfo.length
        };

        ws.send(JSON.stringify({
            type:"setting",
            res:{
                roomID:this.context.roomID,
                isAutoSet:this.state.autoSetting,
                setting:setting
            }
        }));
        this.props.dialogClose();
    };
    render(){
        let styles={
            userNum:{
                fontSize:24,
            },
            checkCon:{
                textAlign:"center",
            },
            checkBox:{
                width:100,
                display:"inline-block",
                marginRight:40,
                marginLeft:40,
                marginTop:20,
                textAlign:"left"
            },
            checkLabel:{
                width:80
            },
            slider:{
                marginTop:10,
                marginBottom:20
            },
            autoSetting:{
                marginBottom:30,
                fontSize:26
            }
        };
        let checkBoxs=[],roleSetting=this.state.roleSetting;
        for(var key in roleSetting){
            if(key=="wolf") continue;
            let name=this.context.getRoleName(key);
            checkBoxs.push(
                <Checkbox
                    style={styles.checkBox}
                    labelStyle={styles.checkLabel}
                    label={name}
                    checked={roleSetting[key]}
                    onCheck={this.updateRole.bind(this,key)}
                    disabled={this.state.autoSetting}
                />
            )
        }
        let actions=[
            <FlatButton
                label="取消"
                onClick={this.props.dialogClose}
            />,
            <FlatButton
                label="更新"
                secondary={true}
                onClick={this.submitSetting}
            />
        ];
        return(
            <div>
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.props.settingOpen}
                    onRequestClose={this.props.dialogClose}
                >
                    <div>
                        <Checkbox
                            style={styles.autoSetting}
                            label="自动配置"
                            checked={this.state.autoSetting}
                            onCheck={this.setAuto}
                        />
                    </div>
                    <Divider /><br />
                    <div>
                        <span>玩家人数:
                            <span style={styles.gamerNum}> {this.state.gamerNum}</span>
                        </span>
                        <Slider
                            sliderStyle={styles.slider}
                            min={9}
                            max={18}
                            step={1}
                            defaultValue={12}
                            value={this.state.gamerNum}
                            onChange={this.changeGamerNum}
                            disabled={this.state.autoSetting}
                        />
                        <span>狼人数量:
                            <span style={styles.gamerNum}> {this.state.roleSetting.wolf}</span>
                        </span>
                        <Slider
                            sliderStyle={styles.slider}
                            min={3}
                            max={5}
                            step={1}
                            defaultValue={3}
                            value={this.state.roleSetting.wolf}
                            onChange={this.changeWolfNum}
                            disabled={this.state.autoSetting}
                        />
                        <span>其他角色</span>
                        <div style={styles.checkCon}>
                            {checkBoxs}
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default RoomSetting;