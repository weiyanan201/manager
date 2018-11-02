
import axios from '../util/axios'
import { GROUP_PERMISSION } from "../config";
import { pushBread } from './bread.redux';

const ANALYST = 1;
const DEVELOPER = 2;
const CLEAR = 3;

const LEFT = 1;
const RIGHT = 2;

export {ANALYST,DEVELOPER,CLEAR,LEFT,RIGHT };

const tenantPermissionInit = {
    rest:[],
    has:[],
    data:[],
    tenantId:0,
    modalVisible:false,
    leftChecked:[],
    leftAllChecked:false,
    leftSearch:'',
    rightChecked:[],
    rightAllChecked:false,
    rightSearch:'',
    okLoading:false,
    original:{},
    tenantSpinLoading:false
};

const UPDATE_DATASOURCE = "UPDATE_DATASOURCE";
const HANDLE_ALL_CHECK = "HANDLE_ALL_CHECK";
const HANDLE_CHECK = "HANDLE_CHECK";
const HANDLE_MOVE = "HANDLE_MOVE";
const HANDLE_SEARCH = "HANDLE_SEARCH";
const MODAL_TOGGLE = "MODAL_TOGGLE";
const LOADING_TOGGLE = "LOADING_TOGGLE";
const SPIN_TOGGLE = "SPIN_TOGGLE";

export function tenantPermission(state = tenantPermissionInit, action) {
    switch (action.type) {
        case UPDATE_DATASOURCE:
            const data = action.payload.data;
            const rest = action.payload.rest;
            const tenantId = action.payload.tenantId;
            const has = data.map(val=>(
                {
                    key:val.id,
                    id:val.id,
                    name:val.name,
                    type:val.permissions.includes(GROUP_PERMISSION.WRITE_BUSINESS_SCHEMA)||val.permissions.includes(GROUP_PERMISSION.MODIFY_BUSINESS_SCHEMA)||val.permissions.includes(GROUP_PERMISSION.SUBMIT_TASK) ? DEVELOPER:ANALYST
                }
            ));
            const original = {};
            original.rest = rest.slice(0);
            original.has = has.slice(0);
            original.tenantId = tenantId;
            return {...state,has,data,rest,tenantId ,original };
        case HANDLE_ALL_CHECK:
            return _handleAllCheck(state,action.payload);
        case HANDLE_CHECK:
            return _handleCheck(state,action.payload);
        case HANDLE_MOVE:
            return _handleMove(state,action.payload);
        case HANDLE_SEARCH:
            return _handleSearch(state,action.payload);
        case MODAL_TOGGLE:
            //状态复位
            const toggle = action.payload;
            if (toggle===true){
                const restBack = [...state.original.rest.slice(0)];
                const hasBack = [...state.original.has.slice(0)];
                const tenantBack = state.original.tenantId;
                return {
                    rest:restBack,
                    has:hasBack,
                    data:state.data,
                    tenantId:tenantBack,
                    modalVisible:toggle,
                    leftChecked:[],
                    leftAllChecked:false,
                    leftSearch:'',
                    rightChecked:[],
                    rightAllChecked:false,
                    rightSearch:'',
                    okLoading:false,
                    original:state.original,
                }
            }else{
                return {...state,modalVisible:toggle,tenantSpinLoading:false};
            }
        case LOADING_TOGGLE:
            return {...tenantPermissionInit,okLoading:action.payload,original};
        case SPIN_TOGGLE :
            return {...state,tenantSpinLoading:action.payload}
        default:
            return state;
    }
}

function _handleAllCheck(state,direction){
    if (direction===LEFT){
        const toggle = state.leftAllChecked;
        let leftChecked ;
        if (toggle){
            //已全选，复位
            leftChecked = [];
        }else{
            //全选
            leftChecked = state.rest.map(val=>val.id);
        }
        return {...state,leftChecked,leftAllChecked:!toggle};
    }else{
        const toggle = state.rightAllChecked;
        let rightChecked ;
        if (toggle){
            //已全选，复位
            rightChecked = [];
        }else{
            //全选
            rightChecked = state.has.map(val=>val.id);
        }
        return {
            ...state,rightChecked,rightAllChecked:!toggle
        };
    }
}

