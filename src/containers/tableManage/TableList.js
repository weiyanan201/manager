import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Pagination } from 'antd';
import { Route } from 'react-router-dom';
import NavLink from '../../components/NavLink/NavLink';


import {getTableList,getShowTablePage} from "../../reducers/table.redux";
import { pushBread } from "../../reducers/bread.redux";

const columns = [
    {
        title: 'id',
        dataIndex: 'id',
    }, {
        title: 'name',
        dataIndex: 'name',
    }, {
        title: 'db',
        dataIndex: "db"
    },{
        title: 'storageType',
        dataIndex: "storageType"
    },{
        title: 'physicalType',
        dataIndex: "physicalType"
    },{
        title: 'produceType',
        dataIndex: "produceType"
    },{
        title: 'comment',
        dataIndex: "comment"
    },{
        title: 'createTime',
        dataIndex: "createTime"
    },{
        title: 'updateTime',
        dataIndex: "updateTime"
    },{
        title: 'permissions',
        dataIndex: "permissions"
    }, {
        render: (item) => <NavLink target={`/table/tableInfo/${item.id}`} linkText={"详情"} />  //跳转页面  rout
    },
];

@connect(
    state => {return {table:state.table}},
    {getTableList,getShowTablePage,pushBread}
)
export default class TableList extends Component {

    constructor(props) {
        super(props);
        let groupId = this.props.match.params.groupId;
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSize = this.handleChangeSize.bind(this);
        if (this.props.table.groupId!==groupId){
            this.props.getTableList({groupId:groupId});
        }

    }

    handleChange(page, pageSize){
        this.props.getShowTablePage(page,pageSize);
    }

    handleChangeSize(current, pageSize){
        this.props.getShowTablePage(current,pageSize);
    }


    render(){
        const url = this.props.location.pathname;
        const bread = this.props.table.groupName;
        const breadObj = {[url]:bread};
        this.props.pushBread(breadObj);
        return(
            <div>
                <Table
                    bordered
                    columns={columns}
                    dataSource={this.props.table.data}
                    rowKey="tableId"
                    // pagination={this.props.total}ConsumerManage
                    pagination = {false}
                    onRowDoubleClick = {this.handleDclick}
                    loading={this.props.table.tableLoading}
                />
                <Pagination  total={this.props.table.total} showSizeChanger showQuickJumper
                             onChange = {(page, pageSize)=>{this.handleChange(page, pageSize)}}
                             onShowSizeChange = {(current, size)=>{this.handleChangeSize(current, size)}}

                />
            </div>
        );
    }
}