var RenderCanvas = function(div_id, width, height, bg_color) {
	this.playfield = document.getElementById(div_id);
	this.svg_display = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	this.width = width ? width : 800;
	this.height = height ? height : 450
	this.svg_display.setAttribute('width', this.width);
	this.svg_display.setAttribute('height', this.height);
	this.screen_middle = new Vector2D(this.width / 2, this.height / 2);
	this.svg_display.style.background = bg_color ? bg_color : '#DDDDFF';
	this.playfield.appendChild(this.svg_display);
	
    this.look_at = new Vector2D();
    this.pixels_per_meter = 1.0;
    this.look_theta = 0.0;
    this.look_theta_degrees = 0.0;
	this.pixels_per_meter = 1.0;

	this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var m = this.GetTransform();
    var t = this.svg_display.createSVGTransformFromMatrix(m);
    this.g.transform.baseVal.appendItem(t);
	this.svg_display.appendChild(this.g);
	this.playfield.onwheel = 
	  function(self) { return function(e) { return self.OnWheel(e); } }(this);
}

RenderCanvas.prototype.GetSvg = function() {
	return this.svg_display;
}

RenderCanvas.prototype.GetTransform = function() {
	var matrix = this.svg_display.createSVGMatrix();
	matrix = matrix.translate(this.width / 2,this.height / 2) 
	matrix = matrix.scale(this.pixels_per_meter) 
	matrix = matrix.rotate(this.look_theta_degrees)
	matrix = matrix.translate(this.look_at.x, this.look_at.y)
	return matrix;
	
	//return 'translate(' + (this.width / 2) + ', '+ (this.height / 2) +') ' 
	//    + 'scale(' + this.pixels_per_meter + ') '
	//	+ 'rotate(' + this.look_theta_degrees + ')'
	//    + 'translate(' + (this.look_at.x) + ', ' + (this.look_at.y) + ') '
}

RenderCanvas.prototype.LookAt = function(position, pixels_per_meter) {
	if (position) {
		this.look_at.x = -position.x;
		this.look_at.y = position.y;
	}
	if (pixels_per_meter) {
		this.pixels_per_meter = pixels_per_meter;
	}
  console.log("Set look_at: " + this.look_at);  
}

RenderCanvas.prototype.AngleAt = function(theta) {
	this.look_theta = theta;
	this.look_theta_degrees = theta * 180 / PI;
}

RenderCanvas.prototype.OnWheel = function(e) {
  // z_f = z * (x + d) = z * z' (x + d')
  // d' = z [(1-z')x+d] / z'
  // z ::= pixels_per_meter
  // z' ::= scale factor e.g 2.0
  // x ::= mouse position in world space
  // x_c / z - d = x
  // x_c ::= screen coordinates
	
  var zoom_factor = Math.pow(2, -e.deltaY / 100);
  var new_zoom = zoom_factor * this.pixels_per_meter;
  
  var screen_pos = new Vector2D(
      e.x - this.svg_display.offsetLeft,
      e.y - this.svg_display.offsetTop);
	  
  var world_pos = screen_pos.Clone();
  world_pos.Subtract(this.screen_middle);
  world_pos.Scale(1.0 / this.pixels_per_meter);
  world_pos.Rotate(-this.look_theta);
  world_pos.Subtract(this.look_at);

  var new_look_at = world_pos.Clone();
  new_look_at.Add(this.look_at);
  new_look_at.Rotate(this.look_theta);
  new_look_at.Scale(1.0 / zoom_factor);
  new_look_at.Rotate(-this.look_theta);
  new_look_at.Subtract(world_pos);
 
  console.log("New look_at: " + new_look_at);
  this.look_at.x = new_look_at.x;
  this.look_at.y = new_look_at.y;
  
  this.pixels_per_meter = new_zoom;
  //this.g.setAttribute('transform', this.GetTransform())
  var m = this.GetTransform();
  var t = this.svg_display.createSVGTransformFromMatrix(m);
  this.g.transform.baseVal.clear();
  this.g.transform.baseVal.appendItem(t);
  return false;
}


