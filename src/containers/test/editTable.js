import React, {Component} from 'react';
import { connect } from 'react-redux'


import { getGroupList} from "../../reducers/table.redux";
import { getDBs,getFieldsType} from "../../reducers/config.redux";

import {Popconfirm, Table, Input, Button, Form, Select,Cascader ,Checkbox} from 'antd'

import style from './App.less';
import tableUtil from "../../util/tableUtil";
import util from "../../util/util";

const Option = Select.Option;
const FormItem = Form.Item;

const EditableContext = React.createContext();


const EditableRow = ({ form, index, ...props }) => {

    return <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
}

const EditableFormRow = Form.create()(EditableRow);

const EditableFormRow2 = ()=>(<EditableFormRow
    wrappedComponentRef={(form) => this.formRef = form}       //5、使用wrappedComponentRef 拿到子组件传递过来的ref（官方写法）
/>)

@connect(
    state => state.config,
    {}
)
class EditableCell extends React.Component {
    //默认是打开的，否则单元格无法活得焦点
    state = {
        editing: true,
    }

    componentDidMount() {
        if (this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    handleClickOutside = (e) => {
        const { editing } = this.state;
        if (this.type==='fieldType'){
            if (editing && e.target.localName !== 'li' && !this.cell.contains(e.target)) {
                this.save();
            }
        } else if(this.type==='input'){
            if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
                this.save();
            }
        }else if (this.type==='checkbox'){
            if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
                this.save();
            }
        }

    }

    save = () => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    }

    handleChange=(value)=> {
        console.log(`selected ${value}`);
    }

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            type,
            index,
            handleSave,
            ...restProps
        } = this.props;

        const getItem = (form,dataIndex,type)=>{

            if (type==="input"){
                return <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                        rules: [{
                            required: true,
                            message: `${title} is required.`,
                        }],
                        initialValue: record[dataIndex],
                    })(
                        <Input
                            ref={node => (this.input = node)}
                            onPressEnter={this.save}
                        />
                    )}
                </FormItem>
            } else if(type==="fieldType"){
                return <FormItem style={{ margin: 0 }}>

                    {form.getFieldDecorator(dataIndex, {
                        rules: [{
                            required: true,
                            message: `${title} is required.`,
                        }],
                        initialValue: record[dataIndex],
                    })(
                        <Cascader
                            ref={node => (this.input = node)}
                            options={tableUtil.getFieldType(this.props.fieldTypes,'HIVE')}
                            placeholder="请选择类型"
                            expandTrigger={"hover"}
                            onChange={this.handleChange}
                        />
                    )}
                </FormItem>
            }else if(type==="checkbox"){
                return <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                        rules: [{
                            required: true,
                            message: `${title} is required.`,
                        }],
                        valuePropName: 'checked',
                        initialValue: util.isEmpty(record[dataIndex])?false:record[dataIndex],
                    })(
                        <Checkbox defaultChecked={this.props.record[this.props.dataIndex]==='true'}
                                  ref={node => (this.input = node)} />
                    )}
                </FormItem>
            }

        }

        return (
            <td ref={node => {this.cell = node;this.type=type;return this.cell }} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    getItem(form,dataIndex,type)
                                ) : (
                                    <div
                                        style={{ paddingRight: 24 }}
                                        onClick={this.toggleEdit}
                                    >
                                        {restProps.children}
                                    </div>
                                )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

@connect(
    state => state.config,
    {getGroupList,getDBs,getFieldsType}
)
class TestTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: 'name',
            dataIndex: 'name',
            width: '30%',
            type:'input',
            editable: true,
            align:'center',
        }, {
            title: 'fieldType',
            dataIndex: 'fieldType',
            editable: false,
            align:'center',
            type:'fieldType',
            render: (text) => {return tableUtil.fieldTypeRender(text)},
        }, {
            title: 'address',
            dataIndex: 'address',
            editable: false,
            align:'center',
            type:'input',
        },{
            title: '男的',
            dataIndex: 'sex',
            editable: true,
            align:'center',
            type:'checkbox',
            render: (text) => <Checkbox checked={text===true} />,
        },{
            title: 'operation',
            dataIndex: 'operation',
            align:'center',
            render: (text, record) => (
                this.state.dataSource.length >= 1
                    ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <a href="javascript:;">Delete</a>
                        </Popconfirm>
                    ) : null
            ),
        }];

        this.state = {
            dataSource: [{
                name: 'Edward King 0',
                key: '0',
                fieldType: '',
                sex:'',
                address: 'London, Park Lane no. 0',
            }, {
                key: '1',
                name: 'Edward King 1',
                fieldType: '',
                sex:'',
                address: 'London, Park Lane no. 1',
            }],
            count: 2,
        };

        this.props.getFieldsType();
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    }

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
    }

    test=()=>{
        console.log(this,this.form);
    }

     BodyWrapper = (props) => {return <EditableFormRow {...props} wrappedComponentRef={(inst) => this.formRef = inst} />};
     components = {
        body: {
            row: EditableFormRow,
            cell: EditableCell,
        },
    };

    render() {

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                    type:col.type,
                }),
            };
        });


        return (
            <div >
                <Button type="primary">添加字段</Button>
                <Button type="danger">清空字段</Button>
                <Table
                    components={this.components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={this.state.dataSource}
                    columns={columns}
                    pagination={false}
                />
                <Button type="primary" onClick={this.test}>创建</Button>

            </div>
        );
    }
}


export default TestTable;