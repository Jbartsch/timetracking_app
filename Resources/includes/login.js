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

// Create the labelfor the username
var usernameLabel = Titanium.UI.createLabel({
  text:'Username',
  font:{fontSize:14, fontWeight: "bold"},
  color: 'white',
  left:10,
  top:110,
  width:300,
  height:'auto'
});

loginView.add(usernameLabel);

// Create the username textfield
var usernameTextfield = Titanium.UI.createTextField({
  height:35,
  top:130,
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

// Create the label for the password
var passwordLabel = Titanium.UI.createLabel({
  text:'Password',
  font:{fontSize:14, fontWeight: "bold"},
  left:10,
  top:175,
  width:300,
  height:'auto',
  color: 'white',
});

loginView.add(passwordLabel);

// Create the password textfield
var passwordTextfield = Titanium.UI.createTextField({
  height:35,
  top:200,
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
  top:270,
  left:10
});

loginView.add(cancelButton);

cancelButton.addEventListener('click', function() {
  win.close();
})

// Create the login button
var loginButton = Titanium.UI.createButton({
  title:'Login',
  height:40,
  width:140,
  top:270,
  left:160
});

loginView.add(loginButton);

// Add the event listener for when the button is created
loginButton.addEventListener('click', function() {

  // alert("Clicked button loginButton");

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

    // Check if we have a valid status
    if(statusCode == 200) {

      // Create a variable response to hold the response
      var response = xhr.responseText;

      // Parse (build data structure) the JSON response into an object (data)
      var data = JSON.parse(response);

      // Set a global variable
      Titanium.App.Properties.setInt("userUid", data.user.uid);
      Titanium.App.Properties.setString("userSessionId", data.sessid);
      Titanium.App.Properties.setString("userSessionName", data.session_name);

      // Create another connection to get the user
      var xhr2 = Titanium.Network.createHTTPClient();

      var getUser = REST_PATH + 'user/' + data.user.uid + '.json';
      xhr2.open("GET", getUser);
      xhr2.send();

      xhr2.onload = function() {
        var userStatusCode = xhr2.status;

        if(userStatusCode == 200) {
          var userResponse = xhr2.responseText;
          var user = JSON.parse(userResponse);

          // Set the user.userName to the logged in user name
          Titanium.App.Properties.setString("userName", user.name);
          Ti.App.tabGroup.open();
          win.close();
        }
      }
    }
    else {
      alert("There was an error");
    }
  }

  xhr.onerror = function() {
    Ti.API.info(xhr.status);
  }
});
