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

import style from './layout.less';

@connect(
    status=>status.auth,
    {getAuth}
)
class MainLayout extends Component {

    componentDidMount() {
        this.props.getAuth();
    }

    render() {
        return (
            <Layout >
                <MainSider />
                {/*style={{height: '100vh', overflow: 'auto'}}*/}
                <Layout className={style.rightLayout}>
                    <MainHeader/>
                    <MainContent/>
                </Layout>
            </Layout>
        );
    }
}

export default MainLayout

