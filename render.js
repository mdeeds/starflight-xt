var RenderCanvas = function(div_id, width, height, bg_color) {
	this.playfield = document.getElementById(div_id);
	this.svg_display = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	this.svg_display.setAttribute('width', width ? width : 800);
	this.svg_display.setAttribute('height', height ? height : 450);
	this.width = width;
	this.height = height;
	this.svg_display.style.background = bg_color ? bg_color : '#DDDDFF';
	this.playfield.appendChild(this.svg_display);
    this.look_at = new Vector2D();
    this.look_scale = 1.0;
    this.look_theta = 0.0;
    this.look_theta_degrees = 0.0;
}

RenderCanvas.prototype.LookAt = function(position, pixels_per_meter) {
	if (position) {
		this.look_at = position;
	}
	if (pixels_per_meter) {
		this.look_scale = pixels_per_meter;
	}
}

RenderCanvas.prototype.AngleAt = function(theta) {
	this.look_theta = theta;
	this.look_theta_degrees = theta * 180 / PI;
}

