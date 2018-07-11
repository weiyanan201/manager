import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './mock/auth';
import './mock/api';
import './mock/groupList';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
