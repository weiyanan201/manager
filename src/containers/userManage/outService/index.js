/**
 * outService管理页面
 */

import React , { Component } from 'react';
import {Pagination, Input, Button, Table, Modal, message, Spin, Divider} from 'antd';
import util from "../../../util/util";
import axios from '../../../util/axios';
import {TenantType} from "../../../config";
import AddOutServiceForm from './component/addOutServiceForm';
const Search = Input.Search;
const confirm = Modal.confirm;

class OutService extends Component{

    constructor(props){
        super(props);
        this.state = {
            columns : [
                {
                    title: 'id',
                    dataIndex: 'id',
                    align: 'center',
                },{
                    title: '名称',
                    dataIndex: 'name',
                    align: 'center',
                },{
                    title: 'token',
                    dataIndex: 'token',
                    align: 'center',
                },{
                    title: 'ownerId',
                    dataIndex: 'ownerId',
                    align: 'center',
                },{
                    title: '创建时间',
                    dataIndex: 'createTime',
                    align: 'center',
                    defaultSortOrder: 'descend',
                    render: createTime => util.formatDate(createTime),
                    sorter: (a, b) => a.createTime - b.createTime,
                },{
                    title: '操作',
                    align: 'center',
                    render: (text, record) => (
                        <span>
                            <a onClick={()=>this.handleDelete(record.name,record.id)}>删除</a>
                        </span>
                    )
                }
            ],
            dataBack:[],
            data:[],
            modalVisible:false,
            addLoading:false,
            globalLoading:false,
        };
        this.modalToggle = this.modalToggle.bind(this);
        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount(){
        this.setState({
            globalLoading:true
        });
        axios.get("/outService/getList")
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
            //顾虑
            data = dataBack.filter(item=>item.name.indexOf(value)!==-1);
        }
        this.setState({
            data
        })
    };

    modalToggle(toggle){
        this.setState({
            modalVisible:toggle,
        })
    }
    //添加
    handleAddSubmit = () => {

        this.addOutServiceForm.props.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            const data = this.addOutServiceForm.props.form.getFieldsValue();
            this.setState({
                addLoading : true,
                globalLoading:true,
            });
            axios.postByJson("/outService/addOutService",{...data})
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

    handleDelete = (name,id) => {
        console.log(name,id);

        const _this = this;
        confirm({
            title: '删除确认',
            autoFocusButton:"cancel",
            content: `是否删除用户：${name}`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.setState({
                    globalLoading:true
                });
                axios.post("/outService/deleteOutService", {outerServiceId: id})
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
                    })
            }
        });

    };

    render(){
        console.log(this.state.data);
        return(
            <div>
                <Spin spinning={this.state.globalLoading}>
                    <div>
                        用户名：<Search
                        placeholder="input search text"
                        onChange={(e) => {
                            this.handleFilterSearch(e.target.value)
                        }}
                        enterButton
                        style={{width: 200}}
                    />
                        <Button type='primary'  onClick={()=>this.modalToggle(true)} style={{float:"right"}}>新建outService</Button>
                    </div>

                    <div >
                        <Table columns={this.state.columns} dataSource={this.state.data}  bordered/>
                    </div>

                    <Modal
                        title="新建outService"
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

                        <AddOutServiceForm  wrappedComponentRef={(inst) => {
                            this.addOutServiceForm = inst;
                        }}/>

                    </Modal>

                </Spin>
            </div>
        );
    }
}

export default OutService;