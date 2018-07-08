import axios from 'axios'
import {List} from 'immutable'



const AUTH_SUCCESS = "AUTH_SUCCESS";
const AUTH_ERROR = "AUTH_ERROR";

const initState={
    isAdmin:false,
    menus:new List(),
    username:'',
    isAuth:false,
}

export  function auth (state=initState,action){
    switch (action.type){
        case AUTH_SUCCESS:
            const data = action.payload;
            const menus = new List(_arrayToTree(data.menus));
            return {...state,...data,isAuth:true,menus:menus};
        case AUTH_ERROR:
        default:
            return state;
    }
}

function authSuccess(data) {
    return {type:AUTH_SUCCESS,payload:data}
}

function _arrayToTree(menus){
    menus.sort((a,b)=>(a.id-b.id));
    let data = List(menus);
    let result = [];
    let hash = {};
    data.forEach((item,index)=>{
        // hash[data[index]['id']] = data[index];
        hash[item.id] = item;
    })
    data.forEach(item=>{
        let hasParent = hash[item['pid']];
        if(hasParent){
            if(!hasParent['children']){
                hasParent['children']=[];
            }
            hasParent['children'].push(item);
        }else{
            result.push(item);
        }
    })
    return result;


}

export function getAuth() {
    return dispatch=>{
        axios.get('/getAuth')
            .then(res=>{
                if(res.status===200 && res.data.returnCode===0){
                    dispatch(authSuccess(res.data.data));
                }
            })
    }

}
