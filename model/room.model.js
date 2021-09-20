const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    participants: {
        type: [],
        required: false,
        unique: false
      },
      name: {
        type: String,
        required: true
      }
})


roomSchema.statics.addConversation = (room, callback) => {
    room.save(callback);
  };
  
  roomSchema.statics.getConversations = (callback) => {
    room.find({}, callback);
  };
  
  roomSchema.statics.getChatRoom = (callback) => {
    room.findOne({name: "chat-room"}, (err, room) => {
      if (err || room == null) {
        let chatRoom = new room({name: "chat-room"});
        room.addroom(chatRoom, (err, conv) => {
          if (err) return callback("There was an error on getting the conversation");
          return callback(null, conv);
        });
      } else {
        Message.getMessagesByConv(room._id, (err, messages) => {
          if (err) {
            let error = "There was an error on getting messages";
            return callback(error);
          } else {
            let roomObj = extend({}, room);
            roomObj.messages = messages;
            return callback(null, roomObj);
          }
        });
      }
    });
  };
  
  roomSchema.statics.getroomByName = (participant1, participant2, callback) => {
    let combo1 = "" + participant1 + "-" + participant2;
    let combo2 = "" + participant2 + "-" + participant1;
  
    room.findOne({name: combo1}, (err, room1) => {
      if (err || room1 == null) {
        room.findOne({name: combo2}, (err, room2) => {
          if (err || room2 == null) {
            User.getUserByUsername(participant1, (err1, user1) => {
              if (err1 || user1 == null) {
                return callback("The user could not be found");
              }
              User.getUserByUsername(participant2, (err2, user2) => {
                if (err2 || user2 == null) {
                  return callback("The user could not be found");
                }
                let mihai1 = {
                  username: user1.username,
                  id: user1._id
                };
                let mihai2 = {
                  username: user2.username,
                  id: user2._id
                };
                let participants = [mihai1, mihai2];
                let newConv = new room({
                  participants: participants,
                  name: "" + mihai1.username + "-" + mihai2.username
                });
  
                room.addroom(newConv, (err, addedConv) => {
                  if (err) {
                    console.log(err);
                    let error = "There was an error on getting the conversation";
                    return callback(error);
                  } else {
                    return callback(null, addedConv);
                  }
                });
              });
            });
          } else {
            Message.getMessagesByConv(room2._id, (err, messages) => {
              if (err) {
                let error = "There was an error on getting messages";
                return callback(error);
              } else {
                let roomObj = extend({}, room2);
                roomObj.messages = messages;
                return callback(null, roomObj);
              }
            });
          }
        });
      }
  
      else {
        Message.getMessagesByConv(room._id, (err, messages) => {
          if (err) {
            let error = "There was an error on getting messages";
            return callback(error);
          } else {
            let roomObj = extend({}, room1);
            roomObj.messages = messages;
            return callback(null, roomObj);
          }
        });
      }
    });
  };
  

const room = mongoose.model('room', roomSchema)

module.exports= room