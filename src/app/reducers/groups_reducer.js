import {
  FETCH_GROUPS_BY_USER,
  ACCEPT_INVITATION,
  DECLINE_INVITATION,
  LEAVE_GROUP,
} from '../actions/types';
import { map, find } from 'lodash';

export default function (state = [], action) {
  switch (action.type) {
    case FETCH_GROUPS_BY_USER:
      return action.payload;
    case ACCEPT_INVITATION:
      return updateStateAfterAction(state, action);
    case DECLINE_INVITATION:
      return updateStateAfterAction(state, action);
    case LEAVE_GROUP:
      return updateStateAfterAction(state, action);
  }

  return state;
}

function updateStateAfterAction(state, { payload }) {
  console.log(payload);
  const {group, user } = payload;
  const newState = payload.state;

  return map(state, (existingGroup) => {
    if (existingGroup.id === group) {
      existingGroup.user.state = newState;
    }
    return existingGroup;
  });
}
