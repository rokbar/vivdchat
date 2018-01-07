const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const { userGroupState } = require('./enums');

const groupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  leader: { type: ObjectId, required: true },
  users: [{ 
    id: ObjectId,
    state: {
      type: Number,
      enum: Object.values(userGroupState),
      default: userGroupState.UNACCEPTED,
    },
    _id: false,
  }],
});

const ModelClass = mongoose.model('group', groupSchema);

module.exports = ModelClass;
