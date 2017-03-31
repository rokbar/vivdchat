import { RECEIVE_MESSAGE } from '../actions/types';

export default function(state = [], action) {
  switch(action.type) {
    case RECEIVE_MESSAGE:
      return [...state, action.payload];
  }

  return state;
}