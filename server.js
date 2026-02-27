const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

// Parse JSON body
app.use(express.json());

// API route first
app.post('/api/send-telegram', async (req, res) => {
  const { name, phone, position, message } = req.body;

  const text = `📝 Новая анкета:
👤 Имя: ${name}
📞 Телефон: ${phone}
📌 Должность: ${position}
🗒️ Инфо: ${message}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text
        })
      }
    );

    const data = await response.json();
    res.json({ ok: response.ok, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files after routes
app.use(express.static('.'));

// Listen on Railway port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
