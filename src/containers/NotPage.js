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

    constructor(props){
        super(props);
        this.props.getGroupList();
    }

    handleSelect = (e)=>{
        console.log("handleSelect",e);
    }

    handleSearch = (e)=>{
        console.log("handleSearch",e);
    }

    handlePressEnter = (e)=>{
        console.log("handlePressEnter",e.target.value);
    }

    render() {

        // const data = [];
        // this.props.group.allGroup.map(item=>{
        //     data.push(item.name);
        // });

        return (
            <Search
                placeholder="input search text"
                onSearch={value => console.log(value)}
                style={{ width: 200 }}
            />
        )
    }
}
