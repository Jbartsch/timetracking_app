/**
 * Remember that in the debug process we can always use:
 * Ti.API.info(foo);
 * to log something to the console
 */

// Include our config file
Ti.include('../config.js');

// Define the variable win to contain the current window
var win = Ti.UI.currentWindow;

var slide_in =  Titanium.UI.createAnimation({bottom:0});
var slide_out =  Titanium.UI.createAnimation({bottom:-251});

// Create the scrollview
var view = Titanium.UI.createView({
  contentWidth:'auto',
  contentHeight:'auto',
  top: 0,
  backgroundColor: '#D8D8D8',
});

// Add our scrollview to the window
win.add(view);

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

var clientnid = 0;
var projectnid = 0;
var total = 0;

var duration1 = Titanium.UI.createLabel({
  text: 'All Clients All Projects',
  font: {fontSize: '13', fontFamily:"Open Sans", fontWeight: 'bold'},
  top: 0,
  height: 20,
  backgroundColor: '#000',
  opacity: 0.8,
  color: '#FFF',
  width: 320,
});
view.add(duration1);
var duration2 = Titanium.UI.createLabel({
  font: {fontSize: '13', fontFamily:"Open Sans", fontWeight: 'bold'},
  top: 20,
  height: 20,
  backgroundColor: '#000',
  opacity: 0.8,
  color: '#FFF',
  width: 320,
});
view.add(duration2);

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

var startTime = 0;
var startClicked = 0;
var endTime = 0;
var endClicked = 0;

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
  trackingdate = monthString + ' ' + day + ', ' + year;
  if (startClicked == 1) {
    startTime = (Date.parse(trackingdate) / 1000);
  }
  if (endClicked == 1) {
    endTime = (Date.parse(trackingdate) / 1000);
  }
});

var durationText = 'All clients All projects';
done.addEventListener('click',function() {
  
  if (clientPickerAdded == 1) {
    Ti.API.info('bla');
    clientButton.title =  clientPicker.getSelectedRow(0).title;
    durationText = clientPicker.getSelectedRow(0).title;
    duration2.text = clientPicker.getSelectedRow(0).title;
    clientnid = clientPicker.getSelectedRow(0).nid;
    picker_view.animate(slide_out);
    setTimeout(function(){
      picker_view.remove(clientPicker);
    }, 500);
    clientPickerAdded == 0;
  }
  else {
    durationText = 'All clients';
  }
  
  if (projectPickerAdded == 1) {
    projectButton.title =  projectPicker.getSelectedRow(0).title;
    durationText = durationText + ' ' + projectPicker.getSelectedRow(0).title;
    projectnid = projectPicker.getSelectedRow(0).nid;
    picker_view.animate(slide_out);
    setTimeout(function(){
      picker_view.remove(projectPicker);
    }, 500);
    projectPickerAdded = 0;
  }
  else {
    durationText = durationText + ' All projects';
  }

  if (startClicked == 1) {
    startClicked = 0;
    // dateChangeButton.title = trackingdate;
    picker_view.animate(slide_out);
    setTimeout(function(){
      datePicker.hide();
    }, 500);
    loadView();
  }
  if (endClicked == 1) {
    endClicked = 0;
    picker_view.animate(slide_out);
    setTimeout(function(){
      datePicker.hide();
    }, 500);
    loadView();
  }
});

cancel.addEventListener('click', function() {
  picker_view.animate(slide_out);
  setTimeout(function() {
    if (clientPickerAdded == 1) {
      picker_view.remove(clientPicker);
      clientPickerAdded == 0;
    }
    if (projectPickerAdded == 1) {
      picker_view.remove(projectPicker);
      projectPickerAdded = 0;
    }
    datePicker.hide();
  }, 500);
});

win.add(picker_view);

var table;

