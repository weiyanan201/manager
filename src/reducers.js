import { combineReducers } from 'redux';
import { auth } from './reducers/auth.redux';
import { api } from './reducers/api.redux';
import { group } from './reducers/table.redux';


export default combineReducers({
    auth:auth,
    api:api,
    group:group,
})