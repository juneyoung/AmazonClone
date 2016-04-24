module.exports = {
	//database : 'mongodb://admin:1234@ds061335.mongolab.com:61335/simplesample'
	database : 'mongodb://admin:1234@127.0.0.1:27017/simplesample'
	, port : 3000
	, secretKey : 'secret'
	, facebook : {
		clientID : process.env.FACEBOOK_ID || '1092516734139732'
		, clientSecret : process.env.FACEBOOK_SECRET || 'c3d9e4b37a27714ccf5cf95c9517aa4b'
		, profileFields : ['emails', 'displayName']
		, callbackURL : 'http://localhost:3000/auth/facebook/callback'

	}
}

// `process.env` is a global object which provided by node.js 
// OAuth is athetification protocol
// profileFields, why 'emails'? 