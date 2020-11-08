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






//added

document.query("cough").value = cough;
document.query("difficultyBreathing").value = cough;
document.query("chills").value = cough;
document.query("musclePain").value = cough;
document.query("headache").value = cough;
document.query("soreThroat").value = cough;
document.query("tasteOrSmell").value = cough;


rhit.FbMapPageManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_LOCATIONS);
		this._unsubscribe = null;
	}


	// beginListening(changeListener) {
	// 	let query = this._ref.orderBy(rhit.FB_KEY_RATING).limit(50);

	// 	this._unsubscribe = query.onSnapshot((querySnapshot) => {
	// 		this._documentSnapshots = querySnapshot.docs;
	// 		changeListener();
    // 	});
	// }
	// stopListening() {
	// 	this._unsubscribe();
	// }

};


//use 146 for reference with the manager

//doc.query("#idForEachSymptom").value = CONSTANT (make a const for each symptom)
//example of this in reviews (input rating is a dropdown menu)

