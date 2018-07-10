/**
 * content
 */

import React from 'react';
import { Layout } from 'antd';
import {Route} from 'react-router-dom'

import MyBreadcrumb from './Breadcrumb';
import HomePage from "../HomePage";
import ApiList from '../apiList/ApiList';
import ApiManage from '../apiManage/ApiManage';
import Consumerlist from '../consumerList/Consumerlist';
import ConsumerManage from '../consumerManage/ConsumerManage';

const { Content } = Layout;

class MainContent extends React.Component{

    render(){
        return(
            <div>
                <MyBreadcrumb/>
                <Content style={{overflow: 'auto',background:'white',margin:'10px',
                    minHeight: '70vh'}}>
                    <div style={{padding: '24px',position:'relative',minWidth:'80vw'}}>
                        <Route path="/" exact component={HomePage}/>
                        <Route path="/api" exact component={ApiList}/>
                        <Route path="/apiManage" exact component={ApiManage}/>
                        <Route path="/consumerlist" exact component={Consumerlist}/>
                        <Route path="/consumerManage" exact component={ConsumerManage}/>
                    </div>
                </Content>
            </div>
        );
    }
}


export default  MainContent;