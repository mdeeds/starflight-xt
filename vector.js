// Vector2D
// RotatingFrame

var Vector2D = function() {
  if (arguments.length == 0) {
	this.x = 0.0;
	this.y = 0.0;
  } else if (arguments.length == 1) {
	var that = arguments[0];
	this.x = that.x;
	this.y = that.y;
  } else if (arguments.length == 2) {
	  this.x = 1.0 * arguments[0];
	  this.y = 1.0 * arguments[1];
  }
}

Vector2D.Cross = function(a, b) {
	return (a.x * b.y) - (a.y * b.x);
}

Vector2D.prototype.Scale = function(factor) {
	this.x *= factor;
	this.y *= factor;
}

Vector2D.prototype.Rotate = function(theta) {
	var cost = Math.cos(theta);
	var sint = Math.sin(theta);
	var newx = cost * this.x - sint * this.y;
	this.y = sint * this.x + cost * this.y;
	this.x = newx;
}

Vector2D.prototype.Clone = function() {
	var that = new Vector2D(this);
	return that;
}

Vector2D.prototype.Add = function(that) {
	this.x = this.x + that.x;
	this.y = this.y + that.y;
}

Vector2D.prototype.Subtract = function(that) {
	this.x = this.x - that.x;
	this.y = this.y - that.y;
}

Vector2D.prototype.CopyFrom = function(other) {
	this.x = other.x;
	this.y = other.y;
}

Vector2D.prototype.toString = function() {
	return "(" + this.x + ", " + this.y + ")";
}

Vector2D.prototype.Length = function() {
  //TODO: Check for overflow.
  x2 = this.x * this.x;
  y2 = this.y * this.y;
  return Math.sqrt(x2 + y2);  
}

Vector2D.Difference = function(vector_a, vector_b) {
	return new Vector2D(vector_a.x - vector_b.x, vector_a.y - vector_b.y);
}

// [a c e]   [x]   
// [b d f] * [y] = [ax + cy + e, bx + dy + f, 1]
// [0 0 1]   [1]

Vector2D.MatrixMultiply = function(m, v) {
  var x = m.a * v.x + m.c * v.y + m.e;
  var y = m.b * v.x + m.d * v.y + m.f;
  return new Vector2D(x,y);
} 

Vector2D.MatrixMultiplyArray = function(m, a) {
  var result = [];
  for (var i = 0; i < a.length; ++i) {
    result = result.concat(Vector2D.MatrixMultiply(m, a[i]));
  }
  return result;
}
