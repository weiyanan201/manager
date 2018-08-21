import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Table, Pagination,Form,Button,Input, Radio, DatePicker, Select,Modal,Cascader} from 'antd';
import { Route } from 'react-router-dom';
import {getTableInfo} from "../../reducers/table.redux";

import BaseTable from '../../components/BaseTable';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const options = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou'
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
}];

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
    state => state.tableInfo,
    {getTableInfo}
)
export default class TableInfo extends Component {

    constructor(props){
        super(props);
        let tableId = this.props.match.params.tableId;
        this.state={
            tableInfoEditVisible:false,
            columnEditVisible:false,
        };
        this.props.getTableInfo(tableId)
    }

    //修改表属性提交
    handleInfoSubmit = ()=>{
        this.setState({
            tableInfoEditVisible:false
        });
    };

    //修改字段
    handleColumnSubmit=()=>{

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
                        <Button type="primary" onClick={()=>{this.setState({tableInfoEditVisible:true})}}>编辑</Button>
                        <Button type="danger">删除表</Button>
                    </div>
                    <Form layout="inline">
                        <FormItem label="表名">
                            <Input disabled={true} value={this.props.tableName}/>
                        </FormItem>
                        <FormItem label="dbName">
                            <Input disabled={true} value={this.props.db}/>
                        </FormItem>
                        <FormItem label="存储介质">
                            <Input  disabled={true} value={this.props.storageType}/>
                        </FormItem>
                        <FormItem label="描述">
                            <Input  disabled={true} value={this.props.comment}/>
                        </FormItem>
                    </Form>
                </Card>

                <Card title="表字段" style={{marginTop:10}}>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={()=>this.setState({columnEditVisible:true})}>编辑字段</Button>
                        <Button >添加字段</Button>
                    </div>

                    <BaseTable
                        columns={columns}
                        dataSource={this.props.columns}
                        selection={selections}
                        pagination={false}
                        rowKey={"key"}
                    />
                    <div style={{textAlign: 'right'}}>
                        <Button type="primary">更新</Button>
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
                >
                    <InfoForm {...this.props}  wrappedComponentRef={(inst)=>{this.infoForm = inst;}}/>
                </Modal>

                {/*添加、修改字段窗口*/}
                <Modal
                    title="编辑字段"
                    visible={this.state.columnEditVisible}
                    width={600}
                    onCancel={()=>{
                        // this.columnForm.props.form.resetFields();
                        this.setState({
                            columnEditVisible:false
                        })
                    }}
                    onOk={this.handleColumnSubmit}
                >
                    <CloumnForm wrappedComponentRef={(inst)=>{this.columnForm = inst;}} />
                </Modal>

            </div>
        );
    }

}


class InfoForm extends React.Component{

    render(){
        let type = this.props.type;
        let userInfo = this.props.userInfo || {};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol:{span:5},
            wrapperCol:{span:19}
        }
        return (
            <Form layout="horizontal">
                <FormItem label="表名" {...formItemLayout}>
                    {
                        type == 'detail'?userInfo.username:
                            getFieldDecorator('user_name',{
                                initialValue:this.props.tableName
                            })(
                                <Input  type="text" />
                            )
                    }
                </FormItem>
                <FormItem label="dbName" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.sex==1?'男':'女' :
                            getFieldDecorator('sex',{
                                initialValue: this.props.db
                            })(
                                <Input  type="text"  disabled={true}/>
                            )
                    }
                </FormItem>
                <FormItem label="存储介质" {...formItemLayout}>
                    {
                        type == 'detail' ? this.getState(userInfo.state) :
                            getFieldDecorator('state',{
                                initialValue: this.props.storageType
                            })(
                                <Input  type="text"  disabled={true}/>
                            )
                    }
                </FormItem>
                <FormItem label="描述" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.address :
                            getFieldDecorator('address',{
                                initialValue: this.props.comment
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
        let type = this.props.type;
        let userInfo = this.props.userInfo || {};
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
                                initialValue:this.props.name
                            })(
                                <Input  type="text" />
                            )
                    }
                </FormItem>
                <FormItem label="type" {...formItemLayout}>
                    {
                            getFieldDecorator('type',{
                                initialValue: this.props.db
                            })(
                                <Cascader options={options}
                                    // displayRender={(label)=>{
                                    //     //修改展示文字
                                    // }}
                                          size={"large"}
                                />
                            )
                    }
                </FormItem>

                <FormItem label="注释" {...formItemLayout}>
                    {
                            getFieldDecorator('comment',{
                                initialValue: this.props.comment
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