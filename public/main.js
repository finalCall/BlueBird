var map = L.map('mapid').setView([28.619608, 77.227002], 15);
var src = document.querySelector("#src");
var des = document.querySelector("#des");
var dist_deliver = document.querySelector("#dist_deliver");
var cost_deliver = document.querySelector("#cost_deliver");

var curr = -1;
var flag1 = 0, flag2 = 0;

//------------------- Adding Map Component -----------------------

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1Ijoibm1ua2hyMjUwOSIsImEiOiJjazE5aGs2MGMwOXdkM2Rxd3BoYXNqMHQ1In0.gU2raRP-7GZ1VUxTHEeUsw'
}).addTo(map);


//------------------ Marker Icons -----------------

var sourceIcon = L.icon({
	iconUrl: 'icons/green.svg',
	//shadowUrl: 'leaf-shadow.png',

	iconSize: [45, 105], // size of the icon
	shadowSize: [50, 64], // size of the shadow
	iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
	shadowAnchor: [4, 62],  // the same for the shadow
	popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var destinationIcon = L.icon({
	iconUrl: 'icons/red.svg',
	//shadowUrl: 'leaf-shadow.png',

	iconSize: [45, 105], // size of the icon
	shadowSize: [50, 64], // size of the shadow
	iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
	shadowAnchor: [4, 62],  // the same for the shadow
	popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var droneIcon = L.icon({
	iconUrl: 'icons/drone.svg',
	//shadowUrl: 'leaf-shadow.png',

	iconSize: [45, 105], // size of the icon
	shadowSize: [50, 64], // size of the shadow
	iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
	shadowAnchor: [4, 62],  // the same for the shadow
	popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var packageacpt = L.icon({
	iconUrl: 'icons/box.svg',
	//shadowUrl: 'leaf-shadow.png',

	iconSize: [45, 105], // size of the icon
	shadowSize: [50, 64], // size of the shadow
	iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
	shadowAnchor: [4, 62],  // the same for the shadow
	popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var packagedlvr = L.icon({
	iconUrl: 'icons/drone(4).svg',
	//shadowUrl: 'leaf-shadow.png',

	iconSize: [45, 105], // size of the icon
	shadowSize: [50, 64], // size of the shadow
	iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
	shadowAnchor: [4, 62],  // the same for the shadow
	popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var droneHouseIcon = L.icon({
	iconUrl: 'icons/distribution.svg',
	//shadowUrl: 'leaf-shadow.png',

	iconSize: [60, 120], // size of the icon
	shadowSize: [50, 64], // size of the shadow
	iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
	shadowAnchor: [4, 62],  // the same for the shadow
	popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});


//scale
//L.control.scale().addTo(map);

//---------------------- WareHouse Locations ----------------
var wareHouseLat = [];
var wareHouseLong = [];
wareHouseLat[0] = 28.631200, wareHouseLong[0] = 77.223112; // 1 Connaught Place
wareHouseLat[1] = 28.625520, wareHouseLong[1] = 77.206917; // 2 Sacred Heart
wareHouseLat[2] = 28.613096, wareHouseLong[2] = 77.206917; // 3 Dalhousie Road
wareHouseLat[3] = 28.605500, wareHouseLong[3] = 77.223112; // 4 Pandara Park
wareHouseLat[4] = 28.613096, wareHouseLong[4] = 77.239307; // 5 Bhairon Marg
wareHouseLat[5] = 28.625520, wareHouseLong[5] = 77.239307; // 6 Sikandra Road


//--------------------------- Markers -------------------------

L.marker([wareHouseLat[0], wareHouseLong[0]], { icon: droneHouseIcon }).addTo(map); // 
L.marker([wareHouseLat[1], wareHouseLong[1]], { icon: droneHouseIcon }).addTo(map); // 
L.marker([wareHouseLat[2], wareHouseLong[2]], { icon: droneHouseIcon }).addTo(map); // 
L.marker([wareHouseLat[3], wareHouseLong[3]], { icon: droneHouseIcon }).addTo(map); // 
L.marker([wareHouseLat[4], wareHouseLong[4]], { icon: droneHouseIcon }).addTo(map); // 
L.marker([wareHouseLat[5], wareHouseLong[5]], { icon: droneHouseIcon }).addTo(map);

//---------------------- Distance Calculation ------------------

function getDistance(origin, destination) {
	// return distance in meters
	var lon1 = toRadian(origin[1]),
		lat1 = toRadian(origin[0]),
		lon2 = toRadian(destination[1]),
		lat2 = toRadian(destination[0]);

	var deltaLat = lat2 - lat1;
	var deltaLon = lon2 - lon1;

	var a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
	var c = 2 * Math.asin(Math.sqrt(a));
	var EARTH_RADIUS = 6371;
	return c * EARTH_RADIUS * 1000;
}

function toRadian(degree) {
	return degree * Math.PI / 180;
}

var sourceLat, sourceLong, destinationLat, destinationLong;

// ------------------------ Input : latlong Value ---------------------------
function getValues(e) {
	if (curr == 0) { // for source
		sourceLat = Number((e.latlng.lat).toFixed(4));
		sourceLong = Number((e.latlng.lng).toFixed(4));

		L.marker([sourceLat, sourceLong], { icon: sourceIcon }).addTo(map); // 
	}
	else if (curr == 1) { // for destination
		destinationLat = Number((e.latlng.lat).toFixed(4));
		destinationLong = Number((e.latlng.lng).toFixed(4));

		L.marker([destinationLat, destinationLong], { icon: destinationIcon }).addTo(map); //
	}

}

//------------------ Toggle Source/Destination ------------------------

function changeValueToDes() {
	if (curr == 0) {
		curr = 1;
		flag1 = 1;
	}
}

function changeValueToSrc() {
	curr = 0;
	flag2 = 1;
}

//----------------------- Event Listners -----------------------------

map.on('click', getValues);
src.addEventListener('click', changeValueToSrc);
des.addEventListener('click', changeValueToDes);
