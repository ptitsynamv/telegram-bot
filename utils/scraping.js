const moment = require('moment');
moment.locale('ru');

const scrapingArticles = (articleData, horseman) => {
    const selector = '.list-of-fanfic-parts .part:last-child .part-info span';
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
            });
    })
}

module.exports = {scrapingArticles};
