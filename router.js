const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false, failureRedirect: '/signin' });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.render('index', { title: 'Socket.io chat'});
  });
  app.get('/signin', function(req, res) {
    res.render('signin', { title: 'Sign In Form'});
  });
  app.get('/signup', function(req, res) {
    res.render('signup', { title: 'Sign Up Form'});
  });
  app.post('/signup', Authentication.signup);
  app.post('/signin', requireSignin, Authentication.signin);
}