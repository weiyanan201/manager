import axios from 'axios';


const GET_GROUP_LIST = "GET_GROUP_LIST";
const GET_GROUP_ALL = "GET_GROUP_ALL";


const groupInitState = {
    data: [],
    groupLoading: false,
    total: 0,
    allGroup:[]
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


function groupList(data) {
    return {type: GET_GROUP_LIST, payload: data}
}

function groupAll(data) {
    return {type: GET_GROUP_ALL,payload:data};
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
