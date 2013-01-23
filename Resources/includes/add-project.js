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
  
  var slide_in =  Titanium.UI.createAnimation({bottom:0});
  var slide_out =  Titanium.UI.createAnimation({bottom:-251});
  
  var picker_view = Titanium.UI.createView({
    height:251,
    bottom:-251,
    zIndex:100
  });
   
  var cancel =  Titanium.UI.createButton({
    title:'Cancel',
    style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
  });
   
  var done =  Titanium.UI.createButton({
    title:'Done',
    style:Titanium.UI.iPhone.SystemButtonStyle.DONE
  });
   
  var spacer =  Titanium.UI.createButton({
    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
  });
   
  var toolbar =  Titanium.UI.iOS.createToolbar({
    top:0,
    items:[cancel,spacer,done]
  });
   
  picker_view.add(toolbar);
  
  var clientnid = 0;
  
  var clientUrl = REST_PATH + 'organizations.json';

  // Create a connection inside the variable xhr
  var clientXhr = Titanium.Network.createHTTPClient();
  
  // Open the xhr
  clientXhr.open("GET", clientUrl);

  var sessName = Titanium.App.Properties.getString("userSessionName");
  var sessId = Titanium.App.Properties.getString("userSessionId");
  clientXhr.setRequestHeader('Cookie', sessName+'='+sessId);
  
  // Send the xhr
  clientXhr.send();
  
  var clientPicker = Ti.UI.createPicker({
    top:43,
    selectionIndicator:true,
    visible:false
  });

  // When the xhr loads we do:
  clientXhr.onload = function() {
    // Save the status of the xhr in a variable
    // this will be used to see if we have a xhr (200) or not
    var statusCode = clientXhr.status;
    // Check if we have a xhr
    if(statusCode == 200) {
  
      // Save the responseText from the xhr in the response variable
      var response = clientXhr.responseText;
  
      // Parse (build data structure) the JSON response into an object (data)
      var result = JSON.parse(response);
  
      var results = new Array();
  
      // Start loop
      var i = 0;
      for(var key in result) {
        // Create the data variable and hold every result
        var data = result[key];
  
        results[i] = Ti.UI.createPickerRow({title: data.title, nid:data.nid});
        
        i = i + 1;
      }
  
      clientPicker.add(results);
  
      // add our table to the view
      picker_view.add(clientPicker);

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

  done.addEventListener('click',function() {
    if (clientPicker.visible == 1) {
      clientButton.title =  clientPicker.getSelectedRow(0).title;
      clientnid = clientPicker.getSelectedRow(0).nid;
      picker_view.animate(slide_out);
      setTimeout(function(){
        clientPicker.hide();
      }, 500);
    }
  });
  
  cancel.addEventListener('click', function() {
    picker_view.animate(slide_out);
    setTimeout(function(){
      clientPicker.hide();
    }, 500);
  })
  
  win.add(picker_view);
  		
      // Create the textfield to hold the node title
  var nodeTitleTextfield = Titanium.UI.createTextField({
    hintText:"Description",
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

  // Add the textfield to the window
  view.add(nodeTitleTextfield);
  
  var clientButton = Titanium.UI.createButton({
    title:'Choose a client',
    height:40,
    width:300,
    top:55,
  });
  
  clientButton.addEventListener('click', function() {
    clientPicker.show();
    picker_view.animate(slide_in);
  });
  
  view.add(clientButton);
  
  var rightButton = Ti.UI.createButton({
    systemButton:Ti.UI.iPhone.SystemButton.SAVE,
  });
  
  rightButton.addEventListener("click", function() {
    // Create a new node object
    var newnode = {
      node:{
        title: nodeTitleTextfield.value,
        type:'stormproject',
        organization_nid:clientnid,
        uid: user.uid,
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
