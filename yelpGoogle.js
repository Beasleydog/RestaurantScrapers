const puppeteer = require('puppeteer');
(async () => {
    const searchLocation = "Souderton PA";
    const search = "Restaurant";

    const MAX = 900;
    const START = 0;
    let current = 0;

    const startUrl = `https://www.yelp.com/search?find_desc=${search}&find_loc=${searchLocation}&start=${START}`;
    const results = {};

    const browser = await puppeteer.launch({ headless: true, args: ['--disable-features=site-per-process'] });
    const page = await browser.newPage();

    //Set all timeouts to 0
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);

    await page.setViewport({ width: 1536, height: 730 });
    await page.goto(startUrl, {
        timeout: 0
    });

    async function scrapeCurrentURLs() {
        const names = await page.evaluate(() => {
            const u = [...document.getElementsByTagName("a")].filter(x => x.parentElement && x.parentElement.tagName == "H3" && x.href.includes(".com/biz")).map(x => x.href.split("biz/")[1].split("?")[0].replaceAll("-", " "));
            return u;
        }, {
            timeout: 0
        });

        await Promise.all(names.map(async (name) => {
            //make new page for each url
            const newPage = await browser.newPage();
            newPage.setViewport({ width: 1536, height: 730 });

            await newPage.goto(`https://www.google.com/maps/search/${name}/@40.1926361,-75.1390561,17z?entry=ttu`, {
                timeout: 0
            });
            console.log("main wati");
            await newPage.waitForSelector("[role=main]", {
                timeout: 0
            });
            console.log("YEA");
            console.log(name);
            const redirect = await newPage.evaluate(() => {
                try {
                    const notPreciseEnough = !![...document.getElementsByTagName("span")].find(x => x.innerText === "You've reached the end of the list.");
                    if (notPreciseEnough) {
                        const firstUrl = [...document.querySelector("[role=main]").children[0].children[0].children].filter((x) => {
                            return [...x.classList].length == 0 && [...x.children].length > 0
                        })[0].children[0].children[0].href;
                        return firstUrl;
                    }
                } catch (e) {
                    return false;
                }
            });
            console.log(name, redirect);
            if (redirect) {
                console.log("direction on ", name, " to ", redirect);
                await newPage.goto(redirect, { timeout: 0 });
            }

            await newPage.waitForFunction('document.querySelector(".fontBodyMedium")', {
                timeout: 0
            });

            const webUrl = await newPage.evaluate(() => {
                const urlElement = document.querySelector(`[data-tooltip="Open website"]`);
                if (urlElement) {
                    return urlElement.children[0].children[1].innerText;
                } else {
                    return false;
                }
            });
            results[name] = webUrl;
            if (webUrl) {
                const ignoreStrings = ["facebook", "instagram"];

                ignoreStrings.forEach((string) => {
                    if (webUrl.includes(string)) {
                        results[name] = false;
                    }
                })
            }
            current++;
            console.log("CLSOING", name)
            await newPage.close();
        }));

        console.log(current, MAX, results);
        if (current < MAX) {
            const currentURL = await page.url();
            await page.evaluate(() => document.querySelector(`[aria-label="Pagination navigation"]`).children[1].click(), {
                timeout: 0
            });
            await new Promise(resolve => setTimeout(resolve, 10 * 1000));
            const newURL = await page.url();

            if (currentURL === newURL) {
                done();
            } else {
                scrapeCurrentURLs();
            }
        } else {
            done();
        }


    }
    function done() {
        browser.close();
        console.log("-----------------DONE-----------------");
        Object.keys(results).forEach((restaurant) => {
            if (!results[restaurant]) {
                console.log(`${restaurant}:           https://google.com/search?q=${encodeURIComponent(restaurant)} `);
            }
        })
    }
    scrapeCurrentURLs();
})();