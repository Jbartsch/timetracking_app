// Include our config file
Ti.include('../config.js');

// Define the variable win to contain the current window
var win = Ti.UI.currentWindow;

var view = Titanium.UI.createView({
   width: "100%",
   height: "100%"
});

win.add(view);

var noNetworkText = Titanium.UI.createTextArea({
  editable: '0',
  value: 'No network connection available. Please try again later.',
  font:{fontSize:18, fontWeight: "light"},
  color: 'white',
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  // left:10,
  top:150,
  width:300,
  height:'auto',
  backgroundColor: 'transparent',
});

view.add(noNetworkText);

var retryLabel = Titanium.UI.createLabel({
  text: 'Retry',
  font:{fontSize:20, fontWeight: "bold"},
  color: 'white',
  // left:10,
  top:250,
  width:'auto',
  height:'auto',
});

view.add(retryLabel);

var actInd = Titanium.UI.createActivityIndicator({
  bottom: 20,
  width: Ti.UI.SIZE,
  height: Ti.UI.SIZE,
  style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
  font: {
      fontFamily: 'Helvetica Neue',
      fontSize: 15,
      fontWeight: 'bold'
  },
  color: 'white',
  message: 'Connecting...',
  width: 210,
});
view.add(actInd);

retryLabel.addEventListener('click', function() {
  actInd.show();
  var sessName = Titanium.App.Properties.getString("userSessionName");
  var sessId = Titanium.App.Properties.getString("userSessionId");
  var url = REST_PATH + 'system/connect.json';
  var xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", url);
  xhr.setRequestHeader('Cookie', sessName+'='+sessId);
  xhr.send();
  xhr.onload = function() {
    Ti.App.homeWin.open();
    win.close();
    data = JSON.parse(xhr.responseText);
    if (data.user.uid > 0) {
      Ti.App.homeWin.hide();
      Ti.App.buildTabGroup();
      Ti.App.tabGroup.open();    
    }
    else {
      Ti.App.homeWin.show();
    }
  }
  xhr.onerror = function() {
    setTimeout(function() {
      actInd.hide();  
    }, 3000);
  }
});
