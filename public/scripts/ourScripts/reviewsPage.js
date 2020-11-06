var rhit = rhit || {};

rhit.fbLogger = null;
rhit.Review = class {
	constructor(id, comment, rating, location, author) {
	  this.id = id;
	  this.comment = comment;
	  this.rating = rating;  
	  this.location = location;
	  this.author = author;
	}
};

rhit.ReviewsPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

		let ratingSelection = document.querySelector("#inputRating");
		document.querySelector("#cancelReview").onclick = (event) => {
			ratingSelection.selectedIndex = 0;
		}
		document.querySelector("#fabAddReview").onclick = (event) => {
			if (rhit.fbAuthManager.isSignedIn) {
				$("#addReview").modal("show");
			} else {
				alert("You must be signed in to leave a review");
			};
		}
		document.querySelector("#submitAddReview").onclick = (event) => {
			const comment = document.querySelector("#inputComment").value;
			const rating = document.querySelector("#inputRating").value;
			rhit.fbReviewsPageManager.add(comment, rating);
			ratingSelection.selectedIndex = 0;
		}

		rhit.fbLogger = new rhit.LocationsLoggerManager();
		rhit.fbLogger.beginListening(this.updateView.bind(this));
		rhit.fbReviewsPageManager.beginListening(this.updateView.bind(this));
	}

	_createReviewCard(review) {
		let reviewRating = rhit.getRatingHTML(review);
		let cardChanges = "";
		if (rhit.fbAuthManager.isSignedIn) {
			if (review.author == rhit.fbAuthManager.uid) {
				cardChanges = `<i class="material-icons edit">edit</i>
				<i class="material-icons delete">delete</i>`;
			} 
		}

		return htmlToElement(`<div class="card">
		<div class="card-body">
		  <div class="card-title">${review.comment}</div>
		  <div id="reviewDetails">
			<div class="card-changes">${cardChanges}</div>
			<div class="card-rating">${reviewRating}</div>
		  </div>
		</div>
	  </div>`);
	}

	_editReview(comment, rating) {
		$("#editReviewDialog").modal("show");
		console.log(comment, rating);
		
		$('#editReviewDialog').on('show.bs.modal', (event) => {
			//Pre animation
			document.querySelector("#inputNewComment").value = comment;
			document.querySelector("#inputNewRating").value = parseInt(rating);
		});

		$('#editReviewDialog').on('shown.bs.modal', (event) => {
			//Post animation
			document.querySelector("#inputNewComment").focus();
		});
	}

	updateView() {
		const newList = htmlToElement('<div id="reviewsList"></div>');

		let building = rhit.fbReviewsPageManager.building;
		let description = rhit.fbReviewsPageManager.description;
		let type = rhit.fbReviewsPageManager.type;
		document.querySelector("#reviewsTitle").innerHTML = `<h3>${building}</h3><h5>Reviews for ${description} ${type}</h5>`;

		for (let i = 0; i < rhit.fbReviewsPageManager.length; i++) {
			const review = rhit.fbReviewsPageManager.getReviewAtIndex(i);
			const newCard = this._createReviewCard(review);
			if (newCard.querySelector(".card-changes").innerHTML != "") {
				newCard.querySelector(".edit").onclick = (event) => {
					console.log("edit this item");
					let comment = review.comment;
					let rating = review.rating;
					this._editReview(comment, rating);
				};
				newCard.querySelector(".delete").onclick = (event) => {
					console.log("delete this item");
					$("#deleteReviewDialog").modal("show");
				};
			};
			
			newList.appendChild(newCard);
		}

		const oldList = document.querySelector("#reviewsList");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	
	}
};

rhit.FbReviewsPageManager = class {
	constructor(uid, locId, description, building, type) {
		this._uid = uid;
		this._locId = locId;
		this._description = description;
		this._building = building;
		this._type = type;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_REVIEWS);
		this._unsubscribe = null;
	}

	add(comment, rating) {
		this._ref.add({
			[rhit.FB_KEY_COMMENT]: comment,
			[rhit.FB_KEY_RATING]: rating,
			[rhit.FB_KEY_AUTHOR]: rhit.fbAuthManager.uid,
			[rhit.FB_KEY_LOCATION_ID]: this._locId,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function(docRef) {
			let rating = 0;
			let count = 0;
			for (let i = 0; i < rhit.fbReviewsPageManager.length; i++) {
				const review = rhit.fbReviewsPageManager.getReviewAtIndex(i);
				if (review.location == rhit.fbReviewsPageManager.locId) {
					rating += parseInt(review.rating);
					count++;
				}
			}
			rating = rating / count;
			console.log(rating);
			rhit.fbLogger.update(rating, rhit.fbReviewsPageManager.locId);
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
		});		
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50);
		if (this._locId) {
			query = query.where(rhit.FB_KEY_LOCATION_ID, "==", this._locId);
		} else {
			console.error("Need a location")
		}

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

	get locId() {
		return this._locId;
	}

	get description() {
		return this._description;
	}
	
	get building() {
		return this._building;
	}

	get type() {
		return this._type;
	}

	getReviewAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const review = new rhit.Review(docSnapshot.id, 
			docSnapshot.get(rhit.FB_KEY_COMMENT), docSnapshot.get(rhit.FB_KEY_RATING), docSnapshot.get(rhit.FB_KEY_LOCATION_ID), docSnapshot.get(rhit.FB_KEY_AUTHOR));
		return review;
	}
};


rhit.LocationsLoggerManager = class {
	constructor() {
		// this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_LOCATIONS);
		this._unsubscribe = null;
	}

	update(rating, location) {
		console.log("updated location");
		this._ref.doc(location).update({
			[rhit.FB_KEY_RATING]: rating,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function() {
			console.log("Document successfully updated");
		})
		.catch(function(error) {
			console.error("Error updating document: ", error);
		});		
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_RATING).limit(50);

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

	getLocationById(id) {
		for (let i = 0; i < rhit.LocationsLoggerManager.length; i++) {
			let docSnapshot = this._documentSnapshots[i];
			if (docSnapshot.id == id) {
				return this.getLocationAtIndex(i);
			}
		}
		// return null;
	}

	getLocationAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const location = new rhit.Location(docSnapshot.id, 
			docSnapshot.get(rhit.FB_KEY_BUILDING), docSnapshot.get(rhit.FB_KEY_DESCRIPTION), docSnapshot.get(rhit.FB_KEY_TYPE), docSnapshot.get(rhit.FB_KEY_RATING));
		return location;
	}
};