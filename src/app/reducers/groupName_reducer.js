import { 
  FETCH_GROUP_NAME
} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case FETCH_GROUP_NAME:
      return action.payload;
  }

  return state;
}