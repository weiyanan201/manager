import React,{ Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Spin, Modal } from 'antd';

import axios from '../../../../util/axios';
import util from "../../../../util/util";

import style from '../style.less';
import {TenantType} from "../../../../config";

const FormItem = Form.Item;
const Option = Select.Option;

const FORM_TYPE_APP = "APP";
const FORM_TYPE_STUDIO = "STUDIO";

const FORM_TYPE = {
    "APP":{
        key:"APP",
        text:"应用"
    },
    "STUDIO":{
        key:"STUDIO",
        text:"工作室"
    }
};


class AddAppForm extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            studioDisabled:false,
        };
    };

    handleChangeType = (value) =>{

        if (FORM_TYPE_STUDIO===value){
            //清楚错误
            this.props.form.setFields({
                appType: {
                },
                clientType:{
                },
                graphicsMode:{
                },
                operationMode:{
                },
                appSource:{
                },
                parentId:{
                },
                mobileGameTypeId:{
                },
            });
        }

        this.setState({
            studioDisabled:value===FORM_TYPE_STUDIO,
        });
    };

    render(){

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4,offset:2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16},
            },
        };

        return (

            <div className={style.formWrapper}>
            <Spin spinning={this.state.loading}>
                <Form >

                    <FormItem
                        {...formItemLayout}
                        label="创建类型"
                    >
                        {getFieldDecorator('type', {
                            rules: [{
                                required: true, message: '请选择类型',
                            }],
                        })(
                            <Select onSelect={(val)=>this.handleChangeType(val)}>
                                <Option value={ FORM_TYPE.APP.key } key={ FORM_TYPE.APP.key }>{ FORM_TYPE.APP.text }</Option>
                                <Option value={ FORM_TYPE.STUDIO.key } key={ FORM_TYPE.STUDIO.key }>{ FORM_TYPE.STUDIO.text }</Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="ID"
                    >
                        {getFieldDecorator('id', {
                            rules: [{
                                required: true, message: '请输入appId',
                            }],
                            initialValue: this.props.info.id
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="应用名称"
                    >
                        {getFieldDecorator('appName', {
                            rules: [{
                                required: true, message: '请输入应用名称',
                            }],
                            initialValue: this.props.info.appName
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="应用缩写"
                    >
                        {getFieldDecorator('appAbbrName', {
                            rules: [{
                                required: true, message: '请输入应用缩写',
                            }],
                            initialValue: this.props.info.appAbbrName
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="应用描述"
                    >
                        {getFieldDecorator('appDesc', {
                            rules: [{
                                required: true, message: '请输入应用描述',
                            }],
                            initialValue: this.props.info.appDesc
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="游戏类型"
                    >
                        {getFieldDecorator('appType',{
                            rules: [{
                                required: !this.state.studioDisabled, message: '请选择游戏类型',
                            }],
                            initialValue: `${util.isEmpty(this.props.info.appType)?"":this.props.info.appType}`
                        })(
                            <Select disabled={this.state.studioDisabled}>
                                {
                                    this.props.appType.map(item => {
                                        return Object.keys(item).map(key=>{
                                            return <Option value={key} key={key}>{item[key]}</Option>
                                        })
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="客户端类型"
                    >
                        {getFieldDecorator('clientType',{
                            rules: [{
                                required: !this.state.studioDisabled, message: '请选择客户端类型',
                            }],
                            initialValue: `${util.isEmpty(this.props.info.clientType)?"":this.props.info.clientType}`
                        })(
                            <Select disabled={this.state.studioDisabled}>
                                {
                                    this.props.clientType.map(item => {
                                        return Object.keys(item).map(key=>{
                                            return <Option value={key} key={key}>{item[key]}</Option>
                                        })
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="建模机制"
                    >
                        {getFieldDecorator('graphicsMode',{
                            rules: [{
                                required: !this.state.studioDisabled, message: '请选择建模机制',
                            }],
                            initialValue: `${util.isEmpty(this.props.info.graphicsMode)?"":this.props.info.graphicsMode}`
                        })(
                            <Select disabled={this.state.studioDisabled}>
                                {
                                    this.props.graphicsMode.map(item => {
                                        return Object.keys(item).map(key=>{
                                            return <Option value={key} key={key}>{item[key]}</Option>
                                        })
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="运营归属"
                    >
                        {getFieldDecorator('operationMode',{
                            rules: [{
                                required: !this.state.studioDisabled, message: '请选择运营归属',
                            }],
                            initialValue: `${util.isEmpty(this.props.info.operationMode)?"":this.props.info.operationMode}`
                        })(
                            <Select disabled={this.state.studioDisabled}>
                                {
                                    this.props.operationMode.map(item => {
                                        return Object.keys(item).map(key=>{
                                            return <Option value={key} key={key}>{item[key]}</Option>
                                        })
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="来源"
                    >
                        {getFieldDecorator('appSource',{
                            rules: [{
                                required: !this.state.studioDisabled, message: '请选择来源',
                            }],
                            initialValue: `${util.isEmpty(this.props.info.appSource)?"":this.props.info.appSource}`
                        })(
                            <Select disabled={this.state.studioDisabled}>
                                {
                                    this.props.appSource.map(item => {
                                        return Object.keys(item).map(key=>{
                                            return <Option value={key} key={key}>{item[key]}</Option>
                                        })
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                    {/*TODO */}
                    <FormItem
                        {...formItemLayout}
                        label="工作室"
                    >
                        {getFieldDecorator('parentId',{
                            rules: [{
                                required: !this.state.studioDisabled, message: '请选择工作室',
                            }],
                            initialValue: `${util.isEmpty(this.props.info.parentId)?"":this.props.info.parentId}`
                        })(
                            <Select disabled={this.state.studioDisabled}>
                                {
                                    this.props.parentId.map(item => {
                                        return Object.keys(item).map(key=>{
                                            return <Option value={key} key={key}>{item[key]}</Option>
                                        })
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="二级手游分类"
                    >
                        {getFieldDecorator('mobileGameTypeId',{
                            rules: [{
                                required: !this.state.studioDisabled, message: '请选择二级手游分类',
                            }],
                            initialValue: `${util.isEmpty(this.props.info.mobileGameTypeId)?"":this.props.info.mobileGameTypeId}`
                        })(
                            <Select disabled={this.state.studioDisabled}>
                                {
                                    this.props.mobileGameType.map(item => {
                                        return Object.keys(item).map(key=>{
                                            return <Option value={key} key={key}>{item[key]}</Option>
                                        })
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                </Form>
            </Spin>
            </div>
        )
    }
}


AddAppForm.defaultProps = {
    apps: {},
    info:{},
    appType:[],
    clientType:[],
    graphicsMode:[],
    operationMode:[],
    appSource:[],
    mobileGameType:[],
    parentId:[{1:'test'},{2:'test2'},{3:'test3'},{4:'test4'}],
};


const WrappedAddAppForm = Form.create()(AddAppForm);

export default WrappedAddAppForm;