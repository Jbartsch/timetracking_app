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
  
  Ti.App.actIn.message = 'Loading...';
  win.add(Ti.App.actInView);
  
  // Create a user variable to hold some information about the user
  var user = {
    uid: Titanium.App.Properties.getInt("userUid"),
    sessid: Titanium.App.Properties.getString("userSessionId"),
    session_name: Titanium.App.Properties.getString("userSessionName"),
  }

  // Create the scrollview
  var view = Titanium.UI.createScrollView({
  	contentWidth:'auto',
  	contentHeight:'auto',
  	showVerticalScrollIndicator:true,
  	showHorizontalScrollIndicator:true,
  	top: 0,
  });
  
  win.add(view);
  
  var rightButton = Ti.UI.createButton({
    systemButton:Ti.UI.iPhone.SystemButton.SAVE,
  });

  win.setRightNavButton(rightButton);
  
  var url = REST_PATH + 'node/' + win.nid + '.json';
  
  // Create a connection inside the variable xhr
  var xhr = Titanium.Network.createHTTPClient();
  
  // Open the xhr
  xhr.open("GET",url);
  
  // Send the xhr
  xhr.send();
  
  // When the xhr loads we do:
  xhr.onload = function() {
  	// Save the status of the xhr in a variable
  	// this will be used to see if we have a xhr (200) or not
  	var statusCode = xhr.status;
  	win.remove(Ti.App.actInView);
  	// Check if we have a xhr
  	if(statusCode == 200) {
  		
  		// Save the responseText from the xhr in the response variable
  		var response = xhr.responseText;
  		
  		// Parse (build data structure) the JSON response into an object (data)
  		var node = JSON.parse(response);
  		
      // Create the textfield to hold the node title
      var nodeTitleTextfield = Titanium.UI.createTextField({
        value:node.title,
        hintText:"Name",
        height:35,
        top:10,
        width:280,
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        borderWidth:1,
        borderColor:'#bbb',
        borderRadius:3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'white',
      });
    
      // Add the textfield to the window
      view.add(nodeTitleTextfield);
      
      var addressTextfield = Titanium.UI.createTextField({
        value:node.address,
        hintText:"Address",
        height:35,
        top:55,
        width:280,
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        borderWidth:1,
        borderColor:'#bbb',
        borderRadius:3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'white',
      });
    
      view.add(addressTextfield);
      
      var zipTextfield = Titanium.UI.createTextField({
        value:node.zip,
        hintText:"ZIP",
        height:35,
        top:100,
        left:20,
        width:70,
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        borderWidth:1,
        borderColor:'#bbb',
        borderRadius:3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'white',
      });
    
      view.add(zipTextfield);
      
      var cityTextfield = Titanium.UI.createTextField({
        value:node.city,
        hintText:"City",
        height:35,
        top:100,
        right:20,
        width:200,
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        borderWidth:1,
        borderColor:'#bbb',
        borderRadius:3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'white',
      });
    
      view.add(cityTextfield);
      
      var phoneTextfield = Titanium.UI.createTextField({
        value:node.phone,
        hintText:"Phone",
        height:35,
        top:145,
        width:280,
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        borderWidth:1,
        borderColor:'#bbb',
        borderRadius:3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'white',
      });
    
      view.add(phoneTextfield);
      
      var emailTextfield = Titanium.UI.createTextField({
        value:node.email,
        hintText:"E-Mail",
        height:35,
        top:190,
        width:280,
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
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
        value:node.www,
        hintText:"WWW",
        height:35,
        top:235,
        width:280,
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        borderWidth:1,
        borderColor:'#bbb',
        borderRadius:3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'white',
        autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
      });
    
      view.add(wwwTextfield);
    
      // Add the event listener for when the button is created
      rightButton.addEventListener("click", function() {
        
        if (nodeTitleTextfield.value == '') {
          Ti.App.message('error', 'Please set a name.', win);
        }
        else {
          
          Ti.App.actIn.message = 'Saving...';
          win.add(Ti.App.actInView);
        
          // Create a new node object
          var newnode = {
            node:{
              title: nodeTitleTextfield.value,
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
          var updateurl = REST_PATH + 'node/' + node.nid + '.json';
  
          // Create a connection
          var nodeXhr = Titanium.Network.createHTTPClient();
      
          // Open the connection using POST
          nodeXhr.open('PUT', updateurl);
          nodeXhr.setRequestHeader('X-HTTP-Method-Override','PUT');
          nodeXhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
          nodeXhr.setRequestHeader('Cookie', user.session_name+'='+user.sessid);
      
          // Send the connection and the user object as argument
          nodeXhr.send(JSON.stringify(newnode));
          nodeXhr.onload = function() {
            // Save the status of the connection in a variable
            // this will be used to see if we have a connection (200) or not
            var statusCode = nodeXhr.status;
            win.remove(Ti.App.actInView);
  
            if(statusCode == 200) {
              win.close();
            }
            else {
              Ti.App.message('error', 'There was an error.', win);
            }
          }
          nodeXhr.onerror = function() {
            Ti.API.info(nodeXhr.status);
            win.remove(Ti.App.actInView);
          }
        }
      });
  	}
  }
  xhr.onerror = function() {
    win.remove(Ti.App.actInView);
  }
}
else {
  alert("You need to login first");
}
