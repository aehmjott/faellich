var canvasArea = document.getElementById("AreaCanvas");
var canvasFG = document.getElementById('FGCanvas');
var canvasSelection = document.getElementById('SelectionCanvas');
var wrapper = document.getElementById('wrapper');
var canvasTB = document.getElementById("ToolboxCanvas");
var canvasBuildings = document.getElementById("BuildingCanvas");

function drawArrow(ctx, fromP, toP){
    var color = "rgba(0, 0, 0, 0.5)";
    var fromx = fromP.X;
    var fromy = fromP.Y;
    var tox = toP.X;
    var toy = toP.Y;
    //variables to be used when creating the arrow
    ctx.save();
    ctx.shadowBlur = 0;
    var headlen = 2;

    var angle = Math.atan2(toy-fromy,tox-fromx);

    //starting path of the arrow from the start square to the end square and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
    
    /*ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(fromx, fromy, 15, 0, 2* Math.PI);
    ctx.fill();
    */
    ctx.restore();
}

update = function(modifier){
    if(true){
        if(game.target !== null){
            var ctxSel = canvasSelection.getContext("2d");
            if(!game.target.isDrawn){
                
            }
            // fighting
            if(!game.fightTargetsDrawn){
                if(game.target.Id !== "-"){
                    console.log("draw target");
                    ctxSel.save();
                    ctxSel.shadowColor = "green";
                    ctxSel.clearRect(0, 0, canvasSelection.width, canvasSelection.height);
                    selection = game.target.copy(0.75);
                    ctxSel.shadowBlur = 10;
                    selection.draw(ctxSel, "rgba(255, 255, 255, 0.5)", "green", true);
                    ctxSel.restore();
                    
                    console.log("moveTargets");
                    ctxSel.save();
                    ctxSel.fillStyle = "rgba(0,0,0,0.4)";
                    ctxSel.fillRect(0, 0, canvasSelection.width, canvasSelection.height);
                    game.target.copy(0.9).draw(ctxSel, "rgba(0, 0, 0, 0.5)", "white", true);
                    game.target.copy(0.75).draw(ctxSel, "rgba(0, 0, 0, 0)", "white", false);
                    var neighbours = grid.GetNeighbours(game.target);
                    for (var i = 0; i < neighbours.length; i++){
                        var n = neighbours[i];
                        if(n.Id === "-"){
                            continue;
                        }
                        if(n.gang === game.target.gang){
                            // move
                            var neighbours2 = grid.GetNeighbours(n);
                            for(var j = 0; j < neighbours2.length; j++){
                                var n2 = neighbours2[j];
                                if(n2 === game.target || n2.Id === "-" || n2.gang !== game.target.gang || game.moveTargets.indexOf(n2) !== -1){
                                    continue;
                                }
                                game.moveTargets.push(n2);
                                n2.clear(ctxSel);
                                n2.copy(0.6).draw(ctxSel, "rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.1)", true);
                            }
                            if(game.moveTargets.indexOf(n) === -1){
                                n.clear(ctxSel);
                                n.copy(0.6).draw(ctxSel, "rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.1)", true);
                                game.moveTargets.push(n);
                            }
                        }
                        else{
                            // fight
                            game.fightTargets.push(n);
                            //drawArrow(ctxSel, target.MidPoint, n.MidPoint);
                            n.clear(ctxSel);
                            n.copy(0.75).draw(ctxSel, game.gangColor(n.gang, 0.3), "red", true);
                        }
                    }
                    ctxSel.restore();
                    game.fightTargetsDrawn = true;
                }
            }
        }
        //document.body.style.cursor = "pointer";

        var ctx = canvasFG.getContext("2d");
        
        var fillColor = "rgba(255, 255, 255, 0)";
        var hexColor = "white";
        ctx.shadowColor = "white";
        
        var hex = grid.GetHexAt(game.mousePosition);
        
        if(game.fightTargets.indexOf(hex) >= 0){
            document.body.style.cursor = "crosshair";
            hexColor = "red";
            ctx.shadowColor = "red";
            fillColor = "rgba(178, 34, 34, 0.05)";
        }
        if(game.moveTargets.indexOf(hex) >= 0){
            document.body.style.cursor = "copy";
            hexColor = "green";
            ctx.shadowColor = "white";
            fillColor = "rgba(34, 178, 34, 0.3)";
        }
        
        if(hex !== null && hex !== game.selected){
            if(game.selected !== null){
                ctx.clearRect(0, 0, canvasFG.width, canvasFG.height);
            }
            selection = hex.copy(0.75);
            ctx.shadowBlur = 10;
            selection.draw(ctx, fillColor, hexColor, true);

            game.selected = hex;
        }
        for(var i = 0; i < game.dirtyHexes.length; i++){
            grid.redrawHexBorders(canvasArea.getContext("2d"), game.dirtyHexes[i]);
            //game.dirtyHexes[i].draw(canvasArea.getContext("2d"));
        }
        game.dirtyHexes = [];
    }
};