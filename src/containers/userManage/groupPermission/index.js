import React, {Component} from 'react';
import {Table, Spin} from 'antd';
import {connect} from 'react-redux';

import style from './style.less';
import {updateDataSource} from "../../../reducers/tenant.redux";
import {pushBread} from "../../../reducers/bread.redux";
import {GROUP_PERMISSION} from "../../../util/config";
import PermissionTransfer from "./component/permissonTransfer";
import util from "../../../util/util";

const columns = [
    {
        title: '组名',
        dataIndex: 'name',
        align: 'center',
        width: '300px',
    }, {
        title: '游戏ID',
        dataIndex: "appId",
        align: 'center',
        width: '250px',
    }, {
        title: '权限',
        dataIndex: 'permissions',
        align: 'center',
        render: (permissions) => {
            if (permissions === null || permissions === undefined || permissions.length === 0) {
                return "-";
            } else if (permissions.includes(GROUP_PERMISSION.MODIFY_BUSINESS_SCHEMA) || permissions.includes(GROUP_PERMISSION.WRITE_BUSINESS_SCHEMA)) {
                return "开发者";
            } else {
                return "分析师";
            }
        },
        width: '250px',
    }
];

@connect(
    state => {
        return {tenantPermission: state.tenantPermission, auth: state.auth}
    },
    {updateDataSource, pushBread}
)
class UserGroupPermission extends Component {

    constructor(props) {
        super(props);
        let tenantId = this.props.match.params.tenantId;
        this.props.updateDataSource(tenantId);
    }

    //添加loading
    render() {
        return (
            <div>
                <Spin spinning={util.isEmpty(this.props.tenantPermission.tenantSpinLoading)?false:this.props.tenantPermission.tenantSpinLoading} tip={"加载中..."}>
                    <div className={style.addPermissionButton}>
                        <PermissionTransfer/>
                    </div>
                    <div className={style.tableWrapper}>
                        <Table columns={columns} dataSource={this.props.tenantPermission.data} bordered/>
                    </div>
                </Spin>
            </div>
        )
    }
}


export default UserGroupPermission;