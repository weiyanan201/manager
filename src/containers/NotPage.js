import React from 'react';
import {Button , Card,Spin,Table} from 'antd';
import Axios from '../util/axios';


const data = [
    {
        id:'0',
        userName:'Jack',
        sex:'1',
        state:'1',
        interest:'1',
        birthday:'2000-01-01',
        address:'北京市海淀区奥林匹克公园',
        time:'09:00'
    },
    {
        id: '1',
        userName: 'Tom',
        sex: '1',
        state: '1',
        interest: '1',
        birthday: '2000-01-01',
        address: '北京市海淀区奥林匹克公园',
        time: '09:00'
    },
    {
        id: '2',
        userName: 'Lily',
        sex: '1',
        state: '1',
        interest: '1',
        birthday: '2000-01-01',
        address: '北京市海淀区奥林匹克公园',
        time: '09:00'
    },
]

export default class NotPage extends React.Component{


    handleClick1=(type)=>{
        let options = {
            params:{
                userName:`weiyanan${type}`,
                age:30
            }
        };
        Axios.get(`/test/test${type}`,{
            userName:`weiyanan${type}`,
            age:30
        })
            .then((res)=>{
                console.log(res);
            }).catch((error)=>{
                console.log(error);
            })
    }

    handleClick2=(type)=>{
        let options = {
            params:{
                userName:`weiyanan${type}`,
                age:30
            }
        }
        Axios.post(`/test/test${type}`,{
            userName:`weiyanan${type}`,
            age:30
        }).then((res)=>{
                console.log(res);
            }).catch((error)=>{
            console.log(error);
        })
    }



    render(){

        const columns = [
            {
                title:'id',
                key:'id',
                dataIndex:'id'
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

        return (
            <div>
                <h3>NOT PAGE!</h3>

                <Button type="primary" onClick={()=>this.handleClick1(1)}>test1</Button>
                <Button type="primary" onClick={()=>this.handleClick2(22)}>test1</Button>


                        <Table
                            loading={true}
                            bordered
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            style={{marginTop:20}}
                        />


            </div>
        )
    }


}