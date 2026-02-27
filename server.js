const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());
// Allow cross-origin requests so browser pages served from Live Server can call this API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    return res.sendStatus(200);
  }
  next();
});
app.use(express.static('.')); // Раздаём HTML, CSS, JS из текущей папки

app.post('/api/send-telegram', async (req, res) => {
  const { name, phone, position, message } = req.body;
  const text = `📝 Новая анкета:\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📌 Должность: ${position}\n🗒️ Инфо: ${message}`;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text })
    });
    
    const data = await response.json();
    res.json({ ok: response.ok, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Сервер запущен на http://${BASE_URL}`));
