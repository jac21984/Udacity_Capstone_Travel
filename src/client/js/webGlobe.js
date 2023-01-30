export var earth = new WE.map('earth_div');

function initialize() {
	
	getKey('/mapKey')
	.then((data) => {
		//webGL Earth
		//console.log(data); // JSON data parsed by `data.json()` call
		//var earth = new WE.map('earth_div');
		earth.setView([0, 0], 1);
		//earth.setView([33.44838, -112.0740], 10);
		//earth.setCenter(-103.72567, 35.17116);
		WE.tileLayer(data,{
			attribution: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>'
		}).addTo(earth);

		//console.log("globe 1 ", earth);

		//postGlobe('/newGlobe', earth)
		
		//var marker = WE.marker([33.44838, -112.0740]).addTo(earth);
        //marker.bindPopup("<b>Pheonix, AZ</b>", {maxWidth: 150, closeButton: true}).openPopup();

		/* // Start a simple rotation animation
		var before = null;
		requestAnimationFrame(function animate(now) {
			var c = earth.getPosition();
			var elapsed = before? now - before: 0;
			before = now;
			earth.setCenter([c[0], c[1] + 0.1*(elapsed/30)]);
			requestAnimationFrame(animate);
		}); */
		
		
	});
	 
}

//send to the server
/* const postGlobe = async (url = '', data = {})=>{
	const res = await fetch(url, {
		method : 'POST',
		credentials : 'same-origin',
		headers : {
			'Content-Type': 'application/json',
		},
		body : data,
	});
	try{
		const globeData = await res.json();
		return(globeData);
	}
	catch(error){
		console.log("error", error);
	}
} */

// Example POST method implementation:
async function getKey(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export { initialize }
