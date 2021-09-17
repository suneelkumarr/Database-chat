const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
     name:{
        type:String
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
    room: {
        type: Schema.Types.ObjectId,
        ref: "room",
      },

})

const user = mongoose.model('user',userSchema)

module.exports= user