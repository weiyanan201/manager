import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Form,Button,Input, Checkbox,Modal,Cascader,message} from 'antd';
import {getFieldsType} from "../../reducers/config.redux";

import BaseTable from '../../components/BaseTable';
import axios from '../../util/axios';
import tableUtil from "../../util/tableUtil";
import util from "../../util/util";
import { pushBread} from "../../reducers/bread.redux";

import style from './table.less';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const tableColumns = {
    "HIVE":[{
        title:'序号',
        key:'key',
        render:(text,row,index)=>index+1,
        width:85,
        align:'center',
    },{
        title: '字段名',
        dataIndex: 'name',
        width:290,
        align:'center',
    }, {
        title: '类型',
        dataIndex: 'type',
        width:300,
        align:'center',
    }, {
        title: '注释',
        dataIndex: 'comment',
        width: 300,
        align:'center',
    }, {
        title: '分区字段',
        dataIndex: 'isPartition',
        render: (text) => <Checkbox checked={text===true} />,
        align:'center',
    },],
    "PHOENIX":[
        {
            title:'序号',
            key:'key',
            render:(text,row,index)=>index+1,
            width:'100px',
            align:'center',
        },
        {
            title: 'name',
            dataIndex: 'name',
            width:'300px',
            align:'center',
        }, {
            title: '类型',
            dataIndex: 'type',
            width:'300px',
            align:'center',
        }, {
            title: '注释',
            dataIndex: 'comment',
            width:'300px',
            align:'center',
        },{
            title:"主键",
            dataIndex: 'primaryKey',
            render: (text) => <Checkbox checked={text===true} />,
            width:'200px',
            align:'center',
        }, {
            title: '可为空',
            dataIndex: 'nullable',
            render: (text) => <Checkbox checked={text===true} />,
            width:'200px',
            align:'center',
        }
    ],
    "ES":[
        {
            title:'序号',
            key:'key',
            render:(text,row,index)=>index+1,
            width:'100px',
            align:'center',
        },
        {
            title: 'name',
            dataIndex: 'name',
            width:'300px',
            align:'center',
        }, {
            title: '类型',
            dataIndex: 'type',
            width:'300px',
            align:'center',
        }, {
            title: '注释',
            dataIndex: 'comment',
            width:'500px',
            align:'center',
        },
    ],
    "":[]
};


const formItemLayout = {
    labelCol:{span:5},
    wrapperCol:{span:19}
}


@connect(
    state => {return {config:state.config,auth:state.auth}},
    {getFieldsType,pushBread}
)
export default class TableInfo extends Component {

    constructor(props){
        super(props);
        let groupId = this.props.match.params.groupId;
        let tableId = this.props.match.params.tableId;

        this.state={
            tableId:tableId,
            tableInfoEditVisible:false,
            columnEditVisible:false,
            columns:[],
            dataSource:[],
            existed:[],
            news:[],
            rows:[],
            storageType:'HIVE',
            index:0,
            columnModalTitle:'',
            editColumn:false,
            modifyPermission:false
        };

        this.props.getFieldsType();
        axios.get("/table/getTableInfo",{tableId,groupId})
            .then(res=>{
                const tableInfo = res.data.data.tableDetail;
                const groupName = res.data.data.groupName;
                const modifyPermission = res.data.data.modifyPermission;
                const breadUrl = "/table/groups/"+groupId;
                const breadObj = {[breadUrl]:groupName};
                this.props.pushBread(breadObj);

                const tableBreadUrl = "/table/groups/"+groupId+"/"+tableId;
                const tableBreadUrlObj = {[tableBreadUrl]:tableInfo.name};
                this.props.pushBread(tableBreadUrlObj);


                const dataSource = [];
                const existed = [];
                let index = 0;
                if(tableInfo.columns){
                    tableInfo.columns.map(item=>{
                        item.key = index;
                        index++;
                        dataSource.push(item);
                        existed.push(item.name);
                    });
                }
                if (tableInfo.keys){
                    if (tableInfo.storageType==='HIVE'){
                        tableInfo.keys.map(item=>{
                            item.key = index;
                            item.isPartition = true;
                            index++;
                            dataSource.push(item);
                            existed.push(item.name);
                        });
                    }else if(tableInfo.storageType==='PHOENIX'){
                        tableInfo.keys.map(item=>{
                            item.key = index;
                            item.primaryKey = true;
                            index++;
                            dataSource.push(item);
                            existed.push(item.name);
                        });
                    }

                }
                this.setState({
                    dataSource,existed,modifyPermission,
                    storageType:tableInfo.storageType,
                    columns:tableColumns[tableInfo.storageType],
                    tableName:tableInfo.name,
                    db:tableInfo.db,
                    comment:tableInfo.comment,
                    index
                })
            });
    }

