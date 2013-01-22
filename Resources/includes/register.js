// Include our config file
Ti.include('../config.js');

// Define the variable win to contain the current window
var win = Ti.UI.currentWindow;

var registerView = Titanium.UI.createScrollView({
  contentWidth:'auto',
  contentHeight:'auto',
  showVerticalScrollIndicator:true,
  showHorizontalScrollIndicator:true,
});

win.add(registerView);

var registerText = Titanium.UI.createTextArea({
  editable: '0',
  text:'Welcome message',
  value: 'Please provide your data.',
  font:{fontSize:16, fontWeight: "light"},
  color: 'white',
  left:10,
  top:30,
  width:300,
  height:'auto',
  backgroundColor: 'transparent',
});
 
registerView.add(registerText);

// Create the username textfield
var usernameTextfield = Titanium.UI.createTextField({
  hintText:'Username',
  height:35,
  top:100,
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

registerView.add(usernameTextfield);

// Create the textfield for the email
var emailTextfield = Titanium.UI.createTextField({
  hintText:'E-Mail',
  height:35,
  top:150,
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

registerView.add(emailTextfield);

// Create the password textfield
var passwordTextfield = Titanium.UI.createTextField({
  hintText:'Password',
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

registerView.add(passwordTextfield);

// Create the password textfield
var repeatPasswordTextfield = Titanium.UI.createTextField({
  hintText:'Repeat password',
  height:35,
  top:250,
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

registerView.add(repeatPasswordTextfield);

// Create the login button
var cancelButton = Titanium.UI.createButton({
  title:'Cancel',
  height:40,
  width:140,
  top:300,
  left:10
});

registerView.add(cancelButton);

cancelButton.addEventListener('click', function() {
  win.close();
})

// Create the login button
var registerButton = Titanium.UI.createButton({
  title:'Register',
  height:40,
  width:140,
  top:300,
  left:160
});

registerView.add(registerButton);

// Add the event listener for when the button is created
registerButton.addEventListener('click', function() {
  
  if (passwordTextfield.value == repeatPasswordTextfield.value) {

    var newUser = {
      name: usernameTextfield.value,
      pass: passwordTextfield.value,
      mail: emailTextfield.value,
    };
  
    var userString = JSON.stringify(newUser);
  
    var url = REST_PATH + 'user/register.json';
    var xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", url);
    xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
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
  
        // Ti.API.info(response);
        var logoutUrl = REST_PATH + 'user/logout.json';
        var xhr2 = Titanium.Network.createHTTPClient();
        xhr2.open("POST", logoutUrl);
        xhr2.setRequestHeader('Content-Type','application/json; charset=utf-8');
        xhr2.send();
  
        xhr2.onload = function() {
          var logoutStatusCode = xhr2.status;
          alert('User successfully created. You can now log in.')
          win.close();
        }
      }
      else {
        alert("There was an error");
      }
    }
  
    xhr.onerror = function() {
      Ti.API.info(xhr.status);
    }
    
  }
  else {
    alert('The passwords do not match.')
  }
});