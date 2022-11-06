const config = require('./config.json');
const axios = require('axios').default;
const fs = require('fs');
const { get } = require('http');
const gApi = config.gKey;
const gSE = config.searchEngine;


class Commands {

    static listHelp(msg) {

        msg.channel.createMessage(
          "!poll <arg> -- Will create a poll for your input" + "\n"
        + "!champ <arg> -- Will grab the op.gg information for that champion. Please enter champions name with no spaces and all lowercase" + "\n"
        + "!account <arg> <arg> -- Will search for a summoners op.gg account. The first argument should be the regional identifier for the account. Format the account name in lower case and no spaces" + "\n"
        + "!twitch <arg> -- Will search Twitch for the keyword" + "\n"
        + "!youtube <arg> -- Will search Youtube for the keyword" + "\n"
        + "!mal <arg> -- Will search MAL for the keyword" + "\n"
        + "!random <arg> <arg2> etc -- Will randomly choose one of the arguments supplied. You can have as many as you want");

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
            axios.get("https://www.googleapis.com/customsearch/v1?key=" + gApi + "&cx=" + gSE + "&q=" + query)
                .then(response => {

                    console.log(response.data);
                    for(var i = 0; i < response.data.items.length; i ++) {

                        if(response.data.items[i].displayLink == 'www.twitch.tv') {

                            msg.channel.createMessage(response.data.items[i].link);
                            break;

                        }
                        

                    }
                    

                })

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong!");

        }


    }

    static searchYoutube(msg) {

        try {

            let query = msg.content.substring(8);
            axios.get("https://www.googleapis.com/customsearch/v1?key=" + gApi + "&cx=" + gSE + "&q=" + query)
                .then(response => {

                    console.log(response.data);
                    for(var i = 0; i < response.data.items.length; i ++) {

                        if(response.data.items[i].displayLink == 'www.youtube.com') {

                            msg.channel.createMessage(response.data.items[i].link);
                            break;

                        }
                        

                    }
                    

                })

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong!");

        }


    }

    static searchMal(msg) {

        try {

            let query = msg.content.substring(8);
            axios.get("https://www.googleapis.com/customsearch/v1?key=" + gApi + "&cx=" + gSE + "&q=" + query)
                .then(response => {

                    console.log(response.data);
                    for(var i = 0; i < response.data.items.length; i ++) {

                        if(response.data.items[i].displayLink == 'myanimelist.net') {

                            msg.channel.createMessage(response.data.items[i].link);
                            break;

                        }
                        

                    }
                    

                })

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong!");

        }


    }

    static random(msg) {

        try {

            let query = msg.content.substring(8);
            if(query == undefined) throw "Please enter atleast one argument (yeah you can have 1 if you just like wasting time)"
            let choices = query.split(" ");
            msg.channel.createMessage(choices[Math.floor(Math.random() * choices.length)]);

        }

        catch(err) {

            console.log(err);
            msg.channel.createMessage("Something went wrong! " + err);

        }

    }

}

module.exports = Commands;