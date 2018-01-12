import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import messagesReducer from './messages_reducer';
import groupNameReducer from './groupName_reducer';
import groupsReducer from './groups_reducer';
import errorsReducer from './error_reducer'
import modalReducer from './modal_reducer';
import { UNAUTH_USER } from '../actions/types';

const appReducer = combineReducers({
  form,
  auth: authReducer,
  groups: groupsReducer,
  messages: messagesReducer,
  groupName: groupNameReducer,
  errors: errorsReducer,
  modal: modalReducer,
})

const rootReducer = (state, action) => {
  if (action.type === UNAUTH_USER) {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;
