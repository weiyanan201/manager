import axios from 'axios';

const GET_GROUP_LIST = "GET_GROUP_LIST";
const GET_GROUP_ALL = "GET_GROUP_ALL";

const GET_TABLE_LIST = "GET_TABLE_LIST";

const groupInitState = {
    data: [],
    groupLoading: false,
    total: 0,
    allGroup:[]
};

const tableInitState = {
    tableList:[],
    total:0,
    groupName:'',
};

export function group(state = groupInitState, action) {
    switch (action.type) {
        case GET_GROUP_LIST:
            return {...state, data: action.payload.data, groupLoading: false, total: action.payload.totalCount};
        case GET_GROUP_ALL:
            return {...state,allGroup:action.payload.data};
        default:
            return state;
    }
}

export function table(state = tableInitState,action) {
    switch (action.type){
        case GET_TABLE_LIST :
            return {...state,tableList:action.payload.data,total:action.payload.totalCount,groupName:action.payload.groupName};
        default:
            return state;
    }
}


function groupList(data) {
    return {type: GET_GROUP_LIST, payload: data}
}

function groupAll(data) {
    return {type: GET_GROUP_ALL,payload:data};
}

function tableList(data) {
    return {type:GET_TABLE_LIST,payload:data};
}


export function getGroupList(page=1,size=10) {
    return dispatch => {
        axios.get('/searchGroup', {
            params: {
                page: page,
                size:size
            }
        }).then(res => {
                if (res.status === 200 && res.data.returnCode === 0) {
                    dispatch(groupList(res.data));
                }
            })
    }
}

export function getGroupAll(page=1,size=100000) {
    return dispatch => {
        axios.get('/searchGroup', {
            params: {
                page: page,
                size:size
            }
        }).then(res => {
            if (res.status === 200 && res.data.returnCode === 0) {
                dispatch(groupAll(res.data));
            }
        })
    }
}

export function getTableList({gruopId,page=1,size=10}){
    console.log("getTableList request");
    return dispatch => {
        axios.get('/getTableLsit',{
            params:{
                groupId:gruopId,
                page: page,
                size:size
            }
        }).then(res=>{
            if (res.status === 200 && res.data.returnCode === 0) {
                dispatch(tableList(res.data));
            }
        })
    }
}