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
  
  var rightButton = Ti.UI.createButton({
    systemButton:Ti.UI.iPhone.SystemButton.SAVE,
  });
  
  win.setRightNavButton(rightButton);
  
  // Define the url which contains the full url
  // See how we build the url using the win.nid which is 
  // the nid property we pass to this file when we create the window
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
  	
  	function hideKeyboard() {
      nodeTitleTextfield.blur();
      beginText.blur();
      endText.blur();
    }
    
  	var statusCode = xhr.status;
  	
  	// Check if we have a xhr
  	if(statusCode == 200) {
  		
  		// Save the responseText from the xhr in the response variable
  		var response = xhr.responseText;
  		
  		// Parse (build data structure) the JSON response into an object (data)
  		var node = JSON.parse(response);
  		
  		// ensure that the window title is set
  		win.title = node.title;
  		
      var slide_in =  Titanium.UI.createAnimation({bottom:0});
      var slide_out =  Titanium.UI.createAnimation({bottom:-251});
      
      var picker_view = Titanium.UI.createView({
        height:251,
        bottom:-251,
        zIndex:100
      });
      
      var clientPicker;
      var clientPickerAdded = 0;
      var projectPicker;
      var projectPickerAdded = 0;
       
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
      
      var clientnid = node.organization_nid;
      
      var projectnid = node.project_nid;
      
      var datetxt = '';
  
      var monthNames = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];

      var oldDate = new Date(node.trackingdate*1000);
      var datePicker = Ti.UI.createPicker({
        type:Ti.UI.PICKER_TYPE_DATE,
        minDate:new Date(2000,0,1),
        maxDate:new Date(2020,11,31),
        value:oldDate,
        top:43,
        visible:false
      });
      
      picker_view.add(datePicker);
      
      var trackingdate = 0;
      datePicker.addEventListener('change',function(e){
        var pickerdate = e.value;
        var day = pickerdate.getDate();
        if (day < 10) {
          day = '0' + day;
        }
        var month = pickerdate.getMonth() + 1;
        if (month < 10) {
          month = '0' + month;
        }
        var monthString = monthNames[pickerdate.getMonth()];
        var year = pickerdate.getFullYear();
        datetxt = year + '-' + month + '-' + day;
        trackingdate = monthString + ' ' + day + ', ' + year;
      });
      
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
        
        if (projectPickerAdded == 1) {
          projectButton.title =  projectPicker.getSelectedRow(0).title;
          projectnid = projectPicker.getSelectedRow(0).nid;
          picker_view.animate(slide_out);
          setTimeout(function(){
            picker_view.remove(projectPicker);
          }, 500);
          projectPickerAdded = 0;
        }

        if (datePicker.visible == 1) {
          dateChangeButton.title = trackingdate;
          picker_view.animate(slide_out);
          setTimeout(function(){
            datePicker.hide();
          }, 500);
        }
      });
      
      cancel.addEventListener('click', function() {
        picker_view.animate(slide_out);
        setTimeout(function(){
          if (projectPickerAdded == 1) {
            picker_view.remove(projectPicker);
            projectPickerAdded = 0;
          }
          if (clientPickerAdded == 1) {
            picker_view.remove(clientPicker);
            clientPickerAdded = 0;
          }
          datePicker.hide();
        }, 500);
      })
      
      win.add(picker_view);
    
      // Create the textfield to hold the node title
      var nodeTitleTextfield = Titanium.UI.createTextField({
        value:node.title,
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
    
      var day = oldDate.getDate().toString();
      var month = (oldDate.getMonth() + 1).toString();
      var monthString = monthNames[oldDate.getMonth()];
      var year = oldDate.getFullYear();
      if (day.length == 1) {
        day = '0' + day;
      }
      if (month.length == 1) {
        month = '0' + month;
      }
      
      var currentDateText = monthString + ' ' + day + ', ' + year;
      datetxt = year+'-'+month+'-'+day;
      
      var dateChangeButton = Titanium.UI.createButton({
        title:currentDateText,
        height:35,
        top:55,
        left:10,
        width:300
      });
      
      dateChangeButton.addEventListener('click', function() {
        hideKeyboard();
        datePicker.show();
        picker_view.animate(slide_in);
      });
    
      // Add the label & button to the view
      view.add(dateChangeButton);
    
      var beginLabel = Titanium.UI.createLabel({
        text:'From',
        left:10,
        top:100,
        width:50,
        height:40,
      });
      
      view.add(beginLabel);
    
      // Create the textarea to hold the body
      var beginText = Titanium.UI.createTextField({
        value:node.timebegin,
        right:10,
        top:100,
        height:35,
        left:65,
        width:60,
        font:{fontSize:16},
        borderWidth:1,
        borderColor:'#bbb',
        borderRadius:3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'white',
      });
    
      // Add the textarea to the window
      view.add(beginText);
    
      // Create the label for the date
      var endLabel = Titanium.UI.createLabel({
        text:'To',
        left:135,
        top:100,
        height:40,
        width:30,
      });
    
      // Add the label to the window
      view.add(endLabel);
    
      // Create the textarea to hold the body
      var endText = Titanium.UI.createTextField({
        value:node.timeend,
        top:100,
        height:35,
        left:165,
        width:60,
        font:{fontSize:16},
        borderWidth:1,
        borderColor:'#bbb',
        borderRadius:3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'white',
      });
    
      // Add the textarea to the window
      view.add(endText);
      
      var clientButton = Titanium.UI.createButton({
        title:node.organization_title,
        height:40,
        width:300,
        top:150,
      });
      
      clientButton.addEventListener('click', function() {
        hideKeyboard();
        showClientPicker();
      });
      
      view.add(clientButton);
      
      var projectButton = Titanium.UI.createButton({
        title:node.project_title,
        height:40,
        width:300,
        top:200,
      });
      
      projectButton.addEventListener('click', function() {
        hideKeyboard();
        showProjectPicker();
      });
      
      view.add(projectButton);
    
      // Add the event listener for when the button is created
      rightButton.addEventListener("click", function() {
        
        var beginTimes = beginText.value.split(':');
        var endTimes = endText.value.split(':');
        
        // var validEnd;
        if (nodeTitleTextfield.value == '' || beginText.value == '' || endText.value == '') {
          alert('Please fill out all fields.');
        }
        else if (beginTimes.length != 2 || beginTimes[0] > 23 || beginTimes[1] > 59) {
          alert('Begin time has to be in the format 12:34.');
        }
        else if (endTimes.length != 2 || endTimes[0] > 23 || endTimes[1] > 59) {
          alert('End time has to be in the format 12:34.');
        }
        else if (clientnid == 0 || projectnid == 0) {
          alert('Please pick a client and a project.');
        }
        else {
        
          var date = datetxt.split('-');
          // Create a new node object
          var newnode = {
            node:{
              title: nodeTitleTextfield.value,
              organization_nid:clientnid,
              project_nid:projectnid,
              trackingdate: {year: date[0], month: date[1], day:date[2]},
              timebegin: beginText.value,
              timeend: endText.value,
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
        var defaultClient = 0;     
        var clientColumn = Ti.UI.createPickerColumn();
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
              if (data.nid == node.organization_nid) {
                defaultClient = i;
              }
              i = i + 1;
            }
            clientPicker.add(results);
            picker_view.add(clientPicker);
            clientPickerAdded = 1;
            picker_view.animate(slide_in);
          }
        }
      }
      
      function showProjectPicker() {
        var projectUrl = REST_PATH + 'projects.json';
        var projectXhr = Titanium.Network.createHTTPClient();
        projectXhr.open("GET", projectUrl);
        projectXhr.setRequestHeader('Cookie', sessName+'='+sessId);
        projectXhr.send();
        projectPicker = Ti.UI.createPicker({
          top:43,
          selectionIndicator:true,
        });
        var defaultProject = 0;
        projectXhr.onload = function() {
          var statusCode = projectXhr.status;
          if(statusCode == 200) {
            var response = projectXhr.responseText;
            var result = JSON.parse(response);
            var results = new Array();
            var i = 0;
            for(var key in result) {
              var data = result[key];
              results[i] = Ti.UI.createPickerRow({title: data.title, nid:data.nid});
              if (data.nid == node.project_nid) {
                defaultProject = i;
              }
              i = i + 1;
            }
            projectPicker.add(results);
            picker_view.add(projectPicker);
            projectPickerAdded = 1;
            picker_view.animate(slide_in);
          }
        }
      }

  	} // End the statusCode 200 
  	else {
  		// Create a label for the node title
  		var errorMessage = Ti.UI.createLabel({
  			// The text of the label will be the node title (data.title)
  			text: "Please check your internet connection.",
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
else {
  alert("You need to login first");
}
