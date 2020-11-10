var rhit = rhit || {};

rhit.LoginPageController = class {
	constructor() {
		rhit.setUpDropDown();

		document.querySelector("#roseFireButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
		};
	}
};