import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import messagesReducer from './messages_reducer';

const rootReducer = combineReducers({
  form,
  auth: authReducer,
  messages: messagesReducer
});

export default rootReducer;
