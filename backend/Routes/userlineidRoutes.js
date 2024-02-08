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
            if (messageText.toLowerCase().startsWith('lineid ')) {
                const lineId = messageText.substring(7); // ตัดคำว่า "lineid" ทิ้ง เพื่อเก็บข้อมูลที่เหลือ
                // เพิ่มข้อมูล Line ID ลงในฐานข้อมูล เช่น MongoDB
                await addOrUpdateLineIdToDatabase(userId, lineId);

                await client.replyMessage(event.replyToken, [
                    {
                        type: 'text',
                        text: `Line ID: ${lineId} ถูกบันทึกเรียบร้อย`,
                    },
                    {
                        type: 'text',
                        text: 'หากต้องการแก้ไข ท่านสามารถพิมพ์\n"lineid ตามด้วยไลน์ไอดีของคุณ" อีกครั้งค่ะ\nเช่น lineid somchai1234',
                    }
                ]);
            }
        }
    }
    res.sendStatus(200);
});

// ฟังก์ชันสำหรับการเพิ่มข้อมูล Line ID ลงในฐานข้อมูล
async function addOrUpdateLineIdToDatabase(userId, lineId) {
    try {
        // ตรวจสอบว่า userId นี้มีอยู่ในฐานข้อมูลหรือไม่
        const existingUser = await UserLineId.findOne({ userId: userId });

        if (existingUser) {
            // ถ้า userId มีอยู่แล้วในฐานข้อมูล ให้ทำการอัปเดต lineIdData
            const updatedResult = await UserLineId.updateOne(
                { userId: userId },
                { $set: { lineId: lineId } }
            );
            console.log('Line ID updated in MongoDB:', updatedResult.modifiedCount);
        } else {
            // ถ้า userId ยังไม่มีอยู่ในฐานข้อมูล ให้ทำการเพิ่ม userId และ lineIdData
            const newUserLineId = await UserLineId.create({
                userId,
                lineId,
            });
        }
    } catch (error) {
        console.error('Error adding/updating Line ID to MongoDB:', error);
        throw error;
    }
}

router.get('/', async (req, res) => {
    try {
        const customers = await UserLineId.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error loading UserLineId data', error });
    }
});

module.exports = router;