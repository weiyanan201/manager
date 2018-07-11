/**
 * header
 */

import React from 'react';
import {Layout, Menu, Icon} from 'antd';

import style from './layout.less';

const {Header} = Layout;
const {SubMenu} = Menu;

class MainHeader extends React.Component {

    render() {
        return (
            //
            // style={{background: '#fff', padding: 0}}
            <Header className={style.mainHeader}>
                    <Menu mode="horizontal" >
                        <SubMenu
                            style={{
                                float: 'right',
                                marginTop:'7px'
                            }}
                            title={
                                <span>
                                    <Icon type="user"/>
                                        魏亚楠.yannis
                                </span>
                            }
                        >
                            <Menu.Item key="logout">
                                Sign out
                            </Menu.Item>
                        </SubMenu>

                        <Menu.Item key="mail" style={{
                            float: 'right',
                            marginTop:'7px'
                        }}>
                            <Icon type="mail" size='larger'/>消息
                        </Menu.Item>
                    </Menu>

            </Header>
        )
    }

}

export default MainHeader;
