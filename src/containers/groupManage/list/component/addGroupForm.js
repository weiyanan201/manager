import React,{ Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Spin, Modal } from 'antd';

import axios from '../../../../util/axios';
import util from "../../../../util/util";

const FormItem = Form.Item;
const Option = Select.Option;

class AddGroupForm extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            sourceDisabled:true,
        };
    }

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

            <Spin spinning={this.state.loading}>
                <Form >

                    <FormItem
                        {...formItemLayout}
                        label="组名"
                    >
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true, message: '请输入组名',
                            }],
                            initialValue: this.props.info.name
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="描述"
                    >
                        {getFieldDecorator('desc', {
                            rules: [{
                                required: true, message: '请输入描述',
                            }],
                            initialValue: this.props.info.desc
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="对应APP"
                    >
                        {getFieldDecorator('appId',{
                            initialValue: `${util.isEmpty(this.props.info.appId)?"":this.props.info.appId}`
                        })(
                            <Select>
                                {
                                    Object.keys(this.props.apps).map(id=>
                                        <Option value={id} key={id}>{this.props.apps[id]}</Option>
                                    )
                                }
                            </Select>
                        )}
                    </FormItem>

                </Form>
            </Spin>
        )
    }
}


AddGroupForm.defaultProps = {
    apps: {},
    info:{}
};


const WrappedAddGroupForm = Form.create()(AddGroupForm);

export default WrappedAddGroupForm;