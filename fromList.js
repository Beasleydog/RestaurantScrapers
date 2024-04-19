const puppeteer = require('puppeteer');
const findContactPoints = require('./scrapeGoogleLinks.js').findContactPoints;
(async () => {
    let current = 0;

    const results = {};

    //Set protocolTimeout to infinite
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-features=site-per-process'],
        timeout: 0
    });
    const page = await browser.newPage();

    //Set all timeouts to 0
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);

    await page.setViewport({ width: 1536, height: 730 });


    async function scrapeCurrentURLs() {
        let names = [
            "El Limon",
            "Chalfont Family Restaurant",
            "New Britain Inn",
            "Los Sarapes Chalfont",
            "Owowcow Creamery",
            "Tu Casa Restaurant",
            "Manhattan Bagel",
            "Skyline Tavern & Restaurant",
            "Leonardo's Pizza Chalfont",
            "Embers Smokehouse and Tap",
            "1720 Bar & Restaurant",
            "China Garden",
            "Rita's Italian Ice & Frozen Cus...",
            "Stickmann's Brewing",
            "The Restaurant at Nostalgia",
            "Massinan Llc",
            "Gianni's Pizza Chalfont",
            "Dunkin'",
            "Leonardo's Pizza",
            "Park Avenue Pastries",
            "Terrain",
            "Sakana Sushi Asian Fusion Resta...",
            "Philly Pretzel Factory",
            "Nico's Pizza",
            "Juice Bar",
            "Delizia Pizza New Britain",
            "Aman's Indian Bistro",
            "Hachi 8 Sushi",
            "Bagel Barn Cafe",
            "Fusion Kitchen & Catering",
            "Wayback Burgers",
            "Dominick's Pizza & Pub",
            "The Happy Mixer Gluten Free Bak...",
            "Spatola's Pizza",
            "Peppino's Tomato Pies",
            "The Talking Teacup",
            "Rita's Italian Ice & Frozen Cus...",
            "Wawa",
            "Lucas Pizza",
            "Toro Guacamole",
            "Dunkin'",
            "The design block",
            "PrimoHoagies",
            "Starbucks",
            "Brown's Doughnut & Pastry Compa...",
            "Noodle House",
            "McDonald's",
            "D & D Leadership Inc",
            "Chinese Restaurant",
            "Gong cha - Chalfont",
            "Philadelphia Keto",
            "Main Street Pizzeria & Grille - Cha...",
            "Side Door Pub, Chalfont",
            "Honey",
            "Maxwell's On Main",
            "Mesquito Grille",
            "Empanada Mama",
            "Domani Star",
            "86 West",
            "Quinoa Peruvian & Mexican Resta...",
            "Hattery Stove & Still",
            "station tap house",
            "Pennsylvania Soup & Seafood Hou...",
            "Hops/Scotch",
            "Chambers 19",
            "Pag���s Wine Bar",
            "Rob's Loft 52",
            "Geronimo Brewing",
            "Planet Smoothie",
            "Zad Albasha Mediterranean Grill & H...",
            "Nina's Waffles And Ice Cream",
            "Geronimo Brewing at Lilly's Jury Ro...",
            "Puck",
            "Penn Taproom",
            "Le Macaron French Pastries Doylesto...",
            "Skyroast Coffee",
            "SLATE BLEU",
            "California Tortilla",
            "Heirloom Doylestown",
            "Andre's Wine & Cheese Shop",
            "Kung Fu Restaurant",
            "Babalouie BBQ",
            "Bagel Barrel",
            "Finney's Royal Grotto",
            "Genevieve's Kitchen",
            "Paganini Ristorante",
            "PrimoHoagies",
            "Annie's Water Ice",
            "The Other Side",
            "Native Cafe",
            "Coach's Steak & Hoagie House",
            "Lilly's Gourmet",
            "Nonno's Italian Coffee Parlor",
            "Doylestown Brewing Company - Hops B...",
            "Spuntino Wood Fired Pizzeria",
            "Pag's Pub",
            "Nourish By Mama",
            "Nat's Pizza",
            "Frost Doylestown",
            "Villa Capri",
            "Bocelli's Restaurant",
            "Cross Culture",
            "Jules Thin Crust",
            "Rita's Italian Ice & Frozen Cus...",
            "Bonjour Creperie",
            "Curiosity Doughnuts",
            "The Puppy Pi",
            "Keystone Cookie Company",
            "KC Prime Steakhouse",
            "Villa Barolo",
            "Soprano's Pizzeria",
            "Jade Island",
            "Mei Ting Asian Fusion",
            "BADA BING BADA BOOM INC",
            "Village Bagel Company",
            "Piccolo Trattoria",
            "Lil Dom's Pizzeria",
            "Aji Sushi",
            "Rita's Italian Ice & Frozen Cus...",
            "Tj Smith's Restaurant & Bar",
            "Sparta Gas Station",
            "Sweet Shop",
            "Cosmic Wings",
            "Tiny Cakes Cookie Company",
            "Thirstys Beer Distributor",
            "Manhattan Bagel",
            "honeygrow",
            "Pasqually's Pizza & Wings",
            "Country Tavern & Restaurant",
            "Dunkin'",
            "Uno Pizzeria & Grill",
            "Chester's",
            "Waffle House",
            "Blue Olive Mediterranean Cuisine",
            "Slack's Hoagie Shack",
            "Simply Delicious By Tina",
            "Jamison Pour House",
            "The Bucks Club",
            "Outback Steakhouse",
            "Giovanni's Pizza",
            "Captn Chuckys Crab Cake",
            "Wild Ginger II",
            "Warwick Tavern Inc",
            "New China York",
            "Cock n Bull Restaurant",
            "Randazzo's Pizza",
            "Nico's Pizza Jamison",
            "Paradiso Restaurant",
            "Brother's Pizza and Pasta",
            "McDonald's",
            "China Buffet",
            "Eastern Dragon Chinese & Jpns",
            "Montgomery Pizza",
            "ValentineRoadCookieCompany",
            "Fri-Sat",
            "Korean Philadelphia",
            "Imperatore Bar and Wood Fired G...",
            "Mystic Restaurant",
            "Elaine's Cheesecake Plus",
            "Lindinger's Deli & Catering",
            "Costco Food Court",
            "In the Bag",
            "Wendy's",
            "Mom's Hotel & Grocery",
            "Iron Hill Brewery & Restaurant",
            "Arpeggio",
            "Kumo Asian Bistro",
            "Harvest Seasonal Grill & Wine Bar -...",
            "Firebirds Wood Fired Grill",
            "Spring House Tavern",
            "Vic Sushi",
            "Tony Roni's",
            "Zoto's Diner-restaurant",
            "Starbucks",
            "Dunkin'",
            "Kikka Sushi",
            "Noodles & Greens",
            "Hokkaido Ramen And Sushi",
            "Ladson Grill",
            "McDonald's",
            "Spring House Pub",
            "Corporate Cafe & Catering",
            "WFM Coffee Bar",
            "Funellas Funnel Cake",
            "Subway",
            "Mister P Pizza",
            "Olive Garden Italian Restaurant",
            "Surah",
            "Il Giardino Italian Cuisine",
            "Turning Point of North Wales",
            "Pancheros Mexican Grill - Spring Ho...",
            "Mandarin Inn",
            "Mochi Ring - Springhouse",
            "Manhattan Bagel",
            "Jules Thin Crust North Wales",
            "Arpeggio BYOB",
            "Harvest Seasonal Grill - North ...",
            "Brick & Barrel",
            "Los Sarapes Horsham Mexican Cuisine...",
            "Las Fridas Mexican Kitchen",
            "The Bagel and Bread House",
            "Peking House Chinese Restaurant",
            "Ann's Cake Pan",
            "Maple Glen Pizza",
            "Golden Great Wall Chinese Resta...",
            "Angelo's Italian Kitchen",
            "Nonna Giovanna's Pizzeria Risto...",
            "Horsham Sunoco Deli & Grill",
            "Jersey Mike's Subs",
            "Dairy Queen",
            "Horsham",
            "eureka! Organic Bread",
            "Papi's Ambler Bistro",
            "Planet Smoothie",
            "Dunkin'",
            "Mr. Wish Horsham",
            "Dairy Queen (Treat)",
            "Santiago’s Family Restaurant",
            "Gigi's Frozen Treats And Water ...",
            "Dairy Queen (Treat)",
            "Grilliant Greek Rotisserie",
            "Frank's Pizza Kitchen",
            "Red Robin Gourmet Burgers and B...",
            "Alessio's Seafood Grille",
            "Chick-fil-A",
            "Chickie's & Pete's",
            "Giuseppe's Pizza & Family Resta...",
            "GUISEPPI'S PIZZA",
            "Easton Buffet",
            "Buffalo Wild Wings",
            "Panera Bread",
            "Moe's Southwest Grill",
            "LongHorn Steakhouse",
            "P.F. Chang's",
            "IHOP",
            "Poke Bros.",
            "Turning Point of Warrington",
            "Nothing Bundt Cakes",
            "HG Coal Fired Pizza",
            "Select Pizza|Grill",
            "Starbucks",
            "McDonald's",
            "Wawa",
            "MOD Pizza",
            "Árdana Food & Drink",
            "Mizu Sushi and Hibachi",
            "Wendy's",
            "Bound Beverages",
            "Playa Bowls",
            "Big Heads Warminster",
            "Gran Rodeo Mexican Bar & Grill",
            "COWABUNGA COFFEE ROASTERS",
            "Sal's Pizza Steak",
            "Chipotle Mexican Grill",
            "The Fusion Bar",
            "Premier Chinese Cuisine",
            "El Rancho Comida Hondureña Y Mexic...",
            "Crumbl - Warrington",
            "Peet's Coffee",
            "Wegmans Bakery",
            "China Buffet",
            "Rey Azteca",
            "China Buffet",
            "Pat's",
            "Tierra Mia LLC",
            "Roma Pizza",
            "Cold Stone Creamery",
            "7-Eleven",
            "Rita's Italian Ice & Frozen Cus...",
            "Dunkin'",
            "The Cage - Warrington",
            "Joy Chalet Cuisine",
            "Tony's Place Bar & Grill",
            "HG Bucks Bagels",
            "Dunkin'",
            "SNOWFOX",
            "Authentic Indian Immunity Boosting ...",
            "Amalio's Pizza & Pasta",
            "Meadowlark Bakery & Cafe",
            "McDonald Company Machines",
            "David's Chinese Restaraunt",
            "Warwick Farm Brewing",
            "Specialty Cakes",
            "NaBrasa Brazilian Steakhouse",
            "Iron Abbey",
            "Daddypops",
            "Cafe Lombardi's",
            "Buona Via",
            "The Farm and Fisherman Tavern - Hor...",
            "Red Lion Diner",
            "Magerks Horsham",
            "Crooked Eye Brewery",
            "Rey Azteca of Warminster",
            "Graeme Park Pizza & Cafe",
            "silvio's deli llc",
            "El Rey de Oros Restaurant",
            "Hatboro Pizza",
            "McDonald's",
            "Wendy's",
            "LUHV Vegan Bistro",
            "Burger King",
            "Philly Pretzel Factory",
            "Five Guys",
            "The LOFT Whiskey Bar",
            "Quig's Pizza",
            "Horsham Chinese Restaurant",
            "Starbucks",
            "Saladworks",
            "PrimoHoagies",
            "Richie's Bar & Grill",
            "Pizza Plaza of Horsham",
            "Iron Abbey Soccer",
            "Dairy Queen (Treat)",
            "Tonantzin Authentic Mexican Food",
            "El Limon Hatboro",
            "Dunkin'",
            "Mr.Wish Warminster PA",
            "Bryn & Danes",
            "China Buffet",
            "Orange Julius",
            "Pana Restaurant",
            "Wing Lee Cuisine",
            "Lancers Diner",
            "Fountain Side Seafood & Grill",
            "Saladworks",
            "Stone Wok",
            "Frank's Pizza New York Style",
            "Bubbakoo's Burritos",
            "Dim Sum Factory",
            "Masala Zone Authentic Indian Cu...",
            "Horsham Pizza",
            "Lee's Hoagie House of Horsham",
            "Pizza Plaza of Warminster",
            "Augusto's",
            "Grand Buffet Chinese Restaurant",
            "Taco Bell",
            "Crafty's Taproom Warminster",
            "Eagle Diner",
            "Taco Suave",
            "Caruso's Ristorante Italiano",
            "Warminster West Diner",
            "Bullard's American Cafe",
            "Golden China Chinese Restaurant",
            "Kenney's Madison Tavern",
            "Altomante Italian Market & Deli",
            "Sunny Asian Cuisine",
            "Schiano's Pizza",
            "Nick's Deli",
            "Mission BBQ",
            "Rita's Italian Ice & Frozen Cus...",
            "Backyard Bar & Grille",
            "Angels Donuts",
            "Jim's Soft Pretzels",
            "Kam Wah Chinese Kitchen",
            "La Voglia Italian Restaurant",
            "Chipotle Mexican Grill",
            "Uncle Joe's Pizza",
            "Steak and Hoagie Factory",
            "Burger King",
            "Yum Yum Bake Shops",
            "C & D Deli",
            "Mike's York Road Tavern",
            "In & Out Express Pizza IV",
            "Tranquility Brewing Company",
            "Taqueria Agulia",
            "Blue Bar Co.",
            "Menagerie Foods",
            "Steel Penny Cafe",
            "Philomena Santucci's Square Piz...",
            "El Jefe Wings & Taqueria",
            "Sushi X",
            "Golden Wok",
            "Taormina's Pizza, Pasta, & Cate...",
            "Uncle Mike's Homemade Ice Cream",
            "Subway",
            "The New Mama Juana",
            "Starbucks",
            "Angys Cafe & Ice Cream",
            "Hatboro Federal Savings Ivyland 5K ...",
            "Pizza Hut",
            "Debbie's Place",
            "Nifty Fifty's (Warminster)",
            "Bucks Gyro"
        ]

        //Remove any duplicates
        names = Array.from(new Set(names));

        //Remove any characters that aren't letters, numbers, spaces, or punctuation
        names = names.map(name => name.replace(/[^a-zA-Z0-9\s.,;'"!?]/g, ''));


        let count = 0;

        await Promise.all(names.map(async (name) => {
            //make new page for each url

            await new Promise((res) => {
                setTimeout(() => {
                    let check = setInterval(() => {
                        if (count < 10) {
                            res();
                            clearInterval(check);
                        }
                    }, 1000);
                }, Math.random() * 1000);
            })
            count++;

            const newPage = await browser.newPage();
            newPage.setViewport({ width: 1536, height: 730 });

            console.log("go to")
            await newPage.goto(`https://www.google.com/maps/search/${name}/@40.1926361,-75.1390561,17z?entry=ttu`, {
                timeout: 0
            });
            // console.log("main wati");
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
            count--;
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

        console.log("----------DONE-------------");
        //Iterate over batches with a delay of 10 seconds. For each item in batch, find contact points and add to an array if they exist
        const contactPoints = [];
        for (batch of batches) {
            for (var i = 0; i < batch.length; i++) {
                const restaurant = batch[i];
                const urls = await findContactPoints(restaurant, browser);
                if (urls.length > 0) {
                    contactPoints.push({
                        name: restaurant,
                        urls: urls
                    });
                    console.log(restaurant);
                    urls.forEach((url) => {
                        console.log(url);
                    });
                    console.log("----------");
                }
            }
            await new Promise(resolve => setTimeout(resolve, 10 * 1000));
        }
        browser.close();
    }
    scrapeCurrentURLs();
})();