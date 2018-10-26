/**
 * app 管理页面
 */

import React,{ Component } from 'react';
import { Input, Button, Table, Modal, message, Spin, Divider} from 'antd';
import util from "../../../util/util";
import axios from "../../../util/axios";

import AddAppForm from './component/addAppForm';

const Search = Input.Search;
const confirm = Modal.confirm;

const NEW_TITLE = "新建组";
const EDIT_TITLE = "编辑组";

class AppList extends Component {

    constructor(props){
        super(props);
        this.state = {
            columns : [
                {
                    title: 'id',
                    dataIndex: 'id',
                    align: 'center',
                }, {
                    title: '应用名称',
                    dataIndex: 'appName',
                    align: 'center',
                },{
                    title: '应用缩写',
                    dataIndex: 'appAbbrName',
                    align: 'center',
                },{
                    title: '描述',
                    dataIndex: 'appDesc',
                    align: 'center',
                },{
                    title: '类型',
                    dataIndex: 'appType',
                    align: 'center',
                },{
                    title: '来源',
                    dataIndex: 'appSource',
                    align: 'center',
                },{
                    title: '运营归属',
                    dataIndex: 'operationMode',
                    align: 'center',
                },{
                    title: '工作室',
                    dataIndex: 'parentId',
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
                    title: '操作人员',
                    dataIndex: 'operator',
                    align: 'center',
                },{
                    title: '操作',
                    align: 'center',
                    render: (text, record) => (
                        <span>
                            <a >编辑</a><Divider type="vertical" />
                            <a >删除</a>
                        </span>
                    )
                }
            ],
            appType:[],
            clientType:[],
            graphicsMode:[],
            operationMode:[],
            appSource:[],
            mobileGameType:[],
            parentId:[],
            data:[],
            dataBack:[],
            modalVisible:false,
            modalTitle:NEW_TITLE,
            addLoading:false,
            globalLoading:false,
            formObject:{}
        };
        this.handleFilterSearch = this.handleFilterSearch.bind(this);
    }
    
    componentDidMount(){
        this.setState({
            globalLoading:true
        });
        axios.get("/app/getList")
            .then(res=>{
                const result = res.data.data;
                console.log(result);
                const appType = result.appType;
                console.log(appType);
                const clientType = result.clientType;
                const graphicsMode = result.graphicsMode;
                const operationMode = result.operationMode;
                const appSource = result.appSource;
                const mobileGameType = result.mobileGameType;
                // const parentId = result.parentId;
                const parentId = [{88888888:"传奇工作室"},{88888889:"传世工作室"},{88888890:"D.N.A工作室"}]

                const data = result.data;
                const dataBack = data.slice(0);
                this.setState({
                    data,dataBack,appType,clientType,graphicsMode,operationMode,appSource,mobileGameType,parentId,
                    globalLoading:false
                })
            }).catch(()=>{
            this.setState({
                globalLoading:false
            });
        })
    }


    /**
     * 对话框--新增和编辑
     */
    modalToggle(toggle,title=NEW_TITLE,info={}){
        this.setState({
            modalVisible:toggle,
            modalTitle:title,
            formObject:info
        })
    };

    handleFilterSearch = (value)=> {
        let data = [];
        const dataBack = this.state.dataBack;
        if (util.isEmpty(value)){
            data = dataBack.slice(0);
        }else{
            //顾虑
            data = dataBack.filter(item=>item.appName.indexOf(value)!==-1);
        }
        this.setState({
            data
        })
    };

    handleAddSubmit = () => {
        this.addAppForm.props.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            console.log(values);
            const data = this.addAppForm.props.form.getFieldsValue();
            this.setState({
                addLoading : true,
                globalLoading:true,
            });
            axios.postByJson("/app/addApp",{...data})
                .then(res=>{
                    // 添加成功
                    // data中插入记录 关闭modal
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

    render(){
        console.log(this.state);
        return(
            <div>
                <div>
                    App：<Search
                    placeholder="input search text"
                    onChange={(e) => {
                        this.handleFilterSearch(e.target.value)
                    }}
                    enterButton
                    style={{width: 200}}
                />
                    <Button type='primary'  onClick={()=>this.modalToggle(true)} style={{float:"right"}}>新建App</Button>
                </div>

                <div >
                    <Table columns={this.state.columns} dataSource={this.state.data}  bordered />
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
                    <AddAppForm apps={this.state.appData} info={this.state.formObject}
                                appType={this.state.appType}
                                clientType={this.state.clientType}
                                graphicsMode = {this.state.graphicsMode}
                                operationMode = {this.state.operationMode}
                                appSource = {this.state.appSource}
                                mobileGameType = {this.state.mobileGameType}
                                parentId = {this.state.parentId}
                                  wrappedComponentRef={(inst) => {
                                      this.addAppForm = inst;
                                  }}/>
                </Modal>

            </div>
        );
    }
};

export default AppList;