import React from 'react';
import {connect} from 'react-redux';
import {Select, Radio, Input, Row, Col, Button,Table,Pagination} from 'antd';

import { getApiList } from "../../reducers/api.redux";

import style from './test.less';

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;



const columns = [
    {
        title: 'apiId',
        dataIndex: 'id',
    }, {
        title: '方法名',
        dataIndex: 'apiName',
    }, {
        title: '描述',
        dataIndex: 'apiDesc',
    },{
        title: 'SQL语句',
        dataIndex: 'apiSql',
        width:'20%'
    },{
        title: '接口类型',
        dataIndex: 'apiType',
    },{
        title: '接口状态',
        dataIndex: 'apiStatus',
    },{
        title: '失效日期',
        dataIndex: 'expiryDate',
    },{
        title: '修改时间',
        dataIndex: 'updateTime',
    },{
        title: '创建者',
        dataIndex: 'createUser',
    },{
        title: '更新者',
        dataIndex: 'updateUser',
    }
];

@connect(
    state=>state.api,
    { getApiList }
)
class ApiList extends React.Component {

    constructor(props){
        super(props);
        this.state={
            apiType : '-1',
            apiStatus : '-1',
            searchCondition:'',
        };
        this.props.getApiList(this.state);
        this.handleChange = this.handleChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleChange(key,value) {
        this.setState({
            ...this.state,
            [key]:value
        });
    }

    handleReset(){
        this.setState({
            apiType : '-1',
            apiStatus : '-1',
            searchCondition:'',
        })
    }
    render() {
        return (
            <div className={style.test}>
                <Row gutter={24} >
                    <Col xxl={3} xl={3} lg={4} md={5} sm={6}>
                        <Select defaultValue={this.state.apiType} value={this.state.apiType} style={{width: 120}} onChange={(v)=>{this.handleChange("apiType",v)}}>
                            <Option value="-1">全部</Option>
                            <Option value="1">db</Option>
                            <Option value="2">hbase</Option>
                            <Option value="3">es</Option>
                        </Select>
                    </Col>
                    <Col xxl={4} xl={5} lg={8} md={9} sm={18}>
                        <RadioGroup defaultValue="-1" value={this.state.apiStatus} onChange={(e)=>{this.handleChange("apiStatus",e.target.value)}} >
                            <RadioButton value="-1">全部</RadioButton>
                            <RadioButton value="0">测试</RadioButton>
                            <RadioButton value="1">上线</RadioButton>
                        </RadioGroup>
                    </Col>
                    <Col xxl={10} xl={8} lg={8} md={10} sm={24}>
                        <Search placeholder="input search text" value={this.state.searchCondition} enterButton="Search" onChange={(e)=>{this.handleChange("searchCondition",e.target.value)}} />
                    </Col>
                    <Col xxl={4}  xl={6} lg={3} md={3} sm={12}>
                        <Button onClick={this.handleReset}>重置</Button>
                    </Col>
                    <Col  xl={2} lg={1} md={1} sm={12}>
                        <Button type='primary'>create</Button>
                    </Col>
                </Row>
                <Table
                    bordered
                    columns={columns}
                    expandedRowRender={record => <p style={{ margin: 0 }}>{record.apiSql}</p>}
                    dataSource={this.props.dataList}
                    rowKey="id"
                    pagination={{total:100}}
                    className={style["ant-table-thead"]}
                />
            </div>
        )
    }
}


export default ApiList;

