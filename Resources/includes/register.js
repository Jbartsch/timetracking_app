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
  Ti.App.homeWin.show();
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
  
  if (usernameTextfield.value == '' || emailTextfield.value == '' || passwordTextfield.value == '') {
    alert('Please fill out all fields.')
  }
  else {
    
    if (passwordTextfield.value == repeatPasswordTextfield.value) {
      
      var actInd = Titanium.UI.createActivityIndicator({
        bottom: 10,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
        font: {
            fontFamily: 'Helvetica Neue',
            fontSize: 15,
            fontWeight: 'bold'
        },
        color: 'white',
        message: 'Loading...',
        width: 210,
      });
      win.add(actInd);
      actInd.show();
      
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
            var user = {
              username: newUser.name,
              password: newUser.pass
            };
          
            var userString = JSON.stringify(user);
            var url = REST_PATH + 'user/login.json';
            var xhr3 = Titanium.Network.createHTTPClient();
            xhr3.open("POST", url);
            xhr3.setRequestHeader('Content-Type','application/json; charset=utf-8');
            xhr3.send(userString);
            xhr3.onload = function() {
              if(xhr3.status == 200) {
                var data = JSON.parse(xhr3.responseText);
                Titanium.App.Properties.setInt("userUid", data.user.uid);
                Titanium.App.Properties.setString("userSessionId", data.sessid);
                Titanium.App.Properties.setString("userSessionName", data.session_name);
                Ti.App.buildTabGroup();
                Ti.App.tabGroup.open();
                actInd.hide();
                win.close();
              }
            }
            xhr3.onerror = function() {
              actInd.hide();
              Ti.API.info('onerror');
              var statusCode = xhr3.status;
              Ti.API.info(statusCode);
              var response = JSON.parse(xhr3.responseText);
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
                  var xhr4 = Titanium.Network.createHTTPClient();
                  xhr4.open("POST", logoutUrl);
                  xhr4.setRequestHeader('Content-Type','application/json; charset=utf-8');
                  xhr4.send();
                  xhr4.onload = function() {
                    var loginWin = Titanium.UI.createWindow({
                      title:'Login',
                      backgroundImage: '../images/background_green.png',
                      barColor: '#009900',
                      url: 'includes/login.js',
                      navBarHidden: true,
                    });
                    loginWin.open();
                    actInd.hide();
                    win.close();
                  }
                }
              }
            }
          }
        }
        else {
          alert("There was an error");
        }
      }
    
      xhr.onerror = function() {
        actInd.hide();
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
            alert('The username contains an illegal character.');
          }
          else if (userTaken != -1) {
            alert('The username is already taken.');
          }
          else if (mailInvalid != -1) {
            alert('Invalid e-mail address.');
          }
          else if (mailTaken != -1) {
            alert('The e-mail address is already registered.');
          }
        }
      }
      
    }
    else {
      alert('The passwords do not match.')
    }
  }
});
