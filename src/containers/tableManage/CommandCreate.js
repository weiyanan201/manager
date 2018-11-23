import React from 'react';
import {Button , Card,Spin,Input,message, Icon } from 'antd';
import { Link } from "react-router-dom";

import axios from '../../util/axios';
import util from '../../util/util';
import style from './table.less';
import {iconfontUrl} from "../../config";

const { TextArea } = Input;
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconfontUrl,
});
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
                            const stack = res.data.data.stack;
                            if (state==='ERROR') {
                                clearInterval(_this.state.timer);
                                const error = `msg:\n ${msg} \n stacktrace:\n ${stack} `;
                                this.setState({loading:false,log:error})
                            }else if (state==="FINISH"){
                                clearInterval(_this.state.timer);
                                this.setState({loading:false,log:"建表成功!"})
                            }
                        }).catch(res=>{
                            clearInterval(_this.state.timer);
                            console.error(res);
                            this.setState({
                                loading:false,
                                log:"error:"+res
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
                        <a href="http://116.211.22.50:4000/apollo/%E5%B8%B8%E8%A7%84%E7%94%A8%E6%88%B7%E5%BB%BA%E8%A1%A8.html" target="view_window">
                            <IconFont type="icon-tips" style={{ fontSize: '32px',float:"left",paddingLeft:"20px" }} title={"命令行建表文档"} />
                        </a>
                        <Button type={"primary"} onClick={this.handleSubmit} style={{marginRight:10}} >运行</Button>
                        <Button type={"primary"} onClick={this.handleReset}>清空</Button>
                    </div>
                    <div className={style["command-card"]}>
                        <TextArea placeholder="请输入建表语句" autosize={false} style={{height: 'calc(40vh)'}} value={this.state.sql} onChange={(e)=>{this.handleChangeText(e.target.value)}}/>
                        <Card title={"日志"}  />
                        <TextArea  autosize={false} value={this.state.log} style={{height: 'calc(30vh)'}}/>
                    </div>
                </Spin>
            </div>
        );
    }
}
