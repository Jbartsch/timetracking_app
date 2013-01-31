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
  Ti.App.actIn.message = 'Loading...';
  win.add(Ti.App.actInView);
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
      win.remove(Ti.App.actInView);
      var response = xhr.responseText;
      var result = JSON.parse(response);
      var results = new Array();
      for(var key in result) {
        var data = result[key];
        var row = Titanium.UI.createTableViewRow({
          nid: data.nid,
          titleName: data.title,
          className: 'clientRow',
          height: 60,
        });
        var titleLabel = Titanium.UI.createLabel({
          text: data.title,
          font: {fontFamily:"Open Sans", fontWeight: 'bold', fontSize: 20},
          top: 5,
          left: 5,
        });
        row.add(titleLabel);
        var address = '';
        var zip = data.zip;
        if (zip != '' ) {
          zip = zip + ' ';
        }
        if (data.address != '' && data.city != '') {
          address = data.address + ', ' + zip + data.city;
        }
        else if (data.address == '') {
          address = zip + data.city;
        }
        else if (data.city == '') {
          address = data.address;
        }
        var addressLabel = Titanium.UI.createLabel({
          text: address,
          font: {fontFamily:"Open Sans", fontWeight: 'light', fontSize: 14},
          top: 35,
          left: 5,
        });
        row.add(addressLabel);
        results.push(row);
        // results[key] = {title: data.title, nid:data.nid, font: {fontFamily:"Open Sans", fontWeight: 'bold', fontSize: 20}};
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
          backgroundImage: '../images/background_green.png',
          barColor: '#383838',
          title:e.rowData.title,
          nid:e.rowData.nid,
          touchEnabled: true,
          tabBarHidden: true,
          backButtonTitle: 'Cancel',
        });
        titleBarLabel = Titanium.UI.createLabel({
          text: e.rowData.title,
          color:'#FFF',
          font: {fontFamily:"Open Sans", fontWeight: 'bold', fontSize: 18},
        });
        nodeWindow.setTitleControl(titleBarLabel);
        Titanium.UI.currentTab.open(nodeWindow,{animated:true});
      });
  
      win.add(table);
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
    backgroundImage: '../images/background_green.png',
    barColor: '#383838',
    touchEnabled: true,
    tabBarHidden: true,
    backButtonTitle: 'Cancel',
  });
  titleBarLabel = Titanium.UI.createLabel({
    text: 'Add client',
    color:'#FFF',
    font: {fontFamily:"Open Sans", fontWeight: 'bold', fontSize: 18},
  });
  nodeWindow.setTitleControl(titleBarLabel);
  Titanium.UI.currentTab.open(nodeWindow,{animated:true});
});

win.setRightNavButton(rightButton);
