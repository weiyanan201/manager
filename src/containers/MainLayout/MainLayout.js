/**
 * 整体布局
 */

import React, {Component} from 'react';
import {
    Layout
} from 'antd';
import {Route} from 'react-router-dom'
import MyBreadcrumb from './Breadcrumb';
import MainHeader from './MainHeader';
import HomePage from "../HomePage";
import ApiList from '../apiList/ApiList';
import ApiManage from '../apiManage/ApiManage';
import Consumerlist from '../consumerList/Consumerlist';
import ConsumerManage from '../consumerManage/ConsumerManage';

import {connect} from 'react-redux';
import MainSider from './MainSider';

import { getAuth } from "../../reducers/auth.redux";

const {Content} = Layout;
const minHeight = window.innerHeight - 120;

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
            <Layout style={{minHeight: '100vh'}}>
                <MainSider />
                <Layout>
                    <MainHeader/>
                    <Content style={{overflow: 'initial'}}>
                        {/*<MyBreadcrumb style={{margin: '16px 0', textAlign: 'left'}}/>*/}
                        <div style={{padding: 24, background: '#fff', minHeight: minHeight}}>
                            <Route path="/" exact component={HomePage}/>
                            <Route path="/api" exact component={ApiList}/>
                            <Route path="/apiManage" exact component={ApiManage}/>
                            <Route path="/consumerlist" exact component={Consumerlist}/>
                            <Route path="/consumerManage" exact component={ConsumerManage}/>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default MainLayout

