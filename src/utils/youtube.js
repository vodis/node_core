const puppeteer = require('puppeteer');

const youtube = async (search, callback) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://www.youtube.com/results?search_query=${search}`;

    await page.goto(url);

    // Type into search box.
    await page.type('#search-input input', search);

    // Wait for suggest overlay to appear and click "show all results".
    const allResultsSelector = '#search-icon-legacy .style-scope.ytd-searchbox';
    await page.waitForSelector(allResultsSelector);
    await page.click(allResultsSelector);

    // Wait for the results page to load and display the results.
    const resultsSelector = '#contents ytd-video-renderer.style-scope.ytd-item-section-renderer';
    await page.waitForSelector(resultsSelector);

    // Extract the results from the page.
    const links = await page.evaluate(resultsSelector => {
        const anchors = Array.from(document.querySelectorAll(resultsSelector));

        return anchors.map(anchor => {
            const metaTitle = anchor.children[0].children[1].children[0].children[0].children[0].children[1].title.trim();
            const metaHref = anchor.children[0].children[1].children[0].children[0].children[0].children[1].href;
            const metaImg = anchor.children[0].children[0].children[0].children[0].children[0].src;
            const authorLink = anchor.children[0].children[1].children[1].children[0].href;
            const authorLogo = anchor.children[0].children[1].children[1].children[0].children[0].children[0].src;
            const channelName = anchor.children[0].children[1].children[1].children[1].children[0].children[0].children[0].children[0].text;

            // Return object as result.
            return {
                title: metaTitle,
                link: metaHref,
                img: metaImg,
                authorLink,
                authorLogo,
                channelName,
            }
        });
    }, resultsSelector);

    callback(links);

    await browser.close();
};

module.exports = youtube;
