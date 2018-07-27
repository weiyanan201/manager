import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Table, Pagination,Form,Button,Input,Icon } from 'antd';
import { Route } from 'react-router-dom';
import {getTableInfo} from "../../reducers/table.redux";

import BaseForm from '../../components/BaseForm';
import BaseTable from '../../components/BaseTable';
import axios from '../../util/axios';
import stateUtil from '../../util/stateUtil';


const FormItem = Form.Item;


const columns = [
    {
        title:'tabelId',
        key:'tabelId',
        dataIndex:'tabelId'
    },
    {
        title: '用户名',
        key: 'userName',
        dataIndex: 'userName'
    },
    {
        title: '性别',
        key: 'sex',
        dataIndex: 'sex',
        render(sex){
            return sex ==1 ?'男':'女'
        }
    },
    {
        title: '状态',
        key: 'state',
        dataIndex: 'state',
        render(state){
            let config  = {
                '1':'咸鱼一条',
                '2':'风华浪子',
                '3':'北大才子',
                '4':'百度FE',
                '5':'创业者'
            }
            return config[state];
        }
    },
    {
        title: '爱好',
        key: 'interest',
        dataIndex: 'interest',
        render(abc) {
            let config = {
                '1': '游泳',
                '2': '打篮球',
                '3': '踢足球',
                '4': '跑步',
                '5': '爬山',
                '6': '骑行',
                '7': '桌球',
                '8': '麦霸'
            }
            return config[abc];
        }
    },
    {
        title: '生日',
        key: 'birthday',
        dataIndex: 'birthday'
    },
    {
        title: '地址',
        key: 'address',
        dataIndex: 'address'
    },
    {
        title: '早起时间',
        key: 'time',
        dataIndex: 'time'
    }
];

const data = [
    {
        tabelId:'10',
        userName:'Jack',
        sex:'1',
        state:'1',
        interest:'1',
        birthday:'2000-01-01',
        address:'北京市海淀区奥林匹克公园',
        time:'09:00'
    },
    {
        tabelId: '31',
        userName: 'Tom',
        sex: '1',
        state: '1',
        interest: '1',
        birthday: '2000-01-01',
        address: '北京市海淀区奥林匹克公园',
        time: '09:00'
    },
    {
        tabelId: '48',
        userName: 'Lily',
        sex: '1',
        state: '1',
        interest: '1',
        birthday: '2000-01-01',
        address: '北京市海淀区奥林匹克公园',
        time: '09:00'
    },
];
data.map((item,index)=>{
    item.key = index;
});

@connect(
    state => state.tableInfo,
    {getTableInfo}
)
export default class TableInfo extends Component {

    constructor(props){
        super(props);
        let tableId = this.props.match.params.tableId;
        this.state={

        };
        console.log(tableId);
        this.props.getTableInfo(tableId)
    }

    formList = [
        {
            type:'SELECT',
            label:'城市',
            field:'city',
            placeholder:'全部',
            initialValue:'1',
            width:80,
            list: [{ id: '0', name: '全部' }, { id: '1', name: '北京' }, { id: '2', name: '天津' }, { id: '3', name: '上海' }]
        },
        {
            type: '时间查询'
        },
        {
            type: 'SELECT',
            label: '订单状态',
            field:'order_status',
            placeholder: '全部',
            initialValue: '1',
            width: 80,
            list: [{ id: '0', name: '全部' }, { id: '1', name: '进行中' }, { id: '2', name: '结束行程' }]
        }
    ];

    detailFormList = {
        type:'INPUT',
        label:'ID',
        field:'tableId',
        initialValue:'653',
        width:80
    };

    handleSubmit=(params)=>{
        console.log(params);
        axios.post("/test/test",params);
    };

    render(){

        console.log("table info render");

        const selections = {
            type:'radio',
            rowKeys:'rowKeys',
            rows:'rows',
            _self:this
        };

        const selection2 = {
            type:'checkbox',
            rowKeys:'rowKeys2',
            rows:'rows2',
            _self:this
        };



        return(
            <div >

                <Card title={"表属性"}>
                    <div style={{textAlign: 'right'}}>
                        <Button type="primary">编辑</Button>
                        <Button type="danger">删除</Button>
                    </div>
                    <Form layout="inline">
                        <FormItem label="ID">
                            <Input disabled={true} value={this.props.id} />
                        </FormItem>
                        <FormItem label="表名">
                            <Input disabled={true} value={this.props.tableName}/>
                        </FormItem>
                        <FormItem label="dbName">
                            <Input disabled={true} value={this.props.db}/>
                        </FormItem>
                        <FormItem label="存储介质">
                            <Input  disabled={true} value={this.props.storageType}/>
                        </FormItem>
                        <FormItem label="描述">
                            <Input  disabled={true} value={this.props.comment}/>
                        </FormItem>
                    </Form>
                </Card>

                <Card title="表字段" style={{marginTop:10}}>
                    <BaseTable
                        columns={columns}
                        dataSource={data}
                        selection={selections}
                    />
                </Card>

                <BaseForm formList={this.formList} handleSubmit={this.handleSubmit} submitText={"确定222"}/>


            </div>
        );
    }

}


