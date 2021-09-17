const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({

})

const user = mongoose.model('user',userSchema)

module.exports= user