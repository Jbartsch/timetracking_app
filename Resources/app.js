// this sets the background color of the master UIView (when there are no windows/tab groups on it)
// Titanium.UI.setBackgroundColor('#D8D8D8');
Ti.include('config.js');

//Create a user variable to hold some information about the user
var user = {
  uid: Titanium.App.Properties.getInt("userUid"),
  sessid: Titanium.App.Properties.getString("userSessionId"),
  session_name: Titanium.App.Properties.getString("userSessionName"),
}

Ti.App.buildTabGroup = function buildTabGroup() {
  var tabGroup = Titanium.UI.createTabGroup();

  // Create the timetracking add window
  var timeWin = Ti.UI.createWindow({
    title: 'Add Timetracking',
    backgroundImage: 'images/background_green.png',
    barColor: '#383838',
    url: 'includes/add-timetracking.js'
  });
  titleBarLabel = Titanium.UI.createLabel({
    text: 'Add Timetracking',
    color:'#FFF',
    font: {fontFamily:"Open Sans", fontWeight: 'bold', fontSize: 18},
  });
  timeWin.setTitleControl(titleBarLabel);
  
  // Create the timetracking tab
  var timeTab = Ti.UI.createTab({
    icon: "icons/78-stopwatch.png",
    title:'Timetracking',
    window: timeWin
  });
  
  // Create the timetrackings view window
  var clientsWin = Ti.UI.createWindow({
    title: "Clients",
    backgroundColor: '#D8D8D8',
    barColor: '#383838',
    url: 'includes/clients.js',
  });
  titleBarLabel = Titanium.UI.createLabel({
    text: 'Clients',
    color:'#FFF',
    font: {fontFamily:"Open Sans", fontWeight: 'bold', fontSize: 18},
  });
  clientsWin.setTitleControl(titleBarLabel);
  
  // Create the project tab
  var clientsTab = Ti.UI.createTab({
    icon: "icons/112-group.png",
    title: "Clients",
    window: clientsWin
  });
  
  // Create the project window
  var projectsWin = Ti.UI.createWindow({
    title: "Projects",
    backgroundColor: '#D8D8D8',
    barColor: '#383838',
    url: 'includes/projects.js',
  });
  titleBarLabel = Titanium.UI.createLabel({
    text: 'Projects',
    color:'#FFF',
    font: {fontFamily:"Open Sans", fontWeight: 'bold', fontSize: 18},
  });
  projectsWin.setTitleControl(titleBarLabel);
  
  // Create the project tab
  var projectsTab = Ti.UI.createTab({
    icon: "icons/104-index-cards.png",
    title: "Projects",
    window: projectsWin
  });
  
  // Create a new window here to show the form
  var settingsWin = Ti.UI.createWindow({
    title: "Settings",
    backgroundImage: 'images/background_green.png',
    barColor: '#383838',
    url: 'includes/settings.js',
  });
  titleBarLabel = Titanium.UI.createLabel({
    text: 'Settings',
    color:'#FFF',
    font: {fontFamily:"Open Sans", fontWeight: 'bold', fontSize: 18},
  });
  settingsWin.setTitleControl(titleBarLabel);
  
  // Create the settings tab
  var settingsTab = Ti.UI.createTab({
    icon: "icons/19-gear.png",
    title: "Settings",
    window: settingsWin
  });
  
  Ti.App.tabGroup = tabGroup;
  
  Ti.App.tabGroup.addTab(timeTab);
  Ti.App.tabGroup.addTab(clientsTab);
  Ti.App.tabGroup.addTab(projectsTab);
  Ti.App.tabGroup.addTab(settingsTab);
}

var logoutWin = Ti.UI.createWindow({
  title: "Logout",
  backgroundColor:'#000',
  fullscreen: true,
  url: 'includes/logout.js',
});

Ti.App.logoutWin = logoutWin;

var homeWin = Titanium.UI.createWindow({
  title:'Home',
  // backgroundColor:'#009900',
  backgroundImage: 'images/background_green.png',
  url: 'home.js',
  navBarHidden: true,
  visible: false,
});

// homeWin.add(linearGradient);
Ti.App.homeWin = homeWin;

var url = REST_PATH + 'system/connect.json';
var xhr = Titanium.Network.createHTTPClient();
xhr.open("POST", url);
xhr.setRequestHeader('Cookie', user.sess_name+'='+user.sessid);
xhr.send();
xhr.onload = function() {
  Ti.App.homeWin.open();
  data = JSON.parse(xhr.responseText);
  if (data.user.uid > 0) {
    Ti.App.homeWin.hide();
    Ti.App.buildTabGroup();
    Ti.App.tabGroup.open();    
  }
  else {
    Titanium.App.Properties.removeProperty("userUid");
    Titanium.App.Properties.removeProperty("userSessionId");
    Titanium.App.Properties.removeProperty("userSessionName");
    Ti.App.homeWin.show();
  }
}
xhr.onerror = function() {
  var noNetworkWin = Titanium.UI.createWindow({
    title:'Home',
    backgroundImage: '../images/background_green.png',
    url: 'includes/no-network.js',
    navBarHidden: true,
  });
  noNetworkWin.open();
}

// Activity Indicator
Ti.App.actInView = Ti.UI.createView();
Ti.App.actInBG = Ti.UI.createView({
  backgroundColor: '#000',
  opacity: 0.5,
  height: 40,
  width: 180,
  borderRadius: 8,
})
Ti.App.actInView.add(Ti.App.actInBG);
Ti.App.actIn = Ti.UI.createActivityIndicator({
  color: 'white',
  font: {fontFamily:'Open Sans', fontSize:18},
  message: 'Loading...',
  style: Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
  height:Ti.UI.SIZE,
  width:Ti.UI.SIZE
});
Ti.App.actInView.add(Ti.App.actIn);
Ti.App.actIn.show();
