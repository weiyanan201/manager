import axios from '../util/axios';

const GET_DBS = "GET_DBS";
const GET_FIELDS_TYPE = "GET_FIELDS_TYPE";

const configInitState = {
    dbs:{},
    fieldTypes:[]
};
export function config (state = configInitState, action){
    switch (action.type){
        case GET_DBS:
            console.log(action.payload.data);
            return {...state,dbs:action.payload.data};
        case GET_FIELDS_TYPE:
            console.log(action.payload.data);
            return {...state,fieldTypes:action.payload.data};
        default:
            return state;
    }
}

function dbs(data) {
    return {type: GET_DBS, payload: data};
}

function filedsType(data) {
    return {type: GET_FIELDS_TYPE, payload: data};
}

export function getDBs(){
    return dispatch => {
        axios.get('/config/getDbs')
            .then(res => {
               dispatch(dbs(res.data));
            })
    }
}

export function getFieldsType() {
    return dispatch => {
        axios.get('/config/getFieldType')
            .then(res => {
                dispatch(filedsType(res.data));
            })
    }
}