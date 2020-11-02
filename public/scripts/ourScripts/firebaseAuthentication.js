var rhit = rhit || {};

rhit.FbAuthManager = class {
	constructor() {
	  	this._user = null;
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) =>{
			this._user = user;
			changeListener();
			
		  });
	}
	signIn() {
		Rosefire.signIn("6155db65-adf5-4787-8a72-0eeb6b8c7857", (err, rfUser) => {
			if (err) {
			console.log("Rosefire error!", err);
			return;
			}
			console.log("Rosefire success!", rfUser);
			
			firebase.auth().signInWithCustomToken(rfUser.token).catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === 'auth/invalid-custom-token') {
					alert('The token you provided is not valid.');
				} else {
					console.error("Custom auth error", errorCode, errorMessage);
				}
			});
		});
	}

	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log("sign out error");
		});
	}

	get isSignedIn() {
		return !!this._user;
	}

	get uid() {
		return this._user.uid;
	}
};