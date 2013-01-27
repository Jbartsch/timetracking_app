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
  Titanium.App.Properties.removeProperty("userUid");
  Titanium.App.Properties.removeProperty("userSessionId");
  Titanium.App.Properties.removeProperty("userSessionName");
  Titanium.App.Properties.removeProperty("userName");
  win.close();
  Ti.App.tabGroup.close();
  Ti.App.homeWin.show();
}

// When the connection loads we do:
xhr3.onload = function() {
  Titanium.App.Properties.removeProperty("userUid");
  Titanium.App.Properties.removeProperty("userSessionId");
  Titanium.App.Properties.removeProperty("userSessionName");
  Titanium.App.Properties.removeProperty("userName");
  win.close();
  Ti.App.tabGroup.close();
  Ti.App.homeWin.show();
}
