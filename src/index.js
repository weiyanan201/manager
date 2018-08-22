import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './mock/auth';
import './mock/groupList';
import './mock/tableList';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
