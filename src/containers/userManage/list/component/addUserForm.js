import React,{ Component } from 'react';
import { Form, Input,  Select, Row, Col, Button } from 'antd';

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
            sourceDisabled:true,
            isEdit:false,
            editOutService:false,
        };

        this.handleRelateUAM = this.handleRelateUAM.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.getTypeSelect = this.getTypeSelect.bind(this);
    }

    componentDidMount(){
        const formObject = this.props.formObject;
        if (Object.keys(formObject).length>0){
            this.setState({
                isEdit:true,
                editOutService:formObject.tenantType===TenantType.OUTER_SERVICE.key,
                sourceDisabled:formObject.tenantType===TenantType.OUTER_SERVICE.key,
                disabled:formObject.tenantType!==TenantType.OUTER_SERVICE.key,
            })
        } else{
            this.setState({
                isEdit:false,
            })
        }
        
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

    //add show all
    //edit outService  disable
    //edit other exclude outService
    getTypeSelect=()=>{
        const { isEdit,editOutService } = this.state;
        if (!isEdit){
            return <Select onSelect={(val)=>this.handleChangeType(val)}>
                {
                    Object.keys(TenantType).map(item=>
                        <Option value={item} key={item}>{TenantType[item].text}</Option>
                    )
                }
            </Select>
        }else{
            //edit
            if (editOutService){
                return <Select onSelect={(val)=>this.handleChangeType(val)} disabled={true}>
                    {
                        Object.keys(TenantType).map(item=>
                            <Option value={item} key={item}>{TenantType[item].text}</Option>
                        )
                    }
                </Select>
            }else{
                let options = [];
                Object.keys(TenantType).forEach(item=>
                    {
                        if (item!==TenantType.OUTER_SERVICE.key){
                            options.push(<Option value={item} key={item}>{TenantType[item].text}</Option>);
                        }
                    }
                );
                return <Select onSelect={(val)=>this.handleChangeType(val)}>
                    {
                         options
                    }
                </Select>
            }
        }
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
                <Form >
                    <FormItem
                        {...formItemLayout}
                        label="用户类型"
                    >
                        {getFieldDecorator('tenantType', {
                            rules: [{
                                required: true, message: 'Please input your E-mail!',
                            }],
                            initialValue: this.props.formObject.tenantType
                        })(
                            this.getTypeSelect()
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="工号"
                    >
                        <Row gutter={8}>
                            <Col span={20}>
                                {getFieldDecorator('sourceId',{
                                    initialValue: this.props.formObject.sourceId
                                })(
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
                            initialValue: this.props.formObject.userName
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
                            initialValue: this.props.formObject.deptName
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
                            initialValue: this.props.formObject.mobile
                        })(
                            <Input disabled={this.state.disabled}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="邮箱"
                    >
                        {getFieldDecorator('email',{
                            initialValue: this.props.formObject.email
                        })(
                            <Input disabled={this.state.disabled} />
                        )}
                    </FormItem>

                    <FormItem

                    >
                        {getFieldDecorator('id',{
                            initialValue: this.props.formObject.id
                        })(
                            <Input type="hidden" />
                        )}
                    </FormItem>
                </Form>
        )
    }
}

AddUserForm.defaultProps = {
    formObject:{}
};

const WrappedAddUserForm = Form.create()(AddUserForm);

export default WrappedAddUserForm;