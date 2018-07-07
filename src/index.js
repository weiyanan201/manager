import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './mock/auth'

import AuthRoute from './components/AuthRoute/AuthRoute'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
