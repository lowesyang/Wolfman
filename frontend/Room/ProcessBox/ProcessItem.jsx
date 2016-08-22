import React from "react";
import {ListItem} from "material-ui/List";

class ProcessItem extends React.Component{
    render(){
        let color;
        switch(this.props.info.type){
            case "day":color="#3399CC";break;
            case "kill":color="#CC0033";break;
            case "vote":color="#f5cd37";break;
            default:color="#000000";break;
        }
        let styles={
            item:{
                fontSize:14,
                color:color
            }
        }
        return(
            <ListItem
                style={styles.item}
                primaryText={this.props.info.msg}
            />
        )
    }
}

export default ProcessItem;