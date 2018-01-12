import {
  MODAL_OPEN,
  MODAL_CLOSE,
} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case MODAL_OPEN:
      return action.payload;
    case MODAL_CLOSE:
      return action.payload;
  }

  return state;
}
