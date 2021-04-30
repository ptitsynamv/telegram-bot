const moment = require('moment');
moment.locale('ru');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const selector = '.list-of-fanfic-parts .part:last-child .part-info span';

const scrapingArticles = (articleData) => {
    const options = {
        args: ['--no-sandbox'],
    };
    if (process.env.PUPPETTER_EXECUTABLE_PATH) {
        options['executablePath'] = process.env.PUPPETTER_EXECUTABLE_PATH;
    }

    return puppeteer
        .launch(options)
        .then(function (browser) {
            return browser.newPage();
        })
        .then(function (page) {
            const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
            return page.setUserAgent(userAgent)
                .then(() => page.goto(articleData.url))
                .then(() => page.content());
        })
        .then(function (html) {
            const $ = cheerio.load(html);
            const day = $(selector).attr('title');
            const momentDate = moment(day, 'DD MMMM YYYY, h:mm');
            return {
                ...articleData,
                difference: moment().diff(momentDate, 'days'),
            }
        })
        .catch(function (err) {
            console.log('scrapingArticles error:', err);
            return err;
        });
};


const scrapingArticlesHorseman = (articleData, horseman) => {
    return new Promise((resolve, reject) => {
        horseman
            .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
            .open(articleData.url)
            .attribute(selector, 'title')
            .then((day) => {
                const momentDate = moment(day, 'DD MMMM YYYY, h:mm')
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


// needle.get(articleData.url, function (err, res) {
//     if (err) {
//         console.log('scrapingArticles error:', err);
//         reject(err);
//     }
//
//     console.log('statusCode', res.statusCode);
//
//     const $ = cheerio.load(res.body);
//     const day = $(selector).attr('title');
//     console.log('day', day);
//     const momentDate = moment(day, "DD MMMM YYYY, h:mm");
//     resolve({
//         ...articleData,
//         difference: moment().diff(momentDate, 'days'),
//     })
// });
