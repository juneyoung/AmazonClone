var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');

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
//var flash = require('connect-flash');

//이렇게 하면 session 을 파싱함// connect-mongo 는 express-session 에 의존 
var MongoStore = require('connect-mongo/es5')(session);


//passportjs.org 에서 제공되는 라이브러리로, 소셜 로그인을 지원함 
var passport = require('passport');


var secret = require('./config/secret.js');
var User = require('./models/user');


var app = express();

mongoose.connect(secret.database, function(err){
	if(err) console.log(err);
	console.log('DB connected');
});

//Middleware
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(cookieParser());
//store 속성을 지정해서 기본으로 메모리에 저장되는 데이터를 Database 에 담을 수 있음 
app.use(session({
	resave : true
	, saveUninitialized : true
	, secret : secret.secretKey
	, store : new MongoStore({url : secret.database, autoReconnect : true})
}));
//이 flash 는 뭐지 0222
app.use(flash());

// 
app.use(passport.initialize());
app.use(passport.session());


//모든 routes 에서 user 오브젝트를 볼 수 있도록 처리 
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});


app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


app.listen(secret.port, function(err){
	if(err) throw err;
	console.log('Server is running');
});