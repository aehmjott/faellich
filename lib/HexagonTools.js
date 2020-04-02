// https://github.com/mpalmerlee/HexagonTools

var HT = HT || {};
/**
 * A Point is simply x and y coordinates
 * @constructor
 */
HT.Point = function(x, y) {
	this.X = x;
	this.Y = y;
};

/**
 * A Rectangle is x and y origin and width and height
 * @constructor
 */
HT.Rectangle = function(x, y, width, height) {
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
};

/**
 * A Line is x and y start and x and y end
 * @constructor
 */
HT.Line = function(x1, y1, x2, y2) {
	this.X1 = x1;
	this.Y1 = y1;
	this.X2 = x2;
	this.Y2 = y2;
};

/**
 * A Hexagon is a 6 sided polygon, our hexes don't have to be symmetrical, i.e. ratio of width to height could be 4 to 3
 * @constructor
 */
HT.Hexagon = function(id, x, y, width, height, side) {
	this.Points = [];//Polygon Base
        this.dirty = false;
	var x1 = null;
	var y1 = null;
        
        width = width || HT.Hexagon.Static.WIDTH;
        height = height || HT.Hexagon.Static.HEIGHT;
        side = side || HT.Hexagon.Static.SIDE
        
	if(HT.Hexagon.Static.ORIENTATION == HT.Hexagon.Orientation.Normal) {
		x1 = (width - side)/2;
		y1 = (height / 2);
		this.Points.push(new HT.Point(x1 + x, y));
		this.Points.push(new HT.Point(x1 + side + x, y));
		this.Points.push(new HT.Point(width + x, y1 + y));
		this.Points.push(new HT.Point(x1 + side + x, height + y));
		this.Points.push(new HT.Point(x1 + x, height + y));
		this.Points.push(new HT.Point(x, y1 + y));
	}
	else {
		x1 = (width / 2);
		y1 = (height -side)/2;
		this.Points.push(new HT.Point(x1 + x, y));
		this.Points.push(new HT.Point(width + x, y1 + y));
		this.Points.push(new HT.Point(width + x, y1 + side + y));
		this.Points.push(new HT.Point(x1 + x, height + y));
		this.Points.push(new HT.Point(x, y1 + side + y));
		this.Points.push(new HT.Point(x, y1 + y));
	}
	
	this.Id = id;
        this.gang = 0;
        this.building= "-";
        
        this.attack = Math.floor(Math.random() * 10) + 1;
	
	this.x = x;
	this.y = y;
	this.x1 = x1;
	this.y1 = y1;
	
	this.TopLeftPoint = new HT.Point(this.x, this.y);
	this.BottomRightPoint = new HT.Point(this.x + width, this.y + height);
	this.MidPoint = new HT.Point(this.x + (width / 2), this.y + (height / 2));
	
	this.P1 = new HT.Point(x + x1, y + y1);
	
	this.selected = false;
        this.fontSize = 18;
};
	
/**
 * draws this Hexagon to the canvas
 * @this {HT.Hexagon}
 */
HT.Hexagon.prototype.draw = function(ctx, fillStyle, strokeStyle, showAttack) {
        ctx.save()
        ctx.strokeStyle = strokeStyle || "rgba(0, 0, 0, 0.1)";
        ctx.fillStyle = fillStyle || "rgba(255, 255, 255, 0)";
        this.selected = false;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(this.Points[0].X, this.Points[0].Y);
	for(var i = 1; i < this.Points.length; i++)
	{
            var p = this.Points[i];
            ctx.lineTo(p.X, p.Y);
	}
	ctx.closePath();
	ctx.stroke();
        ctx.fill();
        
	if(HT.Hexagon.Static.DEBUG){
		//draw text for debugging
		ctx.fillStyle = "black"
		ctx.font = "bolder 16pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText(this.Id === "-" ? "" : this.Id, this.MidPoint.X, this.MidPoint.Y);
	}
        if(showAttack && this.Id !== "-"){
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 1; 
            ctx.shadowOffsetY = 1; 
            ctx.fillStyle = "white";
            ctx.font = "bolder " + this.fontSize.toString() + "pt Agency FB, Impact MS,Tahoma,Verdana,Arial,sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            //var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
            ctx.shadowColor = "black";
            ctx.fillText(this.attack.toString(), this.MidPoint.X, this.MidPoint.Y);
            ctx.shadowBlur = 5;
            ctx.shadowColor = game.gangColor(this.gang, 1);
            ctx.fillText(this.attack.toString(), this.MidPoint.X, this.MidPoint.Y);
        }
	if(HT.Hexagon.Static.DRAWSTATS && this.PathCoOrdX !== null && this.PathCoOrdY !== null && typeof(this.PathCoOrdX) != "undefined" && typeof(this.PathCoOrdY) != "undefined")
	{
		//draw co-ordinates for debugging
		ctx.fillStyle = "black"
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText("("+this.PathCoOrdX+","+this.PathCoOrdY+")", this.MidPoint.X, this.MidPoint.Y + 10);
	}
	/*
	if(HT.Hexagon.Static.DRAWSTATS)
	{
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		//draw our x1, y1, and z
		ctx.beginPath();
		ctx.moveTo(this.P1.X, this.y);
		ctx.lineTo(this.P1.X, this.P1.Y);
		ctx.lineTo(this.x, this.P1.Y);
		ctx.closePath();
		ctx.stroke();
		
		ctx.fillStyle = "black"
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "left";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText("z", this.x + this.x1/2 - 8, this.y + this.y1/2);
		ctx.fillText("x", this.x + this.x1/2, this.P1.Y + 10);
		ctx.fillText("y", this.P1.X + 2, this.y + this.y1/2);
		ctx.fillText("z = " + HT.Hexagon.Static.SIDE, this.P1.X, this.P1.Y + this.y1 + 10);
		ctx.fillText("(" + this.x1.toFixed(2) + "," + this.y1.toFixed(2) + ")", this.P1.X, this.P1.Y + 10);
	}
    */
        ctx.restore();
};

