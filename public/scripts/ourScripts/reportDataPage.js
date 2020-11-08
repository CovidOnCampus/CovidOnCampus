var rhit = rhit || {};

rhit.ReportData = class {
	constructor(cough, difficultyBreathing, chills, musclePain, headache, soreThroat, tasteOrSmell, temp, highTemp) {
		this.cough = cough;
		this.difficultyBreathing = difficultyBreathing;
		this.chills = chills;
		this.musclePain = musclePain;
		this.headache = headache;
		this.soreThroat = soreThroat;
		this.tasteOrSmell = tasteOrSmell;
		this.temp = temp;
		this.highTemp = highTemp;
	}
};

rhit.ReportDataPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

		//create inputRating in html
		let ratingSelection = document.querySelector("#inputRating");
		document.querySelector("#cancelForm").onclick = (event) => {
			ratingSelection.selectedIndex = "No";
		}

		document.querySelector("#reportDataSubmitButton").onclick = (event) => {
			console.log("submitted");
			document.query("cough").value = cough;
			document.query("difficultyBreathing").value = difficultyBreathing;
			document.query("chills").value = chills;
			document.query("musclePain").value = musclePain;
			document.query("headache").value = headache;
			document.query("soreThroat").value = soreThroat;
			document.query("tasteOrSmell").value = tasteOrSmell;
			//window.location.href = `/monitoringPage.html`;
		}

		// document.querySelector("#submitAddForm").onclick = (event) => {
		// 	coughAnswer = document.querySelector("#cough").value;
		// 	breathingAnswer = document.querySelector("#difficultyBreathing").value;
		// 	chillsAnswer = document.querySelector("#chills").value;
		// 	musclePainAnswer = document.querySelector("#musclePain").value;
		// 	headacheAnswer = document.querySelector("#headache").value;
		// 	soreThroatAnswer = document.querySelector("#soreThroat").value;
		// 	tateOrSmellAnswer = document.querySelector("#tasteOrSmell").value;

		// 	rhit.fbReportDataPageManager.add(coughAnswer, breathingAnswer, chillsAnswer, musclePainAnswer, 
		// 		headacheAnswer, soreThroatAnswer, tateOrSmellAnswer);
		// 	//document.querySelector("#inputComment").value = "";
		// 	ratingSelection.selectedIndex = 0;
		// }

		rhit.fbReportDataPageManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		



	}
};

rhit.fbReportDataPageManager = class {
	constructor(uid) {
		this.uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MONITORING);
		this._unsubscribe = null;
	}

	add(cough, difficultyBreathing, chills, musclePain, headache, soreThroat, tasteOrSmell, temp, highTemp) {
		this._ref.add({
			[rhit.FB_KEY_COUGH]: cough,
			[rhit.FB_KEY_BREATHING]: difficultyBreathing,
			[rhit.FB_KEY_CHILLS]: chills,
			[rhit.FB_KEY_MUSCLE_PAIN]: musclePain,
			[rhit.FB_KEY_HEADACHE]: headache,
			[rhit.FB_KEY_SORE_THROAT]: soreThroat,
			[rhit.FB_KEY_TASTE_SMELL]: tasteOrSmell,
			[rhit.FB_KEY_TEMPERATURE]: temp,
			[rhit.FB_KEY_HIGH_TEMP]: highTemp,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function() {
			console.log("Document was added");
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
		});	
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_TIMESTAMP, "desc").limit(50);

		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}

	stopListening() {
		this._unsubscribe();
	}

};