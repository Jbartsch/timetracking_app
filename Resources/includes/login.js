// Include our config file
Ti.include('../config.js');

// Define the variable win to contain the current window
var win = Ti.UI.currentWindow;

var loginView = Titanium.UI.createView({
   width: "100%",
   height: "100%"
});

win.add(loginView);

var loginText = Titanium.UI.createTextArea({
  editable: '0',
  text:'Welcome message',
  value: 'Please provide your login credentials.',
  font:{fontSize:16, fontWeight: "light"},
  color: 'white',
  left:10,
  top:40,
  width:300,
  height:'auto',
  backgroundColor: 'transparent',
});

loginView.add(loginText);

// Create the username textfield
var usernameTextfield = Titanium.UI.createTextField({
  hintText:'Username',
  height:35,
  top:120,
  left:10,
  width:300,
  font:{fontSize:16},
  borderWidth:1,
  borderColor:'#bbb',
  borderRadius:3,
  autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
  paddingLeft: 5,
  paddingRight: 5,
  color: 'black',
  backgroundColor: 'white',
});

loginView.add(usernameTextfield);

// Create the password textfield
var passwordTextfield = Titanium.UI.createTextField({
  hintText:'Password',
  height:35,
  top:170,
  left:10,
  width:300,
  font:{fontSize:16},
  borderWidth:1,
  borderColor:'#bbb',
  borderRadius:3,
  autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
  passwordMask:true,
  paddingLeft: 5,
  paddingRight: 5,
  color: 'black',
  backgroundColor: 'white',
});

loginView.add(passwordTextfield);

var cancelButton = Titanium.UI.createButton({
  title:'Cancel',
  height:40,
  width:140,
  top:220,
  left:10
});

loginView.add(cancelButton);

cancelButton.addEventListener('click', function() {
  win.close();
  Ti.App.homeWin.show();
})

// Create the login button
var loginButton = Titanium.UI.createButton({
  title:'Login',
  height:40,
  width:140,
  top:220,
  left:160
});

loginView.add(loginButton);

var forgotLabel = Titanium.UI.createLabel({
  text:'Request new password',
  width:'auto',
  top:280,
  font:{fontSize:16, fontWeight: "bold", textDecoration:'underline'},
  color: 'white',
})

loginView.add(forgotLabel);

forgotLabel.addEventListener('click', function(){
  Ti.Platform.openURL(SITE_PATH + "user/password");
})

// Add the event listener for when the button is created
loginButton.addEventListener('click', function() {
  if (usernameTextfield.value == '' || passwordTextfield.value == '') {
    alert('Please fill out the username and password fields.')
  }
  else {
    
    Ti.App.showThrobber(win);
        
    // Create an object to hold the data entered in the form
    var user = {
      username: usernameTextfield.value,
      password: passwordTextfield.value
    };
  
    var userString = JSON.stringify(user);
  
    // Define the url which contains the full url
    // in this case, we'll connecting to http://example.com/api/rest/user/login
    var url = REST_PATH + 'user/login.json';
  
    // Create a connection
    var xhr = Titanium.Network.createHTTPClient();
  
    // Open the connection using POST
    xhr.open("POST", url);
  
    xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
  
    // Send the connection and the user object as argument
    xhr.send(userString);
  
    // When the connection loads we do:
    xhr.onload = function() {
      // Save the status of the connection in a variable
      // this will be used to see if we have a connection (200) or not
      var statusCode = xhr.status;
      Ti.App.fireEvent('stopThrobberInterval');
      win.remove(Ti.App.throbberView);
      if(statusCode == 200) {
        var response = xhr.responseText;
        var data = JSON.parse(response);
        Titanium.App.Properties.setInt("userUid", data.user.uid);
        Titanium.App.Properties.setString("userSessionId", data.sessid);
        Titanium.App.Properties.setString("userSessionName", data.session_name);
        Ti.App.buildTabGroup();
        Ti.App.tabGroup.open();
        win.close();
      }
      else {
        alert("There was an error");
      }
    }
  
    xhr.onerror = function() {
      Ti.App.fireEvent('stopThrobberInterval');
      win.remove(Ti.App.throbberView);
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
