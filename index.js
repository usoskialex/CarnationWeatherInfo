import puppeteer from "puppeteer";
import axios from "axios";
import dotenv from 'dotenv';

function getTime(){
    const currentDate = new Date();
    const year = currentDate.getFullYear(); 
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding leading zero so the format matches the response from API call
    const day = currentDate.getDate().toString().padStart(2, '0');
    const requiredTime = `${year}-${month}-${day}`;
    return requiredTime;
}

const screenshotSaver = async () => {
    const screenshotUrl = "https://www.google.com/search?q=weather+google+carnation+wa";
    const screenshotName = getTime();
    const browser = await puppeteer.launch();
    const webPage = await browser.newPage();
    await webPage.goto(screenshotUrl);
    await webPage.screenshot({path: `screenshoot/${screenshotName}.jpg`});    
    await browser.close();
}

const retreiveWeather = async () => {
    dotenv.config();

    const apiKey = process.env.API_KEY;
    const weatherData = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Carnation%2C%20WA/today/tomorrow?unitGroup=us&key=${apiKey}&contentType=json`)
    .then(res => {
        res.data.days.forEach(day => {
            const sunset = day.sunset;
            const today = getTime();
            // Loop through each hour object within the hours array
            const executionHoursData = day.hours.filter(hour => ((hour.datetime >= sunset && day.datetime === today) || (hour.datetime <= '02:00:00' && day.datetime !== today))).map(hour => ({
                day: day.datetime,
                datetime: hour.datetime,
                temp: hour.temp,
                humidity: hour.humidity,
                visibility: hour.visibility,
                conditions: hour.conditions
            }));
            //console.log(executionHoursTemp)
            console.log(executionHoursData)
            return executionHoursData;
        });
    })
    .catch(err =>{
        console.log(err)
    });
    return weatherData;
}
console.log(getTime());
//retreiveWeather();
//screenshotSaver();

retreiveWeather();