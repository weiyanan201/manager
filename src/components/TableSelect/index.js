/**
 * 选取模板表
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Button ,Input,Modal,Tree,Icon,message,Row,Col} from 'antd';

import axios from '../../util/axios'
import util from "../../util/util";

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const DirectoryTree = Tree.DirectoryTree;

@connect(
    state => {return {group:state.group}},
    {}
)
export default class TableSelect extends React.Component{

    state = {
        visible: false,
        expandedKeys:['0'],
        selectedKeys:[],
        selectedId:'',
        selectedName:'',
        tmpName:'',
        tableMap:new Map(),
        searchText:'',
        searchTable:[],
        searchNoResult:false,
        storageType:'',
    };

    //切换storageType充值状态
    componentWillUpdate(nextProps,nextState){
        if (nextProps.storageType !==nextState.storageType){
            this.setState({
                storageType:nextProps.storageType,
                expandedKeys:['0'],
                selectedKeys:[],
                selectedId:'',
                selectedName:'',
                tmpName:'',
                tableMap:new Map(),
                searchText:'',
                searchTable:[],
                searchNoResult:false,
            })
        }
    }

    showModal = () => {
        if (!this.props.storageType){
            message.error("请先选取存储介质!");
            return ;
        }
        this.setState({
            visible: true,
        });
    };

    onSelect=(selectedKeys,e)=>{
        this.setState({
            selectedKeys:selectedKeys,
            selectedId:e.node.props.dataRef.id,
            tmpName:e.node.props.dataRef.name
        })
    };

    onChange = (e) => {
        if (util.isEmpty(e.target.value)){
            this.setState({
                searchTable:[],
                searchText:e.target.value,
                searchNoResult:false
            })
        }else{
            this.setState({
                searchText:e.target.value
            })
        }
    };

    onSearch=(value)=>{
        if (util.isEmpty(value) || value.length<3){
            return ;
        }
        axios.get("/table/getTableByName",{tableName:value})
            .then(res=>{
                if (res.data.data && res.data.data.length>0){
                    let filterData = res.data.data.filter(item=>item.storageType===this.props.storageType);
                    this.setState({
                        searchTable:filterData,
                        searchNoResult:filterData.length <= 0
                    })
                }else{
                    this.setState({
                        searchNoResult:true
                    })
                }
            })
    };

    //只显示一个文件下的内容
    onExpand = (expandedKeys,node) => {
        const key = expandedKeys.length===0?[]:node.node.props.dataRef.id+"";
        this.setState({
            expandedKeys:[key]
        })
    };

    handleOk = () => {
        this.setState({
            visible: false,
        });
        this.props.handleSelect(this.state.selectedId);
        this.setState({
            selectedName:this.state.tmpName
        })
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    onLoadData=(treeNode)=>{
        const groupId = treeNode.props.dataRef.id;
        return axios.get("/table/getTableList",{groupId:groupId}).then(res=>{
            let map = this.state.tableMap;
            if (res.data.data.data && res.data.data.data.length>0){
                let filterData = res.data.data.data.filter(item=>item.storageType===this.props.storageType);
                map.set(groupId,filterData);
                this.setState({
                    tableMap:map,
                })
            }
        });
    };

    renderTreeNodes = (data,isLeaf) => {
        return data.map((item) => {
            if (isLeaf){
                //叶子节点
                return <TreeNode icon={<Icon type="table" />} title={item.name} key={`1-${item.id}`} dataRef={item} isLeaf={true} />;
            }else{
                //目录
                if (this.state.tableMap.has(item.id)){
                    return (
                        <TreeNode title={item.name} key={item.id} dataRef={item} selectable={false}>
                            {this.renderTreeNodes(this.state.tableMap.get(item.id),true)}
                        </TreeNode>
                    );
                }
                return <TreeNode title={item.name} key={item.id} dataRef={item} selectable={false} />;
            }
        });
    };

    render(){
        let result ;
        if (this.state.searchNoResult){
            result = <p>没有查询到结果</p>
        }else{
            result = <DirectoryTree
                showIcon
                loadData={this.onLoadData}
                onExpand={this.onExpand}
                onSelect={this.onSelect}
                draggable={true}
                expandedKeys={this.state.expandedKeys}
            >
                {
                    (util.isEmpty(this.state.searchText)||this.state.searchTable.length===0)?this.renderTreeNodes(this.props.group.allGroup):this.renderTreeNodes(this.state.searchTable,true)
                }
            </DirectoryTree>
        }

        return (
            <div>
                <Row>
                    <Col span={16}>
                        <Input value={this.state.selectedName} disabled={true}/>
                    </Col>
                    <Col span={8}>
                        <Button type="primary" onClick={this.showModal} >模板</Button>
                    </Col>
                </Row>
                <Modal
                    title="请选择模板表"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={"calc(33vw)"}
                    centered
                    maskClosable={false}
                    okText={"选择"}
                    cancelText={"取消"}
                    destroyOnClose={true}
                >
                    <div style={{height:600,width:'100%',overflowY:'auto',marginBottom:'-24px'}}>
                        <Search
                            placeholder="模糊查询表名，请输入至少3个字母点击查询"
                            onSearch={value => this.onSearch(value)}
                            onChange={this.onChange}
                            enterButton
                            value={this.state.searchText}
                        />
                        {result}
                    </div>
                </Modal>
            </div>
        )
    }
}

TableSelect.defaultProps = {
    handleSelect:()=>{}
}

TableSelect.propTypes={
    storageType:PropTypes.string.isRequired,
    handleSelect:PropTypes.func.isRequired,
}