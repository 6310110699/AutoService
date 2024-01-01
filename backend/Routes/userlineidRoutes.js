const express = require('express');
const router = express.Router();
const UserLineId = require('../models/UserLineId')
const line = require('@line/bot-sdk');

// ในส่วนของ middleware หรือส่วนที่ใช้สร้าง client สำหรับการใช้งาน LINE Messaging API
const config = {
  channelAccessToken: '1xDrmtbLRDS5XlfTqzXjz0RoFUu0q4xMKsDVkydZGnw/14OfuyATRL7YuSCo62D98ZAW9zAktPBg19o0H3RaBqMCTiEcGTXaLbZeFSGJiD8UNs00rjR0omPFV+fFBggsmLPiqL+kD5DWlORr/Cck9AdB04t89/1O/w1cDnyilFU=', // ใส่ Channel Access Token ของคุณที่ได้จาก LINE Developers Console
};
const client = new line.Client(config);

router.post('/', async (req, res) => {
  const events = req.body.events;
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userId = event.source.userId;
      const messageText = event.message.text;

      // ตรวจสอบว่าข้อความมีคำว่า "lineid" ข้างหน้าหรือไม่
      if (messageText.toLowerCase().startsWith('lineid')) {
        const lineIdData = messageText.substring(7); // ตัดคำว่า "lineid" ทิ้ง เพื่อเก็บข้อมูลที่เหลือ
        // เพิ่มข้อมูล Line ID ลงในฐานข้อมูล เช่น MongoDB
        await addOrUpdateLineIdToDatabase(userId, lineIdData);
      }
    }
  }
  res.sendStatus(200);
});

// ฟังก์ชันสำหรับการเพิ่มข้อมูล Line ID ลงในฐานข้อมูล
async function addOrUpdateLineIdToDatabase(userId, lineIdData) {
    try {
  
      // ตรวจสอบว่า userId นี้มีอยู่ในฐานข้อมูลหรือไม่
      const existingUser = await UserLineId.findOne({ userId: userId });
  
      if (existingUser) {
        // ถ้า userId มีอยู่แล้วในฐานข้อมูล ให้ทำการอัปเดต lineIdData
        const updatedResult = await UserLineId.updateOne(
          { userId: userId },
          { $set: { lineIdData: lineIdData } }
        );
        console.log('Line ID updated in MongoDB:', updatedResult.modifiedCount);
      } else {
        // ถ้า userId ยังไม่มีอยู่ในฐานข้อมูล ให้ทำการเพิ่ม userId และ lineIdData

        const newUserLineId = await UserLineId.create({
            userId,
            lineIdData,
          });
  
          res.status(201).json(newUserLineId);
      }
    } catch (error) {
      console.error('Error adding/updating Line ID to MongoDB:', error);
      throw error;
    }
  }

module.exports = router;