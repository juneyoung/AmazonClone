var router = require('express').Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var passport = require('passport');
var passportConfig = require('../config/passport');
var async = require('async');

// ----- legacy code
/*
router.post('/signup', function(req, res, next){
	var user = new User();
	user.profile.name = req.body.name;
	user.password = req.body.password;
	user.email = req.body.email;

	user.save(function(err){
		if(err) return next(err);
		res.json('SUCCESS');
	});
});
*/

router.get('/login', function(req, res, next){
	// res.redirect 와  return res.redirect 의 차이는??
	if(req.user) return res.redirect('/');
	//flash 에서 loginMessage 는 키로 passport.js 의 flash 를 참조함.
	res.render('accounts/login', {message : req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect : '/profile'
	, failureRedirect : '/login'
	, failureFlash : true
}));

router.get('/profile', passportConfig.isAuthenticated, function(req, res, next){
	//사용자를 찾아서 사용자가 히스토리에 가진 아이템을 조인해서 정보를 가져옴
	User.findOne({ _id : req.user._id})
	.populate('history.item')
	.exec(function(err, foundUser){
		if(err) return next(err);
		res.render('accounts/profile',  {user: foundUser});
	})

	/* Updated on 0417 lecture 86
	User.findOne({_id: req.user._id}, function(err, user){
		if(err) return next(err);
		//기본 ejs 형식으로 두번째에 오브젝트로 페이지에서 필요한 모델을 전달한다.
		res.render('accounts/profile', {user: user});
	});
	*/
});


router.get('/signup', function(req, res, next){
	res.render('accounts/signup', {
		errors: req.flash('errors')
	});
});

router.post('/signup', function(req, res, next){

	console.log('This is signup Post');

	async.waterfall([
		function (callback){
			console.log('This is waterfall1');
			var user = new User();
			user.profile.name = req.body.name;
			user.email = req.body.email;
			user.password = req.body.password;
			user.profile.picture = user.gravatar();
			console.log(user);

			//mongoose method
			User.findOne({email : req.body.email}, function(err, existingUser){
				if(existingUser) {
					req.flash('errors', req.body.email + ' is already exist');
					//console.log(req.body.email + ' is already exist');
					return res.redirect('/signup');
				} else {
					user.save(function(err, user){
						if(err) return next(err);
						callback(null, user);		
					});
				}
			});
		}
		, function (user) {
			console.log('This is waterfall2');
			var cart = new Cart();
			cart.owner = user._id;
			cart.save(function(err){
				if(err) return next(err);
				req.logIn(user, function(err){
					if(err) return next(err);
					res.redirect('/profile');
				});
			});
		}
	]);


	/*
	var user = new User();
	user.profile.name = req.body.name;
	user.email = req.body.email;
	user.password = req.body.password;
	user.profile.picture = user.gravatar();
	console.log(user);

	//mongoose method
	User.findOne({email : req.body.email}, function(err, existingUser){
		if(existingUser) {
			req.flash('errors', req.body.email + ' is already exist');
			//console.log(req.body.email + ' is already exist');
			return res.redirect('/signup');
		} else {
			user.save(function(err, user){
				if(err) return next(err);
				//res.json("New user has been created");
				//return res.redirect('/profile');

				//user is on cookie & session


				//removed in lecture 49 (Cart part)
				//req.logIn(user, function(err){
				//	if(err) return next(err);
				//	res.redirect('/profile');
				//});		
			});
		}
	});
	*/
});

router.get('/logout', function(req, res, next){
	req.logout();
	res.redirect('/');
});


router.get('/edit-profile', function(req, res, next){
	res.render('accounts/edit-profile', {message : req.flash('success')});
});

router.post('/edit-profile', function(req, res, next){
	User.findOne({_id : req.user._id}, function(err, user){
		//Error handling
		//name, address
		//save then return to profile page
		if(err) return next(err);

		if(req.body.name) user.profile.name = req.body.name;
		if(req.body.address) user.address = req.body.address;

		user.save(function(err){
			if(err) return next(err);
			req.flash('success', 'User information successfully edited');
			return res.redirect('/edit-profile');
		});

	})
	//res.render('views/accounts/edit-profile.ejs', {message : req.flash('success')});

});

//scope is what information dev wanted, in this case, we want to retrieve email from fb.
router.get('/auth/facebook', passport.authenticate('facebook', {scope : 'email'}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect : '/profile'
	, failureRedirect : '/login'

}));

module.exports = router;