const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcryptjs = require("bcryptjs");

const userSchema = new Schema({
     name:{
        type:String
     },
     username:{
      type:String,
      unique:true, 
      required:true,
     },
     email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: "Email address is required",
        validate: {
          validator: function (v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
          },
          message: "Please enter a valid email",
        },
     },
     password:{
       type:String,
     },
    room: {
        type: Schema.Types.ObjectId,
        ref: "room",
      },  

})

userSchema.statics.getUserById = function(id, callback) {
  User.findById(id, callback);
}

userSchema.statics.getUserByUsername = function(username, callback) {
  let query = {username: username};
  User.findOne(query, callback);
}

userSchema.statics.getUsers = () => {
  return User.find({}, '-password');
}

userSchema.statics.addUser = function(newUser, callback) {
  User.getUserByUsername(newUser.username, (err, user) => {
    if (err) return callback({msg: "There was an error on getting the user"});
    if (user) {
      let error = {msg: "Username is already in use"};
      return callback(error);
    } else {
      bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (err, hash) => {
          if (err) return callback({msg: "There was an error registering the new user"});

          newUser.password = hash;
          newUser.save(callback);
        });
      });
    }
  });
};

userSchema.statics.authenticate = function(username, password, callback) {
  User.getUserByUsername(username, (err, user) => {
    if (err) return callback({msg: "There was an error on getting the user"});
    if (!user) {
      let error = {msg: "Wrong username or password"};
      return callback(error);
    } else {
      bcryptjs.compare(password, user.password, (err, result) => {
        if (result == true) {
          return callback(null, user);
        } else {
          let error = {msg: "Wrong username or password"};
          return callback(error);
        }
      });
    }
  });
};




const User = mongoose.model('User',userSchema)

module.exports= User