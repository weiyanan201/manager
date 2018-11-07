/**
 * 建表总页面
 */
import React from 'react';
import { connect } from 'react-redux';
import { getGroupList} from "../../reducers/table.redux";
import { getDBs,getFieldsType} from "../../reducers/config.redux";
import { Tabs} from 'antd';

import CreateTable from './CreateTable';
import CreateView from './CreateView';
import CommandCreate from './CommandCreate';

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

    onChange = (activeKey) => {
        this.setState({ activeKey });
    };
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };
    add = () => {
        const panes = this.state.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        panes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey });
        this.setState({ panes, activeKey });
    };
    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({ panes, activeKey });
    }


    render(){
        return(
            <div>
                <Tabs type="card">
                    <TabPane tab="图形建表" key="1">
                        <CreateTable  {...this.props}/>
                    </TabPane>
                    <TabPane tab="图形建视图" key="2" >
                        <CreateView {...this.props}/>
                    </TabPane>
                    <TabPane tab="命令行建表" key="3">
                        {/*<Card >*/}
                            {/*<Tabs*/}
                                {/*onChange={this.onChange}*/}
                                {/*activeKey={this.state.activeKey}*/}
                                {/*type="editable-card"*/}
                                {/*onEdit={this.onEdit}*/}
                            {/*>*/}
                                {/*{this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>)}*/}
                            {/*</Tabs>*/}
                        {/*</Card>*/}
                            <CommandCreate/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}


