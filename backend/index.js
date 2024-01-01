const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require('bcryptjs');
const userModel = require('./models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const { SECRET_KEY } = process.env;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// การเชื่อมต่อฐานข้อมูล MongoDB
mongoose.connect("mongodb+srv://zulfa:Zulfa1234@cluster0.6xnlkvm.mongodb.net/AutoService", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// สร้างคีย์สำหรับรหัสลับ
const secretKey = process.env.SECRET_KEY;

// เส้นทางสำหรับเข้าสู่ระบบ
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    userModel.findOne({ username: username })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
                    }
                    else if (isMatch) {
                        const token = jwt.sign({ username: user.username }, secretKey);
                        // res.cookie("token", token, {
                        //     httpOnly: true,
                        //     sameSite: 'strict',
                        //     maxAge: 24 * 60 * 60 * 1000, 
                        // });
                        res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", token });
                    }
                    else {
                        res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
                    }
                });
            }
            else {
                res.status(404).json({ message: "ไม่พบบัญชีผู้ใช้งาน" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
        });
});
app.post('/register', (req, res) => {
    const { 
        username, 
        password,
        // role 
    } = req.body;
    if (password.length < 8) {
        res.status(400).json({ message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัว" })
    }
    else {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                res.status(500).json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
            }
            else {
                userModel.create({ 
                    username, 
                    password: hashedPassword, 
                    // role 
                })
                    .then(user => {
                        res.status(201).json({ message: "ลงทะเบียนผู้ใช้งานสำเร็จ" });
                    })
                    .catch(err => {
                        if (err.errors && err.errors.username && err.errors.username.message) {
                            res.status(400).json({ message: "ชื่อผู้ใช้งานนี้ถูกใช้งานแล้ว" });
                        }
                        else {
                            res.status(500).json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
                        }
                    });
            }
        });
    }
});

// เส้นทางสำหรับตรวจสอบความถูกต้องของ Token
app.post('/verify-token', (req, res) => {
    const { token } = req.body;
    try {
        const decodedToken = jwt.verify(token, secretKey);
        if (decodedToken && decodedToken.username) {
            res.status(200).json({ isValid: true, username: decodedToken.username });
        } else {
            res.status(401).json({ isValid: false });
        }
    } catch (err) {
        res.status(401).json({ isValid: false });
    }
});

// const line = require('@line/bot-sdk');

// // ในส่วนของ middleware หรือส่วนที่ใช้สร้าง client สำหรับการใช้งาน LINE Messaging API
// const config = {
//   channelAccessToken: '1xDrmtbLRDS5XlfTqzXjz0RoFUu0q4xMKsDVkydZGnw/14OfuyATRL7YuSCo62D98ZAW9zAktPBg19o0H3RaBqMCTiEcGTXaLbZeFSGJiD8UNs00rjR0omPFV+fFBggsmLPiqL+kD5DWlORr/Cck9AdB04t89/1O/w1cDnyilFU=', // ใส่ Channel Access Token ของคุณที่ได้จาก LINE Developers Console
// };
// const client = new line.Client(config);

// app.post('/webhook', (req, res) => {
//     const events = req.body.events;
//     events.forEach(async event => {
//       if (event.type === 'message' && event.message.type === 'text') {
//         const userId = event.source.userId;
//         const messageText = event.message.text; // ดึงข้อความที่ถูกส่งมา
        
//         try {
//           const userProfile = await client.getProfile(userId); // ขอข้อมูลโปรไฟล์ผู้ใช้จาก LINE
//           const displayName = userProfile.displayName;
//           console.log('User ID:', userId);
//           console.log('Display Name:', displayName);
//           console.log('Message Text:', messageText);
//         } catch (error) {
//           console.error('Error fetching profile:', error);
//         }
//       }
//     });
//     res.sendStatus(200);
//   });
  

// กำหนดเส้นทาง API ของระบบ
const authRoutes = require('./Routes/AuthRoute');
app.use('/', authRoutes);

const employeeRoutes = require('./Routes/employeeRoutes');
app.use('/employees', employeeRoutes);

const spareRoutes = require('./Routes/spareRoutes');
app.use('/spares', spareRoutes);

const serviceRoutes = require('./Routes/serviceRoutes');
app.use('/services', serviceRoutes);

const brandmodelRoutes = require('./Routes/brandmodelRoutes');
app.use('/brandmodels', brandmodelRoutes);

const colorRoutes = require('./Routes/colorRoutes');
app.use('/colors', colorRoutes);

const repairRoutes = require('./Routes/repairRoutes');
app.use('/repairs', repairRoutes);

const userlineidRoutes = require('./Routes/userlineidRoutes');
app.use('/webhook', userlineidRoutes);

// กำหนดพอร์ตที่ใช้รัน Backend
const port = process.env.PORT || 3001;

app.listen(3001, () => {
    console.log("server is running");
});
