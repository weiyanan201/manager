import Mock from 'mockjs';


import {getParams,paging} from './util';


let database = {
    returnCode: 0,
    data:[
        {
            groupName:'热血传奇',
            groupId:'1',
            authority:'分析师',
            app:{
                appName:'热血传奇1'
            }
        },{
            groupName:'暗黑热血',
            groupId:'2',
            authority:'开发者',
            app:{
                appName:'暗黑热血2'
            }
        },{
            groupName:'巴清传',
            groupId:'3',
            authority:'分析师',
            app:{
                appName:'巴清传3'
            }
        },{
            groupName:'彩虹岛',
            groupId:'4',
            authority:'分析师',
            app:{
                appName:'彩虹岛4'
            }
        },{
            groupName:'超级跑跑',
            groupId:'5',
            authority:'开发者',
            app:{
                appName:'超级跑跑5'
            }
        },{
            groupName:'传奇永恒',
            groupId:'6',
            authority:'分析师',
            app:{
                appName:'传奇永恒6'
            }
        },{
            groupName:'城与龙',
            groupId:'7',
            authority:'开发者',
            app:{
                appName:'城与龙7'
            }
        },{
            groupName:'九阴真经',
            groupId:'8',
            authority:'开发者',
            app:{
                appName:'九阴真经8'
            }
        },{
            groupName:'九阴真经',
            groupId:'9',
            authority:'开发者',
            app:{
                appName:'九阴真经9'
            }
        },{
            groupName:'九阴真经',
            groupId:'10',
            authority:'开发者',
            app:{
                appName:'九阴真经10'
            }
        },{
            groupName:'九阴真经',
            groupId:'11',
            authority:'开发者',
            app:{
                appName:'九阴真经11'
            }
        },{
            groupName:'九阴真经',
            groupId:'12',
            authority:'开发者',
            app:{
                appName:'九阴真经12'
            }
        },{
            groupName:'九阴真经',
            groupId:'13',
            authority:'开发者',
            app:{
                appName:'九阴真经13'
            }
        },{
            groupName:'九阴真经',
            groupId:'14',
            authority:'开发者',
            app:{
                appName:'九阴真经14'
            }
        },{
            groupName:'九阴真经',
            groupId:'15',
            authority:'开发者',
            app:{
                appName:'九阴真经15'
            }
        },{
            groupName:'九阴真经',
            groupId:'16',
            authority:'开发者',
            app:{
                appName:'九阴真经16'
            }
        },{
            groupName:'九阴真经',
            groupId:'17',
            authority:'开发者',
            app:{
                appName:'九阴真经17'
            }
        },{
            groupName:'九阴真经',
            groupId:'18',
            authority:'开发者',
            app:{
                appName:'九阴真经18'
            }
        },{
            groupName:'九阴真经',
            groupId:'19',
            authority:'开发者',
            app:{
                appName:'九阴真经19'
            }
        },{
            groupName:'九阴真经',
            groupId:'20',
            authority:'开发者',
            app:{
                appName:'九阴真经20'
            }
        },{
            groupName:'九阴真经',
            groupId:'21',
            authority:'开发者',
            app:{
                appName:'九阴真经21'
            }
        },{
            groupName:'九阴真经',
            groupId:'22',
            authority:'开发者',
            app:{
                appName:'九阴真经22'
            }
        },{
            groupName:'九阴真经',
            groupId:'23',
            authority:'开发者',
            app:{
                appName:'九阴真经23'
            }
        },{
            groupName:'九阴真经',
            groupId:'24',
            authority:'开发者',
            app:{
                appName:'九阴真经24'
            }
        },{
            groupName:'九阴真经',
            groupId:'25',
            authority:'开发者',
            app:{
                appName:'九阴真经25'
            }
        },{
            groupName:'九阴真经',
            groupId:'26',
            authority:'开发者',
            app:{
                appName:'九阴真经26'
            }
        },{
            groupName:'九阴真经',
            groupId:'27',
            authority:'开发者',
            app:{
                appName:'九阴真经27'
            }
        },{
            groupName:'九阴真经',
            groupId:'28',
            authority:'开发者',
            app:{
                appName:'九阴真经28'
            }
        },{
            groupName:'九阴真经',
            groupId:'29',
            authority:'开发者',
            app:{
                appName:'九阴真经29'
            }
        },{
            groupName:'九阴真经',
            groupId:'30',
            authority:'开发者',
            app:{
                appName:'九阴真经30'
            }
        },{
            groupName:'九阴真经',
            groupId:'31',
            authority:'开发者',
            app:{
                appName:'九阴真经31'
            }
        },{
            groupName:'九阴真经',
            groupId:'32',
            authority:'开发者',
            app:{
                appName:'九阴真经32'
            }
        },{
            groupName:'九阴真经',
            groupId:'33',
            authority:'开发者',
            app:{
                appName:'九阴真经33'
            }
        },{
            groupName:'九阴真经',
            groupId:'34',
            authority:'开发者',
            app:{
                appName:'九阴真经34'
            }
        },{
            groupName:'九阴真经',
            groupId:'35',
            authority:'开发者',
            app:{
                appName:'九阴真经35'
            }
        },{
            groupName:'九阴真经',
            groupId:'36',
            authority:'开发者',
            app:{
                appName:'九阴真经36'
            }
        },{
            groupName:'九阴真经',
            groupId:'37',
            authority:'开发者',
            app:{
                appName:'九阴真经37'
            }
        },{
            groupName:'九阴真经',
            groupId:'38',
            authority:'开发者',
            app:{
                appName:'九阴真经38'
            }
        },{
            groupName:'九阴真经',
            groupId:'39',
            authority:'开发者',
            app:{
                appName:'九阴真经39'
            }
        },{
            groupName:'九阴真经',
            groupId:'40',
            authority:'开发者',
            app:{
                appName:'九阴真经40'
            }
        },{
            groupName:'九阴真经',
            groupId:'41',
            authority:'开发者',
            app:{
                appName:'九阴真经41'
            }
        },{
            groupName:'九阴真经',
            groupId:'42',
            authority:'开发者',
            app:{
                appName:'九阴真经42'
            }
        },{
            groupName:'九阴真经',
            groupId:'43',
            authority:'开发者',
            app:{
                appName:'九阴真经43'
            }
        },{
            groupName:'九阴真经',
            groupId:'44',
            authority:'开发者',
            app:{
                appName:'九阴真经44'            }
        },{
            groupName:'九阴真经',
            groupId:'45',
            authority:'开发者',
            app:{
                appName:'九阴真经45'
            }
        },{
            groupName:'九阴真经',
            groupId:'46',
            authority:'开发者',
            app:{
                appName:'九阴真经46'
            }
        },{
            groupName:'九阴真经',
            groupId:'47',
            authority:'开发者',
            app:{
                appName:'九阴真经47'
            }
        },{
            groupName:'九阴真经',
            groupId:'48',
            authority:'开发者',
            app:{
                appName:'九阴真经48'
            }
        },{
            groupName:'九阴真经',
            groupId:'49',
            authority:'开发者',
            app:{
                appName:'九阴真经49'
            }
        },{
            groupName:'九阴真经',
            groupId:'50',
            authority:'开发者',
            app:{
                appName:'九阴真经50'
            }
        },{
            groupName:'九阴真经',
            groupId:'51',
            authority:'开发者',
            app:{
                appName:'九阴真经51'
            }
        },{
            groupName:'九阴真经',
            groupId:'52',
            authority:'开发者',
            app:{
                appName:'九阴真经52'
            }
        },{
            groupName:'九阴真经',
            groupId:'53',
            authority:'开发者',
            app:{
                appName:'九阴真经53'
            }
        },{
            groupName:'九阴真经',
            groupId:'54',
            authority:'开发者',
            app:{
                appName:'九阴真经54'
            }
        },{
            groupName:'九阴真经',
            groupId:'55',
            authority:'开发者',
            app:{
                appName:'九阴真经55'
            }
        }
    ],
    totalCount: 55,
};

Mock.mock(/searchGroup*/,options=>{

    const param = getParams(options.url);
    const page = param.get("page")===undefined?0:param.get("page");
    const size = param.get("size")===undefined?10:param.get("size");
    const data = paging(database.data,page,size);

    let res = {
        returnCode: 0,
        data:data,
        totalCount:database.totalCount
    };

    return res;

});