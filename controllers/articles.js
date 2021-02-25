const Horseman = require('node-horseman');
const horseman = new Horseman();
const Article = require('../models/Article');
const scraping = require('../utils/scraping');
const {from} = require('rxjs');
const {concatMap, map} = require('rxjs/operators');

function findArticle(callback) {
    Article.find({}, 'title url')
        .then((data) => {
            from(data)
                .pipe(
                    map(({title, url}) => ({title, url})),
                    concatMap((d) => scraping.scrapingArticles(d, horseman))
                )
                .subscribe(
                    (result) => {
                        callback(`article: ${result.title}, 
url: ${result.url},
last updated: ${result.diff} days ago`)
                    },
                    (error) => {
                    },
                    () => {
                        return horseman.close();
                    },
                );

        });
}

module.exports = {findArticle};
