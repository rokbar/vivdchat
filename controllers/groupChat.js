const Group = require('../models/group');
const Message = require('../models/message');
const { isModelInArray } = require('../helpers/array');

exports.saveMessage = function(body, callback) {
  const { text, gif, gifText, sub, username } = body;
  const group = '123';

  const message = new Message({
    text,
    gif,
    gifText,
    group,
    user: sub,
  });

  message.save(function(err, createdMessage) {
    if (err) { throw new Error(err); }
    if (createdMessage) {
      callback({ 
        text,
        gif,
        username,
        time: createdMessage._id.getTimestamp() 
      })
    }
    return;
  });
};

exports.getMessagesByGroup = function(req, res, next) {
  const groupId = req.body.group;
  const userId = req.user.id;

  Group.findById(groupId, function(err, existingGroup) {
    if (err) { return next(err); }

    if (!existingGroup) {
      return next('Invalid group.');
    }

    if (!existingGroup.users.find(isModelInArray.call(this, userId))) {
      return next('User does not belong to group');
    }
  });

  Message.find({ group: groupId })
  .sort( [['_id', -1]] )
  .exec(function(err, messages) {
    if (err) { return next(err); }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(messages));
  });
};
