/**
 * 面包屑展示
 */

import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter} from 'react-router-dom';
import {Breadcrumb} from 'antd';
import {is} from 'immutable';

import globalStyle from '../../index.less';
import style from './layout.less';

const routeMap = new Map();

@withRouter
@connect(
    state => {return {auth:state.auth,bread:state.bread}},
    { }
)
class MyBreadcrumb extends React.Component {

    componentWillUpdate(nextProps) {
        if (!is(this.props.auth.menus, nextProps.auth.menus)) {
            genRouteMap(nextProps.auth.menus)
        }
    }

    render() {
        const url = this.props.location.pathname;
        let tempUrl = [];
        let tempPrx = '/';
        let breadcrumbItems = [
        ];
        const countInext = url.split("/").length-1;
        url.split('/').forEach((v,index) => {
            const paths = this.props.bread.path;
            if (v !== '') {
                tempUrl.push(v);
                let routeUrl = tempPrx + tempUrl.join("/");
                if (routeMap.has(routeUrl)) {
                    let item = routeMap.get(routeUrl);
                    breadcrumbItems = breadcrumbItems.concat(
                        <Breadcrumb.Item key={item.id} >
                            <Link to={item.route} style={index===countInext?{color:"rgba(0, 0, 0, 0.45)",textDecoration:"none",cursor:"default"}:null}>
                                {item.bread}
                            </Link>
                        </Breadcrumb.Item>
                    );
                }else {
                    if(routeUrl in paths){
                        if(paths[routeUrl]!==undefined && paths[routeUrl]!==''){
                            const name = paths[routeUrl];
                            breadcrumbItems = breadcrumbItems.concat(
                                <Breadcrumb.Item key={routeUrl}>
                                    <Link to={routeUrl} style={index===countInext?{color:"rgba(0, 0, 0, 0.45)",textDecoration:"none",cursor:"default"}:null} >
                                        {name}
                                    </Link>
                                </Breadcrumb.Item>
                            );
                        }
                    }
                }
            }

        })
        return (
            <div className={style.breadCrumb}>
                <Breadcrumb >
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


