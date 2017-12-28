const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
  text: { type: String, required: true },
  gif: { type: Buffer, required: true },
  gifComment: { type: String, required: true },
  user: { type: ObjectId, required: true },
  group: { type: ObjectId, required: true },
});

const ModelClass = mongoose.model('message', messageSchema);

module.exports = ModelClass;
