import { AUTH_USER, INIT } from '../actions/types';

export default function({dispatch}) {
  return next => action => {
    const { type } = action;

    if (type === INIT) {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      // If we have a token, consider the user to be signed in
      if (token && username) {
        //we need to update application state
        dispatch({ type: AUTH_USER });
      }
    }
    next(action);
  }  
}