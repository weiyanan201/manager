import axios from 'axios';


const GET_GROUP_LIST = "GET_GROUP_LIST";


const groupInitState = {
    data: [],
    groupLoading: false,
    total: 0
};

export function group(state = groupInitState, action) {
    switch (action.type) {
        case GET_GROUP_LIST:
            return {...state, data: action.payload.data, groupLoading: false, total: action.payload.totalCount};
        default:
            return state;
    }
}


function groupList(data) {
    return {type: GET_GROUP_LIST, payload: data}
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
