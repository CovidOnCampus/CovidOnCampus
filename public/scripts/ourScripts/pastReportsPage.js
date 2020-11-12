var rhit = rhit || {};

rhit.pad = function(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
};

// Based off of JavaScript code from https://www.sliderrevolution.com/resources/html-calendar/

rhit.PastReportsPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();
		this.updateView();

		document.querySelector("#goButton").onclick = (event) => {
			if (document.querySelector("#inputMonth").value == "October") {
				document.querySelector("#specificDate .month").innerHTML = "October 2020";
			} else {
				document.querySelector("#specificDate .month").innerHTML = "November 2020"
			}		
			document.querySelector("#inputMonth").value = 0;
			this.updateView();	
		};

		rhit.fbPastReportsPageManager.beginListening(this.updateView.bind(this));
    }
    
    _updateBack(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        document.querySelector("#dateSelected").innerHTML = `${date.toLocaleString('en-us', options)}`;

		let report = rhit.fbPastReportsPageManager.getReportByDate(date);
		console.log(report);
        if (report) {
            document.querySelector(".info").innerHTML = `<p>
            Temperature: <span>${report.temperature} &#176;F</span>
            </p>
            <p>
                  Symptoms: <br><span>${report.getPositiveSymptoms()}</span>
            </p>`;
        } else {
			console.log("No report");
            document.querySelector(".info").innerHTML = `<h2>No Report on this day</h2>`;
        }
    }

	_frontToBack(front, back, date, update) {
        document.querySelector("#calendar").classList.toggle("flip");
        front.fadeOut(700);
        front.hide();
        
        update(date);
        back.show();
    }

    _backToFront(back, front) {
        document.querySelector("#calendar").classList.toggle("flip");
        
        back.fadeOut(700);
        back.hide();
        
        front.show();
	}
	
	_setUpNovember() {
		let firstWeek = `<div class="first">`;
		for (let i = 1; i < 8; i++) {
			let date = new Date(2020, 10, i);
			if (rhit.fbPastReportsPageManager.getReportByDate(date)) {
				firstWeek += `<span class="event">${rhit.pad(i, 2)}</span>`;
			} else {
				firstWeek += `<span>${rhit.pad(i, 2)}</span>`
			}
		}
		firstWeek += `</div>`;

		let secondWeek = `<div class="second">`;
		for (let i = 8; i < 15; i++) {
			let date = new Date(2020, 10, i);
			if (rhit.fbPastReportsPageManager.getReportByDate(date)) {
				secondWeek += `<span class="event">${rhit.pad(i, 2)}</span>`;
			} else {
				secondWeek += `<span>${rhit.pad(i, 2)}</span>`
			}
		}
		secondWeek += `</div>`;

		let thirdWeek = `<div class="third">`;
		for (let i = 15; i < 22; i++) {
			let date = new Date(2020, 10, i);
			if (rhit.fbPastReportsPageManager.getReportByDate(date)) {
				thirdWeek += `<span class="event">${rhit.pad(i, 2)}</span>`;
			} else {
				thirdWeek += `<span>${rhit.pad(i, 2)}</span>`
			}
		}
		thirdWeek += `</div>`;

		let fourthWeek = `<div class="fourth">`;
		for (let i = 22; i < 29; i++) {
			let date = new Date(2020, 10, i);
			if (rhit.fbPastReportsPageManager.getReportByDate(date)) {
				fourthWeek += `<span class="event">${rhit.pad(i, 2)}</span>`;
			} else {
				fourthWeek += `<span>${rhit.pad(i, 2)}</span>`
			}
		}
		fourthWeek += `</div>`;

		let fifthWeek = `<div class="fifth">`;
		for (let i = 29; i < 31; i++) {
			let date = new Date(2020, 10, i);
			if (rhit.fbPastReportsPageManager.getReportByDate(date)) {
				fifthWeek += `<span class="event">${rhit.pad(i, 2)}</span>`;
			} else {
				fifthWeek += `<span>${rhit.pad(i, 2)}</span>`
			}
		}
		for (let i = 1; i < 6; i++) {
			fifthWeek += `<span class="last-month">${rhit.pad(i, 2)}</span>`
		}
		fifthWeek += `</div>`;

		document.querySelector(".weeks").innerHTML = firstWeek + secondWeek + thirdWeek + fourthWeek + fifthWeek;
	}

	_setUpOctober() {
		let firstWeek = `<div class="first">`;
		for (let i = 27; i < 31; i++) {
			firstWeek += `<span class="last-month">${rhit.pad(i, 2)}</span>`
		}
		for (let i = 1; i < 4; i++) {
			let date = new Date(2020, 9, i);
			if (rhit.fbPastReportsPageManager.getReportByDate(date)) {
				firstWeek += `<span class="event">${rhit.pad(i, 2)}</span>`;
			} else {
				firstWeek += `<span>${rhit.pad(i, 2)}</span>`
			}
		}
		firstWeek += `</div>`;

		let secondWeek = `<div class="second">`;
		for (let i = 4; i < 11; i++) {
			let date = new Date(2020, 9, i);
			if (rhit.fbPastReportsPageManager.getReportByDate(date)) {
				secondWeek += `<span class="event">${rhit.pad(i, 2)}</span>`;
			} else {
				secondWeek += `<span>${rhit.pad(i, 2)}</span>`
			}
		}
		secondWeek += `</div>`;

		let thirdWeek = `<div class="third">`;
		for (let i = 11; i < 18; i++) {
			let date = new Date(2020, 9, i);
			if (rhit.fbPastReportsPageManager.getReportByDate(date)) {
				thirdWeek += `<span class="event">${rhit.pad(i, 2)}</span>`;
			} else {
				thirdWeek += `<span>${rhit.pad(i, 2)}</span>`
			}
		}
		thirdWeek += `</div>`;

		let fourthWeek = `<div class="fourth">`;
		for (let i = 18; i < 25; i++) {
			let date = new Date(2020, 9, i);
			if (rhit.fbPastReportsPageManager.getReportByDate(date)) {
				fourthWeek += `<span class="event">${rhit.pad(i, 2)}</span>`;
			} else {
				fourthWeek += `<span>${rhit.pad(i, 2)}</span>`
			}
		}
		fourthWeek += `</div>`;

		let fifthWeek = `<div class="fifth">`;
		for (let i = 25; i < 32; i++) {
			let date = new Date(2020, 9, i);
			if (rhit.fbPastReportsPageManager.getReportByDate(date)) {
				fifthWeek += `<span class="event">${rhit.pad(i, 2)}</span>`;
			} else {
				fifthWeek += `<span>${rhit.pad(i, 2)}</span>`
			}
		}
		fifthWeek += `</div>`;

		document.querySelector(".weeks").innerHTML = firstWeek + secondWeek + thirdWeek + fourthWeek + fifthWeek;
	}

	updateView() {
        let month = document.querySelector("#specificDate .month").innerHTML;
        const options = { weekday: 'long', day: '2-digit'};
        let date = new Date(Date.now());
        if (month.charAt(0) == 'O') {
            month = 9;
            this._setUpOctober();
        } else {
            month = 10;
           
            if (date.getDate() == 1 || date.getDate() == 21 || date.getDate() == 31) {
                document.querySelector("#specificDate .day").innerHTML = date.toLocaleString('en-gb', options) + "st";
            } else if(date.getDate() == 2 || date.getDate() == 22) {
                document.querySelector("#specificDate .day").innerHTML = date.toLocaleString('en-gb', options) + "nd";
            } else if(date.getDate() == 3 || date.getDate() == 23) {
                document.querySelector("#specificDate .day").innerHTML = date.toLocaleString('en-gb', options) + "rd";
            } else {
                document.querySelector("#specificDate .day").innerHTML = date.toLocaleString('en-gb', options) + "th";
            }
            
            this._setUpNovember();
		}

		let dates = document.querySelectorAll(".weeks span");
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
        for (let i = 0; i < rhit.fbPastReportsPageManager.length; i++) {
            let docSnapshot = this._documentSnapshots[i];
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