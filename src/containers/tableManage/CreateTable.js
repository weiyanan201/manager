/**
 * 手动建表页面
 */

import React from 'react';
import { connect } from 'react-redux';

import {Button , Card,Spin,Form,Input,Select,Row,message,Modal,Collapse,Checkbox } from 'antd';
import GroupSelect  from '../../components/groupSelect/GroupSelect';
import EditableTable from '../../components/BaseTable/EditableTable';
import TableSelect from '../../components/TableSelect';
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
        title:'序号',
        key:'key',
        render:(text,row,index)=>index+1,
        width:'80px'
    },{
        title: 'name',
        dataIndex: 'name',
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
        render: (text) => tableUtil.fieldTypeRender(text),
        width:'300px',
    }, {
        title: '注释',
        dataIndex: 'comment',
        editable: true,
        columnType:'input',
        required:true,
        width: '500px',
    }, {
        title: '分区字段',
        dataIndex: 'isPartition',
        editable: true,
        columnType:'checkbox',
        required:false,
        render: (text) => <Checkbox checked={text===true} />,
        width:'200px'
    },],
    "PHOENIX":[
        {
            title:'序号',
            key:'key',
            render:(text,row,index)=>index+1,
            width:'80px'
        },
        {
            title: 'name',
            dataIndex: 'name',
            editable: true,
            columnType:'input',
            required:true
        }, {
            title: '类型',
            dataIndex: 'type',
            editable: true,
            columnType:'fieldType',
            storageType:"PHOENIX",
            required:true,
            render: (text) => tableUtil.fieldTypeRender(text)
        }, {
            title: '注释',
            dataIndex: 'comment',
            editable: true,
            columnType:'input',
            required:true,
        },{
            title:"主键",
            dataIndex: 'primaryKey',
            editable: true,
            columnType:'checkbox',
            required:false,
            render: (text) => <Checkbox checked={text===true} />,
            width:'200px'
        }, {
            title: '可为空',
            dataIndex: 'beNull',
            editable: true,
            columnType:'checkbox',
            required:false,
            render: (text) => <Checkbox checked={text===true} />,
            width:'200px'
        }
    ],
    "ES":[
        {
            title:'序号',
            key:'key',
            render:(text,row,index)=>index+1,
            width:'100px'
        },
        {
            title: 'name',
            dataIndex: 'name',
            editable: true,
            columnType:'input',
            required:true,
        }, {
            title: '类型',
            dataIndex: 'type',
            editable: true,
            columnType:'fieldType',
            storageType:"ES",
            required:true,
            render: (text) => tableUtil.fieldTypeRender(text)
        }, {
            title: '注释',
            dataIndex: 'comment',
            editable: true,
            columnType:'input',
            required:true,
            width:'500px'
        },
    ],
    "":[]
}

