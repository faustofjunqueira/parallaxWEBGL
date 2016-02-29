var TextureFactory = function(gl, program){
  this.gl = gl;
  this.program = program;
}

TextureFactory.prototype.create = function (path, varName, index) {
  var that = this;
  var texture = that.gl.createTexture();
  texture.image = new Image();
  texture.image.src = path;
  texture.image.onload = function() {
    that.handleLoadedTexture(texture);
  };

  texture.setUniform = function(){
    that.gl.uniform1i(that.gl.getUniformLocation(that.program, varName), index);
  };

  texture.onLoop = function(){
    that.gl.bindTexture(that.gl.TEXTURE_2D, texture);
  };
  
  return texture;
};

TextureFactory.prototype.handleLoadedTexture = function (texture) {
  this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
  //this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, texture.image);
  this.gl.generateMipmap(this.gl.TEXTURE_2D);
  // Parameters
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
  this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};






//  var texturesConfig = {
//    diffuse: {
//      url: 'img/diffuse.jpg',
//      varName: 'diffuseMap'
//    },
//    normal: {
//      url: 'img/normal.jpg',
//      varName: 'normalMap'
//    },
//    depth: {
//      url: 'img/depth.jpg',
//      varName: 'depthMap'
//    }
//  };
//
//  textures = {
//    diffuseMap: null,
//    normalMap: null,
//    depthMap: null
//  };