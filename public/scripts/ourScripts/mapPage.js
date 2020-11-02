var rhit = rhit || {};

rhit.MapPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

		document.querySelector("#testingReviewsPage").onclick = (event) => {
			window.location.href = `/reviewsPage.html`;
		}

		mapboxgl.accessToken = 'pk.eyJ1IjoianVyZ2Vua3IiLCJhIjoiY2tmdm1sNzdoMGFraDJwazBxeWpkZnBrOCJ9.dQrct7WODcutN-X2IZKXGg';
        const bounds = [[-87.333, 39.48], [-87.3215, 39.485]]
        var map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-87.3240, 39.4828],
          zoom: 15,
          maxBounds: bounds
		});
		// var geojson = {
		// 	type: 'FeatureCollection',
		// 	features: [{
		// 	  type: 'Feature',
		// 	  geometry: {
		// 		type: 'Point',
		// 		coordinates: [-77.032, 38.913]
		// 	  },
		// 	  properties: {
		// 		title: 'Mapbox',
		// 		description: 'Washington, D.C.'
		// 	  }
		// 	},
		// 	{
		// 	  type: 'Feature',
		// 	  geometry: {
		// 		type: 'Point',
		// 		coordinates: [-122.414, 37.776]
		// 	  },
		// 	  properties: {
		// 		title: 'Mapbox',
		// 		description: 'San Francisco, California'
		// 	  }
		// 	}]
		//   };


		rhit.fbMapPageManager.beginListening(this.updateView.bind(this));
	}

	updateView() {}
};

rhit.FbMapPageManager = class {
	constructor(uid) {
		console.log("Map Page");
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