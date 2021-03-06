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

var registerText = Titanium.UI.createLabel({
  text: 'Register for new account',
  font:{fontSize:16, fontFamily:"Open Sans", fontWeight: "light"},
  color: 'white',
  top:40,
  height:'auto',
  backgroundColor: 'transparent',
});
 
registerView.add(registerText);

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

registerView.add(usernameTextfield);

// Create the textfield for the email
var emailTextfield = Titanium.UI.createTextField({
  hintText:'E-Mail',
  height:35,
  top:145,
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

registerView.add(emailTextfield);

// Create the password textfield
var passwordTextfield = Titanium.UI.createTextField({
  hintText:'Password',
  height:35,
  top:190,
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

registerView.add(passwordTextfield);

// Create the password textfield
var repeatPasswordTextfield = Titanium.UI.createTextField({
  hintText:'Repeat password',
  height:35,
  top:235,
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

registerView.add(repeatPasswordTextfield);

// Create the login button
var registerButton = Titanium.UI.createButton({
  title:'Register',
  backgroundImage: '../images/register.png',
  color: '#666666',
  font: {fontFamily:"Open Sans", fontWeight: 'light'},
  height:35,
  width:280,
  top:280
});

registerView.add(registerButton);

// Create the login button
var cancelButton = Titanium.UI.createButton({
  title:'Cancel',
  backgroundImage: 'none',
  backgroundGradient: {
    type: 'linear',
    startPoint: { x: '50%', y: '0%' },
    endPoint: { x: '50%', y: '100%' },
    colors: [ { color: '#c00', offset: 0.0}, { color: '#f00', offset: 1.0 } ],
  },
  font: {fontFamily:"Open Sans", fontWeight: 'light'},
  height:35,
  width:280,
  bottom:10
});

registerView.add(cancelButton);

cancelButton.addEventListener('click', function() {
  win.close();
  Ti.App.homeWin.show();
})

// Add the event listener for when the button is created
registerButton.addEventListener('click', function() {
  
  if (usernameTextfield.value == '' || emailTextfield.value == '' || passwordTextfield.value == '') {
    Ti.App.message('error', 'Please fill out all fields.', win);
  }
  else {
    
    if (passwordTextfield.value == repeatPasswordTextfield.value) {
      
      Ti.App.actIn.message = 'Registering...';
      win.add(Ti.App.actInView);
      
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
        win.remove(Ti.App.actInView);
        
        if(statusCode == 200) {
          var data = JSON.parse(xhr.responseText);
          var cookie = xhr.getResponseHeader('Set-Cookie');
          var newSession = cookie.split(';', 1);
          newSession = newSession[0].split('=', 2);
          Titanium.App.Properties.setInt("userUid", data.uid);
          Titanium.App.Properties.setString("userSessionName", newSession[0]);
          Titanium.App.Properties.setString("userSessionId", newSession[1]);
          Ti.App.buildTabGroup();
          Ti.App.tabGroup.open();
          setTimeout(function() {
            win.close();  
          }, 100);
        }
        else {
          Ti.App.message('error', 'There was an error.', win);
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
          // If username is invalid
          var userInvalid = error.search(/The username contains an illegal character.+/);
          // If username is taken
          var userTaken = error.search(/The name <em class=\"placeholder\">.*<\/em> is already taken.+/);
          // If E-Mail is invalid
          var mailInvalid = error.search(/The e-mail address <em class=\"placeholder\">.*<\/em> is not valid.+/);
          // If E-Mail is taken
          var mailTaken = error.search(/The e-mail address <em class=\"placeholder\">.*<\/em> is already registered.+/);
          if (userInvalid != -1) {
            Ti.App.message('error', 'The username contains an illegal character.', win);
          }
          else if (userTaken != -1) {
            Ti.App.message('error', 'The username is already taken.', win);
          }
          else if (mailInvalid != -1) {
            Ti.App.message('error', 'Invalid e-mail address.', win);
          }
          else if (mailTaken != -1) {
            Ti.App.message('error', 'The e-mail address is already registered.', win);
          }
        }
      }
      
    }
    else {
      alert('The passwords do not match.')
    }
  }
});
