var View = function(canvasId){
  return {
    canvas: document.getElementById( canvasId ),
    shader: {
      vertex: 'vertex-shader',
      fragment: 'fragment-shader'
    }
  };
}