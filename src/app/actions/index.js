import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  CREATE_NEW_GROUP,
  FETCH_GROUPS_BY_USER,
  INVITE_USER,
  ACCEPT_INVITATION,
  DECLINE_INVITATION,
  LEAVE_GROUP,
  FETCH_MESSAGE,
  APPEND_MESSAGE,
  RECEIVE_MESSAGE,
  API_ERROR,
  CLEAR_ERROR,
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

export function createNewGroup({ name }, resolve, reject) {
  return function (dispatch) {
    axios.post(
      `${ROOT_URL}/groups/create`,
      { name },
      { headers: { authorization: localStorage.getItem('token'), } }
    )
      .then(response => {
        dispatch({
          type: CLEAR_ERROR,
        });
        dispatch({
          type: CREATE_NEW_GROUP,
          payload: response.data,
        });
        resolve();
      })
      .catch(error => {
        error.response && dispatch(apiError(error.response.data.error));
        reject();
      });
  }
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

export function inviteUser({ group, user }, resolve, reject) {
  return function (dispatch) {
    axios.post(
      `${ROOT_URL}/groups/inviteUser`,
      { group, user },
      { headers: { authorization: localStorage.getItem('token'), } }
    )
    .then(response => {
      dispatch({
        type: CLEAR_ERROR,
      });
      dispatch({
        type: INVITE_USER,
        payload: response.data,
      });
      resolve();
    })
    .catch(error => {
      error.response && dispatch(apiError(error.response.data.error));
      reject();
    });
  }
}

export function acceptInvitation(group) {
  return function (dispatch) {
    axios.post(
      `${ROOT_URL}/groups/accept`,
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
    axios.post(
      `${ROOT_URL}/groups/decline`,
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
    axios.post(
      `${ROOT_URL}/groups/leave`,
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

export function apiError(error) {
  return {
    type: API_ERROR,
    payload: error,
  }
}
