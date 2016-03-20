# AmazonClone
Lectured on Udemy from 16


https://www.udemy.com/build-an-amazon-clone-nodejs-stripe-elasticsearch


### What I have learned
- Need MongoDB and elasticSearch to able to run this project.
- It will print an error if you use node version under 4, when using moongoosastic
- Can update node.js version via `nvm`, however when command have to drop `v`, i.e. `nvm install 5.7.1`.
- It will not running if you have several function with same signiture in `{router}.js` file.
- ejs : importing layout with `<% layout('layout') -%>`. do not drop `-`.
- mongoose supports pagination like `{ModelObject}.skip(page*perPage).limit(perPage).populate('{MongooseObjectName}').exec(function(err, {models}){ /* Do something ... */ })`
- get total count via mongoose like `{ModelObject}.count().exec(function(err, count){/* Do something ... */})`
