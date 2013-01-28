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
  
  var clientPicker;
  var clientPickerAdded = 0;
   
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
  
  var sessName = Titanium.App.Properties.getString("userSessionName");
  var sessId = Titanium.App.Properties.getString("userSessionId");
  
  done.addEventListener('click',function() {
    if (clientPickerAdded == 1) {
      clientButton.title =  clientPicker.getSelectedRow(0).title;
      clientnid = clientPicker.getSelectedRow(0).nid;
      picker_view.animate(slide_out);
      setTimeout(function(){
        picker_view.remove(clientPicker);
      }, 500);
      clientPickerAdded = 0;
    }
  });
  
  cancel.addEventListener('click', function() {
    picker_view.animate(slide_out);
    setTimeout(function(){
      if (clientPickerAdded == 1) {
        picker_view.remove(clientPicker);
        clientPickerAdded = 0;
      }
    }, 500);
  })
  
  win.add(picker_view);
  		
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

  // Add the textfield to the window
  view.add(nodeTitleTextfield);
  
  var clientButton = Titanium.UI.createButton({
    title:'Choose a client',
    height:40,
    width:300,
    top:55,
  });
  
  clientButton.addEventListener('click', function() {
    nodeTitleTextfield.blur();
    showClientPicker();
  });
  
  view.add(clientButton);
  
  var rightButton = Ti.UI.createButton({
    systemButton:Ti.UI.iPhone.SystemButton.SAVE,
  });
  
  rightButton.addEventListener("click", function() {
    
    if (nodeTitleTextfield.value == '') {
      alert('Please set a name.');
    }
    else if (clientnid == 0) {
      alert('Please pick a client.');
    }
    else {
    
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
    }
  });
  
  function showClientPicker() {
    var clientUrl = REST_PATH + 'organizations.json';
    var clientXhr = Titanium.Network.createHTTPClient();
    clientXhr.open("GET", clientUrl);
    clientXhr.setRequestHeader('Cookie', sessName+'='+sessId);
    clientXhr.send();
    clientPicker = Ti.UI.createPicker({
      top:43,
      selectionIndicator:true,
    });
    clientXhr.onload = function() {
      var statusCode = clientXhr.status;
      if(statusCode == 200) {
        var response = clientXhr.responseText;
        var result = JSON.parse(response);
        var results = new Array();
        var i = 0;
        for(var key in result) {
          var data = result[key];
          results[i] = Ti.UI.createPickerRow({title: data.title, nid:data.nid});
          i = i + 1;
        }
        clientPicker.add(results);
        picker_view.add(clientPicker);
        clientPickerAdded = 1;
        picker_view.animate(slide_in);
      }
    }
  }
  
  win.setRightNavButton(rightButton);
}
else {
  alert("You need to login first");
}
