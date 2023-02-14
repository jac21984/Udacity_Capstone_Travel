const mods = require('./webGlobe')
var earth = mods.earth

//event listener on generate button
//document.getElementById('generate').addEventListener('click', handleSubmit);

async function handleSubmit(event) {
	
	console.log('::: Form Submitted :::')
		
		const locName = document.getElementById('dest').value;
		const travelDate = document.getElementById('travelDate').value;
		//const globe = document.getElementById('earth_div')
		//console.log("earth 2 is ", mods.earth)
		//clear fields
		//document.getElementById('zip').value = "";
		//document.getElementById('feelings').value = "";
		
		//api call
		getGeoData(locName)
		//chain promises
		.then((geoData)=>{
			//get boundries
			getNomBound(geoData.name)
			.then((nomData)=>{
				//send data to the server
				//console.log(nomData)
				//postGeo('/add', {name: geoData.geonames[0].name, lat: geoData.geonames[0].lat, lng: geoData.geonames[0].lng, countryname: geoData.geonames[0].countryName, bounds: nomData[0].boundingbox, poly: nomData[0].geojson})
				//update globe position
				updateGlobe(nomData)
				//update UI
				//updateUI()
			})
		})
	//});
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
		//console.log("/geoData res: ", receivedData.geonames[0]);
		return receivedData.geonames[0];
		res.end()
	}
	//catch errors
	catch(error){
		console.log("error",error);
	}
}
	
//api for getting map boundries from nominatim
const getNomBound = async (nomName, data = {}) => {
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data)
	};
	//call the api with the url then wait for response
	const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${nomName}&limit=1&format=jsonv2&polygon_geojson=1`, requestOptions)
	try{
		//get response 
		const receivedData = await res.json();
		//console.log("nom data: ", receivedData); 
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
	console.log(nomData.boundingbox);
	earth.panInsideBounds(nomData.boundingbox);
	
	//*****start here nomination site need exclude teritories
	//https://nominatim.org/release-docs/develop/api/Overview/
}

/* //update the ui
const updateUI = async ()=> {
	const req = await fetch('/all');
	try{
		const updatedData = await req.json();
		document.getElementById('date').textContent = updatedData.date;
		document.getElementById('temp').textContent = updatedData.temp.name + " - " + updatedData.temp.temp + " °F";
		document.getElementById('content').textContent = updatedData.feeling;
	}
	catch(error){
		console.log("error", error);
	}
} */

export { handleSubmit }