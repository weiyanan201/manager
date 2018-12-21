import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Popconfirm, Table, Input, Button, Form,Cascader ,Checkbox,Modal} from 'antd'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import {FIELD_TYPE_NOT_MATCh_ERROR } from '../../../../config'
import style from '../../table.less';
import tableUtil from "../../../../util/tableUtil";
import util from "../../../../util/util";

const confirm = Modal.confirm;
const FormItem = Form.Item;
const EditableContext = React.createContext();

/**
 * 判断拖拽方向
 */
function dragDirection(dragIndex, hoverIndex, initialClientOffset, clientOffset, sourceClientOffset,) {
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
        if (dragIndex === hoverIndex) {
            return;
        }
        props.moveRow(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    },
};

const EditableRow = ({ form, index, ...props }) => {
    return <EditableContext.Provider value={form}>
        <BodyRow {...props} index={index}  form/>
    </EditableContext.Provider>
};


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
    }))(EditableRow)
);

const EditableFormRow = Form.create()(DragableBodyRow);

const globalTypeCell = {};

class EditableCell extends React.Component {

    //默认是打开的，否则表单无法验证完
    state = {
        editing: true,
    };
    uuid = "";
    componentDidMount() {
        if (this.props.editable) {
            this.uuid =  util.uuid();
            globalTypeCell[this.uuid] = this;
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            delete globalTypeCell[this.uuid];
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
    };

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
    };

    save = () => {
        console.log(this);
        const { record, handleSave, dataIndex } = this.props;
        this.form.validateFields({ force: true  },(error, values,) => {
            if (error) {
                return ;
            }
            this.toggleEdit();
            //fieldType CELL 与 record相关联
            handleSave({ ...record, ...values},dataIndex,this.uuid);
        });

    };

    //fieldType from validator
    validateToFieldType = (rule, value, callback)=>{
        if (!util.isEmpty(value)){
            if (!tableUtil.validateFieldType(this.props.fieldTypes,this.props.storageType,value)){
                callback(FIELD_TYPE_NOT_MATCh_ERROR);
            }
        }
        callback();
    };

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            type,
            required,
            ...restProps
        } = this.props;

        const getItem = (form,dataIndex,type)=>{
            if (type==="input"){
                return <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                        rules: [{
                            required: required,
                            message: `${title} is required.`,
                        }],
                        initialValue: record[dataIndex],
                        validateTrigger:'onForce'
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
                            required: required,
                            message: `${title} is required.`,
                        },{
                            validator: this.validateToFieldType
                        }],
                        initialValue: record[dataIndex],
                    })(
                        <Cascader
                            ref={node => (this.input = node)}
                            options={tableUtil.getFieldType(this.props.fieldTypes,this.props.storageType)}
                            placeholder="请选择类型"
                            expandTrigger={"hover"}
                        />
                    )}
                </FormItem>
            }else if(type==="checkbox"){
                return <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                        rules: [{
                            required: required,
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
        };

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
                                        //指定高度，否则无值状态无法切换状态
                                        style={{ height:21,overflow: "hidden"}}
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

class DragAndEditTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
            dataSource: [],
            count: 0,
        };
    }

    //将组件本身的方法共享到父组件
    componentDidMount(){
        this.props.onRef(this)
    }

    //渲染之前检查字段是否符合
    componentDidUpdate(){
        this._checkColumn();
    }

    modifyTableStateDataSource(dataSource){
        this.setState({
            dataSource
        })
    }

    _checkColumn=()=>{
        const columns = this.props.columns;
        const storageType = this.props.storageType;
        let colObject = {};
        let isError = false;
        columns.forEach(col=>{
            if (!util.isEmpty(col.dataIndex)){
                colObject[col.dataIndex] = col.required;
            }
        });
        Object.keys(globalTypeCell).forEach(key=>{
            const cell = globalTypeCell[key];
            const { type,dataIndex,record } = cell.props;
            if (colObject[dataIndex]){
                //判断是否必填
                if (util.isEmpty(record[dataIndex])){
                    cell.save();
                    cell.setState({
                        editing: true
                    });
                    isError = true;
                }
            }
            if (type==="fieldType") {
                if (!tableUtil.validateFieldType(this.props.fieldTypes,storageType,record[dataIndex])){
                    cell.save();
                    cell.setState({
                        editing: true
                    });
                    isError = true;
                }
            }
        });
        return isError;
    };

    handleDelete  (key)  {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    }

    handleClear = () => {
        const _this = this;
        confirm({
            title: '确认',
            autoFocusButton:"cancel",
            content: `是否清空表字段`,
            okText: '清空',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.setState({
                    dataSource:[]
                })
            }
        });
    };

    handleAdd = () => {
        const { count, dataSource } = this.state;
        if (dataSource.length!==0) {
            //判断上一行是否为空，如果只有key则认为是空行
            const item = dataSource[dataSource.length-1];
            if (Object.keys(item).length===1){
                //编辑上一行
                return ;
            }
        }
        const newData = {
            key: count,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    handleSave = (row,dataIndex,uuid) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        if (!util.isEmpty(uuid) && !util.isEmpty(dataIndex)){
            if (item.duMap===undefined){
                item.duMap = {};
            }
            item.duMap.dataIndex = uuid;
        }
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
    };

    moveRow = (dragIndex, hoverIndex) => {
        const { dataSource } = this.state;
        const dragRow = dataSource[dragIndex];

        this.setState(
            update(this.state, {
                dataSource: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
        );
    };

    /**
     * 提交,再次验证fieldType是否匹配
     * 外部组件调用该方法！
     */
    handleSubmit  ()  {
        const dataSource = this.state.dataSource;
        const isError = this._checkColumn();
        if (isError){
            return null;
        }
        return dataSource;
    };

    components = {
        body: {
            row: EditableFormRow,
            cell:  EditableCell,
        },
    };

    render() {
        const columns = this.props.columns.map((col) => {
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
                    ...col
                }),
            };
        });
        //添加删除操作按钮
        columns.push({
            title: 'operation',
            dataIndex: 'operation',
            align:'center',
            render: (text, record) => (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <a href="javascript:;">Delete</a>
                        </Popconfirm>
            ),
        });
        
        console.log(this);

        return (
            <div className={style.dragTable}>
                <Button type="primary" onClick={this.handleAdd}>添加字段</Button>
                <Button type="danger" onClick={this.handleClear}>清空字段</Button>
                <Table
                    components={this.components}
                    dataSource={this.state.dataSource}
                    columns={columns}
                    pagination={false}
                    onRow={(record, index) => ({
                        index,
                        moveRow: this.moveRow,
                    })}
                    bordered
                    wrappedComponentRef={(form) => this.rows.push(form) }
                />
            </div>
        );
    }
}

DragAndEditTable.defaultProps = {

};

DragAndEditTable.propTypes = {
    columns: PropTypes.array.isRequired,
    storageType:PropTypes.string.isRequired,
    fieldTypes:PropTypes.array.isRequired,
};

const table = DragDropContext(HTML5Backend)(DragAndEditTable);
export default table;