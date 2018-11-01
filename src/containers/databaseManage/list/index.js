import React,{ Component } from 'react';
import { Input, Button, Table, Modal, message, Spin} from 'antd';
import util from "../../../util/util";
import axios from "../../../util/axios";

import NavLink from '../../../components/NavLink/NavLink';
import AddDbForm from './component/addDbForm';
import {StorageType, ProduceType} from '../../../config';

const Search = Input.Search;

class DatabaseList extends Component {

    constructor(props){
        super(props);
        this.state = {
            columns : [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    align: 'center',
                },{
                    title: '名称',
                    dataIndex: 'name',
                    align: 'center',
                },{
                    title: '描述',
                    dataIndex: 'comment',
                    align: 'center',
                },{
                    title: '存储介质',
                    dataIndex: 'storageType',
                    align: 'center',
                    filters:Object.values(StorageType).map(val=>{
                        return {
                            "text":val,
                            "value":val
                        }
                    }),
                    onFilter: (value, record) => record.storageType.indexOf(value) === 0,
                },{
                    title: 'usage',
                    dataIndex: 'usage',
                    align: 'center',
                    filters:Object.values(ProduceType).map(val=>{
                        return {
                            "text":val,
                            "value":val
                        }
                    }),
                    onFilter: (value, record) => record.usage.indexOf(value) === 0,
                },{
                    title: 'owner',
                    dataIndex: 'ownerId',
                    render: ownerId => this.state.tenants[`${ownerId}`],
                    align: 'center',
                },{
                    title: '表详情',
                    align: 'center',
                    render: (text, record) => (
                            <NavLink target={`/db/list/${record.id}`} linkText={"详情"}/>
                    )
                }
            ],
            modalVisible:false,
            globalLoading:false,
            data:[],
            dataBack:[],
            tenants:[],
            addLoading:false
        }
    }

    componentDidMount() {
        this.setState({
            globalLoading: true
        });
        axios.get("/db/getList")
            .then(res => {
                const result = res.data.data;
                const dbs = result.dbs;
                const tenants = result.tenants;
                const dataBack = dbs.slice(0);
                this.setState({
                    data:dbs, dataBack,tenants, globalLoading: false
                })
            })
            .catch(()=>{
                this.setState({
                    globalLoading:false
                });
            })
    }

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

    handleAddSubmit = ()=>{
        this.addDbForm.props.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.setState({
                addLoading : true,
                globalLoading:true,
            });
            axios.postByJson("/db/addDb",{...values})
                .then(res=>{
                    const newInfo = res.data.data;
                    const data = this.state.data;
                    const dataBack = this.state.dataBack;
                    data.unshift(newInfo);
                    dataBack.unshift(newInfo);
                    this.setState({
                        data:data,
                        dataBack:dataBack,
                        modalVisible:false,
                        addLoading:false,
                        globalLoading:false
                    });
                    message.success("创建成功!");
                })
                .catch((error)=>{
                    this.setState({
                        modalVisible:false,
                        addLoading:false,
                        globalLoading:false
                    })
                })
        })
    }

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
                        <Button type='primary'  onClick={()=>this.setState({modalVisible:true})} style={{float:"right"}}>新建数据库</Button>
                    </div>

                    <div >
                        <Table columns={this.state.columns} dataSource={this.state.data}  bordered/>
                    </div>

                    <Modal
                        title="添加数据库"
                        visible={this.state.modalVisible}
                        width={600}
                        onCancel={()=>this.setState({modalVisible:false})}
                        onOk={this.handleAddSubmit}
                        destroyOnClose={true}
                        maskClosable={false}
                        confirmLoading={this.state.addLoading}
                    >
                        <AddDbForm wrappedComponentRef={(inst) => {this.addDbForm = inst;}}
                                   tenants = {this.state.tenants}
                        />

                    </Modal>

                </Spin>
            </div>
        );
    }
}

export default DatabaseList;