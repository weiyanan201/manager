import config from '../util/config'
const roles = config.TenantType;

const menus=[
    {
        "id": 5,
        "pid": -1,
        "icon": "table",
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
    },{
        "id": 8,
        "pid": -1,
        "icon": "user",
        "name": "用户管理",
        "route": "",
        "bread": "",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    },{
        "id": 9,
        "pid": 8,
        "icon": "user",
        "name": "用户信息",
        "route": "/user/list",
        "bread": "用户信息",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    },{
        "id": 10,
        "pid": 8,
        "icon": "user",
        "name": "outService",
        "route": "/user/outService",
        "bread": "outService",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    },{
        "id": 11,
        "pid": -1,
        "icon": "user",
        "name": "组管理",
        "route": "",
        "bread": "",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    },{
        "id": 12,
        "pid": 11,
        "icon": "user",
        "name": "组信息",
        "route": "/group/list",
        "bread": "组信息",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    },{
        "id": 13,
        "pid": -1,
        "icon": "user",
        "name": "App管理",
        "route": "",
        "bread": "",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    },{
        "id": 14,
        "pid": 13,
        "icon": "user",
        "name": "App信息",
        "route": "/app/list",
        "bread": "App信息",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    }

];
export default menus;
