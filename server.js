const script = require('./routes/script')

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

app.get('/', async (req, res) => {
    const result = await script.weatherResult;
    const executionDays = result.ExecutionDays;

    let html = '<ul>'; // Start an unordered list

    // Iterate over each execution day array
    executionDays.forEach(dayArray => {
        dayArray.forEach(day => {
            html += `<li>Date: ${day.day}, Time: ${day.datetime}, Temperature: ${day.temp}, Humidity: ${day.humidity}, Visibility: ${day.visibility}, Conditions: ${day.conditions}</li>`;
        });
    });

    html += '</ul>'; // Close the unordered list

    // Add the average temperature to the HTML
    html += `<p>Average Temperature: ${result['Average Temperature']}</p>`;

    // Send the HTML to the browser
    //const data = res.send(html);
    res.render('index', { data: html });
});
  
app.listen(port, () => {
    console.log(`Weather app listening on port ${port}`);
});