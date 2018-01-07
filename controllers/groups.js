const Group = require('../models/group');
const User = require('../models/user');
const Invitation = require('../models/invitation');
const { userGroupState } = require('../models/enums');
const { isModelInArray } = require('../helpers/array');
const { map, filter, isEmpty } = require('lodash');

exports.getGroupsByUser = function (req, res, next) {
  const userId = req.user.id;

  Group.find({ 'users.id': userId }, function (err, existingGroups) {
    if (err) {
      console.log(err);
      return res.status(400).send({ error: 'Unhandled API error.' }); 
    };

    if (existingGroups.length) {
      const polishedGroups = map(existingGroups, (group) => {
        const { id, name } = group;
        const leader = group.leader.valueOf();
        const user = group.users.find(isModelInArray.call(this, userId));
        if (user.state !== userGroupState.LEFT && user.state !== userGroupState.DECLINED) {
          return { id, leader, name, user };
        }
      })
      const filteredGroups = filter(polishedGroups, (group) => !isEmpty(group));

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(filteredGroups));
    } else {
      return res.status(422).send({ error: 'User does not belong to any group.' }); 
    }
  });
};

exports.create = function (req, res, next) {
  const userId = req.user.id;
  const groupName = req.body.name.toString();
  const groupMembers = [];

  Group.find({ name: groupName }, function(error, existingGroup) {
    if (error) {
      console.log(error);
      return res.status(400).send({ error: 'Unhandled API error.' }); 
    };
    if (existingGroup.length !== 0) {
      return res.status(422).send({ error: 'Group name is already taken.' });
    } else {
      User.findById(userId, function (error, existingUser) {
        if (error) {
          console.log(error);
          return res.status(400).send({ error: 'Unhandled API error.' });
        };
    
        if (existingUser) {
          const createdGroupsByUser = filter(existingUser.groups, (item) => (item.isLeader === true)).length;
          if (createdGroupsByUser >= 1) {
            return res.status(422).send({ error: 'User can create only 1 group.' });
          }
    
          groupMembers.push({ id: existingUser.id });
    
          const group = new Group({
            name: req.body.name,
            leader: existingUser.id,
            users: groupMembers,
          });
    
          group.save(function (err, createdGroup) {
            if (err) {
              console.log(err);
              return res.status(400).send({ error: 'Unhandled API error.' }); 
            }
    
            if (createdGroup) {
              const groupId = createdGroup.id.toString();
              const { id, leader, name } = createdGroup;
              existingUser.groups.push({ id: groupId, isLeader: true });
              existingUser.save(function (err, updatedUser) {
                if (err) {
                  console.log(err);
                  return res.status(400).send({ error: 'Unhandled API error.' }); 
                }
                res.send({ 
                  id, leader, name, user: { id: updatedUser.id, state: 0 } }
                );
              });
            }
          });
        }
      });
    }
  }); 
};

exports.inviteUser = function (req, res, next) {
  const leaderId = req.user.id;
  const newUser = req.body.user;
  const groupId = req.body.group;

  User.findOne({ username: newUser }, function (err, existingUser) {
    if (err) {
      console.log(err);
      return res.status(400).send({ error: 'Unhandled API error.' }); 
    }

    if (existingUser) {
      const userId = existingUser.id.toString();
      if (userId === leaderId) {
        return res.status(422).send({ error: 'Invalid user: selected user is group leader.' }); 
      }

      Group.findById(groupId, function (err, existingGroup) {
        if (err) {
          console.log(err);
          return res.status(400).send({ error: 'Unhandled API error.' }); 
        }

        if (!existingGroup) {
          return res.status(422).send({ error: 'Invalid group.' }); 
        }

        if (leaderId !== existingGroup.leader.toString()) {
          return res.status(422).send({ error: 'You do not have permissions to invite.' }); 
        }

        if (
          existingGroup
          && !existingGroup.users.find(isModelInArray.call(this, userId))
          && !existingUser.groups.find(isModelInArray.call(this, groupId))
        ) {
          existingGroup.users.push({ id: userId });
          existingUser.groups.push({ id: groupId });

          // TODO: move Promise.all block DRY
          return Promise.all([existingGroup.save(), existingUser.save()])
            .then(([updatedGroup, updatedUser]) => {
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ group: updatedGroup.id, user: updatedUser.id }));
            })
            .catch((err) => {
              if (err) {
                console.log(err);
                return res.status(400).send({ error: 'Unhandled API error.' }); 
              }
            });
        } else {
          return res.status(422).send({ error: 'User is already in the group.' }); 
        }
      });
    } else {
      return res.status(422).send({ error: 'Could not find user with specified name.' }); 
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
    if (err) {
      console.log(err);
      return res.status(400).send({ error: 'Unhandled API error.' }); 
    };

    if (existingUser) {
      Group.findById(groupId, function (err, existingGroup) {
        if (err) {
          console.log(err);
          return res.status(400).send({ error: 'Unhandled API error.' }); 
        };

        let userInGroup = existingGroup.users.find(isModelInArray.call(this, userId));
        let groupInUser = existingUser.groups.find(isModelInArray.call(this, groupId));

        if (
          existingGroup
          && userInGroup
          && groupInUser
        ) {
          if (userInGroup.state === userGroupState.ACCEPTED && groupInUser.state === userGroupState.ACCEPTED) {
            return res.status(422).send({ error: 'Already accepted.' });
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
              console.log(err);
              return res.status(400).send({ error: 'Unhandled API error.' });
            });
        } else {
          return res.status(422).send({ error: 'Invalid user or group.' });
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
    if (err) { 
      console.log(err);
      return res.status(400).send({ error: 'Unhandled API error.' }); 
    }

    if (existingUser) {
      Group.findById(groupId, function (err, existingGroup) {
        if (err) { 
          console.log(err);
          return res.status(400).send({ error: 'Unhandled API error.' }); 
        }

        let userInGroup = existingGroup.users.find(isModelInArray.call(this, userId));
        let groupInUser = existingUser.groups.find(isModelInArray.call(this, groupId));

        if (
          existingGroup
          && userInGroup
          && groupInUser
        ) {
          if (userInGroup.state === userGroupState.DECLINED && groupInUser.state === userGroupState.DECLINED) {
            return res.status(422).send({ error: 'Already declined.' });
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
              console.log(err);
              return res.status(400).send({ error: 'Unhandled API error.' });
            });
        } else {
          return res.status(422).send({ error: 'Invalid user or group.' });
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
    if (err) { 
      console.log(err);
      return res.status(400).send({ error: 'Unhandled API error.' }); 
    }

    if (existingUser) {
      Group.findById(groupId, function (err, existingGroup) {
        if (err) {
          console.log(err);
          return res.status(400).send({ error: 'Unhandled API error.' }); 
        }

        let userInGroup = existingGroup.users.find(isModelInArray.call(this, userId));
        let groupInUser = existingUser.groups.find(isModelInArray.call(this, groupId));

        if (
          existingGroup
          && userInGroup
          && groupInUser
        ) {
          if (userInGroup.state === userGroupState.LEFT && groupInUser.state === userGroupState.LEFT) {
            return res.status(422).send({ error: 'Already left the group.' });
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
              console.log(err);
              return res.status(400).send({ error: 'Unhandled API error.' });
            });
        } else {
          return res.status(422).send({ error: 'Invalid user or group.' });
        }
      });
    }
  });
}
