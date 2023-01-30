// Setup empty JS object
const projectData = {};
/* var globe = {}; */

// Require Express
const express = require("express");

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require("body-parser");

/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
const { json } = require("body-parser");
app.use(cors());

// main project folder
app.use(express.static('dist'));

//get environmentals
const dotenv = require('dotenv');
dotenv.config();

// Setup Server
const port = 5000;

const server = app.listen(port, () => {
    console.log(`runnning on local host: ${port}`)
	//console.log(`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${process.env.MAP_KEY}`);
  });

//Get Route
app.get('/all', (req, res)=> {
    //convert data to json
    const geoData = JSON.stringify(projectData);
    //send data
    res.send(geoData);
    //console.log("data from get route");
    //console.log(geoData);
})

//Post Route
app.post('/add', (req, res)=> {
    //store received data
    projectData.lng = req.body.lng;
    projectData.lat = req.body.lat;
    projectData.countryname = req.body.countryname;
	console.log("Post Received", projectData);
	res.send(projectData);
})

const mapkey = process.env.MAP_KEY
const globeUrl = 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key='

app.post('/mapKey', (req, res)=> {
	const newUrl = globeUrl + mapkey
	//console.log(newUrl)
	res.send(JSON.stringify(newUrl))
})

/* app.post('/newGlobe', (req, res)=> {
	globe = req.body.globe;
	console.log("globe 2 ", globe);
	res.send(globe)
}) */

const geoUser = process.env.GEO_NAME_USER

app.post('/getGeoUser', (req, res)=> {
	//console.log(geoUser)
	res.send(JSON.stringify(geoUser))
})