Ti.include('config.js');

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

var loginText = Titanium.UI.createTextArea({
  editable: '0',
  text:'Welcome message',
  value: 'Please provide your login credentials.',
  font:{fontSize:16, fontFamily:"Open Sans", fontWeight: "light"},
  color: 'white',
  top:30,
  width:280,
  height:'auto',
  backgroundColor: 'transparent',
});

view.add(loginText);

// Create the username textfield
var usernameTextfield = Titanium.UI.createTextField({
  hintText:'Username',
  height:35,
  top:100,
  width:280,
  font: {fontFamily:"Open Sans", fontWeight: 'light'},
  borderWidth:1,
  borderColor:'#bbb',
  borderRadius:3,
  autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
  paddingLeft: 5,
  paddingRight: 5,
  backgroundColor: 'white',
});

view.add(usernameTextfield);

// Create the password textfield
var passwordTextfield = Titanium.UI.createTextField({
  hintText:'Password',
  height:35,
  top:145,
  width:280,
  font: {fontFamily:"Open Sans", fontWeight: 'light'},
  borderWidth:1,
  borderColor:'#bbb',
  borderRadius:3,
  autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
  passwordMask:true,
  paddingLeft: 5,
  paddingRight: 5,
  backgroundColor: 'white',
});

view.add(passwordTextfield);

var loginButton = Titanium.UI.createButton({
  title:'Login',
  backgroundImage: 'images/login.png',
  color: '#666666',
  font: {fontFamily:"Open Sans", fontWeight: 'light'},
  height:35,
  width:280,
  top:190,
});

view.add(loginButton);

loginButton.addEventListener('click', function() {
  if (usernameTextfield.value == '' || passwordTextfield.value == '') {
    alert('Please fill out the username and password fields.')
  }
  else {
    Ti.App.actIn.message = 'Logging in...';
    win.add(Ti.App.actInView);
    var user = {
      username: usernameTextfield.value,
      password: passwordTextfield.value
    };
    var userString = JSON.stringify(user);
    var url = REST_PATH + 'user/login.json';
    var xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", url);
    xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
    xhr.send(userString);
    xhr.onload = function() {
      var statusCode = xhr.status;
      win.remove(Ti.App.actInView);
      if(statusCode == 200) {
        var response = xhr.responseText;
        var data = JSON.parse(response);
        Titanium.App.Properties.setInt("userUid", data.user.uid);
        Titanium.App.Properties.setString("userSessionId", data.sessid);
        Titanium.App.Properties.setString("userSessionName", data.session_name);
        Ti.App.buildTabGroup();
        Ti.App.tabGroup.open();
        setTimeout(function() {
          win.hide();  
        }, 100);
        usernameTextfield.value = '';
        passwordTextfield.value = '';
      }
      else {
        alert("There was an error");
      }
    }
  
    xhr.onerror = function() {
      win.remove(Ti.App.actInView);
      Ti.API.info('onerror');
      var statusCode = xhr.status;
      Ti.API.info(statusCode);
      var response = JSON.parse(xhr.responseText);
      Ti.API.info(response);
      if (statusCode == 401) {
        var error = response[0];
        alert(error);
      }
      else if (statusCode == 406) {
        var error = response[0];
        var loggedIn = error.search(/Already logged in as.+/);
        if (loggedIn != -1) {
          var logoutUrl = REST_PATH + 'user/logout.json';
          var xhr3 = Titanium.Network.createHTTPClient();
          xhr3.open("POST", logoutUrl);
          xhr3.setRequestHeader('Content-Type','application/json; charset=utf-8');
          xhr3.send();
          xhr3.onload = function() {
            alert('Error. Please try again.');
          }
          xhr3.onerror = function() {
            alert('Error. Please try again.');
          }
        }
      }
    }
  }
});

var registerButton = Titanium.UI.createButton({
  title:'Register',
  backgroundImage: 'images/register.png',
  color: '#666666',
  font: {fontFamily:"Open Sans", fontWeight: 'light'},
  height:35,
  width:280,
  bottom:10
});

view.add(registerButton);

registerButton.addEventListener('click', function() {
  var registerWin = Titanium.UI.createWindow({
    title:'Register',
    backgroundImage: '../images/background_green.png',
    url: 'includes/register.js',
    navBarHidden: true,
  });
  registerWin.open();
  setTimeout(function() {
    win.hide();  
  }, 100);
});