HT.Hexagon.prototype.clear = function(ctx){
    //console.log("clear: ",this.PathCoOrdX, this.PathCoOrdY);
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.moveTo(this.Points[0].X, this.Points[0].Y)
    for(var i = 1; i < 6; i++){
        ctx.lineTo(this.Points[i].X, this.Points[i].Y)
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}

HT.Hexagon.prototype.redraw = function(ctx, fillStyle, strokeStyle, showAttack){
    this.clear(ctx);
    this.draw(ctx, fillStyle, strokeStyle, showAttack);
}

HT.Hexagon.prototype.drawBuilding = function(ctx){
    if(this.building !== "-" && game.buildings[this.building] !== undefined){
        ctx.save();
        ctx.shadowColor = game.gangColor(self.gang, 1);
        ctx.shadowBlur = 0;
        image = game.buildings[this.building];
        ctx.drawImage(image, this.TopLeftPoint.X, this.TopLeftPoint.Y - 20, 80, 80);
        ctx.restore();
        
    }
}

HT.Hexagon.prototype.clip = function(ctx){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.moveTo(this.Points[0].X, this.Points[0].Y)
    for(var i = 1; i < 6; i++){
        ctx.lineTo(this.Points[i].X, this.Points[i].Y)
    }
    ctx.closePath();
    ctx.clip();
    ctx.restore();
}

/**
 * Returns true if the x,y coordinates are inside this hexagon
 * @this {HT.Hexagon}
 * @return {boolean}
 */
HT.Hexagon.prototype.isInBounds = function(x, y) {
	return this.Contains(new HT.Point(x, y));
};
	

/**
 * Returns true if the point is inside this hexagon, it is a quick contains
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.isInHexBounds = function(/*Point*/ p) {
	if(this.TopLeftPoint.X < p.X && this.TopLeftPoint.Y < p.Y &&
	   p.X < this.BottomRightPoint.X && p.Y < this.BottomRightPoint.Y)
		return true;
	return false;
};

//grabbed from:
//http://www.developingfor.net/c-20/testing-to-see-if-a-point-is-within-a-polygon.html
//and
//http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html#The%20C%20Code
/**
 * Returns true if the point is inside this hexagon, it first uses the quick isInHexBounds contains, then check the boundaries
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.Contains = function(/*Point*/ p) {
	var isIn = false;
	if (this.isInHexBounds(p))
	{
		//turn our absolute point into a relative point for comparing with the polygon's points
		//var pRel = new HT.Point(p.X - this.x, p.Y - this.y);
		var i, j = 0;
		for (i = 0, j = this.Points.length - 1; i < this.Points.length; j = i++)
		{
			var iP = this.Points[i];
			var jP = this.Points[j];
			if (
				(
				 ((iP.Y <= p.Y) && (p.Y < jP.Y)) ||
				 ((jP.Y <= p.Y) && (p.Y < iP.Y))
				//((iP.Y > p.Y) != (jP.Y > p.Y))
				) &&
				(p.X < (jP.X - iP.X) * (p.Y - iP.Y) / (jP.Y - iP.Y) + iP.X)
			   )
			{
				isIn = !isIn;
			}
		}
	}
	return isIn;
};

/**
* Returns absolute distance in pixels from the mid point of this hex to the given point
* Provided by: Ian (Disqus user: boingy)
* @this {HT.Hexagon}
* @param {HT.Point} p the test point
* @return {number} the distance in pixels
*/
HT.Hexagon.prototype.distanceFromMidPoint = function(/*Point*/ p) {
	// Pythagoras' Theorem: Square of hypotenuse = sum of squares of other two sides
	var deltaX = this.MidPoint.X - p.X;
	var deltaY = this.MidPoint.Y - p.Y;

	// squaring so don't need to worry about square-rooting a negative number 
	return Math.sqrt( (deltaX * deltaX) + (deltaY * deltaY) );
};

HT.Hexagon.prototype.copy = function(scaleFactor){
    scaleFactor = scaleFactor || 1;
    var xOffset = (HT.Hexagon.Static.WIDTH - (HT.Hexagon.Static.WIDTH * scaleFactor)) / 2;
    var yOffset = (HT.Hexagon.Static.HEIGHT - (HT.Hexagon.Static.HEIGHT * scaleFactor)) / 2;
    var newHex = new HT.Hexagon("", 
                    this.x + xOffset, 
                    this.y + yOffset, 
                    HT.Hexagon.Static.WIDTH * scaleFactor, 
                    HT.Hexagon.Static.HEIGHT * scaleFactor, 
                    HT.Hexagon.Static.SIDE * scaleFactor);
    newHex.Id = this.Id;
    newHex.PathCoOrdX = this.PathCoOrdX;
    newHex.PathCoOrdY = this.PathCoOrdY;
    newHex.gang = this.gang;
    newHex.attack = this.attack;
    newHex.fontSize = this.fontSize; //Math.floor(this.fontSize * scaleFactor)
    return newHex;
}

HT.Hexagon.Orientation = {
	Normal: 0,
	Rotated: 1
};

HT.Hexagon.Static = {HEIGHT:91.14378277661477
					, WIDTH:91.14378277661477
					, SIDE:50.0
					, ORIENTATION:HT.Hexagon.Orientation.Normal
					, DRAWSTATS: false
                                        , DEBUG: false};//hexagons will have 25 unit sides for now

