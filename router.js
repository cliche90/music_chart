module.exports = function () {
    let express = require('express');
    let request = require('request');
    let cheerio = require('cheerio');
    let mongoose = require('mongoose');
    let urlencode = require('urlencode');
    // let Songs = require('/js/songs');

    let router = express.Router();
    // let db = mongoose.connect('mongodb://localhost/top100chart');
    // db.on('error', console.error);
    // db.once('open', () =>console.log("Connected to mongod server");

    let getMusicChart = () => {
        return new Promise((resolve, reject) => {
            let url = "http://www.billboard.com/charts/hot-100";
            let charts = [];

            request(url, (error, response, body) => {
                if (error) {
                    console.log(error);
                    reject('Error!!!');
                }

                let $ = cheerio.load(body);
                let chartEl = $("div.chart-row__main-display");

                chartEl.each(function (idx) {
                    let title = $(this).find(".chart-row__song").text().trim();
                    let artist = $(this).find(".chart-row__artist").text().trim();

                    let song = {
                        title: title,
                        artist: artist
                    };

                    charts.push(song);
                }, (error) => console.log(error));

                resolve(charts);
            });
        });
    };

    let getYoutubeURL = (song) => {

        return new Promise((resolve, reject) => {

            let title = song.title;
            let artist = song.artist;

            let parsedQString = urlencode(`${title} ${artist}`)
            let surl = `https://www.youtube.com/results?search_query=${parsedQString}`;


            let ret = {};

            request(surl, (error, response, body) => {

                if (error) {
                    console.log(error);
                    reject('Error!!');
                }

                let $ = cheerio.load(body);
                // let anchorUrl = $$("#page-container>#page>#content .item-section>li:first-child .yt-lockup-content>h3.yt-lockup-title>a").attr('href');
                let anchorUrl = $('.yt-lockup-video a').first().attr('href');
                let videoId = anchorUrl.replace('/watch?v=', '');

                youtubeUrl = "https://youtu.be/" + videoId;

                ret = {
                    title: title,
                    artist: artist,
                    url: youtubeUrl
                };

                resolve(ret);
            });
        });
    };

    let renderRoot = (res) => {
        res.send("Hello!!");
    };

    let renderCharts = (res) => {

        let _promise1 = getMusicChart;

        _promise1()
            .then((charts) => {
                res.render('charts', {
                    charts: charts
                });
            })
            .catch((error) => console.log('Parsing Error!!'));
    }

    let songChange = (req, res) => {

        let song = {
            title: req.body.title,
            artist: req.body.artist
        }

        getYoutubeURL(song)
            .then((songWithUrl) => {
                res.send(songWithUrl);
            })
    }

    router.get('/', (req, res) => renderRoot(res));
    router.get('/charts', (req, res) => renderCharts(res));
    router.post('/songChnage', (req, res) => songChange(req, res));

    return router;
}
