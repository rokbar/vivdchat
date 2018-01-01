const Group = require('../models/group');
const Message = require('../models/message');
const { isModelInArray } = require('../helpers/array');

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

exports.createSocket = function(groupId, userId, callback) {
  Group.findById(groupId, function(err, existingGroup) {
    if (err) { throw new Error(err); }
    if (existingGroup && existingGroup.users.find(isModelInArray.call(this, userId))) {
      callback();
      return;
    } else {
      console.log('Group does not exist or user does not belong to the group.');
    }
  });
};

exports.saveMessage = function(body, callback) {
  const { text, gif, gifText, sub, username, group } = body;

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
