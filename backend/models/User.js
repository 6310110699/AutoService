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





// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: { type:String, enum: ['employee', 'boss'], default: 'employee'}
// });

// userSchema.plugin(uniqueValidator)

// const userModel = mongoose.model('User', userSchema);

// module.exports = userModel;




// const express = require("express")
// const mongoose = require('mongoose')
// const cors = require("cors")
// const bcrypt = require('bcryptjs');
// const userModel = require('./models/User')
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const app = express()
// app.use(express.json())
// app.use(cors())

// mongoose.connect("mongodb://127.0.0.1:27017/AutoService");

// const secretKey = process.env.SECRET_KEY;

// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     userModel.findOne({ username: username })
//         .then(user => {
//             if (user) {
//                 bcrypt.compare(password, user.password, (err, isMatch) => {
//                     if (err) {
//                         res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
//                     }
//                     else if (isMatch) {
//                         const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
//                         res.json({ token });
//                     }
//                     else {
//                         res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
//                     }
//                 });
//             }
//             else {
//                 res.status(404).json({ message: "ไม่พบบัญชีผู้ใช้งาน" });
//             }
//         })
//         .catch(err => {
//             res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
//         });
// });

// app.post('/register', (req, res) => {
//     const { username, password, role } = req.body;
//     if (password.length < 8) {
//         res.status(400).json({ message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัว" })
//     }
//     else {
//         bcrypt.hash(password, 10, (err, hashedPassword) => {
//             if (err) {
//                 res.status(500).json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
//             }
//             else {
//                 userModel.create({ username, password: hashedPassword, role })
//                     .then(user => {
//                         res.status(201).json({ message: "ลงทะเบียนผู้ใช้งานสำเร็จ" });
//                     })
//                     .catch(err => {
//                         if (err.errors && err.errors.username && err.errors.username.message) {
//                             res.status(400).json({ message: "ชื่อผู้ใช้งานนี้ถูกใช้งานแล้ว" });
//                         }
//                         else {
//                             res.status(500).json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
//                         }
//                     });
//             }
//         });
//     }
// });

// app.listen(3001, () => {
//     console.log("server is running")
// })