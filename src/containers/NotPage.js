/**
 * 选取模板表
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Button ,Input,Modal,Tree,Icon,message,Row,Col,AutoComplete} from 'antd';

import axios from '../util/axios'
import util from "../util/util";
import {getDBs, getFieldsType} from "../reducers/config.redux";
import {getGroupList} from "../reducers/table.redux";
import tableUtil from "../util/tableUtil";


const Search = Input.Search;

@connect(
    state => {return {group:state.group,config:state.config,auth:state.auth}},
    {getGroupList,getDBs,getFieldsType}
)
export default class NotPage extends React.Component {



    render() {

        return(
            <div>
                <h3>页面不存在！</h3>
            </div>
        )
    }
}
