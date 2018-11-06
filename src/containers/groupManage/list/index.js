/**
 * group 管理页面
 */

import React , { Component } from 'react';
import { Input, Button, Table, Modal, message, Spin, Divider} from 'antd';
import util from "../../../util/util";
import axios from "../../../util/axios";

import AddGroupForm from './component/addGroupForm';

const Search = Input.Search;
const confirm = Modal.confirm;

const NEW_TITLE = "新建组";
const EDIT_TITLE = "编辑组";

class GroupList extends Component{

    constructor(props){
        super(props);
        this.handleFilterSearch = this.handleFilterSearch.bind(this);
        this.modalToggle = this.modalToggle.bind(this);
        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.state = {
            columns : [
                {
                    title: '组名',
                    dataIndex: 'name',
                    align: 'center',
                },{
                    title: '描述',
                    dataIndex: 'desc',
                    align: 'center',
                },{
                    title: 'app',
                    dataIndex: 'appId',
                    render: appId => this.state.allApp[appId],
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
                    align: 'center',
                    defaultSortOrder: 'descend',
                    render: updateTime => util.formatDate(updateTime),
                    sorter: (a, b) => a.updateTime - b.updateTime,
                },{
                    title: '操作',
                    align: 'center',
                    render: (text, record) => (
                        <span>
                            <a onClick={()=>this.modalToggle(true,EDIT_TITLE,record)}>编辑</a><Divider type="vertical" />
                            <a onClick={()=>this.handleDelete(record.name,record.id)}>删除</a>
                        </span>
                    )
                }
            ],
            dataBack:[],
            data:[],
            allApp:{},
            restApp:{},
            modalVisible:false,
            modalTitle:NEW_TITLE,
            addLoading:false,
            globalLoading:false,
            formObject:{}
        }
    }

    componentDidMount(){
        this.setState({
            globalLoading:true
        });
        axios.get("/group/getList")
            .then(res=>{
                const result = res.data.data;
                const allApp = result.allApp;
                const restApp = result.restApp;
                const data = result.group;
                const dataBack = data.slice(0);
                this.setState({
                    data,dataBack,allApp,restApp,globalLoading:false
                })
            }).catch(()=>{
                this.setState({
                    globalLoading:false
                });
            })
    };

    handleFilterSearch = (value)=> {
        let data = [];
        const dataBack = this.state.dataBack;
        if (util.isEmpty(value)){
            data = dataBack.slice(0);
        }else{
            //顾虑
            data = dataBack.filter(item=>item.name.indexOf(value)!==-1);
        }
        this.setState({
            data
        })
    };

    /**
     * 对话框--新增和编辑
     */
    modalToggle(toggle,title=NEW_TITLE,info={}){
        console.log(toggle,title,info);
        this.setState({
            modalVisible:toggle,
            modalTitle:title,
            formObject:info
        })
    };

    handleAddSubmit = () => {
        this.addGroupForm.props.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            const data = this.addGroupForm.props.form.getFieldsValue();
            this.setState({
                addLoading : true,
                globalLoading:true,
            });
            axios.postByJson("/group/addGroup",{...data})
                .then(res=>{
                    //添加成功
                    //data中插入记录 关闭modal
                    const newInfo = res.data.data;
                    const data = this.state.data;
                    const dataBack = this.state.dataBack;

                    let dataIndex = data.findIndex(item =>{
                        if (item.id===newInfo.id){
                            return true;
                        }
                    });
                    let backIndex = dataBack.findIndex(item=>{
                        if (item.id===newInfo.id){
                            return true;
                        }
                    });
                    if (backIndex===-1){
                        //添加数据
                        data.unshift(newInfo);
                        dataBack.unshift(newInfo);
                    }else{
                        //更新数据
                        dataBack[backIndex] = newInfo;
                        if (dataIndex!==-1){
                            data[dataIndex] = newInfo;
                        }
                    }

                    this.setState({
                        data:data,
                        dataBack:dataBack,
                        modalVisible:false,
                        addLoading:false,
                        globalLoading:false
                    });
                    message.success("创建成功!");
                }).catch(()=>{
                    this.setState({
                        modalVisible:false,
                        addLoading:false,
                        globalLoading:false
                    })
            });
        });
    };

    handleDelete = (name,id) =>{
        const _this = this;
        confirm({
            title: '删除确认',
            autoFocusButton:"cancel",
            content: `是否删除group：${name}`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.setState({
                    globalLoading:true
                });
                axios.post("/group/deleteGroup", {groupId: id})
                    .then(() => {
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
                    });
            }
        });


    };

    render(){
        return (
            <div>
                <Spin spinning={this.state.globalLoading}>
                    <div>
                        组名：<Search
                        placeholder="input search text"
                        onChange={(e) => {
                            this.handleFilterSearch(e.target.value)
                        }}
                        enterButton
                        style={{width: 200}}
                    />
                        <Button type='primary'  onClick={()=>this.modalToggle(true)} style={{float:"right"}}>新建组</Button>
                    </div>

                    <div >
                        <Table columns={this.state.columns} dataSource={this.state.data}  bordered/>
                    </div>

                    <Modal
                        title="新建组"
                        visible={this.state.modalVisible}
                        width={600}
                        onCancel={() => {
                            this.modalToggle(false)
                        }}
                        onOk={this.handleAddSubmit}
                        destroyOnClose={true}
                        maskClosable={false}
                        confirmLoading={this.state.addLoading}
                    >
                        <AddGroupForm restApp={this.state.restApp}
                                      formObject={this.state.formObject}
                                      allApps={this.state.allApp}
                            wrappedComponentRef={(inst) => {
                            this.addGroupForm = inst;
                        }}/>
                    </Modal>

                </Spin>
            </div>
        )
    }
}


export default GroupList;