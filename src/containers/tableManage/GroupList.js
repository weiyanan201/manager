import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Pagination,Input } from 'antd';
import { Route } from 'react-router-dom';

import BaseTable from '../../components/BaseTable';
import GroupSelect from '../../components/groupSelect/GroupSelect';
import NavLink from '../../components/NavLink/NavLink';
import { getGroupList,getShowGroup,getShowGroupById } from "../../reducers/table.redux";
import style from './table.less';

const Search = Input.Search;

const columns = [
    {
        title: 'groupID',
        dataIndex: 'id',
    }, {
        title: '组名',
        dataIndex: 'name',
    }, {
        title: '对应游戏',
        dataIndex: "app.appName"
    }, {
        title: '权限',
        dataIndex: 'authority',
    }, {
        render: (item) => <NavLink target={`/table/groups/${item.id}`} linkText={"详情"} />  //跳转页面  rout
    },
];

@connect(
    state => state.group,
    {getGroupList,getShowGroup,getShowGroupById}
)
export default class GroupList extends Component {

    state={
        searchText:'',
        pageSize:10
    };

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSize = this.handleChangeSize.bind(this);
        if (!this.props.allGroup || this.props.allGroup.length===0 ){
            this.props.getGroupList();
        }
    }

    handleChange(page, pageSize){
        this.props.getShowGroup(page,pageSize,this.state.searchText);
    }
    
    handleChangeSize(current, pageSize){
        this.setState({pageSize:pageSize});
        this.props.getShowGroup(current,pageSize,this.state.searchText);
    }

    handleSearch=(search)=>{
        this.props.getShowGroup(1,this.state.pageSize,search);
        this.setState({searchText:search})
    };

    selection = {
        type:"checkbox",
        rows:"rows",
        rowKeys:"rowKeys",
        _self : this
    };

    render() {
        return (
            <div>
                group名称：<Search
                            placeholder="input search text"
                            onSearch={value => this.handleSearch(value)}
                            enterButton
                            style={{ width: 200 }}
                            />
                <BaseTable
                    bordered
                    columns={columns}
                    dataSource={this.props.data}
                    rowKey="id"
                    loading={this.props.groupLoading}
                    pagination = {false}
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