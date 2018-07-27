
const PUSH_BREAD = "PUSH_BREAD";
const GET_BREAD = "GET_BREAD";

const initState = {
    path:{}
};

export function bread(state = initState,action) {

    switch (action.type){
        case PUSH_BREAD:
            return {...state,path:action.payload};
        case GET_BREAD:
            return state;
        default:
            return state;
    }
}

function put(data) {
    return {type:PUSH_BREAD,payload:data};
}


export function pushBread(data) {
    return {type:PUSH_BREAD,payload:data};
}





