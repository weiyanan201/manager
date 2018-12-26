import React, { Component } from 'react';
import {Input,Spin} from 'antd';

import NavLink from '../../components/NavLink/NavLink';

import CommonTable from '../../components/commonTable';
import globalStyle from '../../index.less';
import {GROUP_PERMISSION} from '../../util/config';
import util from '../../util/util';
import axios from "../../util/axios";

const Search = Input.Search;

const columns = [
    {
        //group概念对用户透明
        title: '游戏名',
        dataIndex: 'name',
        align: 'center',
        width: '20%',
    }, {
        title: '游戏ID',
        dataIndex: "appId",
        align: 'center',
        width: '20%',
    }, {
        title: '权限',
        dataIndex: 'permissions',
        align: 'center',
        render: (permissions) => {
            if (permissions === null || permissions === undefined || permissions.length === 0) {
                return "-";
            } else if (permissions.includes(GROUP_PERMISSION.MODIFY_BUSINESS_SCHEMA) || permissions.includes(GROUP_PERMISSION.WRITE_BUSINESS_SCHEMA)) {
                return "开发者";
            } else {
                return "分析师";
            }
        },
        width: '10%',
    }, {
        title: '创建时间',
        dataIndex: "createTime",
        align: 'center',
        render: createTime => util.formatDate(createTime),
        width: '20%',
    }, {
        title: '更新时间',
        dataIndex: "updateTime",
        align: 'center',
        render: updateTime => util.formatDate(updateTime),
        width: '20%',
    }, {
        align: 'center',
        render: (item) => <NavLink target={`/table/groups/${item.id}`} linkText={"详情"}/>,
        width:"10%"
    },
];

export default class GroupList extends Component {

    state = {
        searchText: '',
        pageSize: 10,
        textValue: '',
        data:[]
    };

    //初始化状态
    componentDidMount() {

        this.setState({
            globalLoading:true
        });
        axios.get("/table/getGroupList")
            .then(res=>{
                const data = res.data.data;
                const dataBack = data.slice(0);
                this.setState({
                    data,dataBack,globalLoading:false
                })
            }).catch(()=>{
            this.setState({
                globalLoading:false
            });
        })

    }

    handleFilterSearch = (value) =>{
        let data = [];
        const dataBack = this.state.dataBack;
        if (util.isEmpty(value)){
            data = dataBack.slice(0);
        }else{
            //过滤
            data = dataBack.filter(item=>{return item.name.indexOf(value)!==-1 || item.py.indexOf(value)!==-1 });
        }
        this.setState({
            data
        })
    };

    render() {
        return (
            <div>
                <Spin spinning={this.state.globalLoading}>
                    游戏名称：<Search
                                    placeholder="input search text"
                                    onChange={(e) => {
                                        this.handleFilterSearch(e.target.value)
                                    }}
                                    style={{width: 200}}
                                />

                    <div className={globalStyle.tableToSearchPadding}>
                        <CommonTable
                            columns={columns}
                            dataSource={this.state.data}
                        />
                    </div>
                </Spin>

            </div>
        );
    }
}
