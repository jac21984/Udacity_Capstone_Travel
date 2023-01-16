function handleSubmit(event) {
	event.preventDefault()
	
	console.log('::: Form Submitted :::')

	//event listener on generate button
	document.getElementById('generate').addEventListener('click', ()=> {
		
		const locName = document.getElementById('dest').value;
		const travelDate = document.getElementById('travelDate').value;
		//clear fields
		//document.getElementById('zip').value = "";
		//document.getElementById('feelings').value = "";
		
		//api call
		getUser('/getGeoUser')
		.then((data) => {
			//console.log(data); // JSON data parsed by `data.json()` call
			const geoUser = data;
			getGeoData(locName, geoUser)
			//chain promises
			.then((data)=>{
				//send data to the server
				//console.log(data.geonames[0])
				postGeo('/add', {lng: data.geonames[0].lng, lat: data.geonames[0].lat, countryname: data.geonames[0].countryName})
			})
			//update Globe
			//.then(()=>updateGlobe());
			/* //update UI
			.then(()=>updateUI()); */
		});
	});

	//api call method
	const getGeoData = async (locName, geoUser, data = {}) => {
		
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		};
		//call the api with the url then wait for response
		//geoname url 'http://api.geonames.org/searchJSON?q=phoenix&maxRows=10&username=jac21984'
		//allorigins `https://api.allorigins.win/get?url=${encodeURIComponent(`http://api.geonames.org/searchjson?q=${locName}&maxRows=10&username=${geoUser}`)}`
		const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`http://api.geonames.org/searchJSON?q=${locName}&maxRows=10&username=${geoUser}`)}`, requestOptions)
		try{
			//get response 
			const receivedData = await res.json();
			//console.log('Returned data: ', receivedData);
			return JSON.parse(receivedData.contents);
		}
		//catch errors
		catch(error){
			console.log("error",error);
		}
	}

	//api call methods
	//get geoUser from server
	async function getUser(url = '', data = {}) {
		const res = await fetch(url, {
			method : 'POST',
			credentials : 'same-origin',
			headers : {
				'Content-Type': 'application/json',
			},
			body : JSON.stringify(data),
	  });
	  try{
			const userData = await res.json();
			//console.clear();
			//console.log("geo User");
			//console.log(userData);
			return(userData);
		}
		catch(error){
			console.log("error", error);
		}
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
		//console.log("data returned");
		//console.log(returnedData);
		return(returnedData);
	}
	catch(error){
		console.log("error", error);
	}
}

/* //update the globe
const updateGlobe = async ()=> {
	const req = await fetch('/all');
	try{
		const updatedData = await req.json();
		document.getElementById('earth_div').setView([updatedData.lng, updatedData.lat], 1);
	}
	catch(error){
		console.log("error", error);
	}
} */

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