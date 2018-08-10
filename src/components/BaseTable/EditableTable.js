
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
        this.state = { dataSource:[], editingKey: '',count:0 };
    }

    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    //添加记录
    handleAdd=()=>{
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
        this.props.handleModifyColumn([...dataSource, newData]);
    }

    //删除记录
    handleDelete=(key)=>{
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
        this.props.handleModifyColumn(dataSource.filter(item => item.key !== key));
    }

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
                _this.setState({dataSource:[]})
                _this.props.handleModifyColumn([]);
            }
        });

    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    save(form, key) {
        
        console.log(form);
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.dataSource];
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
            this.setState({ dataSource: newData, editingKey: '' });
            this.props.handleModifyColumn(newData);
        });
    }

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    onDoubleClick=(record,index)=>{
        console.log(record,index);
        this.setState({ editingKey: record.key });
    }

    onMouseLeave=(record,index)=>{
        console.log("onMouseLeave",record,index,"begin save");
        if (record.form){
            this.save(record.form,record.key);
        }

    }


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
                title: 'operation',
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
                                                onClick={() => this.save(form, record.key)}
                                                style={{ marginRight: 8 }}
                                            >
                                                Save
                                            </a>
                                        )}}
                                  </EditableContext.Consumer>
                                  <Popconfirm
                                      title="Sure to cancel?"
                                      onConfirm={() => this.cancel(record.key)}
                                  >
                                    <a>Cancel</a>
                                  </Popconfirm>
                                </span>
                            ) : (
                                <span>
                                    <a onClick={() => this.edit(record.key)} style={{ marginRight: 8 }}>Edit</a>
                                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                                        <a href="javascript:;">Delete</a>
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
                    添加记录
                </Button>
                <Button onClick={this.handleClear} type="danger" style={{ marginBottom: 16 }}>
                    清空记录
                </Button>
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.dataSource}
                    columns={columns}
                    rowClassName={style["editable-row"]}
                    onRow={(record, index) => {
                        return {
                            // onDoubleClick:()=>{
                            //     this.onDoubleClick(record,index);
                            // },
                            // onMouseLeave:()=>{
                            //     this.onMouseLeave(record,index);
                            // }
                        };
                    }}
                />
            </div>
        );
    }
}
