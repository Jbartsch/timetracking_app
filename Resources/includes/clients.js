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
var view = Titanium.UI.createScrollView({
  contentWidth:'auto',
  contentHeight:'auto',
  showVerticalScrollIndicator:true,
  showHorizontalScrollIndicator:true,
  top: 0
});

// Add our scrollview to the window
win.add(view);

var table;

function loadClients() {
  Ti.App.showThrobber(win);
  var url = REST_PATH + 'organizations.json';
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
        results[key] = {title: data.title, nid:data.nid};
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
          url:'edit-client.js',
          backgroundColor: '#D8D8D8',
          barColor: '#009900',
          title:e.rowData.title,
          nid:e.rowData.nid,
          touchEnabled: true,
          tabBarHidden: true,
        });

        Titanium.UI.currentTab.open(nodeWindow,{animated:true});
      });
  
      win.add(table);
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
  loadClients();
});

var rightButton = Ti.UI.createButton({
  systemButton:Ti.UI.iPhone.SystemButton.ADD
});

rightButton.addEventListener("click", function() {
  var nodeWindow = Titanium.UI.createWindow({
    title:'Add client',
    url:'add-client.js',
    backgroundColor: '#D8D8D8',
    barColor: '#009900',
    touchEnabled: true,
    tabBarHidden: true,
  });

  Titanium.UI.currentTab.open(nodeWindow,{animated:true});
});

win.setRightNavButton(rightButton);
