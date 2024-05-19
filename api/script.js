const axios = require("axios");
const dotenv = require('dotenv');

function getTime(){
    const currentDate = new Date();
    const format = { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' };
    const pstTime = currentDate.toLocaleString('en-US', format);
    const [month, day, year] = pstTime.split('/');
    const requiredTime = `${year}-${month}-${day}`;
    return requiredTime;
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

    await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/47.66789207038801,-121.93391247914877/today/tomorrow?&unitGroup=us&key=${apiKey}&contentType=json`)
    .then(res => {
        res.data.days.forEach(day => {
            const sunset = day.sunset;
            const today = getTime();
            
            const executionHoursData = day.hours.filter(hour => {
                const isToday = day.datetime === today;
                const isAfterSunset = hour.datetime >= sunset;
                const isBefore2AM = hour.datetime <= '02:00:00';
                if ((isToday && isAfterSunset) || (!isToday && isBefore2AM)) {
                    executionHoursTempArr.push(hour.temp); 
                    conditionsArr.push(hour.conditions);
                    return true; 
                }
                return false; 
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

const weatherResult = retreiveWeather();

module.exports = {weatherResult}