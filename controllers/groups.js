const Group = require('../models/group');
const User = require('../models/user');
const Invitation = require('../models/invitation');
const { isModelInArray } = require('../helpers/array');

exports.create = function (req, res, next) {
  const userId = req.user.id;
  const groupName = req.body.name;
  const groupMembers = [];

  User.findById(userId, function (error, existingUser) {
    if (error) { return next(error) };

    if (existingUser) {
      groupMembers.push({ id: existingUser.id });

      const group = new Group({
        name: groupName,
        leader: existingUser.id,
        users: groupMembers,
      });

      group.save(function (err, createdGroup) {
        if (err) { return next(err); }
        res.send(createdGroup.id);
      });
    }
  });
};

exports.inviteUser = function (req, res, next) {
  const leaderId = req.user.id;
  const newUserId = req.body.user;
  const groupId = req.body.group;

  User.findById(newUserId, function (err, existingUser) {
    if (err) { return next(err); }
    if (newUserId === leaderId) {
      return next('Invalid user.');
    }

    if (existingUser) {
      Group.findById(groupId, function (err, existingGroup) {
        if (err) { return next(err); }

        if (
          existingGroup
          && !existingGroup.users.find(isModelInArray.call(this, newUserId))
          && !existingUser.groups.find(isModelInArray.call(this, groupId))
        ) {
          existingGroup.users.push({ id: newUserId });
          existingUser.groups.push({ id: groupId });

          return Promise.all([existingGroup.save(), existingUser.save()])
            .then(([updatedGroup, updatedUser]) => {
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ group: updatedGroup.id, user: updatedUser.id }));
            })
            .catch((err) => {
              return next(err);
            });
        } else {
          return next('Invalid user or group.');
        }
      });
    }
  });
};
