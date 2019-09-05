const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths to express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        headTitle: "Curse Node.js",
        headCSSLink: "/css/main.css",
        headJSLink: "js/index.js",
        title: "Weather",
        name: "Node.js"
    })
})

app.get('/about', (req, res) => {
    res.send({
        about: [],
    })
});

app.get('/help', (req, res) => {
    res.send({
        help: [],
    })
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address."
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location }) => {
        if (error) {
            return res.send({ error });
        };

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address,
            });
        })
    });

    // res.send({
    //     forecast: "It is sunny",
    //     location: "Kharkiv",
    //     address: req.query.address,
    // })
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "You must provide search term."
        })
    }
    res.send({
        products: [],
    })
})

app.listen(4000, () => {
    console.log('Server is up on port 4000.')
});