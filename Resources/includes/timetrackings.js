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
  // showVerticalScrollIndicator:true,
  // showHorizontalScrollIndicator:true,
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
        results[key] = {title: title, nid:data.nid};
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
          backgroundColor: '#D8D8D8',
          barColor: '#009900',
          title:e.rowData.title,
          nid:e.rowData.nid,
          touchEnabled: true,
          tabBarHidden: true,
        });
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
