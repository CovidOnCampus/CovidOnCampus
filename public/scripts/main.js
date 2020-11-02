var rhit = rhit || {};


rhit.FB_COLLECTION_REVIEWS = "Reviews";
rhit.FB_KEY_COMMENT = "Comment";
rhit.FB_KEY_RATING = "Rating";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.FB_KEY_AUTHOR = "Author";

rhit.fbMainPageManager = null;
rhit.fbMapPageManager = null;
rhit.fbMonitoringPageManager = null;
rhit.fbReviewsPageManager = null;
rhit.fbReportDataPageManager = null;


//From https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}   
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

rhit.Review = class {
	constructor(id, comment, rating) {
	  this.id = id;
	  this.comment = comment;
	  this.rating = rating;  
	}
}

rhit.ReviewsPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

		let ratingSelection = document.querySelector("#inputRating");
		document.querySelector("#cancelReview").onclick = (event) => {
			ratingSelection.selectedIndex = 0;
		}
		document.querySelector("#submitAddReview").onclick = (event) => {
			const comment = document.querySelector("#inputComment").value;
			const rating = document.querySelector("#inputRating").value;
			rhit.fbReviewsPageManager.add(comment, rating);
			ratingSelection.selectedIndex = 0;
		}

		rhit.fbReviewsPageManager.beginListening(this.updateView.bind(this));
	}

	_createReviewCard(review) {
		let reviewRating = null;
		if (review.rating == 1) {
			reviewRating = `<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite_border</i>
				<i class="material-icons favorite">favorite_border</i>
				<i class="material-icons favorite">favorite_border</i>
				<i class="material-icons favorite">favorite_border</i>`
		} else if (review.rating == 2) {
			reviewRating = `<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite_border</i>
				<i class="material-icons favorite">favorite_border</i>
				<i class="material-icons favorite">favorite_border</i>`
		} else if (review.rating == 3) {
			reviewRating = `<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite_border</i>
				<i class="material-icons favorite">favorite_border</i>`
		} else if (review.rating == 4) {
			reviewRating = `<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite_border</i>`
		} else if (review.rating == 5) {
			reviewRating = `<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite</i>
				<i class="material-icons favorite">favorite</i>`
		} else {
			console.error("Need to select a rating");
		}
		return htmlToElement(`<div class="card">
		<div class="card-body">
		  <div class="card-title">${review.comment}</div>
		  <div id="reviewDetails">
			<div class="card-changes">
				<i class="material-icons">edit</i>
				<i class="material-icons">delete</i>
			</div>
			<div class="card-rating">
				${reviewRating}
			</div>
		  </div>
		</div>
	  </div>`);
	}

	updateView() {
		const newList = htmlToElement('<div id="reviewsList"></div>');
		for (let i = 0; i < rhit.fbReviewsPageManager.length; i++) {
			const review = rhit.fbReviewsPageManager.getReviewAtIndex(i);
			const newCard = this._createReviewCard(review);
			newList.appendChild(newCard);
		}

		const oldList = document.querySelector("#reviewsList");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	
	}
};

rhit.FbReviewsPageManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_REVIEWS);
		this._unsubscribe = null;
	}

	add(comment, rating) {
		this._ref.add({
			[rhit.FB_KEY_COMMENT]: comment,
			[rhit.FB_KEY_RATING]: rating,
			[rhit.FB_KEY_AUTHOR]: rhit.fbAuthManager.uid,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function(docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
		});		
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50);

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

	getReviewAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const review = new rhit.Review(docSnapshot.id, 
			docSnapshot.get(rhit.FB_KEY_COMMENT), docSnapshot.get(rhit.FB_KEY_RATING));
		return review;
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

rhit.ReportDataPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

		document.querySelector("#reportDataSubmitButton").onclick = (event) => {
			console.log("submitted");
			//window.location.href = `/monitoringPage.html`;
		}

		rhit.fbReportDataPageManager.beginListening(this.updateView.bind(this));
	}

	updateView() {}
};

rhit.FbReportDataPageManager = class {
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

rhit.RecentDataPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();
		rhit.fbReportDataPageManager.beginListening(this.updateView.bind(this));
	}

	updateView() {}
};

rhit.FbRecentDataPageManager = class {
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

	if (document.querySelector("#reviewsPage")) {
		const location = urlParams.get("location");
		rhit.fbReviewsPageManager = new rhit.FbReviewsPageManager(uid, location);
		new rhit.ReviewsPageController();
	}

	if (document.querySelector("#monitoringPage")) {
		rhit.fbMonitoringPageManager = new rhit.FbMonitoringPageManager(uid);
		new rhit.MonitoringPageController();
	}

	if (document.querySelector("#reportDataPage")) {
		rhit.fbReportDataPageManager = new rhit.FbReportDataPageManager(uid);
		new rhit.ReportDataPageController();
	}

	if (document.querySelector("#recentDataPage")) {
		rhit.fbRecentDataPageManager = new rhit.FbRecentDataPageManager(uid);
		new rhit.RecentDataPageController();
	}

	if (document.querySelector("#loginPage")) {
		new rhit.LoginPageController();
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

