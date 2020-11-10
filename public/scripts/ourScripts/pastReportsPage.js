var rhit = rhit || {};


// Based off of JavaScript code from https://www.sliderrevolution.com/resources/html-calendar/

rhit.PastReportsPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();
		this.updateView();
		rhit.fbPastReportsPageManager.beginListening(this.updateView.bind(this));
    }
    
    _updateBack(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        document.querySelector("#dateSelected").innerHTML = `${date.toLocaleString('en-us', options)}`;

        let report = rhit.fbPastReportsPageManager.getReportByDate(date);
        if (report) {
            document.querySelector(".info").innerHTML = `<p>
            Temperature: <span>${report.temperature} &#176;F</span>
            </p>
            <p>
                  Symptoms: <br><span>${report.getPositiveSymptoms()}</span>
            </p>`;

            // document.querySelector(".info-temp span").innerHTML = `${report.temperature} &#176;F`;
            // document.querySelector(".symptoms span").innerHTML = `${report.getPositiveSymptoms()}`;
        } else {
            document.querySelector(".info").innerHTML = `<h2>No Report on this day</h2>`;
        }
    }

	_frontToBack(front, back, date, update) {
        document.querySelector("#calendar").classList.toggle("flip");
        front.fadeOut(900);
        front.hide();
        
        update(date);
        back.show();
    }

    _backToFront(back, front) {
        document.querySelector("#calendar").classList.toggle("flip");
        
        back.fadeOut(900);
        back.hide();
        
        front.show();
    }

	updateView() {
        let dates = document.querySelectorAll(".weeks span");
        let month = document.querySelector("#specificDate .month").innerHTML;
        if (month.charAt(0) == 'O') {
            month = 9;
        } else {
            month = 10;
        }

        for (const date of dates) {
            date.onclick = (event) => {
                let dateValue = new Date(2020, month, date.innerHTML);
                this._frontToBack($('.front'), $('.back'), dateValue, this._updateBack);
            };
        }

        document.querySelector("#dismissButton").onclick = (event) => {
            this._backToFront($('.back'), $('.front'));
        };
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

rhit.FbPastReportsPageManager = class {
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
    
    getReportByDate(date) {
        let betterDate = firebase.firestore.Timestamp.fromDate(date);
        console.log(betterDate);
        console.log(date);
        for (let i = 0; i < rhit.fbPastReportsPageManager.length; i++) {
            let docSnapshot = this._documentSnapshots[i];
            console.log("Timestamp: ", docSnapshot.get(rhit.FB_KEY_TIMESTAMP).toDate().toDateString());
            console.log("Date: ", date.toDateString());
			if (docSnapshot.get(rhit.FB_KEY_TIMESTAMP).toDate().toDateString() == date.toDateString()) {
				return this.getReportAtIndex(i);
			}
        }
        return null;
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