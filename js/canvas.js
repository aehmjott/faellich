var canvas = function(){
    game.mode = "SELECT";

    // width/height = 2/√3
    var height = 60;
    var width = height / (Math.sqrt(3) / 2);
    //var width = 40;
    //var height = width / (Math.sqrt(3) / 2);

    var y = height/2.0;

    //solve quadratic
    var a = -3.0;
    var b = (-2.0 * width);
    var c = (Math.pow(width, 2)) + (Math.pow(height, 2));

    var z = (-b - Math.sqrt(Math.pow(b,2)-(4.0*a*c)))/(2.0*a);

    var x = (width - z)/2.0;

    HT.Hexagon.Static.WIDTH = width;
    HT.Hexagon.Static.HEIGHT = height;
    HT.Hexagon.Static.SIDE = z;
    HT.Hexagon.Static.ORIENTATION = HT.Hexagon.Orientation.Normal;

    game.keyCodes = [
        "-", // Leer
        "a", // Schilksee
        "b", // Friedrichsort
        "c", // Holtenau
        "d", // Wik
        "e", // Ravensberg
        "f", // Schreventeich
        "g", // Mitte
        "h", // Gaarden
        "i", // Wellingdorf
        "j", // Dietrichsdorf
        "k", // Mönkeberg
        "l", // Schrevenborn
        "m", // Heikendorf
        "n", // Brodersdorf
        "o", // Laboe
        "p" // Schönkirchen
    ];


    game.gangs = {
        0: [], // Leer 
        1: [255, 0, 0],   // Kneipenterroristen
        2: [0, 0, 255],   // Blue Brothers
        3: [0, 145, 0],   // Mad Dogs
        4: [255, 215, 0], // Tigers
        5: [0, 206, 209]  // Destroyers
    };

    game.buildings = {
        "-": "",
        "CLUBHAUS": game.images[0],
        "STAMMKNEIPE": game.images[1],
        "KNEIPE": game.images[2],
        "KAMPFER": game.images[3]
    }

    var alphaValue = 0.2;
    game.gangColor = function(g, alpha){
        alpha = alpha || alphaValue;
        if(g === 0){
            return "rgba(0,0,0,0)";
        }
        if(game.gangs[g] !== undefined){
            var rgba = game.gangs[g];
            var r = (rgba[0] || 0).toString();
            var g = (rgba[1] || 0).toString();
            var b = (rgba[2] || 0).toString();
            var a = (rgba[3] || 0).toString();
            return "rgba(" + r + "," + g +"," + b + "," + alpha +")";
        }
        return "grey";
    }

    var hexMap = [
        ["-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","-0","-0","-0","-0","a2","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","-0","-0","-0","a2","a2","a2","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","-0","-0","a2","a2","a2","a2","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","-0","-0","a2","a2","a2","a2","a2","-0","-0","-0","-0","-0","-0","-0","o2","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","b1","-0","a2","a2","a2","a2","a2","a2","-0","-0","-0","-0","o2","o2","o2","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","b1","b1","b1","a2","a2","a2","b1","a2","-0","-0","-0","o2","o2","o2","o2","o2","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","b1","b1","b1","b1","b1","b1","b1","b1","-0","-0","-0","o2","o2","o2","o2","o2","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","-0","b1","b1","b1","b1","b1","b1","b1","-0","-0","o2","o2","o2","o2","o2","o2","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","-0","c3","c3","b1","b1","b1","b1","b1","b1","-0","-0","o2","o2","o2","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","-0","c3","c3","b1","-0","-0","-0","-0","-0","-0","m1","-0","-0","o2","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","c3","c3","c3","c3","c3","-0","-0","-0","m1","m1","m1","m1","n1","n1","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","c3","c3","c3","c3","-0","-0","-0","-0","m1","l5","m1","m1","-0","n1","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","c3","-0","c3","c3","c3","-0","-0","-0","-0","m1","m1","m1","m1","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","d1","d1","d1","-0","d1","-0","-0","-0","-0","-0","-0","-0","m1","m1","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","d1","d1","d1","d1","d1","d1","-0","-0","-0","-0","k5","-0","-0","m1","l5","l5","l5","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","d1","d1","d1","d1","d1","d1","-0","-0","-0","-0","k5","k5","k5","-0","-0","l5","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","d1","d1","d1","d1","d1","d1","e1","-0","-0","-0","-0","k5","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","e1","e1","e1","d1","e1","e1","e1","-0","-0","-0","j1","j1","j1","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","e1","e1","e1","e1","e1","e1","e1","e1","-0","-0","j1","j1","j1","j1","j1","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","f4","e1","e1","e1","e1","e1","e1","e1","-0","j1","j1","j1","j1","j1","j1","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","f4","f4","f4","f4","g4","e1","e1","-0","-0","-0","i3","j1","j1","j1","j1","j1","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","f4","f4","f4","g4","g4","g4","-0","-0","i3","i3","i3","i3","i3","j1","j1","j1","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","g4","g4","g4","g4","g4","g4","h1","h1","i3","i3","i3","i3","i3","i3","-0","j1","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","g4","g4","g4","g4","g4","h1","h1","h1","i3","i3","i3","i3","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","g4","g4","g4","g4","h1","h1","h1","h1","i3","i3","i3","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","-0","h1","h1","h1","h1","i3","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","-0","-0","-0","h1","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"],
        ["-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0","-0"]
    ];

    game.quicktravel = [
        [[10,  8], [16, 15]], // Schilksee - Laboe
        [[11, 15], [16, 15]], // Friedrichsort - Laboe
        [[11, 15], [13, 19]], // Friedrichsort - Heikendorf
        [[13, 19], [11, 22]], // Heikendorf - Mönkeberg
        [[11, 22], [ 7, 24]], // Mönkeberg - Ravensberg
        [[ 7, 24], [ 6, 26]], // Ravensberg - Mitte
        [[ 7, 24], [14, 29]], // Ravensberg - Drietrichsdorf
        [[ 6, 16], [ 5, 17]], // Holtenau - Wik
        // Straßen
        [[19, 18], [19, 21]], // Laboe - Brodersdorf
        [[18, 18], [16, 19]], // Laboe - Heikendorf
        [[19, 21], [16, 20]], // Brodersdorf - Heikendorf
        [[19, 21], [17, 24]], // Brodersdorf - Schrevenborn
        [[14, 23], [17, 24]], // Mönkeberg - Schrevenborn
        [[17, 24], [16, 26]]  // Schrevenborn - Schönkirchen
    ]


    var storedHexMap = localStorage.getItem("hexMap");
    if(storedHexMap !== null && storedHexMap !== undefined){
        hexMap = JSON.parse(storedHexMap);
    }

    var rows = hexMap.length;;
    var cols = hexMap[0].length;

    var canvasWidth = 1380;
    var canvasHeight = 1770;

    game.canvasWidth = canvasWidth;
    game.canvasHeight = canvasHeight;

    var canvasFG = document.getElementById("FGCanvas");
    canvasFG.width = canvasWidth;
    canvasFG.height = canvasHeight;

    var canvasArea = document.getElementById("AreaCanvas");
    canvasArea.width = canvasWidth;
    canvasArea.height = canvasHeight;

    var canvasSelection = document.getElementById("SelectionCanvas");
    canvasSelection.width = canvasWidth;
    canvasSelection.height = canvasHeight;
    //canvasSelection.getContext("2d").clearRect(0,0, canvasWidth, canvasHeight);

    var canvasBuildings = document.getElementById("BuildingCanvas");
    canvasBuildings.width = canvasWidth;
    canvasBuildings.height = canvasHeight;

    // Grid
    grid = new HT.Grid(hexMap);

    grid.drawBorders(canvasArea.getContext("2d"));
    grid.redrawBuildings(canvasBuildings.getContext("2d"));

    // Toolbox
    var canvasTB = document.getElementById("ToolboxCanvas");
    canvasTB.style.left =  (wrapper.clientWidth - canvasTB.width).toString() + "px";
    canvasTB.style.top =  "16px";
    var ctxTB = canvasTB.getContext("2d");
    ctxTB.fillStyle = "white";
    ctxTB.fillRect(0,0, canvasTB.width, canvasTB.height);
    var offset = 10;
    ctxTB.fillStyle = "black";
    ctxTB.font = "30px Agency FB";
    ctxTB.fillText("Laboe is' fällich...", offset, 35);

    // buttons
    var buttons = [
        ["SELECT", "SAVE"],
        [],
        ["CLUBHAUS"],
        ["STAMMKNEIPE"],
        ["KNEIPE"],
        ["KAMPFER"],
        [""],
        ["ABREISSEN"]
    ];
    var buttonHeight = 30;
    var space = 5;
    ctxTB.strokeStyle = "black";
    canvasTB.buttons = [];
    for(var i = 0; i < buttons.length; i++){
        var buttonRow = buttons[i];
        var buttonWidth = Math.floor((canvasTB.width - (2 * offset) - ((buttonRow.length - 1) * space)) / buttonRow.length);
        for(var j = 0; j < buttonRow.length; j++){
            var x = offset + j * (space + buttonWidth);
            var y = 50 + (i * (buttonHeight + space));
            ctxTB.strokeRect(x, y, buttonWidth, buttonHeight);
            ctxTB.font = "20px Agency FB";
            ctxTB.textAlign = "center";
            ctxTB.fillText(buttonRow[j], x + (buttonWidth / 2), y + (buttonHeight / 2) + 7.5);
            canvasTB.buttons.push({
                "text": buttonRow[j],
                "x": x,
                "y": y,
                "w": buttonWidth,
                "h": buttonHeight
            });
        }
    }

    game.drawValues = function(ctx, values){
        ctx.save()
        ctx.textAlign = "left";
        var yOffset = (buttonHeight + space) * (buttons.length + 1) + space;
        var uberschriften = ["Geld","Bier","Korn","Waffen"];
        for(var i = 0; i < values.length; i++){
            ctx.fillText(uberschriften[i]+":", offset, yOffset + i * (buttonHeight + space) + buttonHeight);
            ctx.fillText(values[i].toString(), offset + 100, yOffset + i * (buttonHeight + space) + buttonHeight);
        }
        ctx.restore();
    }
    game.drawValues(ctxTB, [10000, 5000, 900, 50]);
}