function loadView() {
  Ti.App.actIn.message = 'Loading...';
  win.add(Ti.App.actInView);
  var url = REST_PATH + 'stormtimetracking.json?organization=' + clientnid + '&project=' + projectnid + '&start=' + startTime + '&end=' + endTime;
  var xhr = Titanium.Network.createHTTPClient();
  xhr.open("GET",url);
  var sessName = Titanium.App.Properties.getString("userSessionName");
  var sessId = Titanium.App.Properties.getString("userSessionId");
  xhr.setRequestHeader('Cookie', sessName+'='+sessId);
  xhr.send();
  total = 0;
  xhr.onload = function() {
    var statusCode = xhr.status;
    if(statusCode == 200) {
      win.remove(Ti.App.actInView);
      var response = xhr.responseText;
      var result = JSON.parse(response);
      var results = new Array();
      for(var key in result) {
        var data = result[key];
        var date = new Date(data.trackingdate*1000);
        var day = date.getDate();
        if (day < 10) {
          day = '0' + day;
        }
        var month = date.getMonth() + 1;
        if (month < 10) {
          month = '0' + month;
        }
        var year = date.getFullYear();
        title = day + '.' + month + '.' + year + '   ' + data.timebegin + ' - ' + data.timeend;
        var hours = Math.floor(data.duration);
        if (hours < 10) {
          hours = '0' + hours;
        }
        var minDec = data.duration - hours;
        var mins = Math.round(60 * minDec);
        if (mins < 10) {
          mins = '0' + mins;
        }
        var row = Titanium.UI.createTableViewRow({
          nid: data.nid,
          titleName: data.title,
          className: 'timetrackingRow',
          height: 75,
        });
        var durationLabel = Titanium.UI.createLabel({
          text: hours + ':' + mins,
          font: {fontSize: '45', fontFamily:"Open Sans", fontWeight: 'bold'},
          color: '#8CC63F',
          top: -5,
          left: 10,
        });
        row.add(durationLabel);
        var dateView = Titanium.UI.createView({
          left: 0,
          width: 128,
          top: 35,
        });
        row.add(dateView);
        var timeLabel = Titanium.UI.createLabel({
          text: data.timebegin + ' - ' + data.timeend,
          font: {fontSize: '9', fontFamily:"Open Sans", fontWeight: 'light'},
          right: 0,
          height: 9,
        });
        dateView.add(timeLabel);
        var dateLabel = Titanium.UI.createLabel({
          text: day + '.' + month + '.' + year,
          font: {fontSize: '9', fontFamily:"Open Sans", fontWeight: 'light'},
          top: 25,
          right: 0,
          height: 9,
        });
        dateView.add(dateLabel);
        var projectLabel = Titanium.UI.createLabel({
          text: data.project_title,
          font: {fontSize: '14', fontFamily:"Open Sans", fontWeight: 'bold'},
          top: 8,
          left: 150,
          height: 20,
          verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
        });
        row.add(projectLabel);
        var clientLabel = Titanium.UI.createLabel({
          text: data.organization_title,
          font: {fontSize: '14', fontFamily:"Open Sans", fontWeight: 'light'},
          top: 24,
          left: 150,
          height: 20,
          verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
        });
        row.add(clientLabel);
        var titleLabel = Titanium.UI.createLabel({
          text: data.title,
          font: {fontSize: '12', fontFamily:"Open Sans", fontWeight: 'light'},
          top: 48,
          left: 150,
          ellipsize: true,
          height: 12,
          verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
        });
        row.add(titleLabel);        
        results.push(row);
        total = total + Number(data.duration);
      }
  
      table = Titanium.UI.createTableView({
        data:results,
        backgroundColor: '#D8D8D8',
        separatorColor: '#BBBBBB',
        editable: true,
        top: 40,
        height: view.toImage().height - 75,
      });
      
      var hours = Math.floor(total);
      if (hours < 10) {
        hours = '0' + hours;
      }
      var minDec = total - hours;
      var mins = Math.round(60 * minDec);
      if (mins < 10) {
        mins = '0' + mins;
      }
      
      duration1.text = durationText;
      duration2.text = 'Duration: ' + hours + ':' + mins;
      
      table.addEventListener('delete', function(e) {
        deleteRow(e.rowData.nid);
      });
  
      table.addEventListener('click',function(e) {
        var nodeWindow = Titanium.UI.createWindow({
          url:'edit-timetracking.js',
          backgroundImage: '../images/background_green.png',
          barColor: '#383838',
          title:e.rowData.titleName,
          nid:e.rowData.nid,
          touchEnabled: true,
          tabBarHidden: true,
          backButtonTitle: 'Cancel',
        });
        titleBarLabel = Titanium.UI.createLabel({
          text: e.rowData.titleName,
          color:'#FFF',
          font: {fontFamily:"Open Sans", fontWeight: 'bold', fontSize: 18},
        });
        nodeWindow.setTitleControl(titleBarLabel);
        Titanium.UI.currentTab.open(nodeWindow,{animated:true});
      });
  
      view.add(table);
    }
  }
  xhr.onerror = function() {
    win.remove(Ti.App.actInView);
  }
}

function deleteRow(nid) {
  var sessName = Titanium.App.Properties.getString("userSessionName");
  var sessId = Titanium.App.Properties.getString("userSessionId");
  var url = REST_PATH + 'node/' + nid + '.json';
  var xhr = Titanium.Network.createHTTPClient();
  xhr.open('DELETE', url);
  xhr.setRequestHeader('X-HTTP-Method-Override','DELETE');
  xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
  xhr.setRequestHeader('Cookie', sessName+'='+sessId);
  xhr.send();
  xhr.onload = function() {
    if(xhr.status != 200) {
      Ti.API.info(xhr.status);
      Ti.App.message('error', 'There was an error.', win);
    }
    else {
      Ti.App.message('info', 'Timetracking deleted.', win);
    }
  }
  xhr.onerror = function() {
    Ti.API.info(xhr.status);
  }
}

