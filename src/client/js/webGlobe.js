export var options = {color: '#8080FF', opacity: 1, fillColor: '#8080FF', fillOpacity: 0.3, weight: 2};
export var earth = new WE.map('earth_div',{dragging: false, tilting: false, zooming: false});
export var marker = WE.marker([33.44838, -112.0740]);
export var poly;

function initialize() {
	
	getKey('/mapKey')
	.then((data) => {
		//webGL Earth
		earth.setView([33.44838, -112.0740], 1.75);
		WE.tileLayer(data,{
			attribution: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>'
		}).addTo(earth);
		poly.destroy();
		poly = null;
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
