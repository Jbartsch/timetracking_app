// Create a reference to the underscore.js module
// var _ = require('lib/underscore')._;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#D8D8D8');
Ti.include("lib/tiajax.js");

// Create tab group to hold all the tabs
var tabGroup = Titanium.UI.createTabGroup();

//Create a user variable to hold some information about the user
var user = {
  uid: Titanium.App.Properties.getInt("userUid"),
  sessid: Titanium.App.Properties.getString("userSessionId"),
  session_name: Titanium.App.Properties.getString("userSessionName"),
  name: Titanium.App.Properties.getString("userName"),
}


Ti.UI.loginCount = 0;

// Create the login window
var loginWin = Titanium.UI.createWindow({
  // Set the title for the window
    title:'Login',
    // Set the background color for the window
    backgroundColor:'#fff',
    // The actual window data will be in this file, not here
    url: 'includes/login.js',
    exitOnClose: true,
    navBarHidden: true,
});

Ti.App.loginWin = loginWin;

var linearGradient = Ti.UI.createView({
    // top: 10,
    // width: 100,
    // height: 100,
    backgroundGradient: {
        type: 'linear',
        startPoint: { x: '50%', y: '00%' },
        endPoint: { x: '50%', y: '100%' },
        colors: [ { color: '#00CC00	', offset: 0.0}, { color: '#009900', offset: 0.25 }, { color: '#00CC00', offset: 1.0 } ],
    }
});
loginWin.add(linearGradient);

// Create the timetracking add window
var timeWin = Ti.UI.createWindow({
  title: 'Add Timetracking',
  backgroundColor: '#D8D8D8',
  barColor: '#009900',
  url: 'includes/add-timetracking.js'
});

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
  barColor: '#009900',
  url: 'includes/clients.js',
});

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
  barColor: '#009900',
  url: 'includes/projects.js',
});

// Create the project tab
var projectsTab = Ti.UI.createTab({
  icon: "icons/104-index-cards.png",
  title: "Projects",
  window: projectsWin
});

// Create a new window here to show the form
var settingsWin = Ti.UI.createWindow({
  title: "Settings",
  backgroundColor: '#D8D8D8',
  barColor: '#009900',
  url: 'includes/settings.js',
});

// Create the settings tab
var settingsTab = Ti.UI.createTab({
  icon: "icons/19-gear.png",
  title: "Settings",
  window: settingsWin
});

var logoutWin = Ti.UI.createWindow({
  title: "Logout",
  fullscreen: true,
  url: 'includes/logout.js',
});

Ti.App.logoutWin = logoutWin;
Ti.App.tabGroup = tabGroup;

// Add the timetracking tab to the tab group
Ti.App.tabGroup.addTab(timeTab);
Ti.App.tabGroup.addTab(clientsTab);
Ti.App.tabGroup.addTab(projectsTab);
Ti.App.tabGroup.addTab(settingsTab);
// 
// // Add the user tab to the tab group
// Ti.App.tabGroup.addTab(projectTab);

if(Titanium.App.Properties.getInt("userUid")) {
  // open tab group
  Ti.App.tabGroup.open();
}
else {
  loginWin.open();
}


