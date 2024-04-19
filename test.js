const puppeteer = require('puppeteer');
const findContactPoints = require('./scrapeGoogleLinks.js').findContactPoints;
(async () => {
    const searchLocation = "Feasterville PA";
    const search = "restaurant";

    const MAX = 1000;
    const START = 0;
    let current = 0;

    const startUrl = `https://www.yelp.com/search?find_desc=${search}&find_loc=${searchLocation}&start=${START}`;
    const results = {};

    const browser = await puppeteer.launch({ headless: false, args: ['--disable-features=site-per-process'] });
    const page = await browser.newPage();

    //Set all timeouts to 0
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);

    await page.setViewport({ width: 1536, height: 730 });


    async function scrapeCurrentURLs() {
        const names = [
            "Airport Diner (Kutztown)",
            "Asian Star (Wyomissing)",
            "The Bagel Bar Cafe (Kutztown)",
            "Basil Restaurant & Pizzeria (Fritztown Rd. - Sinking Spring)",
            "Big Bertha's Grill (at Sittler Golf - Sinking Spring)",
            "Blue Marsh Italian Restaurant & Pizzeria (Bernville - RT 183)",
            "El Bohio (Reading - 5th St.)",
            "Brunos Pizza (Reading Mall - Exeter)",
            "Carlo's Italian Restaurant Pizzeria (Wyomissing)",
            "Cegee's (Blandon)",
            "China Fun Restaurant (Rt. 61 - Reading)",
            "China King Restaurant (Wyomissing)",
            "China Moon (Sinking Spring Market Place)",
            "China III (Birdsboro)",
            "Ciao's Pizza (Pottsville Pike - Reading)",
            "Craig's Sandwiches (Fleetwood)",
            "Cristina's Family Restaurant & Pizzeria (Blandon)",
            "Deluxe Diner (Shillington)",
            "De Marco's Italian Restaurant Pizzeria (Kutztown)",
            "DiCarlo's Pizza & Grill (Wernersville)",
            "Dickey's Barbecue Pit (Wyomissing)",
            "The Dog House (Reading - Lancaster Ave)",
            "Dynamite Subs (Rte. 10)",
            "D&J Sandwich Shop (Montrose Manor/Lincoln Park)",
            "East Wok Chinese Restaurant (Wyomissing - Berkshire Square Shopping Center)",
            "Effie's Charcoal Chef (Perkiomen Ave. - Reading)",
            "Esterly's Pizza & Sandwiches (Bowers)",
            "Feliciano's (Bethel - Rehrersburg)",
            "5th Street Diner (Temple)",
            "Fiore's Italian Family Restaurant & Pizzeria (Fleetwood)",
            "Five Guys Burgers & Fries (Exeter Commons)",
            "Five Guys Burgers & Fries (Sinking Spring)",
            "Fleetwood Pizza (Fleetwood)",
            "Fortune Cafe (Berkshire Square Shopping Center - Wyomissing)",
            "Fox's Pizza Den (Blandon)",
            "The Galley Restaurant (6th St. - Reading)",
            "Giannotti's Country Manor Restaurant & Bar (Fleetwood)",
            "Giannotti's (Wyomissing)",
            "Giovanna's Pizza (Shelbourne Square, Reading)",
            "Grand Central (Fleetwood)",
            "Great China (Sinking Spring)",
            "Great Wall Chinese Restaurant (West Reading)",
            "Happy Wok Chinese Restaurant (Douglassville)",
            "Homer's Bar and Grill (Fleetwood)",
            "Hong Thanh Vietnamese & Chinese Restaurant (6th St. - Reading)",
            "Infinitos (5th st. hwy - Reading)",
            "Italian Delite Restaurant & Pizzeria (Birdsboro)",
            "Italian Village New York Style Pizza (6th St.- Reading)",
            "Jak's Downtown Diner (Topton)",
            "J & S II Pizza & Italian Restaurant (Bethel - Exit 16 off Route 78)",
            "Jumbo China Buffet (Muhlenberg Shopping Plaza)",
            "Krispy Krunchy Chicken (Blandon)",
            "La Cocina Mexicana (Temple)",
            "Lattanzio Sandwiches (Laureldale)",
            "Lilly's Ranch House (West Lawn)",
            "Lou ees Pizza ...And More! (Hamburg Square - with Redner's Markets)",
            "Mamas Famous Pizza and Grill (Reading, Pottsville Pike(RT.61))",
            "Mamas Pizza and Grill (Reading/Rockland St.)",
            "Mamma's Delight Pizza & Restaurant (Kutztown)",
            "The Market Cafe (Topton)",
            "Matt's Steaks (West Lawn)",
            "Mays Sandwich Shop (West Lawn)",
            "The Meat Up Deli (Wyomissing - Park Road)",
            "Mezcal's Authentic Mexican Food (6th St. - Reading)",
            "Mi Casa Su Casa (Penn St. - Reading)",
            "Moe's southwest grill (Wyomissing)",
            "Mt Penn Family Restaurant (Perkiomen Ave - Mt. Penn)",
            "New China (Shillington)",
            "New China Restaurant (Womelsdorf)",
            "New China King (Kutztown)",
            "New York Bagelry (Next to Redner's - Kenhorst))",
            "New York Bagelry (Penn Ave. - West Lawn)",
            "Nice Garden (Maiden Creek Shopping Center, Blandon))",
            "Old San Juan Cafe ( N.9th St. - Reading)",
            "Penn Chicken Buffet (Lancaster Ave. - Shillington)",
            "Pho House Vietnamese Resaurant (Wyomissing - State Hill Rd)",
            "Piero Pizzeria (Bernville Rd. - Reading)",
            "Pizza Como Restaurant Lounge (Hamburg)",
            "Pizza Como USA (Temple)",
            "Pizzariffic (Rt.61 - Reading))",
            "P & J Pizza (Womelsdorf)",
            "Plateau Cuisine Family Restaurant (Morgantown Rd. - Reading)",
            "Plaza Azteca Restaurantes Mexicanos (Wyomissing)",
            "Redner's Quick Shoppe (Penn Ave. - West Lawn)",
            "Red Plate Diner (Wernersville)",
            "Riviera Pizza and Grill (Exeter Promenade Plaza)",
            "Rocky's Pizza (5th & Spring - Reading)",
            "Rocky's Pizza*Grill*Wings (Blandon)",
            "Romano's Chicago Style Pizza & Grill (Lancaster Ave. - Reading)",
            "Rosa's Place (Shillington Shopping Center)",
            "The Route 61 Diner ( Rt. 61 - Muhlenberg)",
            "Russo's Pizza Family Restaurant (Hamburg)",
            "Salsa Burrito (Reading - Penn St.)",
            "Sammy's Steaks Pizza & Deli (Reading)",
            "Sciacca Pizza and Restaurant (Boyertown)",
            "Screpesi's Sandwich Shop (Reading)",
            "Simmeria Cafe & Bistro (Fleetwood)",
            "Super King Buffet (Wyomissing)",
            "Sweets and Eats Cafe (Kenhorst Plaza)",
            "The Tavern on Penn (West Lawn)",
            "Tony's Family Restaurant (Robesonia)",
            "Tony's Italian Restaurant and Pizzeria (Topton)",
            "Valentino's (Kutztown)",
            "Van Reed Inn (Bernville Rd. - Reading)",
            "Van's Cafe (West Reading)",
            "Victor Emmanuel II (Reading)",
            "Vincenzo's (Douglassville)",
            "V&S Sandwiches (Perkiomen Ave - Reading)",
            "V&S Sandwiches (Lancaster Ave. - Shillington)",
            "V&S Sandwiches (Rt. 422 - Sinking Spring)",
            "V&S Sandwiches (5th st highway - Temple)",
            "Wayback Burgers (Wyomissing)",
            "Wegman's Restaurant (RT.61 - Reading)",
            "The White Palm Tavern (Topton)",
            "Whoo's Cookin at the Boxcar Grill (Penn Ave - Robesonia)",
            "Wonderful House Chinese Restaurant (Sinking Spring)",
            "Xiang Shan Restaurant (Hamburg Commons Shopping Center)",
            "Yummy Asian Buffet (Sinking Spring)"
        ];

        await Promise.all(names.map(async (name) => {
            //make new page for each url
            await new Promise(resolve => setTimeout(resolve, Math.random() * 60 * 1000));

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


        done();

    }
    async function done() {
        const noSites = [];
        Object.keys(results).forEach((restaurant) => {
            if (!results[restaurant]) {
                console.log(`${restaurant}:           https://google.com/search?q=${encodeURIComponent(restaurant)} `);
                noSites.push(restaurant);
            }
        });

        const batchSize = 10;
        //Split noSites into batches of batchSize
        const batches = [];
        for (let i = 0; i < noSites.length; i += batchSize) {
            batches.push(noSites.slice(i, i + batchSize));
        }

        //Iterate over batches with a delay of 10 seconds. For each item in batch, find contact points and add to an array if they exist
        const contactPoints = [];
        for (batch of batches) {
            for (var i = 0; i < batch.length; i++) {
                const restaurant = batch[i];
                const urls = await findContactPoints(restaurant, browser);
                console.log(restaurant, urls);
                if (urls.length > 0) {
                    contactPoints.push({
                        name: restaurant,
                        urls: urls
                    });
                }
            }
            await new Promise(resolve => setTimeout(resolve, 10 * 1000));
        }
        console.log(contactPoints);

        browser.close();
    }
    scrapeCurrentURLs();
})();