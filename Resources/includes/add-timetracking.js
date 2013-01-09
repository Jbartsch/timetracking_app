/**
 * This file is used to create a simple node
 */

// Include the config.js file
Ti.include("../config.js");

// Include the tiajax.js library
//~Ti.include("../lib/tiajax.js");

//~$ = {}
//~$.ajax = Titanium.Network.ajax;

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

  // Create the label for the node title
  var nodeTitleLabel = Titanium.UI.createLabel({
    text:'Description',
    left:10,
    top:5,
    right:10,
    height:40,
  });

  // Add the label to the window
  view.add(nodeTitleLabel);

  // Create the textfield to hold the node title
  var nodeTitleTextfield = Titanium.UI.createTextField({
    height:60,
    top:50,
    left:10,
    right:10,
  });

  // Add the textfield to the window
  view.add(nodeTitleTextfield);


  // Create the label for the date
  var dateLabel = Titanium.UI.createLabel({
    text:'Date',
    left:10,
    top:115,
    right:10,
    height:40,
  });

  // Add the label to the window
  view.add(dateLabel);

  var currentDate = new Date();
  var day = currentDate.getDate().toString();
  var month = (currentDate.getMonth() + 1).toString();
  var year = currentDate.getFullYear();
  if (day.length == 1) {
    day = '0' + day;
  }
  if (month.length == 1) {
    month = '0' + month;
  }

  // Create the textarea to hold the body
  var dateText = Titanium.UI.createTextField({
    value:year+'-'+month+'-'+day,
    height:60,
    left:10,
    right:10,
    top:160,
  });

  // Add the textarea to the window
  view.add(dateText);

  // Create the label for the date
  var beginLabel = Titanium.UI.createLabel({
    text:'Time begin',
    left:10,
    top:225,
    right:10,
    height:40,
  });

  // Add the label to the window
  view.add(beginLabel);

  // Create the textarea to hold the body
  var beginText = Titanium.UI.createTextField({
    height:60,
    left:10,
    right:10,
    top:270,
  });

  // Add the textarea to the window
  view.add(beginText);

  // Create the label for the date
  var endLabel = Titanium.UI.createLabel({
    text:'Time end',
    left:10,
    top:335,
    right:10,
    height:40,
  });

  // Add the label to the window
  view.add(endLabel);

  var hours = currentDate.getHours().toString();
  var minutes = currentDate.getMinutes().toString();
  if (hours.length == 1) {
    hours = '0' + hours;
  }
  if (minutes.length == 1) {
    minutes = '0' + minutes;
  }

  // Create the textarea to hold the body
  var endText = Titanium.UI.createTextField({
    value:hours+':'+minutes,
    height:60,
    left:10,
    right:10,
    top:380,
  });

  // Add the textarea to the window
  view.add(endText);

  // Add the save button
  var saveButton = Titanium.UI.createButton({
    title:'Save',
    height:60,
    width:200,
    top:460
  });

  // Add the button to the window
  view.add(saveButton);

  win.addEventListener("focus", function(e) {
    if (e.source.top == 50) {
      nodeTitleTextfield.value = '';
      dateText.value = year+'-'+month+'-'+day;
      beginText.value = '';
      endText.value = hours+':'+minutes;
    }
  });

  // Add the event listener for when the button is created
  saveButton.addEventListener("click", function() {

    // Create a new node object
    var node = {
      node:{
        title: nodeTitleTextfield.value,
        type:'stormtimetracking',
        organization_nid:943,
        trackingdate: {popup: {date: dateText.value}},
        timebegin: beginText.value,
        timeend: endText.value,
        uid: user.uid,
      }
    };

    // Define the url
    // in this case, we'll connecting to http://example.com/api/rest/node
    var url = REST_PATH + 'node';

    // Create a connection
    var xhr = Titanium.Network.createHTTPClient();

    // Open the connection using POST
    xhr.open("POST",url);

    xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
    xhr.setRequestHeader('Cookie', user.session_name+'='+user.sessid);

    // Send the connection and the user object as argument
    xhr.send(JSON.stringify(node));

    xhr.onload = function() {
      // Save the status of the connection in a variable
      // this will be used to see if we have a connection (200) or not
      var statusCode = xhr.status;

      // Check if we have a valid status
      if(statusCode == 200) {

        // Create a variable response to hold the response
        var response = xhr.responseText;

        // Parse (build data structure) the JSON response into an object (data)
        var data = JSON.parse(response);

        alert("Content created with id " + data.nid);
      }
      else {
        alert("There was an error");
      }
    }

  });
}
else {
  alert("You need to login first");
}

if (Titanium.Platform.osname == 'android') {
  var activity = win.activity;

  activity.onCreateOptionsMenu = function(e) {
    var menu = e.menu;
    var postButton = menu.add({title: 'Settings'});
    postButton.addEventListener('click', function(e) {
      Ti.App.settingsWin.open();
    });

    var logoutMenuButton = menu.add({title: 'Logout'});
    logoutMenuButton.addEventListener('click', function(e) {
      Ti.App.logoutWin.open();
      Ti.App.tabGroup.close();
    });
  };
}
else if (Titanium.Platform.osname == 'iphone' || Titanium.Platform.osname == 'ipad') {
  // Create a new button
  var rightButton = Ti.UI.createButton({
    title: 'Settings',
    style:Titanium.UI.iPhone.SystemButtonStyle.DONE
  });

  // Create a new event listener for the rightButton
  rightButton.addEventListener("click", function() {
    Ti.App.settingsWin.open();
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
