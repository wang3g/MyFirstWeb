
var mongoose = require('mongoose')
  , User = mongoose.model('User');

/*
 * GET inital login and signup view.
 */

exports.loginOrSignup = function(req, res){
  res.render('users/loginOrSignup', {user: new User()});
};

/**
 * Logout
 * Passport exposes a logout() function on req (also aliased as logOut()) that can be called 
 * from any route handler which needs to terminate a login session. Invoking logout() will 
 * remove the req.user property and clear the login session (if any).
 */
exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
}

/**
 * Create user
 */

exports.create = function (req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';

  User
    .findOne({ email: newUser.email })
    .exec(function(err, user){
      if(err) {
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
            if (err) { return next(err);}
           // {return res.redirect('/users' + req.user.id);}
           return res.redirect('/');
          })     
        });
      } else {
        return res.render('users/loginOrSignup', 
        	              { errors: [{"message":"email already registered"}], user:newUser });
      }
    });
}

exports.session = function (req, res) {
  res.redirect('/');
}