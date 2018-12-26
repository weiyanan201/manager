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


//{key:{uuid:this}}
const globalTypeCell = {};

class EditableCell extends React.Component {

    //默认是打开的，否则表单无法验证完
    state = {
        editing: false,
    };
    uuid = "";
    //标志那条记录
    key = "";
    componentDidMount() {
        if (this.props.editable) {
            this.key = this.props.record.key;
            this.uuid =  util.uuid();
            if (util.isEmpty(globalTypeCell[this.key])){
                globalTypeCell[this.key] = {};
            }
            globalTypeCell[this.key][this.uuid] = this;
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            delete globalTypeCell[this.key][this.uuid];
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
        const { record, handleSave, dataIndex } = this.props;
        this.form.validateFields({ force: true  },(error, values,) => {
            if (error) {
                return ;
            }
            const editing = this.state.editing;
            this.toggleEdit();
            if (editing){
                handleSave({ ...record, ...values},dataIndex,this.uuid);
            }
        });

    };

    //fieldType from validator
    validateToFieldType = (rule, value, callback)=>{
        if (!util.isEmpty(value)){
            if (!tableUtil.validateFieldType(this.props.fieldTypes,this.props.storageType,value)){
                callback(value+" 与存储介质不匹配");
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
                            message: `${title} 必填项`,
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
                            message: `${title} 必填项`,
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
                            message: `${title} 必填项`,
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
        // this._checkColumn();
    }

    //对外接口，接受字段列表
    modifyTableStateDataSource(dataSource){
        this.setState({
            dataSource
        })
    }
    //对外接口，改变storageType 时检查类型是否符合
    checkRecords=(storageType)=>{
        const dataSource = this.state.dataSource;
        let hasError = false;
        dataSource.forEach(item=>{
            if (!this._checkOneRecord(item.key,storageType)) {
                hasError = true;
            }
        });
        return !hasError;
    };

    _checkRecords=()=>{
        const storageType = this.props.storageType;
        const dataSource = this.state.dataSource;
        let hasError = false;
        dataSource.forEach(item=>{
            if (!this._checkOneRecord(item.key,storageType)) {
                hasError = true;
            }
        });
        return !hasError;
    };


    //检查单独一行
    _checkOneRecord=(key,storageType)=>{
        const columns = this.props.columns;
        if (util.isEmpty(storageType)){
            storageType = this.props.storageType;
        }
        let colObject = {};
        let hasError = false;
        columns.forEach(col=>{
            if (!util.isEmpty(col.dataIndex)){
                colObject[col.dataIndex] = col.required;
            }
        });
        const cellObject = globalTypeCell[key];
        if (!util.isEmpty(cellObject)){
            Object.keys(cellObject).forEach(uuid=>{
                const cell = cellObject[uuid];
                const { type,dataIndex,record } = cell.props;
                if (!this._checkColumn(record[dataIndex],type,cell,colObject[dataIndex],storageType)){
                    hasError = true;
                }
            });
        }
        return !hasError;
    };

    /**
     * 检查每行  必填项、类型是否匹配
     * @return  false 不通过
     */
    _checkColumn = (value,type,cell,required,storageType)  =>{
        if (required){
            //判断是否必填
            if (util.isEmpty(value)){
                cell.save();
                cell.setState({
                    editing: true
                });
                return false;
            }
        }
        if (type==="fieldType") {
            if (!tableUtil.validateFieldType(this.props.fieldTypes,storageType,value)){
                cell.save();
                cell.setState({
                    editing: true
                });
                return false;
            }
        }
        return true;
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
        // if (dataSource.length!==0) {
        //     //判断上一行是否为空，如果只有key则认为是空行
        //     const item = dataSource[dataSource.length-1];
        //     if (Object.keys(item).length===1){
        //         //编辑上一行
        //         return ;
        //     }
        // }
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
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
        this._checkOneRecord(row.key)
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
        if (!this._checkRecords()){
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
            title: '操作',
            dataIndex: 'operation',
            align:'center',
            render: (text, record) => (
                        <Popconfirm title="是否删除该字段?" onConfirm={() => this.handleDelete(record.key)}>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
            ),
        });

        return (
            <div className={style.dragTable}>
                <div>
                    <Button type="danger" onClick={this.handleClear} style={{float:"right","zIndex":9999}}>清空字段</Button>
                    <Button type="primary" onClick={this.handleAdd} style={{float:"right","zIndex":9999,marginRight:10}}>添加字段</Button>
                </div>
                <div style={{marginTop:20}}>
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