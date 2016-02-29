/*

perspectiveMatrix * modelViewMatrix *
*/

var Pespective = function(){
	this.aspect = 1;
	this.fov = 45;
	this.near = 1;
	this.far = 500;

	this.pespective = function(){
		return perspective(this.fov, this.aspect, this.near, this.far);
	}
}

var ModelView = function(){

	this.eye = new vec3(0, 0, -2);
	this.at = new vec3(0, 0, 0);
	this.up = new vec3(0, 1, 0);
	this.ModelView = function(){
		return lookAt(this.eye, this.at, this.up);
	};
}