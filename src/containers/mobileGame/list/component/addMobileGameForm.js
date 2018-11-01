import React,{ Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Spin, Modal } from 'antd';

import { StorageType,ProduceType } from '../../../../config';
import util from "../../../../util/util";

const FormItem = Form.Item;
const Option = Select.Option;

class AddMobileGameForm extends Component {

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

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form >
                <FormItem
                    {...this.formItemLayout}
                    label="手游名称"
                >
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, message: '请输入手游名称',
                        }],
                        initialValue: this.props.formObject.name
                    })(
                        <Input disabled={!util.isEmpty(this.props.formObject.id)}/>
                    )}
                </FormItem>

                <FormItem
                    {...this.formItemLayout}
                    label="描述"
                >
                    {getFieldDecorator('desc', {
                        rules: [{
                            required: true, message: '请输入描述',
                        }],
                        initialValue: this.props.formObject.desc
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem
                >
                    {getFieldDecorator('id',{
                        initialValue: this.props.formObject.id
                    })(
                        <input type="hidden" />
                    )}
                </FormItem>

            </Form>
        )
    }
}

AddMobileGameForm.defaultProps = {
    formObject:{}
};

const WrappedAddMobileGameForm = Form.create()(AddMobileGameForm);

export default WrappedAddMobileGameForm;