var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/user');

//http parser
var bodyParser = require('body-parser');

//ejs
var ejs = require('ejs');
//for responsive page
var engine = require('ejs-mate');

var app = express();

mongoose.connect('mongodb://admin:1234@ds061335.mongolab.com:61335/simplesample', function(err){
	if(err) console.log(err);
	console.log('DB connected');
});

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.engine('ejs', engine);
app.set('view engine', 'ejs');


app.get('/', function(req, res){
	//res.json('Hello, node!');
	res.render('home');
});

app.post('/create-user', function(req, res, next){
	var user = new User();
	user.profile.name = req.body.name;
	user.password = req.body.password;
	user.email = req.body.email;

	user.save(function(err){
		if(err) return next(err);
		res.json('SUCCESS');
	});
});

app.listen(3000, function(err){
	if(err) throw err;
	console.log('Server is running');
});