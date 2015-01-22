var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: { type: String },
  loginname: { type: String },
  pass: { type: String },
  email: { type: String },
  is_block: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  is_admin: { type: Boolean, default: false }
});

UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});

mongoose.model('User', UserSchema);