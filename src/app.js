const path = require('path');
const express = require('express');
const hbs = require('hbs');
const youtube = require('./utils/youtube');

const app = express();
const { PORT = 4000 } = process.env;

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

app.get('/', (req, res) => {
    res.render('index', {
        headTitle: "YouTube",
        headCSSLink: "/css/main.css",
        headJSLink: "",
        JSLink: "js/search-youtube.js",
        title: "YouTube",
        name: "Node.js",
        placeholder: "Enter search keys...",
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
        help: [
            '/youtube-api'
        ],
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        headCSSLink: "/css/main.css",
    });
})

app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT)
});
