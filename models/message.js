const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
  text: { type: String, required: true },
  gif: { type: Buffer, required: true },
  gifText: { type: String, required: true },
  user: { type: String, required: true },
  group: { type: String, required: true },
});

const ModelClass = mongoose.model('message', messageSchema);

module.exports = ModelClass;
