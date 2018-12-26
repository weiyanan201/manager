/**
 * group 页面下的tableList
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Spin } from 'antd';
import NavLink from '../../components/NavLink/NavLink';
import util from '../../util/util';
import { pushBread } from "../../reducers/bread.redux";
import tableUtil from "../../util/tableUtil";

import CommonTable from '../../components/commonTable';
import globalStyle from '../../index.less';
import axios from "../../util/axios";

const Search = Input.Search;

@connect(
    null,
    {pushBread}
)
export default class TableList extends Component {

    constructor(props) {
        super(props);
        let groupId = this.props.match.params.groupId;
        this.state={
            searchText:'',
            pageSize:10,
            globalLoading:false,
            groupName:'',
            columns : [
                // {
                //     title: 'id',
                //     dataIndex: 'id',
                //     align:'center',
                // },
                {
                    title: '表名',
                    dataIndex: 'name',
                    align:'center',
                    width: '15%',
                    className: globalStyle.resultColumns,
                    render:
                        (text, record) => (
                            <div title={record.name} className={globalStyle.resultColumnsDiv}>{record.name}</div>
                        ),
                },{
                    title: '描述',
                    dataIndex: "comment",
                    align:'center',
                    width: '15%',
                    className: globalStyle.resultColumns,
                    render:
                        (text, record) => (
                            <div title={record.comment} className={globalStyle.resultColumnsDiv}>{record.comment}</div>
                        ),
                },{
                    title: '数据库',
                    dataIndex: "db",
                    align:'center',
                    width: '10%',
                },{
                    title: '存储介质',
                    dataIndex: "storageType",
                    align:'center',
                    width: '8%',
                },{
                    title: '对象类型',
                    dataIndex: "physicalType",
                    align:'center',
                    width: '8%',
                },{
                    title: '数据层次',
                    dataIndex: "produceType",
                    align:'center',
                    width: '8%',
                },{
                    title: '创建时间',
                    dataIndex: "createTime",
                    render: createTime=>util.formatDate(createTime),
                    sorter: (a, b) => a.createTime - b.createTime,
                    align:'center',
                    width: '15%',
                },{
                    title: '更新时间',
                    dataIndex: "updateTime",
                    render:updateTime=>util.formatDate(updateTime),
                    sorter: (a, b) => a.createTime - b.createTime,
                    defaultSortOrder: 'descend',
                    align:'center',
                    width: '15%',
                },{
                    title: "权限",
                    dataIndex: "permissions",
                    render:permissions=>tableUtil.getTablePermission(permissions),
                    align:'center',
                    width: '5%',
                }, {
                    title: '详情',
                    align:'center',
                    width:"5%",
                    render: (item) => <NavLink target={`/table/groups/${groupId}/${item.id}`} linkText={"详情"} />,  //跳转页面  rout
                },
            ]
        }
    }

    componentDidMount(){
        let groupId = this.props.match.params.groupId;
        this.setState({
            globalLoading:true
        });
        axios.get('/table/getTableList',{groupId:groupId})
            .then(res=>{
                const result = res.data.data;
                const data = result.data;
                const groupName = result.groupName;
                const dataBack = data.slice(0);
                this.setState({
                    data,dataBack,groupName,globalLoading:false
                })
            }).catch(()=>{
            this.setState({
                globalLoading:false
            });
        })
    }

    handleFilterSearch = (value) => {
        let data = [];
        const dataBack = this.state.dataBack;
        if (util.isEmpty(value)){
            data = dataBack.slice(0);
        }else{
            //过滤
            data = dataBack.filter(item=>item.name.indexOf(value)!==-1);
        }
        this.setState({
            data
        })
    };

    render(){
        const url = this.props.location.pathname;
        const bread = this.state.groupName;
        const breadObj = {[url]:bread};
        this.props.pushBread(breadObj);
        return(
            <div>
                <Spin spinning={this.state.globalLoading}>
                    表名：
                    <Search
                        placeholder="input search text"
                        // enterButton
                        style={{ width: 200 }}
                        onChange={(e)=>{this.handleFilterSearch(e.target.value)}}
                    />
                    <div className={ ` ${globalStyle.tableToSearchPadding}` }  >
                        <CommonTable
                            columns={this.state.columns}
                            dataSource={this.state.data}
                        />
                    </div>
                </Spin>
            </div>
        );
    }
}
