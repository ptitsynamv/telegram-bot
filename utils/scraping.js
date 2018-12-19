const url = 'https://www.hts.kharkov.ua/KPHTS_v2_bill1PU.php?pg=1';
const Horseman = require('node-horseman');
const horseman = new Horseman();

const scrapingHotWater = (email, password, hotWater1 = 'test', hotWater2 = 'test') => {
    return new Promise((resolve, reject) => {
        horseman
            .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
            .open(url)
            .type('input[type=email]', email)
            .type('input[type=password]', password)
            .click('.message-block input[type="submit"]')
            .waitForNextPage()

            .text('.Header1')
            .then((text) => {
                console.log('text', text);
            })
            .click("a[href='KPHTS_v2_bill01PUNrazvilka.php']")
            .waitForNextPage()

            .text('div .ui-state-default')
            .then((text) => {
                console.log('text', text);
            })
            .type('input[name="0[ValueN]"]', hotWater1)
            .type('input[name="1[ValueN]"]', hotWater2)

            .click('input[type="submit"]')
            .waitForSelector('.info_errors')
            .catch(err => {
                console.log('deal with a timeout error');
            })
            .text('.info_errors')
            .then((errors) => {
                if (errors) {
                    reject(errors);
                } else {
                    resolve(horseman.close());
                }
            })
    })
};

module.exports = scrapingHotWater;
