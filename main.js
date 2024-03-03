const puppeteer = require("puppeteer");
const data = require('./config.json');

async function ClickWithSelector(page, selector) {
    try {
        const element = await page.waitForSelector(selector);
        const elementclick = await page.$(selector);
        await elementclick.click();
        if (element) {
            await element.click();
        }
        else {
            console.error('no xpath match.');
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function TypeText(page, selector, input) {
    const inputelement = await page.waitForSelector(selector);
    try {
        await inputelement.type(input);
    }
    catch (error) {
        console.log(error);
    }
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        executablePath: "/snap/bin/chromium"
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto("http://" + data.routerip);
    const title = await page.title();
    console.log(title);
    await TypeText(page, "#username", data.username);
    await TypeText(page, "#userpassword", data.password);
    await ClickWithSelector(page, "#loginBtn");
    const result = await page.evaluate(() => {
        openNav();
        document.getElementsByClassName("icon-menu-restart fa-2x")[0].click();
    });
    await ClickWithSelector(page,"#AlertBox > div.alertcontent > div.btngroup > div:nth-child(2) > button");
    await browser.close();
})();