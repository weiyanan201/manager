import React from 'react';
import {Button , Card,Spin,Table,Cascader,Form,InputNumber,Input,Popconfirm,Select,Row,message,Modal } from 'antd';

import axios from '../../util/axios';
import util from '../../util/util';

import style from './table.less';

const { TextArea } = Input;
export default class CommandCreate extends React.Component{

    state={
        loading:false,
        sql:'',
        log:''
    }

    handleReset=()=>{
        this.setState({
            sql:''
        })
    }

    handleSubmit=()=>{
        console.log("submit");
        console.log(this.state.sql);
        if (util.isEmpty(this.state.sql)){
            message.error("请输入建表语句");
            return ;
        }
        let result = axios.post("/table/commandCreate",{sql:this.state.sql});
        result.then(()=>{
            console.log("then");
        }).catch(()=>{
            console.log("catch");
        })
    }

    handleChangeText(value) {
        this.setState({
            sql:value
        });
    }

    render(){
        return (
            <div>
                <Button type={"primary"} onClick={this.handleReset}>清空</Button>
                <Button type={"primary"} onClick={this.handleSubmit}>运行</Button>
                <div >
                        <TextArea placeholder="请输入建表语句" autosize={false} style={{height: 'calc(40vh)'}} value={this.state.sql} onChange={(e)=>{this.handleChangeText(e.target.value)}}/>
                        {/*<TextArea placeholder="日志信息" autosize={false} style={{height: 'calc(40vh)'}} />*/}
                        <Card title={"日志"} style={{height: 'calc(35vh)'}}>
                            {this.state.log}
                        </Card>
                </div>
            </div>
        );
    }
}