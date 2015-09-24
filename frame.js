// supplies: RotatingFrame
// requires: 
//   Attitude
//   *Object

var RotatingFrame = function(parent_frame, relative_attitude) {
	this._parent = parent_frame;
	if (parent_frame) {
		parent_frame.AddChild(this);
	}
	// Location of center of this frame from the center of the parent.
	// All objects contained in this frame have positions relative to this frame's center.
	if (relative_attitude) {
		this.attitude = relative_attitude;
	} else {
		this.attitude = new Attitude();
	}
	this.children = [];
	this.solid_objects = [];
	this.svg_objects = [];
	this._time = 0.0;
}

RotatingFrame.prototype.AddChild = function(child_frame) {
	this.children.push(child_frame);
}

RotatingFrame.prototype.GetParent = function() {
	return this._parent;
}

RotatingFrame.prototype.ForEachChild = function(f, recursive) {
	for (var i = 0; i < children.length; ++i)
	{
		f(children[i]);
		if (recursive) {
			children[i].ForEachChild(f);
		}
	}
}

RotatingFrame.prototype.AddSolidObject = function(solid_object) {
	this.solid_objects.push(solid_object);
}

RotatingFrame.prototype.RemoveRotation = function(attitude) {
	
}

G = 6.67384e-11;

RotatingFrame.prototype.TransformToParent = function(attitude) {
    attitude.x.Rotate(this.attitude.theta);
	attitude.x.Add(this.attitude.x);
    attitude.a.Rotate(this.attitude.theta);
	attitude.theta += this.attitude.theta;
}

RotatingFrame.prototype.ApplyGravity = function(attitude) {
	for (var i=0; i < this.solid_objects.length; ++i) {
		var solid_object = this.solid_objects[i];
		Log("Mass: " + solid_object.mass);
		var mu = G * solid_object.mass;
		var direction = Vector2D.Difference(solid_object.attitude.x, attitude.x);
		var r = direction.Length();
		Log("Radius: " + r);
		direction.Scale(mu / r / r / r);
		attitude.a.Add(direction);
	}
	// TODO: Child frames
	
	if (this._parent) {
		Log("Position: " + attitude.x);
		Log("Acceleration: " + attitude.a);

	    var oldX = new Vector2D(attitude.x);
		var oldT = attitude.theta;
        this.TransformToParent(attitude);
	    this._parent.ApplyGravity(attitude);
	    attitude.x = oldX;
		attitude.theta = oldT;
		attitude.a.Rotate(-this.attitude.theta);
	}
}

RotatingFrame.prototype.ApplyCentrifugal = function(attitude) {
	var direction = new Vector2D(attitude.x);
	var r = direction.Length();
	if (r > 0) {
		var velocity = r * Math.abs(this.attitude.omega);
		direction.Scale(velocity * velocity / r / r);
		attitude.a.Add(direction);
	}
	// TODO: Child frames
	
	if (this._parent) {
		Log("Position: " + attitude.x);
		Log("Acceleration: " + attitude.a);

	    var oldX = new Vector2D(attitude.x);
		var oldT = attitude.theta;
        this.TransformToParent(attitude);
	    this._parent.ApplyCentrifugal(attitude);
	    attitude.x = oldX;
		attitude.theta = oldT;
		attitude.a.Rotate(-this.attitude.theta);
	}
	
}

// Returns a function which takes a SolidObject in this frame and returns 
// 
RotatingFrame.prototype.UndoFrame = function() {
	
}



