import React from 'react';
import PropTypes from 'prop-types';
import {Link,withRouter} from 'react-router-dom'
import {
    Layout,
    Menu,
    Icon,
} from 'antd';
import {connect} from "react-redux";

const {
    Sider
} = Layout;
const SubMenu = Menu.SubMenu;

@withRouter
@connect(
    state=>state.auth,
    {}
)
class MainSider extends React.Component{

    constructor(){
        super();
        this.state = {
            collapsed: false,
            openKeys: ['api_menus'],
            lastOpenKeys:[''],
            selectedKey : '/apiList'
        }
    }

    componentDidMount (){
        this.setState({
            selectedKey: this.props.location.pathname
        })
        console.log(this.props);
    }

    rootSubmenuKeys = ['api_menus', 'consumer_menus'];

    onCollapse = () => {
        if(!this.state.collapsed){
            //展开状态
            this.setState({
                collapsed:!this.state.collapsed,
                lastOpenKeys:this.state.openKeys,
                openKeys:['']
            })
        }else{
            this.setState({
                collapsed: !this.state.collapsed,
                openKeys:this.state.lastOpenKeys
            })
        }
    };

    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };

    onClick=(e)=>{
        this.setState({
            lastOpenKeys : e.keyPath.length===2?[e.keyPath[1]]:this.state.lastOpenKeys
        });
    };

    // sider 属性 collapsible 控制下方是否有收缩图表
    render(){
        return(
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
            >
                <Menu
                    mode="inline"
                    theme="dark"
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                    inlineCollapsed={this.state.collapsed}
                    onClick={this.onClick}
                    defaultSelectedKeys = {[this.props.location.pathname]}
                >
                    <Menu.Item key="/">
                        <Icon type="pie-chart"/>
                        <span>Home</span>
                        <Link to="/"/>
                    </Menu.Item>
                    <SubMenu key="api_menus" title={<span><Icon type="appstore"/><span>接口管理</span></span>}>
                        <Menu.Item key="/apiList">
                            <span>浏览接口</span>
                            <Link to="/apiList"/>
                        </Menu.Item>
                        <Menu.Item key="/apiManage">
                            <span>添加接口</span>
                            <Link to="/apiManage"/>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="consumer_menus" title={<span><Icon type="mail"/><span>用户管理</span></span>}>
                        <Menu.Item key="/consumerlist">
                            <span>浏览用户</span>
                            <Link to="/consumerlist"/>
                        </Menu.Item>
                        <Menu.Item key="/consumerManage">
                            <span>添加用户</span>
                            <Link to="/consumerManage"/>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/log">
                        <Icon type="inbox"/>
                        <span>操作日志</span>
                    </Menu.Item>
                    <Menu.Item key="/statistics">
                        <Icon type="pie-chart"/>
                        <span>报表统计</span>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }
}


export default MainSider;

