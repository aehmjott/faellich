https://github.com/mpalmerlee/HexagonTools

/**
 * A Grid is the model of the playfield containing hexes
 * @constructor
 */
HT.Grid = function(hexMap){
    this.HexMap = hexMap;
    this.Hexes = [];
    this.HexagonsByXOrYCoOrd = [];
    
    for(var r = 0; r < hexMap.length; r++){
        var col = hexMap[r];
        this.HexMap[r] = col;
        for(var c = 0; c < col.length; c++){
            var offset_x = 0.0;
            var offset_y = 0.0;
            if (c % 2 === 1)
            {
                //offset_x = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE)/2 + HT.Hexagon.Static.SIDE;
                offset_y = HT.Hexagon.Static.HEIGHT / 2;
            }
            
            var x = c * (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE / 2) - offset_x;
            var y = r * (HT.Hexagon.Static.HEIGHT) + offset_y;
            
            var h = new HT.Hexagon(col[c][0], x, y);
            h.gang = Number(col[c][1]);
            h.building = col[c][2];
            h.PathCoOrdX = c;
            h.PathCoOrdY = r + Math.ceil(c / 2);
            if(this.HexagonsByXOrYCoOrd[c] === undefined){
                this.HexagonsByXOrYCoOrd[c] = [];
            }
            this.HexagonsByXOrYCoOrd[c][r] = h;
            this.Hexes.push(h);
            this.HexMap[r][c] = h;
        }
    }
    
}

HT.Grid.Static = {Letters:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'};

HT.Grid.prototype.GetHexId = function(row, col) {
	var letterIndex = row;
	var letters = "";
	while(letterIndex > 25)
	{
		letters = HT.Grid.Static.Letters[letterIndex%26] + letters;
		letterIndex -= 26;
	}
		
	return HT.Grid.Static.Letters[letterIndex] + letters + (col + 1);
};

/**
 * Returns a hex at a given point
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexAt = function(/*Point*/ p) {
	//find the hex that contains this point
	for (var h in this.Hexes)
	{
		if (this.Hexes[h].Contains(p))
		{
			return this.Hexes[h];
		}
	}

	return null;
};

/**
 * Returns a hex at a given row and column
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
//HT.Grid.prototype.GetHexAtRowCol = function(row, col) {
//	if(row < 0 || row >  col < 0 || )
//	return null;
//};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {number}
 */
