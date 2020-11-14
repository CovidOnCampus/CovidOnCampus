var rhit = rhit || {};

rhit.MonitoringPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

		document.querySelector("#reportData").onclick = (event) => {
			window.location.href = `/reportDataPage.html`;
			firebase.firestore().collection(rhit.FB_COLLECTION_MONITORING).doc(rhit.fbReviewsPageManager.locId).get().then(function(doc) {
				if (doc.exists) {
					let building = doc.get(rhit.FB_KEY_BUILDING);
					let description = doc.get(rhit.FB_KEY_DESCRIPTION);
					let type = doc.get(rhit.FB_KEY_TYPE);
					let rating = doc.get(rhit.FB_KEY_RATING);
					document.querySelector("#reviewsTitle").innerHTML = `<h3>${building}</h3><h5>Reviews for ${description} ${type}</h5>
																			<h6>Current rating is ${rating.toFixed(2)}`;
				} else {
					console.log("No such document!");
				}
			}).catch(function(error) {
				console.log("Error getting document:", error);
			});
		}
		document.querySelector("#recentData").onclick = (event) => {
			window.location.href = `/recentDataPage.html`;
		}
		document.querySelector("#personalPastReports").onclick = (event) => {
			window.location.href = `/pastReportsPage.html`;
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