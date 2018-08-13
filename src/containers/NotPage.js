import React from 'react';
import {Button , Card,Spin,Table,Cascader,Form,InputNumber,Input,Popconfirm,Select,Modal,Tree,Icon} from 'antd';
import tableUtil from "../util/tableUtil";
import { connect } from 'react-redux';
import {getFieldsType} from "../reducers/config.redux";


import style from './index.less';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;



const dataSource = [{
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
}, {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
}];

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
}, {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
}];


const DirectoryTree = Tree.DirectoryTree;
export default class NotPage extends React.Component{
    state = { visible: false }


    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    onSelect = () => {
        console.log('Trigger Select');
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };

    render(){


        const loop = data => data.map((item) => {
            if (item.children && item.children.length) {
                return <TreeNode key={item.key} title={item.title}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode key={item.key} title={item.title} />;
        });

        return (
            <div>

                <Button type="primary" onClick={this.showModal}>模板</Button>
                <Modal
                    title="请选择模板表"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={"calc(60vw)"}
                    centered
                >
                    <div style={{height:600,width:'calc(58.5vw)',overflowY:'auto',marginBottom:'-24px'}}>
                        <Search
                            placeholder="input search text"
                            onSearch={value => console.log(value)}
                            enterButton
                        />
                        {/*className={style.tree}*/}
                        <div style={{marginTop:10}} className={style.test}>
                            {/*结果展示区或树形结构*/}

                            <DirectoryTree
                                showIcon
                            >
                                <TreeNode icon={<Icon type="table" />} title="ahrx_wing_glog" key="1" />
                                <TreeNode icon={<Icon type="table" />} title="ahrx2_login_bitmap_mid" key="2"/>
                            </DirectoryTree>

                            <DirectoryTree
                                multiple
                                defaultExpandAll
                            >
                                <TreeNode title="parent 0" key="1-0">
                                    <TreeNode icon={<Icon type="table" />} title="ahrx_wing_glog" key="1" />
                                    <TreeNode icon={<Icon type="table" />} title="ahrx2_login_bitmap_mid" key="2"/>
                                </TreeNode>

                            </DirectoryTree>

                            {/*<Tree*/}
                            {/*showIcon*/}
                            {/*defaultExpandAll*/}
                            {/*expandAction={"doubleClick"}*/}
                            {/*>*/}
                            {/*<TreeNode icon={<Icon type="smile-o" />} title="parent 1" key="0-0" >*/}
                            {/*<TreeNode icon={<Icon type="meh-o" />} title="leaf" key="0-0-0" />*/}
                            {/*<TreeNode*/}
                            {/*icon={({ selected }) => (*/}
                            {/*<Icon type={selected ? 'frown' : 'frown-o'} />*/}
                            {/*)}*/}
                            {/*title="leaf"*/}
                            {/*key="0-0-1"*/}
                            {/*/>*/}
                            {/*</TreeNode>*/}
                            {/*<TreeNode icon={<Icon type="smile-o" />} title="parent 1" key="0-1">*/}
                            {/*<TreeNode icon={<Icon type="meh-o" />} title="leaf" key="0-1-0" />*/}
                            {/*<TreeNode*/}
                            {/*icon={({ selected }) => (*/}
                            {/*<Icon type={selected ? 'frown' : 'frown-o'} />*/}
                            {/*)}*/}
                            {/*title="leaf"*/}
                            {/*key="0-1-1"*/}
                            {/*/>*/}
                            {/*</TreeNode>*/}
                            {/*</Tree>*/}
                        </div>
                        <DirectoryTree
                            multiple
                            defaultExpandAll
                            onSelect={this.onSelect}
                            onExpand={this.onExpand}
                        >
                            <TreeNode title="parent 0" key="0-0">
                                <TreeNode title="leaf 0-0" key="0-0-0" isLeaf />
                                <TreeNode title="leaf 0-1" key="0-0-1" isLeaf />
                            </TreeNode>
                            <TreeNode title="parent 1" key="0-1">
                                <TreeNode title="leaf 1-0" key="0-1-0" isLeaf />
                                <TreeNode title="leaf 1-1" key="0-1-1" isLeaf />
                            </TreeNode>
                        </DirectoryTree>
                    </div>

                </Modal>
            </div>
        )
    }
}