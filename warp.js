var canvas = document.createElement('canvas'),
	ctx    = canvas.getContext('2d');
document.body.appendChild(canvas);

var dest_src = "./images/american-gothic.png",
	palette_src = "./images/mona-lisa.png",
	anim, palette, dest,
	ITERATIONS = 1200;

(function init() {
	loadData(dest_src, function(d_error, d) {
		loadData(palette_src, function(p_error, p) {

			//correct the dimensions of the palette image data
			var cp = ctx.createImageData(d.width, d.height);
			cp.data.set(p.data);
			palette = cp;
			dest = d;
			canvas.width  = d.width;
			canvas.height = d.height;
			anim = requestAnimationFrame(update);
		});
	});
})();

function loadData(path, callback) {
	var img = new Image();
	img.addEventListener('load', function(ev) {
		canvas.width  = this.width;
		canvas.height = this.height;
		ctx.drawImage(this, 0, 0);
		callback(null, ctx.getImageData(0,0,canvas.width,canvas.height));
	});
	img.src = path;
}

function dist2( r1,g1,b1, r2,g2,b2) {
	return Math.pow(r2-r1,2)+Math.pow(g2-g1,2)+Math.pow(b2-b1,2);
}

function update() {
	anim = requestAnimationFrame(update);
	
	for (var i = 0; i < ITERATIONS; i++) {

		var p1 = Math.floor( Math.random() * ((palette.data.length / 4) - 1) );
		var p2 = Math.floor( Math.random() * ((palette.data.length / 4) - 1) );		

		//dist
		var distS1P1 = dist2( dest.data[4*p1+0],dest.data[4*p1+1],dest.data[4*p1+2],palette.data[4*p1+0],palette.data[4*p1+1],palette.data[4*p1+2] );
		var distS1P2 = dist2( dest.data[4*p1+0],dest.data[4*p1+1],dest.data[4*p1+2],palette.data[4*p2+0],palette.data[4*p2+1],palette.data[4*p2+2] );
		var distS2P1 = dist2( dest.data[4*p2+0],dest.data[4*p2+1],dest.data[4*p2+2],palette.data[4*p1+0],palette.data[4*p1+1],palette.data[4*p1+2] );
		var distS2P2 = dist2( dest.data[4*p2+0],dest.data[4*p2+1],dest.data[4*p2+2],palette.data[4*p2+0],palette.data[4*p2+1],palette.data[4*p2+2] );

		if ( (distS1P2 + distS2P1) < (distS1P1 + distS2P2) ) {

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