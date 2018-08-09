/**
 * 手动建表页面
 */

import React from 'react';
import { connect } from 'react-redux';
import { getGroupList} from "../../reducers/table.redux";

import {Button , Card,Spin,Table,Cascader,Form,InputNumber,Input,Popconfirm,Select,Row,message,Modal,Collapse,Checkbox } from 'antd';
import GroupSelect  from '../../components/groupSelect/GroupSelect';
import EditableTable from '../../components/BaseTable/EditableTable';
import tableUtil from '../../util/tableUtil';
import config from '../../util/config';

import axios from '../../util/axios';
import util from '../../util/util';

import style from './table.less'

const Option = Select.Option;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

const tableColumns = {
    "HIVE":[{
        title: 'name',
        dataIndex: 'name',
        width: '30%',
        editable: true,
        columnType:'input',
        required:true
    }, {
        title: '类型',
        dataIndex: 'type',
        editable: true,
        columnType:'fieldType',
        storageType:"HIVE",
        required:true,
        render: (text) => <span>{text}</span>
    }, {
        title: '注释',
        dataIndex: 'comment',
        editable: true,
        columnType:'input',
        required:false
    }, {
        title: '分区字段',
        dataIndex: 'isPartition',
        editable: true,
        columnType:'checkbox',
        required:true,
        render: (text) => <span><Checkbox checked={text==='true'} /></span>
    },],
    "PHOENIX":[
        {
            title: 'name',
            dataIndex: 'name',
            width: '30%',
            editable: true,
            columnType:'input'
        }, {
            title: '类型',
            dataIndex: 'type',
            editable: true,
            columnType:'fieldType',
            storageType:"PHOENIX"
        }, {
            title: '注释',
            dataIndex: 'comment',
            editable: true,
            columnType:'input',
        },{
            title:"主键",
            dataIndex: 'primaryKey',
            editable: true,
            columnType:'checkbox',
        },
    ],
    "ES":[
        {
            title: 'name',
            dataIndex: 'name',
            width: '30%',
            editable: true,
            columnType:'input'
        }, {
            title: '类型',
            dataIndex: 'type',
            editable: true,
            columnType:'fieldType',
            storageType:"ES"
        }, {
            title: '注释',
            dataIndex: 'comment',
            editable: true,
            columnType:'input',
        }, {
            title: '可为空',
            dataIndex: 'isNull',
            editable: true,
            columnType:'checkbox',
        },
    ],
    "":[]
}

