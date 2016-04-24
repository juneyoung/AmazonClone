var mongoose = require('mongoose');
// Hashing PW
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
//built-in library
var crypto = require('crypto');

// User

var UserSchema = new Schema({
	email : {type : String , unique : true, lowercase : true}
	, password : String
	, profile : {
		name : {type : String , default : ''}
		, picture : {type : String, default : ''}
	}
	, address : String
	, history : [{
		//date : Date
		paid : {type : Number, default : 0}
		, item : {type : Schema.Types.ObjectId, ref : 'Product'}
	}]
	, facebook : String
	, tokens : Array	
});


// Hashing process
UserSchema.pre('save', function(next){
	//이 this 가  function 이 아니라 UserSchema 라고?
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(10, function(err, salt){
		if(err) return next(err);
		// 3rd 파라미터는 해시 과정을 보여주는 출력 프로세서 
		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// UserSchema.pre('save', function(next){
// 	var user = this;

// });

// Comparing PW
// methods 이후에 사용자 커스텀 펑션 추가
UserSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.gravatar = function(size){
	if(!this.size) size = 200;
	if(!this.email) return 'https://gravatar.com/avatar?s=' + size + '&d=retro';
	var md5 = crypto.createHash('md5').update(this.email).digest('hex');
	return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}

module.exports = mongoose.model('User', UserSchema);
