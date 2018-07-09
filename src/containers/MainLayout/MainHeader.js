/**
 * header
 */

import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import style from './header.css';

const {Header} = Layout;
const {SubMenu} = Menu;

class MainHeader extends React.Component {

    render() {
        return (
            <Header style={{ background: '#38ff32', padding: 0 }}>
                    <Menu mode="horizontal" style={{height:'100%'}}>
                        <div id='test' className={style.test}>
                            hello world
                        </div>
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