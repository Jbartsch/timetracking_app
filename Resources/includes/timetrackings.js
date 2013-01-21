/**
 * Remember that in the debug process we can always use:
 * Ti.API.info(foo);
 * to log something to the console
 */

// Include our config file
Ti.include('../config.js');

// Define the variable win to contain the current window
var win = Ti.UI.currentWindow;

// Create the scrollview
var view = Titanium.UI.createScrollView({
  contentWidth:'auto',
  contentHeight:'auto',
  showVerticalScrollIndicator:true,
  showHorizontalScrollIndicator:true,
  top: 0,
  backgroundColor: '#D8D8D8',
});

// Add our scrollview to the window
win.add(view);

var table;

loadView();

function loadView() {
  // Define the url which contains the full url
  // in this case, we'll connecting to http://example.com/api/rest/node/1.json
  var url = REST_PATH + 'timetrackings.json';
  
  // Create a connection inside the variable xhr
  var xhr = Titanium.Network.createHTTPClient();
  
  // Open the xhr
  xhr.open("GET",url);
  
  var sessName = Titanium.App.Properties.getString("userSessionName");
  var sessId = Titanium.App.Properties.getString("userSessionId");
  xhr.setRequestHeader('Cookie', sessName+'='+sessId);
  
  // Send the xhr
  xhr.send();
  
  // When the xhr loads we do:
  xhr.onload = function() {
    // Save the status of the xhr in a variable
    // this will be used to see if we have a xhr (200) or not
    var statusCode = xhr.status;
  
    // Check if we have a xhr
    if(statusCode == 200) {
  
      // Save the responseText from the xhr in the response variable
      var response = xhr.responseText;
  
      // Parse (build data structure) the JSON response into an object (data)
      var result = JSON.parse(response);
  
      var results = new Array();
  
      // Start loop
      for(var key in result) {
        // Create the data variable and hold every result
        var data = result[key];
        var date = new Date(data.trackingdate*1000);
        var day = date.getDate();
        if (day < 10) {
          day = '0' + day;
        }
        var month = date.getMonth() + 1;
        if (month < 10) {
          month = '0' + month;
        }
        var year = date.getFullYear();
        title = day + '.' + month + '.' + year + '   ' + data.timebegin + ' - ' + data.timeend; 
        results[key] = {title: title, nid:data.nid};
      }
  
      table = Titanium.UI.createTableView({
        data:results,
        backgroundColor: '#D8D8D8',
        separatorColor: '#FFF',
      });
  
      // add a listener for click to the table
      // so every row is clickable
      table.addEventListener('click',function(e) {
        // Define a new Window "nodeWindow"
        var nodeWindow = Titanium.UI.createWindow({
          url:'get-node-by-nid.js',
          backgroundColor: '#D8D8D8',
          barColor: '#009900',
          title:e.rowData.title,
          nid:e.rowData.nid,
          touchEnabled: true,
          tabBarHidden: true,
        });
        
        // order the app to open the nodeWindow window in the current Tab
        Titanium.UI.currentTab.open(nodeWindow,{animated:true});
      });
  
      // add our table to the view
      view.add(table);
  
    }
    else {
      // Create a label for the node title
      var errorMessage = Ti.UI.createLabel({
        // The text of the label will be the node title (data.title)
        text: "Please check your internet xhr.",
        color:'#000',
        textAlign:'left',
        font:{fontSize:24, fontWeight:'bold'},
        top:25,
        left:15,
        height:18
      });
  
      // Add the error message to the window
      win.add(errorMessage);
    }
  }
}

if (Titanium.Platform.osname == 'iphone' || Titanium.Platform.osname == 'ipad') {

  var rightButton = Ti.UI.createButton({
    systemButton:Ti.UI.iPhone.SystemButton.REFRESH
  });

  // Create a new event listener for the rightButton
  rightButton.addEventListener("click", function() {
    view.remove(table);
    loadView();
  });

  var leftButton = Ti.UI.createButton({
    title: 'Logout',
    style:Titanium.UI.iPhone.SystemButtonStyle.DONE
  });

  leftButton.addEventListener('click', function() {
    Ti.App.logoutWin.open();
    Ti.App.tabGroup.close();
  });

  // We don't add the button to the window, instead, we tell the app
  // to set the button as the right navigation button
  win.setRightNavButton(rightButton);
  win.setLeftNavButton(leftButton);
}
