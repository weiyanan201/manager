import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, Form, Button, Input, Checkbox, Modal, Cascader, message, Spin, Icon} from 'antd';

import tableUtil from "../../../../util/tableUtil";
import util from "../../../../util/util";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class CloumnForm extends React.Component {
    render() {

        let columnInfo = this.props.columnInfo || {};
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        }
        return (
            <Form layout="horizontal">
                <FormItem label="字段名称" {...formItemLayout}>
                    {
                        getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: `name is required.`,
                            }],
                            initialValue: columnInfo.name
                        })(
                            <Input type="text"/>
                        )
                    }
                </FormItem>
                <FormItem label="type" {...formItemLayout}>
                    {
                        getFieldDecorator('type', {
                            rules: [{
                                required: true,
                                message: `type is required.`,
                            }],
                            initialValue: util.isEmpty(columnInfo.type) ? '' : tableUtil.fieldTypeDeser(columnInfo.type)
                        })(
                            <Cascader
                                options={tableUtil.getFieldType(this.props.fieldTypes, this.props.storageType)}
                                placeholder="请选择类型"
                                expandTrigger={"hover"}
                                disabled={this.props.isEdit}
                            />
                        )
                    }
                </FormItem>

                <FormItem label="注释" {...formItemLayout}>
                    {
                        getFieldDecorator('comment', {
                            rules: [{
                                required: !this.props.isTemp,
                                message: `comment is required.`,
                            }],
                            initialValue: columnInfo.comment
                        })(
                            <TextArea rows={3} placeholder="请输入注释"/>
                        )
                    }
                </FormItem>

                {
                    this.props.storageType === "PHOENIX" ?
                        <FormItem label="可为空" {...formItemLayout}>
                            {
                                getFieldDecorator('nullable', {
                                    valuePropName: 'checked',
                                    initialValue: columnInfo.nullable,
                                })(
                                    <Checkbox defaultChecked={columnInfo.nullable === 'true'}/>
                                )
                            }
                        </FormItem>
                        : null

                }
            </Form>
        );
    }
}

CloumnForm.defaultProps = {
    isTemp:false
};

CloumnForm = Form.create({})(CloumnForm);
export default CloumnForm;