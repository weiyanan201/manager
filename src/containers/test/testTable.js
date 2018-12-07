import React, {Component} from 'react';
import { connect } from 'react-redux'
import {Popconfirm, Table, Input, Button, Form, Select,Cascader ,Checkbox} from 'antd'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { getGroupList} from "../../reducers/table.redux";
import { getDBs,getFieldsType} from "../../reducers/config.redux";

import style from './App.less';
import tableUtil from "../../util/tableUtil";
import util from "../../util/util";

const Option = Select.Option;
const FormItem = Form.Item;

const EditableContext = React.createContext();

//drapIndex：拖拽的组件下标，从0开始
//hoverIndex：比对的组件下标；该页面拿不到坐标，是用data-row-key代替从1开始
function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}


class BodyRow extends React.Component {

    render() {

        if (this.props.isOver===true){
            console.log("BodyRow:",this.props);
        }

        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            dragRow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: 'move' };

        let className = restProps.className;

        if (isOver && initialClientOffset) {
            console.log("ri",restProps.index);
            const direction = dragDirection(
                dragRow.index,
                restProps.index,
                initialClientOffset,
                clientOffset,
                sourceClientOffset
            );
            if (direction === 'downward') {
                className += ' drop-over-downward';
            }
            if (direction === 'upward') {
                className += ' drop-over-upward';
            }
        }

        return connectDragSource(
            connectDropTarget(
                <tr
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    }
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

// const EditableRow = ({ form, index, ...props }) => (
//     <EditableContext.Provider value={form}>
//         <BodyRow {...props} />
//     </EditableContext.Provider>
// );




//////!!!!!!!!  index 要传入
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <BodyRow {...props} index={index} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),

}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(EditableFormRow)
);

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
                this.state.data.length >= 1
                    ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <a href="javascript:;">Delete</a>
                        </Popconfirm>
                    ) : null
            ),
        }];

        this.state = {
            data: [{
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
            },{
                key: '3',
                name: 'Edward King 3',
                fieldType: '',
                sex:'',
                address: 'London, Paadsfrk Lane no. 1',
            }],
            count: 3,
        };

        this.props.getFieldsType();
    }

    handleDelete = (key) => {
        const data = [...this.state.data];
        this.setState({ data: data.filter(item => item.key !== key) });
    }

    handleAdd = () => {
        const { count, data } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            data: [...data, newData],
            count: count + 1,
        });
    }

    handleSave = (row) => {
        const newData = [...this.state.data];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ data: newData });
    }

    moveRow = (dragIndex, hoverIndex) => {
        const { data } = this.state;
        const dragRow = data[dragIndex];

        this.setState(
            update(this.state, {
                data: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
        );
    }

    render() {

        const components = {
            body: {
                row: DragableBodyRow,
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
                    handleSave: this.handleSave,
                    type:col.type,
                }),
            };
        });


        return (
            <div className={style.dragTable}>
                <Button type="primary">添加字段</Button>
                <Button type="danger">清空字段</Button>
                <Table
                    components={components}
                    dataSource={this.state.data}
                    columns={columns}
                    pagination={false}
                    onRow={(record, index) => ({
                        index,
                        moveRow: this.moveRow,
                    })}
                />
                <Button type="primary">创建</Button>
            </div>
        );
    }
}

const Demo = DragDropContext(HTML5Backend)(TestTable);
export default Demo;