/**
 * content
 */

import React from 'react';
import { Layout } from 'antd';
import { Route,Switch } from 'react-router-dom'

import MyBreadcrumb from './Breadcrumb';
import HomePage from "../HomePage";
import GroupList from '../tableManage/GroupList';
import TableList from '../tableManage/TableList';
import TableInfo from '../tableManage/TableInfo';
import AddTable from '../tableManage/AddTable';
import UserList from '../../containers/userManage/list';
import UserGroupPermission from '../../containers/userManage/groupPermission'
import OutService from '../../containers/userManage/outService'
import GroupManage from '../../containers/groupManage/list'
import AppManage from '../../containers/appManage/list'
import DatabaseList from '../../containers/databaseManage/list'
import DbTableList from '../../containers/databaseManage/dbTables'
import MobileGameList from '../../containers/mobileGame/list'

import Test from '../../containers/test';
import EditTable from '../../containers/test/editTable';
import DragDropTable from '../../containers/test/dragDropTable';
import TestTable from '../../containers/test/testTable';
import DragEditTable from '../../containers/tableManage/component/dragAndEditTable'
import XXX from '../../containers/tableManage/TestTable'
import Test6 from '../../containers/test/test6'
import Test7 from '../../containers/test/Test7'

import MyTest from '../../containers/test/theme-test'
import MyTest2 from '../../containers/test/contextTest'

import NotPage from '../NotPage';

import style from './layout.less';
import PermissionTransfer from "../userManage/groupPermission/component/permissonTransfer";

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
                        <Route path="/table/groups" exact component={GroupList}/>
                        <Route path="/table/groups/:groupId" exact component={TableList}/>
                        <Route path="/table/groups/:groupId/:tableId" exact component={TableInfo}/>
                        <Route path="/table/addTable" exact component={AddTable}/>
                        <Route path="/user/list" exact component={UserList}/>
                        <Route path="/user/list/:tenantId" exact component={UserGroupPermission}/>
                        <Route path="/user/outService" exact component={OutService}/>
                        <Route path="/group/list" exact component={GroupManage}/>AppManage
                        <Route path="/app/list" exact component={AppManage}/>
                        <Route path="/db/list" exact component={DatabaseList}/>
                        <Route path="/db/list/:databaseId" exact component={DbTableList}/>
                        <Route path="/db/list/:databaseId/:tableId" exact component={TableInfo}/>
                        <Route path="/mobileGame/list" exact component={MobileGameList}/>
                        <Route path="/test" exact component={EditTable}/>
                        <Route path="/test2" exact component={DragDropTable}/>
                        <Route path="/test3" exact component={TestTable}/>
                        <Route path="/test4" exact component={DragEditTable}/>
                        <Route path="/test5" exact component={XXX}/>
                        <Route path="/test6" exact component={Test6}/>
                        <Route path="/test7" exact component={Test7}/>
                        <Route path="/myTest" exact component={MyTest}/>
                        <Route path="/myTest2" exact component={MyTest2}/>
                        <Route component={PermissionTransfer} />
                        </Switch>
                    </div>
                </Content>
            </div>
        );
    }
}


export default  MainContent;
