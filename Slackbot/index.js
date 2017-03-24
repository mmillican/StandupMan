var Botkit = require('botkit'),
    request = require('request'),
    apiStorage = require('./apiStorage'),
    moment = require('moment');

var controller = Botkit.slackbot({
    // storage: apiStorage()
});

var bot = controller.spawn({
    token: process.env.token
});

bot.startRTM(function (err, bot, payload) {
    if (err) {
        throw new Error('Could not connect to slack');
    }    
});

controller.on(['mention', 'direct_mention'], function (bot, message) {
    
    bot.api.users.info({ user: message.user }, function (err, userInfo) {
        var user = userInfo.user;

        var standupDate = moment.unix(message.ts).format('YYYY-MM-DD');
        
        var reqData = {
            userId: message.user,
            name: user.name,
            email: user.profile.email,
            fullName: user.profile.fullName,
            standupDate: standupDate,
            message: message.text
        };
                
        var params = {
            //url: 'http://localhost:52860/standups',
            url: 'http://localhost:5000/standups',
            headers: {
                'User-Agent': 'StandupMan Slack Bot'
            },
            json: reqData
        };

        request.post(params, function (error, response, body) {
            // TODO: Respond back to user with error
            console.log('Got response');
            console.log(error);
            console.log(body);
        });

    });
});

controller.hears(['today'], ['direct_message'], function (bot, message) {
    var userId = message.user;
    var standupDate = moment.unix(message.ts).format('YYYY-MM-DD');

    var standupId = userId + '_' + standupDate;
    
    var reqParams = {
        url: 'http://localhost:5000/standups/' + standupId,
        headers: {
            'User-Agent': 'StandupMan Slack Bot'
        },
    };

    request.get(reqParams, function (error, response, body) {
        if (!error && body) {
            var data = JSON.parse(body);

            bot.reply(message, {
                text: 'Today you have: ' + data.today
            }, function (err, resp) {
                console.log(err, resp);
            });
        } else {
            bot.reply(message, {
                text: 'Sorry, I couldn\'t get your standup :cry:.  Please try again.'
            }, function (err, resp) {
                if (err) {
                    console.error(err);
                }
            });
        }
    });
});

controller.hears(['yesterday'], ['direct_message'], function (bot, message) {
    var userId = message.user;
    var today = moment.unix(message.ts);
    var yesterday = moment(today).subtract(1, 'days');
    if (yesterday.day() === 6 || yesterday.day() === 0) {
        // Saturday or Sunday...
        yesterday = moment(today).day(0 - 2); // last Friday
    }

    var standupDate = moment(yesterday).format('YYYY-MM-DD');
    console.log(standupDate);

    var standupId = userId + '_' + standupDate;

    var reqParams = {
        url: 'http://localhost:5000/standups/' + standupId,
        headers: {
            'User-Agent': 'StandupMan Slack Bot'
        },
    };

    request.get(reqParams, function (error, response, body) {
        console.log(response);
        if (!error && body) {
            var data = JSON.parse(body);

            bot.reply(message, {
                text: 'Yesterday\'s standup: ...'// + data.today
            }, function (err, resp) {
                console.log(err, resp);
            });
        } else {
            bot.reply(message, {
                text: 'Sorry, I couldn\'t get your standup :cry:.  Please try again.'
            }, function (err, resp) {
                if (err) {
                    console.error(err);
                }
            });
        }
    });
});