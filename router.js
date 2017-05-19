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

    let renderRoot = (res) => {
        res.send("Hello!!");
    }

    let renderCharts = (res) => {
        let url = "http://www.billboard.com/charts/hot-100";
        let charts = [];

        getBodyElement(url)
            .then(function ($) {
                let songEl = $("div.chart-row__main-display");

                songEl.each(function (idx) {
                    let title = $(this).find(".chart-row__song").text().trim();
                    let artist = $(this).find(".chart-row__artist").text().trim();

                    let song = {
                        title: title,
                        artist: artist
                    };

                    charts.push(song);
                }, (error) => console.log(error));
            })
            .catch(() => console.log('Parsing Error!!'))
            .then(() => {
                // let searchUrl = `https://www.youtube.com/results?search_query=${title}-${artist}`
            })
            .then(() => {
                res.render('charts', {
                    charts: charts
                });
            });
    }

    router.get('/', (req, res) => renderRoot(res));    
    router.get('/charts', (req, res) => renderCharts(res));

    return router;
}
