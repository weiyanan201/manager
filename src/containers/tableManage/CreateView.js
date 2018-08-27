
import React from 'react';
import {Button ,Card,Form,Input,Select,Row,message,Modal } from 'antd';

import GroupSelect  from '../../components/groupSelect/GroupSelect';
import TableSelect from '../../components/TableSelect';
import EditableTable from '../../components/BaseTable/EditableTable';

import tableUtil from '../../util/tableUtil';
import config from '../../util/config';
import axios from '../../util/axios';
import util from '../../util/util';


const Option = Select.Option;
const FormItem = Form.Item;
const TextArea  = Input.TextArea;

const tableColunms = [
    {
        title:'序号',
        key:'key',
        render:(text,row,index)=>index+1,
        width:'80px'
    },
    {
    title: '字段名称',
    dataIndex: 'name',
    editable: true,
    columnType:'input',
    required:true
}, {
    title: '别名',
    dataIndex: 'alias',
    editable: true,
    columnType:'input',
    required:false,
}, {
    title: '类型',
    dataIndex: 'type',
    editable: true,
    columnType:'fieldType',
    storageType:"HIVE",
    required:true,
    render: (text) => tableUtil.fieldTypeRender(text)
}, {
    title: '注释',
    dataIndex: 'comment',
    editable: true,
    columnType:'input',
    required:true,
    width: '500px',
},]

class CreateView extends React.Component{

    constructor(props){
        super(props);
        this.state={
            tableName:'',
            comment:'',
            storageType:'HIVE',
            groupId:'',
            columns:[],
            keyCount:0,
            condition:'',
            tableId:'',
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
        this.setState({
            groupId:index,
            db:change?'':this.state.db
        });
        this.props.form.setFieldsValue({
            db:change?'':this.state.db,
        });
    };

    //切换数据库
    handleSelectDb=(item,object)=>{
        this.setState({
            db:item,
            dbName:object.props.children
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

    handleSubmit=()=>{
        console.log(this.state);
        let errorMessage = [];
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading:true
                });

                //检查字段 过滤空行
                const { columns }  = this.state;
                let filterColumns ;
                let repColumns = [];
                if (columns!==null && columns.length>0){
                    filterColumns = columns.filter(item=>{
                        return !util.isEmpty(item.name) || !util.isEmpty(item.type) || !util.isEmpty(item.comment)
                    });
                    if (filterColumns && filterColumns.length>0){
                        //检查字是否 name、type、comment
                        filterColumns.map(item=>{
                            const en = util.isEmpty(item.name);
                            const et = util.isEmpty(item.type);
                            if (!en && et){
                                errorMessage.push("字段:"+item.name+"未指定字段类型");
                            }else if(en && !et){
                                errorMessage.push("有表字段未指定名称")
                            }
                            repColumns.push({...item,type:tableUtil.fieldTypeRender(item.type)})
                        })
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

                const result = axios.postByJson("/table/createView",{...this.state,columns:repColumns});
                result.then(()=>{
                    this.setState({
                        loading:false,
                    });
                    message.success("创建成功!");
                    this.props.form.resetFields();
                    this.setState({
                        tableName:'',
                        comment:'',
                        storageType:'HIVE',
                        groupId:'',
                        columns:[],
                        keyCount:0,
                        condition:'',
                        tableId:'',
                        createAgain:false
                    })
                }).catch(()=>{
                    this.setState({
                        loading:false
                    });
                })
            }
        });
    };

    /**
     * 选取模板表
     */
    handleSelectTemplate = (key)=>{
        if (!util.isEmpty(key)){
            let tableId = key;
            this.props.form.setFieldsValue({
                template:key
            });
            this.setState({
                tableId:tableId
            });
            axios.get("/table/getTableColumns",{tableId})
                .then(res=>{
                    const rdata = res.data.data;
                    const tempStorageType = rdata.storageType;
                    let columns = [];
                    let count = 1;
                    rdata.columns.map(item=>{
                        item.type = tableUtil.fieldTypeDeser(item.type);
                        item.key = count;
                        count++;
                        columns.push(item);
                    });
                    if (tempStorageType==='HIVE'){
                        let keys = rdata.keys;
                        keys.map(item=>{
                            item['isPartition']=true;
                            item.key = count;
                            item.type = tableUtil.fieldTypeDeser(item.type);
                            count++;
                            columns.push(item);
                        });
                    }
                    this.setState({
                        columns:columns,
                        keyCount:columns.length+1
                    })
                })
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Card title={"视图信息"}>
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
                                    <Select style={{ width: 150 }} value={this.state.storageType}  disabled >
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

                            {/*选取模板表*/}
                            <FormItem label="模板表">
                                {getFieldDecorator('template',{
                                    rules: [{
                                    required: true,
                                    message: '请选择源表',
                                }],
                                })(
                                    <TableSelect handleSelect={this.handleSelectTemplate} storageType='HIVE'/>
                                )}
                            </FormItem>
                        </Row>
                        <Row >

                            {/*<FormItem label="所有字段" >*/}
                                {/*{getFieldDecorator('isAll', {*/}
                                {/*})(*/}
                                    {/*<Select style={{ width: 180 }}  >*/}

                                    {/*</Select>*/}
                                {/*)}*/}
                            {/*</FormItem>*/}

                            <FormItem label="筛选条件" >
                                    <TextArea placeholder={`可以留空或写带where的condition,聚合其他语句会被忽略`}
                                              autosize style={{width:"600px"}}
                                              value={this.state.condition}
                                              onChange={(e)=>{this.handleChangeText("condition",e.target.value)}}
                                    />
                            </FormItem>
                        </Row>
                    </Form>
                </Card>

                <Card title={"字段详情"}>
                    <EditableTable storageType={this.state.storageType}
                                   handleModifyColumn={this.handleModifyColumn}
                                   tableColumns={tableColunms}
                                   dataSource={this.state.columns}
                                   keyCount={this.state.keyCount}
                                   scroll={{ y: 500 }}
                                   pagination = {false}
                    />
                </Card>
                <div style={{textAlign: 'right'}}>
                    <Button type={"primary"} onClick={this.handleSubmit} >创建</Button>
                </div>

            </div>
        )
    }
}

export default CreateView = Form.create()(CreateView);
