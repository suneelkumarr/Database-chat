const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    room :{
        type:String,
        user:{
            type:mongoose.Schema.ObjectId,
            ref:'user'
        }
    }
})

const user = mongoose.model('room',roomSchema)

module.exports= user