import React from 'react';
import {Button , Card,Spin,Table,Cascader,Form,InputNumber,Input,Popconfirm,Select} from 'antd';
import tableUtil from "../util/tableUtil";
import { connect } from 'react-redux';
import {getFieldsType} from "../reducers/config.redux";


const options = [{
    value:'sh',
    label:'shanghai'
},{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
        }],
    }],
}];


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
    state = {
        editing: false,
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
        if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
            this.save();
        }
    }

    save = () => {
        const { record, handleSave ,columnType,dataIndex} = this.props;
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            if(columnType==='fieldType'){
                let tmpVal = values[dataIndex].join(",");
                values[dataIndex]=tmpVal;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values ,columnType});
        });
    }

    onChange=(a,b,c)=>{
        console.log(a,b,c);
        a=a.join(",");
    }
    
    getInput= ()=>{
        if (this.props.columnType === 'fieldType') {
                return <Cascader
                            options={tableUtil.getFieldType(this.props.fieldTypes,this.props.storageType)}
                            placeholder="请选择类型" ref={node => (this.input = node)}
                            onPressEnter={this.save}
                    />
        }
        return <Input ref={node => (this.input = node)}
                      onPressEnter={this.save}/>;
    }

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            columnType,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title} is required.`,
                                            }],
                                            // initialValue: record[dataIndex],
                                        })(
                                            this.getInput()
                                        )}
                                    </FormItem>
                                ) : (
                                    <div
                                        className="editable-cell-value-wrap"
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
    {getFieldsType}
)
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.props.getFieldsType();
        this.columns = [{
            title: 'name',
            dataIndex: 'name',
            width: '30%',
            editable: true,
            columnType:'input'
        }, {
            title: 'age',
            dataIndex: 'age',
            editable: true,
            columnType:'fieldType',
            storageType:'HIVE'
        }, {
            title: 'address',
            dataIndex: 'address',
            editable: true,
            columnType:'input',
        }, {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => {
                return (
                    this.state.dataSource.length > 1
                        ? (
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                                <a href="javascript:;">Delete</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];

        this.state = {
            dataSource: [{
                key: '0',
                name: 'Edward King 0',
                age: '32',
                address: 'London, Park Lane no. 0',
            }, {
                key: '1',
                name: 'Edward King 1',
                age: '32',
                address: 'London, Park Lane no. 1',
            }],
            count: 2,
        };
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

    render() {
        const { dataSource } = this.state;
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
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    columnType:col.columnType,
                    handleSave: this.handleSave,
                    ...col
                }),
            };
        });
        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    Add a row
                </Button>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        );
    }
}


export default class NotPage extends React.Component{
    render(){
        return (
            <div>
                <EditableTable/>
            </div>
        )
    }
}