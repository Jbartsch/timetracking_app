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
  }

  // Create the scrollview
  var view = Titanium.UI.createScrollView({
    contentWidth:'auto',
    contentHeight:'auto',
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:true,
    top: 0,
  });

  // Add the view to the window
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
  
  var clientnid = 0;
  
  var projectnid = 0;
  
  
  var datetxt = '';
  var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
  var datePicker = Ti.UI.createPicker({
    type:Ti.UI.PICKER_TYPE_DATE,
    minDate:new Date(2000,0,1),
    maxDate:new Date(2020,11,31),
    value:new Date(),
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
      clientPickerAdded == 0;
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
    setTimeout(function() {
      if (projectPickerAdded == 1) {
        picker_view.remove(projectPicker);
        projectPickerAdded = 0;
      }
      if (clientPickerAdded == 1) {
        picker_view.remove(clientPicker);
        clientPickerAdded == 0;
      }
      datePicker.hide();
    }, 500);
  });
  
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

  var currentDate = new Date();
  var day = currentDate.getDate().toString();
  var month = (currentDate.getMonth() + 1).toString();
  var monthString = monthNames[currentDate.getMonth()];
  var year = currentDate.getFullYear();
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

  var hours = currentDate.getHours().toString();
  var minutes = currentDate.getMinutes().toString();
  if (hours.length == 1) {
    hours = '0' + hours;
  }
  if (minutes.length == 1) {
    minutes = '0' + minutes;
  }
  
  var endTime = hours+':'+minutes; 

  // Create the textarea to hold the body
  var endText = Titanium.UI.createTextField({
    value:endTime,
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
    title:"Choose a client",
    height:40,
    width:300,
    top:150,
  });
  
  clientButton.addEventListener('click', function() {
    hideKeyboard();
    showClientPicker();
  });
  
  view.add(clientButton)
  
  var projectButton = Titanium.UI.createButton({
    title:"Choose a project",
    height:40,
    width:300,
    top:200,
  });
  
  projectButton.addEventListener('click', function() {
    hideKeyboard();
    showProjectPicker(); 
  });
  
  view.add(projectButton);

  // Add the save button
  var saveButton = Titanium.UI.createButton({
    title:'Save',
    height:35,
    width:150,
    top:260
  });

  // Add the button to the window
  view.add(saveButton);

  win.addEventListener("focus", function(e) {
    if (e.source.top == 50) {
      nodeTitleTextfield.value = '';
      datetxt = year+'-'+month+'-'+day;
      dateChangeButton.text = monthString + ' ' + day + ', ' + year;
      beginText.value = '';
      endText.value = hours+':'+minutes;
    }
  });

  // Add the event listener for when the button is created
  saveButton.addEventListener("click", function() {
    
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
      var node = {
        node:{
          title: nodeTitleTextfield.value,
          type:'stormtimetracking',
          organization_nid:clientnid,
          project_nid:projectnid,
          trackingdate: {year: date[0], month: date[1], day:date[2]},
          timebegin: beginText.value,
          timeend: endText.value,
          uid: user.uid,
          billable: 0,
          billed: 0
        }
      };
  
      // Define the url
      // in this case, we'll connecting to http://example.com/api/rest/node
      var url = REST_PATH + 'node';
  
      // Create a connection
      var xhr = Titanium.Network.createHTTPClient();
  
      // Open the connection using POST
      xhr.open("POST", url);
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
  
          alert('Timetracking "' + node.node.title + '" created.');
          nodeTitleTextfield.value = '';
          dateChangeButton.title = currentDateText;
          beginText.value = '';
          endText.value = endTime;
          clientnid = 0;
          projectnid = 0;
          clientButton.title = 'Choose a client';
          projectButton.title = 'Choose a project';
        }
        else {
          alert("There was an error");
        }
      }
      
      xhr.onerror = function() {
        Ti.API.info('onerror');
        var statusCode = xhr.status;
        Ti.API.info(statusCode);
        var response = JSON.parse(xhr.responseText);
        Ti.API.info(response);
      }
    }
  });
  
  function hideKeyboard() {
    nodeTitleTextfield.blur();
    beginText.blur();
    endText.blur();
  }
  
  function showClientPicker() {
    var clientUrl = REST_PATH + 'organizations.json';
    // Create a connection inside the variable xhr
    var clientXhr = Titanium.Network.createHTTPClient();
    // Open the xhr
    clientXhr.open("GET", clientUrl);
    clientXhr.setRequestHeader('Cookie', sessName+'='+sessId);
    // Send the xhr
    clientXhr.send();
    clientPicker = Ti.UI.createPicker({
      top:43,
      selectionIndicator:true
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
          i = i + 1;
        }
        projectPicker.add(results);
        picker_view.add(projectPicker);
        projectPickerAdded = 1;
        picker_view.animate(slide_in);
      }
    }
  }
  
  
  // Create a new button
  var rightButton = Ti.UI.createButton({
    title: 'List',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  
  // Create a new event listener for the rightButton
  rightButton.addEventListener("click", function() {
    var timetrackingsWindow = Titanium.UI.createWindow({
      url:'timetrackings.js',
      backgroundColor: '#D8D8D8',
      barColor: '#009900',
      touchEnabled: true,
      tabBarHidden: true,
    });
    
    Titanium.UI.currentTab.open(timetrackingsWindow,{animated:true});
  });
  
  // We don't add the button to the window, instead, we tell the app
  // to set the button as the right navigation button
  win.setRightNavButton(rightButton);
}
else {
  alert("You need to login first");
}
