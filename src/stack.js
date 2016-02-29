
var MatrixStack = function(){
	this.stack = [];

	this.push = function(m){
		if(m)
			this.stack.push(m);
		else{
			if(!this.isEmpty()){
				this.stack.push(this.top());
			}
		}
	};

	this.isEmpty = function(){
		return this.stack.length == 0;
	};

	this.top = function(){
		if(this.isEmpty()) return this.stack[this.stack.length -1];
		else throw "Empty Stack";
	};

	this.pop = function(){
		if(!this.isEmpty()) return this.stack.pop();
		else throw "Empty Stack";
	};

	this.calculate = function(){
		var u = mat4();
		var v = null;
		var i = 0;
		while( !!(v = this.stack[i++]) ){
			u = mult(u,v);
		}
		return u;
	};
};