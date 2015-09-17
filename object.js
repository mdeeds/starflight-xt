// requires:
//   Vector2D
// suplies:
//   SolidObject
//   MassiveObject

var SolidObject = function() {
	this.attitude = new Attitude();
	this.mass = 0.0;
	this.inertia = 0.0;
	
	this.fixed = false;
	this.radius = false;
	this.color = '#FFDD88';
	
	if (arguments.length >= 3) {
		this.attitude.x = arguments[0];
		this.mass = arguments[1];
		this.radius = arguments[2];
		this.length = arguments[3] ? arguments[3] : (2.0 * arguments[2]);
		// Assume a solid cylinder of uniform density.
		// http://hyperphysics.phy-astr.gsu.edu/hbase/isph.html
		// Sphere:
		// this.inertia = 2.0 * this.mass * this.radius * this.radius / 5.0;
		// Cylinder
		// http://hyperphysics.phy-astr.gsu.edu/hbase/icyl.html#icyl
		this.inertia = this.mass * this.radius * this.radius / 4.0 +
			this.mass * this.length * this.length / 12.0;
	}
}

SolidObject.prototype.SetColor = function(color) {
	this.color = color;
}

SolidObject.FromMetadata = function(metadata, element) {
	var self = new SolidObject(
	    new Vector2D(),
	    metadata.empty_mass + metadata.fuel_mass,
	    metadata.radius,
		metadata.length);
	return self;
}

SolidObject.prototype.resetAcc = function() {
	this.attitude.a.x = 0.0;
	this.attitude.a.y = 0.0;
	this.attitude.tau = 0.0;
}

SolidObject.prototype.toString = function() {
	return JSON.stringify(this);
}
