const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./options')

const token = '6049120471:AAHbXoewmoNnEI4oOksO7_tzHVkPW-Acnt4'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

bot.setMyCommands([
    {command: '/star', description: 'Приветсвие'},
    {command: '/info', description: 'Информация о пользователе'},
    {command: '/game', description: 'Игра "Отгадай число"'}
])


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадываю число от 0 до 9, а ты попробуй отгадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Начали!', gameOptions)
}

const start = ()  => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/711/2ce/7112ce51-3cc1-42ca-8de7-62e7525dc332/3.webp')
            return bot.sendMessage(chatId, `Привет, я первый бот Killa.66`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Привет, ${msg.from.first_name}`);
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Такой команды у меня нет')
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, 'Ура! Ты угадал!', againOptions)
        } else {
            return bot.sendMessage(chatId, ` Хуила тупая(Кирилл гандон и лох), я загадывал ${chats[chatId]}`, againOptions)
        }
    })
}

start()