var rhit = rhit || {};

rhit.RecentDataPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();
		rhit.fbReportDataPageManager.beginListening(this.updateView.bind(this));
	}

	updateView() {}
};

rhit.FbRecentDataPageManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_LOCATIONS);
		this._unsubscribe = null;
	}

	add() {}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_TIMESTAMP).limit(50);

		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
    	});
	}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}
};
