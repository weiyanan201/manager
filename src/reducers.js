import { combineReducers } from 'redux';
import { auth } from './reducers/auth.redux';
import { group,table,tableInfo } from './reducers/table.redux';
import { bread } from './reducers/bread.redux';
import { config } from './reducers/config.redux';


export default combineReducers({
    auth:auth,
    group:group,
    table:table,
    bread:bread,
    tableInfo:tableInfo,
    config :config,
})