    //弹出字段编辑窗
    handelModalColumn=(title)=>{
        const row = this.state.rows[0];
        let editColumn = false;
        if(title==='编辑字段'){
            if (!row){
                message.error("请先选择一个字段");
                return ;
            }
            if (row && row.hasOwnProperty("isPartition") && row.isPartition){
                message.error("无法编辑分区字段");
                return ;
            }
            if (row && row.hasOwnProperty("primaryKey") && row.primaryKey){
                message.error("无法编辑主键字段");
                return ;
            }
            editColumn = true;
        }else if(title==="添加字段"){
            editColumn = false;
        }
        this.setState({columnEditVisible:true,columnModalTitle:title,editColumn})
    };

    //修改表属性提交
    handleInfoSubmit = ()=>{
        this.infoForm.props.form.validateFields((error, row) => {
            if(error){
                return ;
            }
            const data = this.infoForm.props.form.getFieldsValue();
            const oldForm = this.infoForm.props.tableInfo;

            if (data.tableName!==oldForm.tableName || data.comment!==oldForm.comment){
                axios.postByJson("/table/modifyTableInfo",{...data,tableId:this.state.tableId})
                    .then(res=>{
                        message.success("修改成功");
                        this.setState({
                            tableName:data.tableName,
                            comment:data.comment
                        })
                    })
            }
            this.setState({
                tableInfoEditVisible:false
            });
        });

    };

    //修改字段
    handleColumnSubmit=()=>{

        this.columnForm.props.form.validateFields((error, row) => {
            if (error){
                return;
            }
            const data = this.columnForm.props.form.getFieldsValue();
            if (data===undefined){
                message.error("表单异常！");
                return ;
            }
            const oldName = this.columnForm.props.columnInfo===null?'':this.columnForm.props.columnInfo.name;
            const column = {...data,type:tableUtil.fieldTypeRender(data.type)};

            if (this.state.existed.includes(oldName)){
                //更新字段
                let existedIndex = this.state.existed.indexOf(oldName);
                console.log("existedIndex",existedIndex);
                let oldItem = {};
                let oldIndex = 0;
                this.state.dataSource.forEach((item,index)=>{
                    if (item.name===oldName){
                        oldItem = item;
                        oldIndex = index;
                    }
                });
                if (oldItem===undefined){
                    message.error("列不存在");
                    return ;
                }else{
                    if (oldItem.name!==column.name || oldItem.type!==column.type || oldItem.comment!==column.comment || oldItem.nullable!==column.nullable){
                        axios.postByJson("/table/modifyColumn",{...column,oldName:oldName,tableId:this.state.tableId})
                            .then(res=>{
                                message.success("字段更新成功");
                                const dataSource = this.state.dataSource;
                                column.key = oldItem.key;
                                dataSource.splice(oldIndex,1,column);
                                const existed = this.state.existed;
                                existed.splice(existedIndex,1,column.name);
                                this.setState({dataSource,columnEditVisible:false,rows:[column]});
                            })
                    }
                    this.setState({columnEditVisible:false})
                }
            } else{
                //加入dataSource 批量提交
                const news = this.state.news;
                const dataSource = this.state.dataSource;
                let index = this.state.index;
                if (this.state.editColumn===true) {
                    //更新未提交字段
                    let newsIndex = 0;
                    news.forEach((item,index)=>{
                        if (item.name===oldName){
                            newsIndex = index;
                        }
                    });
                    news.splice(newsIndex,1,column);
                    let dataIndex = 0;
                    dataSource.forEach((item,index)=>{
                        if (item.name===oldName){
                            dataIndex = index;
                        }
                    });
                    dataSource.splice(dataIndex,1,column);
                }else{
                    //新增字段
                    column.key = index;
                    index = index+1;
                    news.push(column);
                    dataSource.push(column);
                }


                this.setState({
                    news,
                    index,
                    dataSource,
                    columnEditVisible:false
                });
            }
        });

    };

