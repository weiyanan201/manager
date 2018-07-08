import React from 'react';
import { connect } from 'react-redux';

import { getAuth } from "../../reducers/auth.redux";

@connect(
    state=>state.auth,
    { getAuth }
)
class AuthRoute extends React.Component{

        componentDidMount(){
        this.props.getAuth();
    }

    render(){
        return (
            <div>{this.props.username}</div>
        )
    }
}


export default AuthRoute;
