import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Table, Pagination,Form,Button,Input, Radio, DatePicker, Select,Modal,Cascader,message} from 'antd';
import { Route } from 'react-router-dom';
import {getTableInfo} from "../../reducers/table.redux";
import {getFieldsType} from "../../reducers/config.redux";

import BaseTable from '../../components/BaseTable';
import axios from '../../util/axios';
import tableUtil from "../../util/tableUtil";
import util from "../../util/util";

const FormItem = Form.Item;
const TextArea = Input.TextArea;


const columns = [

    {
        title:'序号',
        key:'key',
        render:(text,row,index)=>index+1
    },
    {
        title:'name',
        key:'name',
        dataIndex:'name'
    },
    {
        title: 'type',
        key: 'type',
        dataIndex: 'type'
    },
    {
        title: 'comment',
        key: 'comment',
        dataIndex: 'comment'
    },

];

const formItemLayout = {
    labelCol:{span:5},
    wrapperCol:{span:19}
}


@connect(
    state => {return {config:state.config,auth:state.auth}},
    {getTableInfo,getFieldsType}
)
export default class TableInfo extends Component {

    constructor(props){
        super(props);
        let tableId = this.props.match.params.tableId;
        this.state={
            tableInfoEditVisible:false,
            columnEditVisible:false,
            dataSource:[],
            existed:[],
            news:[],
            rows:[],
            storageType:'HIVE',
            index:0,
            columnModalTitle:'',
            editColumn:false
        };
        this.props.getTableInfo(tableId);
        this.props.getFieldsType();
        axios.get("/table/getTableInfo")
            .then(res=>{
                const tableInfo = res.data.data;
                const dataSource = [];
                const existed = [];
                let index = 0;
                tableInfo.columns.map(item=>{
                    item.key = index;
                    index++;
                    dataSource.push(item);
                    existed.push(item.name);
                });
                tableInfo.keys.map(item=>{
                    item.key = index;
                    index++;
                    item.isKey = true;
                    dataSource.push(item);
                    existed.push(item.name);
                });
                this.setState({
                    dataSource,existed,
                    storageType:tableInfo.storageType,
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
            if (row && row.hasOwnProperty("isKey") && row.isKey){
                message.error("无法编辑分区字段或主键");
                return ;
            }
            editColumn = true;
        }else if(title==="添加字段"){
            editColumn = false;
        }


        this.setState({columnEditVisible:true,columnModalTitle:title,editColumn})
    }

    //修改表属性提交
    handleInfoSubmit = ()=>{

        this.infoForm.props.form.validateFields((error, row) => {
            if(error){
                return ;
            }
            const data = this.infoForm.props.form.getFieldsValue();
            console.log(data);
            console.log(this.infoForm.props.tableInfo);
            //TODO 判断是否有变化 tableName，comment
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
            //TODO
            if (this.state.existed.includes(oldName)){
                //TODO 没有变化不调用接口
                //修改接口 axios 修改existed中的item对象
            } else{
                //加入dataSource 批量提交
                const news = this.state.news;
                const dataSource = this.state.dataSource;
                const index = this.state.index+1;
                column.key = index;
                news.push(column);
                dataSource.push(column);
                this.setState({
                    news,index,dataSource
                });
            }
            //TODO 关闭对话框
        });

    };

    //删除表
    handleDelete=()=>{
        console.log("delete");
        Modal.confirm({
            title: '删除',
            content: '是否要删除该表？',
            onOk() {
                console.log('OK');
                //TODO axios 调用接口
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    handleUpdate=()=>{
        //axios 批量添加字段
        const columns = this.state.news;
        console.log("columns",columns);
        //TODO axios  成功之后初始化状态
    }

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
                        <Button type="primary" onClick={()=>{this.setState({tableInfoEditVisible:true})}}>编辑</Button>
                        <Button type="danger" onClick={this.handleDelete}>删除表</Button>
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

                <Card title="表字段" style={{marginTop:10}}>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={()=>this.handelModalColumn('编辑字段')}>编辑字段</Button>
                        <Button onClick={()=>this.handelModalColumn('添加字段')}>添加字段</Button>
                    </div>

                    <BaseTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        selection={selections}
                        pagination={false}
                        rowKey={"key"}
                    />
                    <div style={{textAlign: 'right'}}>
                        <Button type="primary" onClick={this.handleUpdate}>更新</Button>
                    </div>
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
                                <Input  type="text" />
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
            </Form>
        );
    }
}

CloumnForm = Form.create({})(CloumnForm);
