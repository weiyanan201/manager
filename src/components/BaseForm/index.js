import React from 'react';
import PropTypes from 'prop-types';

import { Input, Select, Form, Button, Checkbox, Radio, DatePicker} from 'antd'

import {getOptionList} from '../../util/util'

const FormItem = Form.Item;
const Option = Select.Option;


class BaseForm extends React.Component{

    handleSubmit = ()=>{
        let fieldsValue = this.props.form.getFieldsValue();
        this.props.handleSubmit(fieldsValue);
    };

    getOptionList(data){
        if(!data){
            return [];
        }
        let options = [] //[<Option value="0" key="all_key">全部</Option>];
        data.map((item)=>{
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options;
    }

    reset = ()=>{
        this.props.form.resetFields();
    };

    initFormList = ()=>{
        const { getFieldDecorator } = this.props.form;
        const formList = this.props.formList;
        const formItemList = [];
        if (formList && formList.length>0){
            formList.forEach((item,i)=>{
                let label = item.label;
                let field = item.field;
                let initialValue = item.initialValue || '';
                let placeholder = item.placeholder;
                let width = item.width;
                if(item.type == 'INPUT'){
                    const INPUT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field],{
                                initialValue: initialValue
                            })(
                                <Input type="text" style={{ width: width }} placeholder={placeholder} />
                            )
                        }
                    </FormItem>;
                    formItemList.push(INPUT)
                } else if (item.type == 'SELECT') {
                    const SELECT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue
                            })(
                                <Select
                                    style={{ width: width }}
                                    placeholder={placeholder}
                                >
                                    {this.getOptionList(item.list)}


                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT)
                } else if (item.type == 'CHECKBOX') {
                    const CHECKBOX = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                valuePropName: 'checked',
                                initialValue: initialValue //true | false
                            })(
                                <Checkbox>
                                    {label}
                                </Checkbox>
                            )
                        }
                    </FormItem>;
                    formItemList.push(CHECKBOX)
                } else if (item.type == 'DATE') {
                    const Date = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field])(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(Date)
                }
            })
        }
        return formItemList;
    };

    render(){
        const formList = this.initFormList();
        const formReturn = formList===null || formList.length===0? null:<Form layout={this.props.layout}>
            { formList }
            <FormItem>
                <Button type="primary" style={{ margin: '0 20px' }} onClick={this.handleSubmit}>{this.props.submitText}</Button>
                <Button onClick={this.reset}>重置</Button>
            </FormItem>
        </Form>;
        return (
            formReturn
        );
    }
}

export default Form.create({})(BaseForm);

BaseForm.defaultProps = {
    layout: 'inline',
    submitText:'查询',
    handleSubmit:()=>{},
    formList:[],
};

BaseForm.propTypes = {
    layout:PropTypes.string,
    submitText:PropTypes.string,
    handleSubmit:PropTypes.func,
    formList:PropTypes.array
};
