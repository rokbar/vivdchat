const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const invitationSchema = new Schema({
  state: {
    type: String,
    enum: ['unaccepted', 'accepted', 'declined', 'left'],
    default: 'unaccepted',
  },
  group: { type: ObjectId, required: true },
  user: { type: ObjectId, required: true },
});

const ModelClass = mongoose.model('invitation', invitationSchema);

module.exports = ModelClass;
