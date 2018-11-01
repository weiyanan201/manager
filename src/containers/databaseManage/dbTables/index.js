import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Table, Modal, message, Spin, Divider} from 'antd';

import NavLink from '../../../components/NavLink/NavLink';
import util from "../../../util/util";
import axios from "../../../util/axios";

import {StorageType, ProduceType} from '../../../config';
import {pushBread} from "../../../reducers/bread.redux";

const Search = Input.Search;
const confirm = Modal.confirm;

@connect(
     null,
    { pushBread }
)
class DbTableList extends Component {

    constructor(props){
        super(props);
        this.state = {
            columns : [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    align: 'center',
                },{
                    title: '表名',
                    dataIndex: 'name',
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
                    title: 'produceType',
                    dataIndex: 'produceType',
                    align: 'center',
                    filters:Object.values(ProduceType).map(val=>{
                        return {
                            "text":val,
                            "value":val
                        }
                    }),
                    onFilter: (value, record) => record.usage.indexOf(value) === 0,
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
                    title: '表详情',
                    align: 'center',
                    render: (text, record) => (
                        <NavLink target={`/db/list/${this.state.databaseId}/${record.id}`} linkText={"详情"}/>
                    )
                }
            ],
            data:[],
            dataBack:[],
            databaseId:'',
            databaseName:'',
            globalLoading:false,
        };
        this.handleDeleteDb = this.handleDeleteDb.bind(this);
    }

    componentDidMount() {

        let databaseId = this.props.match.params.databaseId;
        this.setState({
            globalLoading: true
        });
        axios.get("/db/getTablesByDb",{databaseId:databaseId})
            .then(res => {
                const result = res.data.data;
                const dbName = result.dbName;
                const tables = result.tables;
                const dataBack = tables.slice(0);
                const breadUrl = this.props.match.url;
                const breadObj = {[breadUrl]: `${dbName}中的表`};
                this.props.pushBread(breadObj);
                this.setState({
                    data:tables, dataBack, globalLoading: false,databaseId,databaseName:dbName
                })
            })
            .catch(()=>{
                this.setState({
                    globalLoading:false
                });
            })
    }

    handleDeleteDb = ()=> {
        const _this = this;
        confirm({
            title: '删除确认',
            autoFocusButton:"cancel",
            content: `是否删除数据库：${_this.state.databaseName}`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.setState({
                    globalLoading:true
                });
                axios.post("/db/deleteDb", {databaseId: _this.state.databaseId})
                    .then(() => {
                        //删除成功，从data中去掉
                        message.success("删除成功");
                        _this.props.history.push("/db/list");
                    })
                    .catch(()=>{
                        _this.setState({
                            globalLoading:false
                        })
                    });
            }
        });
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
                        enterButton
                        style={{width: 200}}
                    />
                        <Button type='danger'  onClick={this.handleDeleteDb} style={{float:"right"}}>删除数据库</Button>
                    </div>

                    <div >
                        <Table columns={this.state.columns} dataSource={this.state.data}  bordered/>
                    </div>


                </Spin>
            </div>
        );
    }
}

export default DbTableList;