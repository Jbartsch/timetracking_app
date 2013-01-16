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
      
      var projectnid = 0;
      
      var clientUrl = REST_PATH + 'organizations.json';
    
      // Create a connection inside the variable xhr
      var clientXhr = Titanium.Network.createHTTPClient();
      
      // Open the xhr
      clientXhr.open("GET", clientUrl);
      
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
        var year = pickerdate.getFullYear();
        trackingdate = year + '-' + month + '-' + day;
      });
      
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
            // results[key] = {title: data.title, nid:data.nid};
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
    
      var projectUrl = REST_PATH + 'projects.json';
    
      // Create a connection inside the variable xhr
      var projectXhr = Titanium.Network.createHTTPClient();
      
      // Open the xhr
      projectXhr.open("GET", projectUrl);
      
      var sessName = Titanium.App.Properties.getString("userSessionName");
      var sessId = Titanium.App.Properties.getString("userSessionId");
      projectXhr.setRequestHeader('Cookie', sessName+'='+sessId);
      
      // Send the xhr
      projectXhr.send();
      
      var projectPicker = Ti.UI.createPicker({
        top:43,
        selectionIndicator:true,
        visible:false
      });
     
      // When the xhr loads we do:
      projectXhr.onload = function() {
        // Save the status of the xhr in a variable
        // this will be used to see if we have a xhr (200) or not
        var statusCode = projectXhr.status;
        // Check if we have a xhr
        Ti.API.info(statusCode);
        if(statusCode == 200) {
      
          // Save the responseText from the xhr in the response variable
          var response = projectXhr.responseText;
      
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
            // results[key] = {title: data.title, nid:data.nid};
          }
      
          projectPicker.add(results);
      
          // add our table to the view
          picker_view.add(projectPicker);
      
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
        if (projectPicker.visible == 1) {
          projectText.value =  projectPicker.getSelectedRow(0).title;
          projectnid = projectPicker.getSelectedRow(0).nid;
          picker_view.animate(slide_out);
          projectPicker.hide();
        }
        
        if (clientPicker.visible == 1) {
          clientText.value =  clientPicker.getSelectedRow(0).title;
          clientnid = clientPicker.getSelectedRow(0).nid;
          picker_view.animate(slide_out);
          clientPicker.hide();
        }
        
        if (datePicker.visible == 1) {
          dateText.value =  trackingdate;
          picker_view.animate(slide_out);
          datePicker.hide();
        }
      });
      
      cancel.addEventListener('click', function() {
        picker_view.animate(slide_out);
        datePicker.hide();
        clientPicker.hide();
        projectPicker.hide();
      })
      
      win.add(picker_view);
    
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
        value:node.title,
        height:35,
        top:40,
        left:10,
        width:300,
        font:{fontSize:16},
        borderWidth:2,
        borderColor:'#bbb',
        borderRadius:5,
        paddingLeft: 5,
        paddingRight: 5,
      });
    
      // Add the textfield to the window
      view.add(nodeTitleTextfield);
    
    
      // Create the label for the date
      var dateLabel = Titanium.UI.createLabel({
        text:'Date',
        left:10,
        top:80,
        right:10,
        height:40,
      });
    
      // Add the label to the window
      view.add(dateLabel);
    
      var day = oldDate.getDate().toString();
      var month = (oldDate.getMonth() + 1).toString();
      var year = oldDate.getFullYear();
      if (day.length == 1) {
        day = '0' + day;
      }
      if (month.length == 1) {
        month = '0' + month;
      }
      
      var tr = Titanium.UI.create2DMatrix();
      tr = tr.rotate(90);
      
      var drop_button_date = Titanium.UI.createButton({
        style:Titanium.UI.iPhone.SystemButton.DISCLOSURE,
        transform:tr
      });
      
      // Create the textarea to hold the body
      var dateText = Titanium.UI.createTextField({
        value:year+'-'+month+'-'+day,
        height:40,
        top:115,
        left:10,
        width:300,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        rightButton:drop_button_date,
        rightButtonMode:Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
        enabled:true,
      });
      
      dateText.addEventListener('focus', function() {
        picker_view.animate(slide_out);
      });
      
      drop_button_date.addEventListener('click', function() {
        datePicker.show();
        picker_view.animate(slide_in);
        dateText.blur();
      });
    
      // Add the textarea to the window
      view.add(dateText);
    
      var beginLabel = Titanium.UI.createLabel({
        text:'From',
        left:10,
        top:166,
        width:50,
        height:40,
      });
      
      view.add(beginLabel);
    
      // Create the textarea to hold the body
      var beginText = Titanium.UI.createTextField({
        value:node.timebegin,
        right:10,
        top:160,
        height:35,
        left:65,
        width:60,
        font:{fontSize:16},
        borderWidth:2,
        borderColor:'#bbb',
        borderRadius:5,
        paddingLeft: 5,
        paddingRight: 5,
      });
    
      // Add the textarea to the window
      view.add(beginText);
    
      // Create the label for the date
      var endLabel = Titanium.UI.createLabel({
        text:'To',
        left:135,
        top:160,
        height:40,
        width:30,
      });
    
      // Add the label to the window
      view.add(endLabel);
    
      // Create the textarea to hold the body
      var endText = Titanium.UI.createTextField({
        value:node.timeend,
        top:160,
        height:35,
        left:165,
        width:60,
        font:{fontSize:16},
        borderWidth:2,
        borderColor:'#bbb',
        borderRadius:5,
        paddingLeft: 5,
        paddingRight: 5,
      });
    
      // Add the textarea to the window
      view.add(endText);
      
      var drop_button_client =  Titanium.UI.createButton({
        style:Titanium.UI.iPhone.SystemButton.DISCLOSURE,
        transform:tr
      });
      
      var clientText = Titanium.UI.createTextField({
        hintText:"Choose a client",
        height:40,
        width:300,
        top:200,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        rightButton:drop_button_client,
        rightButtonMode:Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
        enabled:true,
      });
      
      clientText.addEventListener('focus', function() {
        picker_view.animate(slide_out);
      });
      
      drop_button_client.addEventListener('click', function() {
        clientPicker.show();
        picker_view.animate(slide_in);
        clientText.blur();
      });
      
      view.add(clientText)
      
      var drop_button_project = Titanium.UI.createButton({
        style:Titanium.UI.iPhone.SystemButton.DISCLOSURE,
        transform:tr
      });
      
      var projectText = Titanium.UI.createTextField({
        hintText:"Choose a project",
        height:40,
        width:300,
        top:245,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        rightButton:drop_button_project,
        rightButtonMode:Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
        enabled:true,
      });
      
      projectText.addEventListener('focus', function() {
        picker_view.animate(slide_out);
      });
      
      drop_button_project.addEventListener('click', function() {
        projectPicker.show();
        picker_view.animate(slide_in);
        projectText.blur();
      });
      
      view.add(projectText);
    
      // Add the save button
      var saveButton = Titanium.UI.createButton({
        title:'Save',
        height:35,
        width:150,
        top:315
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
        
        var date = dateText.value.split('-');
        // Create a new node object
        var newnode = {
          node:{
            title: nodeTitleTextfield.value,
            // organization_nid:clientnid,
            // project_nid:projectnid,
            trackingdate: {year: date[0], month: date[1], day:date[2]},
            timebegin: beginText.value,
            timeend: endText.value,
          }
        };
        
        // node.title = nodeTitleTextfield.value;
        // node.organization_nid = clientnid;
        // node.project_nid = projectnid;
        // node.trackingdate = {year: date[0], month: date[1], day:date[2]};
        // node.timebegin = beginText.value;
        // node.timeend = endText.value;
    
        // Define the url
        // in this case, we'll connecting to http://example.com/api/rest/node
        var updateurl = REST_PATH + 'node/' + node.nid + '.json';

        // Create a connection
        var updatexhr = Titanium.Network.createHTTPClient();
    
        // Open the connection using POST
        updatexhr.open("PUT", updateurl);
        updatexhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
        updatexhr.setRequestHeader('Cookie', user.session_name+'='+user.sessid);
    
        // Send the connection and the user object as argument
        updatexhr.send(JSON.stringify(newnode));
        Ti.API.info(JSON.stringify(newnode));
        updatexhr.onload = function() {
          // Save the status of the connection in a variable
          // this will be used to see if we have a connection (200) or not
          var statusCode = updatexhr.status;
          // Check if we have a valid status
          Ti.API.info(statusCode);
          if(statusCode == 200) {
    
            // Create a variable response to hold the response
            var response = updatexhr.responseText;
    
            // Parse (build data structure) the JSON response into an object (data)
            var data = JSON.parse(response);
    
            alert("Content with id " + data.nid + ' updated.');
          }
          else {
            alert("There was an error");
          }
        }
    
      });
  		
  		
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
