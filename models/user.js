const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcrypt-nodejs');
const { userGroupState } = require('./enums');

// Define user model
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  groups: [{
     id: ObjectId,
     isLeader: Boolean,
     state: {
      type: Number,
      enum: Object.values(userGroupState),
      default: userGroupState.UNACCEPTED,
    },
     _id: false,
  }],
});

userSchema.index({ username: 'text' });

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  // get access to the user model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // has (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  })
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;

