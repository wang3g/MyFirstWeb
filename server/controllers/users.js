
var mongoose = require('mongoose')
  , User = mongoose.model('User')


/*
 * GET inital login and signup view.
 */

exports.loginOrSignup = function(req, res){
  res.render('users/loginOrSignup', {user: new User(), loginMessage: req.flash('message')});
};

/**
 * Logout
 * Passport exposes a logout() function on req (also aliased as logOut()) that can be called 
 * from any route handler which needs to terminate a login session. Invoking logout() will 
 * remove the req.user property and clear the login session (if any).
 */
var clearSession = function(session, callback){
  session.destroy();
  callback();
};

exports.logout = function (req, res) {
  req.logout();
 // session.destroy();
 // res.redirect('/');
  clearSession(req.session, function () {
    res.redirect('/');
  });
}

/**
 * Create user
 */

exports.create = function (req, res) {
  var newUser = new User(req.body);
   
   //Below is from express-validator.js, but not working.
   //req.checkBody('email', 'Invalid email').isEmail();

  newUser.provider = 'local';

  // Use lower-case e-mails to avoid case-sensitive e-mail matching
  if (newUser.email) {
    newUser.email = newUser.email.toLowerCase(); 
  }

  User
    .findOne({ email: newUser.email })
    .exec(function(err, user){
      if(err) {
        console.log(err);
      	return next(err);
      }
      if(!user){
        newUser.save(function(err){
          if (err) {  
          	console.log(err); 
          	return res.render('users/loginOrSignup', 
          		              { errors: err.errors, user: newUser}); 
          } 
/*
Passport exposes a login() function on req (also aliased as logIn()) 
that can be used to establish a login session. This function is primarily 
used when users sign up, during which req.login() can be invoked to 
automatically log in the newly registered user.
*/
          req.logIn(newUser, function(err) {
            if (err) { 
              return next(err);
            }
            
            // add following info into session.
            req.session.user = {'email': newUser.email, 'name': newUser.name, '_id': newUser._id};
            req.session.loggedIn = true;

            // If login succeed, redirect to /users/:userId page.
           return res.redirect('/users/' + req.user.id);
          //  return res.redirect('/');
          })     
        })
      } else {
        return res.render('users/loginOrSignup', 
        	              { errors: [{"message":"email already registered"}], user:newUser });
      }
    });
}

exports.show = function (req, res) {
  var temp = req.params.userId;
  console.log("show " + temp)
  res.render('users/show', {userName: req.session.user.name, req: req});
};

/**
 * Session
 */

exports.session = function (req, res) {
  var userId = req.session.user._id;
  console.log('session '+userId)
  res.redirect('/users/' + userId);
}