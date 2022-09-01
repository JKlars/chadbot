const ytdl = require('ytdl-core');
const yts = require('youtube-search-without-api-key');
const queue = [];
const options = {

    quality: "audiohighest",
    filter: "audioonly",

}

let timer = null;



class Commands {

    static addQueue(msg, bot) {

        try {

            let key = msg.content.substring(6);
            let channelId = msg.member.voiceState.channelID;

            if(key == undefined) throw "Please enter a keyword";
            if(channelId == undefined) throw "Please enter a channel";
            if(queue.length >= 1) {

                msg.channel.createMessage("Your audio has been added to the queue.");
                yts.search(key).then(details => {

                    queue.push(details[0]);

                });

            }

            else {

                yts.search(key).then(details => {

                    queue.push(details[0]);
                    this.play(channelId, msg, bot);

                })

            }

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong: " + err);

        }

    }

    static play(channelId, msg, bot) {

        try{

            let duration_raw = queue[0].duration_raw;
            let durationSplit = duration_raw.split(':');
            let durationMinute = parseInt(durationSplit[0]) * 60;
            let durationSecond = parseInt(durationSplit[1]);
            let duration = 1000 * (durationMinute + durationSecond);
            let durationTotal = duration + 2000;

            msg.channel.createMessage("Now playing: " + queue[0].url);
            bot.joinVoiceChannel(channelId).then(connection => {

                connection.play(ytdl(queue[0].url), options);
                timer = setTimeout(() =>{

                    queue.shift();

                    if(queue.length < 1) {

                        bot.leaveVoiceChannel(channelId);

                    }

                    else {

                        this.play(channelId, msg, bot);

                    }

                }, durationTotal);

            })      

        }

        catch(err) {

            console.log(err)
            msg.channel.createMessage("Something went wrong!" + err);

        }

    }

    static listQueue(msg) {

        try {

            if(queue.length < 1) throw "There is currently nothing in the queue";

            for(var i = 0; i < queue.length; i++) {

                msg.channel.createMessage(i + 1 + ")" + queue[i].title);

            }

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong! " + err);

        }

    }

    static skip(msg, bot) {

        try {

            let channelId = msg.member.voiceState.channelID;
            let connection = bot.voiceConnections.find(item => item.channelID == channelId);

            if(channelId == undefined) throw "Please enter a voice channel";
            if(queue.length < 1) throw "There is nothing in the queue";

            if(queue.length < 2) {

                bot.leaveVoiceChannel(channelId);

            }

            else {

                connection.stopPlaying();
                queue.shift();
                clearTimeout(timer);

                setTimeout(() => {

                    this.play(channelId, msg, bot);

                }, 3000);

            }

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong! " + err);

        }

    }

}

module.exports = Commands;