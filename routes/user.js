var router = require('express').Router();
var User = require('../models/user');

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

module.exports = router;