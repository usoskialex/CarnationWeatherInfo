import puppeteer from "puppeteer";

const weatherUrl = "https://www.google.com/search?q=weather+google+carnation+wa";

function getTime(){
    const currentDate = new Date();
    const year = currentDate.getFullYear(); 
    const month = currentDate.getMonth() + 1; // +1 to get current month
    const day = currentDate.getDate(); 
    const requiredTime = `${year}-${month}-${day}`;
    return requiredTime;
}

const screenshotSaver = async () => {
    const screenshotName = getTime();
    const browser = await puppeteer.launch();
    const webPage = await browser.newPage();
    await webPage.goto(weatherUrl);
    await webPage.screenshot({path: `screenshoot/${screenshotName}.jpg`});    
    await browser.close();
}

screenshotSaver();