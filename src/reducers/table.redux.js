// import axios from 'axios';
import axios from '../util/axios'
import util from '../util/util';


const GET_GROUP_LIST = "GET_GROUP_LIST";
const GET_GROUP_ALL = "GET_GROUP_ALL";
const SHOW_GROUP = "SHOW_GROUP";
const SHOW_GROUP_BY_ID = "SHOW_GROUP_BY_ID";

const GET_TABLE_LIST = "GET_TABLE_LIST";
const SHOW_TABLE_PAGE = "SHOW_TABLE_PAGE";
const INIT_TABLE_LIST = "INIT_TABLE_LIST";

const GET_TABLE_INFO = "GET_TABLE_INFO";

const groupInitState = {
    data: [],
    total: 0,
    allGroup: [],
    groupLoading:true
};

const tableInitState = {
    data: [],
    total: 0,
    allTable:[],
    tableLoading:true,
    groupName: '',
    groupId:''
};

const tableInfoInitState = {
    id:'',
    tableName:'',
    db:'',
    storageType:'',
    comment:'',
    columns:[]
}

export function group(state = groupInitState, action) {
    switch (action.type) {
        case GET_GROUP_LIST:

            return {...state, allGroup: action.payload.data, total: action.payload.totalCount,groupLoading:false};
        case SHOW_GROUP:
            const {page,size,search} = {...action.payload};
            const filteDatas = util.filterData(state.allGroup,search,'name');
            const datas = util.paging(filteDatas,page,size);
            const total = filteDatas.length;
            return {...state, data: datas,total:total};
        case SHOW_GROUP_BY_ID:
            const data = state.allGroup.filter(v=>v.id===parseInt(action.payload));
            return {...state, data: data,total:1};
        default:
            return state;
    }
}

export function table(state = tableInitState, action) {
    switch (action.type) {
        case GET_TABLE_LIST :
            return {
                ...state,
                allTable: action.payload.data.data,
                groupName: action.payload.data.groupName,
                groupId:action.payload.groupId,
                tableLoading:false
            };
        case SHOW_TABLE_PAGE:
            const {page,size,search} = {...action.payload};
            const filteDatas = util.filterData(state.allTable,search,'name');
            const datas = util.paging(filteDatas,page,size);
            const total = filteDatas.length;
            return {...state, data: datas,total:total};
        case INIT_TABLE_LIST:
            return tableInitState;
        default:
            return state;
    }
}

export function tableInfo(state=tableInfoInitState,action) {

    switch (action.type){
        case GET_TABLE_INFO:
            const detail = action.payload.data;
            if (detail===null){
                return state;
            }
            const tableName = detail.name;
            const id = detail.id;
            const db = detail.db;
            const storageType = detail.storageType;
            let comment = '';
            if (detail.tableInfo!==undefined && detail.tableInfo.parameters!==undefined && detail.tableInfo.parameters.comment!==undefined){
                comment = detail.tableInfo.parameters.comment;
            }

            return {...state,tableName,id,storageType,db,comment,columns:detail.columns};
        default:
            return state;
    }
}


function groupList(data) {
    return {type: GET_GROUP_LIST, payload: data}
}

function showGroup(data) {
    return {type: SHOW_GROUP, payload: data};
}

function showGroupById(data) {
    return {type: SHOW_GROUP_BY_ID, payload: data};
}

function initTableList() {
    return {type:INIT_TABLE_LIST}
}

function tableList(data) {
    return {type: GET_TABLE_LIST, payload: data};
}

function showTablePage(data) {
    return {type: SHOW_TABLE_PAGE, payload: data};
}

function tableDetail(data) {
    return {type: GET_TABLE_INFO, payload: data};
}

export function getGroupList() {
    return dispatch => {
        axios.get('/table/getGroupList')
            .then(res => {
                if (res.status === 200 && res.data.returnCode === 0) {
                    dispatch(groupList(res.data));
                    dispatch(showGroup({page:1,size:10}));
                }
            })
    }
}

export function getShowGroup(page=1,size=10,search) {
    return dispatch => {
        dispatch(showGroup({page,size,search}));
    }
}

export function getShowGroupById(id) {
    return dispatch => {
        dispatch(showGroupById(id))
    }
}

export function getTableList({groupId:groupId}) {
    return dispatch => {
        dispatch(initTableList());
        axios.get('/table/getTableList',{groupId:groupId})
            .then(res => {
                dispatch(tableList({...res.data,groupId:groupId}));
                dispatch(showTablePage({page:1,size:10}));
            })
    }
}

export function getShowTablePage(page=1,size=10,search='') {
    return dispatch => {
        dispatch(showTablePage({page,size,search}));
    }
}

export function getTableInfo(tableId) {

    return dispatch => {
        axios.get('/table/getTableInfo',{tableId})
            .then(res=>{
                dispatch(tableDetail(res.data));
            })
    }


}