export default class CreateTable extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tableName:'',
            comment:'',
            groupId:'',
            storageType:'HIVE',
            storageFormat:'ORC',
            separator:'\\t',
            db:'',
            dbName:'',
            columns:[],
            loading : false,
            advancedKey:[],
            replicas:1,
            shards:5,
        };
    }

    handleChangeText(key,value) {
        this.setState({
            ...this.state,
            [key]:value
        });
        console.log(this.state.tableName);
    }

    handleChangeGroup = (index)=>{
        console.log("handleChangeGroup");
        let oldIsTmp = this.state.groupId===config.TEMP_GROUP_ID.toString();
        let newIsTmp = index === config.TEMP_GROUP_ID.toString();
        let change = (oldIsTmp&&!newIsTmp) || (!oldIsTmp&&newIsTmp);
        console.log("change,",change);
        this.setState({
            groupId:index,
            db:change?'':this.state.db
        })
    };
    //联动数据库选择
    handleSelectStorageType=(item)=>{
        this.setState({
            storageType:item,
            db:'',
            dbName:''
        })
    };
    //选取Format
    handleSelectStorageFormat=(item)=>{
        this.setState({
            storageFormat:item,
        })
    }

    handleSelectDb=(item,object)=>{
        console.log(item,object.props.children);
        this.setState({
            db:item,
            dbName:object.props.children
        })
    };

    displayRender=(label)=>{
        if (label && label.length===2){
            return `${label[0]}<${label[1]}>`
        }else if(label){
            return label[0];
        }
    };

    handleSubmit=()=>{
        console.log(this.state);
        let errorMessage = [];
        const {groupId,storageType,comment,tableName,db,columns} = this.state;

        if (util.isEmpty(tableName)) {
            errorMessage.push("请填写表名称");
        }
        if (util.isEmpty(comment)) {
            errorMessage.push("请填写表注释");
        }
        if (util.isEmpty(groupId)){
            errorMessage.push("请选择分组");
        }
        if (util.isEmpty(storageType)) {
            errorMessage.push("请选择存储介质");
        }
        if (util.isEmpty(db)) {
            errorMessage.push("请选择存数据库");
        }
        if(columns===null || columns.length===0){
            errorMessage.push("字段列表不能为空");
        }
        let filterColumns ;
        //检查字段 过滤空行
        if (columns!==null && columns.length>0){
            filterColumns = columns.filter(item=>{
                return !util.isEmpty(item.name) || !util.isEmpty(item.type) || !util.isEmpty(item.comment)
            })
            filterColumns.map(item=>{
                const en = util.isEmpty(item.name);
                const et = util.isEmpty(item.type);
                if (!en && et){
                    errorMessage.push("字段:"+item.name+"未指定字段类型");
                }else if(en && !et){
                    errorMessage.push("有表字段未指定名称")
                }
                item.type = this.displayRender(item.type);
            })
        }

        if(!util.isEmpty(errorMessage)){
            Modal.error({
                title: "错误提示",
                content: util.getWordwrapContent(errorMessage)
            })
            return ;
        }
        this.setState({
            loading:true
        })
        const result = axios.postByJson("/table/createTable",{...this.state,columns:filterColumns});
        result.then(()=>{
            this.setState({
                loading:false
            })
            message.success("创建成功!")
        }).catch(()=>{
            this.setState({
                loading:false
            })
            console.log("error");
        })

    }

    //传入子组件的回调函数
    handeModifyColumn=(dataSource)=>{
        this.setState({
            columns:dataSource
        })
    }

    //高级属性开关
    handleToggleAdvanced=()=>{
        console.log(this.state.advancedKey);
        this.setState({
            advancedKey:this.state.advancedKey.length>0?[]:['1']
        })
    }

    render(){
        const customPanelStyle = {
            background: '#f7f7f7',
            borderRadius: 4,
            marginBottom: 24,
            border: 0,
            overflow: 'hidden',
        };

        //高级属性对象
        let advancedPro ;
        //TODO  暂时写死
        if (this.state.storageType==='HIVE'){
            advancedPro= <Panel  key="1" style={customPanelStyle} showArrow={false} >
                <FormItem label="存储格式" >
                    <Select style={{ width: 150 }} value={this.state.storageFormat} onChange={this.handleSelectStorageFormat}>
                        {tableUtil.getStorageFormat().map((item)=><Option value={item} key={item}>{item}</Option>)}
                    </Select>
                </FormItem>
                <FormItem label="列分割符" >
                    <Input rows={3} placeholder="请输入表名" value={this.state.separator} onChange={(e)=>{this.handleChangeText("separator",e.target.value)}} />
                </FormItem>
            </Panel>;
        }else if(this.state.storageType==='ES'){
            advancedPro = <Panel  key="1" style={customPanelStyle} showArrow={false} >
                <FormItem label="replicas" >
                    <Input rows={3} value={this.state.replicas} onChange={(e)=>{this.handleChangeText("replicas",e.target.value)}} />
                </FormItem>
                <FormItem label="shards" >
                    <Input rows={3} value={this.state.shards} onChange={(e)=>{this.handleChangeText("shards",e.target.value)}} />
                </FormItem>
            </Panel>;
        }else{
            advancedPro=<Panel  key="1" style={customPanelStyle} showArrow={false} >

            </Panel>;
        }

        return (
            <div>
                <Spin spinning={this.state.loading} >
                <Card title={"表信息"}>
                    <Form layout="inline">
                        <Row>
                            <FormItem label="表名" >
                                <Input rows={3} placeholder="请输入表名" value={this.state.tableName} onChange={(e)=>{this.handleChangeText("tableName",e.target.value)}} />
                            </FormItem>
                            <FormItem label="描述" >
                                <Input rows={3} placeholder="请输入注释" onChange={(e)=>{this.handleChangeText("comment",e.target.value)}}/>
                            </FormItem>
                            <FormItem label="组名" >
                                <GroupSelect groupData={tableUtil.filterGroup(this.props.group.allGroup,this.props.auth)} handleChange={this.handleChangeGroup} handleSearch={this.handleChangeGroup} />
                            </FormItem>
                            <FormItem label="存储介质" >
                                <Select style={{ width: 150 }} value={this.state.storageType} onChange={this.handleSelectStorageType}>
                                    {tableUtil.getStorageType().map((item)=><Option value={item} key={item}>{item}</Option>)}
                                </Select>
                            </FormItem>
                            <FormItem label="数据库" >
                                <Select style={{ width: 180 }}  onSelect={this.handleSelectDb} value={this.state.db}>
                                    {tableUtil.fiterDbs(this.props.config.dbs,this.state.groupId,this.state.storageType,this.props.auth.role).map((item)=><Option value={item.id} key={item.id}>{item.name}</Option>)}
                                </Select>
                            </FormItem>
                            <FormItem >
                                <Button onClick={this.handleToggleAdvanced}>高级属性</Button>
                            </FormItem>
                            <div className={style.advanced}>
                                <Collapse bordered={false}
                                          activeKey={this.state.advancedKey}
                                >
                                    {advancedPro}
                                </Collapse>
                            </div>
                        </Row>
                    </Form>
                </Card>
                <Card title={"字段详情"} >
                    <EditableTable storageType={this.state.storageType} handeModifyColumn={this.handeModifyColumn} tableColumns={tableColumns[this.state.storageType]}/>
                </Card>
                <Button type={"primary"} onClick={this.handleSubmit} >创建</Button>
                </Spin>
            </div>
        )
    }
}