@connect(
    state => state.config,
    {}
)
class CreateTable extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tableName:'',
            comment:'',
            groupId:'',
            storageType:'HIVE',
            storageFormat:'ORC',
            separator:'\\t',
            separatorHidden:true,
            db:'',
            dbName:'',
            columns:[],
            keyCount:0,
            loading : false,
            advancedKey:[],
            replicas:1,
            shards:5,
            createAgain:false
        };
    }

    //变更文本
    handleChangeText(key,value) {
        this.setState({
            ...this.state,
            [key]:value
        });
    }

    //group 联动数据库选择
    handleChangeGroup = (index)=>{
        let oldIsTmp = this.state.groupId===config.TEMP_GROUP_ID.toString();
        let newIsTmp = index === config.TEMP_GROUP_ID.toString();
        let change = (oldIsTmp&&!newIsTmp) || (!oldIsTmp&&newIsTmp);

        let andvanced = {};
        if(this.state.storageType==="HIVE" && newIsTmp){
            //hive 私有组，默认TEXTFILE
            andvanced.storageFormat='TEXTFILE';
            andvanced.separatorHidden=false;
            andvanced.separator = "\\t";
        }else if(this.state.storageType==="HIVE"){
            andvanced.storageFormat='ORC';
            andvanced.separatorHidden=true;
            andvanced.separator = "";
        }

        this.setState({
            groupId:index,
            db:change?'':this.state.db,
            ...andvanced
        });
        this.props.form.setFieldsValue({
            db:change?'':this.state.db,
        });
    };
    //选择存储介质并联动数据库选择
    handleSelectStorageType=(item)=>{
        this.setState({
            storageType:item,
            db:'',
            dbName:''
        });
        this.props.form.setFieldsValue({
            db: '',
        });
    };
    //选取Format
    //ORC 隐藏 分隔符
    handleSelectStorageFormat=(item)=>{
        if (item==='TEXTFILE') {
            this.setState({
                storageFormat:item,
                separatorHidden:false,
            })
        }else{
            this.setState({
                storageFormat:item,
                separatorHidden:true,
            })
        }

    }
    //切换数据库
    handleSelectDb=(item,object)=>{
        this.setState({
            db:item,
            dbName:object.props.children
        })
    };

    /**
     * 选取模板表
     */
    handleSelectTemplate = (key)=>{
        if (!util.isEmpty(key)){
            let tableId = key;
            axios.get("/table/getTableColumns",{tableId})
                .then(res=>{
                    const rdata = res.data.data;
                    const tempStorageType = rdata.storageType;
                    let columns = [];
                    let count = 1;
                    rdata.columns.map(item=>{
                        console.log(item);
                        item.type = tableUtil.fieldTypeDeser(item.type);
                        item.key = count;
                        count++;
                        columns.push(item);
                    });
                    if (tempStorageType==='HIVE'){
                        let keys = rdata.keys;
                        if (keys && keys.length>0){
                            keys.map(item=>{
                                item['isPartition']=true;
                                item.key = count;
                                item.type = tableUtil.fieldTypeDeser(item.type);
                                count++;
                                columns.push(item);
                            });
                        }
                    } else if (tempStorageType==='ES'){

                    } else if(tempStorageType==='PHOENIX'){
                        //TODO 处理key
                    }
                    this.setState({
                        columns:columns,
                        keyCount:columns.length+1
                    })
                })
        }
    }

    //提交建表请求
    handleSubmit=()=>{
        let errorMessage = [];
        const {groupId,storageType,comment,tableName,db,columns} = this.state;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let filterColumns ;
                let repColumns = [];
                let legalType = tableUtil.getFieldType(this.props.fieldTypes,this.state.storageType);

                //检查字段 过滤空行
                if (columns!==null && columns.length>0){
                    filterColumns = columns.filter(item=>{
                        return !util.isEmpty(item.name) || !util.isEmpty(item.type) || !util.isEmpty(item.comment)
                    });
                    if (filterColumns && filterColumns.length>0){
                        //检查字是否 name、type、comment
                        //hive:必须有一个普通列
                        //es:必须有一列
                        //phoenix:必须有一个主键列，并且可为空字段不能为true
                        let blankRows = true;
                        filterColumns.map(item=>{
                            const en = util.isEmpty(item.name);
                            const et = util.isEmpty(item.type);
                            if (!en && et){
                                errorMessage.push("字段:"+item.name+"未指定字段类型");
                            }else if(en && !et){
                                errorMessage.push("有表字段未指定名称")
                            }else{
                                if(!tableUtil.checkoutFieldType(legalType,item.type)){
                                    errorMessage.push(`字段:${item.name}的类型错误`);
                                }
                                repColumns.push({...item,type:tableUtil.fieldTypeRender(item.type)});
                                switch (this.state.storageType) {
                                    case config.STORAGE_TYPE_OBJ.HIVE:
                                        if (item.isPartition===undefined || item.isPartition===false){
                                            blankRows = false;
                                        }
                                        break;
                                    case config.STORAGE_TYPE_OBJ.ES:
                                        blankRows = false;
                                        break;
                                    case config.STORAGE_TYPE_OBJ.PHOENIX:
                                        if (item.primaryKey===true){
                                            blankRows = false;
                                        }
                                        if (item.primaryKey===true && item.beNull===true){
                                            errorMessage.push(`字段:${item.name}为主键，不能可为空`);
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        })
                        if (blankRows){
                            //验证失败
                            switch (this.state.storageType) {
                                case config.STORAGE_TYPE_OBJ.HIVE:
                                    errorMessage.push(`hive建表必须有一个非分区列`);
                                    break;
                                case config.STORAGE_TYPE_OBJ.ES:
                                    errorMessage.push(`es建表必须有一列`);
                                    break;
                                case config.STORAGE_TYPE_OBJ.PHOENIX:
                                    errorMessage.push(`phoenix建表必须有一个主键，且该主键不能可为空`);
                                    break;
                            }
                        }
                    }else{
                        errorMessage.push("字段列表不能为空!");
                    }
                }else{
                    errorMessage.push("字段列表不能为空!");
                }

                if(!util.isEmpty(errorMessage)){
                    Modal.error({
                        title: "错误提示",
                        content: util.getWordwrapContent(errorMessage)
                    });
                    return ;
                }
                this.setState({
                    loading:true
                });
                const result = axios.postByJson("/table/createTable",{...this.state,columns:repColumns});
                result.then(()=>{
                    this.setState({
                        loading:false,
                        createAgain:true
                    });
                    message.success("创建成功!");
                }).catch(()=>{
                    this.setState({
                        loading:false
                    });
                })
            }
        });
    };

    handleCreateMore=()=>{
        this.props.form.resetFields();
        this.setState({
            tableName:'',
            comment:'',
            groupId:'',
            storageType:'HIVE',
            storageFormat:'ORC',
            separator:'\\t',
            separatorHidden:true,
            db:'',
            dbName:'',
            columns:[],
            keyCount:0,
            loading : false,
            advancedKey:[],
            replicas:1,
            shards:5,
            createAgain:false
        })
    };

    //传入可编辑表的回调函数
    //dataSource : 表格中的记录
    //keyCount ： 下一个key值
    handleModifyColumn=(dataSource,keyCount=this.state.keyCount)=>{
        this.setState({
            columns:dataSource,
            keyCount:keyCount
        })
    };

    //高级属性开关
    handleToggleAdvanced=()=>{
        console.log(this.state.advancedKey);
        this.setState({
            advancedKey:this.state.advancedKey.length>0?[]:['1']
        })
    };

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
        if (this.state.storageType==='HIVE'){
            advancedPro= <Panel  key="1" style={customPanelStyle} showArrow={false} >
                <FormItem label="存储格式" >
                    <Select style={{ width: 150 }} value={this.state.storageFormat} onChange={this.handleSelectStorageFormat}>
                        {tableUtil.getStorageFormat().map((item)=><Option value={item} key={item}>{item}</Option>)}
                    </Select>
                </FormItem>
                {this.state.separatorHidden===true?null
                    :<FormItem label="列分割符" >
                        <Input rows={3} placeholder="请输入分隔符"
                           value={this.state.separator}
                           onChange={(e)=>{this.handleChangeText("separator",e.target.value)}}
                        />
                    </FormItem>
                }

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
        const { getFieldDecorator } = this.props.form;

        const tableSelect = <TableSelect handleSelect={this.handleSelectTemplate} storageType={this.state.storageType}/>;
        return (
            <div>
                <Spin spinning={this.state.loading} >
                <Card title={"表信息"}>
                    <Form layout="inline" >
                        <Row>
                            <FormItem label="表名" >
                                {getFieldDecorator('tableName', {
                                    rules: [{
                                        required: true,
                                        message: '表名不可为空',
                                    }],
                                })(
                                    <Input rows={3} placeholder="请输入表名" value={this.state.tableName} onChange={(e)=>{this.handleChangeText("tableName",e.target.value)}} />
                                )}
                            </FormItem>
                            <FormItem label="描述" >
                                {getFieldDecorator('comment', {
                                    rules: [{
                                        required: true,
                                        message: '表注释不可为空',
                                    }],
                                })(
                                    <Input rows={3} placeholder="请输入注释" onChange={(e)=>{this.handleChangeText("comment",e.target.value)}}/>
                                )}
                            </FormItem>
                            <FormItem label="组名" >
                                {getFieldDecorator('groupId', {
                                    rules: [{
                                        required: true,
                                        message: '请选择group分组',
                                    }],
                                })(
                                    <GroupSelect groupData={tableUtil.filterGroup(this.props.group.allGroup,this.props.auth)} handleChange={this.handleChangeGroup} handleSearch={this.handleChangeGroup} />
                                )}
                            </FormItem>
                            <FormItem label="存储介质" >
                                {getFieldDecorator('storageType', {
                                    rules: [{
                                        required: true,
                                        message: '请选择存储介质',
                                    }],
                                    initialValue:this.state.storageType
                                })(
                                    <Select style={{ width: 150 }} value={this.state.storageType} onChange={this.handleSelectStorageType}>
                                        {tableUtil.getStorageType().map((item)=><Option value={item} key={item}>{item}</Option>)}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="数据库" >
                                {getFieldDecorator('db', {
                                    rules: [{
                                        required: true,
                                        message: '请选择数据库',
                                    }],
                                })(
                                    <Select style={{ width: 180 }}  onSelect={this.handleSelectDb} value={this.state.db}>
                                        {tableUtil.fiterDbs(this.props.config.dbs,this.state.groupId,this.state.storageType,this.props.auth.role).map((item)=><Option value={item.id} key={item.id}>{item.name}</Option>)}
                                    </Select>
                                )}
                            </FormItem>


                        </Row>
                        <Row>
                            {/*选取模板表*/}
                            <FormItem label="模板表">
                                {tableSelect}
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
                    <EditableTable storageType={this.state.storageType}
                                   handleModifyColumn={this.handleModifyColumn}
                                   tableColumns={tableColumns[this.state.storageType]}
                                   dataSource={this.state.columns}
                                   keyCount={this.state.keyCount}
                                   scroll={{ y: 500 }}
                                   pagination = {false}
                    />
                </Card>
                    <div style={{textAlign: 'right'}}>
                        {
                            this.state.createAgain?
                                <Button type={"primary"} onClick={this.handleCreateMore} >再来一张</Button>
                                :<Button type={"primary"} onClick={this.handleSubmit} >创建</Button>
                        }
                    </div>
                </Spin>
            </div>
        )
    }
}

export default CreateTable = Form.create()(CreateTable);
