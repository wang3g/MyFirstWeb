module.exports = function (app, passport, auth) {

	var home = require('../controllers/home');
	var users = require('../controllers/users');

	//Load the home page
	app.get('/', home.index);

	//Load & show the login and SignUp forms for business users.
	app.get('/users', users.loginOrSignup);

	//Process the Login form
	app.post('/users/session', passport.authenticate('local', {failureRedirect: '/users', failureFlash: 'Invalid email or password.'}), users.session);
    
    //Process the SignUp form
    app.post('/users/create', users.create);

    //Process logout
    app.get('/logout', users.logout);

/*
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    
    
        app.get('/users/:userId', users.show);
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin);
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback);
    app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin);
    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback);
    app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin);
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback);
    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/' })); 
*/
}