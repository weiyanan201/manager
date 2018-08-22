import config from '../util/config'
const roles = config.TenantType;

const menus=[
    {
        "id": 5,
        "pid": -1,
        "icon": "user",
        "name": "表管理",
        "route": "",
        "bread": "",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    }, {
        "id": 6,
        "pid": 5,
        "icon": "idcard",
        "name": "表信息",
        "route": "/table/groups",
        "bread": "group列表",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    }, {
        "id": 7,
        "pid": 5,
        "icon": "user-add",
        "name": "新建表",
        "route": "/table/addTable",
        "bread": "新建表",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    }
];
export default menus;
