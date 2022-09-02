const ytdl = require('ytdl-core');
const config = require('./config.json');
const yts = require('youtube-search-without-api-key');
const axios = require('axios').default;
const fs = require('fs');
const gApi = config.googleKey;
const gSE = config.googleSE;
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

    static listHelp(msg) {

        msg.channel.createMessage("!play <arg> -- Will play the top yt result of your input or if something is currently playing add it to the queue" + "\n"
        + "!skip -- Will stop playback and go to the next song in the queue or disconnect the bot if the queue is empty" + "\n"
        + "!queue -- Will list the queue" + "\n"
        + "!poll <arg> -- Will create a poll for your input" + "\n"
        + "!champ <arg> -- Will grab the op.gg information for that champion. Please enter champions name with no spaces and all lowercase" + "\n"
        + "!account <arg> <arg> -- Will search for a summoners op.gg account. The first argument should be the regional identifier for the account. Format the account name in lower case and no spaces" + "\n"
        + "!twitch <arg> -- Will search twitch for an account");

    }

    static newPoll(msg) {

        try {

            let query = msg.content.substring(6);
            msg.channel.createMessage(query).then(pollMsg => {

                pollMsg.addReaction("✅");
                pollMsg.addReaction("❌");

            });

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong! " + err);

        }

    }

    static searchChamp(msg) {

        try {

            let query = msg.content.substring(7);
            let champList = fs.readFileSync('files/champs.txt', 'utf8');
            if(champList.includes(query)) {

                msg.channel.createMessage("https://na.op.gg/champions/" + query);

            }

            else {

                throw "Could not find a champion with that name. Try formatting it with no spaces, apostrophes and all lower case"

            }

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong! " + err);

        }


    }

    static searchAccount(msg) {

        try {

            let queryLocal = msg.content.substring(9, 11)
            let queryName = msg.content.substring(12);
            if(queryName.includes(" ")) throw "Please format name without spaces"
            msg.channel.createMessage("https://na.op.gg/summoners/" + queryLocal + "/" + queryName);

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong! " + err);

        }

    }

    static searchTwitch(msg) {

        try {

            let query = msg.content.substring(8);
            axios.get("https://www.googleapis.com/customsearch/v1?key=" + gApi + gSE + query)
                .then(response => {

                    msg.channel.createMessage(response.data.items[0].link);

                })

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong!");

        }


    }

    static playAugh(msg, bot) {

        try {
    
            let channelId = msg.member.voiceState.channelID;

            bot.joinVoiceChannel(channelId).then(connection => {

                connection.play('files/augh.mp3');

                connection.once("end", () => {

                    connection.stopPlaying();
                    bot.leaveVoiceChannel(channelId);

                })

            }) 

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong!");

        }


    }

}

module.exports = Commands;