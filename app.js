const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5594141025:AAEKl-6qlwCh4C9N26t061wbJQHso4J9lTM';

// Create a bot that uses 'polling' to fetch new updates f
const bot = new TelegramBot(token, {polling: true});



bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
    bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/9a3/cd3/9a3cd35f-d28d-4473-890b-2cfef53d3de9/256/1.webp')
    bot.sendMessage(chatId, 'Барев дзес , дорогой! Выбирай нужную валюту и смотри актуальный на нее курс!');
})

bot.onText(/\/curse/, (msg, match) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Выберите какая валюта вас интересует?", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "€ - EUR",
            callback_data: "EUR"
          },
          {
            text: "$ - USD",
            callback_data: "USD"
          },
          {
            text: "₿ - BTC",
            callback_data: "BTC"
          }
        ]
      ]
    }
  });
});


bot.on('callback_query', query => {
  const id = query.message.chat.id;

  request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function (error, response, body) {
    const data = JSON.parse(body);
    const result = data.filter(item => item.ccy === query.data)[0];
    const flags = {
      'EUR': '🇪🇺',
      'USD': '🇺🇸',
      'UAH': '🇺🇦',
      'BTC': '₿'
    }

    let md = `
    *${flags[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${flags[result.base_ccy]}*
    Покупка: _${result.buy}_
    Продажа: _${result.sale}_
    `;

    bot.sendMessage(id, md, {parse_mode: 'Markdown'});
  })
})
