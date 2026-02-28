exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, phone, position, message } = JSON.parse(event.body);

    // Определяем тип формы по набору полей
    // Если есть поле 'company' или 'vacancy', можно добавить для работодателя
    // Для примера: если message содержит "компания" или "вакансия", считаем работодателем
    const formType = message && message.toLowerCase().includes("вакансия") ? "employer" : "candidate";

    const text = `📝 Новая анкета:
🧾 Тип формы: ${formType === "candidate" ? "Кандидат" : "Работодатель"}
👤 Имя: ${name}
📞 Телефон: ${phone}
📌 Должность: ${position}
🗒️ Инфо: ${message || "—"}`;

    // Отправка в Telegram
    const response = await fetch(
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

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
