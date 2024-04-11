const puppeteer = require('puppeteer');
(async () => {
    const searchLocation = "Dresher PA, 19025";
    const search = "Restaurant";

    const MAX = 100;
    let current = 0;

    const startUrl = `https://www.yelp.com/search?find_desc=${search}&find_loc=${searchLocation}`;
    const results = {};

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1536, height: 730 });
    await page.goto(startUrl);

    async function scrapeCurrentURLs() {
        const urls = await page.evaluate(() => {
            const u = [...document.getElementsByTagName("a")].filter(x => x.parentElement && x.parentElement.tagName == "H3" && x.href.includes(".com/biz")).map(x => x.href);
            return u;
        });

        await Promise.all(urls.map(async (url) => {
            //make new page for each url
            const newPage = await browser.newPage();
            newPage.setViewport({ width: 1536, height: 730 });
            console.log("before");
            await newPage.goto(url);
            console.log("after");
            // //Wait for H1 element
            // console.log(await newPage.waitForSelector("h1"));

            const webUrl = await newPage.evaluate(() => {
                const urlElement = document.querySelector(`[aria-label="Business website"]`);
                try {
                    if (urlElement) {
                        return urlElement.parentElement.parentElement.parentElement.children[1].children[1].innerText;
                    } else {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            });
            console.log(webUrl);
            const name = await newPage.evaluate(() => document.querySelector("h1").innerText);
            console.log(name);
            results[name] = webUrl;
            console.log(name);
            current++;
            await newPage.close();
        }));

        console.log(current, MAX, results);
        await browser.close();

    }
    scrapeCurrentURLs();
})();