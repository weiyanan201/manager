import axios from 'axios'



const AUTH_SUCCESS = "AUTH_SUCCESS";
const AUTH_ERROR = "AUTH_ERROR";

const initState={
    isAdmin:false,
    menus:[],
    username:'',
    isAuth:false,
}

export  function auth (state=initState,action){
    switch (action.type){
        case AUTH_SUCCESS:
            const data = action.payload;
            return {...state,...data,isAuth:true};
        case AUTH_ERROR:
        default:
            return state;
    }
}

function authSuccess(data) {
    return {type:AUTH_SUCCESS,payload:data}
}

export function getAuth() {
    console.log(" getAuth ");
    return dispatch=>{
        axios.get('/getAuth')
            .then(res=>{
                if(res.status===200 && res.data.returnCode===0){
                    dispatch(authSuccess(res.data.data));
                }
                console.log(res.data);
            })
    }

}