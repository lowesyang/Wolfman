import React from "react";
import {Card} from "material-ui/Card";
import MicIcon from "material-ui/svg-icons/av/mic";

class Seat extends React.Component{
    static contextTypes={
        sitDown:React.PropTypes.func
    }
    static defaultProps={
        isSeated:false
    };

    handleHover=()=>{

    };
    render(){
        let styles={
            seats:{
                width:125,
                height:125,
                display:"inline-block",
                "*display":"inline",
                zoom:1,
                marginRight:"1.3%",
                position:"relative"
            },
            tag:{
                position:"absolute",
                bottom:0,
                fontSize:16,
                padding:"0px 0px 2px 5px"
            },
            nameBox:{
                width:!this.props.info.isSeated?60:100,
                height:60,
                boxShadow:"rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px",
                borderRadius:!this.props.info.isSeated?"100%":2,
                transition:"all 0.3s",
                lineHeight:"60px",
                margin:"0px auto",
                marginTop:20,
                padding:5,
                cursor:"pointer",
                fontSize:14,
                textOverflow:"ellipsis",
                overflow:"hidden",
                whiteSpace:"nowrap"
            },
            mic:{
                position:"absolute",
                bottom:2,
                right:2,
                display:this.props.info.isSpeak?"block":"none"
            }
        };
        return(
            <Card style={styles.seats}>
                <div
                    style={styles.nameBox}
                    onClick={this.context.sitDown.bind(this,this.props.num)}
                >
                    {!this.props.info.isSeated?"入座":this.props.info.sitter}
                </div>
                <div style={styles.tag}>
                    {this.props.num}
                </div>
                <MicIcon style={styles.mic} />
            </Card>
        )
    }
}

export default Seat;