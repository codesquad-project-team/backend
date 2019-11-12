const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const request = require('request');

module.exports = () => {
    router.get('/naver-search', async function (req, res, next) {
        try {
            const clientid = req.app.get('naverSearchClientId');
            const clientSecret = req.app.get('naverSearchClientSecret');
            if(!req.query.query) return next(createError(400))
            const api_url = 'https://openapi.naver.com/v1/search/local.json?query=' + encodeURI(req.query.query);
            const options = {
                url: api_url,
                headers: {
                    'Content-Type': 'plain/text',
                    'X-Naver-Client-Id': clientid,
                    'X-Naver-Client-Secret': clientSecret
                }
            };
            request.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    return res.json(JSON.parse(body));
                } else {
                    next(createError(response.statusCode));
                    return console.log('error = ' + response.statusCode);
                }
            });
        } catch (error) {
            return next(error);
        }
    });
    return router
}