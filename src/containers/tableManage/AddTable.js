
import React from 'react';
import { connect } from 'react-redux';
import { getGroupList} from "../../reducers/table.redux";
import { getDBs,getFieldsType} from "../../reducers/config.redux";

import { Tabs,Button,Card , Table, Input, Popconfirm, Form,InputNumber,Cascader,Row,Select} from 'antd';
import GroupSelect from "../../components/groupSelect/GroupSelect";

import CreateTable from './CreateTable';


const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;



@connect(
    state => {return {group:state.group,config:state.config,auth:state.auth}},
    {getGroupList,getDBs,getFieldsType}
)
export default class AddTable extends React.Component{

    constructor(props){
        super(props);
        this.newTabIndex = 0;
        const panes = [
            { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
            { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
            { title: 'Tab 3', content: 'Content of Tab 3', key: '3' },
        ];
        this.state = {
            activeKey: panes[0].key,
            panes,
        };
        this.props.getGroupList();
        this.props.getDBs();
        this.props.getFieldsType();
    }

    render(){
        return(
            <div>
                <Tabs type="card">
                    <TabPane tab="图形建表" key="1">
                        <CreateTable  {...this.props}/>
                    </TabPane>
                    <TabPane tab="图形建视图" key="2" >

                    </TabPane>
                    <TabPane tab="命令行建表" key="3">
                        <Card >
                            {/*<Tabs*/}
                                {/*onChange={this.onChange}*/}
                                {/*activeKey={this.state.activeKey}*/}
                                {/*type="editable-card"*/}
                                {/*onEdit={this.onEdit}*/}
                            {/*>*/}
                                {/*{this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>)}*/}
                            {/*</Tabs>*/}

                        </Card>

                    </TabPane>
                </Tabs>
            </div>
        );
    }
}


