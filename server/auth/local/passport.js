var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (Usuario, config) {

  passport.use(new LocalStrategy({
      usernameField: 'login',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(login, password, done) {
      Usuario.findOne({
        where: {
          login: login.toLowerCase()
        }
      }).then(function(usuario){

        if(!usuario){
          return done(null, false, { message: "This user is not registered."})
        }
        if(!usuario.autenticar(password)){
          return done(null, false, { message: 'Password is not correct.' });
        }
        return done(null, usuario);

      }).catch(function(error){
        done(error);
      })
    }
  ));

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    Usuario.findById(id).then(function(usuario){
      done(null, usuario);
    });
  })

};