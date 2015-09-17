var Attitude = function() {
	if (arguments.length == 0) {
	  this.x = new Vector2D();
	  this.v = new Vector2D();
	  this.a = new Vector2D();
	  this.theta = 0.0;
	  this.omega = 0.0;
	  this.tau = 0.0;
	} else if (arguments.length == 1) {
		throw "Invalid arguments";
	} else if (arguments.length >= 2) {
		this.x = arguments[0];
		this.v = new Vector2D();
		this.theta = 0.0;
		this.omega = arguments[1];
	} 
	if (arguments.length >= 3) {
		this.theta = arguments[2];
	}
}

Attitude.prototype.Clone = function() {
	var result = new Attitude();
    result.x = new Vector2D(this.x);
	result.v = new Vector2D(this.v);
	result.theta = this.theta;
	result.omega = this.omega;
	return result;
}

Attitude.prototype.toString = function() {
	return JSON.stringify(this);
}

