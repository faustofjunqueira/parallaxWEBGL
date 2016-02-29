var Program = function (){
  gl = null;
  var Prog = null;
  var pespective = new Pespective();
  var modelview = new ModelView();
  var view = View('gl-canvas');
  var uModelViewShaderName = "modelview";
  var uViewPosShaderName = "modelviewpos"
  var uPespectiveShaderName = "pespective";
  var positionVarName = "position";
  var normalVarName = "normal";
  var texCoordsVarName = "texCoords";
  var tangentVarName = "tangent";
  var bitangentVarName = "bitangent";
  var lightPosVarName = "lightPos";
  var lightPos = vec3(.5, 1.0, .3);

  var heightScale = .1;
  var heightVarName = "height_scale";

  var parallaxMapping = true;
  var parallaxMappingVarName = "parallax";

  var plane = [
      [-.5,  .5, 0.0, 1.0],
      [-.5, -.5, 0.0, 1.0],
      [ .5, -.5, 0.0, 1.0],
      [ .5,  .5, 0.0, 1.0],
    ];

  var keypressDirection = 1;

  var texturesConfig = {
    diffuse: {
      url: 'img/diffuse.jpg',
      varName: 'diffuseMap'
    },
    normal: {
      url: 'img/normal.jpg',
      varName: 'normalMap'
    },
    depth: {
      url: 'img/depth.jpg',
      varName: 'depthMap'
    }
  };
  var textures = {
    diffuseMap: null,
    normalMap: null,
    depthMap: null
  };

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
    createTexture();

    update();


    document.onkeyup = function(e){
      switch(e.keyCode){
        case 16: keypressDirection = 1;break; // shift key press
      }
    };

    document.onkeydown = function(e){

      switch(e.keyCode){
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
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
  };

  var createProgram = function(){
    var p = initShaders( gl, view.shader.vertex, view.shader.fragment);
      gl.useProgram( p );
      return p;
  };

  var createTexture = function(){
    var texturesFactory = new TextureFactory(gl,Prog);
    textures.diffuseMap = texturesFactory.create(texturesConfig.diffuse.url, texturesConfig.diffuse.varName, 0);
    textures.normalMap = texturesFactory.create(texturesConfig.normal.url, texturesConfig.normal.varName, 0);
    textures.depthMap = texturesFactory.create(texturesConfig.depth.url, texturesConfig.depth.varName, 0);
    textures.diffuseMap.setUniform();
    textures.normalMap.setUniform();
    textures.depthMap.setUniform();
  };

  var activePoints = function(points, program) {
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, vPositionVarShaderName );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
  };

  var activeAttr = function(vector, size, varName, program){
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vector), gl.STATIC_DRAW );
    var location = gl.getAttribLocation( program, varName );
    gl.vertexAttribPointer( location, size, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( location );
  };

  var activeModelView = function(matrix, program){
    var matrixLoc = gl.getUniformLocation(program, uModelViewShaderName);
    gl.uniformMatrix4fv(matrixLoc,false,flatten(matrix));
  }

  var activePespective = function(matrix ,program){
    var matrixLoc = gl.getUniformLocation(program, uPespectiveShaderName);
    gl.uniformMatrix4fv(matrixLoc,false,flatten(matrix));
  }

  var activeUniformValues = function(){
    gl.uniform3fv(gl.getUniformLocation(Prog, lightPosVarName), flatten(lightPos));
    gl.uniform1f(gl.getUniformLocation(Prog, heightVarName), heightScale);
  };

  var performPespectiveEModelView = function(){
    activeModelView(modelview.ModelView(), Prog);
    activePespective(pespective.pespective(), Prog);
    gl.uniform3fv(gl.getUniformLocation(Prog, uViewPosShaderName), flatten(modelview.eye));
  }

  var performTexture = function(){
    textures.diffuseMap.onLoop();
    textures.normalMap.onLoop();
    textures.depthMap.onLoop();
  };

  var performNinjaPlane = function(){
    // init var
    var pos1,pos2,pos3,pos4,uv1,uv2,uv3,uv4,nm;
    var tangent1 = vec3(), bitangent1 = vec3(), tangent2 = vec3(), bitangent2 = vec3();

    pos1 = plane[0], pos2 = plane[1], pos3 = plane[2], pos4 = plane[3];
    // texture coordinates
    uv1 = vec2(0.0, 1.0), uv2 = vec2(0.0, 0.0), uv3 = vec2(1.0, 0.0), uv4 = vec2(1.0, 1.0);
    //normal
    nm = vec3(0.0, 0.0, 1.0);

    // - triangle 1
    var edge1 = subtract(pos2,pos1);
    var edge2 = subtract(pos3,pos1);
    var deltaUV1 = subtract(uv2,uv1);
    var deltaUV2 = subtract(uv3,uv1);

    var f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

    tangent1[0] = f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
    tangent1[1] = f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
    tangent1[2] = f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);
    tangent1 = normalize(tangent1);

    bitangent1[0] = f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]);
    bitangent1[1] = f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]);
    bitangent1[2] = f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2]);
    bitangent1 = normalize(bitangent1);

    // - triangle 2
    edge1 = subtract(pos3,pos1);
    edge2 = subtract(pos4,pos1);
    deltaUV1 = subtract(uv3,uv1);
    deltaUV2 = subtract(uv4,uv1);

    f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

    tangent2[0] = f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
    tangent2[1] = f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
    tangent2[2] = f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);
    tangent2 = normalize(tangent2);


    bitangent2[0] = f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]);
    bitangent2[1] = f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]);
    bitangent2[2] = f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2]);
    bitangent2 = normalize(bitangent2);

    activeAttr([pos1,pos2,pos3,pos1,pos3,pos4], 4, positionVarName, Prog);
    //activeAttr([nm,nm,nm,nm,nm,nm], 3, normalVarName, Prog);
    //activeAttr([uv1,uv2,uv3,uv1,uv3,uv4], 2, texCoordsVarName, Prog);
    //activeAttr([tangent1,tangent1,tangent1,tangent2,tangent2,tangent2], 3, tangentVarName, Prog);
    //activeAttr([bitangent1,bitangent1,bitangent1,bitangent2,bitangent2,bitangent2], 3, bitangentVarName, Prog);
  }

  var update = function(){
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    activeUniformValues();
    performPespectiveEModelView();
    performTexture();
    performNinjaPlane();
      
    requestAnimFrame( update );
  };

  init();
};

window.onload = function init(){
  Program();
};
