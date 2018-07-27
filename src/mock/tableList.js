import Mock from 'mockjs';
import {getParams,paging} from './util';



let database = {
    returnCode: 0,
    data:[
        {
            tableId:'1',
            tableName:'table_1',
            groupId:'35',
        },{
            tableId:'2',
            tableName:'table_2',
            groupId:'35',
        },{
            tableId:'3',
            tableName:'table_3',
            groupId:'35',
        },{
            tableId:'4',
            tableName:'table_4',
            groupId:'35',
        },{
            tableId:'5',
            tableName:'table_5',
            groupId:'35',
        },{
            tableId:'6',
            tableName:'table_6',
            groupId:'35',
        },{
            tableId:'7',
            tableName:'table_7',
            groupId:'35',
        },{
            tableId:'8',
            tableName:'table_8',
            groupId:'35',
        },{
            tableId:'9',
            tableName:'table_9',
            groupId:'35',
        },{
            tableId:'10',
            tableName:'table_10',
            groupId:'35',
        },{
            tableId:'11',
            tableName:'table_11',
            groupId:'35',
        },{
            tableId:'12',
            tableName:'table_12',
            groupId:'35',
        },{
            tableId:'13',
            tableName:'table_13',
            groupId:'35',
        },{
            tableId:'14',
            tableName:'table_14',
            groupId:'35',
        },{
            tableId:'15',
            tableName:'table_15',
            groupId:'35',
        },{
            tableId:'16',
            tableName:'table_16',
            groupId:'35',
        },{
            tableId:'17',
            tableName:'table_17',
            groupId:'35',
        },{
            tableId:'18',
            tableName:'table_18',
            groupId:'35',
        },{
            tableId:'19',
            tableName:'table_19',
            groupId:'35',
        },{
            tableId:'20',
            tableName:'table_20',
            groupId:'35',
        },{
            tableId:'21',
            tableName:'table_21',
            groupId:'35',
        },{
            tableId:'22',
            tableName:'table_22',
            groupId:'35',
        },{
            tableId:'23',
            tableName:'table_23',
            groupId:'35',
        },{
            tableId:'24',
            tableName:'table_24',
            groupId:'35',
        },{
            tableId:'25',
            tableName:'table_25',
            groupId:'35',
        },{
            tableId:'26',
            tableName:'table_26',
            groupId:'35',
        },{
            tableId:'27',
            tableName:'table_27',
            groupId:'35',
        },{
            tableId:'28',
            tableName:'table_28',
            groupId:'35',
        },{
            tableId:'29',
            tableName:'table_29',
            groupId:'35',
        },{
            tableId:'30',
            tableName:'table_30',
            groupId:'35',
        },{
            tableId:'31',
            tableName:'table_31',
            groupId:'35',
        },{
            tableId:'32',
            tableName:'table_32',
            groupId:'35',
        }
    ],
    totalCount: 33,
    groupName:'热血传奇',
};

// Mock.mock(/getTableLsit*/,options=>{
//
//     const param = getParams(options.url);
//     const page = param.get("page")===undefined?0:param.get("page");
//     const size = param.get("size")===undefined?10:param.get("size");
//     const data = paging(database.data,page,size);
//
//     let res = {
//         returnCode: 0,
//         data:data,
//         totalCount:database.totalCount,
//         groupName:database.groupName,
//     };
//
//     return res;
//
// });
