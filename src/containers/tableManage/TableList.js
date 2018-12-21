import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Pagination,Input } from 'antd';
import { Route } from 'react-router-dom';
import NavLink from '../../components/NavLink/NavLink';
import util from '../../util/util';
import {getTableList,getShowTablePage} from "../../reducers/table.redux";
import { pushBread } from "../../reducers/bread.redux";
import tableUtil from "../../util/tableUtil";

import globalStyle from '../../index.less';
import style from './table.less'

const Search = Input.Search;

@connect(
    state => {return {table:state.table}},
    {getTableList,getShowTablePage,pushBread}
)
export default class TableList extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSize = this.handleChangeSize.bind(this);
        let groupId = this.props.match.params.groupId;
        this.state={
            searchText:'',
            pageSize:10,
            columns : [
                {
                    title: 'id',
                    dataIndex: 'id',
                    align:'center',
                    width: '100px',
                }, {
                    title: '表名',
                    dataIndex: 'name',
                    align:'center',
                    width: '200px',
                    className: globalStyle.resultColumns,
                    render:
                        (text, record) => (
                            <div title={record.name} className={globalStyle.resultColumnsDiv}>{record.name}</div>
                        ),
                }, {
                    title: '数据库',
                    dataIndex: "db",
                    align:'center',
                    width: '150px',
                },{
                    title: '存储介质',
                    dataIndex: "storageType",
                    align:'center',
                    width: '150px',
                },{
                    title: '类型',
                    dataIndex: "physicalType",
                    align:'center',
                    width: '100px',
                },{
                    title: '业务类型',
                    dataIndex: "produceType",
                    align:'center',
                    width: '120px',
                },{
                    title: '注释',
                    dataIndex: "comment",
                    align:'center',
                    width: '300px',
                    className: globalStyle.resultColumns,
                    render:
                        (text, record) => (
                            <div title={record.comment} className={globalStyle.resultColumnsDiv}>{record.comment}</div>
                        ),
                },{
                    title: '创建时间',
                    dataIndex: "createTime",
                    render: createTime=>util.formatDate(createTime),
                    align:'center',
                    width: '160px',
                },{
                    title: '更新时间',
                    dataIndex: "updateTime",
                    render:updateTime=>util.formatDate(updateTime),
                    align:'center',
                    width: '160px',
                },{
                    title: "权限",
                    dataIndex: "permissions",
                    render:permissions=>tableUtil.getTablePermission(permissions),
                    align:'center',
                    width: '80px',
                }, {
                    title: '详情',
                    align:'center',
                    render: (item) => <NavLink target={`/table/groups/${groupId}/${item.id}`} linkText={"详情"} />,  //跳转页面  rout
                },
            ]
        }
    }

    componentDidMount(){
        let groupId = this.props.match.params.groupId;
        this.props.getTableList({groupId:groupId});
        
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
                <div className={ `${style["roll-table"]} ${globalStyle.tableToSearchPadding}` }  >
                    <Table
                        bordered
                        columns={this.state.columns}
                        dataSource={this.props.table.data}
                        rowKey="tableId"
                        // pagination={this.props.total}ConsumerManage
                        pagination = {false}
                        onRowDoubleClick = {this.handleDclick}
                        loading={this.props.table.tableLoading}
                        scroll={{ y: 600 }}
                        style={{tableLayout:"fixed"}}
                    />
                </div>
                <Pagination  total={this.props.table.total} showSizeChanger showQuickJumper
                             onChange = {(page, pageSize)=>{this.handleChange(page, pageSize)}}
                             onShowSizeChange = {(current, size)=>{this.handleChangeSize(current, size)}}
                             className={style.tablePagination}
                />
            </div>
        );
    }
}
