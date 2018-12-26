/**
 * app 管理页面
 * 所有人都能看到，PLATFORM+GLOBAL_DEVELOPER 可以操作，其他角色隐藏操作按钮
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Input, Button, Table, Modal, message, Spin, Divider} from 'antd';

import util from "../../../util/util";
import axios from "../../../util/axios";
import AddAppForm from './component/addAppForm';
import {TenantType} from '../../../config'

import CommonTable from '../../../components/commonTable';
import globalStyle from '../../../index.less';

const Search = Input.Search;
const confirm = Modal.confirm;

const NEW_TITLE = "新建APP";
const EDIT_TITLE = "编辑APP";
const INFO_TITLE = "APP详情";

@connect(
    state => state.auth,
    {}
)
class AppList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'id',
                    dataIndex: 'id',
                    align: 'center',
                    width:'10%'
                }, {
                    title: '应用名称',
                    dataIndex: 'appName',
                    align: 'center',
                    width:'10%',
                    className: globalStyle.resultColumns,
                    render:
                        (text, record) => (
                            <div title={record.appName} className={globalStyle.resultColumnsDiv}>{record.appName}</div>
                        ),
                }, {
                    title: '应用缩写',
                    dataIndex: 'appAbbrName',
                    align: 'center',
                    width:'10%',
                    className: globalStyle.resultColumns,
                    render:
                        (text, record) => (
                            <div title={record.appAbbrName} className={globalStyle.resultColumnsDiv}>{record.appAbbrName}</div>
                        ),
                }, {
                    title: '描述',
                    dataIndex: 'appDesc',
                    align: 'center',
                    width:'10%',
                    className: globalStyle.resultColumns,
                    render:
                        (text, record) => (
                            <div title={record.appDesc} className={globalStyle.resultColumnsDiv}>{record.appDesc}</div>
                        ),
                }, {
                    title: '类型',
                    dataIndex: 'appType',
                    align: 'center',
                    width:'8%'
                }, {
                    title: '来源',
                    dataIndex: 'appSource',
                    align: 'center',
                    width:'8%'
                }, {
                    title: '运营归属',
                    dataIndex: 'operationMode',
                    align: 'center',
                    width:'10%',
                    className: globalStyle.resultColumns,
                    render:
                        (text, record) => (
                            <div title={record.operationMode} className={globalStyle.resultColumnsDiv}>{record.operationMode}</div>
                        ),
                }, {
                    title: '工作室',
                    dataIndex: 'parentId',
                    render: parentId => {
                        const obj = Object.keys(this.state.parentId).find(i=>i===parentId+"");
                        if (!util.isEmpty(obj)) {
                            return this.state.parentId[parentId];
                        }
                    },
                    align: 'center',
                    width:'10%'
                }, {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    align: 'center',
                    className: globalStyle.resultColumns,
                    render:
                        (text, record) => (
                            <div title={record.createTime} className={globalStyle.resultColumnsDiv}>{util.formatDate(record.createTime)}</div>
                        ),
                    sorter: (a, b) => a.createTime - b.createTime,
                    width:'15%'
                }, {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    align: 'center',
                    defaultSortOrder: 'descend',
                    className: globalStyle.resultColumns,
                    render:
                        (text, record) => (
                            <div title={record.updateTime} className={globalStyle.resultColumnsDiv}>{util.formatDate(record.updateTime)}</div>
                        ),
                    sorter: (a, b) => a.updateTime - b.updateTime,
                    width:'15%'
                }, {
                    title: '操作人员',
                    dataIndex: 'operator',
                    align: 'center',
                    width:'10%',
                    className: globalStyle.resultColumns,
                    render:
                        (text, record) => (
                            <div title={record.operator} className={globalStyle.resultColumnsDiv}>{record.operator}</div>
                        ),
                }, {
                    title: '操作',
                    align: 'center',
                    render: (text, record) => (
                        this.hasOperationAuth()?
                            <span>
                                <a onClick={()=>this.modalToggle(true,EDIT_TITLE,record)}>编辑</a><Divider type="vertical"/>
                                <a onClick={()=>this.handleDelete(record.id,record.appName)}>删除</a>
                            </span>
                            :
                            <span>
                                <a onClick={()=>this.modalToggle(true,INFO_TITLE,record)}>详情</a>
                            </span>
                    ),
                    width:'12%',

                }
            ],
            appType: [],
            clientType: [],
            graphicsMode: [],
            operationMode: [],
            appSource: [],
            mobileGameType: [],
            parentId: [],
            data: [],
            dataBack: [],
            modalVisible: false,
            modalTitle: NEW_TITLE,
            modalFormObject:{},
            modalReadOnly:false,
            addLoading: false,
            globalLoading: false
        };
        this.handleFilterSearch = this.handleFilterSearch.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.hasOperationAuth = this.hasOperationAuth.bind(this);
    }

    componentDidMount() {
        this.setState({
            globalLoading: true
        });
        axios.get("/app/getList")
            .then(res => {
                const result = res.data.data;
                const appType = result.appType;
                const clientType = result.clientType;
                const graphicsMode = result.graphicsMode;
                const operationMode = result.operationMode;
                const appSource = result.appSource;
                const mobileGameType = result.mobileGameType;
                const parentId = result.parentId;

                const keySet = new Set();
                const deptFilters = [];
                Object.keys(parentId).map(key=>{
                    if (!keySet.has(key)){
                        keySet.add(key);
                        deptFilters.push({
                            "text":parentId[key],
                            "value":key
                        });
                    }
                });
                const columns = this.state.columns;
                columns.forEach(value=>{
                    if (value.title==='工作室'){
                        value.filters=deptFilters;
                        value.onFilter=(value, record) => {
                            return record.parentId+""===value;
                        }
                    }
                });

                const data = result.data;
                const dataBack = data.slice(0);
                this.setState({
                    data,
                    dataBack,
                    appType,
                    clientType,
                    graphicsMode,
                    operationMode,
                    appSource,
                    mobileGameType,
                    parentId,
                    globalLoading: false
                })
            }).catch(() => {
            this.setState({
                globalLoading: false
            });
        })
    }


    /**
     * 对话框--新增和编辑
     */
    modalToggle(toggle, title = NEW_TITLE, modalFormObject = {}) {
        let readonly = false;
        if (title===INFO_TITLE){
            readonly = true;
        }
        this.setState({
            modalVisible: toggle,
            modalTitle: title,
            modalFormObject: modalFormObject,
            modalReadOnly:readonly,
        })
    };

    handleDelete=(appId,appName)=>{
        const _this = this;
        confirm({
            title: '删除确认',
            autoFocusButton:"cancel",
            content: `是否删除：${appName}`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.setState({
                    globalLoading:true
                });
                axios.post("/app/deleteApp", {appId: appId})
                    .then(() => {
                        //删除成功，从data中去掉
                        message.success("删除成功");
                        const data = _this.state.data;
                        const dataBack = _this.state.dataBack;
                        const index = data.findIndex(item => item.id === appId);
                        data.splice(index, 1);

                        const indexBack = dataBack.findIndex(item => item.id === appId);
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

    handleFilterSearch = (value) => {
        let data = [];
        const dataBack = this.state.dataBack;
        if (util.isEmpty(value)) {
            data = dataBack.slice(0);
        } else {
            //过滤
            data = dataBack.filter(item => item.appName.indexOf(value) !== -1 || (!util.isEmpty(item.py)&&item.py.indexOf(value)!==-1));
        }
        this.setState({
            data
        })
    };

    handleAddSubmit = () => {

        if (this.state.modalReadOnly===true){
            this.setState({
                modalVisible: false,
            })
            return ;
        }

        this.addAppForm.props.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.setState({
                addLoading: true,
                globalLoading: true,
            });
            axios.postByJson("/app/addApp", {...values})
                .then(res => {
                    // 添加成功
                    // data中插入记录 关闭modal
                    const newInfo = res.data.data;
                    const data = this.state.data;
                    const dataBack = this.state.dataBack;

                    //id  非数据库自然id，与其他的处理有区别
                    const originalID = values['originalID'];
                    if (util.isEmpty(originalID)){
                        data.unshift(newInfo);
                        dataBack.unshift(newInfo);
                    }else{
                        //更新数据
                        let dataIndex = data.findIndex(item =>{
                            if (item.id===originalID){
                                return true;
                            }
                        });
                        let backIndex = dataBack.findIndex(item=>{
                            if (item.id===originalID){
                                return true;
                            }
                        });
                        dataBack[backIndex] = newInfo;
                        if (dataIndex!==-1){
                            data[dataIndex] = newInfo;
                        }
                    }

                    this.setState({
                        data: data,
                        dataBack: dataBack,
                        modalVisible: false,
                        addLoading: false,
                        globalLoading: false
                    });
                    message.success("创建成功!");
                }).catch(() => {
                    this.setState({
                        modalVisible: false,
                        addLoading: false,
                        globalLoading: false
                    })
            });
        });
    };

    hasOperationAuth=()=>{
        return this.props.role === TenantType.PLATFORM.key || this.props.role === TenantType.GLOBAL_DEVELOPER.key;
    };

    render() {
        return (
            <div>
                <Spin spinning={this.state.globalLoading}>
                    <div>
                        App：<Search
                        placeholder="input search text"
                        onChange={(e) => {
                            this.handleFilterSearch(e.target.value)
                        }}
                        enterButton
                        style={{width: 200}}
                    />
                        <Button type='primary' onClick={() => this.modalToggle(true)}
                                hidden={!this.hasOperationAuth()}
                                style={{float: "right"}}>新建App</Button>
                    </div>

                    <div className = {globalStyle.tableToSearchPadding}>
                        <CommonTable columns={this.state.columns} dataSource={this.state.data} />
                    </div>

                    <Modal
                        title={this.state.modalTitle}
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
                        <AddAppForm apps={this.state.appData} formObject={this.state.modalFormObject}
                                    appType={this.state.appType}
                                    clientType={this.state.clientType}
                                    graphicsMode={this.state.graphicsMode}
                                    operationMode={this.state.operationMode}
                                    appSource={this.state.appSource}
                                    mobileGameType={this.state.mobileGameType}
                                    parentId={this.state.parentId}
                                    readOnly={this.state.modalReadOnly}
                                    wrappedComponentRef={(inst) => {
                                        this.addAppForm = inst;
                                    }}/>
                    </Modal>
                </Spin>
            </div>
        );
    }
};

export default AppList;