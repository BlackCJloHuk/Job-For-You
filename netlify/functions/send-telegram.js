exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Parse JSON from the request body
    const { name, phone, position, message } = JSON.parse(event.body);

    const text = `📝 Новая анкета:
👤 Имя: ${name}
📞 Телефон: ${phone}
📌 Должность: ${position}
🗒️ Инфо: ${message}`;

    // Built-in fetch (Node 18+)
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
        }),
      }
    );

    const data = await telegramResponse.json();

    // If Telegram returned an error
    if (!telegramResponse.ok) {
      console.error("Telegram error:", data);
      return { statusCode: 500, body: JSON.stringify({ error: data }) };
    }

    // Success
    return { statusCode: 200, body: JSON.stringify({ ok: true, data }) };
  } catch (err) {
    console.error("Function error:", err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
