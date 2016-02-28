var Program = function (){
  var gl = null;
  var Prog = null;
  var pespective = new Pespective();
  var modelview = new ModelView();
  var view = View('gl-canvas');
  
  var vPositionVarShaderName = "vPosition";
  var uModelViewShaderName = "modelview";
  var uPespectiveShaderName = "pespective";
  var vColorVarShaderName = "vColor";
  var uTransfomationVarShaderName = "transformations";

  var keypressDirection = 1;

  //var robot = new Robot();

  var initializeWebgl = function(canvas){
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { 
      var msg = "WebGL isn't available";
      alert( msg );
      throw msg;
    }
  };

  var init = function(){
    initializeWebgl(view.canvas);
    configureWebGl();
    Prog = createProgram();
    update();


    document.onkeyup = function(e){
      switch(e.keyCode){
        case 16: keypressDirection = 1;break; // shift key press
      }
    };

    document.onkeydown = function(e){

      switch(e.keyCode){
        // toggle 
        case 16: keypressDirection = -1;break; // shift key press
        //camera
        case 'W'.charCodeAt(0): modelview.eye[2]++; break;
        case 'S'.charCodeAt(0): modelview.eye[2]--; break;
        case 'D'.charCodeAt(0): modelview.eye[0]++; break;
        case 'A'.charCodeAt(0): modelview.eye[0]--; break;
        case 'E'.charCodeAt(0): modelview.eye[1]++; break;
        case 'Q'.charCodeAt(0): modelview.eye[1]--; break;
      }
    };
  };

  var configureWebGl = function(){
    gl.viewport( 0, 0, view.canvas.width, view.canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
  };

  var createProgram = function(){
    var p = initShaders( gl, view.shader.vertex, view.shader.fragment);
      gl.useProgram( p );
      return p;
  };

  var activePoints = function(points, program) {
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, vPositionVarShaderName );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
  };

  var activeColor = function(colors, program) {
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, vColorVarShaderName );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
  };

  var activeModelView = function(matrix, program){
    var matrixLoc = gl.getUniformLocation(program, uModelViewShaderName);
    gl.uniformMatrix4fv(matrixLoc,false,flatten(matrix));
  }

  var activePespective = function(matrix ,program){
    var matrixLoc = gl.getUniformLocation(program, uPespectiveShaderName);
    gl.uniformMatrix4fv(matrixLoc,false,flatten(matrix));
  }

  var activeTransformation = function(matrix, program){
    var matrixLoc = gl.getUniformLocation(program, uTransfomationVarShaderName);
    gl.uniformMatrix4fv(matrixLoc,false,flatten(matrix));
  };

  var setVariables = function(points, colors, projection) {
    activeColor(colors, Prog);
    activePoints(points, Prog);
    activeTransformation(projection, Prog);
  };

  var drawLinesInfinities = function(){
    setVariables(lines_inf.points,lines_inf.colors, mat4());
    gl.drawArrays( gl.LINES, 0, lines_inf.points.length);    
  }

  var drawCube = function(cube, transformation){
    setVariables(cube.points,cube.colors, transformation);
    gl.drawArrays( gl.TRIANGLES, 0, cube.points.length);

    setVariables(cube.line.points,cube.line.colors, transformation);
    gl.drawArrays( gl.LINES, 0, cube.line.points.length);

  }

  var performPlane = function(){
    //AQUI SERÁ CRIADO O PLANO
    //drawCube(robot.chest.cube, robot.chest.transformation);    
  };

  var performPespectiveEModelView = function(){
    if(true){
      activeModelView(modelview.ModelView(), Prog);
      activePespective(pespective.pespective(), Prog);
    } else {
      activeModelView(mat4(), Prog);
      activePespective(mat4(), Prog);
    }
  }

  var update = function(){
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    performPespectiveEModelView();
    performPlane();
      
    requestAnimFrame( update );
  };

  init();
};

window.onload = function init(){
  Program();
};
