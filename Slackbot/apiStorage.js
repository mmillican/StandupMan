var Request = require('request');

module.exports = function (config) {
    var apiUrl = 'http://localhost:5000';

    var storage = {
        standups: {
            create: function (standup, success) {
                Request.post(apiUrl + 'standups', { form: standup }, success);
            }
        }
    }

    return storage;
}