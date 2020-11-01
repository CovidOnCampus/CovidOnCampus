var rhit = rhit || {};

rhit.fbMainPageManager = null;
rhit.fbMapPageManager = null;
rhit.fbMonitoringPageManager = null;

rhit.MainPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

		document.querySelector("#interactiveMap").onclick = (event) => {
			window.location.href = `/mapPage.html`;
		}
		document.querySelector("#dailyMonitoring").onclick = (event) => {
			window.location.href = `/monitoringPage.html`;
		}
		rhit.fbMainPageManager.beginListening(this.updateView.bind(this));
	}

	updateView() {}
};

rhit.FbMainPageManager = class {
	constructor(uid) {
		console.log("Main Page");
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


rhit.MapPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

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


rhit.MonitoringPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

		document.querySelector("#reportData").onclick = (event) => {
			window.location.href = `/reportDataPage.html`;
		}
		document.querySelector("#recentData").onclick = (event) => {
			window.location.href = `/recentDataPage.html`;
		}

		rhit.fbMonitoringPageManager.beginListening(this.updateView.bind(this));
	}

	updateView() {}
};

rhit.FbMonitoringPageManager = class {
	constructor(uid) {
		console.log("Monitoring Page");
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


rhit.LoginPageController = class {
	constructor() {
		document.querySelector("#roseFireButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
		};
		if (rhit.fbAuthManager.isSignedIn) {
			window.location.href = `/`;
		}
	}
};

rhit.FbAuthManager = class {
	constructor() {
	  	this._user = null;
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) =>{
			this._user = user;
			changeListener();
			
		  });
	}
	signIn() {
		Rosefire.signIn("6155db65-adf5-4787-8a72-0eeb6b8c7857", (err, rfUser) => {
			if (err) {
			console.log("Rosefire error!", err);
			return;
			}
			console.log("Rosefire success!", rfUser);
			
			firebase.auth().signInWithCustomToken(rfUser.token).catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === 'auth/invalid-custom-token') {
					alert('The token you provided is not valid.');
				} else {
					console.error("Custom auth error", errorCode, errorMessage);
				}
			});
		});
	}

	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log("sign out error");
		});
	}

	get isSignedIn() {
		return !!this._user;
	}

	get uid() {
		return this._user.uid;
	}
};

rhit.checkForRedirects = function() {
	if (!document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		document.querySelector("#authButton").innerHTML = "Sign out";
		document.querySelector("#authButton").classList.remove("loginPageBtn");
		document.querySelector("#authButton").classList.add("signOutBtn");
	} else {
		document.querySelector("#authButton").innerHTML = "Login Page";
		document.querySelector("#authButton").classList.add("loginPageBtn");
		document.querySelector("#authButton").classList.remove("signOutBtn");
	}
};

rhit.initializePage = function() {
	const urlParams = new URLSearchParams(window.location.search);
	const uid = urlParams.get("uid");

	if (document.querySelector("#mainPage")) {
		rhit.fbMainPageManager = new rhit.FbMainPageManager(uid);
		new rhit.MainPageController();
	}

	if (document.querySelector("#mapPage")) {
		rhit.fbMapPageManager = new rhit.FbMapPageManager(uid);
		new rhit.MapPageController();
	}

	if (document.querySelector("#monitoringPage")) {
		rhit.fbMonitoringPageManager = new rhit.FbMonitoringPageManager(uid);
		new rhit.MonitoringPageController();
	}

	if (document.querySelector("#loginPage")) {
		new loginPage.LoginPageController();
	} 
};

rhit.setUpDropDown = function() {
	document.querySelector(".homePageBtn").onclick = (event) => {
		window.location.href = `/`;
	}
	document.querySelector(".mapPageBtn").onclick = (event) => {
		window.location.href = `/mapPage.html`;
	}
	document.querySelector(".monitoringPageBtn").onclick = (event) => {
		window.location.href = `/monitoringPage.html`;
	}
	if (rhit.fbAuthManager.isSignedIn) {
		document.querySelector(".signOutBtn").onclick = (event) => {
			rhit.fbAuthManager.signOut();
			window.location.href = `/`;
		}
	} else {
		document.querySelector(".loginPageBtn").onclick = (event) => {
			window.location.href = `/loginPage.html`;
		}
	}
};

rhit.main = function () {
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log("signed in=", rhit.fbAuthManager.isSignedIn);
		rhit.checkForRedirects();
		rhit.initializePage();
	})
};

rhit.main();

