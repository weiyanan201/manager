/**
 * group 管理页面
 */

import React , { Component } from 'react';
import { Input, Button, Table, Modal, message, Spin} from 'antd';

import globalStyle from '../../index.less';
import CommonTable from '../../components/commonTable';
import util from "../../util/util";
import axios from '../../util/axios';
import tableUtil from "../../util/tableUtil";

const Search = Input.Search;

class TableIndexList extends Component {

    state = {
        columns : [
            {
                title: '表名',
                dataIndex: 'name',
                align:'center',
                width: '18%',
                className: globalStyle.resultColumns,
                render:
                    (text, record) => (
                        <div title={record.name} className={globalStyle.resultColumnsDiv}>{record.name}</div>
                    ),
            },{
                title: '描述',
                dataIndex: "comment",
                align:'center',
                width: '18%',
                className: globalStyle.resultColumns,
                render:
                    (text, record) => (
                        <div title={record.comment} className={globalStyle.resultColumnsDiv}>{record.comment}</div>
                    ),
            },{
                title: '数据库',
                dataIndex: "db",
                align:'center',
                width: '8%',
            },{
                title: '存储介质',
                dataIndex: "storageType",
                align:'center',
                width: '8%',
            },{
                title: '类型',
                dataIndex: "physicalType",
                align:'center',
                width: '8%',
            },{
                title: '业务类型',
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
                width: '7%',
            }, {
                title: '详情',
                align:'center',
                width:"7%",
                //render: (item) => <NavLink target={`/table/groups/${groupId}/${item.id}`} linkText={"详情"} />,  //跳转页面  rout
            },
        ],
        data:[],
        dataBack:[],
        globalLoading:true
    };

    constructor(props){
        super(props);
        axios.get('/table/getTableList',{groupId:-1})
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
        });
    }

    render(){
        return (
            <div>
                <Spin spinning={this.state.globalLoading}>
                    <div>
                        表名：<Search
                        placeholder="input search text"
                        onChange={(e) => {
                            this.handleFilterSearch(e.target.value)
                        }}
                        style={{width: 200}}
                    />
                    </div>

                    <div className={globalStyle.tableToSearchPadding}>
                        <CommonTable columns={this.state.columns} dataSource={this.state.data} />
                    </div>
                </Spin>
            </div>
        );
    }
}

export default TableIndexList;