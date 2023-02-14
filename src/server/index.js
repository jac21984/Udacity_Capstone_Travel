// Setup empty JS object
const projectData = {};
const geoData = {};
const nomData = {};

// Require Express
const express = require("express");
// Require Request
const request = require("request");
//Require Morgan
//const morgan = require("morgan");
//Require proxy-middleware
//const { createProxyMiddleware } = require('http-proxy-middleware');

// Start up an instance of app
const app = express();

//no cache
const nocache = require('nocache');

app.use(nocache());

/* Dependencies */
const bodyParser = require("body-parser");

/* Middleware*/

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb' }));

const { json } = require("body-parser");

const cors=require("cors");

app.use(cors());

// main project folder
app.use(express.static('dist'));

//get environmentals
const dotenv = require('dotenv');
dotenv.config();

//Get Route
/* app.get('/all', (req, res)=> {
    //convert data to json
    const geoNameData = JSON.stringify(projectData);
    //send data
    res.send(geoNameData);
}) */

//****start here trying to build my own proxy server
//https://www.geeksforgeeks.org/how-to-build-a-node-js-proxy-server/
//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
//need to add polygon to globe
//https://sites.google.com/site/webglearth/

//get data from geonames.org
app.post('/geoData', (req, res)=> {
	//get location and user
	geoData.locName = req.body.locName;
	geoData.geoUser = process.env.GEO_NAME_USER;
	
	//geonames example http://api.geonames.org/searchJSON?q=Arizona&maxRows=1&username=jac21984
	geoUrl = `http://api.geonames.org/searchJSON?q=${geoData.locName}&maxRows=1&username=${geoData.geoUser}`;

	//console.log(geoUrl);
	
	request(geoUrl, (error, response, body)=> { 
		if (!error && response.statusCode === 200) { 
			//console.log(body);
			res.send(body);
			res.end();
		} else {
			console.log("error: ", error)
			console.log("status code: ", response.statusCode)
		} 
	});
		
})

//Post Route
app.post('/add', (req, res)=> {
    //store received data
	projectData.name = req.body.name;
	projectData.lat = req.body.lat;
    projectData.lng = req.body.lng;
    projectData.countryname = req.body.countryname;
	projectData.bounds = req.body.bounds;
	projectData.poly = req.body.poly;
	console.log("Post Received", projectData);
	res.send(projectData);
	res.end();
})


//send updated map url
const mapkey = process.env.MAP_KEY
const globeUrl = process.env.GLOBE_URL

app.post('/mapKey', (req, res)=> {
	const newUrl = globeUrl + mapkey
	//console.log(newUrl)
	res.send(JSON.stringify(newUrl))
	res.end();
})

// Setup Server
const port = 5000;
const host = "localhost";

const server = app.listen(port, host, () => {
    console.log(`Starting Proxy at: ${host}:${port}`)
	//console.log(`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${process.env.MAP_KEY}`);
});