/**
 * 用户管理页面
 */

import React, {Component} from 'react';
import {Pagination, Input, Button, Table, Modal, message, Spin, Divider} from 'antd';

import util from "../../../util/util";
import { TenantType } from "../../../config"
import axios from '../../../util/axios';

import AddUserForm from './component/addUserForm';
import NavLink from '../../../components/NavLink/NavLink'

import style from './style.less'

const Search = Input.Search;
const confirm = Modal.confirm;


function onChange(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter);
}

class UserList extends Component {
    constructor(props){
        super(props);
        this.modalToggle = this.modalToggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.handleFilterSearch = this.handleFilterSearch.bind(this);
        let columns = [
            {
                title: 'id',
                dataIndex: 'id',
                align: 'center',
            },{
                title: '用户名',
                dataIndex: 'userName',
                align: 'center',
            },{
                title: '工号',
                dataIndex: 'sourceId',
                align: 'center',
            },{
                title: '部门',
                dataIndex: 'deptName',
                align: 'center',
            },{
                title: '用户类别',
                dataIndex: 'tenantType',
                align: 'center',
                render: (tenantType) => {
                    return TenantType[tenantType].text;
                },
                filters:Object.keys(TenantType).map(index=>{
                    return {
                        "text":TenantType[index].text,
                        "value":index
                    }
                }),
                onFilter: (value, record) => record.tenantType.indexOf(value) === 0,
            }, {
                title: '联系方式',
                dataIndex: 'mobile',
                align: 'center',
            },{
                title: '邮箱',
                dataIndex: 'email',
                align: 'center',
            },{
                title: '创建时间',
                dataIndex: 'createTime',
                align: 'center',
                render: createTime => util.formatDate(createTime),
                sorter: (a, b) => a.createTime - b.createTime,
            },{
                title: '更新时间',
                dataIndex: 'updateTime',
                defaultSortOrder: 'descend',
                align: 'center',
                render: val => util.formatDate(val),
                sorter: (a, b) => a.updateTime - b.updateTime,
            },{
                title: '权限',
                align: 'center',
                render: (text,record) => {
                    if (record.tenantType===TenantType.GROUP_USER.key){
                        return <NavLink target={`/user/list/${record.id}`} linkText={"详情"}/>
                    }
                }
            },{
                title: '操作',
                align: 'center',
                render: (text, record) => (
                    <span>
                        {record.tenantType!==TenantType.OUTER_SERVICE.key?<span><a >编辑</a><Divider type="vertical" /></span>:null}
                        {/*<a >编辑</a>*/}

                        <a onClick={()=>this.showDeleteConfirm(record.userName,record.id)}>删除</a>
                    </span>
                )
            }
        ];

        this.state={
            addUserModalVisible:false,
            addLoading:false,
            columns:columns,
            globalLoading:false,
        };

    }

    componentDidMount(){
        this.setState({
            globalLoading: true
        });
        axios.get("/tenant/getTenantList")
            .then(res=>{
                const data = res.data.data;
                //动态设置部门过滤条件
                const keySet = new Set();
                const deptFilters = [];
                data.map(item=>{
                    if (!keySet.has(item.deptName)){
                        keySet.add(item.deptName);
                        deptFilters.push({
                            "text":item.deptName,
                            "value":item.deptName
                        });
                    }
                });
                const columns = this.state.columns;
                columns.forEach(value=>{
                    if (value.title==='部门'){
                        value.filters=deptFilters;
                        value.onFilter=(value, record) => record.deptName.indexOf(value) === 0;
                    }
                });

                const dataBack = data.slice(0);

                this.setState({
                    data,columns,dataBack,
                    globalLoading: false
                })
            })
            .catch(error=>{
                this.setState({
                    globalLoading: false
                });
            })
    }

    modalToggle(toggle){
        this.setState({
            addUserModalVisible:toggle,
        })
    }

    handleSubmit = () => {
        this.addUserForm.props.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            const data = this.addUserForm.props.form.getFieldsValue();
            this.setState({addLoading:true})
            axios.postByJson("/tenant/addTenant",{...data})
                .then(res=>{
                    //添加成功
                    //data中插入记录 关闭modal
                    const newInfo = res.data.data;
                    const data = this.state.data;
                    const dataBack = this.state.dataBack;
                    data.push(newInfo);
                    dataBack.push(newInfo);
                    this.setState({
                        data:data,
                        dataBack:dataBack,
                        addUserModalVisible:false,
                        addLoading:false
                    });
                    message.success("创建成功!");
                })
        });
    };

    handleFilterSearch = (value) =>{
        let data = [];
        const dataBack = this.state.dataBack;
        if (util.isEmpty(value)){
            data = dataBack.slice(0);
        }else{
            //顾虑
            data = dataBack.filter(item=>item.userName.indexOf(value)!==-1);
        }
        this.setState({
            data
        })
    };

    //删除用户
    showDeleteConfirm = (userName, id) => {
        const _this = this;
        confirm({
            title: '删除确认',
            autoFocusButton:"cancel",
            content: `是否删除用户：${userName}`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.setState({
                    globalLoading:true
                });
                axios.post("/tenant/deleteTenant", {tenantId: id})
                    .then(res => {
                        console.log(res);
                        //删除成功，从data中去掉
                        message.success("删除成功");
                        const data = _this.state.data;
                        const dataBack = _this.state.dataBack;
                        const index = data.findIndex(item => item.id === id);
                        data.splice(index, 1);

                        const indexBack = dataBack.findIndex(item => item.id === id);
                        dataBack.splice(indexBack, 1);

                        _this.setState({
                            data,dataBack,
                            globalLoading:false
                        })
                    })
                    .catch(()=>{
                        _this.setState({
                            globalLoading:false
                        })
                    })
            }
        });
    };

    render() {
        return (
            <div>
                <Spin spinning={this.state.globalLoading}>
                    <div>
                        用户名：<Search
                        placeholder="input search text"
                        // onSearch={value => this.handleSearch(value)}
                        onChange={(e) => {
                            this.handleFilterSearch(e.target.value)
                        }}
                        enterButton
                        style={{width: 200}}
                    />
                        <Button type='primary' className={style.createUserButton} onClick={()=>this.modalToggle(true)}>新建用户</Button>
                    </div>

                    <div className={style.userTableWrapper}>
                        <Table columns={this.state.columns} dataSource={this.state.data} onChange={onChange} bordered/>
                    </div>
                    <Modal
                        title="新建用户"
                        visible={this.state.addUserModalVisible}
                        width={600}
                        onCancel={() => {
                            this.modalToggle(false)
                        }}
                        onOk={this.handleSubmit}
                        destroyOnClose={true}
                        maskClosable={false}
                        confirmLoading={this.state.addLoading}
                    >

                        <AddUserForm  wrappedComponentRef={(inst) => {
                            this.addUserForm = inst;
                        }}/>

                    </Modal>
                </Spin>
            </div>
        )
    }
}

export default UserList;