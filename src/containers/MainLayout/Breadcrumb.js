/**
 * 面包屑展示
 */

import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter} from 'react-router-dom';
import {Breadcrumb} from 'antd';
import {is} from 'immutable';

const routeMap = new Map();

@withRouter
@connect(
    state => state.auth,
    {}
)
class MyBreadcrumb extends React.Component {

    componentWillUpdate(nextProps) {
        if (!is(this.props.menus, nextProps.menus)) {
            genRouteMap(nextProps.menus)
        }
    }

    render() {
        const url = this.props.location.pathname;
        let tempUrl = [];
        let tempPrx = '/';
        let breadcrumbItems = [(
            <Breadcrumb.Item key='homeinit'>
                <Link to='/' />
            </Breadcrumb.Item>)
        ];
        url.split('/').filter(v => {
            if (v !== '') {
                tempUrl.push(v);
                let routeUrl = tempPrx + tempUrl.join("/");
                if (routeMap.has(routeUrl)) {
                    let item = routeMap.get(routeUrl);
                    breadcrumbItems = breadcrumbItems.concat(
                        <Breadcrumb.Item key={item.id}>
                            <Link to={item.route}>
                                {item.name}
                            </Link>
                        </Breadcrumb.Item>
                    );
                }
            }

        })
        return (
            <div >
                <Breadcrumb style={{marginTop:'10px',marginBottom:'10px'}}>
                    {breadcrumbItems}
                </Breadcrumb>
            </div>
        )
    }
}

function genRouteMap(menus) {
    menus.map(item => {
        if (item.children) {
            genRouteMap(item.children)
        } else {
            routeMap.set(item.route, item)
        }
    })
}


export default MyBreadcrumb


