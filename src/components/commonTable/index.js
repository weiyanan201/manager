/*
通用带分页的表格
 */

import React from 'react';
import {  Table } from 'antd';
import util from "../../util/util";

const CommonTable = (props)=>{

    const pagination = {
        "showSizeChanger":true,
        "size":"middle",
        "showQuickJumper":true,
        "defaultPageSize":20
    };
    const {onChange} = props;
    if (!util.isEmpty(onChange)){
        pagination.onChange = onChange;
    }
    return (
        <div>
            <Table columns={props.columns}
                   dataSource={props.dataSource}
                   size="small"
                   pagination = {pagination}
            />
        </div>
    );
};

export default CommonTable;