import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Pagination } from 'antd';
import { Route } from 'react-router-dom';

import NavLink from '../../components/NavLink/NavLink';


import {getTableList} from "../../reducers/table.redux";
import { pushBread } from "../../reducers/bread.redux";

const columns = [
    {
        title: 'tableId',
        dataIndex: 'tableId',
    }, {
        title: 'tableName',
        dataIndex: 'tableName',
    }, {
        title: 'groupId',
        dataIndex: "groupId"
    }, {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => <NavLink target={"/consumerManage"} linkText={"详情"} />  //跳转页面  rout
    },
];

@connect(
    state => {return {table:state.table}},
    {getTableList,pushBread}
)
export default class TableList extends Component {

    constructor(props) {
        super(props);
        let groupId = this.props.match.params.groupId;
        this.props.getTableList({groupId:groupId});
    }

    render(){

        const url = this.props.location.pathname;
        const bread = this.props.table.groupName;
        const breadObj = {[url]:bread};
        console.log(breadObj);
        this.props.pushBread(breadObj);
        return(
            <div>
                <Table
                    bordered
                    columns={columns}
                    dataSource={this.props.table.tableList}
                    rowKey="tableId"
                    // pagination={this.props.total}ConsumerManage
                    pagination = {false}
                    onRowDoubleClick = {this.handleDclick}
                />
                <Pagination  total={this.props.table.total} showSizeChanger showQuickJumper
                             onChange = {(page, pageSize)=>{this.handleChange(page, pageSize)}}
                             onShowSizeChange = {(current, size)=>{this.handleChangeSize(current, size)}}

                />
            </div>
        );
    }
}