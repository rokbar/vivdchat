const Authentication = require('./controllers/authentication');
const Groups = require('./controllers/groups');
const Users = require('./controllers/users');
const GroupChat = require('./controllers/groupChat');
const passport = require('passport');
require('./services/passport');

const requireAuth = passport.authenticate('jwt', { session: false, failureRedirect: '/signin' });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'Authorized' });
  });
  app.post('/signup', Authentication.signup);
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/users/search', requireAuth, Users.findByName);
  app.get('/groups', requireAuth, Groups.getGroupsByUser);
  app.post('/groups/create', requireAuth, Groups.create);
  app.post('/groups/inviteUser', requireAuth, Groups.inviteUser);
  app.post('/groups/accept', requireAuth, Groups.accept);
  app.post('/groups/decline', requireAuth, Groups.decline);
  app.post('/groups/leave', requireAuth, Groups.leave);
  app.post('/groups/deleteUserMessages', requireAuth, GroupChat.deleteUserMessagesByGroup);
  app.get('/groups/:id', requireAuth, GroupChat.getMessagesByGroup);
}