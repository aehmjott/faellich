HT.Hexagon.Static.DEBUG = false;
HT.Hexagon.Static.DRAWSTATS = false;

var game = {};
game.dirtyHexes = [];
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
var then = Date.now();
var fpsUpdated = then;
var lastFramerate = 0;
var framerate = 0;
var frames = 0;

var fpsSpan = document.getElementById("fps");
var dateSpan = document.getElementById("date");
game.date = new Date(1991, 0, 1, 0, 0);

// The main game loop
var main = function () {
        var now = Date.now();
        //fps = (delta * smoothing) + 
        var delta = now - then;
        if(delta > 1000){
            fpsSpan.innerHTML = "FPS: " + frames.toString();
            dateSpan.innerHTML = "Date: " + game.date.toLocaleString();
            game.date.setDate(game.date.getDate() + 6/24);
            then = now;
            frames = 0;
        }
	update();
        frames++;
        
	// Request to do this again ASAP
	requestAnimationFrame(main);
};
preload(function(){
    canvas();
    events();
    main();
});

