import axios from '../util/axios'
import {List} from 'immutable'
import menu from '../config/menu'

const AUTH_SUCCESS = "AUTH_SUCCESS";
const AUTH_ERROR = "AUTH_ERROR";

const initState={
    isAdmin:false,
    menus:new List(),
    username:'',
    isAuth:false,
    role:''
}

export  function auth (state=initState,action){
    switch (action.type){
        case AUTH_SUCCESS:
            const data = action.payload;
            const role = data.role;
            const menusData = menu.filter(item=>{
                return item.roles.includes(role);
            });
            const menus = new List(_arrayToTree(menusData));
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

    //antd 的组件只识别字符串
    menus.map(v=>{
        v.id=v.id+"";
        v.pid = v.pid+"";
    })
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
        axios.get('/login')
            .then(res=>{
                if(res.status===200 && res.data.returnCode===0){
                    dispatch(authSuccess(res.data.data));
                }
            })
    }
}
