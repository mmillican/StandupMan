var Botkit = require('botkit'),
    request = require('request'),
    apiStorage = require('./apiStorage');

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
        
        var date = new Date();
        var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

        var reqData = {
            userId: message.user,
            name: user.name,
            email: user.profile.email,
            fullName: user.profile.fullName,
            standupDate: today,
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
            console.log('Got response');
            console.log(error);
            console.log(body);
        });

    });
});