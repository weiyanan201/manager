
import React from 'react';
import { connect } from 'react-redux';
import {Button ,Card,Form,Input,Select,Row,message,Modal } from 'antd';

import TableSelect from '../../components/TableSelect';
import DragAndEditTable from './component/dragAndEditTable';
import tableUtil from '../../util/tableUtil';
import config from '../../util/config';
import axios from '../../util/axios';
import util from '../../util/util';
import style from './table.less';

const Option = Select.Option;
const FormItem = Form.Item;
const TextArea  = Input.TextArea;

class CreateView extends React.Component{

    //不能删，constructor中的state有引用
    state = {};

    constructor(props){
        super(props);
        this.state={
            tableName:'',
            comment:'',
            storageType:'HIVE',
            groupId:'',
            dataSource:[],
            condition:'',
            tableId:'',
            isTemp:false,

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
            db:change?'':this.state.db,
            isTemp:newIsTmp
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

    handleSubmit=()=>{
        const records =  this.table.handleSubmit();
        if (util.isEmpty(records)){
            message.error("字段列表出错或未空!");
            return ;
        }
        let errorMessage = [];
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading:true
                });
                let repColumns = [];
                if (records!==null && records.length>0){
                    records.map(item=>{
                        repColumns.push({...item,type:tableUtil.fieldTypeRender(item.type)})
                    })
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
                        dataSource:[],
                        condition:'',
                        tableId:'',
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
                        dataSource:columns,
                    });
                    //调用table的方法
                    this.table.modifyTableStateDataSource(columns);
                })
        }
    };

    render(){
        const tableColunms = [
            {
                title: '序号',
                key: 'key',
                align: 'center',
                render: (text, row, index) => index + 1,
                width: '5%'
            },
            {
                title: '字段名称',
                dataIndex: 'name',
                editable: true,
                type:'input',
                required: true,
                align: 'center',
                width:'25%'
            }, {
                title: '别名',
                dataIndex: 'alias',
                editable: true,
                type:'input',
                required: false,
                align: 'center',
                width:'15%'
            }, {
                title: '类型',
                dataIndex: 'type',
                editable: true,
                type:'fieldType',
                fieldTypes:this.props.config.fieldTypes,
                storageType: "HIVE",
                required: true,
                render: (text) => tableUtil.fieldTypeRender(text),
                align: 'center',
                width:'15%'
            }, {
                title: '注释',
                dataIndex: 'comment',
                editable: true,
                type:'input',
                required:!this.state.isTemp,
                width: '30%',
                align: 'center',
            },];

        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Card title={"视图信息"}>
                    <Form layout="inline" >
                        <Row>
                            <FormItem label="视图名" >
                                {getFieldDecorator('tableName', {
                                    rules: [{
                                        required: true,
                                        message: '视图名不可为空',
                                    }],
                                })(
                                    <Input rows={3} placeholder="请输入视图名" value={this.state.tableName} onChange={(e)=>{this.handleChangeText("tableName",e.target.value)}} />
                                )}
                            </FormItem>
                            <FormItem label="描述" >
                                {getFieldDecorator('comment', {
                                    rules: [{
                                        required: true,
                                        message: '视图注释不可为空',
                                    }],
                                })(
                                    <Input rows={3} placeholder="请输入注释" onChange={(e)=>{this.handleChangeText("comment",e.target.value)}}/>
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
                            <FormItem label="源表">
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
                <Card title={"字段详情"} className={style["roll-table"]}>
                    <div style={{marginTop:-20}}>
                        <DragAndEditTable
                            storageType={this.state.storageType}
                            fieldTypes={this.props.config.fieldTypes}
                            columns={tableColunms}
                            dataSource={this.state.dataSource}
                            scroll={{ y: 500 }}
                            pagination = {false}
                            onRef={(ref)=>{this.table=ref;}}
                        />
                    </div>
                </Card>
                <div style={{textAlign: 'right',marginTop:10}}>
                    <Button type={"primary"} onClick={this.handleSubmit} >创建</Button>
                </div>

            </div>
        )
    }
}

export default CreateView = Form.create()(CreateView);
