import {
  API_ERROR,
  CLEAR_ERROR,
} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case API_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_ERROR:
      return { ...state, error: '' };
  }

  return state;
}
