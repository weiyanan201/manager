/**
 * app 管理页面
 */

import React,{ Component } from 'react';
import { Input, Button, Table, Modal, message, Spin, Divider} from 'antd';
import util from "../../../util/util";
import axios from "../../../util/axios";

const Search = Input.Search;
const confirm = Modal.confirm;

class AppList extends Component {

    constructor(props){
        super(props);
    }

    render(){

        return(
            <div>AppList</div>
        );
    }
};

export default AppList;