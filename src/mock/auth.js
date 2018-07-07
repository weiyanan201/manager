import Mock from 'mockjs';


// id ,pid(parent),did(dir)

let database = {

    returnCode: 0,
    data: {
        menus: [
            {
                id: '1',
                icon: 'home',
                name: 'home',
                route: '/home',
            },
            {
                id: '2',
                did:'2',
                name: '接口管理',
                icon: 'api',
            },
            {
                id: '3',
                pid: '2',
                name: '接口浏览',
                icon: 'laptop',
                route: '/api/manage',
            },
            {
                id: '4',
                pid: '2',
                icon: 'file-add',
                name: '接口添加',
                route: '/api/add',
            },
            {
                id: '5',
                did:'5',
                name: '用户管理',
                icon: 'user',
            },
            {
                id: '6',
                pid: '5',
                icon: 'idcard',
                name: '用户浏览',
                route: '/consumer/manage'
            },
            {
                id: '7',
                pid: '5',
                icon: 'user-add',
                name: '用户添加',
                route: '/consumer/add'
            },
            {
                id: '8',
                name: '操作日志',
                icon: 'inbox',
                route: '/log',
            },
            {
                id: '9',
                name: '报表统计',
                icon: 'pie-chart',
                route: '/chart',
            },
        ],
        username: '魏亚楠.yannis',
        isAdmin: true,
    }

}
Mock.setup({
    timeout: '2200-2600'
})
Mock.mock('/getAuth', database);
