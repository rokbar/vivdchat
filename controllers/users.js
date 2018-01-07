const User = require('../models/user');

exports.findByName = function(req, res, next) {
  const searchText = req.body.searchText;

  User.find({ $text: { $search: searchText }})
  .sort({ username: 1 })
  .select({ _id: 1, username: 1})
  .exec(function(err, users) {
    if (err) {
      console.log(err);
      return res.status(400).send({ error: 'Unhandled API error.' }); 
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(users));
  });
};
