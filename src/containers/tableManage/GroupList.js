import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Table, Pagination} from 'antd';

import {getGroupList} from "../../reducers/table.redux";


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
    }
];

@connect(
    state => state.group,
    {getGroupList}
)
export default class GroupList extends Component {

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSize = this.handleChangeSize.bind(this);
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

    render() {
        return (
            <div>
                <Table
                    bordered
                    columns={columns}
                    dataSource={this.props.data}
                    rowKey="groupId"
                    loading={this.props.groupLoading}
                    // pagination={this.props.total}
                    pagination = {false}
                />
                <Pagination  total={this.props.total} showSizeChanger showQuickJumper
                             onChange = {(page, pageSize)=>{this.handleChange(page, pageSize)}}
                             onShowSizeChange = {(current, size)=>{this.handleChangeSize(current, size)}}
                />
            </div>
        );
    }
}