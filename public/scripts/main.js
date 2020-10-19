var rhit = rhit || {};

rhit.fbMainPageManager = null;


rhit.MainPageController = class {
	constructor() {
		rhit.fbMainPageManager.beginListening(this.updateView.bind(this));

		this.setUpDropDown();
		
	}

	setUpDropDown() {
		document.querySelector(".homePageBtn").onclick = (event) => {
			window.location.href = `/`;
		}
		document.querySelector(".mapPageBtn").onclick = (event) => {
			window.location.href = `/mapPage.html`;
		}
		document.querySelector(".monitoringPageBtn").onclick = (event) => {
			window.location.href = `/monitoringPage.html`;
		}
		document.querySelector(".loginPageBtn").onclick = (event) => {
			window.location.href = `/loginPage.html`;
		}
	}

	updateView() {}
}

rhit.FbMainPageManager = class {
	constructor() {
		console.log("created FbMainPageManager");
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
}

rhit.main = function () {
	console.log("Ready");

	rhit.fbMainPageManager = new rhit.FbMainPageManager();
	new rhit.MainPageController();

	// if (document.querySelector("#mainPage")) {
	// 	rhit.fbMainPageManager = new rhit.FbMainPageManager();
	// 	new rhit.MainPageController();
	// }
};

rhit.main();
