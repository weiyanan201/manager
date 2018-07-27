import { combineReducers } from 'redux';
import { auth } from './reducers/auth.redux';
import { api } from './reducers/api.redux';
import { group,table,tableInfo } from './reducers/table.redux';
import { bread } from './reducers/bread.redux';


export default combineReducers({
    auth:auth,
    api:api,
    group:group,
    table:table,
    bread:bread,
    tableInfo:tableInfo,
})