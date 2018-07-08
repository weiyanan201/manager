import axios from 'axios';



const GET_API_LIST = 'GET_API_LIST';
const initState = {
    dataList:[],
    rows:0,
    totalCount:0,
    totalPage:0
};

export  function api (state=initState,action){

    switch (action.type){
        case GET_API_LIST:
            console.log(action.payload);
            return {...state,...action.payload};
        default:
            return state;
    }
}

function apiList(data) {
    return {type:GET_API_LIST,payload:data}
}

export function getApiList(data){
    return dispatch=>{
        axios.get('/searchApi')
            .then(res=>{
                if(res.status===200 && res.data.returnCode===0){
                    dispatch(apiList(res.data.data))
                }
            })
    }
}



