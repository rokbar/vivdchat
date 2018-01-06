import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_GROUPS_BY_USER,
  ACCEPT_INVITATION,
  DECLINE_INVITATION,
  LEAVE_GROUP,
  FETCH_MESSAGE,
  APPEND_MESSAGE,
  RECEIVE_MESSAGE
} from './types';

// TODO: move to config file
const ROOT_URL = 'http://localhost:3000';

export function signinUser({ username, password }) {
  return function (dispatch) {
    // Submit username/password to the server
    axios.post(`${ROOT_URL}/signin`, { username, password })
      .then(response => {
        // If request is good...
        // - Update state to indicate user is authenticated
        dispatch({
          type: AUTH_USER
        });
        // - Save the JWT token and username
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        // - Redirect to the route '/'
        browserHistory.push('/groups');
      })
      .catch(() => {
        // If request is bad...
        // - Show an error to the user
        dispatch(authError('Bad Login Info'));
      });
  }
}

export function signupUser({ username, password }) {
  return function (dispatch) {
    axios.post(`${ROOT_URL}/signup`, { username, password })
      .then(response => {
        dispatch({
          type: AUTH_USER
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        browserHistory.push('/groups');
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
  localStorage.removeItem('username');

  return { type: UNAUTH_USER };
}

export function fetchGroupsByUser() {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/groups`, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: FETCH_GROUPS_BY_USER,
          payload: response.data,
        });
      });
  }
}

export function acceptInvitation(group) {
  return function (dispatch) {
    axios.post(`${ROOT_URL}/groups/accept`,
      { group },
      { headers: { authorization: localStorage.getItem('token'), } }
    )
      .then(response => {
        dispatch({
          type: ACCEPT_INVITATION,
          payload: response.data,
        });
      });
  }
}

export function declineInvitation(group) {
  return function (dispatch) {
    axios.post(`${ROOT_URL}/groups/decline`,
      { group },
      { headers: { authorization: localStorage.getItem('token'), } }
    )
      .then(response => {
        dispatch({
          type: ACCEPT_INVITATION,
          payload: response.data,
        });
      });
  }
}

export function leaveGroup(group) {
  return function (dispatch) {
    axios.post(`${ROOT_URL}/groups/leave`,
      { group },
      { headers: { authorization: localStorage.getItem('token'), } }
    )
      .then(response => {
        dispatch({
          type: LEAVE_GROUP,
          payload: response.data,
        });
      });
  }
}
// export function fetchMessage() {
//   return function(dispatch) {
//     axios.get(ROOT_URL, {
//       headers: {authorization: localStorage.getItem('token' )}
//     })
//       .then(response => {
//         dispatch({
//           type: FETCH_MESSAGE,
//           payload: response.data.message
//         });
//       });
//   }
// }

export function appendMessage(message) {
  return {
    type: APPEND_MESSAGE,
    payload: message
  }
}

export function receiveMessage(message) {
  return {
    type: RECEIVE_MESSAGE,
    payload: message
  }
}