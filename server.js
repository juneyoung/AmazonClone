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

//Handle login
var session = require('express-session');
var cookieParser =  require('cookie-parser');
var flash = require('express-flash');


var app = express();

mongoose.connect('mongodb://admin:1234@ds061335.mongolab.com:61335/simplesample', function(err){
	if(err) console.log(err);
	console.log('DB connected');
});

//Middleware
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(cookieParser());
app.use(session({
	resave : true
	, saveUninitialized : true
	, secret : "secret"
}));
app.use(flash());


app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


app.listen(3000, function(err){
	if(err) throw err;
	console.log('Server is running');
});