import Mock from 'mockjs';


// id ,pid(parent)

let database = {

    returnCode: 0,
    data: {
        menus: [
            {
                id: '1',
                pid: '-1',
                icon: 'home',
                name: 'home',
                route: '/home',
            },
            {
                id: '2',
                pid:'-1',
                name: '接口管理',
                icon: 'api',
            },
            {
                id: '3',
                pid: '2',
                name: '接口浏览',
                icon: 'laptop',
                route: '/api',
                bread: '接口浏览'
            },
            {
                id: '4',
                pid: '2',
                icon: 'file-add',
                name: '接口添加',
                route: '/api/detail',
                bread:'添加接口'
            },
            {
                id: '5',
                pid:'-1',
                name: '表管理',
                icon: 'user',
            },
            {
                id: '6',
                pid: '5',
                icon: 'idcard',
                name: '表信息',
                route: '/table/groups',
                bread: 'group列表'
            },
            {
                id: '7',
                pid: '5',
                icon: 'user-add',
                name: '新建Table',
                route: '/consumerlist',
                bread:'新建Table'
            },
            {
                id: '8',
                pid:'5',
                icon: 'user-add',
                name: '新建View',
                route: '/log',
                bread:'新建View'
            },
            {
                id: '9',
                pid:'-1',
                name: '报表统计',
                icon: 'pie-chart',
                route: '/chart',
                bread:'报表统计'
            }
        ],
        username: '魏亚楠.yannis',
        isAdmin: true,
    }

};

// Mock.setup({
//     timeout: '2200-2600'
// });

Mock.mock('/getAuth', database);
