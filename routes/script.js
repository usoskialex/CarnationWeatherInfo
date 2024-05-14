const puppeteer = require("puppeteer");
const axios = require("axios");
const dotenv = require('dotenv');

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

function calculateAvg(arr) {
    let sumOfTemp = 0;
    arr.forEach(temp =>{
        sumOfTemp = sumOfTemp + temp;
    })

    return sumOfTemp / arr.length;
}

function averageCondition(arr) {
    const conditionsTracker = {};
    let requiredCondition = "";
    let highest = 0;

    arr.forEach(el => {
        conditionsTracker[el] = (conditionsTracker[el] || 0) + 1;
    })
    for (const cond in conditionsTracker) {
        if (conditionsTracker[cond] > highest) {
            highest = conditionsTracker[cond];
            requiredCondition = cond;
        }
    }
    return requiredCondition;
}

const retreiveWeather = async () => {
    dotenv.config();
    const apiKey = process.env.API_KEY;
    const executionHoursTempArr = [];
    const executionDays = [];
    const conditionsArr = [];

    await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Carnation%2C%20WA/today/tomorrow?&unitGroup=us&key=${apiKey}&contentType=json`)
    .then(res => {
        res.data.days.forEach(day => {
            const sunset = day.sunset;
            const today = getTime();
            // Loop through each hour object within the hours array
            const executionHoursData = day.hours.filter(hour => {
                const isToday = day.datetime === today;
                const isAfterSunset = hour.datetime >= sunset;
                const isBefore2AM = hour.datetime <= '02:00:00';
                if ((isToday && isAfterSunset) || (!isToday && isBefore2AM)) {
                    executionHoursTempArr.push(hour.temp); // Push the temperature value at the current hour
                    conditionsArr.push(hour.conditions);
                    return true; // Keep this hour & conditions
                }
                return false; // Filter out this hour
            }).map(hour => ({
                day: day.datetime,
                datetime: hour.datetime,
                temp: hour.temp,
                humidity: hour.humidity,
                visibility: hour.visibility,
                conditions: hour.conditions
            }));
            executionDays.push(executionHoursData);
            return executionDays;
        }); 
    })
    .catch(err =>{
        console.log(err)
    });

    const weatherCard = {
        "ExecutionDays": executionDays,
        "Average Temperature": calculateAvg(executionHoursTempArr).toFixed(1),
        "Average Condition": averageCondition(conditionsArr)
    }
    return weatherCard;
}

//screenshotSaver();
const weatherResult = retreiveWeather();

module.exports = {weatherResult}