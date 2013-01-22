/**
 * This file is used to create a simple node
 */

// Include the config.js file
Ti.include("../config.js");

//Define the variable win to contain the current window
var win = Ti.UI.currentWindow;

if(Titanium.App.Properties.getInt("userUid")) {
	// Create a user variable to hold some information about the user
	var user = {
		uid: Titanium.App.Properties.getInt("userUid"),
		sessid: Titanium.App.Properties.getString("userSessionId"),
		session_name: Titanium.App.Properties.getString("userSessionName"),
		name: Titanium.App.Properties.getString("userName"),
	}
	
	// Create a new view "view" to hold the form
	var view = Ti.UI.createView({
		top: 0,
	});

	// Add the view to the window
	win.add(view);

	// Add the save button
	var logoutButton = Titanium.UI.createButton({
		title:'Logout',
		height:40,
		width:200,
		top:20
	});

	// Add the button to the window
	view.add(logoutButton);
	
	logoutButton.addEventListener('click', function() {
    Ti.App.logoutWin.open();
    Ti.App.tabGroup.close();
  });

}
else {
	alert("You need to login first");
}