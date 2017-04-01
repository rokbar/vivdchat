import axios from 'axios';
import { browserHistory } from 'react-router';
import { 
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE,
  RECEIVE_MESSAGE
} from './types';

// TODO: move to config file
const ROOT_URL = 'http://localhost:3000';

export function signinUser({ username, password }) {
  return function(dispatch) {
    // Submit username/password to the server
    axios.post(`${ROOT_URL}/signin`, { username, password })
      .then(response => {
        // If request is good...
        // - Update state to indicate user is authenticated
        dispatch({
          type: AUTH_USER,
          payload: username
        });
        // - Save the JWT token
        localStorage.setItem('token', response.data.token);
        // - Redirect to the route '/'
        browserHistory.push('/chat');
      })
      .catch(() => {
        // If request is bad...
        // - Show an error to the user
        dispatch(authError('Bad Login Info'));
      });
  }
}

export function signupUser({ username, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { username, password })
      .then(response => {
        dispatch({
          type: AUTH_USER,
          paylaod: username
        });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/chat');
      })
      .catch(error => {
        console.log(error);
        dispatch(authError(error.response.data.error));
      });
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

export function signoutUser() {
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}

// redux-thunk
export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: {authorization: localStorage.getItem('token' )}
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      });
  }
}

export function receiveMessage(message) {
  return {
    type: RECEIVE_MESSAGE,
    payload: message
  }
}