var rhit = rhit || {};

rhit.Review = class {
	constructor(id, comment, rating, location) {
	  this.id = id;
	  this.comment = comment;
	  this.rating = rating;  
	  this.location = location;
	}
}

rhit.ReviewsPageController = class {
	constructor(uid) {
		rhit.setUpDropDown();

		let ratingSelection = document.querySelector("#inputRating");
		document.querySelector("#cancelReview").onclick = (event) => {
			ratingSelection.selectedIndex = 0;
		}
		document.querySelector("#submitAddReview").onclick = (event) => {
			const comment = document.querySelector("#inputComment").value;
			const rating = document.querySelector("#inputRating").value;
			rhit.fbReviewsPageManager.add(comment, rating);
			ratingSelection.selectedIndex = 0;
		}

		rhit.fbReviewsPageManager.beginListening(this.updateView.bind(this));
	}

	_createReviewCard(review) {
		let reviewRating = rhit.getRatingHTML(review);
		return htmlToElement(`<div class="card">
		<div class="card-body">
		  <div class="card-title">${review.comment}</div>
		  <div id="reviewDetails">
			<div class="card-changes">
				<i class="material-icons">edit</i>
				<i class="material-icons">delete</i>
			</div>
			<div class="card-rating">
				${reviewRating}
			</div>
		  </div>
		</div>
	  </div>`);
	}

	updateView() {
		const newList = htmlToElement('<div id="reviewsList"></div>');
		for (let i = 0; i < rhit.fbReviewsPageManager.length; i++) {
			const review = rhit.fbReviewsPageManager.getReviewAtIndex(i);
			const newCard = this._createReviewCard(review);
			newList.appendChild(newCard);
		}

		const oldList = document.querySelector("#reviewsList");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	
	}
};

rhit.FbReviewsPageManager = class {
	constructor(uid, location) {
		this._uid = uid;
		this._locId = location;
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
				if (review.location == rhit.fbReviewsPageManager.location) {
					rating += parseInt(review.rating);
					count++;
				}
			}
			console.log("Rating: ", rating);
			console.log("Count: ", count);
			rating = rating / count;
			console.log(rating);
			firebase.firestore().collection(rhit.FB_COLLECTION_LOCATIONS).doc(rhit.fbReviewsPageManager.location)
				.update({
					[rhit.FB_KEY_RATING]: rating,
					[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
				});
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
		});		
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50);
		console.log(this._locId);
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

	get location() {
		return this._locId;
	}

	getReviewAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const review = new rhit.Review(docSnapshot.id, 
			docSnapshot.get(rhit.FB_KEY_COMMENT), docSnapshot.get(rhit.FB_KEY_RATING), docSnapshot.get(rhit.FB_KEY_LOCATION_ID));
		return review;
	}
};