var mousePositionPage = new HT.Point(0,0);
var mouseClicked = false;

var down=false;
var scrollTop=0;
var scrollLeft=0;
var curX = 0;
var curY = 0;

var canvasArea = document.getElementById("AreaCanvas");
var canvasFG = document.getElementById('FGCanvas');
var canvasSelection = document.getElementById('SelectionCanvas');
var wrapper = document.getElementById('wrapper');
var canvasTB = document.getElementById("ToolboxCanvas");
var canvasBuildings = document.getElementById("BuildingCanvas");

var mouseInToolbox = function(event){
    var left = Number(canvasTB.style.left.substring(0, canvasTB.style.left.length-2));
    var top = Number(canvasTB.style.top.substring(0, canvasTB.style.top.length-2));
    if(event.pageX > left && event.pageY < (top + canvasTB.height)){
        return true;
    }
    return false;
}

var mouseInButton = function(event){
    var mpp = mousePositionPage;
    var left = Number(canvasTB.style.left.substring(0, canvasTB.style.left.length-2));
    var top = Number(canvasTB.style.top.substring(0, canvasTB.style.top.length-2));
    //console.log(mousePosition.X, mousePosition.Y);
    for(var i = 0; i < canvasTB.buttons.length; i++){
        var b = canvasTB.buttons[i];
        //console.log(b["text"], (b.x + left), (b.y + top), (b.x + b.w + left), (b.y + b.h + top));
        //console.log(mpp.X, mpp.Y);
        if((b.x + left) <= mpp.X && 
           (b.y + top) <= mpp.Y &&
            mpp.X <= (b.x + b.w + left) && 
            mpp.Y <= (b.y + b.h + top)){
            canvasTB.style.cursor = "pointer";
            //console.log("!!!")
            return b["text"];
        }
    }
    canvasTB.style.cursor = "default";
    return null;
}

var mouseMove = function(event){
    mousePositionPage.X = event.pageX;
    mousePositionPage.Y = event.pageY;
    var rect = canvasArea.getBoundingClientRect();
    
    game.mousePosition.X = event.clientX - rect.left;
    game.mousePosition.Y = event.clientY - rect.top;
    
    if (mouseClicked) {
        var newScrollX = scrollLeft + (curX - event.pageX) * 1.5;
        var newScrollY = scrollTop + (curY - event.pageY) * 1.5;
        //console.log(newScrollX, newScrollY);
        if(newScrollX < 0 || newScrollX > canvasArea.width - wrapper.clientWidth){
            scrollLeft = wrapper.scrollLeft;
            curX = event.pageX;
            newScrollX = scrollLeft + curX - event.pageX;
        }
        if(newScrollY < 0 || newScrollY > canvasArea.height - wrapper.clientHeight){
            scrollTop = wrapper.scrollTop;
            curY = event.pageY;
            newScrollY = scrollTop + curY - event.pageY;
        }
        
       scrollWrapper(newScrollX,
                     newScrollY);
    }
    mouseInButton(event);
};

var mouseDown = function(event){
    if(mouseInToolbox(event)){
        return;
    }
    if(event.which !== 2 && !event.altKey){
        return;
    }
    document.body.style.cursor = "move";
    mouseClicked = true;

    scrollLeft = wrapper.scrollLeft;
    scrollTop = wrapper.scrollTop;
    
    curX = event.pageX;
    curY = event.pageY;
};

var mouseUp = function(event){
    mouseClicked = false;
    document.body.style.cursor = "default"
};

