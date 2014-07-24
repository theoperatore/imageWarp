//
// Focuses on sampling 3 pixels
//
var canvas = document.createElement('canvas'),
    ctx    = canvas.getContext('2d');
document.body.appendChild(canvas);
 
var dest_src = "./images/american-gothic.png",
    palette_src = "./images/mona-lisa.png",
    anim, palette, dest,
    ITERATIONS = 8000,
    MATRIX = [0.2126, 0.7152, 0.0722];
 
(function init() {
	loadData(dest_src, function(error, d) {
		loadData(palette_src, function(error, p) {
			
			//correct the dimensions of the palette image data
			var cp = ctx.createImageData(d.width, d.height);
			cp.data.set(p.data);
			palette = cp;
			dest = d;
			canvas.width  = d.width;
			canvas.height = d.height;
			anim    = requestAnimationFrame(update);	
		});
	});
})();
 
function dist2( s, p2 ) {
	return Math.pow((p2[0]-s[0]),2)+Math.pow((p2[1]-s[1]),2)+Math.pow((p2[2]-s[2]),2);
}
 
function toHSL(r,g,b) {
	r /= 255;
	g /= 255;
	b /= 255;
 
	var max = Math.max(r,g,b);
	var min = Math.min(r,g,b);
	var h, s, l = (max + min) / 2;
 
	if (min === max) {
		h = s = 0;
	}
	else {
		var c = max - min;
		s = (l > 0.5) ? c / (2 - max - min) : c / (max + min);
		switch (max) {
			case r: h = (g - b) / c + (g < b) ? 6 : 0; break;
			case g: h = (b - r) / c + 2; break;
			case b: h = (r - g) / c + 4; break;
		}
		h /= 6;
	}
 
	return [h, s, l];
}
 
function loadData(path, callback) {
	var img = new Image();
	img.addEventListener('load', function(ev) {
		canvas.width  = this.width;
		canvas.height = this.height;
		document.body.appendChild(this);
		ctx.drawImage(this, 0, 0);
		callback(null, ctx.getImageData(0,0,canvas.width,canvas.height));
	});
	img.src = path;
}
 
function update() {
	anim = requestAnimationFrame(update);
	
	for (var i = 0; i < ITERATIONS; i++) {
 
		var p1 = Math.floor( Math.random() * ((palette.data.length / 4) - 1) );
		var p2 = Math.floor( Math.random() * ((palette.data.length / 4) - 1) );
 
		//RGB Checking
		//var checkR1 = Math.abs(dest.data[4*p1+0] - palette.data[4*p1+0]);
		//var checkR2 = Math.abs(dest.data[4*p1+0] - palette.data[4*p2+0]);
		//var checkG1 = Math.abs(dest.data[4*p1+1] - palette.data[4*p1+1]);
		//var checkG2 = Math.abs(dest.data[4*p1+1] - palette.data[4*p2+1]);
		//var checkB1 = Math.abs(dest.data[4*p1+2] - palette.data[4*p1+2]);
		//var checkB2 = Math.abs(dest.data[4*p1+2] - palette.data[4*p2+2]);
 
		//Luminance Checking
		//var p1Y = MATRIX[0]*palette.data[4*p1+0]+MATRIX[1]*palette.data[4*p1+1]+MATRIX[2]*palette.data[4*p1+2];
		//var p2Y = MATRIX[0]*palette.data[4*p2+0]+MATRIX[1]*palette.data[4*p2+1]+MATRIX[2]*palette.data[4*p2+2];
		//var sY  = MATRIX[0]*dest.data[4*p1+0]+MATRIX[1]*dest.data[4*p1+1]+MATRIX[2]*dest.data[4*p1+2];
		//var checkY1 = Math.abs(sY - p1Y);
		//var checkY2 = Math.abs(sY - p2Y);
 
		//HSL Distance
		var hslP1 = toHSL( palette.data[4*p1+0], palette.data[4*p1+1], palette.data[4*p1+2] );
		var hslP2 = toHSL( palette.data[4*p2+0], palette.data[4*p2+1], palette.data[4*p2+2] );
		var hslS  = toHSL( dest.data[4*p1+0], dest.data[4*p1+1], dest.data[4*p1+2] );
		var distSP1 = dist2( hslS, hslP1 );
		var distSP2 = dist2( hslS, hslP2 );
 
		//RGB check
		//if ( (checkR1 > checkR2) && (checkG1 > checkG2) && (checkB1 > checkB2) ) {
 
		//Luminance Check
		//if (checkY1 > checkY2) {
 
		//HSL Distance Check
		if (distSP1 > distSP2) {
 
			var r = palette.data[4*p1+0];
			var g = palette.data[4*p1+1];
			var b = palette.data[4*p1+2];
			var a = palette.data[4*p1+3];
 
			palette.data[4*p1+0] = palette.data[4*p2+0];
			palette.data[4*p1+1] = palette.data[4*p2+1];
			palette.data[4*p1+2] = palette.data[4*p2+2];
			palette.data[4*p1+3] = palette.data[4*p2+3];
 
			palette.data[4*p2+0] = r;
			palette.data[4*p2+1] = g;
			palette.data[4*p2+2] = b;
			palette.data[4*p2+3] = a;
		}
	}
	
	ctx.putImageData(palette, 0, 0);	
}