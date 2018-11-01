import React,{ Component } from 'react';
import { Input, Button, Table, Modal, message, Spin, Divider} from 'antd';
import util from "../../../util/util";
import axios from "../../../util/axios";

import AddMobileGameForm from './component/addMobileGameForm';

const Search = Input.Search;
const NEW_TITLE = "新建手游类型";
const EDIT_TITLE = "更新手游类型";

class MobileGameList extends Component {

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
                    title: '描述',
                    dataIndex: 'desc',
                    align: 'center',
                },{
                    title: '操作人',
                    dataIndex: 'operator',
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
                    title: '操作',
                    align: 'center',
                    render: (text, record) => (
                        <a onClick={()=>this.modalToggle(true,EDIT_TITLE,record)}>编辑</a>
                    )
                }
            ],
            modalVisible:false,
            modalTitle : NEW_TITLE,
            modalFormObject:{},
            globalLoading:false,
            data:[],
            dataBack:[],
            addLoading:false
        };
        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.modalToggle = this.modalToggle.bind(this);
    }

    componentDidMount() {
        this.setState({
            globalLoading: true
        });
        axios.get("/mobileGame/getList")
            .then(res => {
                const data = res.data.data;
                const dataBack = data.slice(0);
                this.setState({
                    data, dataBack, globalLoading: false
                })
            })
            .catch(()=>{
                this.setState({
                    globalLoading:false
                });
            })
    }

    modalToggle = (modalVisible,modalTitle=NEW_TITLE,modalFormObject={})=>{
        this.setState({
            modalVisible,modalTitle,modalFormObject
        })
    };

    handleFilterSearch = (value)=> {
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

    handleAddSubmit = ()=>{
        this.addMobileGameForm.props.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.setState({
                addLoading : true,
                globalLoading:true,
            });
            axios.postByJson("/mobileGame/addMobileGame",{...values})
                .then(res=>{
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
                        data,dataBack,
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
    };

    render(){
        return (
            <div>
                <Spin spinning={this.state.globalLoading}>
                    <div>
                        游戏名：<Search
                        placeholder="input search text"
                        onChange={(e) => {
                            this.handleFilterSearch(e.target.value)
                        }}
                        enterButton
                        style={{width: 200}}
                    />
                        <Button type='primary'  onClick={()=>this.modalToggle(true)} style={{float:"right"}}>新建手游类型</Button>
                    </div>

                    <div >
                        <Table columns={this.state.columns} dataSource={this.state.data}  bordered/>
                    </div>

                    <Modal
                        title={this.state.modalTitle}
                        visible={this.state.modalVisible}
                        width={600}
                        onCancel={()=>this.modalToggle(false)}
                        onOk={this.handleAddSubmit}
                        destroyOnClose={true}
                        maskClosable={false}
                        confirmLoading={this.state.addLoading}
                    >
                        <AddMobileGameForm wrappedComponentRef={(inst) => {this.addMobileGameForm = inst;}}
                                           formObject={this.state.modalFormObject}
                        />

                    </Modal>

                </Spin>
            </div>
        );
    }
}

export default MobileGameList;