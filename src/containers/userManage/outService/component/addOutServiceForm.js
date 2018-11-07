import React,{ Component } from 'react';
import { Form, Input, Select,Spin } from 'antd';

import axios from '../../../../util/axios';

const FormItem = Form.Item;
const Option = Select.Option;

class AddOutServiceForm extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            tenants:[]
        };
    }

    componentDidMount(){
        //获取tenant中的outservice
        axios.get("/outService/getTenant")
            .then(res=>{
                const data = res.data.data;
                this.setState({
                    tenants:data
                })
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

            <Spin spinning={this.state.loading}>
                <Form >

                    <FormItem
                        {...formItemLayout}
                        label="用户名"
                    >
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true, message: '请输入用户名',
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="用户类型"
                    >
                        {getFieldDecorator('ownerId', {
                            rules: [{
                                required: true, message: '请选择ownerId',
                            }],
                        })(
                            <Select>
                                {
                                    this.state.tenants.map(item=>
                                        <Option value={item.id} key={item.id}>{item.userName}</Option>
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

const WrappedAddOutServiceForm = Form.create()(AddOutServiceForm);

export default WrappedAddOutServiceForm;