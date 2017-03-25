const Authentication = require('./controllers/authentication');

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', { title: 'Socket.io chat'});
  });
  app.post('/signup', Authentication.signup);
}