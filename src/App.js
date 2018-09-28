import React from 'react';
import './App.css';
import {Route, BrowserRouter,HashRouter} from 'react-router-dom';

import MainLayout from './containers/MainLayout/MainLayout'
import { Provider } from 'react-redux';
import { createStore , compose , applyMiddleware} from 'redux';
import thunk from 'redux-thunk'

import reducers from './reducers'

const store = createStore(
    reducers,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension?window.devToolsExtension():f=>f
    ));

const RouterList = () => (

    <HashRouter>
        <Provider store={store}>
            <div>
                {/*<AuthRoute/>*/}

                    <Route path="/" component={MainLayout}>
                        {/*<Route path="/"  exact  component={HomePage} />*/}
                        {/*<Route path="/test1" exact   component={Test1} />*/}
                        {/*<Route path="/test2" exact  component={Test2} />*/}
                    </Route>
            </div>
        </Provider>
    </HashRouter>

);
export default RouterList
