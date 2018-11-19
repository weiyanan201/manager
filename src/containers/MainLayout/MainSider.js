/**
 * 左侧树形菜单
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Link, withRouter} from 'react-router-dom'
import {
    Layout,
    Menu,
    Icon,
} from 'antd';
import { is } from 'immutable';
import util from "../../util/util";
import { iconfontUrl } from '../../config';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconfontUrl,
});


const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

let menuItem = null;
let routeToId = []

@withRouter
@connect(
    state=>state.auth,
    null
)
class MainSider extends React.Component {

    constructor() {
        super();
        this.state = {
            collapsed: false,
            openKeys: [''],
            lastOpenKeys: [''],
            selectedKeys: [''],
        };
        this.onCollapse = this.onCollapse.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this)
    }

    componentWillUpdate(nextProps) {
        if (!is(this.props.menus, nextProps.menus)){
            menuItem = genMenus(nextProps.menus);
            const url = nextProps.location.pathname;
            const selectItem = routeToId.filter(v=>v.route===url)[0];
            if(selectItem){
                if(selectItem.pid){
                    //有父菜单
                    this.setState({
                        selectedKeys:[selectItem.id],
                        openKeys:[selectItem.pid]
                    });
                }else{
                    //无父菜单
                    this.setState({
                        selectedKeys:[selectItem.id]
                    });
                }

            }
        }
        if(this.props.location.pathname!==nextProps.location.pathname){
            //通过breadcrumb跳转的url
            //类似onClick事件
            const url = nextProps.location.pathname;
            const targetItem = routeToId.find(v=>v.route===url);
            if (targetItem){
                //收缩状态下选择子菜单，应该添加父菜单kek，否则展开时父菜单不展开
                if(this.state.collapsed && targetItem.pid>0){

                    let newLastOpenKeys ;
                    if(this.state.lastOpenKeys.findIndex(v=>v===targetItem.pid)===-1){
                        newLastOpenKeys = this.state.lastOpenKeys.concat(targetItem.pid);
                    }else{
                        newLastOpenKeys = this.state.lastOpenKeys;
                    }
                    this.setState({
                        selectedKeys:[targetItem.id],
                        lastOpenKeys:newLastOpenKeys
                    })

                }else{
                    this.setState({
                        selectedKeys:[targetItem.id]
                    })
                }
            }
        }

    }

    //keyPath[1] 父菜单的key
    onClick(e){
        const keyPath = e.keyPath;
        //收缩状态下选择子菜单，应该添加父菜单kek，否则展开时父菜单不展开
        if(this.state.collapsed && keyPath[1]){

            let newLastOpenKeys ;
            if(this.state.lastOpenKeys.findIndex(v=>v===keyPath[1])===-1){
                newLastOpenKeys = this.state.lastOpenKeys.concat(keyPath[1]);
            }else{
                newLastOpenKeys = this.state.lastOpenKeys;
            }
            this.setState({
                selectedKeys:[keyPath[0]],
                lastOpenKeys:newLastOpenKeys
            })
        }else{
            this.setState({
                selectedKeys:[keyPath[0]]
            })
        }

    }

    onOpenChange(openKeys){
        this.setState({
            openKeys : openKeys
        })
    }

    //解决选中子菜单时，点击收缩按钮出现的bug
    //collapsed==true 转化到收缩状态
    onCollapse(isCollapsed){
        if (isCollapsed){
            //收缩
            this.setState({
                lastOpenKeys : this.state.openKeys,
                openKeys : [],
                collapsed:!this.state.collapsed
            })
        } else{
            //扩张
            this.setState({
                openKeys : this.state.lastOpenKeys,
                collapsed:!this.state.collapsed
            })
        }
    }

    // sider 属性 collapsible 控制下方是否有收缩图表
    render() {
        return (
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
                // trigger={null}
                style={{height: '100vh'}}

            >
                <Menu
                    mode="inline"
                    theme="dark"
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                    inlineCollapsed={this.state.collapsed}
                    onClick={this.onClick}
                    selectedKeys={this.state.selectedKeys}
                >
                    {menuItem}
                </Menu>
            </Sider>
        )
    }
}

//递归生成菜单
function genMenus(menus) {
    return menus.map(item => {
        if (item.children) {
            return (
                <SubMenu
                    key={item.id}
                    title={
                        <span>
                            {!util.isEmpty(item.iconfont)?<IconFont type={item.iconfont}/>:<Icon type={item.icon}/>}
                            <span>{item.name}</span>
                        </span>
                    }
                >
                    { genMenus(item.children) }
                </SubMenu>
            )
        } else {
            routeToId.push({route:item.route,id:item.id,pid:item.pid});
            return (
                <Item key={item.id}>
                    { !util.isEmpty(item.iconfont)?<IconFont type={item.iconfont}/>:<Icon type={item.icon}/> }
                    <span>{item.name}</span>
                    <Link to={item.route}/>
                </Item>
            )
        }
    })
}

MainSider.propTyps = {
    menus:PropTypes.array
}

export default MainSider;

