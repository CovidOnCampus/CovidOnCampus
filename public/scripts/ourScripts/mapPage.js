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

		document.querySelector("#fabAddLocation").onclick = (event) => {
			if (rhit.fbAuthManager.isAdmin) {
				$("#addLocation").modal("show");
		
				$('#addLocation').on('shown.bs.modal', (event) => {
					document.querySelector("#inputLocation").focus();
				});
			} else {
				$("#invalidUser").modal("show");
			}
		}

		document.querySelector("#submitAddLocation").onclick = (event) => {
			const location = document.querySelector("#inputLocation").value;
			const building = document.querySelector(".modal-title").innerHTML;
			const type = document.querySelector(".modal-subtitle").innerHTML;
			rhit.fbMapPageManager.add(location, building, type);
			document.querySelector("#inputLocation").value = "";
		}

		this._clickFeature('sanitizingStations', 'Sanitizing Station', this._findLocations, this._createLocationCard, this._deleteLocation, map);
		this._clickFeature('restrooms', 'Restroom', this._findLocations, this._createLocationCard, this._deleteLocation, map);
		this._clickFeature('testingDropOff', 'Testing Drop Off', this._findLocations, this._createLocationCard, this._deleteLocation, map);

		let popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		this._hoverFeature('sanitizingStations', popup, map);
		this._hoverFeature('restrooms', popup, map);
		this._hoverFeature('testingDropOff', popup, map);

		rhit.fbMapPageManager.beginListening(this.updateView.bind(this));
	};

	_createLocationCard = function(location) {
		let locationRating = rhit.getRatingHTML(location);
	
		return htmlToElement(`<div class="card">
		<div class="card-body">
		  <div class="card-title">${location.description}</div>
		  <div class="card-rating">${locationRating}</div>
		  <div class="card-trash">
			<i class="material-icons delete">delete</i>
		  </div>
		</div>
	  </div>`)
	};

	_deleteLocation(locationId) {
		$("#deleteLocationDialog").modal("show");

		document.querySelector("#submitDeleteLocation").onclick = (event) => {
			rhit.fbMapPageManager.delete(locationId);
			$("#locationsWithRatings").modal("hide");
		};
	}
	
	_findLocations(type, building, createLocationCard, deleteLocation) {
		document.querySelector(".modal-title").innerHTML = building;
		document.querySelector(".modal-subtitle").innerHTML = type;
	
		const newList = htmlToElement('<div id="locationsRatingList"></div>');
		for (let i = 0; i < rhit.fbMapPageManager.length; i++) {
			const location = rhit.fbMapPageManager.getLocationAtIndex(i);
			if (location.type == type && location.building == building) {
				const newCard = createLocationCard(location);
				newCard.querySelector(".card-trash").onclick = (event) => {
					if (rhit.fbAuthManager.isAdmin) {
						deleteLocation(location.id);
					} else {
						$("#invalidUser").modal("show");
					};
				};
				newCard.querySelector(".card-title").onclick = (event) => {
					window.location.href = `/reviewsPage.html?location=${location.id}`;
				};
				newCard.querySelector(".card-rating").onclick = (event) => {
					window.location.href = `/reviewsPage.html?location=${location.id}`;
				};
				
				newList.appendChild(newCard);
			}
		}
	
		const oldList = document.querySelector("#locationsRatingList");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	};

	_clickFeature(layer, layerDef, findLocations, createCard, deleteLocation, map) {
		map.on('click', layer, function (e) {
			var description = e.features[0].properties.description;
			findLocations(layerDef, description, createCard, deleteLocation);
			$("#locationsWithRatings").modal("show");
		});
	}

	_hoverFeature(layer, popup, map) {
		map.on('mouseenter', layer, function (e) {
			var coordinates = e.features[0].geometry.coordinates.slice();
			var description = e.features[0].properties.description;
			 
			map.getCanvas().style.cursor = 'pointer';
			
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
			coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}
			 
			popup.setLngLat(coordinates).setHTML(description).addTo(map);
		});

		map.on('mouseleave', layer, function () {
			map.getCanvas().style.cursor = '';
			popup.remove();
		});
	}

	updateView() {}
};


rhit.Location = class {
	constructor(id, building, description, type, rating) {
	  this.id = id;
	  this.building = building;
	  this.description = description; 
	  this.type = type;
	  this.rating = rating; 
	}
}

rhit.FbMapPageManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_LOCATIONS);
		this._unsubscribe = null;
	}

	add(location, building, type) {
		this._ref.add({
			[rhit.FB_KEY_BUILDING]: building,
			[rhit.FB_KEY_RATING]: 0,
			[rhit.FB_KEY_TYPE]: type,
			[rhit.FB_KEY_DESCRIPTION]: location,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function(docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
		});	
	}

	delete(locationId) {
		this._ref.doc(locationId).delete().then(function () {
			console.log("Document successfully deleted!");
		}).catch(function (error) {
			console.log("Error removing document: ", error);
		});
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_RATING).limit(50);

		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
    	});
	}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getLocationAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const location = new rhit.Location(docSnapshot.id, 
			docSnapshot.get(rhit.FB_KEY_BUILDING), docSnapshot.get(rhit.FB_KEY_DESCRIPTION), docSnapshot.get(rhit.FB_KEY_TYPE), docSnapshot.get(rhit.FB_KEY_RATING));
		return location;
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

//Used by Reviews Page as well
rhit.getRatingHTML = function(doc) {
	let rating = null;
	if (doc.rating >= 4.5) {
		rating = `<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite</i>`
	} else if (doc.rating >= 3.5) {
		rating = `<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite_border</i>`
	} else if (doc.rating >= 2.5) {
		rating = `<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite_border</i>
			<i class="material-icons favorite">favorite_border</i>`
	} else if (doc.rating >= 1.5) {
		rating = `<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite_border</i>
			<i class="material-icons favorite">favorite_border</i>
			<i class="material-icons favorite">favorite_border</i>`
	} else if (doc.rating >= 0.5) {
		rating = `<i class="material-icons favorite">favorite</i>
			<i class="material-icons favorite">favorite_border</i>
			<i class="material-icons favorite">favorite_border</i>
			<i class="material-icons favorite">favorite_border</i>
			<i class="material-icons favorite">favorite_border</i>`
	} else {
		console.log("Need to select a rating");
		rating = `<div class=favorite>No Reviews yet</div>`
	}

	return rating;
};