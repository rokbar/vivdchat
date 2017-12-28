const Authentication = require('./controllers/authentication');
const Groups = require('./controllers/groups');
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
  app.post('/groups/create', requireAuth, Groups.create);
  app.post('/groups/inviteUser', requireAuth, Groups.inviteUser);
}