const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // 處理跨域請求
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // 允許前端跨域訪問

// 配置 SMTP 連接（使用 Gandi 參數）
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // mail.gandi.net
  port: process.env.SMTP_PORT, // 465 或 587
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER, // 你的 Gandi 郵箱地址
    pass: process.env.SMTP_PASSWORD // 郵箱密碼
  }
});

// 處理表單提交
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 發送郵件（HTML 格式）
    await transporter.sendMail({
      from: `"網站聯絡表單" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL, // 管理員郵箱
      subject: `新訊息來自 ${name}`,
      html: `
        <h2>聯絡表單通知</h2>
        <p><strong>姓名:</strong> ${name}</p>
        <p><strong>郵件:</strong> ${email}</p>
        <p><strong>訊息內容:</strong></p>
        <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('郵件發送錯誤:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 監聽端口（Render 會自動設置 PORT）
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});