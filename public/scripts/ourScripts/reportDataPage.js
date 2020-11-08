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



//added
document.query("cough").value = cough;
document.query("difficultyBreathing").value = difficultyBreathing;
document.query("chills").value = chills;
document.query("musclePain").value = musclePain;
document.query("headache").value = headache;
document.query("soreThroat").value = soreThroat;
document.query("tasteOrSmell").value = tasteOrSmell;

rhit.FbReportDataPageManager = class {
	constructor(cough, difficultyBreathing, chills, musclePain, headache, soreThroat, tasteOrSmell) {
		rhit.setUpDropDown();

		let coughAnswer = document.querySelector("#cough");
		let breathingAnswer = document.querySelector("#difficultyBreathing");
		let chillsAnswer = document.querySelector("#chills");
		let musclePainAnswer = document.querySelector("#musclePain");
		let headacheAnswer = document.querySelector("#headache");
		let soreThroatAnswer = document.querySelector("#soreThroat");
		let tateOrSmellAnswer = document.querySelector("#tasteOrSmell");

		document.querySelector("#cancelForm").onclick = (event) => {
			ratingSelection.selectedIndex = 0;
		}

		//not sure how to add form?
		document.querySelector("#fabAddForm").onclick = (event) => {
			if (rhit.fbAuthManager.isSignedIn) {
				$("#addForm").modal("show");
				$('#addForm').on('shown.bs.modal', (event) => {
					document.querySelector("#inputComment").focus();
				});
			} else {
				alert("You must be signed in to fill out a form");
			};
		}

		document.querySelector("#submitAddForm").onclick = (event) => {
			coughAnswer = document.querySelector("#cough").value;
			breathingAnswer = document.querySelector("#difficultyBreathing").value;
			chillsAnswer = document.querySelector("#chills").value;
			musclePainAnswer = document.querySelector("#musclePain").value;
			headacheAnswer = document.querySelector("#headache").value;
			soreThroatAnswer = document.querySelector("#soreThroat").value;
			tateOrSmellAnswer = document.querySelector("#tasteOrSmell").value;

			rhit.fbReviewsPageManager.add(coughAnswer, breathingAnswer, chillsAnswer, musclePainAnswer, 
				headacheAnswer, soreThroatAnswer, tateOrSmellAnswer);
			//document.querySelector("#inputComment").value = "";
			ratingSelection.selectedIndex = 0;
		}

		rhit.fbReviewsPageManager.beginListening(this.updateView.bind(this));
	}

	add() {}

	beginListening(changeListener) {}

	stopListening() {
		this._unsubscribe();
	}

};

//needed?

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

