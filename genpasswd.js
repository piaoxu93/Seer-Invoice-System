var bcrypt = require('bcrypt');

bcrypt.hash('passwd',12,function(err, hash){
  console.log(hash);
});
