/**
 * 整体布局
 */

import React, {Component} from 'react';
import {Layout, LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
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
            <LocaleProvider locale={ zh_CN }>
                <Layout >
                    <MainSider />
                    {/*style={{height: '100vh', overflow: 'auto'}}*/}
                    <Layout className={style.rightLayout}>
                        <MainHeader/>
                        <MainContent/>
                    </Layout>
                </Layout>
            </LocaleProvider>
        );
    }
}

export default MainLayout