HT.Grid.prototype.GetHexDistance = function(/*Hexagon*/ h1, /*Hexagon*/ h2) {
	//a good explanation of this calc can be found here:
	//http://playtechs.blogspot.com/2007/04/hex-grids.html
	var deltaX = h1.PathCoOrdX - h2.PathCoOrdX;
	var deltaY = h1.PathCoOrdY - h2.PathCoOrdY;
	return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexById = function(id) {
	for(var i in this.Hexes)
	{
		if(this.Hexes[i].Id == id)
		{
			return this.Hexes[i];
		}
	}
	return null;
};

/**
* Returns the nearest hex to a given point
* Provided by: Ian (Disqus user: boingy)
* @this {HT.Grid}
* @param {HT.Point} p the test point 
* @return {HT.Hexagon}
*/
HT.Grid.prototype.GetNearestHex = function(/*Point*/ p) {

	var distance;
	var minDistance = Number.MAX_VALUE;
	var hx = null;

	// iterate through each hex in the grid
	for (var h in this.Hexes) {
		distance = this.Hexes[h].distanceFromMidPoint(p);

		if (distance < minDistance) // if this is the nearest thus far
		{
			minDistance = distance;
			hx = this.Hexes[h];
		}
	}

	return hx;
};

HT.Grid.prototype.GetHexAtXY = function(x, y){
    if(this.HexagonsByXOrYCoOrd[x] !== undefined){
        return this.HexagonsByXOrYCoOrd[x][y - Math.ceil(x / 2)] || null;
    }
    return null;
}

var neighbourMap = {
    "n":  {"x": 0,  "y": -1},
    "ne": {"x": 1,  "y": 0},
    "se": {"x": 1,  "y": 1},
    "s":  {"x": 0,  "y": 1},
    "sw": {"x": -1, "y": 0},
    "nw": {"x": -1, "y": -1}
}
var neighbourKeys = Object.keys(neighbourMap);


HT.Grid.prototype.getNeighbour = function(hex, direction){
    var n = neighbourMap[direction];
    return this.GetHexAtXY(hex.PathCoOrdX + n["x"], hex.PathCoOrdY + n["y"]);
}


HT.Grid.prototype.GetNeighbours = function(/* Hexagon */ hex, order){
    order = order || neighbourKeys;
    
    var x = hex.PathCoOrdX;
    var y = hex.PathCoOrdY;
    var neighbours = [];
    for(var i = 0; i < order.length; i++){
       var nHex = this.getNeighbour(hex, order[i]);
       if(nHex !== null){
           neighbours.push(nHex);
       }
    }
    for (var i = 0; i < game.quicktravel.length; i++){
        var f = game.quicktravel[i];
        var start = f[0];
        var dest = f[1];

        var harbour = null; 
        if(hex.PathCoOrdX === start[0] && hex.PathCoOrdY === start[1]){
            harbour = grid.GetHexAtXY(dest[0], dest[1]);
        }
        if(hex.PathCoOrdX === dest[0] && hex.PathCoOrdY === dest[1]){
            harbour = grid.GetHexAtXY(start[0], start[1]);
        }
        if(harbour !== null && neighbours.indexOf(harbour) === -1){
            neighbours.push(harbour);
        }
    }
    return neighbours;
}

HT.Grid.prototype.redrawBuildings = function(ctx){
    var self = this;
    ctx.clearRect(0, 0, game.canvasWidth, game.canvasHeight);
    drawn = [];
    
    var drawBuilding = function(hex){
        if(hex.Id === "-" || drawn.indexOf(hex) !== -1){
            return;
        }
        hex.drawBuilding(ctx);
        //drawn.push(hex);
        //var neighbours = self.GetNeighbours(hex, ["nw", "n", "ne", "sw", "s", "se"]);
        /*for(var i = 0; i < neighbours.length; i++){
            drawBuilding(neighbours[i]);
            if(i === 2){
                
                //hex.drawBuilding(ctx);
            }
        }
        for(var i = 0; i < drawn.length; i++){
            drawn[i].drawBuilding(ctx);
        }
        */
    }
    
    for(var h = 0; h < this.Hexes.length; h++){
        if(this.Hexes[h].Id === "-"){
            continue;
        }
        drawBuilding(this.Hexes[h]);
        ctx.fillStyle = "black"
        ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        //ctx.fillText(h.toString(), this.Hexes[h].MidPoint.X, this.Hexes[h].MidPoint.Y);
    }
}

HT.Grid.prototype.draw = function(ctx){
    console.log("draw");
    for(var h in this.Hexes){
        var hex = this.Hexes[h];
        hex.draw(ctx);
    }
}

HT.Grid.prototype.drawBorders = function(ctx){
    for(var h = 0; h < this.Hexes.length; h++){
        this.drawHexBorders(ctx, this.Hexes[h]);
    }
}

HT.Grid.prototype.redrawHexBorders = function(ctx, hex){
    hex.clear(ctx);
    var neighbours = this.GetNeighbours(hex);
    for(var i = 0; i < neighbours.length; i++){
        neighbours[i].clear(ctx);
        this.drawHexBorders(ctx, neighbours[i]);
    }
    this.drawHexBorders(ctx, hex);
    //hex.draw(ctx);
}

HT.Grid.prototype.drawHexBorders = function(ctx, hex){
    ctx.save();
    if(hex.Id === "-" || hex.gang === 0){
       return;
    }
    // Nur innerhalb dieses Hexagons zeichnen!
    ctx.beginPath();
    ctx.moveTo(hex.Points[0].X, hex.Points[0].Y);
    for(var i = 1; i < hex.Points.length; i++)
    {
            var p = hex.Points[i];
            ctx.lineTo(p.X, p.Y);
    }
    ctx.closePath();
    //ctx.fillRect(hex.TopLeftPoint.X, hex.TopLeftPoint.Y, HT.Hexagon.Static.WIDTH, HT.Hexagon.Static.HEIGHT);
    ctx.clip();

    var neighbours = this.GetNeighbours(hex);

    for(var i = 0; i < hex.Points.length; i++)
    {   
        var n = neighbours[i];
        if(n.Id === hex.Id && n.gang === hex.gang){
            continue;
        }
        ctx.beginPath();
        ctx.moveTo(hex.Points[i].X, hex.Points[i].Y);
        ctx.shadowBlur = 25;
        ctx.shadowColor = game.gangColor(hex.gang, 1);
        ctx.lineCap="round";
        ctx.lineWidth = 8;
        ctx.strokeStyle = game.gangColor(hex.gang, 0.3);
        ctx.lineTo(hex.Points[(i+1) % 6].X, hex.Points[(i+1) % 6].Y);
        ctx.stroke();
    }
    hex.draw(ctx);
    ctx.restore();
}

HT.Grid.prototype.getHexMap = function(){
    var result = [];
    for(var r = 0; r < this.HexMap.length; r++){
        result[r] = [];
        for(var c = 0; c < this.HexMap[r].length; c++){
            var h = this.HexMap[r][c];
            result[r].push([h.Id || "-", h.gang || 0, h.building || "-"]);
        }
    }
    //console.log(result);
    return result;
}