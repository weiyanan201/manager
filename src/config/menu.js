import config from '../util/config'
const roles = config.TenantType;

const menus=[
    {
        "id": 1,
        "pid": -1,
        "icon": "table",
        "name": "表管理",
        "route": "",
        "bread": "",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    }, {
        "id": 11,
        "pid": 1,
        "icon": "idcard",
        "name": "游戏列表",
        "route": "/table/groups",
        "bread": "游戏列表",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    },{
        "id": 17,
        "pid": 1,
        "iconfont": "icon-tableedit",
        "name": "新建表",
        "route": "/table/addTable",
        "bread": "新建表",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    },{
        "id": 2,
        "pid": -1,
        "icon": "user",
        "name": "用户管理",
        "route": "",
        "bread": "",
        "roles":[roles.PLATFORM]
    },{
        "id": 21,
        "pid": 2,
        "icon": "user",
        "name": "用户信息",
        "route": "/user/list",
        "bread": "用户信息",
        "roles":[roles.PLATFORM]
    },{
        "id": 22,
        "pid": 2,
        "iconfont": "icon-user4",
        "name": "系统用户",
        "route": "/user/outService",
        "bread": "系统用户",
        "roles":[roles.PLATFORM]
    },{
        "id": 3,
        "pid": -1,
        "iconfont": "icon-dashboardbuttongroup",
        "name": "组管理",
        "route": "",
        "bread": "",
        "roles":[roles.PLATFORM]
    },{
        "id": 31,
        "pid": 3,
        "iconfont": "icon-dashboardbuttongroup",
        "name": "组信息",
        "route": "/group/list",
        "bread": "组信息",
        "roles":[roles.PLATFORM]
    },{
        "id": 4,
        "pid": -1,
        "iconfont": "icon-game",
        "name": "App管理",
        "route": "",
        "bread": "",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    },{
        "id": 41,
        "pid": 4,
        "iconfont": "icon-game",
        "name": "App信息",
        "route": "/app/list",
        "bread": "App信息",
        "roles":[roles.PLATFORM,roles.GLOBAL_ANALYST,roles.GLOBAL_DEVELOPER,roles.GROUP_USER]
    },{
        "id": 42,
        "pid": 4,
        "iconfont": "icon-mobile",
        "name": "手游类型管理",
        "route": "/mobileGame/list",
        "bread": "手游类型管理",
        "roles":[roles.PLATFORM]
    },{
        "id": 101,
        "pid": -1,
        "iconfont": "icon-database",
        "name": "数据库信息",
        "route": "/db/list",
        "bread": "数据库信息",
        "roles":[roles.PLATFORM]
    }

];
export default menus;
