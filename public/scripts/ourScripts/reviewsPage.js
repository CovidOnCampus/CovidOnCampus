var rhit = rhit || {};

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
		
				$('#addReview').on('shown.bs.modal', (event) => {
					document.querySelector("#inputComment").focus();
				});
			} else {
				alert("You must be signed in to leave a review");
			};
		}
		document.querySelector("#submitAddReview").onclick = (event) => {
			const comment = document.querySelector("#inputComment").value;
			const rating = document.querySelector("#inputRating").value;
			rhit.fbReviewsPageManager.add(comment, rating);
			document.querySelector("#inputComment").value = "";
			ratingSelection.selectedIndex = 0;
		}

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

	_editReview(reviewId, comment, rating, author) {
		if (rhit.fbAuthManager.uid == author) {
			$('#editReviewDialog').on('show.bs.modal', (event) => {
				document.querySelector("#inputNewComment").value = comment;
				document.querySelector("#inputNewRating").value = rating;
			});
	
			$('#editReviewDialog').on('shown.bs.modal', (event) => {
				document.querySelector("#inputNewComment").focus();
			});
	
			$("#editReviewDialog").modal("show");
	
			document.querySelector("#submitEditReview").onclick = (event) => {
				const newComment = document.querySelector("#inputNewComment").value;
				const newRating = document.querySelector("#inputNewRating").value;
				rhit.fbReviewsPageManager.update(reviewId, newComment, newRating);
			};
		} else {
			alert("You are not the author of this review");
		}
	};

	_deleteReview(reviewId, author) {
		if (rhit.fbAuthManager.uid == author) {
			$("#deleteReviewDialog").modal("show");

			document.querySelector("#submitDeleteReview").onclick = (event) => {
				rhit.fbReviewsPageManager.delete(reviewId);
			};
		} else {
			alert("You are not the author of this review");
		}
	}

	updateView() {
		const newList = htmlToElement('<div id="reviewsList"></div>');

		firebase.firestore().collection(rhit.FB_COLLECTION_LOCATIONS).doc(rhit.fbReviewsPageManager.locId).get().then(function(doc) {
			if (doc.exists) {
				let building = doc.get(rhit.FB_KEY_BUILDING);
				let description = doc.get(rhit.FB_KEY_DESCRIPTION);
				let type = doc.get(rhit.FB_KEY_TYPE);
				let rating = doc.get(rhit.FB_KEY_RATING);
				document.querySelector("#reviewsTitle").innerHTML = `<h3>${building}</h3><h5>Reviews for ${description} ${type}</h5>
																		<h6>Current rating is ${rating.toFixed(2)}`;
			} else {
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});

		for (let i = 0; i < rhit.fbReviewsPageManager.length; i++) {
			const review = rhit.fbReviewsPageManager.getReviewAtIndex(i);
			const newCard = this._createReviewCard(review);
			if (newCard.querySelector(".card-changes").innerHTML != "") {
				newCard.querySelector(".edit").onclick = (event) => {
					this._editReview(review.id, review.comment, review.rating, review.author);
				};
				newCard.querySelector(".delete").onclick = (event) => {
					this._deleteReview(review.id, review.author);
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
	constructor(uid, locId) {
		this._uid = uid;
		this._locId = locId;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_REVIEWS);
		this._unsubscribe = null;
	}

	_updateLocationRating() {
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

		firebase.firestore().collection(rhit.FB_COLLECTION_LOCATIONS).doc(this.locId).update({
			[rhit.FB_KEY_RATING]: rating,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function() {
			rhit.reviewsPageController.updateView();
		})
		.catch(function(error) {
			console.error("Error updating document: ", error);
		});	

		console.log(rating);
	}

	add(comment, rating) {
		this._ref.add({
			[rhit.FB_KEY_COMMENT]: comment,
			[rhit.FB_KEY_RATING]: rating,
			[rhit.FB_KEY_AUTHOR]: rhit.fbAuthManager.uid,
			[rhit.FB_KEY_LOCATION_ID]: this._locId,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function() {
			rhit.fbReviewsPageManager._updateLocationRating();
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
		});		
	}

	update(reviewId, comment, rating) {
		this._ref.doc(reviewId).update({
			[rhit.FB_KEY_RATING]: rating,
			[rhit.FB_KEY_COMMENT]: comment,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function() {
			rhit.fbReviewsPageManager._updateLocationRating();
		})
		.catch(function(error) {
			console.error("Error updating document: ", error);
		});	

	}

	delete(reviewId) {
		this._ref.doc(reviewId).delete().then(function () {
			rhit.fbReviewsPageManager._updateLocationRating();
		}).catch(function (error) {
			console.log("Error removing document: ", error);
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

	getReviewById(id) {
		for (let i = 0; i < rhit.fbReviewsPageManager.length; i++) {
			let docSnapshot = this._documentSnapshots[i];
			if (docSnapshot.id == id) {
				return this.getReviewAtIndex(i);
			}
		}
		return null;
	}

	getReviewAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const review = new rhit.Review(docSnapshot.id, 
			docSnapshot.get(rhit.FB_KEY_COMMENT), docSnapshot.get(rhit.FB_KEY_RATING), docSnapshot.get(rhit.FB_KEY_LOCATION_ID), docSnapshot.get(rhit.FB_KEY_AUTHOR));
		return review;
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
};
