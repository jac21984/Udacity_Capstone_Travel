// Setup empty JS object
const projectData = {};
const geoData = {};
const nomData = {};
const wbData = {};

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

app.get('/test', function (req, res) {
    res.json(mockAPIResponse);
})

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
			console.log("geo error: ", error)
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

//get data from weatherbit
app.post('/wbData', (req, res)=> {
	//get location and user
	wbData.wbLat = req.body.wbLat;
	wbData.wbLng = req.body.wbLng;
	wbData.wbDate = req.body.wbDate;
	wbKey = process.env.WB_KEY_2;
	
	const date = new Date();
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const fulldate = year + "-" + month + "-" + day;
	
	/* console.log("Date: ");
	console.log(wbData.wbDate); */
	
	// calc no. of days between two dates
	var today = new Date();
	
    //set two dates
    var date1 = new Date(today.getTime());
    var date2 = new Date(wbData.wbDate);
	
	/* console.log("Date 1: ")
	console.log(date1.toString());
	
	console.log("Date 2: ")
	console.log(date2.toString()); */
      
    // To calculate the time difference of two dates
    var diffTime = date2.getTime() - date1.getTime();
      
    // To calculate the no. of days between two dates
    var diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
      
    //To display the final no. of days (result)
    //console.log("Total number of days between dates " + date1 + " and " + date2 + " is:  "  + diffDays);
	
	if (diffDays > 7){
		//weatherbit example https://api.weatherbit.io/v2.0/current?lat=41.8719&lon=12.5674&key=fd679b7d21f943fea639305b454e1f60&include=minutely
		wbUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${wbData.wbLat}&lon=${wbData.wbLng}&key=${wbKey}&units=I`;
	}else{
		//weatherbit example https://api.weatherbit.io/v2.0/current?lat=41.8719&lon=12.5674&key=fd679b7d21f943fea639305b454e1f60&include=minutely
		wbUrl = `https://api.weatherbit.io/v2.0/current?lat=${wbData.wbLat}&lon=${wbData.wbLng}&key=${wbKey}&include=minutely&units=I`;
	}

	//console.log(wbUrl);
	
	request(wbUrl, (error, response, body)=> { 
		if (!error && response.statusCode === 200) { 
			//console.log(body);
			res.send(body);
			res.end();
		} else {
			console.log("wberror: ", error)
			console.log("status code: ", response.statusCode)
		} 
	});
		
})

//get data from pixabay
app.post('/pbData', (req, res)=> {
	//get location and user
	geoInfo = req.body.geoInfo;
	pbKey = process.env.PIX_KEY;
	
	//console.log(geoInfo);
	
	var pbQuery = encodeURIComponent(geoInfo.name);
	
	//console.log(pbQuery);
	
	//pixabay example https://pixabay.com/api/?key=29514060-59244f1c5b098df6af1c1739a&q=phoenix+arizona&category=travel&image_type=photo&pretty=true&safesearch=true
	pbUrl = `https://pixabay.com/api/?key=${pbKey}&q=${pbQuery}&category=places&image_type=photo&safesearch=true`;

	//console.log(pbUrl);
	
	request(pbUrl, (error, response, body)=> { 
		if (!error && response.statusCode === 200) { 
			//console.log(body);
			res.send(body);
			res.end();
		} else {
			console.log("pberror: ", error)
			console.log("status code: ", response.statusCode)
		} 
	});
	
})

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Setup Server
const port = 5000;
const host = "localhost";

const server = app.listen(port, host, () => {
    console.log(`Starting Proxy at: ${host}:${port}`)
	//console.log(`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${process.env.MAP_KEY}`);
});