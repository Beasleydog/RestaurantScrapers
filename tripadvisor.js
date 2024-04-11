const puppeteer = require('puppeteer');

(async () => {
    //Geoid for Dresher, Pennsylvania
    const geoId = 52513;

    const url = `https://www.tripadvisor.com/FindRestaurants?geo=${geoId}&offset=0&establishmentTypes=10591%2C9901%2C16556%2C9900&broadened=true`;


    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
    ];
    const browser = await puppeteer.launch({
        headless: false,
        args: args
    });
    const page = await browser.newPage();
    page.goto(url);

    async function scrapeCurrentURLs() {
        //Wait for page to load
        await page.waitForSelector(`[data-automation="searchResults"]`);

        const urls = page.evaluate(() => {
            return [...document.querySelector(`[data-automation="searchResults"]`).children].map((x) => { try { return x.children[0].children[0].children[1].children[0].children[0].children[1].children[0].children[0].children[0].href } catch { return false } }).filter(x => x);
        });

        console.log(urls);
    }
    scrapeCurrentURLs();
})();