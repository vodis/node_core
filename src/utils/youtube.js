const puppeteer = require('puppeteer');

const youtube = async (movie, callback) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://www.youtube.com/';

    await page.goto(url);

    // Type into search box.
    await page.type('#search-input input', movie);

    // Wait for suggest overlay to appear and click "show all results".
    const allResultsSelector = '#search-icon-legacy .style-scope.ytd-searchbox';
    await page.waitForSelector(allResultsSelector);
    await page.click(allResultsSelector);

    // Wait for the results page to load and display the results.
    const resultsSelector = '.yt-simple-endpoint.style-scope.ytd-video-renderer';
    await page.waitForSelector(resultsSelector);

    // Extract the results from the page.
    const links = await page.evaluate(resultsSelector => {
        const anchors = Array.from(document.querySelectorAll(resultsSelector));
        return anchors.map(anchor => {
            debugger;
            const title = anchor.textContent.split('|')[0].trim();
            return `${title} - ${anchor.href}`;
        });
    }, resultsSelector);

    callback(links);

    await browser.close();
};

youtube("New Movies", (callback) => {
    console.log(callback);
});
