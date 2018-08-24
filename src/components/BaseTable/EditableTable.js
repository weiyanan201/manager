
import React from 'react';
import { connect } from 'react-redux';

import {Button , Card,Spin,Table,Cascader,Form,InputNumber,Input,Popconfirm,Select,Row,message,Modal,Collapse ,Checkbox,Badge } from 'antd';
import tableUtil from '../../util/tableUtil';

import style from './index.less'

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

    render() {
        const {
            editing,
            dataIndex,
            title,
            record,
            columnType,
            required,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    let formItem = null;
                    if(columnType==='input'){
                        formItem = <FormItem style={{ margin: 0 }}>
                            {getFieldDecorator(dataIndex, {
                                rules: [{
                                    required: required,
                                    message: `${title} is required.`,
                                }],
                                initialValue: record[dataIndex],
                            })(<Input />)}
                        </FormItem>
                    }else if(columnType==='fieldType'){
                        formItem = <FormItem style={{ margin: 0 }} >
                            {getFieldDecorator(dataIndex, {
                                rules: [{
                                    required: required,
                                    message: `${title} is required.`,
                                }],
                                initialValue: record[dataIndex],
                            })(
                                <Cascader
                                    options={tableUtil.getFieldType(this.props.fieldTypes,this.props.storageType)}
                                    placeholder="请选择类型"
                                    expandTrigger={"hover"}
                                    // defaultValue={[this.props.record[this.props.dataIndex]]}
                                />
                            )}
                        </FormItem>
                    }else if(columnType==='checkbox'){
                        formItem = <FormItem style={{ margin: 0 }}>
                            {getFieldDecorator(dataIndex, {
                                rules: [{
                                    required: required,
                                    message: `${title} is required.`,
                                }],
                                valuePropName: 'checked',
                                initialValue: record[dataIndex],
                            })(
                                <Checkbox defaultChecked={this.props.record[this.props.dataIndex]==='true'} />
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
        this.state = { editingKey: ''};
    }

    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    //添加记录
    handleAdd=()=>{
        const { keyCount } = this.props;
        const newData = {
            key: keyCount,
        };
        this.edit(keyCount);
        this.props.handleModifyColumn([...this.props.dataSource, newData],keyCount+1);
    };

    //删除记录
    handleDelete=(key)=>{
        const dataSource = [...this.props.dataSource];
        this.props.handleModifyColumn(dataSource.filter(item => item.key !== key));
    };

    //清空记录
    handleClear=()=>{
        let _this = this;
        Modal.confirm({
            title: '提示',
            content: '是否要清空所有记录',
            okText: '清空',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.props.handleModifyColumn([],0);
            }
        });
    };

    edit(key) {
        this.setState({ editingKey: key });
    }

    save(form, record) {
        const key = record.key;
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.props.dataSource];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
            } else {
                newData.push(row);
            }
            this.setState({ editingKey: '' });
            this.props.handleModifyColumn(newData);
        });
    };

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
        let {tableColumns} = this.props;
        const columns = tableColumns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                //默认样式
                align:'center',
                width:'300px',
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    required:col.required,
                    columnType:col.columnType,
                    editing: this.isEditing(record),
                    ...col,
                }),
            };
        }).concat(
            [{
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    const editable = this.isEditing(record);
                    return (
                        <div>
                            {editable ? (
                                <span>
                                  <EditableContext.Consumer>
                                    {
                                        form => {
                                            record.form = form;
                                            return (
                                            <a
                                                href="javascript:;"
                                                onClick={() => this.save(form, record)}
                                                style={{ marginRight: 8 }}
                                            >
                                                保存
                                            </a>
                                        )}}
                                  </EditableContext.Consumer>
                                  <Popconfirm
                                      title="Sure to cancel?"
                                      onConfirm={() => this.cancel(record.key)}
                                  >
                                    <a>取消</a>
                                  </Popconfirm>
                                </span>
                            ) : (
                                <span>
                                    <a onClick={() => this.edit(record.key)} style={{ marginRight: 8 }}>编辑</a>
                                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                                        <a href="javascript:;">删除</a>
                                    </Popconfirm>
                                </span>
                            )}
                        </div>
                    );
                },
            }]
        );

        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    添加字段
                </Button>
                <Button onClick={this.handleClear} type="danger" style={{ marginBottom: 16 }}>
                    清空字段
                </Button>
                <Table
                    components={components}
                    bordered
                    dataSource={this.props.dataSource}
                    columns={columns}
                    rowClassName={style["editable-row"]}
                    onRow={(record, index) => {
                        return {

                        };
                    }}
                    pagination={{style:{textAlign:'center',width:'100%'}}}
                />
            </div>
        );
    }
}
