/**
 * Remember that in the debug process we can always use:
 * Ti.API.info(foo);
 * to log something to the console
 */

// Include our config file
Ti.include('../config.js');

// Define the variable win to contain the current window
var win = Ti.UI.currentWindow;

// Create the scrollview
var view = Titanium.UI.createView({
  contentWidth:'auto',
  contentHeight:'auto',
  top: 0,
  backgroundColor: '#D8D8D8',
});

// Add our scrollview to the window
win.add(view);

var table;

function loadView() {
  Ti.App.showThrobber(win);
  var url = REST_PATH + 'timetrackings.json';
  var xhr = Titanium.Network.createHTTPClient();
  xhr.open("GET",url);
  var sessName = Titanium.App.Properties.getString("userSessionName");
  var sessId = Titanium.App.Properties.getString("userSessionId");
  xhr.setRequestHeader('Cookie', sessName+'='+sessId);
  xhr.send();
  xhr.onload = function() {
    var statusCode = xhr.status;
    if(statusCode == 200) {
      Ti.App.fireEvent('stopThrobberInterval');
      win.remove(Ti.App.throbberView);
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
          text: data.project,
          font: {fontSize: '14', fontFamily:"Open Sans", fontWeight: 'bold'},
          top: 8,
          left: 150,
          height: 20,
          verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
        });
        row.add(projectLabel);
        var clientLabel = Titanium.UI.createLabel({
          text: data.organization,
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
        // results[key] = {title: title, nid:data.nid};
      }
  
      table = Titanium.UI.createTableView({
        data:results,
        backgroundColor: '#D8D8D8',
        separatorColor: '#BBBBBB',
        editable: true,
      });
      
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
    Ti.App.fireEvent('stopThrobberInterval');
    win.remove(Ti.App.throbberView);
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
      alert("There was an error");
    }
  }
  xhr.onerror = function() {
    Ti.API.info(xhr.status);
  }
}

win.addEventListener("focus", function() {
  loadView();
});
