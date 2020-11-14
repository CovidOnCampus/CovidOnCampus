var rhit = rhit || {};

rhit.MonitoringPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

		document.querySelector("#reportData").onclick = (event) => {
			window.location.href = `/reportDataPage.html`;
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