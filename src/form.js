function divideTriangle( a, b, c, count, fn ){
  if ( count === 0 ) {
    fn( a, b, c );
  }
  else {
  
    //bisect the sides
    
    var ab = mix( a, b, 0.5 );
    var ac = mix( a, c, 0.5 );
    var bc = mix( b, c, 0.5 );

    --count;

    // three new triangles
    
    divideTriangle( a, ab, ac, count, fn);
    divideTriangle( c, ac, bc, count, fn);
    divideTriangle( b, bc, ab, count, fn);
    divideTriangle( ab, bc, ac, count, fn);
  }
}

var Cube = function(ColorIndex) {

	var vertex = [
	    [ -0.5, -0.5,  0.5, 1.0 ],
	    [ -0.5,  0.5,  0.5, 1.0 ],
	    [  0.5,  0.5,  0.5, 1.0 ],
	    [  0.5, -0.5,  0.5, 1.0 ],
	    [ -0.5, -0.5, -0.5, 1.0 ],
	    [ -0.5,  0.5, -0.5, 1.0 ],
	    [  0.5,  0.5, -0.5, 1.0 ],
	    [  0.5, -0.5, -0.5, 1.0 ]
	];

	var vertexColors = [
	    [ 0.0, 0.0, 0.0, 1.0 ],  // black
	    [ 1.0, 0.0, 0.0, 1.0 ],  // red
	    [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
	    [ 0.0, 1.0, 0.0, 1.0 ],  // green
	    [ 0.0, 0.0, 1.0, 1.0 ],  // blue
	    [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
	    [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
	    [ 1.0, 1.0, 1.0, 1.0 ],   // white
	    [ .72, .72, .72, 1.0 ],   // grey
	];

	var points = [];
	var colors = [];

	var lines_points = [];
	var lines_colors = [];

	var quad = function(a,b,c,d){
		var index = [ a, b, c, a, c, d ];
		lines_points.push(vertex[a]);
		lines_points.push(vertex[b]);
		lines_points.push(vertex[c]);
		lines_points.push(vertex[d]);
		lines_colors.push(vertexColors[8]);
		lines_colors.push(vertexColors[8]);
		lines_colors.push(vertexColors[8]);
		lines_colors.push(vertexColors[8]);

		for ( var i = 0; i < index.length; ++i ) {
			points.push(vertex[index[i]]);
			//colors.push(vertexColors[a]);
			colors.push(vertexColors[ColorIndex]);
		}
	}

	var create = function() {
		quad( 1, 0, 3, 2 );
		quad( 2, 3, 7, 6 );
		quad( 3, 0, 4, 7 );
		quad( 6, 5, 1, 2 );
		quad( 4, 5, 6, 7 );
		quad( 5, 4, 0, 1 );
	};

	create();

	return {
		points: points,
		colors: colors,
		line: {
			points: lines_points,
			colors: lines_colors
		}
	};
};

var Plane = function(a,b,c,d, iter){
	var that = this;

	this.originalPoints = [a,b,c,d];

	this.points = [];
	var fn = function(_a,_b,_c){
		that.points.push(_a,_b,_c);
	}
	divideTriangle(b,a,c,iter||0, fn);
	divideTriangle(d,a,c,iter||0, fn);
};

var LinesInfinities = function(){

	var points = [
		[-1.0,-1.0,1000.0,1.0],
		[-1.0,-1.0,-1000.0,1.0],
		
		[1.0,-1.0,1000.0,1.0],
		[1.0,-1.0,-1000.0,1.0],
	];

	var colors = [];
	
	colors.push([ 0.72, 0.72, 0.72, 1.0 ]); // light grey
	colors.push([ 0.72, 0.72, 0.72, 1.0 ]); // light grey
	colors.push([ 0.72, 0.72, 0.72, 1.0 ]); // light grey
	colors.push([ 0.72, 0.72, 0.72, 1.0 ]); // light grey
	
	return {
		points: points,
		colors: colors
	};
}