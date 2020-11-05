var rhit = rhit || {};

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



//use 146 for reference with the manager

//doc.query("#idForEachSymptom").value = CONSTANT (make a const for each symptom)
//example of this in reviews (input rating is a dropdown menu)

