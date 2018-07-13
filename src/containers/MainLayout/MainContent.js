/**
 * content
 */

import React from 'react';
import { Layout } from 'antd';
import { Route,Switch } from 'react-router-dom'

import MyBreadcrumb from './Breadcrumb';
import HomePage from "../HomePage";
import ApiList from '../apiList/ApiList';
import GroupList from '../tableManage/GroupList';
import TableList from '../tableManage/TableList';
import ConsumerManage from '../consumerManage/ConsumerManage';
import NotPage from '../NotPage';

import style from './layout.less';

const { Content } = Layout;

class MainContent extends React.Component{

    render(){
        return(
            <div >
                <MyBreadcrumb />
                {/*style={{overflow: 'auto',background:'white',margin:'10px',minHeight: '70vh'}}*/}
                <Content className={style.content}>
                    {/*style={{padding: '24px',position:'relative',minHeight:'85vh'}}*/}
                    <div className={style.contentDiv}>
                        <Switch>
                        <Route path="/" exact component={HomePage}/>
                        <Route path="/api" exact component={ApiList}/>
                        <Route path="/table/groups" exact component={GroupList}/>
                        <Route path="/table/groups/:groupId" exact component={TableList}/>
                        <Route component={NotPage} />
                        </Switch>
                    </div>
                </Content>
            </div>
        );
    }
}


export default  MainContent;