/**
 * 手动建表页面
 */

import React from 'react';
import { connect } from 'react-redux';

import {Button , Card,Spin,Form,Input,Select,Row,message,Modal,Collapse,Checkbox, Icon,Popconfirm} from 'antd';
import DragAndEditTable from './component/dragAndEditTable';
import TableSelect from '../../components/TableSelect';
import tableUtil from '../../util/tableUtil';
import config from '../../util/config';
import axios from '../../util/axios';
import util from '../../util/util';

import style from './table.less'

const Option = Select.Option;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

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
            dataSource:[],
            loading : false,
            advancedKey:[],
            replicas:1,
            shards:5,
            isTemp:false
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
            ...andvanced,
            isTemp:newIsTmp
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
        this.table.checkRecords(item);
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

    };
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
            axios.get("/table/getTableColumns",{tableId: key})
                .then(res=>{
                    const rdata = res.data.data;
                    const tempStorageType = rdata.storageType;
                    let dataSource = [];
                    let count = 1;
                    rdata.columns.map(item=>{
                        item.type = tableUtil.fieldTypeDeser(item.type);
                        item.key = count;
                        count++;
                        dataSource.push(item);
                    });
                    if (tempStorageType==='HIVE'){
                        let keys = rdata.keys;
                        if (keys && keys.length>0){
                            keys.map(item=>{
                                item['isPartition']=true;
                                item.key = count;
                                item.type = tableUtil.fieldTypeDeser(item.type);
                                count++;
                                dataSource.push(item);
                            });
                        }
                    } else if (tempStorageType==='ES'){

                    } else if(tempStorageType==='PHOENIX'){
                        //TODO 处理key
                    }
                    this.setState({
                        dataSource:dataSource,
                    });
                    //调用table的方法
                    this.table.modifyTableStateDataSource(dataSource);
                })
        }
    }

    //提交建表请求
    handleSubmit=()=>{
        //调用子组件的函数
        const records =  this.table.handleSubmit();
        if (util.isEmpty(records)){
            message.error("字段列表出错!");
            return ;
        }

        let errorMessage = [];

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // let filterColumns ;
                let repColumns = [];
                //检查字段 过滤空行
                if (records!==null && records.length>0){
                    //检查字是否 name、type、comment
                    //hive:必须有一个普通列
                    //es:必须有一列
                    //phoenix:必须有一个主键列，并且可为空字段不能为true
                    let blankRows = true;
                    records.map(item=>{
                        repColumns.push({...item,type:tableUtil.fieldTypeRender(item.type)});
                        switch (this.state.storageType) {
                            case config.STORAGE_TYPE_OBJ.HIVE:
                                //有一个非分区字段即可
                                if (item.isPartition===undefined || item.isPartition===false){
                                    blankRows = false;
                                }
                                break;
                            case config.STORAGE_TYPE_OBJ.ES:
                                //有一个字段即可
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
                    });
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
                    });
                    message.success("创建成功!");
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
                        dataSource:[],
                        loading : false,
                        advancedKey:[],
                        replicas:1,
                        shards:5,
                        createAgain:false
                    });
                    this.table.modifyTableStateDataSource([]);
                }).catch(()=>{
                    this.setState({
                        loading:false
                    });
                })
            }
        });
    };

    //高级属性开关
    handleToggleAdvanced=()=>{
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

        const tableColumns = {
            "HIVE":[
                {
                    title:'序号',
                    key:'key',
                    align:'center',
                    render:(text,row,index)=>index+1,
                    width:'5%'
                },{
                    title: '字段名',
                    dataIndex: 'name',
                    editable: true,
                    type:'input',
                    required:true,
                    align:'center',
                    width:"30%"
                }, {
                    title: '类型',
                    dataIndex: 'type',
                    editable: true,
                    type:'fieldType',
                    storageType:"HIVE",
                    fieldTypes:this.props.fieldTypes,
                    required:true,
                    render: (text) => tableUtil.fieldTypeRender(text),
                    width:'20%',
                    align:'center',
                }, {
                    title: '描述',
                    dataIndex: 'comment',
                    editable: true,
                    type:'input',
                    required:!this.state.isTemp,
                    width: '30%',
                    align:'center',
                }, {
                    title: <div>分区字段<Icon type="question-circle" theme="outlined" title={"主键|分区键的编辑顺序即为创建顺序"} style={{marginLeft:"5px"}}/></div>,
                    dataIndex: 'isPartition',
                    editable: true,
                    type:'checkbox',
                    required:false,
                    render: (text) => <Checkbox checked={text===true} />,
                    width:'10%',
                    align:'center',
                }],
            "PHOENIX":[
                {
                    title:'序号',
                    align:'center',
                    key:'key',
                    render:(text,row,index)=>index+1,
                    width:'5%',
                },
                {
                    title: '字段名',
                    dataIndex: 'name',
                    editable: true,
                    type:'input',
                    required:true,
                    align:'center',
                    width:'20%'
                }, {
                    title: '类型',
                    dataIndex: 'type',
                    editable: true,
                    type:'fieldType',
                    storageType:"PHOENIX",
                    fieldTypes:this.props.fieldTypes,
                    required:true,
                    render: (text) => tableUtil.fieldTypeRender(text),
                    align:'center',
                    width:'10%'
            }, {
                    title: '描述',
                    dataIndex: 'comment',
                    editable: true,
                    type:'input',
                    required:!this.state.isTemp,
                    align:'center',
                    width:'20%'
            },{
                    title:<div>主键<Icon type="question-circle" theme="outlined" title={"主键|分区键的编辑顺序即为创建顺序"} style={{marginLeft:"5px"}}/></div>,
                    dataIndex: 'primaryKey',
                    editable: true,
                    type:'checkbox',
                    required:false,
                    render: (text) => <Checkbox checked={text===true} />,
                    align:'center',
                    width:'10%'
            }, {
                    title: '可为空',
                    dataIndex: 'beNull',
                    editable: true,
                    type:'checkbox',
                    required:false,
                    render: (text) => <Checkbox checked={text===true} />,
                    align:'center',
                    width:'10%'
            }],
            "ES":[
                {
                    title:'序号',
                    key:'key',
                    align:'center',
                    render:(text,row,index)=>index+1,
                    width:'5%',
                },
                {
                    title: '字段名',
                    dataIndex: 'name',
                    editable: true,
                    type:'input',
                    required:true,
                    align:'center',
                    width:'20%'
                }, {
                    title: '类型',
                    dataIndex: 'type',
                    editable: true,
                    type:'fieldType',
                    storageType:"ES",
                    fieldTypes:this.props.fieldTypes,
                    required:true,
                    render: (text) => tableUtil.fieldTypeRender(text),
                    align:'center',
                    width:'10%'
            }, {
                    title: '描述',
                    dataIndex: 'comment',
                    editable: true,
                    type:'input',
                    required:!this.state.isTemp,
                    width:'20%',
                    align:'center',
            },],
            "":[]
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
                {/*<Spin spinning={this.state.loading} >*/}
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
                                        message: '表描述不可为空',
                                    }],
                                })(
                                    <Input rows={3} placeholder="请输入描述" onChange={(e)=>{this.handleChangeText("comment",e.target.value)}}/>
                                )}
                            </FormItem>
                            <FormItem label="游戏名" >
                                {getFieldDecorator('groupId', {
                                    rules: [{
                                        required: true,
                                        message: '请选择group分组',
                                    }],
                                })(
                                    <Select style={{width: 200}}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            onChange={this.handleChangeGroup}
                                            showSearch
                                    >
                                        {
                                            tableUtil.filterGroup(this.props.group.allGroup,this.props.auth).map(group=>
                                                <Option key={group.id}>{group.name}</Option>
                                            )
                                        }
                                    </Select>
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
                <Card title={"字段详情"} className={style["roll-table"]}>
                    <div style={{marginTop:-20}}>
                        <DragAndEditTable
                                       storageType={this.state.storageType}
                                       fieldTypes={this.props.fieldTypes}
                                       columns={tableColumns[this.state.storageType]}
                                       dataSource={this.state.dataSource}
                                       pagination = {false}
                                       onRef={(ref)=>{this.table=ref;}}
                        />
                    </div>
                </Card>
                    <div style={{textAlign: 'right',marginTop:10}}>
                           <Button type={"primary"} onClick={this.handleSubmit} >创建</Button>
                    </div>
                {/*</Spin>*/}
            </div>
        )
    }
}

export default CreateTable = Form.create()(CreateTable);
