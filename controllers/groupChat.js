const Group = require('../models/group');
const Message = require('../models/message');
const { isModelInArray } = require('../helpers/array');
const { Types } = require('mongoose');

exports.getMessagesByGroup = function(req, res, next) {
  const groupId = req.params.id;
  const userId = req.user.id;

  if (Types.ObjectId.isValid(groupId)) {
    Group.findById(groupId, function(err, existingGroup) {
      if (err) { return next(err); }
  
      if (!existingGroup) {
        return next('Invalid group.');
      }
  
      if (!existingGroup.users.find(isModelInArray.call(this, userId))) {
        return next('User does not belong to group');
      } else {
        Message.find({ group: groupId })
        .sort( [['_id', -1]] )
        .exec(function(err, messages) {
          if (err) { return next(err); }
      
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(messages));
        });
      }
    }); 
  } else {
    res.status(404).send({ error: 'Invalid group id.' });
  }
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

exports.deleteUserMessagesByGroup = function(req, res, next) {
  const userId = req.user.id;
  const groupId = req.body.group;

  Message.remove({ group: groupId, user: userId }, function(err) {
    if (err) {
      res.send({ error: err });
      return next(err);
    } else {
      res.send({ message: 'user\'s ' + userId + ' messages are deleted from group ' + groupId });
    }
  });
}
