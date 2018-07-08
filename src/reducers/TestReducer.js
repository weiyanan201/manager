const ADD_GUN = '加机关枪';
const REMOVE_GUN = '减机关枪';

export  function testReducer (state,action) {
    if(!state){
        state = {counter:10,name:'test'}
    }
    switch(action.type){
        case ADD_GUN:
            return state.counter+1;
        case REMOVE_GUN:
            return state.counter-1;
        default:
            return state;
    }
}

// action creator
export function addGun(){
    return {type:ADD_GUN}
}
export function removeGun(){
    return {type:REMOVE_GUN}
}