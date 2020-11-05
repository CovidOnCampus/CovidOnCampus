var rhit = rhit || {};

rhit.MapPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

		mapboxgl.accessToken = 'pk.eyJ1IjoianVyZ2Vua3IiLCJhIjoiY2tmdm1sNzdoMGFraDJwazBxeWpkZnBrOCJ9.dQrct7WODcutN-X2IZKXGg';
        const bounds = [[-87.333, 39.48], [-87.320139, 39.485]];
		
		var map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-87.3240, 39.4828],
          zoom: 15,
          maxBounds: bounds
		});

		map.on("load", function() {
			rhit.addLayers(map);
		});
		
		document.querySelector("#testingReviewsPage").onclick = (event) => {
			window.location.href = `/reviewsPage.html`;
		};

		document.querySelector("#sanitizingButton").onclick = (event) => {
			map.setLayoutProperty('sanitizingStations', 'visibility', 'visible');
			map.setLayoutProperty('restrooms', 'visibility', 'none');
			map.setLayoutProperty('testingDropOff', 'visibility', 'none');		
		};

		document.querySelector("#restroomButton").onclick = (event) => {
			map.setLayoutProperty('restrooms', 'visibility', 'visible');
			map.setLayoutProperty('testingDropOff', 'visibility', 'none');
			map.setLayoutProperty('sanitizingStations', 'visibility', 'none');
		};

		document.querySelector("#dropOffButton").onclick = (event) => {
			map.setLayoutProperty('testingDropOff', 'visibility', 'visible');
			map.setLayoutProperty('sanitizingStations', 'visibility', 'none');
			map.setLayoutProperty('restrooms', 'visibility', 'none');
		};

		map.on('click', 'sanitizingStations', function (e) {
			$("#testReviewDialog").modal("show");
		});

		map.on('click', 'restrooms', function (e) {
			$("#testReviewDialog").modal("show");
		});

		map.on('click', 'testingDropOff', function (e) {
			$("#testReviewDialog").modal("show");
		});


		rhit.fbMapPageManager.beginListening(this.updateView.bind(this));
	}

	updateView() {}
};

rhit.FbMapPageManager = class {
	constructor(uid) {
		this._uid = uid;
	  	this._documentSnapshots = [];
		this._unsubscribe = null;
	}

	add() {}

	beginListening(changeListener) {}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}
};

rhit.MapPins = class {
	constructor(description, coordinates) {
		this._description = description;
		this._coordinates = coordinates;
	}

	get pin() {
		return {
			'type': 'Feature',
			'properties': {
				'description': this._description,
				'icon': 'mapPin'
			},
			'geometry': {
				'type': 'Point',
				'coordinates': this._coordinates
			}
		};
	}
}
rhit.olinPin = new rhit.MapPins('Olin Hall', [-87.324573, 39.482850]).pin;

rhit.olinLobbyPin = new rhit.MapPins('Olin Hall Lobby', [-87.325229, 39.482809]).pin;

rhit.hadleyPin = new rhit.MapPins('Hadley Hall', [-87.324015, 39.482937]).pin;

rhit.hadleyCirclePin = new rhit.MapPins('Hadley Hall Circle', [-87.324040, 39.482806]).pin;

rhit.myersPin = new rhit.MapPins('Myers Hall', [-87.323036, 39.483987]).pin;

rhit.moenchPin = new rhit.MapPins('Moench Hall', [-87.323749, 39.483606]).pin;

rhit.moenchCommonsPin = new rhit.MapPins('Moench Hall Commons', [-87.324005, 39.483696]).pin;

rhit.crapoPin = new rhit.MapPins('Crapo Hall', [-87.324471, 39.483734]).pin;

rhit.libraryPin = new rhit.MapPins('Library', [-87.324905, 39.483423]).pin;

rhit.unionPin = new rhit.MapPins('Union', [-87.326831, 39.483509]).pin;

rhit.unionCirclePin = new rhit.MapPins('Union Circle', [-87.326551, 39.483109]).pin;

rhit.hatfieldPin = new rhit.MapPins('Hatfield Hall', [-87.322207, 39.482225]).pin;

rhit.pubSafePin = new rhit.MapPins('Public Safety', [-87.320412, 39.481931]).pin;


rhit.addLayers = function(map) {
	map.loadImage(
		"../../images/MapPin.png",
		function (error, image) {
			if (error) throw error;
			map.addImage("mapPin", image);
	
			map.addSource('sanitizingStations', {
				'type': 'geojson',
				'data': {
					'type': 'FeatureCollection',
					'features': [rhit.unionPin, rhit.libraryPin, rhit.crapoPin, rhit.moenchPin, rhit.myersPin, rhit.hadleyPin, rhit.olinPin, rhit.hatfieldPin]
				}
			});
			map.addLayer({
				'id': 'sanitizingStations',
				'type': 'symbol',
				'source': 'sanitizingStations',
				'layout': {
					'icon-image': '{icon}',
					'icon-allow-overlap': true,
					'icon-size': 0.025,
					'visibility': 'none'
				}
			});

			map.addSource('restrooms', {
				'type': 'geojson',
				'data': {
					'type': 'FeatureCollection',
					'features': [rhit.unionPin, rhit.libraryPin, rhit.crapoPin, rhit.moenchPin, rhit.myersPin, rhit.hadleyPin, rhit.olinPin]
				}
			});
			map.addLayer({
				'id': 'restrooms',
				'type': 'symbol',
				'source': 'restrooms',
				'layout': {
					'icon-image': '{icon}',
					'icon-allow-overlap': true,
					'icon-size': 0.025,
					'visibility': 'none'
				}
			});

			map.addSource('testingDropOff', {
				'type': 'geojson',
				'data': {
					'type': 'FeatureCollection',
					'features': [rhit.unionPin, rhit.hadleyCirclePin, rhit.unionCirclePin, rhit.moenchCommonsPin, rhit.pubSafePin, rhit.olinLobbyPin]
				}
			});
			map.addLayer({
				'id': 'testingDropOff',
				'type': 'symbol',
				'source': 'testingDropOff',
				'layout': {
					'icon-image': '{icon}',
					'icon-allow-overlap': true,
					'icon-size': 0.025,
					'visibility': 'none'
				}
			});
		}
	);
}


