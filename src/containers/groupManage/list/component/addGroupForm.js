import React,{ Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Spin, Modal } from 'antd';

import axios from '../../../../util/axios';
import util from "../../../../util/util";

const FormItem = Form.Item;
const Option = Select.Option;

class AddGroupForm extends Component {

    state = {
        apps:{}
    }
    componentDidMount(){
        //组合剩余app
        //rest+选中的app
        // const apps =  this.props.restApp;
        const apps = Object.assign({}, this.props.restApp);
        if (Object.keys(this.props.formObject).length>0){
            apps[this.props.formObject.appId]=this.props.allApps[this.props.formObject.appId];
        }
        this.setState({
            apps
        })
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

                <Form >
                    <FormItem
                        {...formItemLayout}
                        label="组名"
                    >
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true, message: '请输入组名',
                            }],
                            initialValue: this.props.formObject.name
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
                            initialValue: this.props.formObject.desc
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="对应APP"
                    >
                        {getFieldDecorator('appId',{
                            initialValue: `${util.isEmpty(this.props.formObject.appId)?"":this.props.formObject.appId}`
                        })(
                            <Select
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                showSearch
                            >
                                {
                                    Object.keys(this.state.apps).map(id=>
                                        <Option value={id} key={id}>{this.state.apps[id]}</Option>
                                    )
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                    >
                        {getFieldDecorator('id',{
                            initialValue: Object.keys(this.props.formObject).length===0?"":this.props.formObject.id
                        })(
                            <input type="hidden" />
                        )}
                    </FormItem>
                </Form>
        )
    }
}


AddGroupForm.defaultProps = {
    restApp: {},
    allApps:{},
    formObject:{}
};


const WrappedAddGroupForm = Form.create()(AddGroupForm);

export default WrappedAddGroupForm;