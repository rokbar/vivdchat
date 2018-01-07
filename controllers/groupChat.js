const Group = require('../models/group');
const Message = require('../models/message');
const { isModelInArray } = require('../helpers/array');
const { Types } = require('mongoose');
const { map } = require('lodash');
const base64js = require('base64-js');

exports.getMessagesByGroup = function(req, res, next) {
  const groupId = req.params.id;
  const userId = req.user.id;

  if (Types.ObjectId.isValid(groupId)) {
    Group.findById(groupId, function(err, existingGroup) {
      if (err) {
        console.log(err);
        return res.status(400).send({ error: 'Unhandled API error.' }); 
      }
  
      if (!existingGroup) {
        res.status(422).send({ error: 'Invalid group.' });
      }
  
      if (!existingGroup.users.find(isModelInArray.call(this, userId))) {
        res.status(422).send({ error: 'User does not belong to any group.' });
      } else {
        Message.find({ group: groupId })
        .sort( [['_id', -1]] )
        .exec(function(err, messages) {
          if (err) {
            console.log(err);
            return res.status(400).send({ error: 'Unhandled API error.' }); 
          }

          const messagesWithTime = map(messages, (item) => {
            const { id, text, gif, gifText, user, username, group } = item;
            return { id, text, gif, gifText, user, username, group, time: item._id.getTimestamp() };
          });
    
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ name: existingGroup.name, messages: messagesWithTime }));
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
    gif: Array.from(base64js.toByteArray(gif.substring(22))),
    gifText,
    group,
    user: sub,
    username,
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
      console.log(err);
      return res.status(400).send({ error: 'Unhandled API error.' }); 
    } else {
      res.send({ message: 'user\'s ' + userId + ' messages are deleted from group ' + groupId });
    }
  });
}
