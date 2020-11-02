var rhit = rhit || {};

rhit.LoginPageController = class {
	constructor() {
		document.querySelector("#roseFireButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
		};
		if (rhit.fbAuthManager.isSignedIn) {
			window.location.href = `/`;
		}
	}
};