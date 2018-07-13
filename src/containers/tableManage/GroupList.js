import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Pagination } from 'antd';
import { Route } from 'react-router-dom';

import GroupSelect from '../../components/groupSelect/GroupSelect';
import NavLink from '../../components/NavLink/NavLink';

import { getGroupList , getGroupAll } from "../../reducers/table.redux";

import style from './table.less';

const columns = [
    {
        title: 'groupID',
        dataIndex: 'groupId',
    }, {
        title: '组名',
        dataIndex: 'groupName',
    }, {
        title: '对应游戏',
        dataIndex: "app.appName"
    }, {
        title: '权限',
        dataIndex: 'authority',
    }, {
        title: 'Action',
        dataIndex: 'groupId',
        render: (groupId) => <NavLink target={`/table/groups/${groupId}`} linkText={"详情"} />  //跳转页面  rout
    },
];

@connect(
    state => state.group,
    {getGroupList,getGroupAll}
)
export default class GroupList extends Component {

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSize = this.handleChangeSize.bind(this);
        this.handleDclick = this.handleDclick.bind(this);
        GroupList.handleSelectChange = GroupList.handleSelectChange.bind(this);
        this.props.getGroupAll();
    }

    componentDidMount() {
        this.props.getGroupList();
    }

    handleChange(page, pageSize){
        console.log(page,pageSize);
        this.props.getGroupList(page,pageSize);
    }
    
    handleChangeSize(current, pageSize){
        console.log(current, pageSize);
        this.props.getGroupList(current,pageSize);
    }
    
    handleDclick(){
        console.log("onRowDoubleClick");
    }

    static handleSelectChange(e, f){
        this.props.getGroupList(e);
    }

    render() {
        return (
            <div>
                <GroupSelect groupData={this.props.allGroup} handleChange={GroupList.handleSelectChange} />
                <Table
                    bordered
                    columns={columns}
                    dataSource={this.props.data}
                    rowKey="groupId"
                    loading={this.props.groupLoading}
                    pagination = {false}
                    onRowDoubleClick = {this.handleDclick}
                />
                <Pagination  total={this.props.total} showSizeChanger showQuickJumper
                             onChange = {(page, pageSize)=>{this.handleChange(page, pageSize)}}
                             onShowSizeChange = {(current, size)=>{this.handleChangeSize(current, size)}}
                             className={style.groupList}
                />
            </div>
        );
    }
}