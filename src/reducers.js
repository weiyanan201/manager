import { combineReducers } from 'redux'
import { auth } from './reducers/auth.redux'
import { api } from './reducers/api.redux'


export default combineReducers({
    auth:auth,
    api:api
})