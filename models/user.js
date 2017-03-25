const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: String
});

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;

