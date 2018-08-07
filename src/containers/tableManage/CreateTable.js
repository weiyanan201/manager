/**
 * 手动建表页面
 */

import React from 'react';
import { connect } from 'react-redux';
import { getGroupList} from "../../reducers/table.redux";

import {Button , Card,Spin,Table,Cascader,Form,InputNumber,Input,Popconfirm,Select,Row,message,Modal } from 'antd';
import GroupSelect  from '../../components/groupSelect/GroupSelect';
import tableUtil from '../../util/tableUtil';
import {TEMP_GROUP_ID} from '../../util/config';

import axios from '../../util/axios';
import util from '../../util/util';

const Option = Select.Option;
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
            this.save();
        }
    }

    save = () => {
        const { record, handleSave ,columnType,dataIndex} = this.props;
        this.form.validateFields((error, values) => {
            //TODO 下拉框没有
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

    getInput= ()=>{
        if (this.props.columnType === 'fieldType') {
            return <Cascader
                options={tableUtil.getFieldType(this.props.fieldTypes,this.props.storageType)}
                placeholder="请选择类型" ref={node => (this.input = node)}
                onPressEnter={this.save}
                onChange={this.onChange}
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
            <td ref={node => (this.cell = node)} {...restProps} onClick={this.handleTdClick}>
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
                                            initialValue: columnType==='input'?record[dataIndex]:[],
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
    {}
)
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        // this.props.getFieldsType();

        this.state = {
            dataSource: [],
            count: 0,
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
            name: '',
            type: '',
            comment: '',
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
        let {storageType} = this.props;
        const tableColumns = [{
            title: 'name',
            dataIndex: 'name',
            width: '30%',
            editable: true,
            columnType:'input'
        }, {
            title: '类型',
            dataIndex: 'type',
            editable: true,
            columnType:'fieldType',
            storageType:storageType
        }, {
            title: '注释',
            dataIndex: 'comment',
            editable: true,
            columnType:'input',
        }, {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                        <a href="javascript:;">Delete</a>
                    </Popconfirm>
                );
            },
        }];

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
                    columnType:col.columnType,
                    handleSave: this.handleSave,
                    ...col,
                }),

            };
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

export default class CreateTable extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tableName:'',
            comment:'',
            groupId:'',
            storageType:'',
            db:'',
            dbName:'',
            columns:[],
            loading : false
        };
    }

    handleChangeText(key,value) {
        this.setState({
            ...this.state,
            [key]:value
        });
        console.log(this.state.tableName);
    }

    handleChangeGroup = (index)=>{
        console.log("handleChangeGroup");
        let oldIsTmp = this.state.groupId===TEMP_GROUP_ID.toString();
        let newIsTmp = index === TEMP_GROUP_ID.toString();
        let change = (oldIsTmp&&!newIsTmp) || (!oldIsTmp&&newIsTmp);
        console.log("change,",change);
        this.setState({
            groupId:index,
            db:change?'':this.state.db
        })
    };
    //联动数据库选择
    handleSelectStorageType=(item)=>{
        this.setState({
            storageType:item,
            db:'',
            dbName:''
        })
    };

    handleSelectDb=(item,object)=>{
        console.log(item,object.props.children);
        this.setState({
            db:item,
            dbName:object.props.children
        })
    };

    displayRender=(label)=>{
        if (label && label.length===2){
            return `${label[0]}<${label[1]}>`
        }else if(label){
            return label;
        }
    };

    handleSubmit=()=>{
        console.log(this.state);
        let errorMessage = [];
        const {groupId,storageType,comment,tableName,db,columns} = this.state;

        if (util.isEmpty(tableName)) {
            errorMessage.push("请填写表名称");
        }
        if (util.isEmpty(comment)) {
            errorMessage.push("请填写表注释");
        }
        if (util.isEmpty(groupId)){
            errorMessage.push("请选择分组");
        }
        if (util.isEmpty(storageType)) {
            errorMessage.push("请选择存储介质");
        }
        if (util.isEmpty(db)) {
            errorMessage.push("请选择存数据库");
        }
        if(columns===null || columns.length===0){
            errorMessage.push("字段列表不能为空");
        }
        let filterColumns ;
        //检查字段 过滤空行
        if (columns!==null && columns.length>0){
            filterColumns = columns.filter(item=>{
                return !util.isEmpty(item.name) || !util.isEmpty(item.type) || !util.isEmpty(item.comment)
            })
            filterColumns.map(item=>{
                const en = util.isEmpty(item.name);
                const et = util.isEmpty(item.type);
                if (!en && et){
                    errorMessage.push("字段:"+item.name+"未指定字段类型");
                }else if(en && !et){
                    errorMessage.push("有表字段未指定名称")
                }
            })
        }

        if(!util.isEmpty(errorMessage)){
            Modal.error({
                title: "错误提示",
                content: util.getWordwrapContent(errorMessage)
            })
            return ;
        }
        this.setState({
            loading:true
        })
        const result = axios.postByJson("/table/createTable",{...this.state,columns:filterColumns});
        result.then(()=>{
            this.setState({
                loading:false
            })
            message.success("创建成功!")
        }).catch(()=>{
            this.setState({
                loading:false
            })
            console.log("error");
        })

    }

    handeModifyColumn=(dataSource)=>{
        this.setState({
            columns:dataSource
        })
    }

    render(){
        return (
            <div>
                <Spin spinning={this.state.loading} >
                <Card title={"表信息"}>
                    <Form layout="inline">
                        <Row>
                            <FormItem label="表名" >
                                <Input rows={3} placeholder="请输入表名" value={this.state.tableName} onChange={(e)=>{this.handleChangeText("tableName",e.target.value)}} />
                            </FormItem>
                            <FormItem label="描述" >
                                <Input rows={3} placeholder="请输入注释" onChange={(e)=>{this.handleChangeText("comment",e.target.value)}}/>
                            </FormItem>
                            <FormItem label="组名" >
                                <GroupSelect groupData={tableUtil.filterGroup(this.props.group.allGroup,this.props.auth)} handleChange={this.handleChangeGroup} handleSearch={this.handleChangeGroup} />
                            </FormItem>
                            <FormItem label="存储介质" >
                                <Select style={{ width: 150 }} onChange={this.handleSelectStorageType}>
                                    {tableUtil.getStorageType().map((item)=><Option value={item} key={item}>{item}</Option>)}
                                </Select>
                            </FormItem>
                            <FormItem label="数据库" >
                                <Select style={{ width: 180 }}  onSelect={this.handleSelectDb} value={this.state.db}>
                                    {tableUtil.fiterDbs(this.props.config.dbs,this.state.groupId,this.state.storageType,this.props.auth.role).map((item)=><Option value={item.id} key={item.id}>{item.name}</Option>)}
                                </Select>
                            </FormItem>
                        </Row>
                    </Form>
                </Card>
                <Card title={"字段详情"}>
                    <EditableTable storageType={this.state.storageType} handeModifyColumn={this.handeModifyColumn}/>
                </Card>
                <Button type={"primary"} onClick={this.handleSubmit} >创建</Button>
                </Spin>
            </div>

        )
    }
}
