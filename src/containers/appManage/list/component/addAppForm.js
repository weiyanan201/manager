import React,{ Component } from 'react';
import { Form, Input, Select, Spin } from 'antd';

import util from "../../../../util/util";
import style from '../style.less';

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

    componentDidMount(){
        if (Object.keys(this.props.formObject).length!==0 && util.isEmpty(this.props.formObject.parentId)){
            this.setState({
                studioDisabled:true
            })
        }
    }

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
            //改变表单值
            // this.props.form.setFieldsValue({
            //     note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
            // });
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
                            initialValue: Object.keys(this.props.formObject).length===0?null:util.isEmpty(this.props.formObject.parentId)?FORM_TYPE.STUDIO.key:FORM_TYPE.APP.key
                        })(
                            <Select onSelect={(val)=>this.handleChangeType(val)} disabled={this.props.readOnly}>
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
                            initialValue: this.props.formObject.id
                        })(
                            <Input disabled={this.props.readOnly}/>
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
                            initialValue: this.props.formObject.appName
                        })(
                            <Input disabled={this.props.readOnly}/>
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
                            initialValue: this.props.formObject.appAbbrName
                        })(
                            <Input disabled={this.props.readOnly}/>
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
                            initialValue: this.props.formObject.appDesc
                        })(
                            <Input disabled={this.props.readOnly}/>
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
                            initialValue: `${util.isEmpty(this.props.formObject.appType)?"":this.props.formObject.appType}`
                        })(
                            <Select disabled={this.state.studioDisabled || this.props.readOnly}>
                                {
                                    Object.keys(this.props.appType).map(key => (
                                        <Option value={key} key={key}>{this.props.appType[key]}</Option>
                                    ))
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
                            initialValue: `${util.isEmpty(this.props.formObject.clientType)?"":this.props.formObject.clientType}`
                        })(
                            <Select disabled={this.state.studioDisabled || this.props.readOnly}>
                                {
                                    Object.keys(this.props.clientType).map(key => (
                                        <Option value={key} key={key}>{this.props.clientType[key]}</Option>
                                    ))
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
                            initialValue: `${util.isEmpty(this.props.formObject.graphicsMode)?"":this.props.formObject.graphicsMode}`
                        })(
                            <Select disabled={this.state.studioDisabled || this.props.readOnly}>
                                {
                                    Object.keys(this.props.graphicsMode).map(key => (
                                        <Option value={key} key={key}>{this.props.graphicsMode[key]}</Option>
                                    ))
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
                            initialValue: `${util.isEmpty(this.props.formObject.operationMode)?"":this.props.formObject.operationMode}`
                        })(
                            <Select disabled={this.state.studioDisabled || this.props.readOnly}>
                                {
                                    Object.keys(this.props.operationMode).map(key => (
                                        <Option value={key} key={key}>{this.props.operationMode[key]}</Option>
                                    ))
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
                            initialValue: `${util.isEmpty(this.props.formObject.appSource)?"":this.props.formObject.appSource}`
                        })(
                            <Select disabled={this.state.studioDisabled || this.props.readOnly}>
                                {
                                    Object.keys(this.props.appSource).map(key => (
                                        <Option value={key} key={key}>{this.props.appSource[key]}</Option>
                                    ))
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
                            initialValue: `${util.isEmpty(this.props.formObject.parentId)?"":this.props.formObject.parentId}`
                        })(
                            <Select disabled={this.state.studioDisabled || this.props.readOnly}>
                                {
                                    Object.keys(this.props.parentId).map(key => {
                                         return <Option value={key} key={key}>{this.props.parentId[key]}</Option>
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
                            initialValue: `${util.isEmpty(this.props.formObject.mobileGameTypeId)?"":this.props.formObject.mobileGameTypeId}`
                        })(
                            <Select disabled={this.state.studioDisabled || this.props.readOnly}>
                                {

                                    Object.keys(this.props.mobileGameType).map(key => (
                                        <Option value={key} key={key}>{this.props.mobileGameType[key]}</Option>
                                    ))
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                    >
                        {getFieldDecorator('originalID',{
                            initialValue: Object.keys(this.props.formObject).length===0?"":this.props.formObject.id
                        })(
                            <input type="hidden"/>
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
    formObject:{},
    appType:{},
    clientType:{},
    graphicsMode:{},
    operationMode:{},
    appSource:{},
    mobileGameType:{},
    parentId:{},
    readOnly:false
};


const WrappedAddAppForm = Form.create()(AddAppForm);

export default WrappedAddAppForm;