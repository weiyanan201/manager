/**
 * 整体布局
 */

import React, {Component} from 'react';
import {
    Layout
} from 'antd';
import {Route} from 'react-router-dom'
import {connect} from 'react-redux';

import MainHeader from './MainHeader';
import MainContent from './MainContent';
import MainSider from './MainSider';

import { getAuth } from "../../reducers/auth.redux";

@connect(
    status=>status.auth,
    {getAuth}
)
class MainLayout extends Component {


    componentDidMount() {
        console.log(this.props);
        this.props.getAuth();
    }

    render() {
        return (
            <Layout >
                <MainSider />
                {/**/}
                <Layout style={{height: '100vh', overflow: 'auto'}}>
                    <MainHeader/>
                    <MainContent/>
                </Layout>
            </Layout>
        );
    }
}

export default MainLayout

