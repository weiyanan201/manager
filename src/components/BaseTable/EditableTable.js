/**
 * 可编辑table
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import {Button , Card,Spin,Table,Cascader,Form,InputNumber,Input,Popconfirm,Select,Row,message,Modal,Collapse ,Checkbox,Badge } from 'antd';
import tableUtil from '../../util/tableUtil';
import util from "../../util/util";


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
        fieldValue : []
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
            if (editing && this.props.editable) {
                this.input.focus();
            }
        });
    }

    handleTdClick=()=>{
        const editing = this.state.editing;
        if (editing){
            return ;
        }else{
            this.toggleEdit();
        }
    }

    handleClickOutside = (e) => {
        const { editing } = this.state;
        if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
            // console.log("e.target : ",e.target);
            // console.log("this.cell : " , this.cell);
            this.save();
        }
    }

    onChange=(e)=>{
        console.log("change :" ,e);
        this.setState({
            fieldValue : e
        })
    }

    onBlur=()=>{
        console.log("onBlur");
    }

    save = () => {
        const { record, handleSave ,columnType,dataIndex} = this.props;
        let resetValue ;
        this.form.validateFields((error, values) => {
            let tmpValue ;
            //级联选项特殊处理
            //选中选项时会触发一个点击事件

            if (columnType==='fieldType') {
                // if (error && !util.isEmpty(error[dataIndex]) && util.isEmpty(record[dataIndex]) && util.isEmpty(values[dataIndex])){
                //     return ;
                // }
                // if (util.isEmpty(values[dataIndex])){
                //     resetValue = true;
                //     return ;
                // }else{
                //     tmpValue = values[dataIndex];
                // }
                return ;
            }else if(columnType==='checkbox'){
                // if (error && !util.isEmpty(error[dataIndex])){
                //     return null;
                // }
                // if (util.isEmpty(values[dataIndex])){
                //     if (util.isEmpty(record[dataIndex])) {
                //         tmpValue = 'false';
                //     }else{
                //         tmpValue = record[dataIndex];
                //     }
                // }else{
                //     tmpValue = values[dataIndex]+"";
                // }
                return ;
            }else {
                //input
                if (error && !util.isEmpty(error[dataIndex])){
                    return null;
                }
                tmpValue = values[dataIndex];
            }

            this.toggleEdit();
            handleSave({ ...record ,columnType,[dataIndex]:tmpValue});
        });

        // if (resetValue){
        //     console.log("resetValue is true");
        //     console.log(resetValue.object);
        //     this.form.setFieldsValue({
        //         [dataIndex]: record[dataIndex],
        //     });
        // }
    }

    getInput= ()=>{
        if (this.props.columnType === 'fieldType') {
            return <Cascader
                options={tableUtil.getFieldType(this.props.fieldTypes,this.props.storageType)}
                placeholder="请选择类型"
                ref={node => (this.input = node)}
                defaultValue={[this.props.record[this.props.dataIndex]]}
                onChange={this.onChange}
                onBlur={this.onBlur}
            />
        }else if (this.props.columnType === 'checkbox'){
            return <Checkbox ref={node => (this.input = node)} defaultChecked={this.props.record[this.props.dataIndex]==='true'}
                             onPressEnter={this.save} />
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
            required,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td ref={node => (this.cell = node)} {...restProps} onClick={this.handleTdClick}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            let formItem = null;
                            if (columnType==='fieldType'){
                                formItem = <FormItem style={{ margin: 0 }}>
                                    {form.getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: required,
                                            message: `${title} is required.`,
                                        }],
                                        // valuePropName: 'checked',
                                        // initialValue: [record[dataIndex]],
                                    })(
                                        this.getInput()
                                    )}
                                </FormItem>
                            }else {
                                formItem = <FormItem style={{ margin: 0 }}>
                                    {form.getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: required,
                                            message: `${title} is required.`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(
                                        this.getInput()
                                    )}
                                </FormItem>
                            }

                            return (
                                formItem
                                // editing ? formItem : (
                                //     <div
                                //         className="editable-cell-value-wrap"
                                //         style={{ paddingRight: 24 }}
                                //         onClick={this.toggleEdit}
                                //     >
                                //         {restProps.children}
                                //     </div>
                                // )
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
    {}
)
export default class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            count: 0,
            columnArray:[]
        };
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });

        this.props.handeModifyColumn(dataSource.filter(item => item.key !== key));
    }

    handleAdd = () => {
        let {storageType} = this.props;
        if (!storageType){
            message.error("请先选择存储介质");
            return ;
        }

        const { count, dataSource } = this.state;
        const newData = {
            key: count,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
        this.props.handeModifyColumn([...dataSource, newData]);
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
        this.props.handeModifyColumn(newData);
    }

    render() {

        const { dataSource } = this.state;
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
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    required:col.required,
                    columnType:col.columnType,
                    handleSave: this.handleSave,
                    ...col,
                }),
            };
        }).concat({
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                        <a href="javascript:;">Delete</a>
                    </Popconfirm>
                );
            },
        });
        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    添加字段
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

