/**
 * This is the home window
 *
 * It doesn't do anything fancy, the only thing it does is to create a table
 * with links to other windows that actually demonstrates the functionality
 *
 * To see how a table is created see the file controls.js in Kitchen Sink
 */

// Define the variable win to contain the current window
var win = Ti.UI.currentWindow;

win.title = 'Home';

// Create the scrollview
var view = Titanium.UI.createView({
  width: "100%",
  height: "100%"
});

// Add our scrollview to the window
win.add(view);

var homeText = Titanium.UI.createTextArea({
  editable: '0',
  text:'Welcome message',
  value: 'Welcome to timetracking app.\nYou can log in or register a new account.',
  font:{fontSize:18, fontWeight: "light"},
  color: 'white',
  left:10,
  top:40,
  width:300,
  height:'auto',
  backgroundColor: 'transparent',
});

view.add(homeText);

var loginButton = Titanium.UI.createButton({
  title:'Login',
  height:40,
  width:250,
  top:140
});

view.add(loginButton);

loginButton.addEventListener('click', function() {
  var loginWin = Titanium.UI.createWindow({
    title:'Login',
    backgroundColor:'#009900',
    barColor: '#009900',
    url: 'includes/login.js',
    navBarHidden: true,
  });
  var linearGradient = Ti.UI.createView({
    backgroundGradient: {
      type: 'linear',
      startPoint: { x: '50%', y: '00%' },
      endPoint: { x: '50%', y: '100%' },
      colors: [ { color: '#00CC00 ', offset: 0.0}, { color: '#009900', offset: 0.25 }, { color: '#00CC00', offset: 1.0 } ],
    }
  });
  loginWin.add(linearGradient);
  loginWin.open();
  win.hide();
});

var registerButton = Titanium.UI.createButton({
  title:'Register',
  height:40,
  width:250,
  top:200
});

view.add(registerButton);

registerButton.addEventListener('click', function() {
  var registerWin = Titanium.UI.createWindow({
    title:'Register',
    backgroundColor:'#009900',
    url: 'includes/register.js',
    navBarHidden: true,
  });
  var linearGradient = Ti.UI.createView({
    backgroundGradient: {
      type: 'linear',
      startPoint: { x: '50%', y: '00%' },
      endPoint: { x: '50%', y: '100%' },
      colors: [ { color: '#00CC00 ', offset: 0.0}, { color: '#009900', offset: 0.25 }, { color: '#00CC00', offset: 1.0 } ],
    }
  });
  registerWin.add(linearGradient);
  registerWin.open();
  win.hide();
});