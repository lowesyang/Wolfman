import React from "react";
import {List,ListItem} from "material-ui/List";
import {Card} from "material-ui/Card";
import TitleIcon from "material-ui/svg-icons/action/schedule";
import ProcessItem from "./ProcessItem.jsx";

class ProcessBox extends React.Component{
    static contextTypes={
        midHeight:React.PropTypes.number,
        themeColor:React.PropTypes.string,
        processList:React.PropTypes.array
    };

    render(){
        let styles={
            container:{
                width:300,
                height:this.context.midHeight,
                marginLeft:-15,
                float:"left"
            },
            title:{
                backgroundColor:this.context.themeColor
            },
            process:{
                overflowY:"scroll",
                height:this.context.midHeight-80
            },
            item:{
                fontSize:14
            }
        };
        let processList=this.context.processList.map((item,i)=>(
             <ProcessItem
                 key={i}
                 info={item}
             />
        ));
        return(
            <Card style={styles.container}>
                <ListItem
                    primaryText="游戏进程"
                    style={styles.title}
                    leftIcon={<TitleIcon />}
                />
                <List style={styles.process}>
                    {processList}
                </List>
            </Card>
        )
    }
}

export default ProcessBox;