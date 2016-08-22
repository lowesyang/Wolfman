import React from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from "../node_modules/material-ui/styles/MuiThemeProvider";
import {Router,Route,hashHistory,IndexRedirect} from "react-router";
import LoginBox from "./LoginBox/LoginBox.jsx";
import RegisterBox from "./LoginBox/RegisterBox.jsx";
import Home from "./Home/Home.jsx";
import Room from "./Room/Room.jsx";

class Root extends React.Component{
    render(){
        return(
            <MuiThemeProvider>
                <div>
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        )
    }
}

const App=()=>(
    <Router history={hashHistory}>
        <Route path="/" component={Root}>
            <IndexRedirect to="login" />
            <Route path="login" component={LoginBox} />
            <Route path="register" component={RegisterBox} />
            <Route path="home" component={Home} />
            <Route path="room/:id" component={Room} />
        </Route>
    </Router>
);

ReactDOM.render(
    <App />,
    document.getElementById("App")
);
