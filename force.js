
// If 'magnitude' is specified, direction is normalized and magnitude is used as the length.
// If 'magnitude' is not specified, the length of 'direction' is the magnitude of the force.
var Force = function(location, direction, magnitude) {
	this.direction = direction.Clone();
	if (magnitude) {
		this.direction.Scale(magnitude / this.direction.Length());
	}
	this.location = location.Clone();
}

Force.prototype.Apply = function(object) {
	var r = Vector2D.Difference(this.location, object.attitude.x);
	var tau = Vector2D.Cross(r, this.direction) / object.inertia;
	object.attitude.tau += tau;
	
	var acc = new Vector2D(this.direction);
	acc.Scale(1.0 / object.mass);
	object.attitude.a.Add(acc);
}

Force.prototype.toString = function() {
	return JSON.stringify(this);
}