var handleMouseclick = function(event, right){
    if(event.altKey){
        return;
    }
    var mib = mouseInButton(event);
    if(mib !== null){
        if(mib === "SAVE"){
            //console.log(JSON.stringify(grid.getHexMap()));
            localStorage.setItem("hexMap", JSON.stringify(grid.getHexMap()));
            console.log(localStorage.getItem("hexMap"));
            return;
        }
        else if(mib === "SELECT"){
            canvasSelection.getContext("2d").clearRect(0, 0, canvasSelection.width, canvasSelection.height);
            game.target = null;
            game.fightTargets = [];
            game.moveTargets = [];
        }
        else if(game.buildings[mib] !== undefined && game.target !== null){
            game.target.building = mib;
            grid.redrawBuildings(canvasBuildings.getContext("2d"));
        }
        else if(mib === "ABREISSEN"){
            game.target.building = "-";
            grid.redrawBuildings(canvasBuildings.getContext("2d"));
        }
        game.mode = mib;
    }
    else if(game.target !== null && game.selected !== null && game.selected === game.target){
        // reset target
        console.log("reset target");
        canvasSelection.getContext("2d").clearRect(0, 0, canvasSelection.width, canvasSelection.height);
        game.target = null;
        game.fightTargets = [];
        game.moveTargets = [];
    }
    else if(right && game.target !== null && game.selected !== null && !mouseInToolbox(event)){
        if(game.fightTargets.indexOf(game.selected) !== -1){
            game.selected.attack = Math.max(0, game.selected.attack - game.target.attack);
            if(game.selected.attack > 0){
                // fight lost
                canvasFG.getContext("2d").clearRect(0, 0, canvasSelection.width, canvasSelection.height);
                game.selected = null;
                return;
            }
            // fight won
            console.log(game.target.gang);
            game.selected.gang = game.target.gang;
            
            game.dirtyHexes.push(game.selected);
            /*
            game.selected.redraw(canvasArea.getContext("2d"));
            grid.redrawHexBorders(canvasArea.getContext("2d"), game.selected);
            */
            //canvasSelection.getContext("2d").clearRect(0, 0, canvasSelection.width, canvasSelection.height);
            var ft = [];
            for(var i = 0; i < game.fightTargets.length; i++){
                if(game.fightTargets[i] !== game.selected){
                    ft.push(game.fightTargets[i]);
                }
            }
            game.fightTargets = ft;
        }
        else if(game.moveTargets.indexOf(game.selected) !== -1 && game.target.attack > 0){
            game.selected.attack += 1;
            game.target.attack -= 1;
            
        }
        game.moveTargets = [];
        game.fightTargetsDrawn = false;
        canvasFG.getContext("2d").clearRect(0, 0, canvasSelection.width, canvasSelection.height);
        game.selected = null;
    }
    else if(game.selected !== null && game.selected.Id !== "-" && game.selected.gang > 0){
        // set target
        game.fightTargets = [];
        game.moveTargets = [];
        game.target = game.selected;
        console.log(game.selected.PathCoOrdX, game.selected.PathCoOrdY);
        game.target.isDrawn = false;
        game.fightTargetsDrawn = false;
    }
}

var contextMenu = function(event) {
    event.preventDefault();
    handleMouseclick(event, true)
};

var mouseClick = function(event){
    handleMouseclick(event, false);
};

var keyDown = function(event){
    if(game.selected !== null){
        if(game.keyCodes.indexOf(event.key) >= 0){
            game.selected.Id = event.key;
            game.dirtyHexes.push(game.selected);
        }
        else if(game.selected.Id !== "-" && game.gangs[Number(event.key)]){
            game.selected.gang = Number(event.key);
            game.dirtyHexes.push(game.selected);
        }
    }
 };

scrollWrapper = function(x, y){
    x = Math.max(0, x);
    x = Math.floor(Math.min(canvasArea.clientWidth, x));
    
    y = Math.max(0, y);
    y = Math.floor(Math.min(canvasArea.clientHeight, y));

    wrapper.scrollLeft = x;
    wrapper.scrollTop = y;
}

events = function(){
    game.mousePosition = new HT.Point(0,0);
    // temporary selection
    game.selected = null;
    game.target = null;

    game.fightTargetsDrawn = false;
    game.fightTargets = [];
    game.moveTargets = [];
    
    addEventListener("mousemove", mouseMove);
    addEventListener("mousedown", mouseDown, false);
    addEventListener("mouseup", mouseUp, false);
    document.addEventListener('contextmenu', contextMenu, false);
    addEventListener("click", mouseClick, false);
    addEventListener("keydown", keyDown);
}