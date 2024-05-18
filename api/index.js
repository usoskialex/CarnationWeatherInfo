const script = require('./script')

const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

app.use(express.static('public'));
app.set('views', 'views');
app.set("view engine", "ejs");



app.get('/', async (req, res) => {
    try {
        const result = await script.weatherResult;
        const executionDays = result.ExecutionDays;
    
        let html = '<div class="wrapper">';
    
        // Iterate over each execution day array
        executionDays.forEach(dayArray => {
            dayArray.forEach(day => {
                html +=
                `
                 <div class="dayInfo">
                    <p  id="weather-date"><span class="date-time-format">Date: ${day.day}</span></p>
                    <p  id="weather-time"><span class="date-time-format">Time: ${day.datetime}</span></p>
                    <p  id="weather-temp">Temperature: ${day.temp}&#8457;</p>
                    <p  id="weather-humidity">Humidity: ${day.humidity}%</p>
                    <p  id="weather-visibility">Visibility: ${day.visibility}m</p>
                    <p  id="weather-conditions">Conditions: ${day.conditions}</p>
                 </div>`;
            });
        });
        html += '</div>';
        html += `<p id="weather-average">Average Temperature: ${result['Average Temperature']}&#8457;</p>`;
        html += `<p id="weather-average">Average Condition: ${result['Average Condition']}</p>`
        // Send the HTML to the browser
        res.render('', { data: html });
    } catch (error) {
        console.error('Error rendering index:', error);
        res.status(500).send('Internal Server Error');
    }
});
  
app.listen(port, () => {
    console.log(`Weather app listening on port ${port}`);
});

export default app;