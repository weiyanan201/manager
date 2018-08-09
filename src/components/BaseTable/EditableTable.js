
import React from 'react';
import { connect } from 'react-redux';

import {Button , Card,Spin,Table,Cascader,Form,InputNumber,Input,Popconfirm,Select,Row,message,Modal,Collapse ,Checkbox,Badge } from 'antd';
import tableUtil from '../../util/tableUtil';
import util from "../../util/util";

const data = [];
for (let i = 0; i < 100; i++) {
    data.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@connect(
    state => state.config,
    {}
)
class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            columnType,
            required,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    let formItem = null;
                    if (columnType==='number'){
                        formItem = <FormItem style={{ margin: 0 }}>
                            {getFieldDecorator(dataIndex, {
                                rules: [{
                                    required: true,
                                    message: `Please Input ${title}!`,
                                }],
                                initialValue: record[dataIndex],
                            })(<InputNumber />)}
                        </FormItem>
                    }else if(columnType==='input'){
                        formItem = <FormItem style={{ margin: 0 }}>
                            {getFieldDecorator(dataIndex, {
                                rules: [{
                                    required: true,
                                    message: `Please Input ${title}!`,
                                }],
                                initialValue: record[dataIndex],
                            })(<Input />)}
                        </FormItem>
                    }else if(columnType==='fieldType'){
                        formItem = <FormItem style={{ margin: 0 }}>
                            {getFieldDecorator(dataIndex, {
                                rules: [{
                                    required: true,
                                    message: `Please Input ${title}!`,
                                }],
                                // initialValue: record[dataIndex],
                            })(
                                <Cascader
                                    options={tableUtil.getFieldType(this.props.fieldTypes,this.props.storageType)}
                                    placeholder="请选择类型"
                                    // defaultValue={[this.props.record[this.props.dataIndex]]}
                                />
                            )}
                        </FormItem>
                    }else {
                        formItem = null;
                    }
                    return (
                        <td {...restProps}>
                            {editing ? (
                                formItem
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

export default class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data, editingKey: '' };
        this.columns = [
            {
                title: 'name',
                dataIndex: 'name',
                width: '25%',
                editable: true,
                required:true,
                columnType:'input'
            },
            {
                title: 'age',
                dataIndex: 'age',
                width: '15%',
                editable: true,
                required:true,
                columnType:'number'
            },
            {
                title: 'address',
                dataIndex: 'address',
                width: '40%',
                editable: true,
                required:true,
                storageType:'HIVE',
                columnType:'fieldType'
            },
            {
                title: 'operation',
                dataIndex: 'operation',
                render: (text, record) => {
                    const editable = this.isEditing(record);
                    return (
                        <div>
                            {editable ? (
                                <span>
                  <EditableContext.Consumer>
                    {form => (
                        <a
                            href="javascript:;"
                            onClick={() => this.save(form, record.key)}
                            style={{ marginRight: 8 }}
                        >
                            Save
                        </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                      title="Sure to cancel?"
                      onConfirm={() => this.cancel(record.key)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                            ) : (
                                <a onClick={() => this.edit(record.key)}>Edit</a>
                            )}
                        </div>
                    );
                },
            },
        ];
    }

    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    edit(key) {
        this.setState({ editingKey: key });
    }

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ data: newData, editingKey: '' });
            } else {
                newData.push(row);
                this.setState({ data: newData, editingKey: '' });
            }
        });
    }

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    required:col.required,
                    columnType:col.columnType,
                    editing: this.isEditing(record),
                    ...col,
                }),
            };
        });

        return (
            <Table
                components={components}
                bordered
                dataSource={this.state.data}
                columns={columns}
                rowClassName="editable-row"

            />
        );
    }
}
