const config = require('./config.json');
const eris = require('eris');
const bot = new eris.Client(config.token);
const commands = require('./index.js');


bot.on('ready', () => {

    console.log('Connected');

});

bot.on("messageCreate", (msg) => {

    if(msg.content.includes(config.prefix)) {

        if(msg.content.includes("play")) {

            commands.addQueue(msg, bot);

        }

        if(msg.content.includes("skip")) {

            commands.skip(msg, bot);

        }

        if(msg.content.includes("queue")) {

            commands.listQueue(msg, bot);

        }

    }

});



bot.connect();