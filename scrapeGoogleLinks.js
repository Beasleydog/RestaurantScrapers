async function scrapeGoogleLinks(query, browser) {
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${query}`);
    await page.waitForSelector(`#search`, {
        timeout: 0
    });
    const urls = await page.evaluate(() => {
        return [...document.getElementsByTagName("a")].map(x => x.href);
    });
    await page.close();
    return urls;
}
async function findContactPoints(query, browser) {
    const urls = await scrapeGoogleLinks(query, browser);
    const contactPoints = [];

    urls.forEach((url) => {
        if (isFacebookProfile(url) || isInstagramProfile(url)) {
            if (contactPoints.includes(url)) return;
            if (contactPoints.find((x) => x.includes(url))) return;
            contactPoints.push(url);
        }
    });

    return contactPoints;
}
function isFacebookProfile(url) {
    let b = true;
    if (!url.includes("facebook.com")) b = false;
    // if (url.split("").filter(x => x === "/").length != 4) b = false;
    return b;
}
function isInstagramProfile(url) {
    let b = true;
    if (!url.includes("instagram.com")) b = false;
    // if (url.split("").filter(x => x === "/").length != 4) b = false;
    return b;
}

module.exports = {
    scrapeGoogleLinks,
    findContactPoints
}