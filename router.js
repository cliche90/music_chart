module.exports = function () {
    let express = require('express');
    let request = require('request');
    let cheerio = require('cheerio');
    let mongoose = require('mongoose');
    let urlencode = require('urlencode');

    mongoose.connect('mongodb://localhost/music_charts');
    let BillboardSong = require('./models/billboardSong');

    let router = express.Router();

    let updateMusicChart = () => {

        console.log("[LOG] Music chart updated");

        let url = "http://www.billboard.com/charts/hot-100";
        let charts = [];

        request(url, (error, response, body) => {
            if (error) {
                console.error("[ERROR] error on updateMusicChart : ", error);
            }

            let $ = cheerio.load(body);
            let chartEl = $("div.chart-row__main-display");

            chartEl.each(function (idx) {
                let rank = Number($(this).find(".chart-row__rank .chart-row__current-week").text().trim());
                let title = $(this).find(".chart-row__song").text().trim();
                let artist = $(this).find(".chart-row__artist").text().trim();

                let song = {
                    rank: rank,
                    title: title,
                    artist: artist
                };

                charts.push(song);

                BillboardSong.find({ "rank": rank }, (err, docs) => {
                    if (docs.length == 0) {

                        let song = new BillboardSong();

                        song.rank = rank;
                        song.artist = artist;
                        song.title = title;
                        song.videoId = "";

                        song.save((err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    } else {

                        docs[0].artist = artist;
                        docs[0].title = title;

                        docs[0].save((err) => {
                            if(err) {
                                console.error(err);
                                return;
                            }
                        });
                    }
                });
            }, (error) => console.log(error));
        });
    };

    let getYoutubeURL = (rank) => {

        return new Promise((resolve, reject) => {

            BillboardSong.find({ "rank": rank }, (err, docs) => {
                if (docs.length != 0) {
                    let song = docs[0];
                    let ret = {};

                    if (song.videoId != '') {
                        ret = {
                            rank: song.rank,
                            title: song.title,
                            artist: song.artist,
                            videoId: song.videoId
                        }

                        resolve(ret);
                    } else {
                        let parsedQString = urlencode(`${song.title} ${song.artist}`)
                        let surl = `https://www.youtube.com/results?search_query=${parsedQString}`;

                        request(surl, (error, response, body) => {

                            if (error) {
                                console.log(error);
                            }

                            let $ = cheerio.load(body);
                            let anchorUrl = $('.yt-lockup-video a').first().attr('href');
                            let videoId = anchorUrl.replace('/watch?v=', '');

                            song.videoId = videoId;
                            song.save((err) => {
                                if(err) {
                                    console.error(err);
                                    return;
                                }
                            })

                            ret = {
                                rank: song.rank,
                                title: song.title,
                                artist: song.artist,
                                videoId: videoId
                            };

                            resolve(ret);
                        });
                    }
                }
            });
        });
    };

    let renderRoot = (res) => {
        res.send("Hello!!");
    };

    let renderCharts = (res) => {
        BillboardSong.find()
            .sort({ "rank": 1 })
            .exec((err, docs) => {
                let charts = [];

                if (docs.length != 0) {

                    for (var i = 0, len = docs.length; i < len; i++) {
                        let song = {
                            rank: docs[i].rank,
                            title: docs[i].title,
                            artist: docs[i].artist,
                            videoId: docs[i].videoId,
                        }

                        charts.push(song);
                    }
                }

                res.render('charts', {
                    charts: charts
                });
            });
    }

    let songChange = (req, res) => {
        let rank = req.query.rank;

        getYoutubeURL(rank)
            .then((songWithUrl) => {
                res.send(songWithUrl);
            });
    }

    updateMusicChart();
    setInterval(updateMusicChart, 60000 * 60);

    router.get('/', (req, res) => renderRoot(res));
    router.get('/charts', (req, res) => renderCharts(res));
    router.get('/songChange', (req, res) => songChange(req, res));

    return router;
}
