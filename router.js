module.exports = function () {
    let express = require('express');
    let request = require('request');
    let cheerio = require('cheerio');
    let router = express.Router();

    let getBodyElement = (url) => {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) {
                    console.log(error);
                    reject('Error!!!');
                }

                let $ = cheerio.load(body);
                resolve($);
            });
        });
    }

    let renderCharts = (res) => {
        let url = "http://www.billboard.com/charts/hot-100";
        let charts = [];

        getBodyElement(url)
            .then(function ($) {
                let songEl = $("div.chart-row__title");

                songEl.each(function (idx) {
                    let songTitle = $(this).find(".chart-row__song").text().trim();
                    let artist = $(this).find(".chart-row__artist").text().trim();
                    let song = {
                        title: songTitle,
                        artist: artist
                    };
                    charts.push(song);
                }, (error) => console.log(error));
            })
            .catch(() => console.log('Parsing Error!!'))
            .then(() => {
                res.render('charts', {
                    charts: charts
                });
            });
    }

    router.get('/charts', (req, res) => renderCharts(res));

    return router;
}