import React,{ Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Spin, Modal } from 'antd';

import { StorageType,ProduceType } from '../../../../config';

const FormItem = Form.Item;
const Option = Select.Option;

class AddDbForm extends Component {

    state = {
        ownerDisabled:true
    }

    formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4,offset:2 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16},
        },
    };

    handleUsage = (value)=> {
        if (value===ProduceType.PRIVATE){
            //放开owner选项
            this.setState({
                ownerDisabled : false
            })
        }else{
            //清空该表单并禁用
            this.setState({
                ownerDisabled : true
            });
            this.props.form.setFieldsValue({
                ownerId:"",
            });
        }
    };


    render(){

        const { getFieldDecorator } = this.props.form;


        return (
            <Form >
                <FormItem
                    {...this.formItemLayout}
                    label="数据库名"
                >
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, message: '请输入数据库名',
                        }]
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem
                    {...this.formItemLayout}
                    label="描述"
                >
                    {getFieldDecorator('comment', {
                        rules: [{
                            required: true, message: '请输入描述',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem
                    {...this.formItemLayout}
                    label="存储介质"
                >
                    {getFieldDecorator('storageType',{
                        rules: [{
                            required: true, message: '请输入数据库名',
                        }]
                    })(
                        <Select>
                            {
                                Object.values(StorageType).map(val=>
                                    <Option value={val} key={val}>{val}</Option>
                                )
                            }
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    {...this.formItemLayout}
                    label="类型"
                >
                    {getFieldDecorator('usage',{
                        rules: [{
                            required: true, message: '请输入数据库名',
                        }]
                    })(
                        <Select onChange={this.handleUsage}>
                            {
                                Object.values(ProduceType).map(val=>
                                    <Option value={val} key={val}>{val}</Option>
                                )
                            }
                        </Select>
                    )}
                </FormItem>

                {/*private才可以选择*/}
                <FormItem
                    {...this.formItemLayout}
                    label="owner"
                >
                    {getFieldDecorator('ownerId',{
                        rules: [{
                            required: !this.state.ownerDisabled, message: '请输入数据库名',
                        }]
                    })(
                        <Select disabled={this.state.ownerDisabled}>
                            {
                                Object.keys(this.props.tenants).map(key=>
                                    <Option value={key} key={key}>{this.props.tenants[key]}</Option>
                                )
                            }
                        </Select>
                    )}
                </FormItem>

            </Form>
        )
    }
}

AddDbForm.defaultProps = {
    tenants: [],
};

const WrappedAddDbForm = Form.create()(AddDbForm);

export default WrappedAddDbForm;