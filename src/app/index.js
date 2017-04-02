import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';

import App from './components/app';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import Chat from './components/auth/chat/chat';
import RequireAuth from './components/auth/require_auth';
import Welcome from './components/welcome';
import reducers from './reducers';
import { INIT } from './actions/types';
import localStorageLoad from './middleware/localStorageLoad';

// localStorageLoad - middleware to load initial authentication state from localStorage variables
const createStoreWithMiddleware = applyMiddleware(localStorageLoad, reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

// fire an initialization action before app renders
store.dispatch({ type: INIT });

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Welcome} />
        <Route path="signin" component={Signin} />
        <Route path="signout" component={Signout} />
        <Route path="signup" component={Signup} />
        <Route path="chat" component={RequireAuth(Chat)} />
      </Route>
    </Router>
  </Provider>
  , document.querySelector('.container'));