win.addEventListener("focus", function() {
  loadView();
});

// FILTER

var filterIn =  Titanium.UI.createAnimation({top:0});
var filterOut =  Titanium.UI.createAnimation({top:-150});

var filter = 0;
  
var filterView = Titanium.UI.createView({
  height: 150,
  top: -150,
  zIndex:100,
});
win.add(filterView);

var filterBG = Titanium.UI.createView({
  backgroundColor: '#000',
  opacity: 0.8,
})
filterView.add(filterBG);

var clientButton = Titanium.UI.createButton({
  title:"Select a client",
  backgroundImage: '../images/select.png',
  color: '#666666',
  font: {fontFamily:"Open Sans", fontWeight: 'light'},
  height:35,
  width:280,
  top:10,
});
clientButton.addEventListener('click', function() {
  showClientPicker();
});
filterView.add(clientButton);

var projectButton = Titanium.UI.createButton({
  title:"Select a project",
  backgroundImage: '../images/select.png',
  color: '#666666',
  font: {fontFamily:"Open Sans", fontWeight: 'light'},
  height:35,
  width:280,
  top:55,
});

projectButton.addEventListener('click', function() {
  showProjectPicker();
});
filterView.add(projectButton);

var filterButton = Titanium.UI.createButton({
  title:'Filter',
  backgroundImage: 'none',
  backgroundGradient: {
    type: 'linear',
    startPoint: { x: '50%', y: '0%' },
    endPoint: { x: '50%', y: '100%' },
    colors: [ { color: '#3536363', offset: 0.0}, { color: '#747674', offset: 1.0 } ],
  },
  font: {fontFamily:"Open Sans", fontWeight: 'light'},
  height:35,
  width:280,
  top:100
});

filterButton.addEventListener('click', function() {
  filterView.animate(filterOut);
  filter = 0;
  loadView();
});
filterView.add(filterButton);

var startButton = Titanium.UI.createButton({
  title:'From',
  backgroundImage: 'none',
  backgroundGradient: {
    type: 'linear',
    startPoint: { x: '50%', y: '0%' },
    endPoint: { x: '50%', y: '100%' },
    colors: [ { color: '#3536363', offset: 0.0}, { color: '#747674', offset: 1.0 } ],
  },
  font: {fontFamily:"Open Sans", fontWeight: 'light'},
  height:35,
  width:160,
  left: 0,
  bottom: 0,
})
startButton.addEventListener('click', function() {
  startClicked = 1;
  datePicker.show();
  picker_view.animate(slide_in);
});
view.add(startButton);

var endButton = Titanium.UI.createButton({
  title:'To',
  backgroundImage: 'none',
  backgroundGradient: {
    type: 'linear',
    startPoint: { x: '50%', y: '0%' },
    endPoint: { x: '50%', y: '100%' },
    colors: [ { color: '#3536363', offset: 0.0}, { color: '#747674', offset: 1.0 } ],
  },
  font: {fontFamily:"Open Sans", fontWeight: 'light'},
  height:35,
  width:160,
  right: 0,
  bottom: 0,
})
endButton.addEventListener('click', function() {
  datePicker.show();
  picker_view.animate(slide_in);
  endClicked = 1;
});
view.add(endButton);

var rightButton = Ti.UI.createButton({
  backgroundImage: '../images/filter.png',
  height: 24,
  width: 24,
});

rightButton.addEventListener("click", function() {
  if (filter == 0) {
    filterView.animate(filterIn);
    filter = 1;
  }
  else {
    filterView.animate(filterOut);
    filter = 0;
  }
});

win.setRightNavButton(rightButton);

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
    selectionIndicator:true
  });
  clientXhr.onload = function() {
    var statusCode = clientXhr.status;
    if(statusCode == 200) {
      var response = clientXhr.responseText;
      var result = JSON.parse(response);
      var results = new Array();
      var i = 0;
      results[0] = Ti.UI.createPickerRow({title: 'Select a client', nid:0});
      for(var key in result) {
        var data = result[key];
        i = i + 1;
        results[i] = Ti.UI.createPickerRow({title: data.title, nid:data.nid}); 
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
  var projectUrl = REST_PATH + 'stormproject.json?organization=' + clientnid;
  var projectXhr = Titanium.Network.createHTTPClient();
  projectXhr.open("GET", projectUrl);
  projectXhr.setRequestHeader('Cookie', session_name+'='+sessid);
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
      results[0] = Ti.UI.createPickerRow({title: 'Select a project', nid:0});
      for(var key in result) {
        var data = result[key];
        i = i + 1;
        results[i] = Ti.UI.createPickerRow({title: data.title, nid:data.nid});
      }
      projectPicker.add(results);
      picker_view.add(projectPicker);
      projectPickerAdded = 1;
      picker_view.animate(slide_in);
    }
  }
}