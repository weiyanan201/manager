/**
 * 手动建表页面
 */

import React from 'react';
import { getGroupList} from "../../reducers/table.redux";

import {Button , Card,Spin,Table,Cascader,Form,InputNumber,Input,Popconfirm,Select,Row} from 'antd';
import GroupSelect  from '../../components/groupSelect/GroupSelect';
import tableUtil from '../../util/tableUtil';
import {TEMP_GROUP_ID} from '../../util/config';

const Option = Select.Option;
const data = [];
for (let i = 0; i < 0; i++) {
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

function handleChange(value) {
    console.log(`selected ${value}`);
}

class EditableCell extends React.Component {
    getInput = () => {
        console.log(this.props);
        if (this.props.inputType === 'number') {
            return <Select defaultValue="aaa" style={{ width: 120 }} onChange={handleChange}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
            </Select>;
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
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `Please Input ${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = { data, editingKey: '' };
        this.columns = [
            {
                title: 'name',
                dataIndex: 'name',
                width: '25%',
                editable: true,
            },
            {
                title: 'age',
                dataIndex: 'age',
                width: '15%',
                editable: true,
            },
            {
                title: 'address',
                dataIndex: 'address',
                width: '40%',
                editable: true,
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
                                <span>
                                    <a onClick={() => this.edit(record.key)} style={{ marginRight: 8 }}>Edit</a>
                                    <a onClick={() => this.edit(record.key)} style={{ marginRight: 8 }}>Delete</a>
                                </span>
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


    handleAdd = () => {
        const newData = {
            // key: '11111',
            // name: `weiyanan`,
            // age: 32,
            // address: `London Park no. weiyanan`,
        };
        this.setState({
            data: [...this.state.data, newData],
        });

    };

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
                type:this.props.type
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
                    // inputType:'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                    type:this.props.type
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
                    bordered
                    dataSource={this.state.data}
                    columns={columns}
                    rowClassName="editable-row"
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
            db:''
        };
    }
    //联动数据库选择
    handleChangeGroup = (index)=>{
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
            db:''
        })
    };

    handleSelectDb=(item)=>{
        console.log("handleSelectDb",item);
        this.setState({
            db:item
        })
    };

    displayRender=(label)=>{
        if (label && label.length===2){
            return `${label[0]}<${label[1]}>`
        }else if(label){
            return label;
        }
    };

    render(){
        return (
            <div>
                <Card title={"表信息"}>
                    <Form layout="inline">
                        <Row>
                            <FormItem label="表名" >
                                <Input rows={3} placeholder="请输入表名" />
                            </FormItem>
                            <FormItem label="描述" >
                                <Input rows={3} placeholder="请输入注释"/>
                            </FormItem>
                            <FormItem label="组名" >
                                <GroupSelect groupData={tableUtil.filterGroup(this.props.group.allGroup,this.props.auth)} handleChange={this.handleChangeGroup} />
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
                            {/*<Cascader options={tableUtil.getFieldType(this.props.config.fieldTypes,'ES')}  placeholder="Please select" displayRender={this.displayRender}/>*/}
                        </Row>
                    </Form>
                </Card>
                <Card title={"字段详情"}>
                    <EditableTable type="es"/>
                </Card>
                <Button type={"primary"}>创建</Button>
            </div>
        )
    }
}
