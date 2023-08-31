const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type:String, enum: ['employee', 'boss'], default: 'employee'}
})

userSchema.plugin(uniqueValidator)
const userModel = mongoose.model("User", userSchema)
module.exports = userModel