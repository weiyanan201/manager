import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Pagination,Input } from 'antd';
import { Route } from 'react-router-dom';
import NavLink from '../../components/NavLink/NavLink';
import util from '../../util/util';
import {getTableList,getShowTablePage} from "../../reducers/table.redux";
import { pushBread } from "../../reducers/bread.redux";
import tableUtil from "../../util/tableUtil";

import style from './table.less'

const Search = Input.Search;

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
        this.state={
            searchText:'',
            pageSize:10,
            columns : [
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
                    dataIndex: "createTime",
                    render: createTime=>util.formatDate(createTime)
                },{
                    title: 'updateTime',
                    dataIndex: "updateTime",
                    render:updateTime=>util.formatDate(updateTime)
                },{
                    title: 'permissions',
                    dataIndex: "permissions",
                    render:permissions=>tableUtil.getTablePermission(permissions)
                }, {
                    render: (item) => <NavLink target={`/table/groups/${groupId}/${item.id}`} linkText={"详情"} />  //跳转页面  rout
                },
            ]
        }
    }

    //搜索框为空时自动刷新
    handleChangeText(value) {
        this.handleSearch(value);
        this.setState({
            textValue:value
        });
    }

    handleChange(page, pageSize){
        this.props.getShowTablePage(page,pageSize,this.state.searchText);
    }

    handleChangeSize(current, pageSize){
        this.setState({pageSize:pageSize});
        this.props.getShowTablePage(current,pageSize,this.state.searchText);
    }

    handleSearch=(search)=>{
        this.setState({searchText:search});
        this.props.getShowTablePage(1,this.state.pageSize,search);
    }


    render(){
        const url = this.props.location.pathname;
        const bread = this.props.table.groupName;
        const breadObj = {[url]:bread};
        this.props.pushBread(breadObj);
        return(
            <div>
                table名称：
                <Search
                    placeholder="input search text"
                    onSearch={value => this.handleSearch(value)}
                    enterButton
                    style={{ width: 200 }}
                    onChange={(e)=>{this.handleChangeText(e.target.value)}}
                />
                <Table
                    bordered
                    columns={this.state.columns}
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
                             className={style.tablePagination}
                />
            </div>
        );
    }
}
