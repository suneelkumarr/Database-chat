const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
    created: {
        type: Date,
        required: true
      },
      from: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
       roomId: {
        type: String,
        required: true
      },
      inChatRoom: {
        type: Boolean,
        required: false
      },
})

chatSchema.statics.addMessage = (chat, callback) => {
    chat.save(callback);
  };
  
  chatSchema.statics.getMessages = (callback) => {
    chat.find({}, callback);
  };


chatSchema.statics.getMessagesByConv = (id, callback) => {
    chat.find({roomId: id}, callback);
  };
  
const chat = mongoose.model('chat',chatSchema)

module.exports= chat