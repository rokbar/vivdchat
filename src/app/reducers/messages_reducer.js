import { 
  APPEND_MESSAGE,
  RECEIVE_MESSAGE
} from '../actions/types';

export default function(state = [], action) {
  switch(action.type) {
    case APPEND_MESSAGE:
      return [...state, action.payload];
    case RECEIVE_MESSAGE:
      return [...state, action.payload];
  }

  return state;
}