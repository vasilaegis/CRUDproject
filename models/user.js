var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    
      name: {type: String,  trim: true, maxlength: 100},
      email: {type: String, required: true, trim: true, unique: true, maxlength: 100},
      date: {type: Date, default: Date.now},
      number: {type: Number,  trim: true},
      gender: {type: String,  trim: true, maxlength: 100},
      stream : {type: String,  trim: true, maxlength: 100},
      file : {type: String , default : "public/uploads/default.jpg"}

  })

module.exports = mongoose.model('user', UserSchema);
