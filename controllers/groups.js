const Group = require('../models/group');
const User = require('../models/user');
const Invitation = require('../models/invitation');
const { userGroupState } = require('../models/enums');
const { isModelInArray } = require('../helpers/array');
const { map } = require('lodash');

exports.getGroupsByUser = function (req, res, next) {
  const userId = req.user.id;

  Group.find({ 'users.id': userId }, function (err, existingGroups) {
    if (err) { return next(err); }

    if (existingGroups.length) {
      const polishedGroups = map(existingGroups, (group) => {
        const { id, name } = group;
        const leader = group.leader.valueOf();
        const user = group.users.find(isModelInArray.call(this, userId));
        return user.state !== userGroupState.LEFT
          || user.state !== userGroupState.DECLINED
          ? { id, leader, name, user }
          : false;
      });

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(polishedGroups));
    } else {
      return next('User does not belong to any group.');
    }
  });
};

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

        if (createdGroup) {
          const groupId = createdGroup.id.toString();
          existingUser.groups.push({ id: groupId, isLeader: true });
          existingUser.save(function (err, updatedUser) {
            if (err) { return next(err); }
            res.send(createdGroup.id);
          });
        }
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
      return next('Invalid user: selected user is group leader.');
    }

    if (existingUser) {
      Group.findById(groupId, function (err, existingGroup) {
        if (err) { return next(err); }

        if (!existingGroup) {
          return next('Invalid group.');
        }

        if (leaderId !== existingGroup.leader.toString()) {
          return next('You do not have permissions to invite.');
        }

        if (
          existingGroup
          && !existingGroup.users.find(isModelInArray.call(this, newUserId))
          && !existingUser.groups.find(isModelInArray.call(this, groupId))
        ) {
          existingGroup.users.push({ id: newUserId });
          existingUser.groups.push({ id: groupId });

          // TODO: move Promise.all block DRY
          return Promise.all([existingGroup.save(), existingUser.save()])
            .then(([updatedGroup, updatedUser]) => {
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ group: updatedGroup.id, user: updatedUser.id }));
            })
            .catch((err) => {
              return next(err);
            });
        } else {
          return next('User is already in the group.');
        }
      });
    }
  });
};

/* 
  TODO:
  refactor accept, decline, leave methods 
*/
exports.accept = function (req, res, next) {
  const groupId = req.body.group;
  const userId = req.user.id;

  User.findById(userId, function (err, existingUser) {
    if (err) { return next(err); }

    if (existingUser) {
      Group.findById(groupId, function (err, existingGroup) {
        if (err) { return next(err); }

        let userInGroup = existingGroup.users.find(isModelInArray.call(this, userId));
        let groupInUser = existingUser.groups.find(isModelInArray.call(this, groupId));

        if (
          existingGroup
          && userInGroup
          && groupInUser
        ) {
          if (userInGroup.state === userGroupState.ACCEPTED && groupInUser.state === userGroupState.ACCEPTED) {
            return next('Already accepted.');
          }

          if (userInGroup.state === userGroupState.UNACCEPTED || groupInUser.state === userGroupState.UNACCEPTED) {
            userInGroup.state = userGroupState.ACCEPTED;
            groupInUser.state = userGroupState.ACCEPTED;
          }

          return Promise.all([existingGroup.save(), existingUser.save()])
            .then(([updatedGroup, updatedUser]) => {
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ group: updatedGroup.id, user: updatedUser.id, state: userGroupState.ACCEPTED }));
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
}

/* 
  TODO:
  refactor accept, decline, leave methods 
*/
exports.decline = function (req, res, next) {
  const groupId = req.body.group;
  const userId = req.user.id;

  User.findById(userId, function (err, existingUser) {
    if (err) { return next(err); }

    if (existingUser) {
      Group.findById(groupId, function (err, existingGroup) {
        if (err) { return next(err); }

        let userInGroup = existingGroup.users.find(isModelInArray.call(this, userId));
        let groupInUser = existingUser.groups.find(isModelInArray.call(this, groupId));

        if (
          existingGroup
          && userInGroup
          && groupInUser
        ) {
          if (userInGroup.state === userGroupState.DECLINED && groupInUser.state === userGroupState.DECLINED) {
            return next('Already declined.');
          }

          if (userInGroup.state === userGroupState.UNACCEPTED || groupInUser.state === userGroupState.UNACCEPTED) {
            userInGroup.state = userGroupState.DECLINED;
            groupInUser.state = userGroupState.DECLINED;
          }

          return Promise.all([existingGroup.save(), existingUser.save()])
            .then(([updatedGroup, updatedUser]) => {
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ group: updatedGroup.id, user: updatedUser.id, state: userGroupState.DECLINED }));
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
}

/* 
  TODO:
  refactor accept, decline, leave methods 
*/
exports.leave = function (req, res, next) {
  const groupId = req.body.group;
  const userId = req.user.id;

  User.findById(userId, function (err, existingUser) {
    if (err) { return next(err); }

    if (existingUser) {
      Group.findById(groupId, function (err, existingGroup) {
        if (err) { return next(err); }

        let userInGroup = existingGroup.users.find(isModelInArray.call(this, userId));
        let groupInUser = existingUser.groups.find(isModelInArray.call(this, groupId));

        if (
          existingGroup
          && userInGroup
          && groupInUser
        ) {
          if (userInGroup.state === userGroupState.LEFT && groupInUser.state === userGroupState.LEFT) {
            return next('Already left the group.');
          }

          if (userInGroup.state === userGroupState.ACCEPTED || groupInUser.state === userGroupState.ACCEPTED) {
            userInGroup.state = userGroupState.LEFT;
            groupInUser.state = userGroupState.LEFT;
          }

          return Promise.all([existingGroup.save(), existingUser.save()])
            .then(([updatedGroup, updatedUser]) => {
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ group: updatedGroup.id, user: updatedUser.id, state: userGroupState.LEFT }));
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
}
