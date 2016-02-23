var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConfig = require('../config/passport');

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
	successRedict : '/profile'
	, failureRedirect : '/login'
	, failureFlash : true
}));

router.get('/profile', function(req, res, next){
	//res.json(req);
	console.log(req.user);

	//console.log(req.user.toString())
	User.findOne({_id: req.user._id}, function(err, user){
		if(err) return next(err);
		//기본 ejs 형식으로 두번째에 오브젝트로 페이지에서 필요한 모델을 전달한다.
		res.render('accounts/profile', {user: user});
	});
});


router.get('/signup', function(req, res, next){
	res.render('accounts/signup', {
		errors: req.flash('errors')
	});
});

router.post('/signup', function(req, res, next){
	var user = new User();
	user.profile.name = req.body.name;
	user.email = req.body.email;
	user.password = req.body.password;
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
				return res.redirect('/profile');
			});
		}
	});
});

router.get('/logout', function(req, res, next){
	req.logout();
	res.redirect('/');
});

module.exports = router;