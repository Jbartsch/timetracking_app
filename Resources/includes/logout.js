// Include our config file
Ti.include('../config.js');

var win = Ti.UI.currentWindow;

var logoutMessage = Ti.UI.createLabel({
  text: "Logging out...",
  color:'#fff',
  textAlign:'center',
  font:{fontSize:24, fontWeight:'bold'},
  top:100,
  height:40
});

// Add the error message to the window
win.add(logoutMessage);

// Define the url which contains the full url
// in this case, we'll connecting to http://example.com/api/rest/user/logout
var logoutUrl = REST_PATH + 'user/logout.json';

// Create a connection
var xhr3 = Titanium.Network.createHTTPClient();

// Open the connection
xhr3.open("POST", logoutUrl);

xhr3.setRequestHeader('Content-Type','application/json; charset=utf-8');

// Send the connection
xhr3.send();

// When the connection doesnt load we do:
xhr3.onerror = function() {
  if(xhr3.status == 406) {
    //~alert("You're not currently logged in");
    Titanium.App.Properties.removeProperty("userUid");
    Titanium.App.Properties.removeProperty("userSessionId");
    Titanium.App.Properties.removeProperty("userSessionName");
    Titanium.App.Properties.removeProperty("userName");
    Ti.App.loginWin.open();
    win.close();
  }
}

// When the connection loads we do:
xhr3.onload = function() {
  // Save the status of the connection in a variable
  // this will be used to see if we have a connection (200) or not
  var statusCodeLogout = xhr3.status;
 
  // Check if we have a connection
  if(statusCodeLogout == 200) {
    Titanium.App.Properties.removeProperty("userUid");
    Titanium.App.Properties.removeProperty("userSessionId");
    Titanium.App.Properties.removeProperty("userSessionName");
    Titanium.App.Properties.removeProperty("userName");
    Ti.App.loginWin.open();
    win.close();
  }
  else {
    //~alert("You're not currently logged in");
    // We remvoe all the properties since the user is requesting to logout
    // is probably not logged in but the properties are set
    Titanium.App.Properties.removeProperty("userUid");
    Titanium.App.Properties.removeProperty("userSessionId");
    Titanium.App.Properties.removeProperty("userSessionName");
    Titanium.App.Properties.removeProperty("userName");
    Ti.App.loginWin.open();
    win.close();
  }
}