    //删除表
    handleDelete=()=>{
        const _this = this;
        const tableId = this.state.tableId;
        Modal.confirm({
            title: '删除',
            content: '是否要删除该表？',
            onOk() {
                axios.post("/table/deleteTable",{tableId:tableId})
                    .then(res=>{
                        message.success("删除成功!");
                        _this.setState({
                            tableId:0,
                            dataSource:[],
                            existed:[],
                            news:[],
                            rows:[],
                            index:0,
                            columnModalTitle:'',
                            editColumn:false,
                            tableName:'',
                            db:'',
                            storageType:'',
                            comment:''
                        })
                    })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    handleUpdate=()=>{
        //axios 批量添加字段
        const columns = this.state.news;
        if (columns.length===0){
            message.success("更新成功！");
            return;
        }
        axios.postByJson("/table/addColumns",{columns:columns,tableId:this.state.tableId})
            .then(res=>{
                message.success("更新成功！");
                const existed = this.state.existed;
                columns.forEach(item=>{
                    existed.push(item.name);
                });
                this.setState({existed,columnEditVisible:false})
            })

    };

    render(){

        const selections = {
            type:'radio',
            rowKeys:'rowKeys',
            rows:'rows',
            _self:this
        };

        return(
            <div >
                <Card title={"表属性"}>
                    <div style={{textAlign: 'right'}}>
                        {
                            this.state.modifyPermission?
                                <Button type="primary" onClick={()=>{this.setState({tableInfoEditVisible:true})}}>编辑</Button>
                                :null
                        }
                        {
                            this.state.modifyPermission?
                                <Button type="danger" onClick={this.handleDelete}>删除表</Button>
                                :null
                        }

                    </div>
                    <Form layout="inline">
                        <FormItem label="表名">
                            <Input disabled={true} value={this.state.tableName}/>
                        </FormItem>
                        <FormItem label="dbName">
                            <Input disabled={true} value={this.state.db}/>
                        </FormItem>
                        <FormItem label="存储介质">
                            <Input  disabled={true} value={this.state.storageType}/>
                        </FormItem>
                        <FormItem label="描述">
                            <Input  disabled={true} value={this.state.comment}/>
                        </FormItem>
                    </Form>
                </Card>

                {/*className={style["roll-table"]}*/}
                <Card title="表字段" style={{marginTop:10}} className={style["roll-table"]}>
                    <div style={{textAlign: 'right'}}>
                        {
                            this.state.modifyPermission?
                                <Button onClick={()=>this.handelModalColumn('编辑字段')}>编辑字段</Button>
                                :null
                        }
                        {
                            this.state.modifyPermission?
                                <Button onClick={()=>this.handelModalColumn('添加字段')}>添加字段</Button>
                                :null
                        }

                    </div>

                    <BaseTable
                        columns={this.state.columns}
                        dataSource={this.state.dataSource}
                        selection={selections}
                        pagination={false}
                        rowKey={"key"}
                        scroll={{ y: 500 }}
                    />
                    {
                        this.state.modifyPermission?
                            <div style={{textAlign: 'right'}}>
                                <Button type="primary" onClick={this.handleUpdate}>更新</Button>
                            </div>
                            :null
                    }

                </Card>

                {/*表属性修改窗口*/}
                <Modal
                    title="表属性修改"
                    visible={this.state.tableInfoEditVisible}
                    width={600}
                    onCancel={()=>{
                        this.infoForm.props.form.resetFields();
                        this.setState({
                            tableInfoEditVisible:false
                        })
                    }}
                    onOk={this.handleInfoSubmit}
                    destroyOnClose={true}
                >
                    <InfoForm {...this.props}  wrappedComponentRef={(inst)=>{this.infoForm = inst;}}
                        tableInfo={{tableName:this.state.tableName,db:this.state.db,storageType:this.state.storageType,comment:this.state.comment}}
                    />
                </Modal>

                {/*添加、修改字段窗口*/}
                <Modal
                    title={this.state.columnModalTitle}
                    visible={this.state.columnEditVisible}
                    width={600}
                    onCancel={()=>{
                        // this.columnForm.props.form.resetFields();
                        this.setState({
                            columnEditVisible:false
                        })
                    }}
                    onOk={this.handleColumnSubmit}
                    destroyOnClose={true}
                >
                    <CloumnForm wrappedComponentRef={(inst)=>{this.columnForm = inst;}}
                                columnInfo={this.state.editColumn?(this.state.rows.length>0?this.state.rows[0]:null):null}
                                fieldTypes={this.props.config.fieldTypes}
                                storageType={this.state.storageType}
                    />
                </Modal>

            </div>
        );
    }

}


class InfoForm extends React.Component{

    render(){
        let tableInfo = this.props.tableInfo || {};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol:{span:5},
            wrapperCol:{span:19}
        }
        return (
            <Form layout="horizontal">
                <FormItem label="表名" {...formItemLayout}>
                    {
                            getFieldDecorator('tableName',{
                                rules: [{
                                    required: true,
                                    message: `tableName is required.`,
                                }],
                                initialValue:tableInfo.tableName
                            })(
                                <Input  type="text"  disabled={tableInfo.storageType !== "HIVE"}/>
                            )
                    }
                </FormItem>
                <FormItem label="dbName" {...formItemLayout}>
                    {
                            getFieldDecorator('db',{
                                rules: [{
                                    required: true,
                                    message: `db is required.`,
                                }],
                                initialValue: tableInfo.db
                            })(
                                <Input  type="text"  disabled={true}/>
                            )
                    }
                </FormItem>
                <FormItem label="存储介质" {...formItemLayout}>
                    {
                            getFieldDecorator('storageType',{
                                rules: [{
                                    required: true,
                                    message: `storageType is required.`,
                                }],
                                initialValue: tableInfo.storageType
                            })(
                                <Input  type="text"  disabled={true}/>
                            )
                    }
                </FormItem>
                <FormItem label="描述" {...formItemLayout}>
                    {
                            getFieldDecorator('comment',{
                                rules: [{
                                    required: true,
                                    message: `comment is required.`,
                                }],
                                initialValue: tableInfo.comment
                            })(
                                <TextArea rows={3} placeholder="请输入注释"/>
                            )
                    }
                </FormItem>
            </Form>
        );
    }
}
InfoForm = Form.create({})(InfoForm);

class CloumnForm extends  React.Component{
    render(){

        let columnInfo = this.props.columnInfo || {};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol:{span:5},
            wrapperCol:{span:19}
        }
        return (
            <Form layout="horizontal">
                <FormItem label="字段名称" {...formItemLayout}>
                    {
                            getFieldDecorator('name',{
                                rules: [{
                                    required: true,
                                    message: `name is required.`,
                                }],
                                initialValue:columnInfo.name
                            })(
                                <Input  type="text" />
                            )
                    }
                </FormItem>
                <FormItem label="type" {...formItemLayout}>
                    {
                            getFieldDecorator('type',{
                                rules: [{
                                    required: true,
                                    message: `type is required.`,
                                }],
                                initialValue: util.isEmpty(columnInfo.type)?'':tableUtil.fieldTypeDeser(columnInfo.type)
                            })(
                                <Cascader
                                    options={tableUtil.getFieldType(this.props.fieldTypes,this.props.storageType)}
                                    placeholder="请选择类型"
                                    expandTrigger={"hover"}
                                />
                            )
                    }
                </FormItem>

                <FormItem label="注释" {...formItemLayout}>
                    {
                            getFieldDecorator('comment',{
                                rules: [{
                                    required: true,
                                    message: `comment is required.`,
                                }],
                                initialValue: columnInfo.comment
                            })(
                                <TextArea rows={3} placeholder="请输入注释"/>
                            )
                    }
                </FormItem>

                {
                    this.props.storageType==="PHOENIX"?
                        <FormItem label="可为空" {...formItemLayout}>
                            {
                                getFieldDecorator('nullable',{
                                    valuePropName: 'checked',
                                    initialValue: columnInfo.nullable,
                                })(
                                    <Checkbox defaultChecked={columnInfo.nullable==='true'} />
                                )
                            }
                        </FormItem>
                        :null

                }
            </Form>
        );
    }
}

CloumnForm = Form.create({})(CloumnForm);
