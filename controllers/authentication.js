const User = require('../models/user');
// const config = require('../config');

exports.signup = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(422).send({ error: 'You must provide username and password '});
  }

  // See if a user with the given username exists
  User.findOne({ username: username }, function(err, existingUser) {
    if (err) { return next(err) };

    // If a user with username does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Username is in use' });
    }
  
    // If a user with username does NOT exist, create and save user record
    const user = new User({
      username: username,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }
      // Respond to request indicating the user was created
      res.json({ token: 'tokenForUser(user)' });
    });
  });
}