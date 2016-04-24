var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var secret = require('../config/secret');

//Add this for fb login users
var Cart = require('../models/cart');
var async = require('async');

//serialize and deserialize
//session에 담기 위해 사용자의 ID 직렬화함
passport.serializeUser(function(user, done){
	//_id 는 MondoDB 에서 제공되는 default ID
	// 꼭 몽고디비의 아이디가 올 필요는 없고 키가 되는 데이타이면 오케이 user.name
	console.log(user._id);
	done(null, user._id);
});

//session 에서 호출이 있을 때, 사용자 정보를 복원 
passport.deserializeUser(function(id, done){
	//findById 는 mongoose 에서 제공되는 기본 function
	User.findById(id, function(err, user){
		done(err, user);
	});
});


//middleware
passport.use('local-login', new LocalStrategy({
	usernameField : 'email'
	, passwordField : 'password'
	, passReqToCallback : true
}, function(req, email, password, done){
	User.findOne({email : email}, function(err, user){
		if(err) return done(err);

		//console.log(req);
		//console.log(email);
		//console.log(password);

		if(!user) return done(null, false, req.flash('loginMessage', 'No user has been found'));

		//comparePassword 는 user.js 안에 선언되어 있는 function 임
		if(!user.comparePassword(password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password pal'));

		//여기서 전달하는 user 오브젝트가 세션에 저장되서 나중에 req.user.* 로 user 오브젝트에 접근할 수 있음 
		return done(null, user);
	});
}));

passport.use(new FacebookStrategy(secret.facebook, function(token, refreshToken, profile, done){
	User.findOne({ facebook : profile.id }, function(err, user){
		if(err) return done(err);
		if(user){
			return done(null, user);
		} else {
			async.waterfall([

				function(callback){
					//first time with fb
					var newUser = new User();
					newUser.email = profile._json.email;
					newUser.facebook = profile.id;
					newUser.tokens.push({kind : 'faceboock', token : token});
					newUser.profile.name = profile.displayName;
					newUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';	//large,medium,small

					newUser.save(function(err){
						if(err) return done(err);
						//sending 2 paramters 
						callback(err, newUser);
					});
				}

				, function(newUser){
					//recieve one parameter?
					var cart = new Cart();
					cart.owner = newUser._id;
					cart.save(function(err){
						if(err) return done(err);
						return done(null, newUser);
					});

				}
			], function(err){
				//Error handling function provieded by async.js
				console.error(err);
			}); 
		}
	});
}));

//custom validation
exports.isAuthenticated = function(req, res, next){
	//바로 콜백 next() 를 하고 마치지 않고  return  하는 이유는 접근하는 쪽에서 풀 엑세스를 허용하기 위함.
	if(req.isAuthenticated()) return next();
	res.redirect('/login');
}