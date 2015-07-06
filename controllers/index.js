var boom = require('boom');
var lowdb = require('../configs/lowdb');
var url = require('../configs/base-url');

function controller(request, reply) {
    if (request.query && request.query.q) {
        return reply.redirect('/search/' + request.query.q);
    }

    Promise.all([
        controller.recentlyCreated(),
        controller.lastUpdated(),
        controller.mostPopular()
    ])
    .then(function(results) {
        reply.view('index', {
            recentlyCreated: results[0],
            lastUpdated: results[1],
            mostPopular: results[2],
            base_url: url(request)
        });
    })
    .catch(reply);
}

controller.recentlyCreated = function(data) {
    return new Promise(function(resolve) {
        var data = lowdb('repos').chain().sortBy('created_at').reverse().value()
        resolve(data);
});
};

controller.lastUpdated = function(data) {
    return new Promise(function(resolve) {
        var data = lowdb('repos').chain().sortBy('pushed_at').reverse().value()
        resolve(data);
    });
};

controller.mostPopular = function(data) {
    return new Promise(function(resolve) {
        var data = lowdb('repos').chain().sortBy('stargazers_count').reverse().value()
        resolve(data);
    });
};

module.exports = controller;
