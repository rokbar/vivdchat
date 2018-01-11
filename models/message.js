const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
  text: { type: String },
  gif: { type: [Number] },
  gifText: { type: String },
  user: { type: String, required: true },
  username: { type: String, required: true },
  group: { type: String, required: true },
});

const ModelClass = mongoose.model('message', messageSchema);

module.exports = ModelClass;
