import React from 'react';
import {Button , Card,Spin,Input,message } from 'antd';

import axios from '../../util/axios';
import util from '../../util/util';
import style from './table.less';

const { TextArea } = Input;
export default class CommandCreate extends React.Component{

    state={
        loading:false,
        sql:'',
        log:''
    };

    handleReset=()=>{
        this.setState({
            sql:''
        })
    };

    handleSubmit=()=>{
        const _this = this;
        if (util.isEmpty(this.state.sql)){
            message.error("请输入建表语句");
            return ;
        }
        this.setState({
            loading:true
        });
        let result = axios.post("/table/commandCreate",{sql:this.state.sql});
        result.then((res)=>{

            const taskId = res.data.data.taskId;
            if (util.isEmpty(taskId)){
                //同步任务
                this.setState({loading:false,log:'创建成功'})
            } else{
                _this.state.timer = setInterval(()=>{
                    axios.get("/table/queryProgress",{taskId:taskId})
                        .then(res=>{
                            const state = res.data.data.state;
                            const msg = res.data.data.msg;
                            if (state!=='RUNNING') {
                                clearInterval(_this.state.timer);
                                this.setState({loading:false,log:msg})
                            }
                        }).catch(res=>{
                            clearInterval(_this.state.timer);
                            this.setState({
                                loading:false,
                            });
                        })
                },1000);
            }

        }).catch((error)=>{
            console.error(error);
            // console.log(error);
            clearInterval(_this.state.timer);
            let msg = util.getResponseError(error);
            this.setState({
                loading:false,
                log:msg
            })
        })
    };

    handleChangeText(value) {
        this.setState({
            sql:value
        });
    }

    render(){
        return (
            <div >
                <Spin spinning={this.state.loading} tip={'执行中...'}>
                    <div className={style["button-right"]}>
                        <Button type={"primary"} onClick={this.handleSubmit} style={{marginRight:10}} >运行</Button>
                        <Button type={"primary"} onClick={this.handleReset}>清空</Button>
                    </div>
                    <div>
                        <TextArea placeholder="请输入建表语句" autosize={false} style={{height: 'calc(40vh)'}} value={this.state.sql} onChange={(e)=>{this.handleChangeText(e.target.value)}}/>
                        {/*<TextArea placeholder="日志信息" autosize={false} style={{height: 'calc(40vh)'}} />*/}
                        <Card title={"日志"} style={{height: 'calc(30vh)'}}>
                            {this.state.log}
                        </Card>
                    </div>
                </Spin>
            </div>
        );
    }
}
