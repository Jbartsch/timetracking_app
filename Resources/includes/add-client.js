/**
 * this file is almost the same as the get-node with
 * one big difference, the nid is taken as an argument 
 * and is passed by other files and this file
 * recognize the nid and use it in the url to load the
 * given node nid
 */

// Include our config file
Ti.include('../config.js');

// Define the variable win to contain the current window
var win = Ti.UI.currentWindow;

if(Titanium.App.Properties.getInt("userUid")) {
  
  // Create a user variable to hold some information about the user
  var user = {
    uid: Titanium.App.Properties.getInt("userUid"),
    sessid: Titanium.App.Properties.getString("userSessionId"),
    session_name: Titanium.App.Properties.getString("userSessionName"),
    name: Titanium.App.Properties.getString("userName"),
  }

  // Create the scrollview
  var view = Titanium.UI.createScrollView({
  	contentWidth:'auto',
  	contentHeight:'auto',
  	showVerticalScrollIndicator:true,
  	showHorizontalScrollIndicator:true,
  	top: 0,
  });
  
  // Add our scrollview to the window
  win.add(view);
  		
  // Create the textfield to hold the node title
  var nodeTitleTextfield = Titanium.UI.createTextField({
    hintText:"Name",
    height:35,
    top:10,
    left:10,
    width:300,
    font:{fontSize:16},
    borderWidth:1,
    borderColor:'#bbb',
    borderRadius:3,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
  });

  view.add(nodeTitleTextfield);
  
  var addressTextfield = Titanium.UI.createTextField({
    hintText:"Address",
    height:35,
    top:55,
    left:10,
    width:300,
    font:{fontSize:16},
    borderWidth:1,
    borderColor:'#bbb',
    borderRadius:3,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
  });

  view.add(addressTextfield);
  
  var zipTextfield = Titanium.UI.createTextField({
    hintText:"ZIP",
    height:35,
    top:100,
    left:10,
    width:80,
    font:{fontSize:16},
    borderWidth:1,
    borderColor:'#bbb',
    borderRadius:3,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
  });

  view.add(zipTextfield);
  
  var cityTextfield = Titanium.UI.createTextField({
    hintText:"City",
    height:35,
    top:100,
    left:100,
    width:210,
    font:{fontSize:16},
    borderWidth:1,
    borderColor:'#bbb',
    borderRadius:3,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
  });

  view.add(cityTextfield);
  
  var phoneTextfield = Titanium.UI.createTextField({
    hintText:"Phone",
    height:35,
    top:145,
    left:10,
    width:300,
    font:{fontSize:16},
    borderWidth:1,
    borderColor:'#bbb',
    borderRadius:3,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
  });

  view.add(phoneTextfield);
  
  var emailTextfield = Titanium.UI.createTextField({
    hintText:"E-Mail",
    height:35,
    top:190,
    left:10,
    width:300,
    font:{fontSize:16},
    borderWidth:1,
    borderColor:'#bbb',
    borderRadius:3,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
    autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
  });

  view.add(emailTextfield);
  
  var wwwTextfield = Titanium.UI.createTextField({
    hintText:"WWW",
    height:35,
    top:235,
    left:10,
    width:300,
    font:{fontSize:16},
    borderWidth:1,
    borderColor:'#bbb',
    borderRadius:3,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
    autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
  });

  view.add(wwwTextfield);
  
  var rightButton = Ti.UI.createButton({
    systemButton:Ti.UI.iPhone.SystemButton.SAVE,
  });
  
  rightButton.addEventListener("click", function() {
    // Create a new node object
    var newnode = {
      node:{
        title: nodeTitleTextfield.value,
        type:'stormorganization',
        uid: user.uid,
        address: addressTextfield.value,
        zip: zipTextfield.value,
        city: cityTextfield.value,
        phone: phoneTextfield.value,
        email: emailTextfield.value,
        www: wwwTextfield.value,
      }
    };

    // Define the url
    // in this case, we'll connecting to http://example.com/api/rest/node
    var updateurl = REST_PATH + 'node';

    // Create a connection
    var nodeXhr = Titanium.Network.createHTTPClient();

    // Open the connection using POST
    nodeXhr.open('POST', updateurl);
    nodeXhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
    nodeXhr.setRequestHeader('Cookie', user.session_name+'='+user.sessid);

    // Send the connection and the user object as argument
    nodeXhr.send(JSON.stringify(newnode));
    nodeXhr.onload = function() {
      // Save the status of the connection in a variable
      // this will be used to see if we have a connection (200) or not
      var statusCode = nodeXhr.status;
      // Check if we have a valid status

      if(statusCode == 200) {
        win.close();
      }
      else {
        alert("There was an error");
      }
    }
    nodeXhr.onerror = function() {
      Ti.API.info(nodeXhr.status);
    }
  });
  
  win.setRightNavButton(rightButton);
}
else {
  alert("You need to login first");
}