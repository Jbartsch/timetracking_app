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
  
  var sessName = Titanium.App.Properties.getString("userSessionName");
  var sessId = Titanium.App.Properties.getString("userSessionId");

  var url = REST_PATH + 'node/' + win.nid + '.json';
  var xhr = Titanium.Network.createHTTPClient();
  xhr.open("GET",url);
  xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
  xhr.setRequestHeader('Cookie', sessName+'='+sessId);
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
  		
      var slide_in =  Titanium.UI.createAnimation({bottom:0});
      var slide_out =  Titanium.UI.createAnimation({bottom:-251});
      
      var picker_view = Titanium.UI.createView({
        height:251,
        bottom:-251,
        zIndex:100
      });
      
      var clientnid = node.organization_nid;
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
        items:[cancel,spacer,done],
        barColor: '#383838',
      });
       
      picker_view.add(toolbar);
      
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
        value:node.title,
        hintText:"Names",
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

      var clientButton = Titanium.UI.createButton({
        title:node.organization_title,
        backgroundImage: '../images/select.png',
        color: '#666666',
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        height:35,
        width:280,
        top:55,
      });
      
      clientButton.addEventListener('click', function() {
        nodeTitleTextfield.blur();
        showClientPicker();
      });
      
      view.add(clientButton);
    
      // Add the event listener for when the button is created
      rightButton.addEventListener("click", function() {
        
        if (nodeTitleTextfield.value == '') {
          alert('Please set a name.');
        }
        else if (clientnid == 0) {
          alert('Please pick a client.');
        }
        else {
          
          Ti.App.actIn.message = 'Saving...';
          win.add(Ti.App.actInView);
          // Create a new node object
          var newnode = {
            node:{
              title: nodeTitleTextfield.value,
              organization_nid:clientnid,
            }
          };
          
          var sessName = Titanium.App.Properties.getString("userSessionName");
          var sessId = Titanium.App.Properties.getString("userSessionId");
          
          var updateurl = REST_PATH + 'node/' + node.nid + '.json';
          var nodeXhr = Titanium.Network.createHTTPClient();
      
          nodeXhr.open('PUT', updateurl);
          nodeXhr.setRequestHeader('X-HTTP-Method-Override','PUT');
          nodeXhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
          nodeXhr.setRequestHeader('Cookie', sessName+'='+sessId);
      
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
              alert("There was an error");
            }
          }
          nodeXhr.onerror = function() {
            win.remove(Ti.App.actInView);
            Ti.API.info(nodeXhr.status);
          }
        }
      });
      
      function showClientPicker() {
        var sessid = Titanium.App.Properties.getString("userSessionId");
        var session_name = Titanium.App.Properties.getString("userSessionName");
        var clientnid = node.organization_nid;
        var clientUrl = REST_PATH + 'organizations.json';
        var clientXhr = Titanium.Network.createHTTPClient();
        clientXhr.open("GET", clientUrl);
        clientXhr.setRequestHeader('Cookie', session_name+'='+sessid);
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
  	}
  }
  xhr.onerror = function() {
    win.remove(Ti.App.actInView);
  }
}
else {
  alert("You need to login first");
}
