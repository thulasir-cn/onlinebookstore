var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var session = require('express-session');
var cons = require('consolidate');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var session = require('client-sessions');
var flash = require('connect-flash');
var fs = require('fs'); 
var multer  = require('multer');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
//var GoogleStrategy = require('passport-google').Strategy;



var app = express();
//var admin = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var routes = require('./routes/index');
var users = require('./routes/users');




//for mongodb connection

var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
                    id:ObjectId,
                    firstName:String,
                    lastName:String,
                    username:{type:String,unique: true},
                    password:String,
                    desig :String,
                    phnumber :String,
                    city:String,
                    kart:[],
                    orders:[],
                    facebook:{
                          id:String,
                          Token:String,
                          username:String,
                          name:String
                    }

  
              });

var User = mongoose.model('User' ,UserSchema);

mongoose.connect('mongodb://localhost/newauth');

var BookSchema = new Schema({
        imgUrl :String,
        name :String,
        price:Number,
        rating:Number,
        binding:String,
        publisher:String,
        releaseDate:String
    });

    var Books = mongoose.model('Books' ,BookSchema);

    var FeedbackSchema = new Schema({
      user : String,
      comment : String,
      date : Date
    });
var Feedback = mongoose.model('Feedback' ,FeedbackSchema);

// var mongojs = require('mongojs');
// var db = mongojs('newauth',['user']);

//bootstrap 
app.use(express.static(path.join(__dirname,'bower_components/bootstrap/dist/css')));


// view engine setup
app.engine('html',cons.swig);
  app.set('view engine','html');
  app.set('views',__dirname+"/public");


// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser());
app.use(session({
        cookieName: 'session',
        secret: 'random_string_goes_here',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
        resave: true,
        saveUninitialized: true,
        
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/users', users);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

                 passport.use(new LocalStrategy(

                                      function(username, password, done) {
                                        // return done(null,false,{message:'unable connect'})
                                         User.findOne({ "username": username }, function(err, user) {
                                
                                           
                                              if (err) { return done(err); }
                                           if (!user) {
                                                 return done(null, false,{ message: 'Incorrect username.' } );
                                            }
                                              if (!bcrypt.compareSync(password,user.password)) {
                                                return done(null, false, { message: 'Incorrect password.' });
                                          }
                                            return done(null,user);
                                      
                                    });
                                 }
                ));

              passport.use(new FacebookStrategy({
                                          clientID: "1416189588700121",
                                          clientSecret: "be13c0f026a5e91b1ba5a665e4c07c2a",
                                          callbackURL: "http://localhost:3000/auth/facebook/callback"
                                        },
                                        // function(accessToken, refreshToken, profile, done) {
                                        //   done(null, profile);
                                        //   console.log(profile);
                                        //   console.log(accessToken);
                                        //   // User.findOrCreate(..., function(err, user) {
                                        //   //   if (err) { return done(err); }
                                        //   //   done(null, user);
                                        //   // });
                                        // }
                                        function(accessToken, refreshToken, profile, done) {
                                                User.findOne({ " facebook.id": profile.id }, function(err, user) {
                                                  if (err) { return done(err); }
                                                 if (user){return done(null, user);}
                                                 else{
                                                  var newUser = new User();
                                                  newUser.facebook.id = profile.id;
                                                  newUser.facebook.Token = accessToken;
                                                  newUser.facebook.name = profile.name.givenName+''+profile.name.familyName;
                                                  newUser.facebook.username = profile.emails[0].value;
                                                  newUser.save(function(err){if (err) {return done(err);}
                                                    else{
                                                      return done(null,newUser);
                                                    }
                                                  })
                                                  }
                                                });
                                               }
                                              ));

                                      //   passport.use(new GoogleStrategy({
                                      //         clientID: "1028316706411-pl4u29jerajh256cgtq0pap86m5e8kir.apps.googleusercontent.com",
                                      //         clientSecret: "K0RkQvwijtlV0KLAGUeGRlzn",
                                      //         callbackURL: "http://localhost:3000/auth/google/return"
                                      //       },
                                      //       function(accessToken, refreshToken, profile, done) {
                                      //         console.log(profile);
                                      //       }
                                      // ));

// passport.use('google', new OAuth2Strategy({
//     authorizationURL: 'https://www.google.com/oauth2/authorize',
//     tokenURL: 'https://www.google.com/oauth2/token',
//     clientID: 'q_PAYJtrq-vpcmBV_UL3SqjOV0A',
//     clientSecret: '7nlIV-lbDh0bUgvtGjLnOnUB8yI',
//     callbackURL: 'https://localhost:3000/auth/google/callback'
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log(profile);
//     // User.findOrCreate({}, function(err, user) {
//     //   done(err, user);
//     // });
//   }
// ));



// { id: '809050805851851',
//      email: 'thulasig7@gmail.com',
//      first_name: 'G',
//      gender: 'male',
//      last_name: 'Thulasi Ram',
//      link: 'https://www.facebook.com/app_scoped_user_id/809050805851851/',
//      locale: 'en_US',
//      name: 'G Thulasi Ram',
//      timezone: 5.5,
//      updated_time: '2015-03-11T18:52:05+0000',
//      verified: true }

                                        //gooogle...........
                                          // clientID: "1028316706411-pl4u29jerajh256cgtq0pap86m5e8kir.apps.googleusercontent.com",
                                          // clientSecret: "K0RkQvwijtlV0KLAGUeGRlzn",
                                          // callbackURL: "http://localhost:3000/auth/google/callback"




    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
      
    });
app.post("/login",passport.authenticate('local'),function(req,res){
            //res.json(req.user);
            //console.log(req.body.username)
            //console.log(req.user)

            if (bcrypt.compareSync(req.body.password,req.user.password)) {                                                                                        
                  req.session.user = req.user;
                  res.json(req.user);
                  res.redirect('/profile');
                   
            }
            else{
              res.redirect('/login');
            }                       
  });

// face book..............

app.get('/auth/facebook/callback',passport.authenticate('facebook'),function(req,res){
    res.redirect('/');
    console.log(req.profile);
  });

app.get('/auth/facebook', passport.authenticate('facebook',{ scope : 'email' }));



app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return', passport.authenticate('google', function(req,res){
    console.log('its working');
  }));

                                                 
 var auth = function(req, res, next){ if (!req.isAuthenticated()) res.send(403); else next(); }; 



