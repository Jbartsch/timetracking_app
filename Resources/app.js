// Create a reference to the underscore.js module
// var _ = require('lib/underscore')._;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
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

// Create the home window
// var homeWin = Titanium.UI.createWindow({
  // // Set the title for the window
    // title:'Projects',
// 
    // // Set the background color for the window
    // backgroundColor:'#fff',
// 
    // // The actual window data will be in this file, not here
    // url: 'home.js'
// });

// Create the home tab
// var homeTab = Titanium.UI.createTab({
  // // Set the icon for the button
    // icon:'icons/53-house.png',
// 
    // // Set the title for the tab
    // title:'Projects',
// 
    // // Relate the tab to a window so the app knows what window to open.
    // window:homeWin
// });

// Create the project window
// var projectWin = Ti.UI.createWindow({
  // title: "Projects",
  // backgroundColor: '#fff',
  // url: 'includes/projects.js',
// });
// 
// // Create the project tab
// var projectTab = Ti.UI.createTab({
  // icon: "icons/111-user.png",
  // title: "Projects",
  // window: projectWin
// });

// Create the timetracking add window
var timeWin = Ti.UI.createWindow({
  title: 'Add Timetracking',
  backgroundColor: '#fff',
  url: 'includes/add-timetracking.js'
});

// Create the timetracking tab
var timeTab = Ti.UI.createTab({
  icon: "icons/11-clock.png",
  title:'Add Timetracking',
  window: timeWin
});

// Create the timetrackings view window
var timeViewWin = Ti.UI.createWindow({
  title: "Timetrackings",
  backgroundColor: '#fff',
  url: 'includes/timetrackings.js',
});

// Create the project tab
var timeViewTab = Ti.UI.createTab({
  icon: "icons/111-user.png",
  title: "Timetrackings",
  window: timeViewWin
});

// Create a new window here to show the form
// var settingsWin = Ti.UI.createWindow({
  // title: "Settings",
  // modal: true,
  // url: 'includes/settings.js',
// });
// 
// Ti.App.settingsWin = settingsWin;

var logoutWin = Ti.UI.createWindow({
  title: "Logout",
  fullscreen: true,
  url: 'includes/logout.js',
});

Ti.App.logoutWin = logoutWin;

Ti.App.tabGroup = tabGroup;

// Add the home tab to the tab group
// Ti.App.tabGroup.addTab(homeTab);

// Add the timetracking tab to the tab group
Ti.App.tabGroup.addTab(timeTab);
Ti.App.tabGroup.addTab(timeViewTab);
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


