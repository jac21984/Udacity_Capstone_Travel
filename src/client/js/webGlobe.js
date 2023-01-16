function initialize() {
	
	getKey('/mapKey')
	.then((data) => {
		//webGL Earth
		//console.log(data); // JSON data parsed by `data.json()` call
		var earth = new WE.map('earth_div');
		earth.setView([0, 0], 1);
		WE.tileLayer(data,{
			attribution: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>'
		}).addTo(earth);

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