const mods = require('./webGlobe')

var earth = mods.earth
var marker = mods.marker
var poly = mods.poly
var options = mods.options

var geoLat = 0;
var geoLon = 0;

var tempOut = 0;
var precipOut = 0;
var snowOut = 0;
var weatherOut = "";
var iconOut = "https://cdn-icons-png.flaticon.com/512/214/214025.png";
var picOut = "https://cdn.pixabay.com/photo/2012/04/02/13/33/globe-24502_1280.png";


/* var tHelpers = require('@turf/helpers');
var tArea = require('@turf/area');
var tCOM = require('@turf/center-of-mass'); */

/* import polygon from '@turf/helpers';
import area from '@turf/area';
import centerOfMass from '@turf/center-of-mass'; */

var helpers = require('@turf/helpers');
var invariant = require('@turf/invariant');
import area from '@turf/area';
import envelope from '@turf/envelope';
import centerOfMass from '@turf/center-of-mass'
import flip from '@turf/flip';
import flatten from '@turf/flatten';
import unkinkPolygon from '@turf/unkink-polygon'
import union from '@turf/union'
import cleanCoords from '@turf/clean-coords'

 
//event listener on generate button
//document.getElementById('generate').addEventListener('click', handleSubmit);

async function handleSubmit(event) {
	
	console.log('::: Form Submitted :::')
		
	const locName = document.getElementById('dest').value;
	const travelDate = document.getElementById('travelDate').value;
	
	//api call
	getGeoData(locName)
	.then((geoInfo)=>{
		//console.log(geoInfo)
		getPBData(geoInfo)
		.then((pbData)=>{
			//console.log("getting image....");
			//console.log(pbData.total);
			//console.log(pbData);
			if (pbData.total = 0){
				//default pic: https://cdn.pixabay.com/photo/2016/10/18/20/18/international-1751293_1280.png
				var pbPic = "https://cdn.pixabay.com/photo/2016/10/18/20/18/international-1751293_1280.png"
			}else{
				var pbPic = pbData.hits[0].previewURL;
			}
			
			picOut = pbPic;
			//console.log("PicURL: ");
			//console.log(picOut);
		})
	})
	
	getNomData(locName)
	.then((nomData)=>{
		updateGlobe(nomData)
		getWBData(nomData,travelDate)
		.then((wbData)=>{
			tempOut = wbData.data[0].temp + "°F";
			precipOut = wbData.data[0].precip + " in/hr";
			snowOut = wbData.data[0].snow + " in/hr";
			weatherOut = wbData.data[0].weather.description;
			iconOut = "https://cdn.weatherbit.io/static/img/icons/" + wbData.data[0].weather.icon + ".png";
			
			//console.log("Weather: ");
			//console.log("Temp: " + tempOut + ", Precipitation: " + precipOut + ", Snow: " + snowOut + ", Weather: " + weatherOut + ", Icon: " + iconOut)
		
			//update UI
			updateUI();
		})
	})
		
	event.preventDefault();
}

//api call method
const getGeoData = async (locName, data = {}) => {
	data = {locName: locName}
	
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data)
	};
	//call the api and wait for response
	const res = await fetch('/geoData', requestOptions)
	try{
		//get response 
		const receivedData = await res.json();
		return receivedData.geonames[0];
		res.end()
	}
	//catch errors
	catch(error){
		console.log("error",error);
	}
}

	
//api for getting map boundries from nominatim
const getNomData = async (nomName, data = {}) => {
	
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data)
	};
	
	//call the api with the url then wait for response
	const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${nomName}&polygon_threshold=.05&limit=1&format=jsonv2&polygon_geojson=1`, requestOptions)
	try{
		//get response 
		const receivedData = await res.json();
		return receivedData[0] //JSON.parse(receivedData);
		res.end();
	}
	//catch errors
	catch(error){
		console.log("error",error);
	}
}
	


//send to the server
const postGeo = async (url = '', data = {})=>{
	const res = await fetch(url, {
		method : 'POST',
		credentials : 'same-origin',
		headers : {
			'Content-Type': 'application/json',
		},
		body : JSON.stringify(data),
	});
	try{
		const returnedData = await res.json();
		return(returnedData);
		res.end()
	}
	catch(error){
		console.log("error", error);
	}
}

//update the globe
function updateGlobe(nomData){
	
	var max_area_polygon = [];
	var max_area = 0 ;
	
	//console.log(nomData);
	//console.log(nomData.geojson);
	var geom = flatten(cleanCoords(nomData.geojson));
	var geoms = geom.features;
	//console.log(geom);
	
	if (geoms.length > 1){
		//console.log("mulipolygon");
		for(var polycount in geoms){
			var polyarea = area(geoms[polycount]);
			
			if(polyarea > max_area){
				max_area = polyarea; //largest area
				max_area_polygon = geoms[polycount]; // polygon with the largest area
			}
		}
	} else {
		//console.log("single polygon");
		max_area = area(geoms[0]);
		max_area_polygon = geoms[0];
	}
	
	//console.log(max_area_polygon);
	
	max_area_polygon = flip(max_area_polygon);
	
	var env = envelope(max_area_polygon).bbox;
		
	var boundbox = ([env[0],env[2],env[1],env[3]]);
		
	var center = centerOfMass(max_area_polygon).geometry.coordinates;
	
	var bbVL = boundbox[1] - boundbox[0];
	var bbHL = boundbox[4] - boundbox[3];
	
	var bbScale = 0;
	
	if (bbHL >= bbVL){
		bbScale = bbHL*.1;
	}else{
		bbScale = bbVL*.1;
	}
	
	var bigBB = [parseFloat(boundbox[0])-bbScale,parseFloat(boundbox[1])+bbScale,parseFloat(boundbox[2])-bbScale,parseFloat(boundbox[3])+bbScale];
		
	marker.removeFrom(earth);
	marker.addTo(earth);
	marker.bindPopup('<b>'+nomData.display_name+'</b>');
	marker.setLatLng([center[0],center[1]]);
	
	earth.panInsideBounds(bigBB);
	
	var polycoords = max_area_polygon.geometry.coordinates[0];
	//console.log(polycoords);
	
	removePoly();
	poly = WE.polygon(polycoords, options).addTo(earth);
}

function removePoly() {
    if (!poly) return;
    poly.destroy();
    poly = null;
}

//api for getting weather info from weatherbit
const getWBData = async (nomData,travelDate, data = {}) => {
	data = {wbLat: nomData.lat, wbLng: nomData.lon, wbDate: travelDate}
	
	//console.log(data);
	
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data)
	};
	//call the api and wait for response
	const res = await fetch('/wbData', requestOptions)
	try{
		//get response 
		const receivedData = await res.json();
		return receivedData;
		res.end()
	}
	//catch errors
	catch(error){
		console.log("error",error);
	}
}

//api for getting image info from pixabay
const getPBData = async (geoInfo, data = {}) => {
	data = {geoInfo: geoInfo}
	
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data)
	};
	//call the api and wait for response
	const res = await fetch('/pbData', requestOptions)
	try{
		//get response 
		const receivedData = await res.json();
		return receivedData;
		res.end()
	}
	//catch errors
	catch(error){
		console.log("error",error);
	}
}

//update the ui
function updateUI() {

	document.getElementById('temp').textContent = tempOut;
	document.getElementById('precip').textContent = precipOut;
	document.getElementById('snow').textContent = snowOut;
	document.getElementById('weath').textContent = weatherOut;
	document.getElementById('weathIcon').src = iconOut;
	document.getElementById('piximg').src = picOut;

}

export { handleSubmit }