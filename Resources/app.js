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

// THrobber
Ti.App.throbberView = Ti.UI.createView({
  width: 100,
  height: 100
});

Ti.App.stopWatch = Ti.UI.createImageView({
  image: 'images/stopwatch.png',
});
Ti.App.throbberView.add(Ti.App.stopWatch);

Ti.App.watchHand = Ti.UI.createImageView({
  image: 'images/watchhand.png',
  height: 73,
  width: 73,
  bottom: 6,
  left: 12,
  backgroundColor: 'transparent',
  anchorPoint : {
    x : 0.5,
    y : 0.5
  },
});
Ti.App.throbberTransform = Ti.UI.create2DMatrix();
// t = t.rotate(3); // in degrees
// matrix2d = matrix2d.scale(1.5); // scale to 1.5 times original size
Ti.App.throbberAnimation = Ti.UI.createAnimation({
  transform: Ti.App.throbberTransform,
  duration: 10,
});
Ti.App.throbberView.add(Ti.App.watchHand);

var throbberInterval;

Ti.App.addEventListener('stopThrobberInterval', function() {
  clearInterval(throbberInterval);
});

Ti.App.showThrobber = function(win) {
  win.add(Ti.App.throbberView);
  throbberInterval = setInterval(function() {
    Ti.App.throbberTransform = Ti.App.throbberTransform.rotate(3);
    Ti.App.throbberAnimation.transform = Ti.App.throbberTransform;
    Ti.App.watchHand.animate(Ti.App.throbberAnimation);
  }, 20);
}
