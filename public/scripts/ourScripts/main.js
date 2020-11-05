var rhit = rhit || {};


rhit.FB_COLLECTION_REVIEWS = "Reviews";
rhit.FB_COLLECTION_LOCATIONS = "Locations";
rhit.FB_KEY_BUILDING = "Building";
rhit.FB_KEY_DESCRIPTION = "Location Description";
rhit.FB_KEY_TYPE = "Location Type";
rhit.FB_KEY_COMMENT = "Comment";
rhit.FB_KEY_RATING = "Rating";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.FB_KEY_AUTHOR = "Author";

rhit.fbMainPageManager = null;
rhit.fbMapPageManager = null;
rhit.fbMonitoringPageManager = null;
rhit.fbReviewsPageManager = null;
rhit.fbReportDataPageManager = null;
rhit.fbRecentDataPageManager = null;


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

