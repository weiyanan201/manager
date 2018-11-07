
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Form, Input } from 'antd';


const FormItem = Form.Item;
const TextArea = Input.TextArea;

class InfoForm extends React.Component {

    render() {
        let tableInfo = this.props.tableInfo || {};
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="表名" {...formItemLayout}>
                    {
                        getFieldDecorator('tableName', {
                            rules: [{
                                required: true,
                                message: `tableName is required.`,
                            }],
                            initialValue: tableInfo.tableName
                        })(
                            <Input type="text" disabled={tableInfo.storageType !== "HIVE"}/>
                        )
                    }
                </FormItem>
                <FormItem label="dbName" {...formItemLayout}>
                    {
                        getFieldDecorator('db', {
                            rules: [{
                                required: true,
                                message: `db is required.`,
                            }],
                            initialValue: tableInfo.db
                        })(
                            <Input type="text" disabled={true}/>
                        )
                    }
                </FormItem>
                <FormItem label="存储介质" {...formItemLayout}>
                    {
                        getFieldDecorator('storageType', {
                            rules: [{
                                required: true,
                                message: `storageType is required.`,
                            }],
                            initialValue: tableInfo.storageType
                        })(
                            <Input type="text" disabled={true}/>
                        )
                    }
                </FormItem>
                <FormItem label="描述" {...formItemLayout}>
                    {
                        getFieldDecorator('comment', {
                            rules: [{
                                required: true,
                                message: `comment is required.`,
                            }],
                            initialValue: tableInfo.comment
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

export default InfoForm;