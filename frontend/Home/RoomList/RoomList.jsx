import React from "react";
import {Card,CardTitle,CardText} from "material-ui/Card";
import {ListItem} from "material-ui/List";
import Chip from "material-ui/Chip";
import GameIcon from "material-ui/svg-icons/image/remove-red-eye";
import {blue500} from "material-ui/styles/colors";
import FlatButton from "material-ui/FlatButton";
import {hashHistory} from "react-router";
import {red300} from "material-ui/styles/colors";

class RoomList extends React.Component{
    static contextTypes={
        roomList:React.PropTypes.array
    };
    state={
    };
    enterRoom=(roomID)=>{
        hashHistory.push("/room/"+roomID);
    };
    render(){
        let styles= {
            item:{
                marginTop: 10,
            },
            chip:{
                marginTop:8
            },
            roomInfo:{
                lineHeight: 3,
                marginRight: 10
            },
            num:{
                marginRight: 30
            },
            roomList:{
                width: "65%",
                minHeight:400,
                height:"100vh",
                overflowY:"scroll",
                padding:"0px 5px"
            },
            title:{
                fontSize: 32
            }
        };
        let list=this.context.roomList.map((item,i)=>(
            <Card
                style={styles.item}
                key={i}
                onClick={this.enterRoom.bind(this,item.roomId)}
            >
                <div className="fr" style={styles.roomInfo}>
                    <span style={styles.num}>{item.currNum}/18</span>
                    <Chip
                        className="fr"
                        style={styles.chip}
                        backgroundColor={!item.isStart?"#E0E0E0":"#FF0033"}
                    >
                        {!item.isStart?"等待开始":"已开始"}
                    </Chip>
                </div>
                <ListItem
                    primaryText={item.title+item.roomId+"号房"}
                    leftIcon={<GameIcon color={blue500} />}
                />
                <div className="cl"></div>
            </Card>
        ));
        styles.noList={
            fontSize:22,
            textAlign:"center",
            marginTop:30,
            color:"#999999",
            display:!list.length?"block":"none"
        }
        return(
            <div className="fl" style={styles.roomList}>
                {list}
                <span style={styles.noList}>还没有房间哦~快创建有一个房间吧!</span>
            </div>
        )
    }
}

export default RoomList;