function _handleCheck(state,payload) {
    const {id,direction} = {...payload};
    if (direction===LEFT){
        const leftChecked = state.leftChecked;
        let newChecked ;
        if (leftChecked.includes(id)) {
            let index = leftChecked.findIndex(val=>val===id);
            newChecked =  [...leftChecked.slice(0, index), ...leftChecked.slice(index + 1)];
        }else{
            newChecked = [...leftChecked,id];
        }
        return {...state,leftChecked:newChecked};
    }else{
        let rightChecked = state.rightChecked;
        let newChecked ;
        if (rightChecked.includes(id)) {
            let index = rightChecked.findIndex(val=>val===id);
            newChecked =  [...rightChecked.slice(0, index), ...rightChecked.slice(index + 1)];
        }else{
            newChecked = [...rightChecked,id];
        }
        rightChecked.includes(id)?rightChecked.splice(rightChecked.findIndex(val=>val===id),1):rightChecked.push(id);
        return {...state,rightChecked:newChecked};
    }
}

function _handleMove(state,direction) {
    if (direction===ANALYST || direction===DEVELOPER){
        //分析师 //开发者
        const leftChecked = state.leftChecked;
        const rest = state.rest;
        const has = state.has;
        leftChecked.forEach(val=>{
            const dataIndex = rest.findIndex(item=>item.id===val);
            const data = rest[dataIndex];
            has.push({
                id:data.id,
                name:data.name,
                type:direction
            });
            rest.splice(dataIndex,1);
        });
        return {
            ...state,
            ...rest,
            ...has,
            leftChecked:[]
        };
    }else if(direction===CLEAR){
        //移除权限
        const rightChecked = state.rightChecked;
        const rest = state.rest;
        const has = state.has;
        rightChecked.forEach(val=>{
            const dataIndex = has.findIndex(item=>item.id===val);
            const data = has[dataIndex];
            rest.push({
                id:data.id,
                name:data.name
            });
            has.splice(dataIndex,1);
        });
        return {
            ...state,
            ...rest,
            ...has,
            rightChecked:[]
        };
    }
}

function _handleSearch(state,payload) {
    const {text,direction} = {...payload};
    if (direction===LEFT){
        return {...state,leftSearch:text};
    } else{
        return {...state,rightSearch: text};
    }
}


export function updateDataSource(tenantId){
    return dispatch => {
        dispatch(spinToggle(true));
        axios.post("/tenant/getGroupList",{tenantId:tenantId})
            .then(res=>{
                const data = res.data.data.permissonGroups;
                const rest = res.data.data.rest;
                const tenant = res.data.data.tenant;
                dispatch({type: UPDATE_DATASOURCE, payload: {data,rest,tenantId}});
                const breadUrl = "/user/list/"+tenantId;
                const breadObj = {[breadUrl]: `${tenant.userName}的权限`};
                dispatch(pushBread(breadObj));
                dispatch(spinToggle(false));
            })
            .catch(()=>{
                dispatch(spinToggle(false));
            })
    }
}

export function handleAllCheck(direction) {
    return {type:HANDLE_ALL_CHECK,payload:direction};
}

export function handleCheck(id,direction) {
    return {type:HANDLE_CHECK,payload:{id,direction}};
}

export function handleMove(direction) {
    return {type:HANDLE_MOVE,payload:direction};
}

export function handleSearch(text,direction) {
    return {type:HANDLE_SEARCH,payload:{text,direction}};
}

export function modalToggle(toggle) {
    return {type:MODAL_TOGGLE,payload:toggle};
}

export function spinToggle(toggle){
    return {type:SPIN_TOGGLE,payload:toggle};
}

export function handleSubmit(tenantId,has) {
    return dispatch => {
        dispatch({type:LOADING_TOGGLE,payload:true});
        axios.postByJson("/tenant/saveTenantPermission",{has:has,tenantId:tenantId})
            .then(()=>{
                dispatch({type:LOADING_TOGGLE,payload:false});
                dispatch(modalToggle(false));
                dispatch(updateDataSource(tenantId));
            }).catch(()=>{
                dispatch(updateDataSource(tenantId));
            });
    };
}