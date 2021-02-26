const moment = require('moment');
moment.locale('ru');
const needle = require('needle');
const cheerio = require('cheerio');
const selector = '.list-of-fanfic-parts .part:last-child .part-info span';

const scrapingArticles = (articleData) => {
    return new Promise((resolve, reject) => {

        needle.get(articleData.url, function (err, res) {
            if (err) {
                console.log('scrapingArticles error:', error);
                reject(err);
            }
            const $ = cheerio.load(res.body);
            const day = $(selector).attr('title');
            const momentDate = moment(day, "DD MMMM YYYY, h:mm");

            resolve({
                ...articleData,
                difference: moment().diff(momentDate, 'days'),
            })
        });
    })
}


const scrapingArticlesHorseman = (articleData, horseman) => {
    return new Promise((resolve, reject) => {
        horseman
            .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
            .open(articleData.url)
            .attribute(selector, 'title')
            .then((day) => {
                const momentDate = moment(day, "DD MMMM YYYY, h:mm")
                return moment().diff(momentDate, 'days');
            })
            .then(function (diff) {
                return resolve({
                    ...articleData,
                    diff,
                });
            })
            .catch(function (error) {
                console.log('scrapingArticles error:', error);
            })
    })
}

module.exports = {scrapingArticles};
