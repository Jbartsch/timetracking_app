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
  
  // Add our scrollview to the window
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
  
  xhr.onload = function() {
  	
  	function hideKeyboard() {
      nodeTitleTextfield.blur();
      beginText.blur();
      endText.blur();
    }
    
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
        items:[cancel,spacer,done],
        barColor: '#383838',
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
      
      var clientButton = Titanium.UI.createButton({
        title:node.organization_title,
        backgroundImage: '../images/select.png',
        color: '#666666',
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        height:35,
        width:280,
        top:10,
      });
      
      clientButton.addEventListener('click', function() {
        hideKeyboard();
        showClientPicker();
      });
      
      view.add(clientButton);
      
      var projectButton = Titanium.UI.createButton({
        title:node.project_title,
        backgroundImage: '../images/select.png',
        color: '#666666',
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        height:35,
        width:280,
        top:55,
      });
      
      projectButton.addEventListener('click', function() {
        hideKeyboard();
        showProjectPicker();
      });
      
      view.add(projectButton);
      
      // Create the textarea to hold the body
      var beginText = Titanium.UI.createTextField({
        value:node.timebegin,
        hintText: 'From',
        top:145,
        height:35,
        left:20,
        width:135,
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        borderWidth:1,
        borderColor:'#bbb',
        borderRadius:3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'white',
      });
    
      // Add the textarea to the window
      view.add(beginText);
      
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
      
      // Create the textarea to hold the body
      var endText = Titanium.UI.createTextField({
        value:node.timeend,
        hintText: 'To',
        top:145,
        height:35,
        right:20,
        width:135,
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        borderWidth:1,
        borderColor:'#bbb',
        borderRadius:3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'white',
      });
    
      // Add the textarea to the window
      view.add(endText);
      
      var dateChangeButton = Titanium.UI.createButton({
        title:currentDateText,
        backgroundImage: '../images/cal_picker.png',
        color: '#666666',
        font: {fontFamily:"Open Sans", fontWeight: 'light'},
        height:35,
        top:190,
        width:280,
      });
      
      dateChangeButton.addEventListener('click', function() {
        hideKeyboard();
        datePicker.show();
        picker_view.animate(slide_in);
      });
    
      // Add the label & button to the view
      view.add(dateChangeButton);
    
      // Create the textfield to hold the node title
      var nodeTitleTextfield = Titanium.UI.createTextArea({
        value:node.title,
        hintText:"Description",
        height:80,
        top:235,
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
        
          Ti.App.actIn.message = 'Saving...';
          win.add(Ti.App.actInView);
          
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
          
          var sessid = Titanium.App.Properties.getString("userSessionId");
          var session_name = Titanium.App.Properties.getString("userSessionName");

          var updateurl = REST_PATH + 'node/' + node.nid + '.json';
          var nodeXhr = Titanium.Network.createHTTPClient();
          nodeXhr.open('PUT', updateurl);
          nodeXhr.setRequestHeader('X-HTTP-Method-Override','PUT');
          nodeXhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
          nodeXhr.setRequestHeader('Cookie', session_name+'='+sessid);
      
          // Send the connection and the user object as argument
          nodeXhr.send(JSON.stringify(newnode));
          nodeXhr.onload = function() {
            // Save the status of the connection in a variable
            // this will be used to see if we have a connection (200) or not
            var statusCode = nodeXhr.status;
            // Check if we have a valid status
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
        var clientUrl = REST_PATH + 'organizations.json';
        var clientXhr = Titanium.Network.createHTTPClient();
        clientXhr.open("GET", clientUrl);
        clientXhr.setRequestHeader('Cookie', session_name+'='+sessid);
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
        var sessid = Titanium.App.Properties.getString("userSessionId");
        var session_name = Titanium.App.Properties.getString("userSessionName");
        var projectUrl = REST_PATH + 'projects.json';
        var projectXhr = Titanium.Network.createHTTPClient();
        projectXhr.open("GET", projectUrl);
        projectXhr.setRequestHeader('Cookie', session_name+'='+sessid);
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

  	}
  }
  xhr.onerror = function() {
    win.remove(Ti.App.actInView);
  }
}
else {
  alert("You need to login first");
}
