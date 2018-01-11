import { 
  FETCH_GROUP_MESSAGES,
  APPEND_MESSAGE,
  RECEIVE_MESSAGE
} from '../actions/types';

export default function(state = [], action) {
  switch(action.type) {
    case FETCH_GROUP_MESSAGES:
      return action.payload;
    case APPEND_MESSAGE:
      return [ action.payload, ...state ];
    case RECEIVE_MESSAGE:
      return [ action.payload, ...state ];
  }

  return state;
}