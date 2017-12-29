const User = require('../models/user');

exports.findByName = function(req, res, next) {
  const searchTerm = req.body.searchTerm;

  User.find({ $text: { $search: searchTerm }})
  .sort({ username: 1 })
  .select({ _id: 1, username: 1})
  .exec(function(err, users) {
    if (err) { return next(err); }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(users));
  });
};
