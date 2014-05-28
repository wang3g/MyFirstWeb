module.exports = function (app) {

	var home = require('../controllers/home');
	var users = require('../controllers/users');

	app.get('/', home.index);
    app.get('/users', users.list);
}