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





// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const app = express();
// require("dotenv").config();
// const cookieParser = require("cookie-parser");
// const authRoute = require("./Routes/AuthRoute");
// const { PORT } = process.env;

// mongoose
//   .connect("mongodb://127.0.0.1:27017/AutoService", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB is  connected successfully"))
//   .catch((err) => console.error(err)); 

// app.listen(4000, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });

// app.use(
//   cors({
//     origin: ["http://localhost:4000"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );


// app.use(cookieParser());

// app.use(express.json());

// app.use("/", authRoute);





// server.js (หรือไฟล์ใดๆ ที่เป็นไฟล์หลักของ Backend)

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
                        // หากรหัสผ่านถูกต้อง สร้าง Token และส่งกลับไปให้ Client
                        const token = jwt.sign({ username: user.username }, secretKey);
                        res.cookie("token", token, {
                            httpOnly: true,
                            sameSite: 'strict',
                            maxAge: 24 * 60 * 60 * 1000, // 1 วัน (หน่วยเป็นมิลลิวินาที)
                        });
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
    const { username, password, role } = req.body;
    if (password.length < 8) {
        res.status(400).json({ message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัว" })
    }
    else {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                res.status(500).json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
            }
            else {
                userModel.create({ username, password: hashedPassword, role })
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

const repairRoutes = require('./Routes/repairRoutes');
app.use('/repairs', repairRoutes);

// กำหนดพอร์ตที่ใช้รัน Backend
const port = process.env.PORT || 3001;

app.listen(3001, () => {
    console.log("server is running");
});
