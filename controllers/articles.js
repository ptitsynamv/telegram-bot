const Article = require('../models/Article');
const scraping = require('../utils/scraping');
const {from} = require('rxjs');
const {concatMap, map} = require('rxjs/operators');

function findArticle(callback) {
    Article.find({}, 'title url')
        .then((data) => {
            callback(`Found ${data.length} articles.`);
            from(data)
                .pipe(
                    map(({title, url}) => ({title, url})),
                    concatMap((d) => scraping.scrapingArticles(d))
                )
                .subscribe(
                    (result) => {
                        callback(`article: ${result.title}, 
url: ${result.url},
last updated: ${result.difference} days ago`, result.difference);
                    },
                    (error) => {
                        console.log('findArticle error:', error);
                    },
                    () => {
                        callback('Done')
                    },
                );

        });
}

module.exports = {findArticle};
