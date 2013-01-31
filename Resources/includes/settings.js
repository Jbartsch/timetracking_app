/**
 * This file is used to create a simple node
 */

// Include the config.js file
Ti.include("../config.js");

//Define the variable win to contain the current window
var win = Ti.UI.currentWindow;

if(Titanium.App.Properties.getInt("userUid")) {
	
	// Create a new view "view" to hold the form
	var view = Ti.UI.createView({
		top: 0,
	});

	// Add the view to the window
	win.add(view);
	
	var mailTextfield = Titanium.UI.createTextField({
    hintText:'E-Mail',
    height:35,
    top:10,
    width:280,
    font: {fontFamily:"Open Sans", fontWeight: 'light'},
    borderWidth:1,
    borderColor:'#bbb',
    borderRadius:3,
    autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    paddingLeft: 5,
    paddingRight: 5,
    color: 'black',
    backgroundColor: 'white',
  });
  
  view.add(mailTextfield);
	
	var currentPasswordTextfield = Titanium.UI.createTextField({
    hintText:'Current password',
    height:35,
    top:55,
    width:280,
    font: {fontFamily:"Open Sans", fontWeight: 'light'},
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
  
  view.add(currentPasswordTextfield);

  // Create the password textfield
  var passwordTextfield = Titanium.UI.createTextField({
    hintText:'New password',
    height:35,
    top:100,
    width:280,
    font: {fontFamily:"Open Sans", fontWeight: 'light'},
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
  
  view.add(passwordTextfield);
  
  var passwordRepeatTextfield = Titanium.UI.createTextField({
    hintText:'Repeat password',
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
    color: 'black',
    backgroundColor: 'white',
  });
  
  view.add(passwordRepeatTextfield);
  
  // Create the login button
  var updateButton = Titanium.UI.createButton({
    title:'Save changes',
    enabled:false,
    backgroundImage: 'none',
    backgroundGradient: {
      type: 'linear',
      startPoint: { x: '50%', y: '0%' },
      endPoint: { x: '50%', y: '100%' },
      colors: [ { color: '#3536363', offset: 0.0}, { color: '747674', offset: 1.0 } ],
    },
    font: {fontFamily:"Open Sans", fontWeight: 'light'},
    height:35,
    width:280,
    top: 200,
  });
  
  view.add(updateButton);
	
  function loadSettings() {
    Ti.App.showThrobber(win);
    var uid = Titanium.App.Properties.getString("userUid");
    var sessid = Titanium.App.Properties.getString("userSessionId");
    var session_name = Titanium.App.Properties.getString("userSessionName");
    var url = REST_PATH + 'user_mail/' + uid + '.json';
    var xhr = Titanium.Network.createHTTPClient();
    xhr.open("GET", url);
    xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
    xhr.setRequestHeader('Cookie', session_name+'='+sessid);
    xhr.send();
    xhr.onload = function() {
      Ti.App.fireEvent('stopThrobberInterval');
      win.remove(Ti.App.throbberView);
      if(xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);
        mailTextfield.value = data.mail;
        updateButton.enabled = true;
      }
      xhr.onerror = function() {
        Ti.App.fireEvent('stopThrobberInterval');
        win.remove(Ti.App.throbberView);
        Ti.API.info(xhr.status);
        Ti.API.info(xhr.responseText);
      }
    }
  }
  
  updateButton.addEventListener("click", function() {
    if (currentPasswordTextfield.value == '') {
      alert("Please type in your current password.");
    }
    else if (passwordTextfield.value != passwordRepeatTextfield.value) {
      alert("The passwords do not match.");
    }
    else if (passwordTextfield.value == currentPasswordTextfield.value) {
      alert("The current and the new password are the same.");
    }
    else {
      Ti.App.showThrobber(win);
      var updateUser = {
        data:{
          mail: mailTextfield.value,
          current_pass: currentPasswordTextfield.value,
          pass: passwordTextfield.value,
        }
      };
  
      var uid = Titanium.App.Properties.getString("userUid");
      var sessid = Titanium.App.Properties.getString("userSessionId");
      var session_name = Titanium.App.Properties.getString("userSessionName");
      var updateurl = REST_PATH + 'user/' + uid + '.json';
      var userXhr = Titanium.Network.createHTTPClient();
      userXhr.open('PUT', updateurl);
      userXhr.setRequestHeader('X-HTTP-Method-Override','PUT');
      userXhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
      userXhr.setRequestHeader('Cookie', session_name+'='+sessid);
      userXhr.send(JSON.stringify(updateUser));
      userXhr.onload = function() {
        if (userXhr.status == 200) {
          Ti.App.fireEvent('stopThrobberInterval');
          win.remove(Ti.App.throbberView);
          if (passwordTextfield.value != '') {
            var cookie = userXhr.getResponseHeader('Set-Cookie');
            var newSession = cookie.split(';', 1);
            newSession = newSession[0].split('=', 2);
            Titanium.App.Properties.setString("userSessionId", newSession[1]);
          }
          currentPasswordTextfield.value = '';
          passwordTextfield.value = '';
          passwordRepeatTextfield.value = '';
        }
      }
      userXhr.onerror = function() {
        Ti.App.fireEvent('stopThrobberInterval');
        win.remove(Ti.App.throbberView);
        Ti.API.info(userXhr.responseText);
        Ti.API.info('onerror');
        var statusCode = userXhr.status;
        Ti.API.info(statusCode);
        var response = JSON.parse(userXhr.responseText);
        if (statusCode == 406) {
          var error = response[0];
          var passInvalid = error.search(/Your current password is missing or incorrect; it's required to change the <em class=\"placeholder\">.*<\/em>.+/);
          var mailInvalid = error.search(/The e-mail address <em class=\"placeholder\">.*<\/em> is not valid.+/);
          var mailTaken = error.search(/The e-mail address <em class=\"placeholder\">.*<\/em> is already taken.+/);
          if (passInvalid != -1) {
            alert('Wrong password.');
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
  });

	// Add the save button
	var logoutButton = Titanium.UI.createButton({
		title:'Logout',
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

	// Add the button to the window
	view.add(logoutButton);
	
	logoutButton.addEventListener('click', function() {
    Ti.App.logoutWin.open();
    Ti.App.tabGroup.close();
  });
  
  win.addEventListener("focus", function() {
    loadSettings();
  });

}
else {
	alert("You need to login first");
}