app.get('/admin/user',auth,function(req,res){
  //console.log(req.body);
        
               User.find({},function(err,user){
                      res.json(user);
                      //console.log(user)
                   });
                
});

// app.get('/profile',function(req,res){
//   res.render('profile');
// })

app.post('/register',function(req,res){

              User.findOne({"username" : req.body.username},function(err,user){
                if (user) {
                  console.log('user alredy exist');
                  res.json(null);
                  return;
                }else{
                  var hash = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
                  var user = {
                                firstName:req.body.firstName ,
                               lastName:req.body.lastName,
                               username:req.body.username,
                               phnumber:req.body.phnumber,
                               city    :req.body.city,
                               password :hash
                          }
                

                var newUser = new User(user);
                console.log(newUser)
                
                    newUser.save(function(err,user){
                            req.login(user,function(err){
                              if (err) {return next(err)};
                                res.json(user);
                            });
                          })
                    }
             });
  
});

app.get('/loggedin',function(req,res){
  res.send(req.isAuthenticated() ? req.user:'0');
});

app.post('/profile',function(req,res){
   
//console.log(req.session.user);
//console.log(req.session)
    //res.render('profile.html')
     if (req.session && req.session.user) {
              //console.log('yes its working');
            User.findOne({username:req.session.user.username},function(err,user){
                //console.log(user);
              if (!user) {
                req.session.reset();
                
              }else{
                //res.locals.user = user;
                //console.log(user);
                //res.json(user);
                res.redirect('/profile');
              }
                        
         })

     }
         else{
            res.render('/login');
    }

});

app.get('/logout',function(req,res){
  req.logOut();
  res.send(200);
  //delete req.session.username;
  //res.redirect('/login');

});

app.get('/edit/:id',function(req,res){
  var id = req.params.id;
  //console.log(id);
      User.findOne({_id:id},function(err,doc){
        ///console.log(doc);
        res.json(doc);
      });
});
app.delete('/delete/:id',function(req,res){
  var id = req.params.id;
  //console.dir(id);
      User.remove({_id:id},function(err,doc){
        res.json(doc);
    })
});


app.put('/update/:id',function(req,res){
  var id = req.params.id;
  console.log(id);
User.update(
        {_id:id},{
                    
                      firstName:req.body.firstName ,
                     lastName:req.body.lastName,
                     username:req.body.username,
                     phnumber:req.body.phnumber,
                     city    :req.body.city
                    
                  }
        ,{ upsert: true },
    function(err,doc){res.json(doc);}
);
});


app.get('/bookslist',function(req,res){
   Books.find({},function(err,user){
                      res.json(user);
                      //console.log(user)
                   });

});

app.post('/kartlist/:id',function(req,res){
    var id = req.params.id;
    // console.log(id);
    // console.log(req.body);
        
        User.update({_id:id},{ $push: {kart:req.body} },
          function(err,doc){
            console.log(doc);
          res.json(doc);
        })
});

app.get('/kartdata/:id',function(req,res){
  var id = req.params.id;
    //console.log(id);
    User.findOne({_id:id},function(err,doc){
       //console.log(doc.kart);
      res.json(doc.kart);
    })

});

app.post('/delkart/:id',function(req,res){
    var id = req.params.id;
    console.log(id);
    console.log(req.body);
        
        User.update({_id:id},{ $pull: {kart:req.body} },
          function(err,doc){
            console.log(doc);
          res.json(doc);
        })
});

app.get('/comments',function(req,res){
  Feedback.find({},function(err,data){
    res.json(data);
  })
})

io.on('connection', function(socket){
  console.log('a user connected');
    socket.on('user',function(user){
              
              socket.on('chat message',function(msg){
                var newComment = new Feedback();
                var newComment = new Feedback({user:user,comment:msg});
                newComment.save(function(err){
                  if (err) {throw err}
                  else{
                    io.emit('from server',{user:user,comment:msg});
                  }

                });

                console.log(user);
                console.log(msg);
              })
          });
    socket.on('disconnect', function(){
        console.log( socket.user + ' has disconnected from the chat.');
        });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});


module.exports = app;                                 
