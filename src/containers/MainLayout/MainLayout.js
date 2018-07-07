import React, {Component} from 'react';
import {
    Layout
} from 'antd';
import {Route, Redirect} from 'react-router-dom'
import MyBreadcrumb from '../Breadcrumb';
import HomePage from "../HomePage";
import ApiList from '../apiList/ApiList';
import ApiManage from '../apiManage/ApiManage';
import Consumerlist from '../consumerList/Consumerlist';
import ConsumerManage from '../consumerManage/ConsumerManage';

import {connect} from 'react-redux';
import MainSider from './MainSider';

const {Content} = Layout;
const minHeight = window.innerHeight - 120;

class MainLayout extends Component {
    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <MainSider/>
                <Layout>
                    <Content style={{overflow: 'initial'}}>
                        <MyBreadcrumb style={{margin: '16px 0', textAlign: 'left'}}/>
                        <div style={{padding: 24, background: '#fff', minHeight: minHeight}}>
                            <Route path="/" exact component={HomePage}/>
                            <Route path="/apiList" exact component={ApiList}/>
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

const mapStateToProps = (state) => {
    return {
        counter: state
    }
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);

