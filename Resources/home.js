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

var tutorialFlow = Titanium.UI.createImageView({
    image:'images/tut1.png',
    width: "100%",
  	height: "100%"
    
});
view.add(tutorialFlow);

function imageLoop(i){
	if(i<=3) {
		Ti.API.info(i);
		setTimeout(function(){
        		tutorialFlow.image = 'images/tut'+i+'.png'; 
        		i=i+1;
        		imageLoop(i);
        		var slide_in =  Titanium.UI.createAnimation({left:115});
        	//	tutorialFlow.animate(slide_in);
      	}, 4000);
      //	tutorialFlow.left = -100;
	}
	if(i==4) {
	      	i=1;
	      	imageLoop(i);
	}
}

i=2;

	imageLoop(i);



var loginButton = Titanium.UI.createButton({
  title:'Login',
  height:40,
  width:120,
  left: 30,
  bottom:20,
  style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
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
  width:120,
  right:30,
  bottom:20
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