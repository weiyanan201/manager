import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Pagination,Input } from 'antd';

import BaseTable from '../../components/BaseTable';
import NavLink from '../../components/NavLink/NavLink';
import { getGroupList,getShowGroup,getShowGroupById } from "../../reducers/table.redux";
import style from './table.less';
import { GROUP_PERMISSION }from '../../util/config';
import util from '../../util/util';

const Search = Input.Search;

const columns = [
     {
        title: '组名',
        dataIndex: 'name',
        align: 'center'
    }, {
        title: '游戏ID',
        dataIndex: "appId",
        align: 'center'
    }, {
        title: '权限',
        dataIndex: 'permissions',
        align: 'center',
        render:(permissions)=>{
             if (permissions===undefined){
                 return "-";
             }else if(permissions.includes(GROUP_PERMISSION.MODIFY_BUSINESS_SCHEMA) || permissions.includes(GROUP_PERMISSION.WRITE_BUSINESS_SCHEMA)){
                 return "开发者";
             }else {
                 return "分析师";
             }
        }
    },{
        title: '创建时间',
        dataIndex: "createTime",
        align: 'center',
        render: createTime=>util.formatDate(createTime)
    },{
        title: '更新时间',
        dataIndex: "updateTime",
        align: 'center',
        render: updateTime=>util.formatDate(updateTime)
    }, {
        align: 'center',
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
        pageSize:10,
        textValue:''
    };

    constructor(props){
        super(props);
        if (!this.props.allGroup || this.props.allGroup.length===0 ){
            this.props.getGroupList();
        }
    }

    //初始化状态
    componentDidMount(){
        console.log("componentDidMount",this.state.current);
        this.props.getShowGroup(1,10,"");
        this.setState({
            searchText:'',
            pageSize:10,
        })
    }

    //搜索框为空时自动刷新
    handleChangeText(value) {
        // if (util.isEmpty(value)){
        //     console.log("changne");
        //
        // }
        this.handleSearch(value);
        this.setState({
            textValue:value
        });

    }

    handleChange=(page, pageSize)=>{
        this.props.getShowGroup(page,pageSize,this.state.searchText);
    };

    handleChangeSize=(current, pageSize)=>{
        this.setState({current,pageSize});
        this.props.getShowGroup(current,pageSize,this.state.searchText);
    };

    handleSearch=(search)=>{
        this.props.getShowGroup(1,this.state.pageSize,search);
        this.setState({searchText:search,current:1})
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
                            onChange={(e)=>{this.handleChangeText(e.target.value)}}
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
                             className={style.tablePagination}
                />
            </div>
        );
    }
}
