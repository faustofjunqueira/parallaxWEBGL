var Arm = function(){
  this.transformation = null;
  this.angle = 0;
  this.cube = Cube(6);
  this.calculateTransformation = function(stack,orientation){
    stack.push(translate(0,-.4,0));
    stack.push(rotate(this.angle,[1,0,0]));
    stack.push(translate(0,-.35,0));
    stack.push(scale(0.2,.75,.2));

    this.transformation = stack.calculate();
    
    stack.pop();
    stack.pop();
    stack.pop();
    stack.pop();
    return stack;
  };
};

var Shoulder = function(){
  this.transformation = null;
  this.angle = 0;
  this.cube = Cube(5);
  this.arm = new Arm();
  this.calculateTransformation = function(stack, orientation){
    stack.push(translate(orientation*.6,.3,0));
    stack.push(rotate(this.angle,[1,0,0]));
    stack.push(translate(0,-.3,0));

    this.arm.calculateTransformation(stack,orientation);
    stack.push(scale(0.2,.75,.2));
    this.transformation = stack.calculate();
    
    stack.pop();
    stack.pop();
    stack.pop();
    stack.pop();
    return stack;
  };
};

var Feet = function(){
  this.transformation = null;
  this.angle = 0;
  this.cube = Cube(4);
  this.calculateTransformation = function(stack){
    stack.push(scale(0.5,0.1,0.5));
    stack.push(translate(0,-5,0.3));

    this.transformation = stack.calculate();

    stack.pop();
    stack.pop();

    return stack;
  };
};

var Leg = function(){
  this.transformation = null;
  this.angle = 0;
  this.cube = Cube(3);
  this.feet = new Feet();
  this.calculateTransformation = function(stack){
    stack.push(rotate(this.angle,[0,1,0]));
    stack.push(translate(0,-1,0));

    this.feet.calculateTransformation(stack);
    stack.push(scale(0.1,1,0.1));
    this.transformation = stack.calculate();

    stack.pop();
    stack.pop();
    stack.pop();
    return stack;
  };
};

var Head = function(){
  this.transformation = null;
  this.angle = 0;
  this.cube = Cube(2);
  this.calculateTransformation = function(stack){
    stack.push(scale(0.5,0.5,0.5));
    stack.push(translate(0,1.5,0));
    stack.push(rotate(this.angle,[0,1,0]));

    this.transformation = stack.calculate();
    
    stack.pop();
    stack.pop();
    stack.pop();
    return stack;
  };
};

var Chest = function(){
  this.transformation = null;
  this.angle = 0;
  this.cube = Cube(1); //red
  this.head = new Head();
  this.leftShoulder = new Shoulder();
  this.rightShoulder = new Shoulder();
  this.leg = new Leg();

  this.calculateTransformation = function(stack){
    this.leg.calculateTransformation(stack);
    stack.push(rotate(this.angle,[0,1,0]));

    this.head.calculateTransformation(stack);
    this.leftShoulder.calculateTransformation(stack,1);
    this.rightShoulder.calculateTransformation(stack,-1);

    stack.push(scale(1,1,0.3));
    this.transformation = stack.calculate();
    stack.pop();
    
    stack.pop();
    return stack;
  };
};

var Robot = function(){
  this.chest = new Chest();
  this.calculateTransformation = function(stack){
    this.chest.calculateTransformation(stack);
    return stack;
  };
};
