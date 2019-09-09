const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const youtube = require('./utils/youtube');

const app = express();
const port = process.env.PORT || 4000;

// Define paths to express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
const componentsPath = path.join(__dirname, '../templates/components');


// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
hbs.registerPartials(componentsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        headTitle: "Curse Node.js",
        headCSSLink: "/css/main.css",
        headJSLink: "",
        JSLink: "js/index.js",
        title: "Weather",
        name: "Node.js",
        placeholder: "Location..",
        weather: true
    })
})

app.get('/youtube', (req, res) => {
    res.render('index', {
        headTitle: "YouTube",
        headCSSLink: "/css/main.css",
        headJSLink: "",
        JSLink: "js/search-youtube.js",
        title: "YouTube",
        name: "Node.js",
        placeholder: "Movies..",
        youtube: true
    })
})

app.get('/youtube-api', (req, res) => {
    if (!req.query.movie) {
        return res.send({
            error: "You must state name of movie."
        });
    }

    youtube(req.query.movie, (callback) => {
        res.send({
            movie: callback
        })
    });
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

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
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
    })
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

app.get('*', (req, res) => {
    res.render('404', {
        headCSSLink: "/css/main.css",
    });
})

app.listen(port, () => {
    console.log('Server is up on port ' + port + ' !')
});