import React,{ Component } from 'react';
import { Form, Input,  Select, Row, Col, Button, Spin } from 'antd';

import {TenantType} from "../../../../config";
import axios from '../../../../util/axios';
import util from "../../../../util/util";

const FormItem = Form.Item;
const Option = Select.Option;

class AddUserForm extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            disabled:true,
            sourceDisabled:true
        };

        this.handleRelateUAM = this.handleRelateUAM.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
    }

    //切换用户种类
    handleChangeType = (val) => {
        //外部服务的账号可编辑
        this.setState({
            disabled:val!=="OUTER_SERVICE",
            sourceDisabled:val==="OUTER_SERVICE",
        });
        this.props.form.setFields({
            sourceId: {
            },
        });
    };

    //获取UAM信息
    handleRelateUAM = () => {
        const sourceId = this.props.form.getFieldValue('sourceId');
        if (util.isEmpty(sourceId)){
            this.props.form.setFields({
                sourceId: {
                    errors: [new Error('请输入工号')],
                },
            });
            return;
        }
        this.setState({loading:true});

        axios.get("/tenant/getUserInfoByUAM",{sourceId:sourceId})
            .then(res=>{
                const data = res.data.data;
                console.log(data);
                this.props.form.setFieldsValue({
                    userName:data.UserName,
                    deptName:data.DeptName,
                    mobile:data.Mobile,
                    email:data.Email
                });
                this.setState({loading:false});
            }).catch(res=>{
                this.setState({loading:false})
            })

    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
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
            <Spin spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="用户类型"
                    >
                        {getFieldDecorator('tenantType', {
                            rules: [{
                                required: true, message: 'Please input your E-mail!',
                            }],
                        })(
                            <Select onSelect={(val)=>this.handleChangeType(val)}>
                                {
                                    Object.keys(TenantType).map(item=>
                                        <Option value={item} key={item}>{TenantType[item].text}</Option>
                                    )
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="工号"
                    >
                        <Row gutter={8}>
                            <Col span={20}>
                                {getFieldDecorator('sourceId')(
                                    <Input disabled={this.state.sourceDisabled}/>
                                )}
                            </Col>
                            <Col span={4}>
                                <Button onClick={this.handleRelateUAM} disabled={this.state.sourceDisabled}>关联</Button>
                            </Col>
                        </Row>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="用户名"
                    >
                        {getFieldDecorator('userName', {
                            rules: [{
                                required: true, message: '请输入用户名',
                            }],
                        })(
                            <Input disabled={this.state.disabled}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="部门"
                    >
                        {getFieldDecorator('deptName', {
                            rules: [{
                                required: true, message: '请输入部门',
                            }],
                        })(
                            <Input disabled={this.state.disabled}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="联系方式"
                    >
                        {getFieldDecorator('mobile', {
                            rules: [{
                                required: true, message: '请输入电话号码',
                            }],
                        })(
                            <Input disabled={this.state.disabled}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="邮箱"
                    >
                        {getFieldDecorator('email')(
                            <Input disabled={this.state.disabled} />
                        )}
                    </FormItem>
                </Form>
            </Spin>
        )
    }
}

const WrappedAddUserForm = Form.create()(AddUserForm);

export default WrappedAddUserForm;