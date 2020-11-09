var rhit = rhit || {};

rhit.RecentDataPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();
		this.updateView();
		rhit.fbRecentDataPageManager.beginListening(this.updateView.bind(this));
	}

	_createTable(report1, report2, report3) {		
		if (report1 == null) {
			return "";
		} else if (report2 == null) {
			return `<tr>
				<th scope="row">${report1.getNicerDate()}</th>
				<td>${report1.temperature} &#176;F</td>
				<td>${report1.getPositiveSymptoms()}</td>
			</tr>`;
		} else if (report3 == null) {
			return `<tr>
				<th scope="row">${report1.getNicerDate()}</th>
				<td>${report1.temperature} &#176;F</td>
				<td>${report1.getPositiveSymptoms()}</td>
			</tr>
			<tr>
				<th scope="row">${report2.getNicerDate()}</th>
				<td>${report2.temperature} &#176;F</td>
				<td>${report2.getPositiveSymptoms()}</td>
			</tr>`;
		} else {
			return `<tr>
				<th scope="row">${report1.getNicerDate()}</th>
				<td>${report1.temperature} &#176;F</td>
				<td>${report1.getPositiveSymptoms()}</td>
			</tr>
			<tr>
				<th scope="row">${report2.getNicerDate()}</th>
				<td>${report2.temperature} &#176;F</td>
				<td>${report2.getPositiveSymptoms()}</td>
			</tr>
			<tr>
				<th scope="row">${report3.getNicerDate()}</th>
				<td>${report3.temperature} &#176;F</td>
				<td>${report3.getPositiveSymptoms()}</td>
			</tr>`;
		}
	}

	updateView() {
		let report1 = null;
		let report2 = null;
		let report3 = null;

		for (let i = 0; i < rhit.fbRecentDataPageManager.length; i++) {
			const report = rhit.fbRecentDataPageManager.getReportAtIndex(i);
			console.log("User: ", report.user);
			console.log("Me: ", rhit.fbAuthManager.uid);
			if (report.user == rhit.fbAuthManager.uid) {
				report3 = report2;
				report2 = report1;
				report1 = report;
				console.log("Report1: ", report1);
				console.log(report1.timestamp.toDate().toDateString());
			}
		}

		let table = this._createTable(report1, report2, report3);

		document.querySelector("#recentDataBody").innerHTML = table;
	}
};

rhit.Report = class {
	constructor(id, chills, headache, tasteSmell, musclePain, cough, breathing, soreThroat, temperature, timestamp, user, highTemp) {
	  this.id = id;
	  this.chills = chills;
	  this.headache = headache;  
	  this.tasteSmell = tasteSmell;
	  this.musclePain = musclePain;
	  this.cough = cough;
	  this.breathing = breathing;
	  this.soreThroat = soreThroat;
	  this.temperature = temperature;
	  this.timestamp = timestamp;
	  this.user = user;
	  this.highTemp = highTemp;
	}

	getPositiveSymptoms() {
		let symptoms = [];
		if (this.chills == 1) {
			symptoms.push("Chills");
		}
		if (this.headache == 1) {
			symptoms.push("Headache");
		}
		if (this.tasteSmell == 1) {
			symptoms.push("Loss of taste/smell");
		}
		if (this.musclePain == 1) {
			symptoms.push("Muscle Pain");
		}
		if (this.cough == 1) {
			symptoms.push("New or worsening cough");
		}
		if (this.breathing == 1) {
			symptoms.push("Shortness of breath/difficulty breathing");
		}
		if (this.soreThroat == 1) {
			symptoms.push("Sore throat");
		}
		return symptoms.join("<br>");
	}

	getNicerDate() {
		return this.timestamp.toDate().toDateString();
	}
};

rhit.FbRecentDataPageManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MONITORING);
		this._unsubscribe = null;
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_TIMESTAMP).limit(50);

		if (this._uid == rhit.fbAuthManager.uid) {
			query = query.where(rhit.FB_KEY_USER, "==", this._uid);
		}

		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
    	});
	}

	stopListening() {
		this._unsubscribe();
	}

	getReportAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const report = new rhit.Report(docSnapshot.id, 
			docSnapshot.get(rhit.FB_KEY_CHILLS), docSnapshot.get(rhit.FB_KEY_HEADACHE), docSnapshot.get(rhit.FB_KEY_TASTE_SMELL), 
			docSnapshot.get(rhit.FB_KEY_MUSCLE_PAIN), docSnapshot.get(rhit.FB_KEY_COUGH), docSnapshot.get(rhit.FB_KEY_BREATHING),
			docSnapshot.get(rhit.FB_KEY_SORE_THROAT), docSnapshot.get(rhit.FB_KEY_TEMPERATURE), docSnapshot.get(rhit.FB_KEY_TIMESTAMP),
			docSnapshot.get(rhit.FB_KEY_USER), docSnapshot.get(rhit.FB_KEY_HIGH_TEMP));
		return report;
	}

	get length() {
		return this._documentSnapshots.length;
	}
};
