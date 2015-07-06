var boom = require('boom');
var lowdb = require('../configs/lowdb');
var joi = require('joi');
var paginate = require('handlebars-paginate');
var Handlebars = require('handlebars');
var template = require('../views/layout/template.hbs');
var url = require('../configs/base-url');
Handlebars.registerHelper('paginate', paginate);

function controller(request, reply) {
    request.params.term = request.params.term.replace(/\+/g, ' ').replace(/\-/g, ' ');

    controller.validate(request)
        .then(function(result) {
            return controller.find(result);
        })
        .then(function(result) {
            result.base_url = url(request);
            return reply.view('search', result);
        })
        .catch(reply);
}

controller.validate = function(request) {
    return new Promise(function(resolve, reject) {
        var params = {
            q: request.params.term,
            page: request.query.page,
            perPage: request.query.perPage
        };

        var schema = {
            q: joi.string(),
            page: joi.number().min(1).default(1),
            perPage: joi.number().min(1).default(30)
        };

        joi.validate(params, schema, function(err, result) {
            if (err) {
                reject(boom.badRequest(err));
            }

            resolve(result);
        });
    });
};

controller.find = function(params) {
    return new Promise(function(resolve) {

        var data = lowdb('repos').chain().filter(function(v) { return params.q.match(v.full_name) }).value();
        var response = {
            q: params.q,
            total: data.length,
            results: data
        };

        var html = template({
            pagination: {
                page: params.page,
                pageCount: Math.ceil(response.total / params.perPage)
            }
        });

        if (Math.ceil(response.total / params.perPage) > 1) {
            response.pagination = html;
        }

        resolve(response);
    });
};

module.exports = controller;
